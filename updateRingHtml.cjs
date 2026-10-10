const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const regex = /<div class="field-row">\s*<div class="field">\s*<label for="ring-size-standard">Size Standard:[\s\S]*?<span class="input-hint">100 = Full Eternity, 50 = Half Eternity<\/span>/;
const replacement = `<div class="field-row">
                                <div class="field">
                                    <label for="ring-diameter">Inner Diameter (mm):</label>
                                    <input type="number" id="ring-diameter" step="0.1" min="1" required>
                                </div>
                                <div class="field">
                                    <label for="ring-coverage">Coverage (%):</label>
                                    <input type="number" id="ring-coverage" min="10" max="100" required>
                                </div>
                            </div>
                            <span class="input-hint">Coverage: 100 = Full Eternity, 50 = Half</span>`;

if (regex.test(html)) {
    html = html.replace(regex, replacement);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Success");
} else {
    console.log("Failed to match regex");
}
