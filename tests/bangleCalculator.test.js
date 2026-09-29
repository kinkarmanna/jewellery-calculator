import {
    calculateInnerDiameter,
    calculateOuterCircumference,
    calculateBangleDetails
} from '../js/calculations/bangleCalculator.js';
import assert from 'assert';

let passed = 0;
let failed = 0;

function runTest(name, actual, expected) {
    try {
        if (typeof expected === 'number' && !Number.isInteger(expected)) {
            assert.ok(Math.abs(actual - expected) < 0.01, `${actual} ≠ ${expected}`);
        } else {
            assert.strictEqual(actual, expected);
        }
        console.log(`✅ PASS: ${name}`);
        passed++;
    } catch (e) {
        console.error(`❌ FAIL: ${name}`);
        console.error(`   Expected:`, expected);
        console.error(`   Got:     `, actual);
        failed++;
    }
}

function runOutputTest(name, params, expectedOutputs) {
    const result = calculateBangleDetails(params);
    try {
        for (const key of Object.keys(expectedOutputs)) {
            const actual = result.outputs[key];
            const expected = expectedOutputs[key];
            if (typeof expected === 'number' && !Number.isInteger(expected)) {
                assert.ok(Math.abs(actual - expected) < 0.1, `${key}: ${actual} ≈ ${expected}`);
            } else {
                assert.strictEqual(actual, expected, `${key}: ${actual} !== ${expected}`);
            }
        }
        console.log(`✅ PASS: ${name}`);
        passed++;
    } catch (e) {
        console.error(`❌ FAIL: ${name}`);
        console.error(`   Expected:`, expectedOutputs);
        console.error(`   Got:     `, result.outputs);
        failed++;
    }
}

console.log("═══════════════════════════════════════════");
console.log("  Bangle Calculator Tests");
console.log("═══════════════════════════════════════════\n");

console.log("── Inner Diameter Calculation ──");
runTest("Round Inner Dia", calculateInnerDiameter('Round', 57.3, 0, 0), 57.3);
runTest("Oval Inner Dia (Avg)", calculateInnerDiameter('Oval', 0, 54.0, 60.0), 57.0);
runTest("Invalid Round", calculateInnerDiameter('Round', -5, 0, 0), 0);
runTest("Invalid Oval", calculateInnerDiameter('Oval', 0, -5, 60), 0);

console.log("\n── Outer Circumference Calculation ──");
runTest("Outer Circ (57.3 dia, 4.0 height)", calculateOuterCircumference(57.3, 4.0), (57.3 + 4.0 * 2) * Math.PI);
runTest("Invalid Height", calculateOuterCircumference(57.3, -4), 0);

console.log("\n── Standard Calculations ──");

// Round Bangle
// Inner = 57.3, Height = 4.0 => Outer dia = 57.3 + 4.0×2 = 65.3
// Outer circ = 65.3 × π ≈ 205.12
// Stone = 2.0, Gap = 0.5 => Pitch = 2.5
runOutputTest("Round Bangle Calculation", {
    bangleShape: 'Round', diameter: 57.3, height: 4.0,
    rows: 1, quantity: 1,
    stoneShape: 'Round', stoneSize: 2.0, stoneGap: 0.5
}, {
    innerDiameter: 57.3,
    outerCircumference: 205.12,
    stonesPerRow: 82,
    baseStones: 82,
    finalStonesPerBangle: 82,
    totalStones: 82
});

// Oval Bangle
// Short = 54, Long = 60 => Avg Inner = 57.0
// Height = 4.0 => Outer dia = 57.0 + 4.0×2 = 65.0
// Outer circ = 65.0 × π ≈ 204.20
// Stone = 2.0, Gap = 0.5 => Pitch = 2.5
// Stones = floor(204.20 / 2.5) = 81
runOutputTest("Oval Bangle Calculation", {
    bangleShape: 'Oval', shortDiameter: 54.0, longDiameter: 60.0, height: 4.0,
    rows: 1, quantity: 1,
    stoneShape: 'Round', stoneSize: 2.0, stoneGap: 0.5
}, {
    innerDiameter: 57.0,
    outerCircumference: 204.20,
    stonesPerRow: 81,
    baseStones: 81,
    finalStonesPerBangle: 81,
    totalStones: 81
});

console.log("\n── Spacing Mode / Target Stones ──");
// Oval: 57.0 avg, Height 4.0 => Outer dia = 65.0 => circ = 204.20
// Absolute Max (Gap = 0, Stone = 2.0) = floor(204.20 / 2.0) = 102
// Target = 60 => Gap = (204.20 / 60) - 2.0 = 3.403 - 2.0 = 1.40
runOutputTest("Target Stones: 60", {
    bangleShape: 'Oval', shortDiameter: 54.0, longDiameter: 60.0, height: 4.0,
    rows: 1, quantity: 1,
    stoneShape: 'Round', stoneSize: 2.0, stoneGap: 0,
    spacingMode: 'target', targetStones: 60
}, {
    stonesPerRow: 60,
    computedGap: 1.40,
    baseStones: 60,
    absoluteMaxStonesPerRow: 102
});

runOutputTest("Target Stones: 120 (exceeds max of 102)", {
    bangleShape: 'Oval', shortDiameter: 54.0, longDiameter: 60.0, height: 4.0,
    rows: 1, quantity: 1,
    stoneShape: 'Round', stoneSize: 2.0, stoneGap: 0,
    spacingMode: 'target', targetStones: 120
}, {
    stonesPerRow: 102, // capped at 102
    absoluteMaxStonesPerRow: 102
});

// ─── Summary ──────────────────────────────────────────────────────
console.log("\n═══════════════════════════════════════════");
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log("═══════════════════════════════════════════");
process.exit(failed > 0 ? 1 : 0);
