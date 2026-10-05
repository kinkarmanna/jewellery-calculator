import { DEFAULT_BANGLE_VALUES, STONE_WEIGHT_CHART, VALIDATION_RULES, BANGLE_SIZE_PRESETS, BANGLE_CLOSING_CODES, NICK_SETTING_DATA, PRONG_GAPS } from '../config/defaults.js';
import { calculateBangleDetails } from '../calculations/bangleCalculator.js';
import { renderResult } from './resultView.js';

const form = document.getElementById('bangle-form');
const errorBanner = document.getElementById('bangle-form-errors');

// Nick setting elements
const settingStyleRadios = document.querySelectorAll('input[name="settingStyleBangle"]');
const stoneSizeStandardGroup = document.getElementById('stone-size-standard-group-bangle');
const stoneSizeNickGroup = document.getElementById('stone-size-nick-group-bangle');
const stoneSizeInput = document.getElementById('stone-size');
const stoneSizeNickSelect = document.getElementById('stone-size-nick-bangle');
const nickInfoBanner = document.getElementById('nick-setting-info-bangle');

// Stone input mode elements (Weight ↔ Size)
const stoneInputModeRadios = document.querySelectorAll('input[name="stoneInputModeBangle"]');
const stoneWeightGroup = document.getElementById('stone-weight-group-bangle');
const stoneSizeManualGroup = document.getElementById('stone-size-manual-group-bangle');
const stoneWeightInput = document.getElementById('stone-weight-bangle');
const stoneSizeDisplay = document.getElementById('stone-size-display-bangle');

let activeSettingStyle = 'standard'; // 'standard' or 'nick'
let activeStoneInputMode = 'weight'; // 'weight' or 'size'

// Diameter mode elements (Easy Select vs Manual Entry)
const diamModeRadios = document.querySelectorAll('input[name="diameterMode"]');
const easySelectGroup = document.getElementById('easy-select-group');
const manualEntryGroup = document.getElementById('manual-entry-group');
const closingCodeSelect = document.getElementById('closing-code-select');
const easySelectInfo = document.getElementById('easy-select-info');

// Bangle Shape elements (inside Manual Entry)
const shapeRadios = document.querySelectorAll('input[name="bangleShape"]');
const roundGroup = document.getElementById('input-round-group');
const ovalGroup = document.getElementById('input-oval-group');
const diameterInput = document.getElementById('bangle-diameter');
const shortDiameterInput = document.getElementById('bangle-short-diameter');
const longDiameterInput = document.getElementById('bangle-long-diameter');
const heightInput = document.getElementById('bangle-height');

// Spacing mode elements
const spacingRadios = document.querySelectorAll('input[name="spacingMode"]');
const prongGroup = document.getElementById('input-prong-group');
const targetGroup = document.getElementById('input-target-group');
const targetInput = document.getElementById('target-stones');

const prongRadios = document.querySelectorAll('input[name="prongStyleBangle"]');

let activeDiameterMode = 'easy';   // 'easy' or 'manual'
let activeBangleShape = 'Round';
let activeSpacingMode = 'gap';
let activeProngStyle = 'common';

// ── Weight ↔ Size lookup helpers ──
function weightToSize(weight) {
    // Find closest matching weight in chart, return the diameter
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

function switchStoneInputMode(mode) {
    activeStoneInputMode = mode;
    if (activeSettingStyle === 'nick') return; // Nick plate controls its own display

    stoneWeightGroup.classList.toggle('hidden', mode !== 'weight');
    stoneSizeManualGroup.classList.toggle('hidden', mode !== 'size');
    // Show auto-display of size when in weight mode, show auto-display of weight when in size mode
    stoneSizeStandardGroup.classList.remove('hidden');
    if (mode === 'weight') {
        document.getElementById('stone-size-display-label-bangle').textContent = 'Size (mm):';
        updateSizeFromWeight();
    } else {
        document.getElementById('stone-size-display-label-bangle').textContent = 'Weight (ct):';
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

export function initBangleForm() {
    // Stone input mode toggle (Weight ↔ Size)
    stoneInputModeRadios.forEach(radio => {
        radio.addEventListener('change', () => switchStoneInputMode(radio.value));
    });
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

    stoneSizeNickSelect.addEventListener('change', updateNickSettingInfo);

    // Populate closing code dropdown
    populateClosingCodes();

    // Populate preset buttons
    const presetsContainer = document.getElementById('bangle-presets');
    BANGLE_SIZE_PRESETS.forEach(preset => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = preset.label;
        btn.addEventListener('click', () => applyPreset(preset, btn));
        presetsContainer.appendChild(btn);
    });

    // Diameter mode toggle (Easy Select ↔ Manual Entry)
    diamModeRadios.forEach(radio => {
        radio.addEventListener('change', () => switchDiameterMode(radio.value));
    });

    // Closing code selection
    closingCodeSelect.addEventListener('change', applyClosingCode);

    // Shape mode toggle (Round ↔ Oval, inside Manual Entry)
    shapeRadios.forEach(radio => {
        radio.addEventListener('change', () => switchBangleShape(radio.value));
    });

    // Spacing mode toggle
    spacingRadios.forEach(radio => {
        radio.addEventListener('change', () => switchSpacingMode(radio.value));
    });

    // Prong style toggle
    prongRadios.forEach(radio => {
        radio.addEventListener('change', (e) => activeProngStyle = e.target.value);
    });

    // Event listeners
    form.addEventListener('submit', handleFormSubmit);
    document.getElementById('btn-reset-bangle').addEventListener('click', resetBangleForm);

    resetBangleForm();
}

// ── Populate the A–Z dropdown ──
function populateClosingCodes() {
    // Add a blank prompt option
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '— Choose a code (A–Z) —';
    closingCodeSelect.appendChild(placeholder);

    BANGLE_CLOSING_CODES.forEach(entry => {
        const option = document.createElement('option');
        option.value = entry.code;
        option.textContent = entry.label;
        closingCodeSelect.appendChild(option);
    });
}

// ── Apply a selected closing code ──
function applyClosingCode() {
    const code = closingCodeSelect.value;
    if (!code) {
        easySelectInfo.innerHTML = '';
        return;
    }

    const entry = BANGLE_CLOSING_CODES.find(c => c.code === code);
    if (!entry) return;

    // Update internal shape state and hidden manual inputs
    activeBangleShape = entry.shape;

    if (entry.shape === 'Oval') {
        // Set the manual shape radio (so form submit reads the right shape)
        document.getElementById('shape-oval').checked = true;
        shortDiameterInput.value = entry.shortDiameter;
        longDiameterInput.value = entry.longDiameter;
        diameterInput.value = '';

        // Show info card
        const avgDia = ((entry.shortDiameter + entry.longDiameter) / 2).toFixed(1);
        easySelectInfo.innerHTML = `
            <span class="info-code">${entry.code}</span>
            <span class="info-shape">Oval</span>
            <span class="info-dims">
                Short: ${entry.shortDiameter} mm &nbsp;×&nbsp; Long: ${entry.longDiameter} mm
                <br>Avg Diameter: ${avgDia} mm
            </span>`;
    } else {
        document.getElementById('shape-round').checked = true;
        diameterInput.value = entry.diameter;
        shortDiameterInput.value = '';
        longDiameterInput.value = '';

        easySelectInfo.innerHTML = `
            <span class="info-code">${entry.code}</span>
            <span class="info-shape">Round</span>
            <span class="info-dims">
                Inner Diameter: ${entry.diameter} mm
            </span>`;
    }
}

// ── Toggle between Easy Select and Manual Entry ──
function switchDiameterMode(mode) {
    activeDiameterMode = mode;

    easySelectGroup.classList.toggle('hidden', mode !== 'easy');
    manualEntryGroup.classList.toggle('hidden', mode !== 'manual');

    if (mode === 'easy') {
        // Re-apply whichever code is currently selected
        applyClosingCode();
    } else {
        // Sync the manual shape UI to whatever the internal state is
        switchBangleShape(activeBangleShape);
    }
}

export function resetBangleForm() {
    // Reset diameter mode to Easy Select
    document.getElementById('diam-mode-easy').checked = true;
    switchDiameterMode('easy');

    // Reset the closing code dropdown
    closingCodeSelect.value = '';
    easySelectInfo.innerHTML = '';

    // Reset manual entry shape to Round
    document.getElementById('shape-round').checked = true;
    activeBangleShape = 'Round';
    switchBangleShape('Round');
    
    // Reset spacing mode
    document.getElementById('spacing-gap').checked = true;
    switchSpacingMode('gap');

    // Reset setting style
    document.getElementById('setting-standard-bangle').checked = true;
    switchSettingStyle('standard');

    // Reset stone input mode to Weight
    document.getElementById('stone-input-weight-bangle').checked = true;
    switchStoneInputMode('weight');

    // Reset prong style
    document.getElementById('prong-common-bangle').checked = true;
    activeProngStyle = 'common';

    diameterInput.value = DEFAULT_BANGLE_VALUES.diameter;
    shortDiameterInput.value = DEFAULT_BANGLE_VALUES.shortDiameter;
    longDiameterInput.value = DEFAULT_BANGLE_VALUES.longDiameter;
    heightInput.value = DEFAULT_BANGLE_VALUES.height;
    document.getElementById('bangle-rows').value = DEFAULT_BANGLE_VALUES.rows;
    document.getElementById('bangle-quantity').value = DEFAULT_BANGLE_VALUES.quantity;
    stoneSizeInput.value = DEFAULT_BANGLE_VALUES.stoneSize;
    // Set default weight from chart lookup
    const defaultWeight = sizeToWeight(DEFAULT_BANGLE_VALUES.stoneSize);
    stoneWeightInput.value = defaultWeight || 0.033;
    updateSizeFromWeight();
    targetInput.value = '';
    
    hideErrors();

    // Clear preset highlight
    document.querySelectorAll('.preset-buttons button').forEach(b => b.classList.remove('active'));
}

function switchSpacingMode(mode) {
    activeSpacingMode = mode;
    prongGroup.classList.toggle('hidden', mode !== 'gap');
    targetGroup.classList.toggle('hidden', mode !== 'target');
    targetInput.required = (mode === 'target');
}

function switchBangleShape(shape) {
    activeBangleShape = shape;

    roundGroup.classList.toggle('hidden', shape !== 'Round');
    ovalGroup.classList.toggle('hidden', shape !== 'Oval');
}

function applyPreset(preset, btn) {
    // Highlight active preset
    document.querySelectorAll('.preset-buttons button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Set value based on current shape
    if (activeBangleShape === 'Round') {
        diameterInput.value = preset.diameter;
    } else {
        shortDiameterInput.value = preset.diameter;
        longDiameterInput.value = preset.diameter;
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    hideErrors();

    // If Easy Select is active but no code is chosen, show an error
    if (activeDiameterMode === 'easy' && !closingCodeSelect.value) {
        showErrors(['Please select a size code (A–Z) or switch to Manual Entry.']);
        return;
    }

    // Resolve stone size based on input mode
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

    const params = {
        bangleShape: activeBangleShape,
        diameter: parseFloat(diameterInput.value),
        shortDiameter: parseFloat(shortDiameterInput.value),
        longDiameter: parseFloat(longDiameterInput.value),
        height: parseFloat(heightInput.value),
        rows: parseInt(document.getElementById('bangle-rows').value, 10),
        quantity: parseInt(document.getElementById('bangle-quantity').value, 10),
        stoneShape: 'Round',
        stoneSize: resolvedStoneSize,
        useNickPlate: activeSettingStyle === 'nick',
        spacingMode: activeSpacingMode,
        stoneGap: activeSettingStyle === 'nick' ? 0 : (activeSpacingMode === 'gap' ? PRONG_GAPS[activeProngStyle] : 0),
        prongStyle: activeProngStyle,
        targetStones: parseInt(targetInput.value, 10)
    };

    const errors = validateBangleParams(params);
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }

    const result = calculateBangleDetails(params);
    renderResult(result);
    // Scroll result panel into view on smaller screens
    const panel = document.getElementById('bangle-result-panel');
    if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function switchSettingStyle(style) {
    activeSettingStyle = style;
    
    // Hide/show the input mode toggle based on setting style
    const modeToggle = document.querySelector('input[name="stoneInputModeBangle"]').closest('.input-mode-group');
    if (modeToggle) modeToggle.classList.toggle('hidden', style === 'nick');
    
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
        
        // Restore standard weight/size visibility
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
                Plate ID: ${data.id} mm &nbsp;|&nbsp; 
                Thickness: ${data.thickness} mm
            </span>
            <div style="margin-top: 0.25rem; font-size: 0.8rem; color: var(--text-muted);">
                * Spacing will be calculated using Plate OD (${data.od} mm) instead of diamond size.
            </div>`;
    }
}

function validateBangleParams(params) {
    const errors = [];

    // Validate active shape dimensions
    if (params.bangleShape === 'Round') {
        const rule = VALIDATION_RULES.diameter;
        if (isNaN(params.diameter) || params.diameter < rule.min || params.diameter > rule.max) {
            errors.push(`Inner Diameter must be between ${rule.min} and ${rule.max} mm.`);
        }
    } else {
        const sRule = VALIDATION_RULES.shortDiameter;
        if (isNaN(params.shortDiameter) || params.shortDiameter < sRule.min || params.shortDiameter > sRule.max) {
            errors.push(`Short Inner Diameter must be between ${sRule.min} and ${sRule.max} mm.`);
        }
        const lRule = VALIDATION_RULES.longDiameter;
        if (isNaN(params.longDiameter) || params.longDiameter < lRule.min || params.longDiameter > lRule.max) {
            errors.push(`Long Inner Diameter must be between ${lRule.min} and ${lRule.max} mm.`);
        }
        if (params.shortDiameter > params.longDiameter) {
            errors.push(`Short diameter cannot be larger than Long diameter.`);
        }
    }

    // Validate remaining common fields
    const bounds = [
        { key: 'height', label: 'Height' },
        { key: 'rows', label: 'Rows' },
        { key: 'stoneSize', label: 'Stone size' }
    ];

    bounds.forEach(({ key, label }) => {
        const val = params[key];
        const rule = VALIDATION_RULES[key];
        if (isNaN(val) || val < rule.min || val > rule.max) {
            errors.push(`${label} must be a number between ${rule.min} and ${rule.max}.`);
        }
    });

    // Quantity isn't bound checked the same way for min/max
    if (isNaN(params.quantity) || params.quantity < 1) {
        errors.push(`Quantity must be at least 1.`);
    }

    if (params.spacingMode === 'target') {
        if (isNaN(params.targetStones) || params.targetStones < 1) {
            errors.push(`Target stones must be a valid number of at least 1.`);
        }
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
