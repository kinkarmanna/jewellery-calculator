import { getPrice, setPrice, removePrice, formatCurrency } from '../js/calculations/stonePriceManager.js';
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
        console.error(`   ${e.message}`);
        failed++;
    }
}

console.log("═══════════════════════════════════════════");
console.log("  Stone Price Manager Tests");
console.log("═══════════════════════════════════════════\n");

// ─── getPrice ─────────────────────────────────────────────────────
console.log("── getPrice ──");

const samplePrices = [
    { shape: 'Round', size: 2.0, pricePerStone: 15 },
    { shape: 'Princess', size: 3.0, pricePerStone: 50 }
];

runTest("Get existing price", () => {
    assert.strictEqual(getPrice(samplePrices, 'Round', 2.0), 15);
});

runTest("Get non-existent price returns null", () => {
    assert.strictEqual(getPrice(samplePrices, 'Oval', 2.0), null);
});

runTest("Get price from null array returns null", () => {
    assert.strictEqual(getPrice(null, 'Round', 2.0), null);
});

runTest("Get price from empty array returns null", () => {
    assert.strictEqual(getPrice([], 'Round', 2.0), null);
});

// ─── setPrice ─────────────────────────────────────────────────────
console.log("\n── setPrice ──");

runTest("Add new price entry", () => {
    const result = setPrice(samplePrices, 'Oval', 3.0, 45);
    assert.strictEqual(result.length, 3);
    assert.strictEqual(getPrice(result, 'Oval', 3.0), 45);
});

runTest("Update existing price entry", () => {
    const result = setPrice(samplePrices, 'Round', 2.0, 20);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(getPrice(result, 'Round', 2.0), 20);
});

runTest("setPrice does not mutate original array", () => {
    const original = [{ shape: 'Round', size: 2.0, pricePerStone: 15 }];
    setPrice(original, 'Round', 2.0, 99);
    assert.strictEqual(original[0].pricePerStone, 15);
});

runTest("setPrice with null array creates new", () => {
    const result = setPrice(null, 'Round', 1.0, 5);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(getPrice(result, 'Round', 1.0), 5);
});

// ─── removePrice ──────────────────────────────────────────────────
console.log("\n── removePrice ──");

runTest("Remove existing entry", () => {
    const result = removePrice(samplePrices, 'Round', 2.0);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(getPrice(result, 'Round', 2.0), null);
});

runTest("Remove non-existent entry changes nothing", () => {
    const result = removePrice(samplePrices, 'Oval', 5.0);
    assert.strictEqual(result.length, 2);
});

runTest("Remove from null returns empty array", () => {
    const result = removePrice(null, 'Round', 2.0);
    assert.deepStrictEqual(result, []);
});

// ─── formatCurrency ───────────────────────────────────────────────
console.log("\n── formatCurrency ──");

runTest("Format 1500 as INR", () => {
    const result = formatCurrency(1500, 'en-IN', 'INR');
    // Should contain ₹ and 1,500.00
    assert.ok(result.includes('1,500.00'), `Got: ${result}`);
});

runTest("Format 0 as INR", () => {
    const result = formatCurrency(0, 'en-IN', 'INR');
    assert.ok(result.includes('0.00'), `Got: ${result}`);
});

runTest("Format NaN returns fallback", () => {
    const result = formatCurrency(NaN, 'en-IN', 'INR');
    assert.strictEqual(result, '₹0.00');
});

runTest("Format undefined returns fallback", () => {
    const result = formatCurrency(undefined, 'en-IN', 'INR');
    assert.strictEqual(result, '₹0.00');
});

// ─── Summary ──────────────────────────────────────────────────────
console.log("\n═══════════════════════════════════════════");
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log("═══════════════════════════════════════════");
process.exit(failed > 0 ? 1 : 0);
