import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const HISTORY_PATH = path.join(ROOT, '_audit', 'quality-history.json');
const MEGA_REPORT_PATH = path.join(ROOT, '_audit', 'NV_MEGA_SCAN_REPORT.md');

function readSafe(p) {
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, 'utf8');
}

async function countPrompts() {
  const packsDirCandidates = [
    path.join(ROOT, "NEUROVA_PROMPT", "packs"),
    path.join(ROOT, "packs"),
  ];
  const packsDir = packsDirCandidates.find(p => fs.existsSync(p));
  if (!packsDir) return 0;

  let count = 0;
  const packFiles = fs.readdirSync(packsDir).filter(
    file => file.toLowerCase().startsWith('pack.') && file.toLowerCase().endsWith('.js')
  );

  for (const file of packFiles) {
    const filePath = path.join(packsDir, file);
    // Use file:// protocol and a cache-busting query for reliable dynamic imports
    const packUrl = 'file:///' + filePath.replace(/\\/g, '/') + `?t=${Date.now()}`;
    try {
      const mod = await import(packUrl);
      const data = mod.default;
      if (data?.prompts && Array.isArray(data.prompts)) {
        count += data.prompts.length;
      }
    } catch (e) {
      // Silently ignore packs that fail to load, as other audit steps will catch them.
      // This ensures the history logging itself is resilient.
    }
  }
  return count;
}

function getStatus() {
  const report = readSafe(MEGA_REPORT_PATH);
  if (!report) return 'UNKNOWN';
  return report.includes('❌ FAILED') ? 'FAIL' : 'PASS';
}

function countDriftWarnings() {
  // Per your design, this is a placeholder for now, as drift warnings are console-only.
  // This can be enhanced later by having the drift check produce a structured report.
  return 0;
}

function loadHistory() {
  if (!fs.existsSync(HISTORY_PATH)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return []; // In case of a corrupted history file
  }
}

function saveHistory(data) {
  fs.mkdirSync(path.dirname(HISTORY_PATH), { recursive: true });
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(data, null, 2));
}

async function main() {
  const history = loadHistory();

  const packsDir = [path.join(ROOT, "NEUROVA_PROMPT", "packs"), path.join(ROOT, "packs")].find(p => fs.existsSync(p));
  const packCount = packsDir ? fs.readdirSync(packsDir).filter(f => f.startsWith('pack.') && f.endsWith('.js')).length : 0;

  const entry = {
    date: new Date().toISOString(),
    status: getStatus(),
    packs: packCount,
    prompts: await countPrompts(),
    jsonErrors: 0,       // Placeholder as requested for a light start
    schemaErrors: 0,   // Placeholder as requested
    driftWarnings: countDriftWarnings(), // Placeholder as requested
  };

  history.push(entry);
  saveHistory(history);

  console.log('📊 Quality history updated.');
}

main();