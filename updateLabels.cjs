const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('<label class="group-label">Spacing Calculation:</label>', '<label class="group-label">Select Calculation Mode:</label>');
html = html.replace('<label for="spacing-gap">Prong Spacing</label>', '<label for="spacing-gap">Number of stone calculation</label>');
html = html.replace('<label for="spacing-target">Target Stones</label>', '<label for="spacing-target">Stone to Stone Gap Calculation</label>');
html = html.replace(/\?v=12/g, '?v=13');

fs.writeFileSync('index.html', html, 'utf8');
