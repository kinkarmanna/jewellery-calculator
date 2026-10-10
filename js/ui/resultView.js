import { showView } from './navigation.js?v=13';
import { resetBangleForm } from './bangleForm.js?v=13';
import { resetRingForm } from './ringForm.js?v=13';
import { resetBraceletForm } from './braceletForm.js?v=13';

let lastType = 'Bangle';

export function initResultView() {
    // Legacy view buttons (kept for backwards compat / print flow)
    document.getElementById('btn-edit-calc').addEventListener('click', () => {
        showView(lastType === 'Ring' ? 'view-ring' : 'view-bangle');
    });

    document.getElementById('btn-new-calc').addEventListener('click', () => {
        if (lastType === 'Ring') {
            resetRingForm();
            showView('view-ring');
        } else if (lastType === 'Tennis Bracelet') {
            resetBraceletForm();
            showView('view-bracelet');
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
    
    const container = document.getElementById(panelId);
    if (!container) return;

    const d = new Date();
    const dateString = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();

    let dimensionRow = '';
    
    if (lastType === 'Ring') {
        dimensionRow = `
            <div class="result-row">
                <span class="result-label">Ring Size:</span>
                <span class="result-value">Ø ${data.inputs.diameter} mm</span>
            </div>
            <div class="result-row">
                <span class="result-label">Stone Coverage:</span>
                <span class="result-value">${data.inputs.coverage}%</span>
            </div>
            <div class="result-row">
                <span class="result-label">Setting Circumference:</span>
                <span class="result-value">${data.outputs.circumference.toFixed(1)} mm</span>
            </div>`;
    } else if (lastType === 'Tennis Bracelet') {
        dimensionRow = `
            <div class="result-row">
                <span class="result-label">Total Length:</span>
                <span class="result-value">${data.inputs.lengthInches} inches (${data.outputs.lengthMm.toFixed(1)} mm)</span>
            </div>
            <div class="result-row">
                <span class="result-label">Lock Length:</span>
                <span class="result-value">${data.inputs.lockLengthMm} mm</span>
            </div>
            <div class="result-row">
                <span class="result-label">Usable Setting Length:</span>
                <span class="result-value">${data.outputs.usableLength.toFixed(1)} mm</span>
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
            </div>`;
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
