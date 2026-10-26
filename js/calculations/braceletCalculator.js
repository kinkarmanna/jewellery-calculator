import { NICK_SETTING_DATA, STONE_WEIGHT_CHART } from '../config/defaults.js?v=26';
import { calculatePricing } from './valueCalculator.js?v=26';

export function estimateCaratWeight(shape, sizeMm, totalStones) {
    if (shape !== 'Round') return null;
    let closest = null;
    let minDiff = Infinity;
    
    for (const entry of STONE_WEIGHT_CHART) {
        const diff = Math.abs(entry.diameter - sizeMm);
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

export function convertLengthToMm(length, unit = 'in') {
    const val = typeof length === 'number' && length > 0 ? length : 0;
    switch (unit) {
        case 'cm':
            return Math.round(val * 10 * 1000) / 1000;
        case 'mm':
            return val;
        case 'in':
        case 'inch':
        default:
            return Math.round(val * 25.4 * 1000) / 1000;
    }
}

export function calculateBraceletDetails(params = {}) {
    const {
        length,
        lengthUnit = 'in',
        lengthInches,
        rows = 1,
        quantity = 1,
        stoneShape = 'Round',
        stoneSize,
        useNickPlate = false,
        stoneGap = 0,
        prongStyle = 'common'
    } = params;

    const rawLength = typeof length === 'number' && length > 0
        ? length
        : (typeof lengthInches === 'number' && lengthInches > 0 ? lengthInches : 0);

    const lengthMm = convertLengthToMm(rawLength, lengthUnit);
    const usableLength = lengthMm;

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
        inputs: { ...params, length: rawLength, lengthUnit, lengthMm, usableLength },
        outputs: {
            length: rawLength,
            lengthUnit,
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
