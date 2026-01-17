import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv); // For date format validation in schema
const ROOT = process.cwd();

// --- Schema and Directory Setup ---
const PACKS_DIR_CANDIDATES = [
  path.join(ROOT, "NEUROVA_PROMPT", "packs"),
  path.join(ROOT, "packs"),
];
const PACKS_DIR = PACKS_DIR_CANDIDATES.find(p => fs.existsSync(p));

const PACK_SCHEMA_PATH = path.join(ROOT, 'schemas/pack.schema.json');
const PROMPT_SCHEMA_CANDIDATES = [
    path.join(ROOT, 'schemas/prompt.schema.json'),
    path.join(ROOT, 'tools/prompt.schema.json') // Legacy location
];
const PROMPT_SCHEMA_PATH = PROMPT_SCHEMA_CANDIDATES.find(p => fs.existsSync(p));

// --- Main Audit Logic ---
async function runAudit() {
  if (!PACKS_DIR) {
    console.log('✅ PROMPT PACK SCHEMA PASSED (No packs directory found, skipping)');
    return;
  }

  if (!fs.existsSync(PACK_SCHEMA_PATH) || !PROMPT_SCHEMA_PATH) {
    console.error(`❌ SCHEMA MISSING: Ensure schemas/pack.schema.json and a prompt schema exist.`);
    process.exit(1);
  }

  const packSchema = JSON.parse(fs.readFileSync(PACK_SCHEMA_PATH, 'utf8'));
  const promptSchema = JSON.parse(fs.readFileSync(PROMPT_SCHEMA_PATH, 'utf8'));
  const validatePack = ajv.compile(packSchema);
  const validatePrompt = ajv.compile(promptSchema);

  const seenIds = new Set();
  let errors = 0;

  const packFiles = fs.readdirSync(PACKS_DIR).filter(
    file => file.toLowerCase().startsWith('pack.') && file.toLowerCase().endsWith('.js')
  );

  for (const file of packFiles) {
    const packPath = path.join(PACKS_DIR, file);
    // Use file:// protocol for cross-platform compatibility with dynamic import()
    const packUrl = 'file:///' + packPath.replace(/\\/g, '/');

    try {
      const mod = await import(packUrl);
      const pack = mod.default;

      if (typeof pack !== 'object' || pack === null) {
          errors++;
          console.error(`❌ EXPORT FAIL → ${file}: Default export is not an object.`);
          continue;
      }

      // 1. Validate the pack structure
      if (!validatePack(pack)) {
        errors++;
        console.error(`❌ PACK SCHEMA FAIL → ${file}`);
        validatePack.errors.forEach(e =>
          console.error(`   → ${e.instancePath || '/'} ${e.message}`)
        );
        continue; // Don't validate prompts if pack structure is wrong
      }

      // 2. Validate individual prompts
      const prompts = pack.prompts || [];
      for (const p of prompts) {
        if (!validatePrompt(p)) {
          errors++;
          console.error(`❌ PROMPT SCHEMA FAIL → ${file} :: ${p.id || '(no id)'}`);
          validatePrompt.errors.forEach(e =>
            console.error(`   → ${e.instancePath || '/'} ${e.message}`)
          );
        }

        // 3. Check for duplicate IDs
        if (p && p.id) {
            if (seenIds.has(p.id)) {
              errors++;
              console.error(`❌ DUPLICATE ID → ${p.id} (in ${file})`);
            } else {
              seenIds.add(p.id);
            }
        }
      }
    } catch (e) {
      errors++;
      console.error(`❌ IMPORT/EXEC FAIL → ${file}`);
      console.error(`   → ${e.message}`);
    }
  }

  if (errors > 0) {
    console.error(`\n❌ PROMPT PACK SCHEMA FAILED (${errors} errors)`);
    process.exit(1);
  }

  console.log('✅ PROMPT PACK SCHEMA PASSED');
}

runAudit();