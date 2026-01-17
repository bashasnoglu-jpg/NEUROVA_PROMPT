#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from __future__ import annotations

import argparse
import os
from pathlib import Path
from typing import Optional, Tuple

TEXT_EXTS = {
    ".js",
    ".cjs",
    ".mjs",
    ".ts",
    ".css",
    ".html",
    ".json",
    ".md",
    ".yml",
    ".yaml",
    ".ps1",
    ".py",
    ".txt",
}

# Prefer explicit mojibake sequences (less false positives than single letters)
MOJI_SEQS = (
    "Ã§",
    "Ã‡",
    "Ã¶",
    "Ã–",
    "Ã¼",
    "Ãœ",
    "Ä±",
    "Ä°",
    "ÄŸ",
    "Äž",
    "ÅŸ",
    "Åž",
    # Common cp1252 punctuation/emoji mojibake starters
    "â€",
    "â„",
    "âœ",
    "â˜",
    "â†",
    "âš",
)

# Broad suspects (fallback)
SUSPECT_CHARS = ("Ã", "Å", "Ä", "Â", "Î", "ï")

TR_CHARS = set("çÇğĞıİöÖşŞüÜ")

DIRECT_TARGETS = "çÇğĞıİöÖşŞüÜâÂîÎûÛêÊôÔβ…–—“”’•©®·☰™▾→✓²✉⚠️"


def build_direct_replacements() -> dict[str, str]:
    """
    Build a safe replacement map for common mojibake where UTF-8 bytes were
    decoded as a single-byte encoding (latin-1 / Windows-1252) and later saved.

    Using latin-1 decoding preserves bytes 1:1, including C1 controls (0x80–0x9F),
    which appear frequently as invisible/odd characters in mojibake strings.
    """
    mapping: dict[str, str] = {}
    for ch in DIRECT_TARGETS:
        b = ch.encode("utf-8")
        # latin1 keeps bytes 1:1 (including C1 controls)
        mapping[b.decode("latin1")] = ch
        # cp1252/cp1254 are common sources of mojibake strings on Windows
        for single_byte in ("cp1252", "cp1254"):
            try:
                mapping[b.decode(single_byte)] = ch
            except Exception:
                pass
    return mapping


def count_mojibake_markers(s: str) -> int:
    n = 0
    for seq in MOJI_SEQS:
        n += s.count(seq)
    # light weight bonus for suspicious chars
    n += sum(s.count(ch) for ch in SUSPECT_CHARS)
    return n


def count_tr_chars(s: str) -> int:
    return sum(1 for ch in s if ch in TR_CHARS)


def looks_mojibake(s: str) -> bool:
    return any(seq in s for seq in MOJI_SEQS) or any(ch in s for ch in SUSPECT_CHARS)


def try_fix_latin1_roundtrip(s: str) -> Optional[str]:
    """
    Typical mojibake: UTF-8 bytes decoded as latin1/cp1252 then saved as UTF-8.
    Fix by latin1-encoding current string then decoding as UTF-8.
    """
    try:
        fixed = s.encode("latin1", errors="strict").decode("utf-8", errors="strict")
    except Exception:
        return None
    return fixed if fixed != s else None


def try_fix_cp_roundtrip(s: str) -> Optional[str]:
    """
    Typical mojibake: UTF-8 bytes decoded as cp1252/cp1254 (common on Windows),
    then saved as UTF-8. Fix by encoding with that legacy codepage and decoding as UTF-8.
    """
    for enc in ("cp1252", "cp1254"):
        try:
            fixed = s.encode(enc, errors="strict").decode("utf-8", errors="strict")
        except Exception:
            continue
        if fixed != s:
            return fixed
    return None


def apply_direct_replacements(s: str) -> str:
    mapping = build_direct_replacements()
    out = s
    for k, v in mapping.items():
        out = out.replace(k, v)
    return out


def decode_best_effort(data: bytes) -> Tuple[Optional[str], Optional[str]]:
    """
    Return (text, encoding_name) for first successful decode attempt.
    Priority: utf-8, utf-8-sig, cp1254, cp1252, latin1.
    """
    for enc in ("utf-8", "utf-8-sig", "cp1254", "cp1252", "latin1"):
        try:
            return data.decode(enc, errors="strict"), enc
        except Exception:
            continue
    return None, None


def should_accept_fix(original: str, fixed: str) -> bool:
    """
    Safety gate:
    - mojibake markers must decrease noticeably
    - Turkish chars should not decrease; ideally increase
    """
    o_m = count_mojibake_markers(original)
    f_m = count_mojibake_markers(fixed)
    o_tr = count_tr_chars(original)
    f_tr = count_tr_chars(fixed)

    # Must improve mojibake (or at least not worsen if original already bad)
    if f_m > o_m:
        return False

    # If original had mojibake, require reduction
    if o_m > 0 and f_m >= o_m:
        return False

    # Turkish chars should not drop (common sign of wrong decoding)
    if f_tr < o_tr:
        return False

    return True


def process_file(p: Path, apply: bool, backup: bool) -> Tuple[bool, str]:
    # These tools intentionally contain mojibake *patterns* (as detection regex / examples).
    # Avoid rewriting them.
    skip_exact = {
        "fix_tr_chars.py",
        "precommit_mojibake.py",
        "fix_mojibake.js",
        "fix_neurova_utf8.ps1",
    }
    if p.name in skip_exact:
        return (False, "skip: tool contains patterns")

    data = p.read_bytes()
    txt, enc = decode_best_effort(data)
    if txt is None:
        return (False, "skip: undecodable")

    original = txt

    changed = False
    reason = ""

    if enc in ("cp1254", "cp1252", "latin1"):
        # Non-UTF8 source: normalize to UTF-8, and fix mojibake if we can.
        changed = True
        fixed = original
        reason = f"normalize from {enc} -> utf-8"

        if looks_mojibake(original):
            direct = apply_direct_replacements(original)
            if direct != original and should_accept_fix(original, direct):
                fixed = direct
                reason = f"normalize from {enc} -> utf-8 + direct replacements"
    else:
        # UTF-8 text: only fix if mojibake-like
        if not looks_mojibake(original):
            return (False, "ok: no mojibake")

        candidates: list[tuple[str, str]] = []

        direct = apply_direct_replacements(original)
        if direct != original:
            candidates.append(("fixed: direct replacements", direct))

        cp = try_fix_cp_roundtrip(original)
        if cp:
            candidates.append(("fixed: cp125x->utf8 roundtrip", cp))

        latin1 = try_fix_latin1_roundtrip(original)
        if latin1:
            candidates.append(("fixed: latin1->utf8 roundtrip", latin1))

        accepted: list[tuple[str, str]] = [
            (why, txt) for (why, txt) in candidates if should_accept_fix(original, txt)
        ]
        if not accepted:
            return (False, "skip: no safe fix")

        # Pick the best: fewer mojibake markers, then more Turkish chars.
        accepted.sort(
            key=lambda item: (
                count_mojibake_markers(item[1]),
                -count_tr_chars(item[1]),
                len(item[1]),
            )
        )
        reason, fixed = accepted[0]
        changed = True

    if changed and apply:
        if backup:
            bak = p.with_suffix(p.suffix + ".bak")
            if not bak.exists():
                bak.write_bytes(data)
        p.write_text(fixed, encoding="utf-8", newline="\n")

    return (changed, reason)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=".", help="root directory to scan")
    ap.add_argument("--apply", action="store_true", help="write changes")
    ap.add_argument("--dry-run", action="store_true", help="report only")
    ap.add_argument("--backup", action="store_true", help="create .bak before writing")
    ap.add_argument("--ext", action="append", default=None, help="limit to extension (repeatable)")
    ap.add_argument(
        "--exclude",
        action="append",
        default=[".git", "node_modules", "dist", "build"],
        help="exclude dirs (repeatable)",
    )
    ap.add_argument("--stats", action="store_true", help="print aggregate stats")
    args = ap.parse_args()

    apply = args.apply and not args.dry_run
    root = Path(args.root).resolve()
    exts = (
        set(e.lower() if e.startswith(".") else "." + e.lower() for e in (args.ext or []))
        if args.ext
        else TEXT_EXTS
    )
    excludes = set(args.exclude or [])

    scanned = 0
    changed = 0
    reasons: dict[str, int] = {}

    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in excludes]
        for fn in filenames:
            p = Path(dirpath) / fn
            if p.suffix.lower() not in exts:
                continue
            scanned += 1
            ch, why = process_file(p, apply=apply, backup=args.backup)
            reasons[why] = reasons.get(why, 0) + 1
            if ch:
                changed += 1
                rel = p.relative_to(root)
                print(f"[FIX] {rel}  ({why})")

    mode = "APPLY" if apply else "DRY"
    print(f"\nDone ({mode}). scanned={scanned} changed={changed}")
    if args.stats:
        print("\nStats:")
        for k in sorted(reasons, key=lambda x: (-reasons[x], x)):
            print(f"  {reasons[k]:>6}  {k}")


if __name__ == "__main__":
    main()
