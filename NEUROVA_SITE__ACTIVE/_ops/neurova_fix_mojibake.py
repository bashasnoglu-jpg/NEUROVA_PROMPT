import os, re, sys, shutil
from datetime import datetime

ROOT = sys.argv[1] if len(sys.argv) > 1 else "NEUROVA_SITE__ACTIVE"
EXTS = {".html",".css",".js",".json",".xml",".md",".txt",".svg"}

SUSPECT = re.compile(r"(Ã|Â|Ãƒ|Ã‚|â€|â€“|â€”|â€œ|â€�|â€¢)")

def strip_bom(raw: bytes) -> bytes:
    return raw[3:] if raw.startswith(b"\xEF\xBB\xBF") else raw

def score(s: str) -> int:
    return len(SUSPECT.findall(s))

def best_decode(seg: str) -> str | None:
    # seg must be encodable as latin1/cp1252 (i.e., ord(c) <= 255)
    base = score(seg)
    best = None
    best_sc = base
    for enc in ("cp1252", "latin1"):
        try:
            cand = seg.encode(enc).decode("utf-8")
        except Exception:
            continue
        sc = score(cand)
        if sc < best_sc:
            best = cand
            best_sc = sc
    return best

def expand_segment(s: str, at: int, max_len: int = 700) -> tuple[int,int]:
    l = at
    r = at + 1
    # stop at newline; stop when encountering non-byte unicode (>255) so we don't break correct TR chars
    while l > 0:
        ch = s[l-1]
        if ch == "\n" or ord(ch) > 255 or (r - (l-1)) > max_len:
            break
        l -= 1
    while r < len(s):
        ch = s[r]
        if ch == "\n" or ord(ch) > 255 or ((r+1) - l) > max_len:
            break
        r += 1
    return l, r

def fix_text(txt: str) -> str:
    txt = txt.replace("\r\n", "\n").replace("\r", "\n")

    for _pass in range(8):  # multiple passes for multi-round mojibake
        changed = False
        i = 0
        while True:
            m = SUSPECT.search(txt, i)
            if not m:
                break

            at = m.start()
            l, r = expand_segment(txt, at)
            seg = txt[l:r]

            # segment must be byte-range only
            if any(ord(c) > 255 for c in seg):
                i = at + 1
                continue

            repl = best_decode(seg)
            if repl and repl != seg:
                txt = txt[:l] + repl + txt[r:]
                changed = True
                i = l + len(repl)
            else:
                i = at + 1

        if not changed:
            break

    return txt

def main():
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_root = os.path.join(ROOT, "_ops", f"_mojibake_backup_{ts}")
    os.makedirs(backup_root, exist_ok=True)

    scanned = 0
    changed = 0

    for base, _, files in os.walk(ROOT):
        for fn in files:
            ext = os.path.splitext(fn)[1].lower()
            if ext not in EXTS:
                continue

            p = os.path.join(base, fn)
            scanned += 1

            with open(p, "rb") as f:
                raw = strip_bom(f.read())

            try:
                txt = raw.decode("utf-8")
            except UnicodeDecodeError:
                continue

            if score(txt) == 0:
                continue

            fixed = fix_text(txt)
            if fixed == txt or score(fixed) >= score(txt):
                continue

            rel = os.path.relpath(p, ROOT)
            bp = os.path.join(backup_root, rel)
            os.makedirs(os.path.dirname(bp), exist_ok=True)
            shutil.copy2(p, bp)

            with open(p, "wb") as f:
                f.write(fixed.encode("utf-8"))

            changed += 1

    print(f"OK: scanned {scanned} text files")
    print(f"OK: fixed {changed} file(s)")
    if changed:
        print(f"Backup: {backup_root}")

if __name__ == "__main__":
    main()
