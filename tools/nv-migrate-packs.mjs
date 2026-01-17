import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const PACKS_DIR_CANDIDATES = [
  path.join(ROOT, "NEUROVA_PROMPT", "packs"),
  path.join(ROOT, "packs"),
];
const PACKS_DIR = PACKS_DIR_CANDIDATES.find(p => fs.existsSync(p));

if (!PACKS_DIR) {
  console.log("⏩ No packs directory found to migrate. Exiting.");
  process.exit(0);
}

const TODAY = new Date().toISOString().slice(0, 10);

function detectPackName(filename) {
  return filename
    .replace(/^pack\./i, '')
    .replace(/\.js$/i, '')
    .replace(/[^a-z0-9\-]/gi, '');
}

for (const file of fs.readdirSync(PACKS_DIR)) {
  if (!file.toLowerCase().startsWith('pack.') || !file.toLowerCase().endsWith('.js')) continue;

  const filePath = path.join(PACKS_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf8');

  // Skip already migrated packs
  if (raw.includes('meta:') && raw.includes('prompts:')) {
    console.log(`⏭️  Skipped (already versioned): ${file}`);
    continue;
  }

  let promptsBlock = null;

  // Case 1: export default [...]
  if (raw.includes('export default [')) {
    promptsBlock = raw
      .split('export default')[1]
      .trim()
      .replace(/;$/, '');
  }

  // Case 2: module.exports = [...]
  if (!promptsBlock && raw.includes('module.exports')) {
    promptsBlock = raw
      .split('=')[1]
      .trim()
      .replace(/;$/, '');
  }

  if (!promptsBlock) {
    console.warn(`⚠️  Could not migrate (unrecognized format): ${file}`);
    continue;
  }

  const packName = detectPackName(file);

  const out = `export default {
  meta: {
    pack: '${packName}',
    version: '1.0.0',
    owner: 'NEUROVA',
    lastReview: '${TODAY}'
  },
  prompts: ${promptsBlock}
};
`;

  fs.writeFileSync(filePath, out);
  console.log(`✅ Migrated: ${file}`);
}