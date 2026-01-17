import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ROOT = process.cwd();
const PACKS_DIR_CANDIDATES = [
  path.join(ROOT, "NEUROVA_PROMPT", "packs"),
  path.join(ROOT, "packs"),
];
const PACKS_DIR = PACKS_DIR_CANDIDATES.find(p => fs.existsSync(p));
const STATE_PATH = path.join(ROOT, '_audit', 'pack-drift-state.json');

function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function loadState() {
  if (!fs.existsSync(STATE_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  } catch {
    return {}; // In case of corrupted file
  }
}

function saveState(state) {
  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

async function runDriftCheck() {
  if (!PACKS_DIR) {
    console.log('✅ PACK DRIFT CHECK OK (No packs directory found)');
    return;
  }

  const state = loadState();
  const nextState = {};
  let warnings = 0;

  const packFiles = fs.readdirSync(PACKS_DIR).filter(
    file => file.toLowerCase().startsWith('pack.') && file.toLowerCase().endsWith('.js')
  );

  for (const file of packFiles) {
    const filePath = path.join(PACKS_DIR, file);
    const packUrl = 'file:///' + filePath.replace(/\\/g, '/') + `?t=${Date.now()}`;

    try {
      const mod = await import(packUrl);
      const data = mod.default;

      if (!data || !data.meta || !Array.isArray(data.prompts)) continue;

      const contentHash = hash(JSON.stringify(data.prompts));
      const version = data.meta.version;

      nextState[file] = { version, hash: contentHash };

      const prev = state[file];
      if (prev && prev.hash !== contentHash && prev.version === version) {
        warnings++;
        console.warn(`⚠️  DRIFT: ${file} prompts changed but version not bumped (v${version})`);
      }
    } catch (e) {
      console.error(`❌ Error processing ${file} for drift check: ${e.message}`);
    }
  }

  saveState(nextState);

  if (warnings > 0) {
    console.warn(`\n⚠️  PACK DRIFT WARNINGS: ${warnings}`);
  } else {
    console.log('✅ PACK DRIFT CHECK OK');
  }
}

runDriftCheck();