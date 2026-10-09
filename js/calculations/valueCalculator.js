// Shared logic for calculating the monetary value of jewelry items

export function calculatePricing(totalStones, stoneRate, goldWeight, goldRate, makingPercent) {
    if (typeof totalStones !== 'number' || totalStones < 0) totalStones = 0;
    if (typeof stoneRate !== 'number' || stoneRate < 0) stoneRate = 0;
    if (typeof goldWeight !== 'number' || goldWeight < 0) goldWeight = 0;
    if (typeof goldRate !== 'number' || goldRate < 0) goldRate = 0;
    if (typeof makingPercent !== 'number' || makingPercent < 0) makingPercent = 0;

    const stoneValue = totalStones * stoneRate;
    const goldValue = goldWeight * goldRate;
    const totalMaterialValue = stoneValue + goldValue;
    
    // Making charges apply to Total Material Value
    const makingCharge = totalMaterialValue * (makingPercent / 100);
    
    const subtotal = totalMaterialValue + makingCharge;
    
    // GST is fixed at 3%
    const gstAmount = subtotal * 0.03;
    
    const grandTotal = subtotal + gstAmount;

    return {
        stoneRate,
        goldWeight,
        goldRate,
        makingPercent,
        stoneValue,
        goldValue,
        totalMaterialValue,
        makingCharge,
        subtotal,
        gstAmount,
        grandTotal
    };
}
