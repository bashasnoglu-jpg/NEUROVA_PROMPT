import fs from 'fs';
import path from 'path';

const reportPath = path.join(process.cwd(), '_audit', 'NV_MEGA_SCAN_REPORT.md');

if (!fs.existsSync(reportPath)) {
  console.log('No MEGA SCAN report found.');
  process.exit(0);
}

const content = fs.readFileSync(reportPath, 'utf8');
const lines = content.split('\n');

const failedLine = lines.find(l => l.startsWith('❌'));

if (failedLine) {
  console.log(`CI FAIL REASON: ${failedLine.replace('❌ ', '')}`);
} else {
  console.log('CI STATUS: PASSED');
}