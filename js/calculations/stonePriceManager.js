export function getPrice(pricesArray, shape, size) {
    if (!pricesArray || !Array.isArray(pricesArray)) return null;
    const entry = pricesArray.find(p => p.shape === shape && p.size === size);
    return entry ? entry.pricePerStone : null;
}

export function setPrice(pricesArray, shape, size, price) {
    const arr = pricesArray && Array.isArray(pricesArray) ? [...pricesArray] : [];
    const index = arr.findIndex(p => p.shape === shape && p.size === size);
    if (index >= 0) {
        arr[index] = { ...arr[index], pricePerStone: price };
    } else {
        arr.push({ shape, size, pricePerStone: price });
    }
    return arr;
}

export function removePrice(pricesArray, shape, size) {
    if (!pricesArray || !Array.isArray(pricesArray)) return [];
    return pricesArray.filter(p => !(p.shape === shape && p.size === size));
}

export function formatCurrency(amount, locale = 'en-IN', currency = 'INR') {
    if (typeof amount !== 'number' || isNaN(amount)) {
        amount = 0;
    }
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(amount);
}
