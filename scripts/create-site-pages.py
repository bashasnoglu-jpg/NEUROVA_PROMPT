from pathlib import Path

pages = [
    "index.html", "hamam.html", "masajlar.html", "face-sothys.html",
    "yoga.html", "products.html", "about.html", "team.html", "packages.html"
]

root = Path("NEUROVA_SITE")
root.mkdir(exist_ok=True)

template = """<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <title>{title}</title>
</head>
<body>
  <p>Placeholder for {title}</p>
  <a href="./nav.html">Nav</a>
</body>
</html>
"""

for page in pages:
    path = root / page
    if not path.exists():
        path.write_text(template.format(title=page), encoding="utf-8")
