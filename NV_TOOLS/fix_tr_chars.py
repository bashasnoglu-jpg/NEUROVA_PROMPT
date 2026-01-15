#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from __future__ import annotations
import argparse, os
from pathlib import Path

TEXT_EXTS = {".js",".cjs",".mjs",".ts",".css",".html",".json",".md",".yml",".yaml",".ps1",".py",".txt"}
SUSPECT = ("Ã","Å","Ä","Ð","Þ","â","€","™","œ","ž","Ÿ")

def looks_mojibake(s: str) -> bool:
    return any(x in s for x in SUSPECT)

def try_fix(s: str):
    try:
        fixed = s.encode("latin1", errors="strict").decode("utf-8", errors="strict")
    except Exception:
        return None
    if fixed == s:
        return None
    if looks_mojibake(fixed) and not looks_mojibake(s):
        return None
    return fixed

def process_file(p: Path, apply: bool):
    data = p.read_bytes()
    try:
        txt = data.decode("utf-8")
    except Exception:
        return (False, 0, 0)
    if not looks_mojibake(txt):
        return (False, len(txt), len(txt))
    fixed = try_fix(txt)
    if fixed is None or fixed == txt:
        return (False, len(txt), len(txt))
    if apply:
        p.write_text(fixed, encoding="utf-8", newline="\n")
    return (True, len(txt), len(fixed))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=".", help="root directory to scan")
    ap.add_argument("--apply", action="store_true", help="write changes")
    ap.add_argument("--dry-run", action="store_true", help="report only")
    ap.add_argument("--ext", action="append", default=None, help="limit to extension (repeatable)")
    ap.add_argument("--exclude", action="append", default=[".git","node_modules","dist","build"], help="exclude dirs (repeatable)")
    args = ap.parse_args()

    apply = args.apply and not args.dry_run
    root = Path(args.root).resolve()
    exts = set(args.ext) if args.ext else TEXT_EXTS
    excludes = set(args.exclude or [])

    changed = 0
    scanned = 0
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in excludes]
        for fn in filenames:
            p = Path(dirpath) / fn
            if p.suffix.lower() not in exts:
                continue
            scanned += 1
            ch, old_len, new_len = process_file(p, apply=apply)
            if ch:
                changed += 1
                rel = p.relative_to(root)
                print(f"[FIX] {rel}  ({old_len} -> {new_len})")

    mode = "APPLY" if apply else "DRY"
    print(f"\nDone ({mode}). scanned={scanned} changed={changed}")

if __name__ == "__main__":
    main()
