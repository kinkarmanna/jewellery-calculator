import { RING_SIZES, NICK_SETTING_DATA, STONE_WEIGHT_CHART } from '../config/defaults.js?v=12';
import { calculatePricing } from './valueCalculator.js?v=12';

export function calculateRingDetails(params = {}) {
    const {
        sizeStandard = 'US',
        sizeValue = 7.0,
        coverage = 100,
        rows,
        quantity,
        stoneShape,
        stoneSize,
        useNickPlate = false,
        stoneGap = 0,
        prongStyle = 'common'
    } = params;

    const diameter = getRingDiameter(sizeStandard, sizeValue);
    const circumference = calculateRingCircumference(diameter, coverage);

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
        inputs: { ...params, diameter },
        outputs: {
            diameter,
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
