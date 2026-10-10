const fs = require('fs');

// Read defaults.js as a buffer to handle mixed encodings
const buf = fs.readFileSync('js/config/defaults.js');
let str = buf.toString('utf8');

// Find the corrupted UTF-16 portion which often starts with \0 or just weird spacing
const cleanPartMatch = str.match(/[\s\S]*\];/);
if (cleanPartMatch) {
    str = cleanPartMatch[0];
}

str += '\n\nexport const DEFAULT_BRACELET_VALUES = {\n    length: 7.0,\n    lockLength: 10.0,\n    rows: 1,\n    quantity: 1,\n    stoneShape: "Round",\n    stoneSize: 2.0,\n    stoneGap: 0.5,\n    wastagePercent: 0\n};\n';

fs.writeFileSync('js/config/defaults.js', str, 'utf8');

// Also update cache busters safely in all JS files
function bumpVersions(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = require('path').join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            bumpVersions(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            content = content.replace(/\?v=\d+/g, '?v=11');
            fs.writeFileSync(fullPath, content, 'utf8');
        }
    }
}
bumpVersions('.');
