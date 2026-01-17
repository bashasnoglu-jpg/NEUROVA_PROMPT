import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

const steps = [
  { name: 'Generate Manifest', cmd: 'npm run generate:manifest' },
  { name: 'Node Syntax', cmd: `node --check main.js ${path.join('NEUROVA_PROMPT', 'app.js')}` },
  { name: 'Assets', cmd: 'node tools/asset-check.mjs' },
  { name: 'Pack Count', cmd: 'node tools/nv-build-pack-index.js' },
  { name: 'JSON Audit', cmd: 'npm run audit:json' },
  { name: 'Schema Audit', cmd: 'npm run audit:schema' },
  { name: 'Pack Schema Audit', cmd: 'npm run audit:packs' },
  { name: 'Pack Drift Check', cmd: 'npm run audit:drift' }
].filter(step => {
    // Skip syntax check if files don't exist
    if (step.name === 'Node Syntax') {
        return step.cmd.split(' ').slice(2).every(f => fs.existsSync(path.join(ROOT, f)));
    }
    return true;
});

const report = [];
let failed = false;

console.log('Running NEUROVA MEGA SCAN v1.3...');

for (const step of steps) {
  try {
    execSync(step.cmd, { cwd: ROOT, stdio: 'pipe' });
    report.push(`✅ ${step.name}`);
  } catch (err) {
    report.push(`❌ ${step.name}`);
    console.error(`\n--- FAILURE in step "${step.name}" ---`);
    console.error(err.stdout.toString() + err.stderr.toString());
    failed = true;
    break; // fail fast
  }
}

const OUT = `
# NEUROVA MEGA SCAN v1.3

${report.join('\n')}

## FINAL STATUS
${failed ? '❌ FAILED' : '✅ PASSED'}
`;

const OUT_PATH = path.join(process.cwd(), '_audit', 'NV_MEGA_SCAN_REPORT.md');
fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, OUT.trim());

console.log('\n' + OUT.trim());

// --- ALWAYS RUN HISTORY LOGGER ---
try {
  console.log('\nUpdating quality history...');
  execSync('node tools/nv-quality-history.mjs', { cwd: ROOT, stdio: 'inherit' });
} catch (err) {
  console.error('\n--- FAILED to update quality history ---');
  console.error(err.stdout.toString() + err.stderr.toString());
  // Do not fail the overall process for this non-critical data-gathering step.
}

// --- ALWAYS RUN PROMPT QUALITY SCORE ---
try {
  console.log('\nScoring prompt quality...');
  execSync('npm run audit:score', { cwd: ROOT, stdio: 'inherit' });
} catch (err) {
  console.error('\n--- FAILED to score prompt quality ---');
  console.error(err.stdout.toString() + err.stderr.toString());
  // Do not fail the overall process for this non-critical data-gathering step.
}

if (failed) process.exit(1);