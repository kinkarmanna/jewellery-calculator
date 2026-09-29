// Pure bangle calculation functions — no DOM or UI logic
import { NICK_SETTING_DATA, STONE_WEIGHT_CHART } from '../config/defaults.js';

export function calculateInnerDiameter(bangleShape, diameter, shortDiameter, longDiameter) {
    if (bangleShape === 'Oval') {
        if (typeof shortDiameter !== 'number' || typeof longDiameter !== 'number' || shortDiameter <= 0 || longDiameter <= 0) return 0;
        return (shortDiameter + longDiameter) / 2;
    } else {
        if (typeof diameter !== 'number' || diameter <= 0) return 0;
        return diameter;
    }
}

export function calculateOuterCircumference(innerDiameter, height) {
    if (typeof innerDiameter !== 'number' || innerDiameter <= 0 || typeof height !== 'number' || height < 0) return 0;
    // Height is wall thickness on one side; outer diameter = inner + height×2
    return (innerDiameter + height * 2) * Math.PI;
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



export function calculateTotalStones(finalStonesPerBangle, quantityOfBangles) {
    if (typeof finalStonesPerBangle !== 'number' || typeof quantityOfBangles !== 'number' || finalStonesPerBangle < 0 || quantityOfBangles < 0) {
        return 0;
    }
    return finalStonesPerBangle * quantityOfBangles;
}

export function estimateCaratWeight(stoneShape, stoneSize, totalStones) {
    if (stoneShape !== 'Round' || totalStones <= 0) return 0;
    
    // Find closest diameter in chart, exact match or rounding down
    let match = STONE_WEIGHT_CHART.find(d => d.diameter === stoneSize);
    
    // If exact match not found, find nearest (we'll just use exact for now or closest)
    if (!match) {
        const sorted = [...STONE_WEIGHT_CHART].sort((a,b) => a.diameter - b.diameter);
        // find largest diameter <= stoneSize
        for (let i = sorted.length - 1; i >= 0; i--) {
            if (sorted[i].diameter <= stoneSize) {
                match = sorted[i];
                break;
            }
        }
        // if still no match (smaller than 1.0mm), use lowest
        if (!match) match = sorted[0];
    }
    
    return (match.weight * totalStones).toFixed(2);
}

export function calculateBangleDetails(params = {}) {
    const {
        bangleShape = 'Round',
        diameter = 0,
        shortDiameter = 0,
        longDiameter = 0,
        height = 4.0,
        rows,
        quantity,
        stoneShape,
        stoneSize,
        useNickPlate = false,
        stoneGap = 0,
        spacingMode = 'gap',
        targetStones = 0,
        prongStyle = 'common'
    } = params;

    const innerDiameter = calculateInnerDiameter(bangleShape, diameter, shortDiameter, longDiameter);
    const outerCircumference = calculateOuterCircumference(innerDiameter, height);

    // Determine the effective size for spacing calculation
    let effectiveElementSize = stoneSize;
    let nickPlateData = null;
    
    if (useNickPlate) {
        nickPlateData = NICK_SETTING_DATA.find(d => d.diamondSize === stoneSize);
        if (nickPlateData) {
            effectiveElementSize = nickPlateData.od; // Space taken is the plate outer diameter
        }
    }
    
    // Absolute maximum stones with 0 gap using the outer circumference and the effective element size
    const absoluteMaxStonesPerRow = effectiveElementSize > 0 ? Math.floor(outerCircumference / effectiveElementSize) : 0;
    const absoluteMaxStones = calculateBaseStones(absoluteMaxStonesPerRow, rows);

    let stonesPerRow = 0;
    let computedGap = stoneGap;

    if (spacingMode === 'target' && targetStones > 0) {
        stonesPerRow = targetStones;
        if (stonesPerRow > absoluteMaxStonesPerRow) {
            stonesPerRow = absoluteMaxStonesPerRow; // Cap at physical maximum
        }
        if (stonesPerRow > 0) {
            computedGap = (outerCircumference / stonesPerRow) - effectiveElementSize;
            if (computedGap < 0) computedGap = 0;
        }
    } else {
        stonesPerRow = calculateStonesPerRow(outerCircumference, effectiveElementSize, stoneGap);
    }

    const baseStones = calculateBaseStones(stonesPerRow, rows);
    const finalStonesPerBangle = baseStones; // Wastage removed
    const totalStones = calculateTotalStones(finalStonesPerBangle, quantity);
    
    // Calculate estimated total carat weight if shape is Round
    const totalCaratWeight = estimateCaratWeight(stoneShape, stoneSize, totalStones);

    return {
        type: 'Bangle',
        inputs: { ...params },
        outputs: {
            innerDiameter,
            outerCircumference,
            absoluteMaxStonesPerRow,
            computedGap,
            stonesPerRow,
            baseStones,
            finalStonesPerBangle,
            totalStones,
            effectiveElementSize,
            nickPlateData,
            totalCaratWeight
        }
    };
}
