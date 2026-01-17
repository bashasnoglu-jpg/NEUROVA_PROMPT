import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });
const ROOT = process.cwd();

const checks = [
  {
    file: 'package.json',
    schema: 'schemas/package.schema.json'
  },
  {
    file: 'manifest.json',
    schema: 'schemas/manifest.schema.json'
  }
];

let errors = 0;

for (const check of checks) {
  const filePath = path.join(ROOT, check.file);
  const schemaPath = path.join(ROOT, check.schema);

  if (!fs.existsSync(filePath) || !fs.existsSync(schemaPath)) continue;

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    errors++;
    console.error(`❌ SCHEMA FAIL: ${check.file}`);
    validate.errors.forEach(e => {
      console.error(`  → ${e.instancePath || '/'} ${e.message}`);
    });
  }
}

if (errors > 0) {
  process.exit(1);
}

console.log('✅ SCHEMA VALIDATION PASSED');