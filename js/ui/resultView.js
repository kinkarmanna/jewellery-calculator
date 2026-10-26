import { showView } from './navigation.js?v=30';
import { resetBangleForm } from './bangleForm.js?v=30';
import { resetRingForm } from './ringForm.js?v=30';
import { resetBraceletForm } from './braceletForm.js?v=30';
import { resetCustomBangleForm } from './customBangleForm.js?v=30';

let lastType = 'Bangle';

export function initResultView() {
    // Legacy view buttons (kept for backwards compat / print flow)
    document.getElementById('btn-edit-calc').addEventListener('click', () => {
        if (lastType === 'Ring') {
            showView('view-ring');
        } else if (lastType === 'Tennis Bracelet') {
            showView('view-bracelet');
        } else if (lastType === 'Standard to Customized Bangle') {
            showView('view-custom-bangle');
        } else {
            showView('view-bangle');
        }
    });

    document.getElementById('btn-new-calc').addEventListener('click', () => {
        if (lastType === 'Ring') {
            resetRingForm();
            showView('view-ring');
        } else if (lastType === 'Tennis Bracelet') {
            resetBraceletForm();
            showView('view-bracelet');
        } else if (lastType === 'Standard to Customized Bangle') {
            resetCustomBangleForm();
            showView('view-custom-bangle');
        } else {
            resetBangleForm();
            showView('view-bangle');
        }
    });

    document.getElementById('btn-print-result').addEventListener('click', () => {
        window.print();
    });
}

export function renderResult(data) {
    lastType = data.type || 'Bangle';
    
    // Determine the correct inline panel
    let panelId = 'bangle-result-panel';
    if (lastType === 'Ring') panelId = 'ring-result-panel';
    if (lastType === 'Tennis Bracelet') panelId = 'bracelet-result-panel';
    if (lastType === 'Standard to Customized Bangle') panelId = 'custom-bangle-result-panel';
    
    const container = document.getElementById(panelId);
    if (!container) return;

    const d = new Date();
    const dateString = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();

    if (lastType === 'Standard to Customized Bangle') {
        const std = data.standard;
        const cust = data.custom;
        const diff = data.difference;
        const p = cust.pricing;

        const diffStones = diff.totalStones;
        let diffSign = '';
        let bannerText = 'No Change in Stone Count';
        if (diffStones > 0) {
            diffSign = '+';
            bannerText = `+${diffStones} Stones Required`;
        } else if (diffStones < 0) {
            bannerText = `${diffStones} Stones (Reduced)`;
        }

        const formatDiff = (val, suffix = '', decimals = 2) => {
            if (typeof val !== 'number' || isNaN(val)) return '—';
            if (val === 0) return `<span class="diff-neutral">0${suffix}</span>`;
            const sign = val > 0 ? '+' : '';
            const cls = val > 0 ? 'diff-plus' : 'diff-minus';
            return `<span class="${cls}">${sign}${val.toFixed(decimals)}${suffix}</span>`;
        };

        const formatIntDiff = (val) => {
            if (typeof val !== 'number' || isNaN(val)) return '—';
            if (val === 0) return `<span class="diff-neutral">0</span>`;
            const sign = val > 0 ? '+' : '';
            const cls = val > 0 ? 'diff-plus' : 'diff-minus';
            return `<span class="${cls}">${sign}${val}</span>`;
        };

        const spacingLabel = cust.spacingMode === 'target_stones'
            ? 'Target Stones'
            : (cust.spacingMode === 'standard_prong' ? 'Prong Gap' : 'Maintain Standard Gap');

        const html = `
            <div class="print-header">
                <h2>Jewellery Calculator — Workshop Slip</h2>
                <p>Standard to Customized Bangle Comparison | Generated: ${dateString}</p>
            </div>

            <!-- Prominent Stone Change Banner -->
            <div class="total-banner">
                <h3>Stone Difference</h3>
                <div class="total-number">${diffSign}${diffStones}</div>
                <div class="total-sub">${bannerText} (${std.totalStones} std &rarr; ${cust.totalStones} custom)</div>
                ${diff.totalCaratWeight !== 0 ? `
                <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.2);">
                    <div style="font-size: 0.85rem; opacity: 0.85;">Estimated Carat Weight Difference</div>
                    <div style="font-size: 1.25rem; font-weight: 700;">${diff.totalCaratWeight > 0 ? '+' : ''}${diff.totalCaratWeight.toFixed(2)} ct</div>
                </div>` : ''}
            </div>

            <!-- Side-by-Side Comparison Card -->
            <div class="result-card" style="margin-top: 1rem;">
                <h3>📊 Side-by-Side Comparison</h3>
                <div style="overflow-x: auto;">
                    <table class="comparison-table">
                        <thead>
                            <tr>
                                <th>Parameter</th>
                                <th>Standard</th>
                                <th>Customized</th>
                                <th style="text-align: right;">Difference</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Shape</strong></td>
                                <td>${std.shape}</td>
                                <td>${cust.shape}</td>
                                <td class="num">—</td>
                            </tr>
                            <tr>
                                <td><strong>Inner Diameter</strong></td>
                                <td>Ø ${std.innerDiameter.toFixed(1)} mm</td>
                                <td>Ø ${cust.innerDiameter.toFixed(1)} mm</td>
                                <td class="num">${formatDiff(diff.innerDiameter, ' mm', 1)}</td>
                            </tr>
                            <tr>
                                <td><strong>Outer Circumference</strong></td>
                                <td>${std.outerCircumference.toFixed(1)} mm</td>
                                <td>${cust.outerCircumference.toFixed(1)} mm</td>
                                <td class="num">${formatDiff(diff.outerCircumference, ' mm', 1)}</td>
                            </tr>
                            <tr>
                                <td><strong>Stone Size</strong></td>
                                <td>${std.stoneSize} mm</td>
                                <td>${cust.stoneSize} mm</td>
                                <td class="num">${formatDiff(cust.stoneSize - std.stoneSize, ' mm', 1)}</td>
                            </tr>
                            <tr>
                                <td><strong>Stone Gap</strong></td>
                                <td>${std.gap.toFixed(3)} mm</td>
                                <td>${cust.gap.toFixed(3)} mm</td>
                                <td class="num">${formatDiff(diff.gap, ' mm', 3)}</td>
                            </tr>
                            <tr>
                                <td><strong>Stones / Row</strong></td>
                                <td>${std.stonesPerRow}</td>
                                <td><strong>${cust.stonesPerRow}</strong></td>
                                <td class="num">${formatIntDiff(diff.stonesPerRow)}</td>
                            </tr>
                            <tr style="background: var(--surface);">
                                <td><strong>Total Stones (${data.inputs.quantity || 1} pc)</strong></td>
                                <td><strong>${std.totalStones}</strong></td>
                                <td><strong style="color: var(--accent);">${cust.totalStones}</strong></td>
                                <td class="num">${formatIntDiff(diff.totalStones)}</td>
                            </tr>
                            ${(std.totalCaratWeight || cust.totalCaratWeight) ? `
                            <tr>
                                <td><strong>Estimated Carats</strong></td>
                                <td>${std.totalCaratWeight ? std.totalCaratWeight + ' ct' : '—'}</td>
                                <td><strong>${cust.totalCaratWeight ? cust.totalCaratWeight + ' ct' : '—'}</strong></td>
                                <td class="num">${formatDiff(diff.totalCaratWeight, ' ct', 2)}</td>
                            </tr>` : ''}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Technical & Workshop Notes -->
            <div class="result-card">
                <h3>🛠 Workshop Details</h3>
                <div class="result-row">
                    <span class="result-label">Spacing Mode:</span>
                    <span class="result-value">${spacingLabel}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Rows & Quantity:</span>
                    <span class="result-value">${data.inputs.rows} row(s) × ${data.inputs.quantity} piece(s)</span>
                </div>
                <div class="result-row" style="color: var(--text-muted); font-size: 0.85em;">
                    <span class="result-label">Max Physical Capacity:</span>
                    <span class="result-value">${cust.absoluteMaxStonesPerRow} stones/row</span>
                </div>
                <div style="margin-top: 0.6rem; font-size: 0.85rem; color: var(--text-secondary); font-style: italic; line-height: 1.3;">
                    (If the customized bangle has a lock mechanism, 2 stones need to be reduced.)
                </div>
            </div>

            <!-- Pricing Card (if enabled) -->
            ${p ? `
            <div class="result-card pricing-card">
                <h3>💵 Estimated Value (Customized Bangle)</h3>
                <div class="pricing-row">
                    <span class="result-label">Stone Value (${cust.totalCaratWeight} ct @ ₹${p.stoneRate}/ct):</span>
                    <span class="result-value">₹${p.stoneValue.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                <div class="pricing-row">
                    <span class="result-label">Gold Value (${p.goldWeight}g @ ₹${p.goldRate}):</span>
                    <span class="result-value">₹${p.goldValue.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                <div class="pricing-row">
                    <span class="result-label">Making Charge (${p.makingPercent}%):</span>
                    <span class="result-value">₹${p.makingCharge.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                <div class="pricing-row subtotal">
                    <span class="result-label">Subtotal:</span>
                    <span class="result-value">₹${p.subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                <div class="pricing-row">
                    <span class="result-label">GST (3%):</span>
                    <span class="result-value">₹${p.gstAmount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                <div class="pricing-row total">
                    <span class="result-label" style="color: var(--text);">Grand Total:</span>
                    <span class="result-value" style="color: var(--accent);">₹${p.grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
            </div>` : ''}

            <div class="panel-actions">
                <button class="btn-print" onclick="window.print()">🖨 Print Workshop Slip</button>
            </div>
        `;

        container.innerHTML = html;
        const legacyContainer = document.getElementById('result-content');
        if (legacyContainer) legacyContainer.innerHTML = html;
        return;
    }

    let dimensionRow = '';
    
    if (lastType === 'Ring') {
        const codeDisplay = data.inputs.sizeCode
            ? `
            <div class="result-row">
                <span class="result-label">Size Code:</span>
                <span class="result-value">Code ${data.inputs.sizeCode} (${data.inputs.sizeCategory})</span>
            </div>`
            : `
            <div class="result-row">
                <span class="result-label">Size Mode:</span>
                <span class="result-value">Manual Entry</span>
            </div>`;

        const heightDisplay = (typeof data.inputs.height === 'number' && data.inputs.height > 0)
            ? `
            <div class="result-row">
                <span class="result-label">Metal Height:</span>
                <span class="result-value">${data.inputs.height} mm</span>
            </div>
            <div class="result-row">
                <span class="result-label">Outer Circumference:</span>
                <span class="result-value">${data.outputs.outerCircumference.toFixed(1)} mm</span>
            </div>`
            : '';

        dimensionRow = `
            ${codeDisplay}
            <div class="result-row">
                <span class="result-label">Inner Diameter:</span>
                <span class="result-value">Ø ${data.inputs.diameter} mm ${data.inputs.sizeCode ? '<span style="font-size: 0.8em; color: var(--text-muted);">(±0.15 mm)</span>' : ''}</span>
            </div>
            ${heightDisplay}
            <div class="result-row">
                <span class="result-label">Stone Coverage:</span>
                <span class="result-value">${data.inputs.coverage}%</span>
            </div>
            <div class="result-row">
                <span class="result-label">Setting Circumference:</span>
                <span class="result-value">${data.outputs.circumference.toFixed(1)} mm</span>
            </div>`;
    } else if (lastType === 'Tennis Bracelet') {
        const unit = data.inputs.lengthUnit || 'in';
        const unitLabel = unit === 'cm' ? 'cm' : (unit === 'mm' ? 'mm' : 'inches');
        const mmEquiv = unit !== 'mm' ? ` (${data.outputs.lengthMm.toFixed(1)} mm)` : '';
        dimensionRow = `
            <div class="result-row">
                <span class="result-label">Total Length:</span>
                <span class="result-value">${data.inputs.length} ${unitLabel}${mmEquiv}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Setting Length:</span>
                <span class="result-value">${data.outputs.lengthMm.toFixed(1)} mm</span>
            </div>`;
    } else {
        if (data.inputs.bangleShape === 'Oval') {
            dimensionRow = `
                <div class="result-row">
                    <span class="result-label">Bangle Shape:</span>
                    <span class="result-value">Oval</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Inner Diameters:</span>
                    <span class="result-value">Short: ${data.inputs.shortDiameter} mm, Long: ${data.inputs.longDiameter} mm</span>
                </div>
                <div class="result-row" style="color: var(--text-muted); font-size: 0.85em;">
                    <span class="result-label">Avg Inner Diameter:</span>
                    <span class="result-value">${data.outputs.innerDiameter.toFixed(2)} mm</span>
                </div>`;
        } else {
            dimensionRow = `
                <div class="result-row">
                    <span class="result-label">Bangle Shape:</span>
                    <span class="result-value">Round</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Inner Diameter:</span>
                    <span class="result-value">${data.inputs.diameter} mm</span>
                </div>`;
        }
        
        dimensionRow += `
            <div class="result-row">
                <span class="result-label">Metal Height:</span>
                <span class="result-value">${data.inputs.height} mm</span>
            </div>
            <div class="result-row">
                <span class="result-label">Outer Circumference:</span>
                <span class="result-value">${data.outputs.outerCircumference.toFixed(1)} mm</span>
            </div>
            <div class="result-row">
                <span class="result-label">Stone Coverage:</span>
                <span class="result-value">${data.inputs.coverage || 100}%</span>
            </div>`;

        if (data.inputs.coverage && data.inputs.coverage < 100) {
            dimensionRow += `
            <div class="result-row">
                <span class="result-label">Stone Setting Length:</span>
                <span class="result-value">${(data.outputs.settingCircumference || (data.outputs.outerCircumference * (data.inputs.coverage / 100))).toFixed(1)} mm</span>
            </div>`;
        }
    }

    const finalStones = data.outputs.finalStonesPerItem || data.outputs.finalStonesPerBangle;
    const itemName = lastType.toLowerCase();

    const html = `
        <div class="print-header">
            <h2>Jewellery Calculator — Workshop Slip</h2>
            <p>Generated: ${dateString}</p>
        </div>

        <div class="result-card">
            <h3>📐 Input Summary</h3>
            ${dimensionRow}
            <div class="result-row">
                <span class="result-label">Rows × Quantity:</span>
                <span class="result-value">${data.inputs.rows} row(s) × ${data.inputs.quantity} ${itemName}(s)</span>
            </div>
            
            ${data.inputs.useNickPlate ? `
            <div class="result-row">
                <span class="result-label">Setting Type:</span>
                <span class="result-value" style="color: var(--accent); font-weight: bold;">NICK PLATE</span>
            </div>
            <div class="result-row" style="color: var(--text-muted); font-size: 0.85em;">
                <span class="result-label">Nick Plate Specs:</span>
                <span class="result-value">OD: ${data.outputs.nickPlateData.od} | Th: ${data.outputs.nickPlateData.thickness}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Stone:</span>
                <span class="result-value">${data.inputs.stoneShape}, ${data.inputs.stoneSize} mm</span>
            </div>
            ` : `
            <div class="result-row">
                <span class="result-label">Stone:</span>
                <span class="result-value">${data.inputs.stoneShape}, ${data.inputs.stoneSize} mm</span>
            </div>
            `}
        </div>

        <div class="result-card">
            <h3>🔢 Stone Calculation</h3>
            ${data.outputs.absoluteMaxStonesPerRow ? `
            <div class="result-row" style="color: var(--text-muted); font-size: 0.85em;">
                <span class="result-label">Max Capacity:</span>
                <span class="result-value">${data.outputs.absoluteMaxStonesPerRow} stones/row</span>
            </div>` : ''}
            
            ${data.inputs.spacingMode === 'target' ? `
            <div class="result-row">
                <span class="result-label">Target per Row:</span>
                <span class="result-value">${data.inputs.targetStones}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Computed Gap:</span>
                <span class="result-value">${data.outputs.computedGap.toFixed(2)} mm</span>
            </div>
            ` : `
            <div class="result-row">
                <span class="result-label">Prong Style:</span>
                <span class="result-value">${data.inputs.prongStyle === 'common' ? 'Common Prong' : 'Self Prong'} (${data.inputs.stoneGap} mm gap)</span>
            </div>
            <div class="result-row">
                <span class="result-label">Stones per Row:</span>
                <span class="result-value">${data.outputs.stonesPerRow}</span>
            </div>
            `}
            
            <div class="result-row-highlight">
                <span class="result-label">Per ${lastType}:</span>
                <span class="result-value">${finalStones}</span>
            </div>
        </div>

        <div class="total-banner">
            <h3>Total Stones Required</h3>
            <div class="total-number">${data.outputs.totalStones}</div>
            <div class="total-sub">For ${data.inputs.quantity} ${itemName}(s)</div>
            ${data.type === 'Bangle' ? `
            <div style="margin-top: 0.6rem; font-size: 0.85rem; color: rgba(255,255,255,0.8); font-style: italic; line-height: 1.3;">
                (If the product has a lock mechanism, 2 stones need to be reduced.)
            </div>` : ''}
            ${data.inputs.stoneShape === 'Round' && data.outputs.totalCaratWeight ? `
            <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.2);">
                <div style="font-size: 0.85rem; opacity: 0.85;">Estimated Total Weight</div>
                <div style="font-size: 1.25rem; font-weight: 700;">${data.outputs.totalCaratWeight} ct</div>
            </div>` : ''}
        </div>

        ${data.outputs.pricing ? `
        <div class="result-card pricing-card" style="margin-top: 1rem;">
            <h3>💵 Estimated Value</h3>
            <div class="pricing-row">
                <span class="result-label">Stone Value (${data.outputs.totalCaratWeight} ct @ ₹${data.outputs.pricing.stoneRate}/ct):</span>
                <span class="result-value">₹${data.outputs.pricing.stoneValue.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div class="pricing-row">
                <span class="result-label">Gold Value (${data.outputs.pricing.goldWeight}g @ ₹${data.outputs.pricing.goldRate}):</span>
                <span class="result-value">₹${data.outputs.pricing.goldValue.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div class="pricing-row">
                <span class="result-label">Making Charge (${data.outputs.pricing.makingPercent}%):</span>
                <span class="result-value">₹${data.outputs.pricing.makingCharge.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div class="pricing-row subtotal">
                <span class="result-label">Subtotal:</span>
                <span class="result-value">₹${data.outputs.pricing.subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div class="pricing-row">
                <span class="result-label">GST (3%):</span>
                <span class="result-value">₹${data.outputs.pricing.gstAmount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div class="pricing-row total">
                <span class="result-label" style="color: var(--text);">Grand Total:</span>
                <span class="result-value" style="color: var(--accent);">₹${data.outputs.pricing.grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
        </div>
        ` : ''}

        <div class="panel-actions">
            <button class="btn-print" onclick="window.print()">🖨 Print</button>
        </div>
    `;

    container.innerHTML = html;

    // Also render into the legacy result-content for print compatibility
    const legacyContainer = document.getElementById('result-content');
    if (legacyContainer) {
        legacyContainer.innerHTML = html;
    }
}
