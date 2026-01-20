import argparse
import csv
import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional

# =========================================
# NEUROVA MOJIBAKE FIXER v3.1 (MEGA MASTER)
# - Dry-run by default; --write to apply
# - Safe replacements with do-not-touch rules
# - File-type filtering, size guard
# - JSON/CSV report outputs
# - Optional fail-on-detect for CI
# =========================================

# Text-based extensions to scan
DEFAULT_EXTENSIONS = {
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
}

# Directories to ignore entirely
IGNORE_DIRS = {
    ".git",
    "node_modules",
    "dist",
    "build",
    "__pycache__",
    ".venv",
    "venv",
    "assets/img",
    "assets/images",
    "assets/_orphaned",
    "assets/fonts",
}

# File name or path patterns to skip (minified/vendor or generated)
SKIP_PATTERNS = (
    ".min.",
    ".bundle.",
    ".map",
    "vendor/",
    "coverage/",
    "logs/",
)

# Files we deliberately avoid rewriting (they contain pattern definitions)
SELF_SKIP_FILES = {
    "fix_tr_chars.py",
    "precommit_mojibake.py",
}

# Replace map (exact string matches)
REPLACEMENTS: Dict[str, str] = {
    "Ä±": "ı",
    "Ä°": "İ",
    "ÅŸ": "ş",
    "Åž": "Ş",
    "ÄŸ": "ğ",
    "Äž": "Ğ",
    "Ã§": "ç",
    "Ã‡": "Ç",
    "Ã¶": "ö",
    "Ã–": "Ö",
    "Ã¼": "ü",
    "Ãœ": "Ü",
    "â€™": "’",
    "â€œ": "“",
    "â€�": "”",
    "â€“": "–",
    "â€”": "—",
}

MOJIBAKE_REGEX = "|".join(re.escape(k) for k in REPLACEMENTS.keys())
MOJIBAKE_RE = re.compile(MOJIBAKE_REGEX)

# Max file size to process (in bytes) to avoid huge binaries masquerading as text
MAX_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


def is_binary(data: bytes) -> bool:
    """Heuristic: null byte indicates binary."""
    return b"\0" in data


def is_ignored_dir(current: Path, root: Path) -> bool:
    """Check whether a directory path falls under ignored paths."""
    try:
        rel = current.relative_to(root).as_posix()
    except ValueError:
        rel = current.as_posix()
    rel = "." if rel == "" else rel
    for ignore in IGNORE_DIRS:
        if rel == ignore or rel.startswith(f"{ignore}/"):
            return True
    return False


def should_skip(path: Path, extensions: set) -> bool:
    """Apply directory, extension, and pattern filters."""
    rel_posix = path.as_posix()
    for ignore in IGNORE_DIRS:
        if rel_posix.endswith(f"/{ignore}") or f"/{ignore}/" in rel_posix:
            return True
        if rel_posix.endswith(ignore) and ignore.startswith("."):
            return True
    if path.name in SELF_SKIP_FILES:
        return True
    if path.suffix.lower() not in extensions:
        return True
    normalized = rel_posix
    if any(pat in normalized for pat in SKIP_PATTERNS):
        return True
    return False


def scan_and_fix_file(path: Path, dry_run: bool) -> Optional[Dict]:
    rel_path = path.as_posix()

    try:
        size = path.stat().st_size
        if size > MAX_SIZE_BYTES:
            return {"path": rel_path, "skipped": "too_large", "size": size, "status": "skipped"}

        raw = path.read_bytes()
        if is_binary(raw):
            return {"path": rel_path, "skipped": "binary", "status": "skipped"}

        bom_removed = False
        content = raw
        if content.startswith(b"\xef\xbb\xbf"):
            content = content[3:]
            bom_removed = True

        try:
            text = content.decode("utf-8")
        except UnicodeDecodeError:
            return {"path": rel_path, "skipped": "decode_error", "status": "skipped"}

        detected = MOJIBAKE_RE.findall(text)
        if not bom_removed and not detected:
            return None

        original_text = text
        mojibake_count = 0
        for bad, good in REPLACEMENTS.items():
            occurrences = text.count(bad)
            if occurrences:
                text = text.replace(bad, good)
                mojibake_count += occurrences

        changed = bom_removed or text != original_text

        if changed and not dry_run:
            path.write_text(text, encoding="utf-8", newline="")

        return {
            "path": rel_path,
            "bom_removed": bom_removed,
            "mojibake_fixed": mojibake_count,
            "changed": changed,
            "dry_run": dry_run,
            "status": "fixed" if changed else "checked",
        }
    except Exception as exc:  # noqa: BLE001
        return {"path": rel_path, "error": str(exc), "status": "error"}


def build_extension_set(extra_ext: List[str]) -> set:
    base = set(DEFAULT_EXTENSIONS)
    for ext in extra_ext:
        if not ext.startswith("."):
            ext = f".{ext}"
        base.add(ext.lower())
    return base


def print_report(report: List[Dict], root: Path, summary: Dict) -> None:
    fixed = [r for r in report if r.get("changed")]
    skipped = [r for r in report if r.get("status") == "skipped"]
    errored = [r for r in report if r.get("status") == "error"]

    if fixed:
        print("\n=== FIXED / TO-FIX (dry-run) ===")
        for item in fixed:
            status = "[DRY-RUN]" if item.get("dry_run") else "[FIXED]"
            details = []
            if item.get("bom_removed"):
                details.append("BOM removed")
            if item.get("mojibake_fixed"):
                details.append(f"{item['mojibake_fixed']} replacements")
            detail_str = ", ".join(details) if details else "No details"
            print(f"{status} {item['path']} -> {detail_str}")

    if skipped:
        print("\n=== SKIPPED / NEEDS REVIEW ===")
        for item in skipped:
            reason = item["skipped"]
            extra = f" ({item['size']} bytes)" if "size" in item else ""
            print(f"[SKIP:{reason}] {item['path']}{extra}")

    if errored:
        print("\n=== ERRORS ===")
        for item in errored:
            print(f"[ERROR] {item['path']}: {item['error']}")

    print(
        f"\nSummary: detected={summary['detected']} | written={summary['written']} | "
        f"skipped={summary['skipped']} | errors={summary['errors']}"
    )
    print(f"Root: {root}")


def write_json_report(report: List[Dict], summary: Dict, out_path: Path, root: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    payload = {"root": root.as_posix(), "summary": summary, "items": report}
    out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def write_csv_report(report: List[Dict], out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = [
        "status",
        "path",
        "bom_removed",
        "mojibake_fixed",
        "skipped",
        "size",
        "error",
    ]
    with out_path.open("w", encoding="utf-8", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for item in report:
            writer.writerow({key: item.get(key, "") for key in fieldnames})


def main(argv: List[str]) -> int:
    parser = argparse.ArgumentParser(
        description="NEUROVA Mojibake Fixer v3.1 (dry-run friendly)"
    )
    parser.add_argument(
        "--root",
        default=".",
        help="Root directory to scan (default: current working directory)",
    )
    parser.add_argument(
        "--ext",
        nargs="*",
        default=[],
        help="Additional file extensions to scan (without dot or with dot).",
    )
    parser.add_argument(
        "--write",
        action="store_true",
        help="Apply fixes instead of dry-run.",
    )
    parser.add_argument(
        "--report-json",
        help="Write JSON report to path.",
    )
    parser.add_argument(
        "--report-csv",
        help="Write CSV report to path.",
    )
    parser.add_argument(
        "--fail-on-detect",
        action="store_true",
        help="Exit with code 1 if any mojibake/bom is detected (CI mode).",
    )
    args = parser.parse_args(argv)

    root = Path(args.root).resolve()
    extensions = build_extension_set(args.ext)
    dry_run = not args.write

    print(
        f"Scanning for mojibake in {root} | dry-run={dry_run} | "
        f"extensions={sorted(extensions)}"
    )

    report: List[Dict] = []

    for dirpath, dirnames, filenames in os.walk(root):
        current = Path(dirpath)
        if is_ignored_dir(current, root):
            dirnames[:] = []
            continue
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS and not d.startswith(".")]
        for filename in filenames:
            path = current / filename
            if should_skip(path, extensions):
                continue
            result = scan_and_fix_file(path, dry_run=dry_run)
            if result:
                report.append(result)

    fixed = [r for r in report if r.get("changed")]
    skipped = [r for r in report if r.get("status") == "skipped"]
    errored = [r for r in report if r.get("status") == "error"]

    summary = {
        "detected": len(fixed),
        "written": sum(1 for r in fixed if not r.get("dry_run")),
        "skipped": len(skipped),
        "errors": len(errored),
        "dry_run": dry_run,
    }

    print_report(report, root, summary)

    if args.report_json:
        write_json_report(report, summary, Path(args.report_json), root)
    if args.report_csv:
        write_csv_report(report, Path(args.report_csv))

    if summary["errors"] > 0:
        return 1
    if args.fail_on_detect and summary["detected"] > 0:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
