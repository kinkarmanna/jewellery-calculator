import { calculateCustomBangleComparison } from '../js/calculations/customBangleCalculator.js';
import assert from 'assert';

let passed = 0;
let failed = 0;

function runTest(name, fn) {
    try {
        fn();
        console.log(`✅ PASS: ${name}`);
        passed++;
    } catch (e) {
        console.error(`❌ FAIL: ${name}`);
        console.error(`   `, e.message);
        failed++;
    }
}

console.log("═══════════════════════════════════════════");
console.log("  Custom Bangle Comparison Tests");
console.log("═══════════════════════════════════════════\n");

runTest("Resize Bangle with keep_gap: Round 57.3mm to 60.0mm", () => {
    // Standard: 57.3mm dia, 4.0mm height => outer dia = 65.3 => circ = 65.3 * PI = 205.146 mm
    // Standard gap = 0.2, stone = 2.0 => pitch = 2.2 => stones = floor(205.146 / 2.2) = 93
    // Custom: 60.0mm dia, 4.0mm height => outer dia = 68.0 => circ = 68.0 * PI = 213.628 mm
    // pitch = 2.2 => stones = floor(213.628 / 2.2) = 97
    // Difference: +4 stones
    const result = calculateCustomBangleComparison({
        stdShape: 'Round',
        stdDiameter: 57.3,
        stdHeight: 4.0,
        stdStoneSize: 2.0,
        stdProngStyle: 'common',

        custShape: 'Round',
        custDiameter: 60.0,
        custHeight: 4.0,
        custStoneSize: 2.0,
        spacingMode: 'keep_gap',

        rows: 1,
        quantity: 1
    });

    assert.strictEqual(result.standard.stonesPerRow, 93);
    assert.strictEqual(result.custom.stonesPerRow, 97);
    assert.strictEqual(result.difference.stonesPerRow, 4);
    assert.strictEqual(result.difference.totalStones, 4);
});

runTest("Keep existing bangle gap when user specifies existing stone count", () => {
    // Suppose standard bangle has outer circ = 205.146 mm, and craftsman set exactly 90 stones.
    // The existing gap on standard = (205.146 / 90) - 2.0 = 2.2794 - 2.0 = 0.2794 mm.
    // When resizing to 60.0mm (circ = 213.628 mm) with keep_gap:
    // pitch = 2.0 + 0.2794 = 2.2794 mm => custom stones = floor(213.628 / 2.2794) = 93 stones.
    const result = calculateCustomBangleComparison({
        stdShape: 'Round',
        stdDiameter: 57.3,
        stdHeight: 4.0,
        stdStoneSize: 2.0,
        stdStoneCount: 90,

        custShape: 'Round',
        custDiameter: 60.0,
        custHeight: 4.0,
        custStoneSize: 2.0,
        spacingMode: 'keep_gap'
    });

    assert.strictEqual(result.standard.stonesPerRow, 90);
    assert.ok(Math.abs(result.standard.gap - 0.279) < 0.01);
    assert.ok(Math.abs(result.custom.gap - 0.279) < 0.01);
    assert.strictEqual(result.custom.stonesPerRow, 93);
    assert.strictEqual(result.difference.stonesPerRow, 3);
});

runTest("Stone Size Upgrade: 2.0mm to 2.5mm on same size bangle", () => {
    // Standard: 57.3mm, stone = 2.0mm, gap = 0.2mm => pitch = 2.2mm => 93 stones
    // Custom: 57.3mm, stone = 2.5mm, gap = 0.2mm => pitch = 2.7mm => 75 stones
    // Difference: -18 stones
    const result = calculateCustomBangleComparison({
        stdShape: 'Round',
        stdDiameter: 57.3,
        stdHeight: 4.0,
        stdStoneSize: 2.0,
        stdProngStyle: 'common',

        custShape: 'Round',
        custDiameter: 57.3,
        custHeight: 4.0,
        custStoneSize: 2.5,
        custProngStyle: 'common',
        spacingMode: 'standard_prong'
    });

    assert.strictEqual(result.standard.stonesPerRow, 93);
    assert.strictEqual(result.custom.stonesPerRow, 75);
    assert.strictEqual(result.difference.stonesPerRow, -18);
});

runTest("Target Stone Mode on Custom Bangle", () => {
    // Custom target stones = 80
    const result = calculateCustomBangleComparison({
        stdShape: 'Round',
        stdDiameter: 57.3,
        stdHeight: 4.0,
        stdStoneSize: 2.0,

        custShape: 'Round',
        custDiameter: 57.3,
        custHeight: 4.0,
        custStoneSize: 2.0,
        spacingMode: 'target_stones',
        custTargetStones: 80
    });

    assert.strictEqual(result.custom.stonesPerRow, 80);
    // circ = 205.146 / 80 = 2.564 - 2.0 = 0.564 mm gap
    assert.ok(Math.abs(result.custom.gap - 0.564) < 0.01);
});

console.log("\n═══════════════════════════════════════════");
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log("═══════════════════════════════════════════");
process.exit(failed > 0 ? 1 : 0);
