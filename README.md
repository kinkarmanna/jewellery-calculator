# Jewellery Calculator

A specialized, offline-capable web application designed to calculate the precise number of stones, layout dimensions, and financial valuations for studded bangles, tennis bracelets, and finger rings. The app dynamically models the physical spacing of diamonds around the outer circumference of jewelry based on metal thickness, prong styles, and specialized nick plates.

Live App on GitHub Pages: [https://kinkarmanna.github.io/jewellery-calculator/](https://kinkarmanna.github.io/jewellery-calculator/)

---

## Features

### 1. Studded Bangle Calculator
- **Bangle Shapes**: Supports both **Round** and **Oval** bangles.
  - *Oval Average Formula*: `(Short Diameter + Long Diameter) / 2`
- **Outer Circumference Math**: Unlike a simple circle, stones are set on the *outside* of the metal. 
  - *Formula*: `Outer Circumference = (Inner Diameter + (Metal Height × 2)) × π`
- **Stone Coverage**: Calculate full bangle (100% default), half bangle (50%), or custom percentage stone coverage around the bangle.
- **Calculation Modes**:
  - **Number of stone calculation**: Determines capacity based on standard prong spacing.
  - **Stone to Stone Gap Calculation**: Enter a target stone count per row to calculate the exact physical gap required.
- **Easy Select**: Pre-configured sizing codes (`A`–`Z`) for standard Round and Oval inner diameters.
- **Lock Mechanism Reminder**: Reminds craftsmen to reduce 2 stones if a hinge/lock clasp is used.

### 2. Tennis Bracelet Calculator
- **Dual Sizing Modes**:
  - **Easy-Select Codes (A–Z)**: Standard workshop sizing codes categorized into **Baby** (`O`–`U`: 12.0–15.0 cm), **Ladies** (`A`–`E` & `V`–`Z`: 15.5–19.5 cm), and **Gents** (`F`–`N`: 20.0–24.0 cm) with standard $\pm 0.20\text{ cm}$ ($\pm 2.0\text{ mm}$) tolerance.
  - **Manual Entry**: Choose to input length in **Inches**, **Centimeters (cm)**, or **Millimeters (mm)** with instant bi-directional conversion.
- **Straight-Line Layout**: Calculates stones along a straight tennis bracelet track based on total length without lock clasp deduction.

### 3. Finger Ring Calculator
- **Dual Sizing Modes**:
  - **Easy-Select Codes (A–AF)**: Categorized into Baby (`A`–`E`), Ladies (`F`–`N`), Gents (`O`–`U`), and Unisex (`V`–`Z` & `AA`–`AF`: 20.30–24.30 mm) with $\pm 0.15\text{ mm}$ tolerance.
  - **Manual Entry**: Direct millimetre entry for exact inner diameter measurements.
- **Metal Height (Wall Thickness)**: Configurable metal height (default 1.5 mm) calculating the true outer setting circumference.
- **Stone Coverage**: Calculate full eternity (100%), half eternity (50%), or custom percentage stone coverage around the band.

### 4. Standard to Customized Bangle Calculator
- **Reference Standard Bangle**: Input existing standard bangle details (Easy-Select `A`–`Z` or Manual Round/Oval, metal height, stone size/weight, and optional existing stone count to derive exact setting gap).
- **Customized Target Bangle**: Specify customized size (with 1-click "Copy Size from Standard" option), optional stone size change, and rows/quantity.
- **Three Spacing Modes**:
  - *Maintain Standard Gap*: Keeps the exact inter-stone gap from the reference bangle.
  - *Prong Gap*: Standardizes to standard common ($0.2\text{ mm}$) or self ($0.5\text{ mm}$) prong gaps.
  - *Target Stones*: Calculates the exact gap needed to fit a target number of stones per row.
- **Comparison Workshop Slip**:
  - Prominent delta banner showing $\pm$ stone count and total carat weight change.
  - 4-column side-by-side comparison table (Metric | Standard | Customized | Difference).
  - Optional customized financial valuation card.

### 5. Stone Input & Conversion Engine
- **Weight ↔ Size Swap**: Allows users to input stone size either by **Weight (ct)** or **Size (mm)**.
- **Auto-Conversion**: Uses a precise, hardcoded industry mapping chart (`STONE_WEIGHT_CHART`) to instantly cross-reference sizes to weights (and vice-versa).
- **Total Carat Estimation**: Automatically calculates the total estimated diamond carat weight for Round stones across all rows and quantities.

### 6. Setting Types & Nick Plates
- **Prong Setting**: Standard stone setting using default gaps.
  - *Common Prong*: `0.2 mm` gap
  - *Self Prong*: `0.5 mm` gap
- **Nick Plate Setting**: For specialized settings where diamonds sit inside prefabricated nick plates.
  - **Spacing Override**: The calculator uses the Plate's Outer Diameter (OD) as the primary unit of space instead of the diamond size, while maintaining the selected prong gap between plates.
  - **Dropdown Formatting**: Clearly displays diamond size in both carats and millimetres (e.g., `0.005 ct (1.05 mm)`).

### 7. Financial Valuation & Estimation
- **Per-Carat Diamond Pricing**: Calculate diamond costs based on total carat weight and rate per carat (`₹/ct`).
- **Gold Valuation**: Compute gold cost based on grams and rate per gram (`₹/g`).
- **Making Charges**: Applied directly to the **Total Material Value** (Gold + Stones).
- **GST Calculation**: Automatic 3% statutory GST applied to the subtotal with an itemized breakdown.

### 8. UI & Workshop Slips
- **Modern Dashboard**: Clean card-based home view with high-res product photography (`bangle-card.jpg`, `bracelet-card.jpg`, `ring-card.png`), featuring a unified Bangle category that opens a sub-menu for Eternity and Customized bangles.
- **Workshop Slip**: Generates an instant, printable summary card detailing input parameters, stone breakdowns, totals, and valuation slips.
- **Dark Mode**: Persisted local-storage dark theme for varying workshop and retail lighting environments.

---

## Technical Architecture & Developer Context

For comprehensive architectural details, mathematical proofs, constraints, and coding standards, please refer to **[CONTEXT.md](CONTEXT.md)**.

### Directory Structure
```text
/css/                  - Application stylesheets (styles.css)
/images/               - Product photography for cards (bangle-card.jpg, bracelet-card.jpg, ring-card.png, necklace-card.jpg)
/js/
  app.js               - Entry point, bootstraps UI components and handles theme logic
  /config/
    defaults.js        - Business logic constants (charts, nick plates, presets, gaps)
    storage.js         - Local storage persistence helpers
  /calculations/
    bangleCalculator.js       - Pure math for bangle geometry and capacity
    braceletCalculator.js     - Pure math for tennis bracelet usable length and capacity
    ringCalculator.js         - Pure math for ring geometry, wall thickness, and coverage
    customBangleCalculator.js - Pure math for standard-to-custom bangle comparison and deltas
    valueCalculator.js        - Pure math for diamond, gold, making, and GST valuation
    stonePriceManager.js      - Stone price helpers and INR formatting
  /ui/
    navigation.js      - View switcher
    bangleForm.js      - DOM controller for Bangle Form
    braceletForm.js    - DOM controller for Tennis Bracelet Form
    ringForm.js        - DOM controller for Finger Ring Form
    customBangleForm.js - DOM controller for Standard to Customized Bangle Form
    resultView.js      - Dynamic HTML generator for the Workshop Slip
/tests/                - Node.js test suites (78 total unit tests)
index.html             - The single-page application layout
CONTEXT.md             - Full technical context and architecture documentation
```

---

## Testing

Run all 78 unit tests across all 5 test suites:

```powershell
node tests/bangleCalculator.test.js ; node tests/ringCalculator.test.js ; node tests/braceletCalculator.test.js ; node tests/customBangleCalculator.test.js ; node tests/stonePriceManager.test.js
```
Or via npm (in standard bash/cmd shells):
```bash
npm test
```
