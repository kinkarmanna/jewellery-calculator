const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('<div class="card-icon">📏</div>', '<img src="images/bracelet-card.jpg" class="card-image" alt="Tennis Bracelet">');
html = html.replace(/\?v=12/g, '?v=13');

fs.writeFileSync('index.html', html, 'utf8');
