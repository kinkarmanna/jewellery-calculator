import { NICK_SETTING_DATA, STONE_WEIGHT_CHART } from '../config/defaults.js?v=10';
import { calculatePricing } from './valueCalculator.js?v=10';

export function estimateCaratWeight(shape, sizeMm, totalStones) {
    if (shape !== 'Round') return null;
    let closest = null;
    let minDiff = Infinity;
    
    for (const entry of STONE_WEIGHT_CHART) {
        const diff = Math.abs(entry.size - sizeMm);
        if (diff < minDiff) {
            minDiff = diff;
            closest = entry;
        }
    }
    
    if (closest) {
        return (closest.weight * totalStones).toFixed(2);
    }
    return null;
}

export function calculateBraceletDetails(params = {}) {
    const {
        lengthInches,
        lockLengthMm,
        rows,
        quantity,
        stoneShape,
        stoneSize,
        useNickPlate,
        stoneGap,
        prongStyle
    } = params;

    // Convert inches to mm (1 inch = 25.4 mm)
    const lengthMm = lengthInches * 25.4;
    
    // Calculate usable length (subtract lock mechanism)
    const usableLength = Math.max(0, lengthMm - lockLengthMm);

    let effectiveElementSize = stoneSize;
    let nickPlateData = null;

    if (useNickPlate) {
        nickPlateData = NICK_SETTING_DATA.find(d => d.diamondSize === stoneSize);
        if (nickPlateData) {
            effectiveElementSize = nickPlateData.od;
        }
    }

    const pitch = effectiveElementSize + stoneGap;
    const stonesPerRow = pitch > 0 ? Math.floor(usableLength / pitch) : 0;
    const baseStones = stonesPerRow * rows;
    const finalStonesPerItem = baseStones;
    const totalStones = finalStonesPerItem * quantity;
    
    const totalCaratWeight = estimateCaratWeight(stoneShape, stoneSize, totalStones);

    let pricing = null;
    if (params.includeValue) {
        pricing = calculatePricing(
            totalCaratWeight,
            params.stoneRate,
            params.goldWeight,
            params.goldRate,
            params.makingPercent
        );
    }

    return {
        type: 'Tennis Bracelet',
        inputs: { ...params, lengthMm, usableLength },
        outputs: {
            lengthMm,
            usableLength,
            stonesPerRow,
            baseStones,
            finalStonesPerItem,
            totalStones,
            effectiveElementSize,
            nickPlateData,
            totalCaratWeight,
            pricing
        }
    };
}
