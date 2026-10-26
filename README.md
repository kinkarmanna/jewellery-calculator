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
- **Straight-Line Layout**: Calculates stones along a straight tennis bracelet track.
- **Inches to Millimetres**: Enter bracelet length in standard inches with automatic conversion to mm.
- **Clasp Subtraction**: Automatically deducts the lock/clasp length to calculate the exact usable stone setting length.

### 3. Finger Ring Calculator
- **Dual Sizing Modes**:
  - **Easy-Select Codes (A–Z)**: Categorized into Baby (`A`–`E`), Ladies (`F`–`N`), Gents (`O`–`U`), and Unisex (`V`–`Z`) with $\pm 0.15\text{ mm}$ tolerance.
  - **Manual Entry**: Direct millimetre entry for exact inner diameter measurements.
- **Metal Height (Wall Thickness)**: Configurable metal height (default 1.5 mm) calculating the true outer setting circumference.
- **Stone Coverage**: Calculate full eternity (100%), half eternity (50%), or custom percentage stone coverage around the band.

### 4. Stone Input & Conversion Engine
- **Weight ↔ Size Swap**: Allows users to input stone size either by **Weight (ct)** or **Size (mm)**.
- **Auto-Conversion**: Uses a precise, hardcoded industry mapping chart (`STONE_WEIGHT_CHART`) to instantly cross-reference sizes to weights (and vice-versa).
- **Total Carat Estimation**: Automatically calculates the total estimated diamond carat weight for Round stones across all rows and quantities.

### 5. Setting Types & Nick Plates
- **Prong Setting**: Standard stone setting using default gaps.
  - *Common Prong*: `0.2 mm` gap
  - *Self Prong*: `0.5 mm` gap
- **Nick Plate Setting**: For specialized settings where diamonds sit inside prefabricated nick plates.
  - **Spacing Override**: The calculator uses the Plate's Outer Diameter (OD) as the primary unit of space instead of the diamond size, while maintaining the selected prong gap between plates.
  - **Dropdown Formatting**: Clearly displays diamond size in both carats and millimetres (e.g., `0.005 ct (1.05 mm)`).

### 6. Financial Valuation & Estimation
- **Per-Carat Diamond Pricing**: Calculate diamond costs based on total carat weight and rate per carat (`₹/ct`).
- **Gold Valuation**: Compute gold cost based on grams and rate per gram (`₹/g`).
- **Making Charges**: Applied directly to the **Total Material Value** (Gold + Stones).
- **GST Calculation**: Automatic 3% statutory GST applied to the subtotal with an itemized breakdown.

### 7. UI & Workshop Slips
- **Modern Dashboard**: Clean card-based home view with high-res product photography (`bangle-card.jpg`, `bracelet-card.jpg`, `ring-card.png`).
- **Workshop Slip**: Generates an instant, printable summary card detailing input parameters, stone breakdowns, totals, and valuation slips.
- **Dark Mode**: Persisted local-storage dark theme for varying workshop and retail lighting environments.

---

## Technical Architecture & Developer Context

For comprehensive architectural details, mathematical proofs, constraints, and coding standards, please refer to **[CONTEXT.md](CONTEXT.md)**.

### Directory Structure
```text
/css/                  - Application stylesheets (styles.css)
/images/               - Product photography for cards (bangle-card.jpg, bracelet-card.jpg, ring-card.png)
/js/
  app.js               - Entry point, bootstraps UI components and handles theme logic
  /config/
    defaults.js        - Business logic constants (charts, nick plates, presets, gaps)
    storage.js         - Local storage persistence helpers
  /calculations/
    bangleCalculator.js   - Pure math for bangle geometry and capacity
    braceletCalculator.js - Pure math for tennis bracelet usable length and capacity
    ringCalculator.js     - Pure math for ring geometry, wall thickness, and coverage
    valueCalculator.js    - Pure math for diamond, gold, making, and GST valuation
    stonePriceManager.js  - Stone price helpers and INR formatting
  /ui/
    navigation.js      - View switcher
    bangleForm.js      - DOM controller for Bangle Form
    braceletForm.js    - DOM controller for Tennis Bracelet Form
    ringForm.js        - DOM controller for Finger Ring Form
    resultView.js      - Dynamic HTML generator for the Workshop Slip
/tests/                - Node.js test suites (54 total unit tests)
index.html             - The single-page application layout
CONTEXT.md             - Full technical context and architecture documentation
```

---

## Testing

Run all 54 unit tests across all 4 calculators:

```powershell
node tests/bangleCalculator.test.js ; node tests/ringCalculator.test.js ; node tests/braceletCalculator.test.js ; node tests/stonePriceManager.test.js
```
Or via npm (in standard bash/cmd shells):
```bash
npm test
```
