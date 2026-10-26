import { estimateCaratWeight, calculateBraceletDetails, convertLengthToMm } from '../js/calculations/braceletCalculator.js';
import { calculatePricing } from '../js/calculations/valueCalculator.js';
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

runTest("Bracelet Calculation in Inches (7 inches, 2mm stone, 0.5mm gap)", () => {
    // 7 inches = 177.8 mm; pitch = 2.0 + 0.5 = 2.5 mm; stones = floor(177.8 / 2.5) = 71
    const result = calculateBraceletDetails({
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
