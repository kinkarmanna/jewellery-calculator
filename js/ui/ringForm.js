import { DEFAULT_RING_VALUES, STONE_SHAPES, RING_SIZES, VALIDATION_RULES, NICK_SETTING_DATA, PRONG_GAPS } from '../config/defaults.js';
import { calculateRingDetails } from '../calculations/ringCalculator.js';
import { renderResult } from './resultView.js';

const form = document.getElementById('ring-form');
const errorBanner = document.getElementById('ring-form-errors');
const standardSelect = document.getElementById('ring-size-standard');
const sizeValueSelect = document.getElementById('ring-size-value');
const shapeSelect = document.getElementById('ring-stone-shape');

// Nick setting elements
const settingStyleRadios = document.querySelectorAll('input[name="settingStyleRing"]');
const stoneSizeStandardGroup = document.getElementById('stone-size-standard-group-ring');
const stoneSizeNickGroup = document.getElementById('stone-size-nick-group-ring');
const stoneSizeInput = document.getElementById('ring-stone-size');
const stoneSizeNickSelect = document.getElementById('stone-size-nick-ring');
const nickInfoBanner = document.getElementById('nick-setting-info-ring');

const prongRadios = document.querySelectorAll('input[name="prongStyleRing"]');

let activeSettingStyle = 'standard'; // 'standard' or 'nick'
let activeProngStyle = 'common';

export function initRingForm() {
    // Populate stone shapes
    STONE_SHAPES.forEach(shape => {
        const option = document.createElement('option');
        option.value = shape.id;
        option.textContent = shape.label;
        shapeSelect.appendChild(option);
    });

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
    
    stoneSizeStandardGroup.classList.toggle('hidden', style !== 'standard');
    stoneSizeNickGroup.classList.toggle('hidden', style !== 'nick');
    
    stoneSizeInput.required = (style === 'standard');
    stoneSizeNickSelect.required = (style === 'nick');
    
    if (style === 'nick') {
        updateNickSettingInfo();
        nickInfoBanner.classList.remove('hidden');
    } else {
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

export function resetRingForm() {
    standardSelect.value = DEFAULT_RING_VALUES.sizeStandard;
    populateSizeValues();
    sizeValueSelect.value = DEFAULT_RING_VALUES.sizeValue;

    // Reset setting style
    document.getElementById('setting-standard-ring').checked = true;
    switchSettingStyle('standard');

    // Reset prong style
    document.getElementById('prong-common-ring').checked = true;
    activeProngStyle = 'common';

    document.getElementById('ring-coverage').value = DEFAULT_RING_VALUES.coverage;
    document.getElementById('ring-rows').value = DEFAULT_RING_VALUES.rows;
    document.getElementById('ring-quantity').value = DEFAULT_RING_VALUES.quantity;
    shapeSelect.value = DEFAULT_RING_VALUES.stoneShape;
    stoneSizeInput.value = DEFAULT_RING_VALUES.stoneSize;
    
    hideErrors();
}

function handleFormSubmit(e) {
    e.preventDefault();
    hideErrors();

    const params = {
        sizeStandard: standardSelect.value,
        sizeValue: parseFloat(sizeValueSelect.value),
        coverage: parseFloat(document.getElementById('ring-coverage').value),
        rows: parseInt(document.getElementById('ring-rows').value, 10),
        quantity: parseInt(document.getElementById('ring-quantity').value, 10),
        stoneShape: shapeSelect.value,
        stoneSize: activeSettingStyle === 'nick' ? parseFloat(stoneSizeNickSelect.value) : parseFloat(stoneSizeInput.value),
        useNickPlate: activeSettingStyle === 'nick',
        stoneGap: activeSettingStyle === 'nick' ? 0 : PRONG_GAPS[activeProngStyle],
        prongStyle: activeProngStyle
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
