import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const ASSETS_DIR = path.join(ROOT, 'NEUROVA_SITE', 'assets');

const CHECK_ONLY = process.argv.includes('--check');
let hasIssues = false;

/**
 * A simple function to convert non-ASCII characters to their closest ASCII equivalent.
 * @param {string} str The string to transliterate.
 * @returns {string}
 */
function transliterate(str) {
  const map = {
    'ç': 'c', 'Ç': 'C', 'ğ': 'g', 'Ğ': 'G', 'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O', 'ş': 's', 'Ş': 'S', 'ü': 'u', 'Ü': 'U'
  };
  return str.replace(/[çÇğĞıİöÖşŞüÜ]/g, char => map[char] || '');
}

function sanitizeFilename(filename) {
  const ext = path.extname(filename);
  let base = path.basename(filename, ext);

  base = transliterate(base);
  base = base.toLowerCase();
  base = base.replace(/\s+/g, '-').replace(/--+/g, '-');
  base = base.replace(/[^a-z0-9-]/g, '');
  base = base.replace(/^-+|-+$/g, '');

  return base + ext;
}

/**
 * Finds a unique filename in a directory to prevent overwrites.
 * @param {string} dir The directory to check in.
 * @param {string} filename The desired filename.
 * @returns {string} A unique filename.
 */
function getUniquePath(dir, filename) {
  let candidate = filename;
  let counter = 1;
  while (fs.existsSync(path.join(dir, candidate))) {
    const ext = path.extname(filename);
    const base = path.basename(filename, ext);
    candidate = `${base}-${counter}${ext}`;
    counter++;
  }
  return candidate;
}

function walkAndSanitize(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAndSanitize(fullPath);
    } else {
      const sanitizedName = sanitizeFilename(entry.name);
      if (entry.name !== sanitizedName) {
        hasIssues = true;

        if (CHECK_ONLY) {
          console.error(`❌ Invalid filename: ${path.relative(ROOT, fullPath)}`);
        } else {
          let finalName = sanitizedName;
          if (
            fs.existsSync(path.join(dir, sanitizedName)) &&
            path.resolve(fullPath) !== path.resolve(path.join(dir, sanitizedName))
          ) {
            finalName = getUniquePath(dir, sanitizedName);
          }

          const newPath = path.join(dir, finalName);
          fs.renameSync(fullPath, newPath);
          console.log(`✅ ${path.relative(ROOT, fullPath)} → ${finalName}`);
        }
      }
    }
  }
}

console.log(CHECK_ONLY ? '🔎 Checking asset filenames for hygiene...' : '🔎 Sanitizing filenames in asset directories...');
walkAndSanitize(ASSETS_DIR);

if (CHECK_ONLY) {
  if (hasIssues) {
    console.error('\n🚫 Asset filename violations found. Run `npm run sanitize:assets` to fix them.');
    process.exit(1);
  } else {
    console.log('✅ Asset filenames are clean.');
  }
} else {
  console.log('✨ Filename sanitization complete.');
}