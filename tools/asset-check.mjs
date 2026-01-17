import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const IGNORE_DIRS = ['node_modules', '.git', '_audit', 'dist', 'build', '_backup', '_archive'];

function walk(dir, results = []) {
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (IGNORE_DIRS.includes(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath, results);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
        results.push(fullPath);
      }
    }
  } catch (err) {
    // Ignore errors from non-existent directories
  }
  return results;
}

function findRefsInHtml(htmlText) {
  const refs = new Set();
  const re = /\b(?:src|href)\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = re.exec(htmlText)) !== null) {
    const ref = match[1].trim();
    if (ref && !ref.startsWith('http') && !ref.startsWith('data:') && !ref.startsWith('#') && !ref.startsWith('mailto:')) {
      refs.add(ref.split('?')[0].split('#')[0]);
    }
  }
  return [...refs];
}

const htmlFiles = walk(ROOT);
let errors = 0;

for (const htmlFile of htmlFiles) {
  const content = fs.readFileSync(htmlFile, 'utf8');
  const refs = findRefsInHtml(content);
  const baseDir = path.dirname(htmlFile);

  for (const ref of refs) {
    const resolvedPath = path.resolve(baseDir, ref);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`[MISSING ASSET] in ${path.relative(ROOT, htmlFile)} -> ${ref}`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\n❌ ASSET CHECK FAILED (${errors} missing assets)`);
  process.exit(1);
}