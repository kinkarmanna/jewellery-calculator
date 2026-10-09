// Shared logic for calculating the monetary value of jewelry items

export function calculatePricing(totalCarats, stoneRate, goldWeight, goldRate, makingPercent) {
    let carats = parseFloat(totalCarats) || 0;
    if (carats < 0) carats = 0;
    
    if (typeof stoneRate !== 'number' || stoneRate < 0) stoneRate = 0;
    if (typeof goldWeight !== 'number' || goldWeight < 0) goldWeight = 0;
    if (typeof goldRate !== 'number' || goldRate < 0) goldRate = 0;
    if (typeof makingPercent !== 'number' || makingPercent < 0) makingPercent = 0;

    const stoneValue = carats * stoneRate;
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
