import { PRONG_GAPS, STONE_WEIGHT_CHART } from '../config/defaults.js?v=28';
import { calculateInnerDiameter, calculateOuterCircumference, estimateCaratWeight } from './bangleCalculator.js?v=28';
import { calculatePricing } from './valueCalculator.js?v=28';

export function calculateCustomBangleComparison(params = {}) {
    const {
        // Standard Bangle inputs
        stdShape = 'Round',
        stdDiameter = 57.3,
        stdShortDiameter = 54.0,
        stdLongDiameter = 60.0,
        stdHeight = 4.0,
        stdStoneShape = 'Round',
        stdStoneSize = 2.0,
        stdProngStyle = 'common',
        stdStoneCount = 0, // Existing stones per row (if known)

        // Custom Bangle inputs
        custShape = 'Round',
        custDiameter = 60.0,
        custShortDiameter = 54.0,
        custLongDiameter = 60.0,
        custHeight = 4.0,
        custStoneShape = 'Round',
        custStoneSize = 2.0,
        custProngStyle = 'common',

        // Spacing / Calculation Mode for Custom
        // 'keep_gap' | 'standard_prong' | 'target_stones' | 'custom_gap'
        spacingMode = 'keep_gap',
        custTargetStones = 0,
        custManualGap = 0.2,

        // Common inputs
        rows = 1,
        quantity = 1,
        includeValue = false,
        stoneRate = 0,
        goldWeight = 0,
        goldRate = 0,
        makingPercent = 0
    } = params;

    // 1. STANDARD BANGLE MATH
    const stdInnerDia = calculateInnerDiameter(stdShape, stdDiameter, stdShortDiameter, stdLongDiameter);
    const stdOuterCirc = calculateOuterCircumference(stdInnerDia, stdHeight);
    const stdDefaultGap = PRONG_GAPS[stdProngStyle] || 0.2;

    let stdStonesPerRow = parseInt(stdStoneCount, 10) || 0;
    let stdEffectiveGap = stdDefaultGap;

    if (stdStonesPerRow > 0) {
        // Compute the actual physical gap on the standard bangle
        const computedGap = (stdOuterCirc / stdStonesPerRow) - stdStoneSize;
        stdEffectiveGap = computedGap >= 0 ? computedGap : 0;
    } else {
        // Calculate based on standard prong gap
        const pitch = stdStoneSize + stdDefaultGap;
        stdStonesPerRow = pitch > 0 ? Math.floor(stdOuterCirc / pitch) : 0;
        stdEffectiveGap = stdDefaultGap;
    }

    const stdBaseStones = stdStonesPerRow * rows;
    const stdTotalStones = stdBaseStones * quantity;
    const stdTotalCaratWeight = estimateCaratWeight(stdStoneShape, stdStoneSize, stdTotalStones);

    // 2. CUSTOM BANGLE MATH
    const custInnerDia = calculateInnerDiameter(custShape, custDiameter, custShortDiameter, custLongDiameter);
    const custOuterCirc = calculateOuterCircumference(custInnerDia, custHeight);
    const custDefaultProngGap = PRONG_GAPS[custProngStyle] || 0.2;

    let custEffectiveGap = stdEffectiveGap;
    let custStonesPerRow = 0;

    const absoluteMaxStonesPerRow = custStoneSize > 0 ? Math.floor(custOuterCirc / custStoneSize) : 0;

    if (spacingMode === 'target_stones' && custTargetStones > 0) {
        custStonesPerRow = parseInt(custTargetStones, 10);
        if (custStonesPerRow > absoluteMaxStonesPerRow) {
            custStonesPerRow = absoluteMaxStonesPerRow;
        }
        if (custStonesPerRow > 0) {
            const computed = (custOuterCirc / custStonesPerRow) - custStoneSize;
            custEffectiveGap = computed >= 0 ? computed : 0;
        }
    } else if (spacingMode === 'standard_prong') {
        custEffectiveGap = custDefaultProngGap;
        const pitch = custStoneSize + custEffectiveGap;
        custStonesPerRow = pitch > 0 ? Math.floor(custOuterCirc / pitch) : 0;
    } else if (spacingMode === 'custom_gap') {
        custEffectiveGap = typeof custManualGap === 'number' && custManualGap >= 0 ? custManualGap : 0.2;
        const pitch = custStoneSize + custEffectiveGap;
        custStonesPerRow = pitch > 0 ? Math.floor(custOuterCirc / pitch) : 0;
    } else {
        // Default: 'keep_gap' -> maintain the exact gap from the standard bangle
        custEffectiveGap = stdEffectiveGap;
        const pitch = custStoneSize + custEffectiveGap;
        custStonesPerRow = pitch > 0 ? Math.floor(custOuterCirc / pitch) : 0;
    }

    const custBaseStones = custStonesPerRow * rows;
    const custTotalStones = custBaseStones * quantity;
    const custTotalCaratWeight = estimateCaratWeight(custStoneShape, custStoneSize, custTotalStones);

    // 3. COMPARISON & DIFFERENCES
    const diffStonesPerRow = custStonesPerRow - stdStonesPerRow;
    const diffBaseStones = custBaseStones - stdBaseStones;
    const diffTotalStones = custTotalStones - stdTotalStones;
    const diffInnerDia = parseFloat((custInnerDia - stdInnerDia).toFixed(2));
    const diffOuterCirc = parseFloat((custOuterCirc - stdOuterCirc).toFixed(2));
    const diffGap = parseFloat((custEffectiveGap - stdEffectiveGap).toFixed(3));
    
    const stdCaratNum = parseFloat(stdTotalCaratWeight) || 0;
    const custCaratNum = parseFloat(custTotalCaratWeight) || 0;
    const diffTotalCaratWeight = parseFloat((custCaratNum - stdCaratNum).toFixed(2));

    // 4. PRICING (FOR CUSTOMIZED BANGLE)
    let pricing = null;
    if (includeValue) {
        pricing = calculatePricing(
            custTotalCaratWeight,
            stoneRate,
            goldWeight,
            goldRate,
            makingPercent
        );
    }

    return {
        type: 'Standard to Customized Bangle',
        inputs: { ...params },
        standard: {
            shape: stdShape,
            innerDiameter: stdInnerDia,
            height: stdHeight,
            outerCircumference: stdOuterCirc,
            stoneShape: stdStoneShape,
            stoneSize: stdStoneSize,
            prongStyle: stdProngStyle,
            gap: stdEffectiveGap,
            stonesPerRow: stdStonesPerRow,
            baseStones: stdBaseStones,
            totalStones: stdTotalStones,
            totalCaratWeight: stdTotalCaratWeight
        },
        custom: {
            shape: custShape,
            innerDiameter: custInnerDia,
            height: custHeight,
            outerCircumference: custOuterCirc,
            stoneShape: custStoneShape,
            stoneSize: custStoneSize,
            prongStyle: custProngStyle,
            spacingMode,
            gap: custEffectiveGap,
            stonesPerRow: custStonesPerRow,
            baseStones: custBaseStones,
            totalStones: custTotalStones,
            totalCaratWeight: custTotalCaratWeight,
            absoluteMaxStonesPerRow,
            pricing
        },
        difference: {
            innerDiameter: diffInnerDia,
            outerCircumference: diffOuterCirc,
            gap: diffGap,
            stonesPerRow: diffStonesPerRow,
            baseStones: diffBaseStones,
            totalStones: diffTotalStones,
            totalCaratWeight: diffTotalCaratWeight
        }
    };
}
