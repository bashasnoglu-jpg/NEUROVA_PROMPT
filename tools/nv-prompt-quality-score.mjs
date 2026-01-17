import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const PACKS_DIR_CANDIDATES = [
  path.join(ROOT, "NEUROVA_PROMPT", "packs"),
  path.join(ROOT, "packs"),
];
const PACKS_DIR = PACKS_DIR_CANDIDATES.find(p => fs.existsSync(p));
const OUT_PATH = path.join(ROOT, '_audit', 'prompt-quality.json');

function scorePrompt(p) {
  if (!p || typeof p !== 'object') return 0;
  let score = 0;

  if (p.prompt?.length >= 80) score += 15;
  if (p.prompt?.includes('##') || p.prompt?.includes('-')) score += 20;
  if (p.prompt?.includes('Ama√ß') || p.prompt?.includes('Goal')) score += 20;
  if (p.category) score += 15;
  if (p.safeNote) score += 20;
  if (Array.isArray(p.tags) && p.tags.length > 0) score += 10;

  return Math.min(score, 100);
}

async function runScoring() {
  if (!PACKS_DIR) {
    console.log("‚è© No packs directory found to score. Exiting.");
    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, '[]', 'utf8');
    return;
  }

  const results = [];
  const packFiles = fs.readdirSync(PACKS_DIR).filter(
    file => file.toLowerCase().startsWith('pack.') && file.toLowerCase().endsWith('.js')
  );

  for (const file of packFiles) {
    const filePath = path.join(PACKS_DIR, file);
    const packUrl = 'file:///' + filePath.replace(/\\/g, '/') + `?t=${Date.now()}`;
    try {
      const mod = await import(packUrl);
      const data = mod.default;
      if (!data?.prompts || !Array.isArray(data.prompts)) continue;

      for (const p of data.prompts) {
        results.push({
          pack: file,
          id: p.id,
          title: p.title,
          score: scorePrompt(p)
        });
      }
    } catch (e) {
      console.warn(`‚ö Ô∏è  Could not score pack ${file}: ${e.message}`);
    }
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(results, null, 2));

  console.log(`üß  PROMPT QUALITY SCORED (${results.length} prompts)`);
}

runScoring();