import { BANGLE_CLOSING_CODES, STONE_WEIGHT_CHART, PRONG_GAPS } from '../config/defaults.js?v=32';
import { calculateCustomBangleComparison } from '../calculations/customBangleCalculator.js?v=32';
import { renderResult } from './resultView.js?v=32';

const form = document.getElementById('custom-bangle-form');
const errorBanner = document.getElementById('custom-bangle-errors');
const errorList = document.getElementById('custom-bangle-error-list');

// 1. STANDARD BANGLE DOM ELEMENTS
const stdDiamModeRadios = document.querySelectorAll('input[name="stdDiamMode"]');
const stdEasyGroup = document.getElementById('std-easy-select-group');
const stdManualGroup = document.getElementById('std-manual-entry-group');
const stdCodeSelect = document.getElementById('std-code-select');
const stdEasyInfo = document.getElementById('std-easy-select-info');

const stdShapeRadios = document.querySelectorAll('input[name="stdShape"]');
const stdRoundGroup = document.getElementById('std-input-round-group');
const stdOvalGroup = document.getElementById('std-input-oval-group');
const stdDiameterInput = document.getElementById('std-bangle-diameter');
const stdShortDiameterInput = document.getElementById('std-bangle-short-diameter');
const stdLongDiameterInput = document.getElementById('std-bangle-long-diameter');
const stdHeightInput = document.getElementById('std-bangle-height');
const stdStoneCountInput = document.getElementById('std-stone-count');

// Standard stone
const stdBtnStoneSwap = document.getElementById('btn-std-stone-swap');
const stdStoneWeightGroup = document.getElementById('std-stone-weight-group');
const stdStoneSizeGroup = document.getElementById('std-stone-size-group');
const stdStoneWeightInput = document.getElementById('std-stone-weight');
const stdStoneSizeInput = document.getElementById('std-stone-size');
const stdStoneDisplay = document.getElementById('std-stone-display');
const stdStoneDisplayLabel = document.getElementById('std-stone-display-label');
const stdProngRadios = document.querySelectorAll('input[name="stdProngStyle"]');

// 2. CUSTOM BANGLE DOM ELEMENTS
const btnCopyStd = document.getElementById('btn-copy-std-to-cust');
const custDiamModeRadios = document.querySelectorAll('input[name="custDiamMode"]');
const custEasyGroup = document.getElementById('cust-easy-select-group');
const custManualGroup = document.getElementById('cust-manual-entry-group');
const custCodeSelect = document.getElementById('cust-code-select');
const custEasyInfo = document.getElementById('cust-easy-select-info');

const custShapeRadios = document.querySelectorAll('input[name="custShape"]');
const custRoundGroup = document.getElementById('cust-input-round-group');
const custOvalGroup = document.getElementById('cust-input-oval-group');
const custDiameterInput = document.getElementById('cust-bangle-diameter');
const custShortDiameterInput = document.getElementById('cust-bangle-short-diameter');
const custLongDiameterInput = document.getElementById('cust-bangle-long-diameter');
const custHeightInput = document.getElementById('cust-bangle-height');
const custRowsInput = document.getElementById('cust-bangle-rows');
const custQuantityInput = document.getElementById('cust-quantity');

// Custom stone
const custStoneOptionRadios = document.querySelectorAll('input[name="custStoneOption"]');
const custStoneCustomGroup = document.getElementById('cust-stone-custom-group');
const custBtnStoneSwap = document.getElementById('btn-cust-stone-swap');
const custStoneWeightGroup = document.getElementById('cust-stone-weight-group');
const custStoneSizeGroup = document.getElementById('cust-stone-size-group');
const custStoneWeightInput = document.getElementById('cust-stone-weight');
const custStoneSizeInput = document.getElementById('cust-stone-size');
const custStoneDisplay = document.getElementById('cust-stone-display');
const custStoneDisplayLabel = document.getElementById('cust-stone-display-label');

// Spacing mode
const custSpacingModeRadios = document.querySelectorAll('input[name="custSpacingMode"]');
const custTargetStonesGroup = document.getElementById('cust-target-stones-group');
const custTargetStonesInput = document.getElementById('cust-target-stones');

// Value calculation
const toggleValue = document.getElementById('toggle-value-custom-bangle');
const valueGroup = document.getElementById('value-group-custom-bangle');
const custGoldWeightInput = document.getElementById('val-gold-weight-cust');

// STATE
let stdStoneMode = 'size'; // 'size' or 'weight'
let custStoneMode = 'size'; // 'size' or 'weight'
let custStoneOption = 'same'; // 'same' or 'change'
let prevCustQuantity = 1;

export function initCustomBangleForm() {
    // Populate dropdowns with A–Z codes
    populateClosingCodes(stdCodeSelect);
    populateClosingCodes(custCodeSelect);

    // Initial select
    stdCodeSelect.value = 'Q'; // 57.5mm round
    updateEasySelectInfo(stdCodeSelect, stdEasyInfo);

    custCodeSelect.value = 'R'; // 60.0mm round
    updateEasySelectInfo(custCodeSelect, custEasyInfo);

    // 1. STANDARD LISTENERS
    stdCodeSelect.addEventListener('change', () => updateEasySelectInfo(stdCodeSelect, stdEasyInfo));
    stdDiamModeRadios.forEach(r => r.addEventListener('change', () => switchDiamMode('std', r.value)));
    stdShapeRadios.forEach(r => r.addEventListener('change', () => switchShape('std', r.value)));

    stdBtnStoneSwap.addEventListener('click', () => toggleStoneMode('std'));
    stdStoneSizeInput.addEventListener('input', () => syncStoneInput('std', 'size'));
    stdStoneWeightInput.addEventListener('input', () => syncStoneInput('std', 'weight'));

    // 2. CUSTOM LISTENERS
    custCodeSelect.addEventListener('change', () => updateEasySelectInfo(custCodeSelect, custEasyInfo));
    custDiamModeRadios.forEach(r => r.addEventListener('change', () => switchDiamMode('cust', r.value)));
    custShapeRadios.forEach(r => r.addEventListener('change', () => switchShape('cust', r.value)));

    btnCopyStd.addEventListener('click', copyStandardToCustom);

    custStoneOptionRadios.forEach(r => r.addEventListener('change', (e) => {
        custStoneOption = e.target.value;
        custStoneCustomGroup.classList.toggle('hidden', custStoneOption === 'same');
    }));

    custBtnStoneSwap.addEventListener('click', () => toggleStoneMode('cust'));
    custStoneSizeInput.addEventListener('input', () => syncStoneInput('cust', 'size'));
    custStoneWeightInput.addEventListener('input', () => syncStoneInput('cust', 'weight'));

    custSpacingModeRadios.forEach(r => r.addEventListener('change', (e) => {
        custTargetStonesGroup.classList.toggle('hidden', e.target.value !== 'target_stones');
    }));

    // Quantity listener: scale gold weight proportionally (e.g. 1 -> 2 doubles gold weight)
    custQuantityInput.addEventListener('input', handleCustQuantityChange);
    custQuantityInput.addEventListener('change', () => {
        handleCustQuantityChange();
        if (!errorBanner.classList.contains('hidden')) return;
        const submitEvent = new Event('submit', { cancelable: true });
        form.dispatchEvent(submitEvent);
    });

    // Value toggle
    toggleValue.addEventListener('change', (e) => {
        valueGroup.classList.toggle('hidden', !e.target.checked);
    });

    // Form buttons
    form.addEventListener('submit', handleFormSubmit);
    document.getElementById('btn-reset-custom-bangle').addEventListener('click', resetCustomBangleForm);

    resetCustomBangleForm();
}

function handleCustQuantityChange() {
    const newQty = parseInt(custQuantityInput.value, 10);
    if (isNaN(newQty) || newQty <= 0) return;

    const currentWeight = parseFloat(custGoldWeightInput.value);
    if (!isNaN(currentWeight) && currentWeight > 0 && prevCustQuantity > 0) {
        const unitWeight = currentWeight / prevCustQuantity;
        const newTotalWeight = parseFloat((unitWeight * newQty).toFixed(3));
        custGoldWeightInput.value = newTotalWeight;
    }
    prevCustQuantity = newQty;
}

function populateClosingCodes(selectElement) {
    selectElement.innerHTML = '';
    BANGLE_CLOSING_CODES.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.code;
        opt.textContent = c.label;
        selectElement.appendChild(opt);
    });
}

function updateEasySelectInfo(selectEl, infoEl) {
    const code = selectEl.value;
    const entry = BANGLE_CLOSING_CODES.find(c => c.code === code);
    if (!entry) {
        infoEl.innerHTML = '';
        return;
    }
    if (entry.shape === 'Oval') {
        infoEl.innerHTML = `<span class="info-shape">OVAL</span><span class="info-dims">Short: ${entry.shortDiameter} mm &times; Long: ${entry.longDiameter} mm</span>`;
    } else {
        infoEl.innerHTML = `<span class="info-shape">ROUND</span><span class="info-dims">Diameter: ${entry.diameter} mm</span>`;
    }
}

function switchDiamMode(prefix, mode) {
    const easyGroup = prefix === 'std' ? stdEasyGroup : custEasyGroup;
    const manualGroup = prefix === 'std' ? stdManualGroup : custManualGroup;

    if (mode === 'easy') {
        easyGroup.classList.remove('hidden');
        manualGroup.classList.add('hidden');
    } else {
        easyGroup.classList.add('hidden');
        manualGroup.classList.remove('hidden');
    }
}

function switchShape(prefix, shape) {
    const roundGroup = prefix === 'std' ? stdRoundGroup : custRoundGroup;
    const ovalGroup = prefix === 'std' ? stdOvalGroup : custOvalGroup;

    if (shape === 'Oval') {
        roundGroup.classList.add('hidden');
        ovalGroup.classList.remove('hidden');
    } else {
        roundGroup.classList.remove('hidden');
        ovalGroup.classList.add('hidden');
    }
}

function toggleStoneMode(prefix) {
    if (prefix === 'std') {
        stdStoneMode = stdStoneMode === 'size' ? 'weight' : 'size';
        applyStoneMode('std', stdStoneMode);
    } else {
        custStoneMode = custStoneMode === 'size' ? 'weight' : 'size';
        applyStoneMode('cust', custStoneMode);
    }
}

function applyStoneMode(prefix, mode) {
    const weightGroup = prefix === 'std' ? stdStoneWeightGroup : custStoneWeightGroup;
    const sizeGroup = prefix === 'std' ? stdStoneSizeGroup : custStoneSizeGroup;
    const displayLabel = prefix === 'std' ? stdStoneDisplayLabel : custStoneDisplayLabel;

    if (mode === 'weight') {
        weightGroup.classList.remove('hidden');
        sizeGroup.classList.add('hidden');
        displayLabel.textContent = 'Size (mm):';
        syncStoneInput(prefix, 'weight');
    } else {
        weightGroup.classList.add('hidden');
        sizeGroup.classList.remove('hidden');
        displayLabel.textContent = 'Weight (ct):';
        syncStoneInput(prefix, 'size');
    }
}

function syncStoneInput(prefix, source) {
    const sizeInput = prefix === 'std' ? stdStoneSizeInput : custStoneSizeInput;
    const weightInput = prefix === 'std' ? stdStoneWeightInput : custStoneWeightInput;
    const display = prefix === 'std' ? stdStoneDisplay : custStoneDisplay;

    if (source === 'weight') {
        const wt = parseFloat(weightInput.value);
        if (!isNaN(wt) && wt > 0) {
            const size = weightToSize(wt);
            display.value = size ? `${size} mm` : '—';
            sizeInput.value = size || '';
        } else {
            display.value = '';
        }
    } else {
        const sz = parseFloat(sizeInput.value);
        if (!isNaN(sz) && sz > 0) {
            const wt = sizeToWeight(sz);
            display.value = wt ? `${wt} ct` : '—';
            weightInput.value = wt || '';
        } else {
            display.value = '';
        }
    }
}

function weightToSize(carats) {
    let closest = null;
    let minDiff = Infinity;
    for (const entry of STONE_WEIGHT_CHART) {
        const diff = Math.abs(entry.weight - carats);
        if (diff < minDiff) {
            minDiff = diff;
            closest = entry;
        }
    }
    return closest ? closest.diameter : null;
}

function sizeToWeight(mm) {
    let closest = null;
    let minDiff = Infinity;
    for (const entry of STONE_WEIGHT_CHART) {
        const diff = Math.abs(entry.diameter - mm);
        if (diff < minDiff) {
            minDiff = diff;
            closest = entry;
        }
    }
    return closest ? closest.weight : null;
}

function copyStandardToCustom() {
    const stdMode = document.querySelector('input[name="stdDiamMode"]:checked').value;
    if (stdMode === 'easy') {
        document.getElementById('cust-diam-mode-easy').checked = true;
        switchDiamMode('cust', 'easy');
        custCodeSelect.value = stdCodeSelect.value;
        updateEasySelectInfo(custCodeSelect, custEasyInfo);
    } else {
        document.getElementById('cust-diam-mode-manual').checked = true;
        switchDiamMode('cust', 'manual');
        const shape = document.querySelector('input[name="stdShape"]:checked').value;
        const shapeRadio = document.querySelector(`input[name="custShape"][value="${shape}"]`);
        if (shapeRadio) shapeRadio.checked = true;
        switchShape('cust', shape);
        custDiameterInput.value = stdDiameterInput.value;
        custShortDiameterInput.value = stdShortDiameterInput.value;
        custLongDiameterInput.value = stdLongDiameterInput.value;
    }
    custHeightInput.value = stdHeightInput.value;
}

function handleFormSubmit(e) {
    e.preventDefault();
    hideErrors();

    // 1. Resolve Standard Dimensions
    const stdMode = document.querySelector('input[name="stdDiamMode"]:checked').value;
    let stdShape = 'Round';
    let stdDiameter = 57.3;
    let stdShort = 54.0;
    let stdLong = 60.0;

    if (stdMode === 'easy') {
        const entry = BANGLE_CLOSING_CODES.find(c => c.code === stdCodeSelect.value);
        if (entry) {
            stdShape = entry.shape;
            if (stdShape === 'Oval') {
                stdShort = entry.shortDiameter;
                stdLong = entry.longDiameter;
            } else {
                stdDiameter = entry.diameter;
            }
        }
    } else {
        stdShape = document.querySelector('input[name="stdShape"]:checked').value;
        stdDiameter = parseFloat(stdDiameterInput.value);
        stdShort = parseFloat(stdShortDiameterInput.value);
        stdLong = parseFloat(stdLongDiameterInput.value);
    }

    const stdStoneSize = parseFloat(stdStoneSizeInput.value) || 2.0;

    // 2. Resolve Custom Dimensions
    const custMode = document.querySelector('input[name="custDiamMode"]:checked').value;
    let custShape = 'Round';
    let custDiameter = 60.0;
    let custShort = 54.0;
    let custLong = 60.0;

    if (custMode === 'easy') {
        const entry = BANGLE_CLOSING_CODES.find(c => c.code === custCodeSelect.value);
        if (entry) {
            custShape = entry.shape;
            if (custShape === 'Oval') {
                custShort = entry.shortDiameter;
                custLong = entry.longDiameter;
            } else {
                custDiameter = entry.diameter;
            }
        }
    } else {
        custShape = document.querySelector('input[name="custShape"]:checked').value;
        custDiameter = parseFloat(custDiameterInput.value);
        custShort = parseFloat(custShortDiameterInput.value);
        custLong = parseFloat(custLongDiameterInput.value);
    }

    const custStoneSize = custStoneOption === 'same'
        ? stdStoneSize
        : (parseFloat(custStoneSizeInput.value) || stdStoneSize);

    const spacingMode = document.querySelector('input[name="custSpacingMode"]:checked').value;

    const params = {
        stdShape,
        stdDiameter,
        stdShortDiameter: stdShort,
        stdLongDiameter: stdLong,
        stdHeight: parseFloat(stdHeightInput.value),
        stdStoneShape: 'Round',
        stdStoneSize,
        stdProngStyle: document.querySelector('input[name="stdProngStyle"]:checked').value,
        stdStoneCount: parseInt(stdStoneCountInput.value, 10) || 0,

        custShape,
        custDiameter,
        custShortDiameter: custShort,
        custLongDiameter: custLong,
        custHeight: parseFloat(custHeightInput.value),
        custStoneShape: 'Round',
        custStoneSize,
        custProngStyle: document.querySelector('input[name="stdProngStyle"]:checked').value,
        spacingMode,
        custTargetStones: parseInt(custTargetStonesInput.value, 10) || 0,

        rows: parseInt(custRowsInput.value, 10) || 1,
        quantity: parseInt(custQuantityInput.value, 10) || 1,

        includeValue: toggleValue.checked,
        stoneRate: parseFloat(document.getElementById('val-stone-rate-cust').value) || 0,
        goldWeight: parseFloat(document.getElementById('val-gold-weight-cust').value) || 0,
        goldRate: parseFloat(document.getElementById('val-gold-rate-cust').value) || 0,
        makingPercent: parseFloat(document.getElementById('val-making-cust').value) || 0
    };

    const errors = validateParams(params);
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }

    const result = calculateCustomBangleComparison(params);
    renderResult(result);
}

function validateParams(p) {
    const errors = [];
    if (p.stdShape === 'Round' && (isNaN(p.stdDiameter) || p.stdDiameter <= 0)) {
        errors.push("Valid Standard inner diameter is required.");
    }
    if (p.stdShape === 'Oval' && (isNaN(p.stdShortDiameter) || isNaN(p.stdLongDiameter) || p.stdShortDiameter <= 0 || p.stdLongDiameter <= 0)) {
        errors.push("Valid Standard short and long diameters are required.");
    }
    if (p.custShape === 'Round' && (isNaN(p.custDiameter) || p.custDiameter <= 0)) {
        errors.push("Valid Customized inner diameter is required.");
    }
    if (p.custShape === 'Oval' && (isNaN(p.custShortDiameter) || isNaN(p.custLongDiameter) || p.custShortDiameter <= 0 || p.custLongDiameter <= 0)) {
        errors.push("Valid Customized short and long diameters are required.");
    }
    if (isNaN(p.stdStoneSize) || p.stdStoneSize <= 0) errors.push("Valid standard stone size is required.");
    if (isNaN(p.custStoneSize) || p.custStoneSize <= 0) errors.push("Valid customized stone size is required.");
    return errors;
}

function showErrors(messages) {
    errorList.innerHTML = messages.map(m => `<li>${m}</li>`).join('');
    errorBanner.classList.remove('hidden');
    errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideErrors() {
    errorBanner.classList.add('hidden');
    errorList.innerHTML = '';
}

export function resetCustomBangleForm() {
    form.reset();
    hideErrors();

    // Standard defaults
    document.getElementById('std-diam-mode-easy').checked = true;
    switchDiamMode('std', 'easy');
    stdCodeSelect.value = 'Q';
    updateEasySelectInfo(stdCodeSelect, stdEasyInfo);
    stdHeightInput.value = 4.0;
    stdStoneCountInput.value = '';

    // Standard stone: 2.0 mm
    stdStoneMode = 'size';
    applyStoneMode('std', 'size');
    stdStoneSizeInput.value = 2.0;
    syncStoneInput('std', 'size');
    document.getElementById('std-prong-common').checked = true;

    // Custom defaults
    document.getElementById('cust-diam-mode-easy').checked = true;
    switchDiamMode('cust', 'easy');
    custCodeSelect.value = 'R';
    updateEasySelectInfo(custCodeSelect, custEasyInfo);
    custHeightInput.value = 4.0;
    custRowsInput.value = 1;
    custQuantityInput.value = 1;
    prevCustQuantity = 1;

    // Custom stone
    document.getElementById('cust-stone-same').checked = true;
    custStoneOption = 'same';
    custStoneCustomGroup.classList.add('hidden');
    custStoneMode = 'size';
    applyStoneMode('cust', 'size');
    custStoneSizeInput.value = 2.0;
    syncStoneInput('cust', 'size');

    // Spacing
    document.getElementById('mode-keep-gap').checked = true;
    custTargetStonesGroup.classList.add('hidden');

    // Value
    toggleValue.checked = false;
    valueGroup.classList.add('hidden');

    setTimeout(() => {
        if (!errorBanner.classList.contains('hidden')) return;
        const submitEvent = new Event('submit', { cancelable: true });
        form.dispatchEvent(submitEvent);
    }, 50);
}
