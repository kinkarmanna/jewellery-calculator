import {
    getRingDiameter,
    getRingDiameterByCode,
    calculateOuterCircumference,
    calculateRingCircumference,
    calculateRingDetails
} from '../js/calculations/ringCalculator.js';
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
    const result = calculateRingDetails(params);
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
console.log("  Ring Calculator Tests");
console.log("═══════════════════════════════════════════\n");

console.log("── Size Code Lookup (A–Z) ──");
runTest("Get Code A Diameter (Baby)", getRingDiameterByCode('A'), 12.0);
runTest("Get Code F Diameter (Ladies)", getRingDiameterByCode('F'), 14.0);
runTest("Get Code P Diameter (Gents)", getRingDiameterByCode('P'), 18.0);
runTest("Get Code Z Diameter (Unisex)", getRingDiameterByCode('Z'), 21.9);
runTest("Get Invalid Code", getRingDiameterByCode('QQ'), 0);

console.log("\n── Legacy Diameter Lookup ──");
runTest("Get US Size 7 Diameter", getRingDiameter('US', 7), 17.3);
runTest("Get IN Size 10 Diameter", getRingDiameter('IN', 10), 15.3);
runTest("Get invalid standard", getRingDiameter('UK', 7), 0);
runTest("Get invalid size", getRingDiameter('US', 99), 0);

console.log("\n── Circumference ──");
runTest("Outer Circ (18.0 dia, 1.5 height)", calculateOuterCircumference(18.0, 1.5), (18.0 + 3.0) * Math.PI);
runTest("Outer Circ (18.0 dia, 0 height)", calculateOuterCircumference(18.0, 0), 18.0 * Math.PI);
runTest("Full Eternity US 7 (17.3mm)", calculateRingCircumference(17.3, 100), Math.PI * 17.3);
runTest("Full Eternity US 7 with 1.5mm height", calculateRingCircumference(17.3, 100, 1.5), (17.3 + 3.0) * Math.PI);
runTest("Half Eternity US 7 (17.3mm)", calculateRingCircumference(17.3, 50), Math.PI * 17.3 * 0.5);
runTest("Invalid diameter", calculateRingCircumference(-5, 100), 0);
runTest("Invalid coverage", calculateRingCircumference(17.3, -10), 0);

console.log("\n── Ring Calculations ──");

// US 7 => dia 17.3 => circ ≈ 54.349
// Full eternity (100%), Size: 2.0, Gap: 0.2 => Pitch = 2.2
// Stones = floor(54.349 / 2.2) = 24
runOutputTest("Full Eternity US 7", {
    sizeStandard: 'US', sizeValue: 7.0, coverage: 100,
    rows: 1, quantity: 1,
    stoneShape: 'Round', stoneSize: 2.0, stoneGap: 0.2, pricePerStone: 15
}, {
    diameter: 17.3,
    stonesPerRow: 24,
    baseStones: 24,
    finalStonesPerItem: 24,
    totalStones: 24
});

// Half eternity (50%), same dimensions. circ ≈ 27.174
// Stones = floor(27.174 / 2.2) = 12
runOutputTest("Half Eternity US 7", {
    sizeStandard: 'US', sizeValue: 7.0, coverage: 50,
    rows: 1, quantity: 1,
    stoneShape: 'Round', stoneSize: 2.0, stoneGap: 0.2, pricePerStone: 15
}, {
    diameter: 17.3,
    stonesPerRow: 12,
    baseStones: 12,
    finalStonesPerItem: 12,
    totalStones: 12
});

// Size Code P (18.0 mm dia) Full Eternity without height
// circ = PI * 18 = 56.548. Stones = floor(56.548 / 2.2) = 25
runOutputTest("Easy Select Code P without height", {
    sizeCode: 'P', coverage: 100,
    rows: 1, quantity: 1,
    stoneShape: 'Round', stoneSize: 2.0, stoneGap: 0.2
}, {
    diameter: 18.0,
    stonesPerRow: 25,
    baseStones: 25,
    finalStonesPerItem: 25,
    totalStones: 25
});

// Size Code P (18.0 mm dia) Full Eternity WITH default height 1.5 mm
// outerDia = 18.0 + 1.5*2 = 21.0. outerCirc = 21.0 * PI = 65.973. Stones = floor(65.973 / 2.2) = 29
runOutputTest("Easy Select Code P with 1.5mm height", {
    sizeCode: 'P', height: 1.5, coverage: 100,
    rows: 1, quantity: 1,
    stoneShape: 'Round', stoneSize: 2.0, stoneGap: 0.2
}, {
    diameter: 18.0,
    height: 1.5,
    stonesPerRow: 29,
    baseStones: 29,
    finalStonesPerItem: 29,
    totalStones: 29
});

// Manual Entry (16.5 mm dia) Full Eternity WITH 1.5 mm height
// outerDia = 16.5 + 3.0 = 19.5. outerCirc = 19.5 * PI = 61.261. Stones = floor(61.261 / 2.2) = 27
runOutputTest("Manual Entry 16.5 mm with 1.5mm height", {
    diameter: 16.5, height: 1.5, coverage: 100,
    rows: 1, quantity: 1,
    stoneShape: 'Round', stoneSize: 2.0, stoneGap: 0.2
}, {
    diameter: 16.5,
    height: 1.5,
    stonesPerRow: 27,
    baseStones: 27,
    finalStonesPerItem: 27,
    totalStones: 27
});

console.log("\n═══════════════════════════════════════════");
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log("═══════════════════════════════════════════");
process.exit(failed > 0 ? 1 : 0);
