# Jewellery Calculator

A specialized, offline-capable web application designed to calculate the precise number of stones required for studded bangles and rings. The app dynamically models the physical spacing of diamonds around the outer circumference of jewelry based on metal thickness, prong styles, and specialized nick plates.

## Features

### 1. Bangle Calculator
- **Bangle Shapes**: Supports both **Round** and **Oval** bangles.
  - *Oval Average Formula*: `(Short Diameter + Long Diameter) / 2`
- **Outer Circumference Math**: Unlike a simple circle, stones are set on the *outside* of the metal. 
  - *Formula*: `Outer Circumference = (Inner Diameter + (Metal Height × 2)) × π`
- **Easy Select**: Pre-configured sizing codes (A-Z) commonly used in the jewelry industry for standard Round and Oval inner diameters.

### 2. Ring Calculator
- **Ring Standards**: Supports both US (3–13) and IN (1–30) standard ring sizes, mapping directly to inner diameters.
- **Stone Coverage**: Calculate full eternity (100%), half eternity (50%), or any custom percentage of stone coverage around the band.

### 3. Stone Input & Conversion Engine
- **Weight ↔ Size Swap**: Allows users to input stone size either by **Weight (ct)** or **Size (mm)**.
- **Auto-Conversion**: Uses a precise, hardcoded industry mapping chart (`STONE_WEIGHT_CHART`) to instantly cross-reference sizes to weights (and vice-versa).
- **Target Stones**: Instead of a fixed gap, users can input a target number of stones per row. The app computes the exact gap required to fit them evenly.

### 4. Setting Types & Nick Plates
- **Prong Setting**: Standard stone setting using default gaps.
  - *Common Prong*: `0.2 mm` gap
  - *Self Prong*: `0.5 mm` gap
- **Nick Plate Setting**: For specialized settings where diamonds sit inside a prefabricated plate.
  - **Logic**: Replaces the stone size input with a dropdown of predefined Nick Plate diamond sizes.
  - **Spacing Override**: The calculator uses the Plate's Outer Diameter (OD) as the primary unit of space instead of the diamond size, but still correctly applies the selected Prong Style gap (0.2/0.5 mm) between the plates.

### 5. UI & Utilities
- **Result Workshop Slip**: Generates a clean, printable summary card detailing max capacity, stones per row, totals, and an estimated total carat weight (for Round stones).
- **Lock Mechanism Note**: Automatically flags bangle calculations with a reminder to reduce 2 stones if the bangle utilizes a hinge/lock mechanism.
- **Dark Mode**: Persisted local-storage dark theme for varying lighting environments.

---

## Architecture & Codebase Context

This is a pure Vanilla JavaScript application using modern ES6 modules. There is no build step (no Webpack, Vite, etc.), and no backend server required. It runs purely in the browser.

### Directory Structure
```text
/css/                  - Application stylesheets
  styles.css           - Global styles, variables, and dark mode logic
/js/
  app.js               - Entry point, bootstraps UI components and handles theme logic
  /config/
    defaults.js        - ALL business logic constants (Ring sizes, Nick Plate specs, Diamond charts)
  /calculations/
    bangleCalculator.js - Pure math functions for bangle geometry and capacity
    ringCalculator.js   - Pure math functions for ring geometry and capacity
  /ui/
    navigation.js      - View transitions (Home, Bangle, Ring)
    bangleForm.js      - DOM interactions for Bangle Form (Shape toggles, Nick Plate toggle)
    ringForm.js        - DOM interactions for Ring Form
    resultView.js      - Dynamic HTML generator for the "Workshop Slip" result screen
/tests/                - Node.js test scripts (run via 'npm test')
index.html             - The single-page application layout
```

## Adding New Features (Developer Guide)

When adding new features, adhere to the following architecture rules:

1. **Separation of Concerns**: 
   - Never write DOM manipulation (`document.getElementById`) inside the `/calculations/` folder. The calculators must remain pure functions that take a parameters object and return a results object.
2. **State Management**:
   - UI state (like `activeProngStyle` or `activeStoneInputMode`) is managed locally within the respective form module (`bangleForm.js` or `ringForm.js`).
3. **Data Sources**:
   - Any new industry standard mappings (like new Nick Plate sizes, new stone shapes, or pricing data) must be placed in `js/config/defaults.js`.
4. **Cache Busting**:
   - Because this app is hosted on static pages (GitHub Pages) without a bundler, **browser caching is highly aggressive**.
   - If you modify *any* JavaScript or CSS file, you **must** bump the query parameter (e.g., `?v=X`) in `index.html` and within the `import` statements of the ES modules to ensure users see the updates immediately.

## Testing

Run unit tests locally to verify mathematical correctness when modifying calculators.

```bash
npm install
npm test
```
