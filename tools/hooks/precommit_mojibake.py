#!/usr/bin/env python3
"""
Pre-commit mojibake guard for NEUROVA.
- Blocks commits containing common Turkish encoding artefacts (mojibake).
- Verifies staged text files are UTF-8 decodable.
- Does not modify files; fails fast with a summary.
"""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path
from typing import List, Set

ROOT = Path(__file__).resolve().parents[2]

ALLOWED_EXTS: Set[str] = {
    ".html",
    ".htm",
    ".css",
    ".js",
    ".ts",
    ".jsx",
    ".tsx",
    ".json",
    ".yml",
    ".yaml",
    ".xml",
    ".csv",
    ".md",
    ".txt",
    ".py",
    ".ps1",
}

IGNORE_FRAGMENTS = (
    "/assets/img/",
    "/assets/images/",
    "/assets/_orphaned/",
    "/node_modules/",
    "/dist/",
    "/build/",
    "/vendor/",
)

# Common UTF-8 decoded as latin1/cp1252 artefacts (Turkish + punctuation).
MOJIBAKE_REGEX = re.compile(
    r"Ã§|Ã‡|Ã¶|Ã–|Ã¼|Ãœ|Ä±|Ä°|ÄŸ|Äž|ÅŸ|Åž|â€“|â€”|â€œ|â€|â€™|Â©|Â®|Â·"
)


def run(cmd: List[str]) -> subprocess.CompletedProcess[bytes]:
    return subprocess.run(cmd, cwd=ROOT, capture_output=True)


def staged_files() -> List[Path]:
    proc = run(["git", "diff", "--cached", "--name-only", "--diff-filter=ACM"])
    if proc.returncode != 0:
        print(proc.stderr.decode("utf-8", errors="replace"))
        sys.exit(proc.returncode)
    files: List[Path] = []
    for line in proc.stdout.decode("utf-8", errors="replace").splitlines():
        line = line.strip()
        if not line:
            continue
        files.append(ROOT / line)
    return files


def is_skipped(path: Path) -> bool:
    posix = path.as_posix()
    if not any(posix.endswith(ext) for ext in ALLOWED_EXTS):
        return True
    return any(fragment in posix for fragment in IGNORE_FRAGMENTS)


def read_staged(path: Path) -> bytes:
    proc = run(["git", "show", f":{path.relative_to(ROOT)}"])
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.decode("utf-8", errors="replace"))
    return proc.stdout


def check_file(path: Path) -> dict:
    blob = read_staged(path)
    if b"\0" in blob:
        return {"path": path, "status": "skip", "reason": "binary"}
    try:
        decoded = blob.decode("utf-8")
    except UnicodeDecodeError:
        return {"path": path, "status": "fail", "reason": "not UTF-8"}

    hits = MOJIBAKE_REGEX.findall(decoded)
    if hits:
        return {
            "path": path,
            "status": "fail",
            "reason": f"mojibake patterns ({len(hits)})",
            "samples": sorted(set(hits))[:6],
        }
    return {"path": path, "status": "ok"}


def main() -> int:
    files = [p for p in staged_files() if not is_skipped(p)]
    if not files:
        return 0

    results = [check_file(p) for p in files]
    failures = [r for r in results if r["status"] == "fail"]
    skipped = [r for r in results if r["status"] == "skip"]

    if failures:
        print("Mojibake/encoding guard failed:")
        for r in failures:
            sample = f" samples={r.get('samples')}" if r.get("samples") else ""
            print(f" - {r['path'].relative_to(ROOT)} :: {r['reason']}{sample}")
        if skipped:
            print("\nSkipped (binary/ignored):")
            for r in skipped:
                print(f" - {r['path'].relative_to(ROOT)} :: {r['reason']}")
        print("\nHint: run `python NV_TOOLS/fix_tr_chars.py --root . --apply --backup --stats` to fix.")
        return 1

    if skipped:
        print("Pre-commit mojibake check: OK (with skipped binary/ignored files)")
    else:
        print("Pre-commit mojibake check: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

