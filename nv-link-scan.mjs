import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "NEUROVA_SITE");
const EXT = [".html", ".js", ".css"];
const BAD_PATTERNS = [
  /\/tr\//g,
  /NEUROVA_SITE\//g,
  /file:\/\//g
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, files);
    else if (EXT.includes(path.extname(p).toLowerCase())) files.push(p);
  }
  return files;
}

let hits = 0;

for (const file of walk(ROOT)) {
  const content = fs.readFileSync(file, "utf8");
  BAD_PATTERNS.forEach(rx => {
    if (rx.test(content)) {
      hits++;
      console.log(`� ️  ${path.relative(process.cwd(), file)}`);
      console.log(`   → matched: ${rx}`);
    }
  });
}

if (hits === 0) {
  console.log("✅ LINK SCAN CLEAN — no forbidden paths found");
} else {
  console.log(`\n❌ LINK SCAN FOUND ISSUES: ${hits}`);
}