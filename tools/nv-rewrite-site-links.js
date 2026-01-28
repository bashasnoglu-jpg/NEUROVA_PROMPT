const fs = require("fs");
const path = require("path");
const f = path.join(process.cwd(), "SANTIS_SITE", "nav.html");
if (!fs.existsSync(f)) {
  console.log("SKIP: SANTIS_SITE/nav.html not found");
  process.exit(0);
}

let t = fs.readFileSync(f, "utf8");
const pages = [
  "index.html","hamam.html","masajlar.html","kids-family.html",
  "face-sothys.html","yoga.html","products.html","about.html",
  "team.html","packages.html","nav.html"
];

function escapeForRegExp(s){
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\\\$&");
}

for (const p of pages) {
  const safe = escapeForRegExp(p);
  const re = new RegExp("(href\\s*=\\s*[\"'])(?:\\/)?(?:SANTIS_SITE\\/)?"+safe+"([\"'])", "gi");
  t = t.replace(re, `$1./${p}$2`);
}

t = t.replace(/(src|href)\s*=\s*["']\/SANTIS_SITE\/(assets\/[^"']+)["']/gi, `$1="./$2"`);

fs.writeFileSync(f, t, "utf8");
console.log("OK: rewrote links in SANTIS_SITE/nav.html");
