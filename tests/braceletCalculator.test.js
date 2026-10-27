import { estimateCaratWeight, calculateBraceletDetails, convertLengthToMm, getBraceletSizeEntry } from '../js/calculations/braceletCalculator.js';
import { calculatePricing } from '../js/calculations/valueCalculator.js';
import { BRACELET_SIZE_CODES, BRACELET_SIZE_TOLERANCE } from '../js/config/defaults.js';
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
console.log("  Bracelet & Value Calculator Tests");
console.log("═══════════════════════════════════════════\n");

console.log("── Size Code Lookup (A–Z) ──");

runTest("BRACELET_SIZE_CODES has 26 entries (A–Z) and tolerance ±0.20 cm", () => {
    assert.strictEqual(BRACELET_SIZE_CODES.length, 26);
    assert.strictEqual(BRACELET_SIZE_TOLERANCE, 0.20);
    assert.strictEqual(BRACELET_SIZE_CODES[0].code, 'A');
    assert.strictEqual(BRACELET_SIZE_CODES[25].code, 'Z');
});

runTest("Lookup Code A (Ladies - NA)", () => {
    const entry = getBraceletSizeEntry('A');
    assert.notStrictEqual(entry, null);
    assert.strictEqual(entry.code, 'A');
    assert.strictEqual(entry.category, 'Ladies');
    assert.strictEqual(entry.lengthCm, null);
});

runTest("Lookup Code B (Ladies - 18.0 cm / 180 mm)", () => {
    const entry = getBraceletSizeEntry('B');
    assert.strictEqual(entry.category, 'Ladies');
    assert.strictEqual(entry.lengthCm, 18.0);
    assert.strictEqual(entry.lengthMm, 180);
});

runTest("Lookup Code F (Gents - 20.0 cm / 200 mm)", () => {
    const entry = getBraceletSizeEntry('F');
    assert.strictEqual(entry.category, 'Gents');
    assert.strictEqual(entry.lengthCm, 20.0);
    assert.strictEqual(entry.lengthMm, 200);
});

runTest("Lookup Code O (Baby - 12.0 cm / 120 mm)", () => {
    const entry = getBraceletSizeEntry('O');
    assert.strictEqual(entry.category, 'Baby');
    assert.strictEqual(entry.lengthCm, 12.0);
    assert.strictEqual(entry.lengthMm, 120);
});

runTest("Lookup Code W (Ladies - 16.0 cm / 160 mm)", () => {
    const entry = getBraceletSizeEntry('w'); // case-insensitive
    assert.strictEqual(entry.category, 'Ladies');
    assert.strictEqual(entry.lengthCm, 16.0);
    assert.strictEqual(entry.lengthMm, 160);
});

runTest("Lookup Invalid Code returns null", () => {
    assert.strictEqual(getBraceletSizeEntry('INVALID'), null);
    assert.strictEqual(getBraceletSizeEntry(''), null);
    assert.strictEqual(getBraceletSizeEntry(null), null);
});

console.log("\n── Conversions & Estimates ──");

runTest("Carat Weight Estimation for Round 2.0mm (30 stones)", () => {
    // 2.0 mm round stone = 0.033 ct each * 30 stones = 0.99 ct
    const weight = estimateCaratWeight('Round', 2.0, 30);
    assert.strictEqual(weight, '0.99');
});

runTest("Carat Weight returns null for non-round shapes", () => {
    const weight = estimateCaratWeight('Princess', 2.0, 30);
    assert.strictEqual(weight, null);
});

runTest("convertLengthToMm conversions (in, cm, mm)", () => {
    assert.strictEqual(convertLengthToMm(7.0, 'in'), 177.8);
    assert.strictEqual(convertLengthToMm(18.0, 'cm'), 180);
    assert.strictEqual(convertLengthToMm(175.0, 'mm'), 175);
});

console.log("\n── Easy-Select Bracelet Calculations ──");

runTest("Easy Select Code B (Ladies 18.0 cm, 2mm stone, 0.5mm gap)", () => {
    // 18 cm = 180 mm; pitch = 2.0 + 0.5 = 2.5 mm; stones = floor(180 / 2.5) = 72
    const result = calculateBraceletDetails({
        sizeMode: 'easy',
        sizeCode: 'B',
        rows: 1,
        quantity: 1,
        stoneShape: 'Round',
        stoneSize: 2.0,
        stoneGap: 0.5
    });
    assert.strictEqual(result.outputs.sizeCode, 'B');
    assert.strictEqual(result.outputs.sizeCategory, 'Ladies');
    assert.strictEqual(result.outputs.length, 18.0);
    assert.strictEqual(result.outputs.lengthUnit, 'cm');
    assert.strictEqual(result.outputs.lengthMm, 180);
    assert.strictEqual(result.outputs.stonesPerRow, 72);
    assert.strictEqual(result.outputs.totalStones, 72);
    assert.strictEqual(result.outputs.totalCaratWeight, '2.38'); // 72 * 0.033 = 2.376 => 2.38
});

runTest("Easy Select Code F (Gents 20.0 cm, 2mm stone, 0.5mm gap)", () => {
    // 20 cm = 200 mm; pitch = 2.5 mm; stones = floor(200 / 2.5) = 80
    const result = calculateBraceletDetails({
        sizeMode: 'easy',
        sizeCode: 'F',
        rows: 1,
        quantity: 1,
        stoneShape: 'Round',
        stoneSize: 2.0,
        stoneGap: 0.5
    });
    assert.strictEqual(result.outputs.sizeCode, 'F');
    assert.strictEqual(result.outputs.sizeCategory, 'Gents');
    assert.strictEqual(result.outputs.lengthMm, 200);
    assert.strictEqual(result.outputs.stonesPerRow, 80);
    assert.strictEqual(result.outputs.totalStones, 80);
});

runTest("Easy Select Code O (Baby 12.0 cm, 2mm stone, 0.5mm gap)", () => {
    // 12 cm = 120 mm; pitch = 2.5 mm; stones = floor(120 / 2.5) = 48
    const result = calculateBraceletDetails({
        sizeMode: 'easy',
        sizeCode: 'O',
        rows: 1,
        quantity: 1,
        stoneShape: 'Round',
        stoneSize: 2.0,
        stoneGap: 0.5
    });
    assert.strictEqual(result.outputs.sizeCode, 'O');
    assert.strictEqual(result.outputs.sizeCategory, 'Baby');
    assert.strictEqual(result.outputs.lengthMm, 120);
    assert.strictEqual(result.outputs.stonesPerRow, 48);
    assert.strictEqual(result.outputs.totalStones, 48);
});

console.log("\n── Manual Entry Bracelet Calculations ──");

runTest("Bracelet Calculation in Inches (7 inches, 2mm stone, 0.5mm gap)", () => {
    // 7 inches = 177.8 mm; pitch = 2.0 + 0.5 = 2.5 mm; stones = floor(177.8 / 2.5) = 71
    const result = calculateBraceletDetails({
        sizeMode: 'manual',
        length: 7.0,
        lengthUnit: 'in',
        rows: 1,
        quantity: 1,
        stoneShape: 'Round',
        stoneSize: 2.0,
        useNickPlate: false,
        stoneGap: 0.5,
        prongStyle: 'self'
    });
    assert.strictEqual(result.outputs.lengthMm, 177.8);
    assert.strictEqual(result.outputs.stonesPerRow, 71);
    assert.strictEqual(result.outputs.totalStones, 71);
    assert.strictEqual(result.outputs.totalCaratWeight, '2.34'); // 71 * 0.033 = 2.343 => 2.34
});

runTest("Bracelet Calculation in cm (18 cm, 2mm stone, 0.5mm gap)", () => {
    // 18 cm = 180 mm; pitch = 2.5 mm; stones = floor(180 / 2.5) = 72
    const result = calculateBraceletDetails({
        sizeMode: 'manual',
        length: 18.0,
        lengthUnit: 'cm',
        rows: 1,
        quantity: 1,
        stoneShape: 'Round',
        stoneSize: 2.0,
        useNickPlate: false,
        stoneGap: 0.5,
        prongStyle: 'self'
    });
    assert.strictEqual(result.outputs.lengthMm, 180);
    assert.strictEqual(result.outputs.stonesPerRow, 72);
    assert.strictEqual(result.outputs.totalStones, 72);
});

runTest("Bracelet Calculation in mm (175 mm, 2mm stone, 0.5mm gap)", () => {
    // 175 mm; pitch = 2.5 mm; stones = floor(175 / 2.5) = 70
    const result = calculateBraceletDetails({
        sizeMode: 'manual',
        length: 175.0,
        lengthUnit: 'mm',
        rows: 1,
        quantity: 1,
        stoneShape: 'Round',
        stoneSize: 2.0,
        useNickPlate: false,
        stoneGap: 0.5,
        prongStyle: 'self'
    });
    assert.strictEqual(result.outputs.lengthMm, 175);
    assert.strictEqual(result.outputs.stonesPerRow, 70);
    assert.strictEqual(result.outputs.totalStones, 70);
});

console.log("\n── Value Calculator Pricing ──");

runTest("Value Calculator Pricing (Stone value + Gold value + Making charge on total material + 3% GST)", () => {
    // 2 ct @ 10,000/ct = 20,000
    // 10g gold @ 5,000/g = 50,000
    // Total Material Value = 70,000
    // Making charge 10% on 70,000 = 7,000
    // Subtotal = 77,000
    // GST 3% on 77,000 = 2,310
    // Grand Total = 79,310
    const pricing = calculatePricing(2.0, 10000, 10, 5000, 10);
    assert.strictEqual(pricing.stoneValue, 20000);
    assert.strictEqual(pricing.goldValue, 50000);
    assert.strictEqual(pricing.totalMaterialValue, 70000);
    assert.strictEqual(pricing.makingCharge, 7000);
    assert.strictEqual(pricing.subtotal, 77000);
    assert.strictEqual(pricing.gstAmount, 2310);
    assert.strictEqual(pricing.grandTotal, 79310);
});

console.log("\n═══════════════════════════════════════════");
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log("═══════════════════════════════════════════");
process.exit(failed > 0 ? 1 : 0);
