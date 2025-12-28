from pathlib import Path
import re

ROOT = Path(".")  # run from NEUROVA_SITE
EXCLUDE_DIRS = {"node_modules", ".git", "dist", "build", ".next", ".cache"}

SCRIPT_TAG_RE = re.compile(
    r"<script\b[^>]*\bsrc\s*=\s*[\"'][^\"']*nv-nav\.js[^\"']*[\"'][^>]*>",
    re.IGNORECASE,
)
DEFER_RE = re.compile(r"\bdefer\b", re.IGNORECASE)
MODULE_RE = re.compile(r'\btype\s*=\s*["\']module["\']', re.IGNORECASE)

SAFETY_MARKER = "/* NAV SAFETY BLOCK v1.0"
SAFETY_BLOCK = r"""
/* NAV SAFETY BLOCK v1.0 - keep at file end */
html.nv-lock, body.nv-lock{ overflow:hidden; }

/* Legacy overlay/panel safety (if markup uses nv-nav-overlay / nv-nav-panel). */
.nv-nav-overlay{
  position:fixed; inset:0;
  opacity:0;
  pointer-events:none;
  z-index:9998;
}
.nv-nav-overlay.is-on{
  opacity:1;
  pointer-events:auto;
}

.nv-nav-panel{
  position:fixed;
  top:0; right:0;
  height:100vh;
  width:min(360px, 86vw);
  transform:translateX(110%);
  transition:transform .25s ease;
  z-index:9999;
}
.nv-nav-panel.is-open{ transform:translateX(0); }

/* Current mobile panel safety (nv-nav.js output). */
#nv-nav-slot{ position:relative; z-index:10000; }
#nv-nav-slot .nv-header{ position:sticky; top:0; z-index:10001; }
#nv-nav-slot .nv-header, #nv-nav-slot .nv-header *{ pointer-events:auto; }
#nv-nav-slot .nv-mpanel{
  position:fixed;
  inset:0;
  z-index:10002;
  pointer-events:none;
  opacity:0;
  visibility:hidden;
}
#nv-nav-slot .nv-mpanel.is-open{
  pointer-events:auto;
  opacity:1;
  visibility:visible;
}
#nv-nav-slot .nv-mpanel__inner{
  position:absolute;
  top:0;
  right:0;
  height:100%;
  z-index:10003;
  pointer-events:auto;
  transform: translateX(110%);
  transition: transform .25s ease;
}
#nv-nav-slot .nv-mpanel.is-open .nv-mpanel__inner{
  transform: translateX(0);
}

@media (prefers-reduced-motion: reduce){
  #nv-nav-slot .nv-mpanel__inner{ transition: none; }
}
"""
SAFETY_LINK = '<link rel="stylesheet" href="/assets/css/nv-nav-safety.css?v=1">'
SAFETY_LINK_RE = re.compile(r"<link\b[^>]*nv-nav-safety\.css[^>]*>", re.IGNORECASE)
HEAD_CLOSE_RE = re.compile(r"</head>", re.IGNORECASE)


def is_excluded(path: Path) -> bool:
    parts = set(path.parts)
    return any(d in parts for d in EXCLUDE_DIRS)


def patch_html_defer(file_path: Path) -> bool:
    text = file_path.read_text(encoding="utf-8", errors="ignore")
    changed = False

    def repl(m: re.Match) -> str:
        nonlocal changed
        tag = m.group(0)
        if DEFER_RE.search(tag) or MODULE_RE.search(tag):
            return tag
        changed = True
        return tag[:-1] + " defer>"

    new_text = SCRIPT_TAG_RE.sub(repl, text)
    if changed:
        file_path.write_text(new_text, encoding="utf-8")
    return changed


def patch_safety_css() -> bool:
    safety_css = ROOT / "assets" / "css" / "nv-nav-safety.css"
    if safety_css.exists():
        text = safety_css.read_text(encoding="utf-8", errors="ignore")
        if SAFETY_MARKER in text:
            return False

    safety_css.parent.mkdir(parents=True, exist_ok=True)
    safety_css.write_text(SAFETY_BLOCK.strip() + "\n", encoding="utf-8")
    print(f"Safety block eklendi: {safety_css}")
    return True


def patch_html_safety_link(file_path: Path) -> bool:
    text = file_path.read_text(encoding="utf-8", errors="ignore")
    if SAFETY_LINK_RE.search(text):
        return False

    def repl(m: re.Match) -> str:
        return f"{SAFETY_LINK}\n{m.group(0)}"

    updated = HEAD_CLOSE_RE.sub(repl, text, count=1)
    if updated != text:
        file_path.write_text(updated, encoding="utf-8")
        return True
    return False


def main() -> None:
    html_files = [p for p in ROOT.rglob("*.html") if not is_excluded(p)]
    changed_files = []

    for f in html_files:
        changed = False
        if patch_html_defer(f):
            changed = True
        if patch_html_safety_link(f):
            changed = True
        if changed:
            changed_files.append(str(f))

    css_changed = patch_safety_css()

    print("\nDefer eklenen HTML dosyalari:")
    for f in changed_files:
        print(" -", f)
    print("\nCSS safety block:", "eklendi" if css_changed else "zaten vardi / eklenmedi")


if __name__ == "__main__":
    main()
