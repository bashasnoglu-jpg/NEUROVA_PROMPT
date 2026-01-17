import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SITE_DIR = path.join(ROOT, 'NEUROVA_SITE');

const FILE_EXTENSIONS = ['.html', '.js', '.css'];
// This regex finds paths starting with 'assets/'
const ASSET_REGEX = /assets\/[a-z0-9\-_/.]+/gi;

let broken = false;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return FILE_EXTENSIONS.includes(path.extname(entry.name).toLowerCase()) ? [fullPath] : [];
  });
}

const files = walk(SITE_DIR);

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(ASSET_REGEX) || [];

  for (const ref of [...new Set(matches)]) { // Use Set to avoid checking the same broken link multiple times per file
    const assetPath = path.join(SITE_DIR, ref);
    if (!fs.existsSync(assetPath)) {
      broken = true;
      console.error(`❌ Broken asset reference: ${path.relative(ROOT, file)} → ${ref}`);
    }
  }
}

if (broken) {
  console.error('\n🚫 Broken asset references found.');
  process.exit(1);
}

console.log('✅ No broken asset references found.');