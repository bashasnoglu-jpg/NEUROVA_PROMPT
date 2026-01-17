import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SITE_DIR = path.join(ROOT, 'NEUROVA_SITE');

const CANONICAL_DIRS = [
  'assets/img',
  'assets/css',
  'assets/js'
];

console.log('Ensuring canonical asset structure...');

if (!fs.existsSync(SITE_DIR)) {
  console.warn(`� ️  Site directory not found at ${SITE_DIR}. Creating it.`);
  fs.mkdirSync(SITE_DIR, { recursive: true });
}

let createdCount = 0;
for (const dir of CANONICAL_DIRS) {
  const fullPath = path.join(SITE_DIR, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created: ${path.relative(ROOT, fullPath)}`);
    createdCount++;
  }
}

if (createdCount > 0) {
  console.log(`\n✨ Asset structure initialized. Please add your files (e.g., favicons) to the 'NEUROVA_SITE/assets/img' directory.`);
} else {
  console.log('✅ Asset structure already exists.');
}