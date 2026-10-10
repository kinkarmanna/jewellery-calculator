const fs = require('fs');

// 1. UPDATE ringForm.js
let ringForm = fs.readFileSync('js/ui/ringForm.js', 'utf8');

// Replace bindings
ringForm = ringForm.replace(
    /const standardSelect = document\.getElementById\('ring-size-standard'\);\s*const sizeValueSelect = document\.getElementById\('ring-size-value'\);/,
    "const diameterInput = document.getElementById('ring-diameter');"
);

// Remove init bindings for size selects
ringForm = ringForm.replace(
    /standardSelect\.addEventListener\('change', populateSizeValues\);\s*/,
    ""
);

// Remove populateSizeValues function
ringForm = ringForm.replace(
    /function populateSizeValues\(\) \{[\s\S]*?\}\s*(?=function switchSettingStyle)/,
    ""
);

// Update resetRingForm
ringForm = ringForm.replace(
    /standardSelect\.value = DEFAULT_RING_VALUES\.sizeStandard;\s*populateSizeValues\(\);\s*sizeValueSelect\.value = DEFAULT_RING_VALUES\.sizeValue;/,
    "diameterInput.value = 18.0;" // Default ring diameter
);

// Update handleFormSubmit
ringForm = ringForm.replace(
    /sizeStandard: standardSelect\.value,\s*sizeValue: parseFloat\(sizeValueSelect\.value\),/,
    "diameter: parseFloat(diameterInput.value),"
);

fs.writeFileSync('js/ui/ringForm.js', ringForm, 'utf8');

// 2. UPDATE ringCalculator.js
let ringCalc = fs.readFileSync('js/calculations/ringCalculator.js', 'utf8');

// Remove getRingDiameter
ringCalc = ringCalc.replace(
    /export function getRingDiameter[\s\S]*?(?=export function calculateRingDetails)/,
    ""
);

// Update calculateRingDetails destructuring and call
ringCalc = ringCalc.replace(
    /sizeStandard,\s*sizeValue,\s*coverage,/,
    "diameter,\n        coverage,"
);

ringCalc = ringCalc.replace(
    /const diameter = getRingDiameter\(sizeStandard, sizeValue\);\s*const circumference = diameter \* Math\.PI;/,
    "const circumference = (diameter > 0 ? diameter : 0) * Math.PI;"
);

// Keep inputs in output
ringCalc = ringCalc.replace(
    /inputs: \{ \.\.\.params, diameter, circumference \}/,
    "inputs: { ...params, circumference }"
);

fs.writeFileSync('js/calculations/ringCalculator.js', ringCalc, 'utf8');

// 3. UPDATE resultView.js
let resultView = fs.readFileSync('js/ui/resultView.js', 'utf8');

resultView = resultView.replace(
    /<span class="result-value">\$\{data\.inputs\.sizeStandard\} \$\{data\.inputs\.sizeValue\} \(Ø \$\{data\.inputs\.diameter\} mm\)<\/span>/,
    '<span class="result-value">Ø ${data.inputs.diameter} mm</span>'
);

fs.writeFileSync('js/ui/resultView.js', resultView, 'utf8');

console.log("Updated ring UI and calc");
