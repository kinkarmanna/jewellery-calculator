import { DEFAULT_BRACELET_VALUES, STONE_WEIGHT_CHART, NICK_SETTING_DATA, PRONG_GAPS, BRACELET_SIZE_CODES, BRACELET_SIZE_TOLERANCE } from '../config/defaults.js?v=31';
import { calculateBraceletDetails, getBraceletSizeEntry } from '../calculations/braceletCalculator.js?v=31';
import { renderResult } from './resultView.js?v=31';

const form = document.getElementById('bracelet-form');
const errorBanner = document.getElementById('bracelet-form-errors');
const errorList = document.getElementById('bracelet-error-list');

// Size mode elements (Easy Select vs Manual Entry)
const braceletSizeModeRadios = document.querySelectorAll('input[name="braceletSizeMode"]');
const braceletEasySelectGroup = document.getElementById('bracelet-easy-select-group');
const braceletManualEntryGroup = document.getElementById('bracelet-manual-entry-group');
const braceletSizeCodeSelect = document.getElementById('bracelet-size-code-select');
const braceletEasySelectInfo = document.getElementById('bracelet-easy-select-info');
let activeBraceletSizeMode = 'easy'; // 'easy' or 'manual'

// Manual Length Inputs
const lengthInput = document.getElementById('bracelet-length');
const lengthLabel = document.getElementById('bracelet-length-label');
const unitRadios = document.querySelectorAll('input[name="braceletUnit"]');
let activeLengthUnit = 'cm'; // 'cm', 'in', or 'mm'

// Stones
const stoneWeightInput = document.getElementById('stone-weight-bracelet');
const stoneSizeInput = document.getElementById('bracelet-stone-size');
const stoneSizeNickSelect = document.getElementById('bracelet-stone-size-nick');

const btnSwapStoneMode = document.getElementById('btn-swap-stone-bracelet');
const stoneWeightGroup = document.getElementById('stone-weight-group-bracelet');
const stoneSizeManualGroup = document.getElementById('stone-size-manual-group-bracelet');

const settingStyleRadios = document.querySelectorAll('input[name="settingStyleBracelet"]');
const standardSelectGroup = document.getElementById('stone-size-standard-group-bracelet');
const nickSelectGroup = document.getElementById('stone-size-nick-group-bracelet');
const nickInfoPanel = document.getElementById('nick-info-bracelet');
const prongRadiosGroup = document.getElementById('prong-style-group-bracelet');
const prongRadios = document.querySelectorAll('input[name="prongStyleBracelet"]');

let activeStoneInputMode = 'size'; // 'weight' or 'size'
let activeSettingStyle = 'standard';
let activeProngStyle = 'common';

// ── Populate Easy Select dropdown ──
function populateBraceletSizeCodes() {
    braceletSizeCodeSelect.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '— Choose a size code (A–Z) —';
    braceletSizeCodeSelect.appendChild(placeholder);

    BRACELET_SIZE_CODES.forEach(entry => {
        const option = document.createElement('option');
        option.value = entry.code;
        option.textContent = entry.label;
        braceletSizeCodeSelect.appendChild(option);
    });
}

// ── Apply selected size code ──
function applyBraceletSizeCode() {
    const code = braceletSizeCodeSelect.value;
    if (!code) {
        braceletEasySelectInfo.innerHTML = '';
        lengthInput.value = '';
        return;
    }

    const entry = getBraceletSizeEntry(code);
    if (!entry) return;

    if (entry.lengthCm === null) {
        braceletEasySelectInfo.innerHTML = `
            <span class="info-code">${entry.code}</span>
            <span class="info-shape">${entry.category}</span>
            <span class="info-dims">
                Standard Length: <strong>N/A</strong>
                <br><span style="font-size: 0.78rem; opacity: 0.85; font-weight: normal;">No standard length defined. Please switch to Manual Entry to specify custom length.</span>
            </span>`;
        lengthInput.value = '';
        return;
    }

    // Sync length to manual input
    if (activeLengthUnit === 'in') {
        lengthInput.value = parseFloat((entry.lengthCm / 2.54).toFixed(2));
    } else if (activeLengthUnit === 'mm') {
        lengthInput.value = entry.lengthMm;
    } else {
        lengthInput.value = entry.lengthCm;
    }

    braceletEasySelectInfo.innerHTML = `
        <span class="info-code">${entry.code}</span>
        <span class="info-shape">${entry.category}</span>
        <span class="info-dims">
            Length: <strong>${entry.lengthCm} cm</strong> (${entry.lengthMm} mm / ${entry.lengthInches.toFixed(2)}")
            <br><span style="font-size: 0.78rem; opacity: 0.85; font-weight: normal;">Tolerance: ±0.20 cm (±2.0 mm)</span>
        </span>`;
}

// ── Toggle between Easy Select and Manual Entry ──
function switchBraceletSizeMode(mode) {
    activeBraceletSizeMode = mode;

    braceletEasySelectGroup.classList.toggle('hidden', mode !== 'easy');
    braceletManualEntryGroup.classList.toggle('hidden', mode !== 'manual');

    if (mode === 'easy') {
        applyBraceletSizeCode();
    }
}

export function initBraceletForm() {
    // Size mode toggle (Easy Select ↔ Manual Entry)
    braceletSizeModeRadios.forEach(radio => {
        radio.addEventListener('change', () => switchBraceletSizeMode(radio.value));
    });

    // Populate size codes
    populateBraceletSizeCodes();
    braceletSizeCodeSelect.addEventListener('change', applyBraceletSizeCode);

    // Stone input mode toggle (Weight ↔ Size)
    btnSwapStoneMode.addEventListener('click', toggleStoneInputMode);
    stoneWeightInput.addEventListener('input', updateSizeFromWeight);
    stoneSizeInput.addEventListener('input', updateWeightFromSize);

    // Populate Nick Setting Diamond Sizes (show ct weight (mm))
    NICK_SETTING_DATA.forEach(data => {
        const option = document.createElement('option');
        option.value = data.diamondSize;
        const weightEntry = STONE_WEIGHT_CHART.find(s => s.diameter === data.diamondSize);
        option.textContent = weightEntry ? `${weightEntry.weight} ct (${data.diamondSize} mm)` : `${data.diamondSize} mm`;
        stoneSizeNickSelect.appendChild(option);
    });
    
    // Length unit toggle (in, cm, mm)
    unitRadios.forEach(radio => {
        radio.addEventListener('change', () => switchLengthUnit(radio.value));
    });

    // Setting style toggle
    settingStyleRadios.forEach(radio => {
        radio.addEventListener('change', () => switchSettingStyle(radio.value));
    });

    // Prong style toggle
    prongRadios.forEach(radio => {
        radio.addEventListener('change', (e) => activeProngStyle = e.target.value);
    });

    stoneSizeNickSelect.addEventListener('change', updateNickSettingInfo);

    // Value Calculation toggle
    const toggleValueBracelet = document.getElementById('toggle-value-bracelet');
    const valueGroupBracelet = document.getElementById('value-group-bracelet');
    toggleValueBracelet.addEventListener('change', (e) => {
        valueGroupBracelet.classList.toggle('hidden', !e.target.checked);
    });

    form.addEventListener('submit', handleFormSubmit);
    document.getElementById('btn-reset-bracelet').addEventListener('click', resetBraceletForm);

    resetBraceletForm();
}

function switchLengthUnit(newUnit) {
    if (activeLengthUnit === newUnit) return;
    const oldUnit = activeLengthUnit;
    activeLengthUnit = newUnit;

    const currentVal = parseFloat(lengthInput.value);
    if (!isNaN(currentVal) && currentVal > 0) {
        let inMm;
        if (oldUnit === 'in') inMm = currentVal * 25.4;
        else if (oldUnit === 'cm') inMm = currentVal * 10;
        else inMm = currentVal;

        if (newUnit === 'in') {
            lengthInput.value = parseFloat((inMm / 2.54).toFixed(2));
        } else if (newUnit === 'cm') {
            lengthInput.value = parseFloat((inMm / 10).toFixed(2));
        } else {
            lengthInput.value = parseFloat(inMm.toFixed(1));
        }
    }

    if (newUnit === 'in') {
        lengthLabel.textContent = 'Total Length (inches):';
    } else if (newUnit === 'cm') {
        lengthLabel.textContent = 'Total Length (cm):';
    } else {
        lengthLabel.textContent = 'Total Length (mm):';
    }
}

function switchSettingStyle(style) {
    activeSettingStyle = style;
    if (style === 'standard') {
        standardSelectGroup.classList.remove('hidden');
        nickSelectGroup.classList.add('hidden');
        nickInfoPanel.innerHTML = '';
        prongRadiosGroup.classList.remove('hidden'); // Show prong styles for standard
    } else {
        standardSelectGroup.classList.add('hidden');
        nickSelectGroup.classList.remove('hidden');
        prongRadiosGroup.classList.remove('hidden'); // Still need prong gaps for nick plates
        updateNickSettingInfo();
    }
}

function updateNickSettingInfo() {
    if (activeSettingStyle !== 'nick') return;
    const size = parseFloat(stoneSizeNickSelect.value);
    const data = NICK_SETTING_DATA.find(d => d.diamondSize === size);
    
    if (data) {
        nickInfoPanel.innerHTML = `
            <div class="easy-select-info" style="margin-top: 0.5rem;">
                <span class="info-shape">NICK PLATE</span>
                <span class="info-dims">Plate OD: ${data.od} mm</span>
            </div>
        `;
    } else {
        nickInfoPanel.innerHTML = '';
    }
}

function toggleStoneInputMode() {
    if (activeStoneInputMode === 'size') {
        activeStoneInputMode = 'weight';
        stoneWeightGroup.classList.remove('hidden');
        stoneSizeManualGroup.classList.add('hidden');
    } else {
        activeStoneInputMode = 'size';
        stoneSizeManualGroup.classList.remove('hidden');
        stoneWeightGroup.classList.add('hidden');
    }
}

function updateSizeFromWeight() {
    const weight = parseFloat(stoneWeightInput.value);
    if (!weight || weight <= 0) return;
    
    const size = weightToSize(weight);
    if (size) {
        stoneSizeInput.value = size;
    }
}

function updateWeightFromSize() {
    const size = parseFloat(stoneSizeInput.value);
    if (!size || size <= 0) return;

    const weight = sizeToWeight(size);
    if (weight) {
        stoneWeightInput.value = weight;
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

function showErrors(messages) {
    errorList.innerHTML = messages.map(m => `<li>${m}</li>`).join('');
    errorBanner.classList.remove('hidden');
    errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideErrors() {
    errorBanner.classList.add('hidden');
    errorList.innerHTML = '';
}

function handleFormSubmit(e) {
    e.preventDefault();
    hideErrors();

    if (activeBraceletSizeMode === 'easy') {
        if (!braceletSizeCodeSelect.value) {
            showErrors(['Please select a bracelet size code (A–Z) or switch to Manual Entry.']);
            return;
        }
        if (braceletSizeCodeSelect.value === 'A') {
            showErrors(['Code A has no standard length. Please choose another size code (B–Z) or switch to Manual Entry.']);
            return;
        }
    }

    const selectedEntry = (activeBraceletSizeMode === 'easy')
        ? getBraceletSizeEntry(braceletSizeCodeSelect.value)
        : null;

    let resolvedStoneSize;
    if (activeSettingStyle === 'nick') {
        resolvedStoneSize = parseFloat(stoneSizeNickSelect.value);
    } else if (activeStoneInputMode === 'weight') {
        const weight = parseFloat(stoneWeightInput.value);
        resolvedStoneSize = weightToSize(weight);
        if (!resolvedStoneSize) {
            showErrors(['Could not find a matching stone size for the entered weight.']);
            return;
        }
    } else {
        resolvedStoneSize = parseFloat(stoneSizeInput.value);
    }

    const includeValue = document.getElementById('toggle-value-bracelet').checked;

    let braceletLength;
    let braceletUnit;

    if (activeBraceletSizeMode === 'easy' && selectedEntry) {
        braceletLength = selectedEntry.lengthCm;
        braceletUnit = 'cm';
    } else {
        braceletLength = parseFloat(lengthInput.value);
        braceletUnit = activeLengthUnit;
    }

    const params = {
        sizeMode: activeBraceletSizeMode,
        sizeCode: selectedEntry ? selectedEntry.code : null,
        sizeCategory: selectedEntry ? selectedEntry.category : null,
        length: braceletLength,
        lengthUnit: braceletUnit,
        rows: parseInt(document.getElementById('bracelet-rows').value, 10),
        quantity: parseInt(document.getElementById('bracelet-quantity').value, 10),
        stoneShape: 'Round',
        stoneSize: resolvedStoneSize,
        useNickPlate: activeSettingStyle === 'nick',
        stoneGap: PRONG_GAPS[activeProngStyle],
        prongStyle: activeProngStyle,
        includeValue: includeValue,
        stoneRate: parseFloat(document.getElementById('val-stone-rate-bracelet').value) || 0,
        goldWeight: parseFloat(document.getElementById('val-gold-weight-bracelet').value) || 0,
        goldRate: parseFloat(document.getElementById('val-gold-rate-bracelet').value) || 0,
        makingPercent: parseFloat(document.getElementById('val-making-bracelet').value) || 0
    };

    const errors = validateBraceletParams(params);
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }

    const result = calculateBraceletDetails(params);
    renderResult(result);
}

function validateBraceletParams(params) {
    const errors = [];
    const unitText = params.lengthUnit === 'in' ? 'inches' : params.lengthUnit;
    if (isNaN(params.length) || params.length <= 0) errors.push(`Valid bracelet length (${unitText}) is required.`);
    if (isNaN(params.stoneSize) || params.stoneSize <= 0) errors.push("Valid stone size is required.");
    if (isNaN(params.rows) || params.rows <= 0) errors.push("Rows must be at least 1.");
    if (isNaN(params.quantity) || params.quantity <= 0) errors.push("Quantity must be at least 1.");
    return errors;
}

export function resetBraceletForm() {
    form.reset();
    hideErrors();
    
    // Reset size mode to Easy Select
    activeBraceletSizeMode = DEFAULT_BRACELET_VALUES.sizeMode || 'easy';
    const easyRadio = document.getElementById('bracelet-size-mode-easy');
    if (easyRadio) easyRadio.checked = true;
    switchBraceletSizeMode('easy');

    // Default code to 'B' (Ladies 18 cm)
    braceletSizeCodeSelect.value = DEFAULT_BRACELET_VALUES.sizeCode || 'B';
    applyBraceletSizeCode();

    // Reset manual unit
    activeLengthUnit = 'cm';
    const unitCmRadio = document.getElementById('unit-cm-bracelet');
    if (unitCmRadio) unitCmRadio.checked = true;
    lengthLabel.textContent = 'Total Length (cm):';

    document.getElementById('bracelet-rows').value = DEFAULT_BRACELET_VALUES.rows;
    document.getElementById('bracelet-quantity').value = DEFAULT_BRACELET_VALUES.quantity;
    
    // Reset stone inputs
    activeStoneInputMode = 'size';
    stoneSizeManualGroup.classList.remove('hidden');
    stoneWeightGroup.classList.add('hidden');
    stoneSizeInput.value = DEFAULT_BRACELET_VALUES.stoneSize;
    updateWeightFromSize(); // sync the hidden weight input
    
    // Reset styling toggles
    document.getElementById('setting-standard-bracelet').checked = true;
    switchSettingStyle('standard');
    
    document.getElementById('prong-common-bracelet').checked = true;
    activeProngStyle = 'common';

    // Reset Value Calculator
    document.getElementById('toggle-value-bracelet').checked = false;
    document.getElementById('value-group-bracelet').classList.add('hidden');

    // Trigger initial calculation quietly
    setTimeout(() => {
        if(!errorBanner.classList.contains('hidden')) return;
        const submitEvent = new Event('submit', { cancelable: true });
        form.dispatchEvent(submitEvent);
    }, 50);
}
