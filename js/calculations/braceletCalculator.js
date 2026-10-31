import { NICK_SETTING_DATA, STONE_WEIGHT_CHART, BRACELET_SIZE_CODES } from '../config/defaults.js?v=33';
import { calculatePricing } from './valueCalculator.js?v=33';

export function getBraceletSizeEntry(code) {
    if (!code || typeof code !== 'string') return null;
    return BRACELET_SIZE_CODES.find(c => c.code === code.toUpperCase()) || null;
}

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
        sizeMode = 'easy',
        sizeCode,
        length,
        lengthUnit = 'cm',
        lengthInches,
        rows = 1,
        quantity = 1,
        stoneShape = 'Round',
        stoneSize,
        useNickPlate = false,
        stoneGap = 0,
        prongStyle = 'common'
    } = params;

    let resolvedLength = typeof length === 'number' && length > 0
        ? length
        : (typeof lengthInches === 'number' && lengthInches > 0 ? lengthInches : 0);
    let resolvedUnit = lengthUnit;
    let sizeEntry = null;

    if (sizeMode === 'easy' && sizeCode) {
        sizeEntry = getBraceletSizeEntry(sizeCode);
        if (sizeEntry && typeof sizeEntry.lengthCm === 'number') {
            resolvedLength = sizeEntry.lengthCm;
            resolvedUnit = 'cm';
        }
    }

    const lengthMm = convertLengthToMm(resolvedLength, resolvedUnit);
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
        inputs: {
            ...params,
            sizeMode,
            sizeCode: sizeEntry ? sizeEntry.code : (sizeCode || null),
            sizeCategory: sizeEntry ? sizeEntry.category : null,
            length: resolvedLength,
            lengthUnit: resolvedUnit,
            lengthMm,
            usableLength
        },
        outputs: {
            sizeCode: sizeEntry ? sizeEntry.code : (sizeCode || null),
            sizeCategory: sizeEntry ? sizeEntry.category : null,
            length: resolvedLength,
            lengthUnit: resolvedUnit,
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
