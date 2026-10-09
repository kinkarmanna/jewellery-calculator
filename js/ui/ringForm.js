import { DEFAULT_RING_VALUES, STONE_WEIGHT_CHART, RING_SIZES, VALIDATION_RULES, NICK_SETTING_DATA, PRONG_GAPS } from '../config/defaults.js?v=6';
import { calculateRingDetails } from '../calculations/ringCalculator.js?v=6';
import { renderResult } from './resultView.js?v=6';

const form = document.getElementById('ring-form');
const errorBanner = document.getElementById('ring-form-errors');
const standardSelect = document.getElementById('ring-size-standard');
const sizeValueSelect = document.getElementById('ring-size-value');

// Nick setting elements
const settingStyleRadios = document.querySelectorAll('input[name="settingStyleRing"]');
const stoneSizeStandardGroup = document.getElementById('stone-size-standard-group-ring');
const stoneSizeNickGroup = document.getElementById('stone-size-nick-group-ring');
const stoneSizeInput = document.getElementById('ring-stone-size');
const stoneSizeNickSelect = document.getElementById('stone-size-nick-ring');
const nickInfoBanner = document.getElementById('nick-setting-info-ring');

// Stone input mode elements (Weight ↔ Size)
const btnSwapStoneMode = document.getElementById('btn-swap-stone-ring');
const swapContainer = document.getElementById('stone-swap-container-ring');
const stoneWeightGroup = document.getElementById('stone-weight-group-ring');
const stoneSizeManualGroup = document.getElementById('stone-size-manual-group-ring');
const stoneWeightInput = document.getElementById('stone-weight-ring');
const stoneSizeDisplay = document.getElementById('stone-size-display-ring');

const prongRadios = document.querySelectorAll('input[name="prongStyleRing"]');

let activeSettingStyle = 'standard'; // 'standard' or 'nick'
let activeStoneInputMode = 'weight'; // 'weight' or 'size'
let activeProngStyle = 'common';

// ── Weight ↔ Size lookup helpers ──
function weightToSize(weight) {
    let closest = null;
    let minDiff = Infinity;
    for (const entry of STONE_WEIGHT_CHART) {
        const diff = Math.abs(entry.weight - weight);
        if (diff < minDiff) {
            minDiff = diff;
            closest = entry;
        }
    }
    return closest ? closest.diameter : null;
}

function sizeToWeight(size) {
    const entry = STONE_WEIGHT_CHART.find(e => e.diameter === size);
    return entry ? entry.weight : null;
}

function toggleStoneInputMode() {
    switchStoneInputMode(activeStoneInputMode === 'weight' ? 'size' : 'weight');
}

function switchStoneInputMode(mode) {
    activeStoneInputMode = mode;
    if (activeSettingStyle === 'nick') return; 

    stoneWeightGroup.classList.toggle('hidden', mode !== 'weight');
    stoneSizeManualGroup.classList.toggle('hidden', mode !== 'size');
    stoneSizeStandardGroup.classList.remove('hidden');
    if (mode === 'weight') {
        document.querySelector('label[for="stone-size-display-ring"]').textContent = 'Size (mm):';
        updateSizeFromWeight();
    } else {
        document.querySelector('label[for="stone-size-display-ring"]').textContent = 'Weight (ct):';
        updateWeightFromSize();
    }
}

function updateSizeFromWeight() {
    const weight = parseFloat(stoneWeightInput.value);
    if (!isNaN(weight) && weight > 0) {
        const size = weightToSize(weight);
        stoneSizeDisplay.value = size !== null ? `${size} mm` : '—';
    } else {
        stoneSizeDisplay.value = '';
    }
}

function updateWeightFromSize() {
    const size = parseFloat(stoneSizeInput.value);
    if (!isNaN(size) && size > 0) {
        const weight = sizeToWeight(size);
        stoneSizeDisplay.value = weight !== null ? `${weight} ct` : '—';
    } else {
        stoneSizeDisplay.value = '';
    }
}

export function initRingForm() {
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

    standardSelect.addEventListener('change', populateSizeValues);
    
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
    const toggleValueRing = document.getElementById('toggle-value-ring');
    const valueGroupRing = document.getElementById('value-group-ring');
    toggleValueRing.addEventListener('change', (e) => {
        valueGroupRing.classList.toggle('hidden', !e.target.checked);
    });

    form.addEventListener('submit', handleFormSubmit);
    document.getElementById('btn-reset-ring').addEventListener('click', resetRingForm);

    resetRingForm();
}

function populateSizeValues() {
    sizeValueSelect.innerHTML = '';
    const standard = standardSelect.value;
    const sizes = RING_SIZES[standard] || [];
    
    sizes.forEach(s => {
        const option = document.createElement('option');
        option.value = s.size;
        option.textContent = `${standard} ${s.size} (Ø ${s.diameter}mm)`;
        sizeValueSelect.appendChild(option);
    });
}

function switchSettingStyle(style) {
    activeSettingStyle = style;
    
    swapContainer.classList.toggle('hidden', style === 'nick');
    
    if (style === 'nick') {
        stoneWeightGroup.classList.add('hidden');
        stoneSizeManualGroup.classList.add('hidden');
        stoneSizeStandardGroup.classList.add('hidden');
        stoneSizeNickGroup.classList.remove('hidden');
        
        stoneSizeNickSelect.required = true;
        stoneWeightInput.required = false;
        stoneSizeInput.required = false;
        
        updateNickSettingInfo();
        nickInfoBanner.classList.remove('hidden');
    } else {
        stoneSizeNickGroup.classList.add('hidden');
        stoneSizeNickSelect.required = false;
        
        switchStoneInputMode(activeStoneInputMode);
        
        nickInfoBanner.classList.add('hidden');
    }
}

function updateNickSettingInfo() {
    const size = parseFloat(stoneSizeNickSelect.value);
    const data = NICK_SETTING_DATA.find(d => d.diamondSize === size);
    if (data) {
        nickInfoBanner.innerHTML = `
            <span class="info-code">Nick Plate</span>
            <span class="info-dims">
                Plate OD: <strong>${data.od} mm</strong> &nbsp;|&nbsp; 
                Thickness: ${data.thickness} mm
            </span>
            <div style="margin-top: 0.25rem; font-size: 0.8rem; color: var(--text-muted);">
                * Spacing will be calculated using Plate OD (${data.od} mm) instead of diamond size.
            </div>`;
    }
}

export function resetRingForm() {
    standardSelect.value = DEFAULT_RING_VALUES.sizeStandard;
    populateSizeValues();
    sizeValueSelect.value = DEFAULT_RING_VALUES.sizeValue;

    // Reset setting style
    document.getElementById('setting-standard-ring').checked = true;
    switchSettingStyle('standard');

    // Reset stone input mode to Weight
    switchStoneInputMode('weight');

    // Reset prong style
    document.getElementById('prong-common-ring').checked = true;
    activeProngStyle = 'common';

    document.getElementById('ring-coverage').value = DEFAULT_RING_VALUES.coverage;
    document.getElementById('ring-rows').value = DEFAULT_RING_VALUES.rows;
    document.getElementById('ring-quantity').value = DEFAULT_RING_VALUES.quantity;
    
    stoneSizeInput.value = DEFAULT_RING_VALUES.stoneSize;
    const defaultWeight = sizeToWeight(DEFAULT_RING_VALUES.stoneSize);
    stoneWeightInput.value = defaultWeight || 0.033;
    updateSizeFromWeight();
    
    hideErrors();
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

    const includeValue = document.getElementById('toggle-value-ring').checked;

    const params = {
        sizeStandard: standardSelect.value,
        sizeValue: parseFloat(sizeValueSelect.value),
        coverage: parseFloat(document.getElementById('ring-coverage').value),
        rows: parseInt(document.getElementById('ring-rows').value, 10),
        quantity: parseInt(document.getElementById('ring-quantity').value, 10),
        stoneShape: 'Round',
        stoneSize: resolvedStoneSize,
        useNickPlate: activeSettingStyle === 'nick',
        stoneGap: PRONG_GAPS[activeProngStyle],
        prongStyle: activeProngStyle,
        includeValue: includeValue,
        stoneRate: parseFloat(document.getElementById('val-stone-rate-ring').value) || 0,
        goldWeight: parseFloat(document.getElementById('val-gold-weight-ring').value) || 0,
        goldRate: parseFloat(document.getElementById('val-gold-rate-ring').value) || 0,
        makingPercent: parseFloat(document.getElementById('val-making-ring').value) || 0
    };

    const errors = validateRingParams(params);
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }

    const result = calculateRingDetails(params);
    renderResult(result);
    const panel = document.getElementById('ring-result-panel');
    if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function validateRingParams(params) {
    const errors = [];
    
    // Bounds checking
    const bounds = [
        { key: 'coverage', label: 'Coverage %' },
        { key: 'rows', label: 'Rows' },
        { key: 'stoneSize', label: 'Stone size' }
    ];

    bounds.forEach(({ key, label }) => {
        const val = params[key];
        const rule = VALIDATION_RULES[key];
        if (rule && (isNaN(val) || val < rule.min || val > rule.max)) {
            errors.push(`${label} must be a number between ${rule.min} and ${rule.max}.`);
        }
    });

    if (isNaN(params.quantity) || params.quantity < 1) {
        errors.push(`Quantity must be at least 1.`);
    }

    return errors;
}

function showErrors(errors) {
    errorBanner.innerHTML = `<ul>${errors.map(err => `<li>${err}</li>`).join('')}</ul>`;
    errorBanner.classList.remove('hidden');
    errorBanner.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideErrors() {
    errorBanner.classList.add('hidden');
    errorBanner.innerHTML = '';
}
