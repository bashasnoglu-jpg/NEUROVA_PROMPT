const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\dev\\NEUROVA_PROMPT_FRESH\\NEUROVA_SITE';
const extensions = ['.html', '.json', '.js', '.css'];

const replacements = [
    // Lowercase Turkish
    { find: /Ã¼/g, replace: 'ü' },
    { find: /ÅŸ/g, replace: 'ş' },
    { find: /Ä±/g, replace: 'ı' },
    { find: /Ã¶/g, replace: 'ö' },
    { find: /Ã§/g, replace: 'ç' },
    { find: /ÄŸ/g, replace: 'ğ' },
    // Uppercase Turkish
    { find: /Ãœ/g, replace: 'Ü' },
    { find: /Åž/g, replace: 'Ş' },
    { find: /Ä°/g, replace: 'İ' },
    { find: /Ã–/g, replace: 'Ö' },
    { find: /Ã‡/g, replace: 'Ç' },
    { find: /Ä/g, replace: 'Ğ' }, // The G usually renders weirdly, sometimes different bytes.
    // Symbols
    { find: /Â©/g, replace: '©' },
    { find: /â€“/g, replace: '–' }, // en dash
    { find: /â€¢/g, replace: '•' }, // bullet
    { find: /â€™/g, replace: '’' }, // smart quote
    { find: /â€œ/g, replace: '“' }, // left double smart
    { find: /â€/g, replace: '”' }, // right double smart (partial match danger, but usually okay in context)
    // Common combinations from grep
    { find: /Ä±/g, replace: 'ı' },
];

function traverse(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            traverse(fullPath);
        } else {
            const ext = path.extname(fullPath).toLowerCase();
            if (extensions.includes(ext)) {
                processFile(fullPath);
            }
        }
    });
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Safety check: if file is binary or massive, skip?
    // For this site, files are small.

    replacements.forEach(pair => {
        content = content.replace(pair.find, pair.replace);
    });

    // Special fix for "ÄŸ" which has a variable representation sometimes
    content = content.replace(/ÄŸ/g, 'ğ');
    content = content.replace(/Ä/g, 'Ğ');

    if (content !== original) {
        console.log(`Fixing mojibake in: ${filePath}`);
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

console.log('Starting Mojibake Repair...');
traverse(rootDir);
console.log('Repair Complete.');
