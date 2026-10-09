import { DEFAULT_BRACELET_VALUES, STONE_WEIGHT_CHART, NICK_SETTING_DATA, PRONG_GAPS } from '../config/defaults.js?v=10';
import { calculateBraceletDetails } from '../calculations/braceletCalculator.js?v=10';
import { renderResult } from './resultView.js?v=10';

const form = document.getElementById('bracelet-form');
const errorBanner = document.getElementById('bracelet-form-errors');
const errorList = document.getElementById('bracelet-error-list');

// Inputs
const lengthInput = document.getElementById('bracelet-length');
const lockInput = document.getElementById('bracelet-lock');

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

export function initBraceletForm() {
    // Stone input mode toggle (Weight ↔ Size)
    btnSwapStoneMode.addEventListener('click', toggleStoneInputMode);
    stoneWeightInput.addEventListener('input', updateSizeFromWeight);
    stoneSizeInput.addEventListener('input', updateWeightFromSize);

    // Populate Nick Setting Diamond Sizes
    NICK_SETTING_DATA.forEach(data => {
        const option = document.createElement('option');
        option.value = data.diamondSize;
        option.textContent = `${data.diamondSize} mm`;
        stoneSizeNickSelect.appendChild(option);
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
    return closest ? closest.size : null;
}

function sizeToWeight(mm) {
    let closest = null;
    let minDiff = Infinity;
    for (const entry of STONE_WEIGHT_CHART) {
        const diff = Math.abs(entry.size - mm);
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

    const params = {
        lengthInches: parseFloat(lengthInput.value),
        lockLengthMm: parseFloat(lockInput.value),
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
    if (isNaN(params.lengthInches) || params.lengthInches <= 0) errors.push("Valid bracelet length (inches) is required.");
    if (isNaN(params.lockLengthMm) || params.lockLengthMm < 0) errors.push("Valid lock length (mm) is required.");
    if (isNaN(params.stoneSize) || params.stoneSize <= 0) errors.push("Valid stone size is required.");
    if (isNaN(params.rows) || params.rows <= 0) errors.push("Rows must be at least 1.");
    if (isNaN(params.quantity) || params.quantity <= 0) errors.push("Quantity must be at least 1.");
    return errors;
}

export function resetBraceletForm() {
    form.reset();
    hideErrors();
    
    // Reset defaults
    lengthInput.value = DEFAULT_BRACELET_VALUES.length;
    lockInput.value = DEFAULT_BRACELET_VALUES.lockLength;
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
