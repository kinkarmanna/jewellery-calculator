const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const bangleBlock = html.match(/<div class="card active" id="card-bangle">[\s\S]*?<\/p>\s*<\/div>/)[0];
const ringBlock = html.match(/<div class="card" id="card-ring">[\s\S]*?<\/p>\s*<\/div>/)[0];
const earringBlock = html.match(/<div class="card disabled" id="card-earring">[\s\S]*?<\/p>\s*<\/div>/)[0];
const braceletBlock = html.match(/<div class="card" id="card-bracelet">[\s\S]*?<\/p>\s*<\/div>/)[0];

const newContainer = `<div class="cards-container">\n                ${bangleBlock}\n                ${braceletBlock}\n                ${ringBlock}\n                ${earringBlock}\n            </div>`;

html = html.replace(/<div class="cards-container">[\s\S]*?<\/div>\s*<\/section>/, newContainer + '\n        </section>');
fs.writeFileSync('index.html', html, 'utf8');
