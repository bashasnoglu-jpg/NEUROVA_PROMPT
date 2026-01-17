import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, '_audit', 'NV_JSON_REPORT.md');

const MUST_CHECK = new Set([
  'package.json',
  'package-lock.json',
  'manifest.json'
]);

const SKIP_DIRS = [
  'node_modules',
  '.git',
  '_audit',
  'dist',
  'build'
];

const JSONC_FILES = [
  'tsconfig.json'
];

const results = {
  ERROR: [],
  WARN: [],
  INFO: []
};

function shouldSkip(filePath) {
  return SKIP_DIRS.some(dir => filePath.includes(`${path.sep}${dir}${path.sep}`));
}

function isJsonc(filePath) {
  return JSONC_FILES.some(name => filePath.endsWith(name));
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (shouldSkip(fullPath)) continue;

    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }
  return files;
}

function audit() {
  const files = walk(ROOT);

  for (const file of files) {
    const base = path.basename(file);

    if (isJsonc(file) && !MUST_CHECK.has(base)) {
      results.INFO.push(`${file} (JSONC skipped)`);
      continue;
    }

    try {
      const raw = fs.readFileSync(file, 'utf8');
      JSON.parse(raw);
    } catch (err) {
      if (MUST_CHECK.has(base)) {
        results.ERROR.push(`${file} → ${err.message}`);
      } else {
        results.WARN.push(`${file} → ${err.message}`);
      }
    }
  }
}

function writeReport() {
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });

  const md = `
# NEUROVA JSON AUDIT REPORT

## ❌ Errors (${results.ERROR.length})
${results.ERROR.map(e => `- ${e}`).join('\n') || 'None'}

## ⚠️ Warnings (${results.WARN.length})
${results.WARN.map(w => `- ${w}`).join('\n') || 'None'}

## ℹ️ Info (${results.INFO.length})
${results.INFO.map(i => `- ${i}`).join('\n') || 'None'}
`;

  fs.writeFileSync(REPORT_PATH, md.trim());
}

audit();
writeReport();

if (results.ERROR.length > 0) {
  console.error(`❌ JSON AUDIT FAILED (${results.ERROR.length} error)`);
  process.exit(1);
}

console.log('✅ JSON AUDIT PASSED');