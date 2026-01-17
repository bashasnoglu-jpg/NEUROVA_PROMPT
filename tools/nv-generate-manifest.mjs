import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

// Find the correct packs directory, accommodating different project structures
const PACKS_DIR_CANDIDATES = [
  path.join(ROOT, "NEUROVA_PROMPT", "packs"),
  path.join(ROOT, "packs"),
];
const PACKS_DIR = PACKS_DIR_CANDIDATES.find(p => fs.existsSync(p));

if (!PACKS_DIR) {
  console.log("⏩ No packs directory found. Skipping manifest generation.");
  process.exit(0);
}

const MANIFEST_PATH = path.join(PACKS_DIR, 'manifest.json');

function detectPackId(filename) {
  return filename
    .replace(/^pack\./i, '')
    .replace(/\.js$/i, '')
    .replace(/[^a-z0-9\-]/gi, '');
}

const packFiles = fs.readdirSync(PACKS_DIR)
  .filter(file => file.toLowerCase().startsWith('pack.') && file.toLowerCase().endsWith('.js'));

const manifest = {
  version: "1.0.0", // This can be dynamic later, e.g., from package.json
  generatedAt: new Date().toISOString(),
  packs: packFiles.map(file => ({
    id: detectPackId(file),
    file: file // The filename itself is used for resolution by other tools
  })).sort((a, b) => a.id.localeCompare(b.id))
};

// Write with UTF-8 without a BOM, which is critical for JSON parsers
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), { encoding: 'utf8' });

console.log(`✅ Generated manifest.json with ${manifest.packs.length} packs.`);