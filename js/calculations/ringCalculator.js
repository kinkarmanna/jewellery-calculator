import { RING_SIZES, RING_SIZE_CODES, NICK_SETTING_DATA, STONE_WEIGHT_CHART } from '../config/defaults.js?v=25';
import { calculatePricing } from './valueCalculator.js?v=25';

export function getRingDiameterByCode(code) {
    if (!code) return 0;
    const entry = RING_SIZE_CODES.find(c => c.code === code.toUpperCase());
    return entry ? entry.diameter : 0;
}

export function getRingDiameter(sizeStandard, sizeValue) {
    if (!RING_SIZES[sizeStandard]) return 0;
    const entry = RING_SIZES[sizeStandard].find(s => s.size === sizeValue);
    return entry ? entry.diameter : 0;
}

export function calculateOuterCircumference(innerDiameter, height = 0) {
    if (typeof innerDiameter !== 'number' || innerDiameter <= 0) return 0;
    const effectiveHeight = (typeof height === 'number' && height >= 0) ? height : 0;
    return (innerDiameter + effectiveHeight * 2) * Math.PI;
}

export function calculateRingCircumference(diameter, coveragePercentage = 100, height = 0) {
    if (typeof diameter !== 'number' || diameter <= 0 ||
        typeof coveragePercentage !== 'number' || coveragePercentage <= 0) {
        return 0;
    }
    const outerCirc = calculateOuterCircumference(diameter, height);
    return outerCirc * (coveragePercentage / 100);
}

export function calculateStonesPerRow(circumference, elementSize, gap) {
    if (typeof circumference !== 'number' || circumference <= 0 ||
        typeof elementSize !== 'number' || elementSize <= 0 ||
        typeof gap !== 'number' || gap < 0) {
        return 0;
    }
    const pitch = elementSize + gap;
    return Math.floor(circumference / pitch);
}

export function calculateBaseStones(stonesPerRow, numberOfRows) {
    if (typeof stonesPerRow !== 'number' || stonesPerRow < 0 ||
        typeof numberOfRows !== 'number' || numberOfRows <= 0) {
        return 0;
    }
    return stonesPerRow * numberOfRows;
}

export function calculateTotalStones(finalStonesPerItem, quantity) {
    if (typeof finalStonesPerItem !== 'number' || typeof quantity !== 'number' ||
        finalStonesPerItem < 0 || quantity < 0) {
        return 0;
    }
    return finalStonesPerItem * quantity;
}

export function estimateCaratWeight(stoneShape, stoneSize, totalStones) {
    if (stoneShape !== 'Round' || totalStones <= 0) return 0;
    let match = STONE_WEIGHT_CHART.find(d => d.diameter === stoneSize);
    if (!match) {
        const sorted = [...STONE_WEIGHT_CHART].sort((a,b) => a.diameter - b.diameter);
        for (let i = sorted.length - 1; i >= 0; i--) {
            if (sorted[i].diameter <= stoneSize) {
                match = sorted[i];
                break;
            }
        }
        if (!match) match = sorted[0];
    }
    return (match.weight * totalStones).toFixed(2);
}

export function calculateRingDetails(params = {}) {
    const {
        sizeStandard = 'US',
        sizeValue = 7.0,
        height = 0,
        coverage = 100,
        rows,
        quantity,
        stoneShape,
        stoneSize,
        useNickPlate = false,
        stoneGap = 0,
        prongStyle = 'common'
    } = params;

    const diameter = (typeof params.diameter === 'number' && params.diameter > 0)
        ? params.diameter
        : (params.sizeCode ? getRingDiameterByCode(params.sizeCode) : getRingDiameter(sizeStandard, sizeValue));
    
    const effectiveHeight = (typeof height === 'number' && height >= 0) ? height : 0;
    const outerCircumference = calculateOuterCircumference(diameter, effectiveHeight);
    const circumference = calculateRingCircumference(diameter, coverage, effectiveHeight);

    let effectiveElementSize = stoneSize;
    let nickPlateData = null;
    if (useNickPlate) {
        nickPlateData = NICK_SETTING_DATA.find(d => d.diamondSize === stoneSize);
        if (nickPlateData) {
            effectiveElementSize = nickPlateData.od;
        }
    }

    const stonesPerRow = calculateStonesPerRow(circumference, effectiveElementSize, stoneGap);
    const baseStones = calculateBaseStones(stonesPerRow, rows);
    const finalStonesPerItem = baseStones; // Wastage removed
    const totalStones = calculateTotalStones(finalStonesPerItem, quantity);
    
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
        type: 'Ring',
        inputs: { ...params, diameter, height: effectiveHeight },
        outputs: {
            diameter,
            innerDiameter: diameter,
            height: effectiveHeight,
            outerCircumference,
            circumference,
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
