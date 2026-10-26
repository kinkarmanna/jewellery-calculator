# Jewellery Calculator — Technical Architecture & Project Context

> **Single Source of Truth** for the Jewellery Calculator project, repository configuration, mathematical models, UI architecture, developer rules, and complete feature history.

---

## 1. Project Metadata & GitHub Repository

- **Project Name:** Jewellery Calculator
- **GitHub Repository:** [`https://github.com/kinkarmanna/jewellery-calculator.git`](https://github.com/kinkarmanna/jewellery-calculator.git)
- **Primary Branch:** `main`
- **Hosting / Deployment:** GitHub Pages (Static hosting served directly from the root of `main`)
- **Live Application URL:** [`https://kinkarmanna.github.io/jewellery-calculator/`](https://kinkarmanna.github.io/jewellery-calculator/)
- **Technology Stack:**
  - **Runtime / Language:** Pure Vanilla JavaScript (Modern ES6+ Modules, zero external runtime libraries or bundlers)
  - **Styling:** Semantic CSS3 (CSS Custom Properties, responsive CSS Grid / Flexbox, light/dark themes)
  - **Markup:** Single-Page Application (SPA) HTML5
  - **Testing Engine:** Native Node.js test runner using `assert` module
- **Local Server:** `node server.js` (starts a simple local HTTP server) or `run_app.bat`

---

## 2. Directory Structure & Complete File Inventory

```text
jewellery-calculator/
├── .gitignore                      # Git ignore file (node_modules, logs, OS metadata)
├── README.md                       # Public-facing repository introduction and quickstart
├── CONTEXT.md                      # Comprehensive developer & architectural context (this file)
├── package.json                    # Project metadata, ES module declaration, and test scripts
├── server.js                       # Lightweight local HTTP server for development
├── index.html                      # Single-page application layout and view containers
├── run_app.bat                     # Windows batch launcher for quick local startup
│
├── css/
│   └── styles.css                  # Global design system, theme variables, cards, forms & print CSS
│
├── images/
│   ├── bangle-card.jpg             # High-resolution product photo for Studded Bangle card
│   ├── bracelet-card.jpg           # High-resolution product photo for Tennis Bracelet card
│   └── ring-card.png               # High-resolution product photo for Finger Ring card
│
├── js/
│   ├── app.js                      # Application bootstrap, routing, card navigation, theme controller
│   │
│   ├── config/
│   │   ├── defaults.js             # Core domain constants: size charts, presets, Nick Plate specs, gaps
│   │   └── storage.js              # LocalStorage persistence helper functions
│   │
│   ├── calculations/
│   │   ├── bangleCalculator.js     # Pure math: Bangle geometry, circumference, and stone capacity
│   │   ├── braceletCalculator.js   # Pure math: Tennis bracelet usable length and stone counts
│   │   ├── ringCalculator.js       # Pure math: Ring circumference, height wall thickness, and capacity
│   │   ├── customBangleCalculator.js # Pure math: Standard-to-Custom comparison and delta engine
│   │   ├── valueCalculator.js      # Pure math: Material valuation, making charges, GST, and totals
│   │   ├── stonePriceManager.js    # Utility: Stone pricing lookup, mutations, and INR currency formatting
│   │   ├── earringCalculator.js    # Placeholder: Coming Soon module for earring math
│   │   └── necklaceCalculator.js   # Placeholder: Coming Soon module for necklace math
│   │
│   └── ui/
│       ├── navigation.js           # View switcher (toggles 'hidden' class on <main> sections)
│       ├── bangleForm.js           # Form handling, Nick plate logic, and DOM events for Bangles
│       ├── braceletForm.js         # Form handling, inch/mm conversion, and DOM events for Bracelets
│       ├── ringForm.js             # Form handling, size codes, height, and DOM events for Rings
│       ├── customBangleForm.js     # Form handling, copy size, mode toggles for Custom Bangle
│       └── resultView.js           # Dynamic HTML generator for the live Workshop Slip & print slips
│
└── tests/
    ├── bangleCalculator.test.js    # Unit tests for bangle circumference and spacing logic (14 tests)
    ├── ringCalculator.test.js      # Unit tests for ring diameter, circumference, codes & height (21 tests)
    ├── braceletCalculator.test.js  # Unit tests for bracelet length, usable setting & valuation (7 tests)
    ├── customBangleCalculator.test.js # Unit tests for resize, gap preservation, and stone deltas (4 tests)
    └── stonePriceManager.test.js   # Unit tests for stone price management and currency formatting (15 tests)
```

---

## 3. Core Domain Models & Mathematical Formulas

The application is engineered for jewellery artisans, CAD engineers, and manufacturers to calculate physical diamond requirements, row layouts, and financial estimates.

### 3.1 Studded Bangle Calculator (`bangleCalculator.js`)

1. **Inner Diameter Determination:**
   - **Round Bangle:** Direct user input or preset diameter $D$.
   - **Oval Bangle:** Calculated from minor (short) and major (long) axes using average diameter:
     $$\text{Inner Diameter} = \frac{\text{Short Diameter} + \text{Long Diameter}}{2}$$
   - **Easy-Select Closing Codes (A–Z):** Industry standard inner diameters:
     - Codes `A`–`J`: Oval bangles (e.g. `A` = $45 \times 55\text{ mm}$, `B` = $55 \times 65\text{ mm}$, etc.).
     - Codes `K`–`Z`: Round bangles (e.g. `K` = $38\text{ mm}$, `Q` = $57.5\text{ mm}$, `V` = $70\text{ mm}$, etc.).

2. **Metal Wall Thickness & Outer Circumference:**
   - Diamonds are set on the *outer perimeter* of the metal frame. Metal height ($h$) represents single-wall thickness:
     $$\text{Outer Diameter} = \text{Inner Diameter} + (2 \times h)$$
     $$\text{Outer Circumference} = \text{Outer Diameter} \times \pi$$

3. **Stone Coverage:**
   - Supports Full Bangle ($100\%$) and Half Bangle ($50\%$) coverage (or custom percentages for Oval bangles):
     $$\text{Setting Circumference} = \text{Outer Circumference} \times \left(\frac{\text{Coverage \%}}{100}\right)$$

4. **Calculation Modes:**
   - **Number of stone calculation (Prong Spacing):** Calculates how many stones fit given a prong gap ($g$):
     $$\text{Pitch} = \text{Effective Element Size} + g$$
     $$\text{Stones Per Row} = \left\lfloor \frac{\text{Setting Circumference}}{\text{Pitch}} \right\rfloor$$
   - **Stone to Stone Gap Calculation (Target Stones):** Calculates the required physical spacing to fit a desired number of stones ($N_{\text{target}}$):
     $$\text{Required Gap} = \left(\frac{\text{Setting Circumference}}{N_{\text{target}}}\right) - \text{Effective Element Size}$$

5. **Multipliers & Lock Reminder:**
   - $\text{Total Stones} = \text{Stones Per Row} \times \text{Rows} \times \text{Quantity}$
   - **Lock Mechanism Reminder:** For hinged or tongue-clasp bangles, artisans must deduct 2 stones from the calculated row count.

---

### 3.2 Finger Ring Calculator (`ringCalculator.js`)

1. **Ring Sizing Modes:**
   - **Easy-Select Codes (A–Z):** Based on the Ring Stick Inner Diameter method (Tolerance $\pm 0.15\text{ mm}$):
     - **Baby (`A`–`E`):** $12.0\text{ mm}$ (Circ $38\text{ mm}$) to $13.6\text{ mm}$ (Circ $43\text{ mm}$)
     - **Ladies (`F`–`N`):** $14.0\text{ mm}$ (Circ $44\text{ mm}$) to $17.2\text{ mm}$ (Circ $54\text{ mm}$)
     - **Gents (`O`–`U`):** $17.6\text{ mm}$ (Circ $55\text{ mm}$) to $19.9\text{ mm}$ (Circ $63\text{ mm}$)
     - **Unisex (`V`–`Z`):** $20.3\text{ mm}$ (Circ $64\text{ mm}$) to $21.9\text{ mm}$ (Circ $69\text{ mm}$)
   - **Manual Entry:** Direct inner diameter in millimetres (default $18.0\text{ mm}$).
   - **Legacy Standards:** US ($3$–$13$) and Indian ($1$–$30$) sizes retained for backward compatibility.

2. **Metal Height (Wall Thickness):**
   - Metal height option with default **$1.5\text{ mm}$**:
     $$\text{Outer Circumference} = (\text{Inner Diameter} + 2 \times h) \times \pi$$

3. **Stone Coverage:**
   - Full Eternity ($100\%$), Half Eternity ($50\%$), or custom coverage percentage:
     $$\text{Setting Circumference} = \text{Outer Circumference} \times \left(\frac{\text{Coverage \%}}{100}\right)$$

4. **Stone Capacity:**
     $$\text{Stones Per Row} = \left\lfloor \frac{\text{Setting Circumference}}{\text{Effective Element Size} + \text{Gap}} \right\rfloor$$
     $$\text{Total Stones} = \text{Stones Per Row} \times \text{Rows} \times \text{Quantity}$$

---

### 3.3 Tennis Bracelet Calculator (`braceletCalculator.js`)

1. **Multi-Unit Length Input:**
   - Total length can be entered in **Inches (in)**, **Centimeters (cm)**, or **Millimeters (mm)** with live bi-directional unit conversion.
   - Standardized to millimetres internally:
     $$\text{Length}_{\text{mm}} = \begin{cases} \text{Length} \times 25.4 & \text{if unit is Inch} \\ \text{Length} \times 10 & \text{if unit is cm} \\ \text{Length} & \text{if unit is mm} \end{cases}$$
2. **Total Length Calculation (Lock Subtraction Removed):**
   - Setting calculations are performed over the **Total Length** without deducting a lock clasp:
     $$\text{Setting Length} = \text{Length}_{\text{mm}}$$
3. **Stone Capacity:**
     $$\text{Stones Per Row} = \left\lfloor \frac{\text{Setting Length}}{\text{Effective Element Size} + \text{Gap}} \right\rfloor$$
     $$\text{Total Stones} = \text{Stones Per Row} \times \text{Rows} \times \text{Quantity}$$

---

### 3.4 Setting Styles & Nick Plates

1. **Prong Settings (Standard):**
   - **Common Prong:** $0.2\text{ mm}$ default inter-stone gap.
   - **Self Prong:** $0.5\text{ mm}$ default inter-stone gap.
2. **Nick Plate Setting:**
   - For prefabricated diamond nick plates. In this setting, the diamond size is chosen from standard specifications (`NICK_SETTING_DATA`), but the physical footprint occupied in the row is governed by the **Plate Outer Diameter (OD)**:
     $$\text{Effective Element Size} = \text{Plate OD}$$
   - The dropdown displays both carat weight and millimetre size: `0.005 ct (1.05 mm)`, `0.01 ct (1.35 mm)`, etc.
   - The selected prong gap ($0.2\text{ mm}$ or $0.5\text{ mm}$) applies between adjacent plates.

---

### 3.5 Stone Weight Conversion & Carat Estimation

1. **Weight ↔ Size Interactive Swap:**
   - Forms support bi-directional swapping between **Weight (ct)** and **Size (mm)** using the hardcoded industry chart `STONE_WEIGHT_CHART` (ranging from $0.95\text{ mm} \rightarrow 0.004\text{ ct}$ up to $9.4\text{ mm} \rightarrow 3.09\text{ ct}$).
2. **Total Carat Weight Estimation:**
   - For Round brilliant stones, total carat weight is estimated by matching the stone diameter to the closest chart entry:
     $$\text{Total Carat Weight (ct)} = \text{Per Stone Weight (ct)} \times \text{Total Stones}$$

---

### 3.6 Valuation & Pricing Engine (`valueCalculator.js`)

The financial valuation calculates production estimates in Indian Rupees (INR, ₹):

1. **Stone Value (Priced per Carat):**
   $$\text{Stone Value} = \text{Total Carats} \times \text{Stone Rate (₹/ct)}$$
2. **Gold Value:**
   $$\text{Gold Value} = \text{Gold Weight (g)} \times \text{Gold Rate (₹/g)}$$
3. **Total Material Value:**
   $$\text{Total Material Value} = \text{Stone Value} + \text{Gold Value}$$
4. **Making Charges (Applied to Total Material Value):**
   $$\text{Making Charge} = \text{Total Material Value} \times \left(\frac{\text{Making \%}}{100}\right)$$
5. **Subtotal:**
   $$\text{Subtotal} = \text{Total Material Value} + \text{Making Charge}$$
6. **Statutory GST (Fixed 3%):**
   $$\text{GST Amount} = \text{Subtotal} \times 0.03$$
7. **Grand Total:**
   $$\text{Grand Total} = \text{Subtotal} + \text{GST Amount}$$

---

### 3.7 Standard to Customized Bangle Calculator (`customBangleCalculator.js`)

Enables artisans and CAD modelers to adapt an existing standard reference bangle into a customized piece (resizing, stone change, gap maintenance, or target stone specification) and see an instant side-by-side comparison with the exact difference in stone count, spacing, and carat weight.

1. **Standard Reference Bangle Modeling:**
   - **Dimensions:** Selected via Easy-Select (`A`–`Z`) or Manual Entry (Round diameter $D_{\text{std}}$ or Oval short/long axes) with metal height $h_{\text{std}}$:
     $$\text{Outer Circ}_{\text{std}} = (\text{Inner Dia}_{\text{std}} + 2 \times h_{\text{std}}) \times \pi$$
   - **Existing Gap Derivation:**
     - If the user knows the actual stone count on the standard bangle ($N_{\text{std}}$):
       $$\text{Standard Effective Gap} = \left(\frac{\text{Outer Circ}_{\text{std}}}{N_{\text{std}}}\right) - \text{Stone Size}_{\text{std}}$$
     - If blank, standard prong gap is applied ($0.2\text{ mm}$ for common prong, $0.5\text{ mm}$ for self prong):
       $$N_{\text{std}} = \left\lfloor \frac{\text{Outer Circ}_{\text{std}}}{\text{Stone Size}_{\text{std}} + \text{Prong Gap}_{\text{std}}} \right\rfloor$$

2. **Customized Bangle Modeling & Spacing Modes:**
   - **Dimensions:** Target inner diameter (or Oval axes) with metal height $h_{\text{cust}}$:
     $$\text{Outer Circ}_{\text{cust}} = (\text{Inner Dia}_{\text{cust}} + 2 \times h_{\text{cust}}) \times \pi$$
   - **Stone Size Options:** Keep same stone as standard or change to a different size/weight.
   - **Spacing Modes:**
     - **Maintain Standard Gap (`keep_gap`):** Applies the exact effective gap from the standard bangle to the customized circumference:
       $$N_{\text{cust}} = \left\lfloor \frac{\text{Outer Circ}_{\text{cust}}}{\text{Stone Size}_{\text{cust}} + \text{Standard Effective Gap}} \right\rfloor$$
     - **Prong Gap (`standard_prong`):** Uses default prong spacing ($0.2\text{ mm}$ or $0.5\text{ mm}$).
     - **Target Stones (`target_stones`):** Solves for the required gap to fit exactly $N_{\text{target}}$ stones per row:
       $$\text{Required Gap} = \left(\frac{\text{Outer Circ}_{\text{cust}}}{N_{\text{target}}}\right) - \text{Stone Size}_{\text{cust}}$$

3. **Comparison & Delta Metrics:**
   - $\Delta \text{Stones Per Row} = N_{\text{cust}} - N_{\text{std}}$
   - $\Delta \text{Total Stones} = \Delta \text{Stones Per Row} \times \text{Rows} \times \text{Quantity}$
   - $\Delta \text{Carat Weight} = \text{Carat Weight}_{\text{cust}} - \text{Carat Weight}_{\text{std}}$
   - $\Delta \text{Circumference} = \text{Outer Circ}_{\text{cust}} - \text{Outer Circ}_{\text{std}}$
   - $\Delta \text{Gap} = \text{Gap}_{\text{cust}} - \text{Gap}_{\text{std}}$

---

## 4. UI / UX Design & Navigation

- **Home Screen Dashboard:**
  - Modern card-based grid showcasing available calculators with circular product avatar images and subtle drop-shadows.
  - **Card Ordering:**
    1. **Bangle** (Featured product photo `images/bangle-card.jpg` — opens Bangle Sub-Menu view)
    2. **Tennis Bracelet** (Featured product photo `images/bracelet-card.jpg`)
    3. **Finger Ring** (Featured product photo `images/ring-card.png`)
    4. **String Neckware** (Coming Soon)
- **Bangle Sub-Menu View (`#view-bangle-menu`):**
  - When the user selects **Bangle** from the home screen, this dedicated view displays:
    1. **New Eternity Bangle** (Studded Bangle Calculator)
    2. **Standard to Customized Bangle** (Custom Bangle Comparison Calculator)
  - Displayed in a 2-column side-by-side grid layout (`grid-template-columns: repeat(2, minmax(0, 340px)); justify-content: center;`).
  - Both sub-calculators' Back buttons return the user directly to this Bangle Sub-Menu, which in turn has a Back button returning to the Home screen.
- **Split-Screen Layout:**
  - On desktop and tablet devices, the left side houses the active configuration form, while the right side renders the real-time **Workshop Slip** (`resultView.js`).
- **Workshop Slip:**
  - Standard Calculators: Clean summary card featuring Input Summary, Stone Calculation breakdown, Total Stones Required banner, Estimated Carat Weight, and optional Financial Valuation card.
  - Standard to Customized Bangle: Renders a dedicated Comparison Workshop Slip with a prominent stone difference banner ($\pm$ stone count and carat weight difference), a 4-column side-by-side comparison table (Metric | Standard | Customized | Difference), workshop notes, and customized bangle financial valuation.
- **Dark Mode Support:**
  - Toggle button in the header switches between light and dark themes. The user preference is preserved in browser `localStorage`.

---

## 5. Critical Developer Rules & Constraints

> [!CAUTION]
> **1. FILE ENCODING RULE (WINDOWS / POWERSHELL CONSTRAINT):**
> **NEVER** use PowerShell commands (`Set-Content`, `Out-File`, `echo >`, `>>`) to edit or write files in this repository. In Windows PowerShell environments, redirection operators output in ANSI or UTF-16 LE with BOM. This corrupts UTF-8 emojis (`??`) and causes fatal JavaScript SyntaxErrors due to injected null bytes.
> **Mandatory Procedure:** Always use native Node.js scripts (`fs.readFileSync`/`fs.writeFileSync` with explicit `'utf8'` encoding) or the `replace_file_content` / `write_to_file` tools.

> [!IMPORTANT]
> **2. CACHE BUSTING REQUIREMENT (GITHUB PAGES):**
> Because this application runs purely on static vanilla ES modules without a bundler, GitHub Pages aggressively caches `.js` and `.css` files.
> Whenever modifying any JavaScript or CSS file, you **must bump the version query parameter** (e.g., `?v=29` $\rightarrow$ `?v=30`) simultaneously across:
> 1. `index.html` (script tag and stylesheet link)
> 2. Every internal ES module `import ... from '...?v=X'` statement across all JS files.

> [!NOTE]
> **3. SEPARATION OF CONCERNS:**
> - `/js/calculations/`: Must contain **pure functions only**. Zero DOM manipulation, zero `document.getElementById` calls, zero `localStorage` calls.
> - `/js/ui/`: Manages form inputs, event listeners, view state, and DOM updates.
> - `/js/config/`: Contains pure business constants and domain dictionaries.

---

## 6. Testing & Quality Assurance

All calculation modules are protected by unit test suites in `/tests/`.

To run all unit tests locally via Node.js:
```powershell
node tests/bangleCalculator.test.js ; node tests/ringCalculator.test.js ; node tests/braceletCalculator.test.js ; node tests/customBangleCalculator.test.js ; node tests/stonePriceManager.test.js
```
Or via npm (in standard bash/cmd shells):
```bash
npm test
```

### Test Suites (62 Total Tests):
- `bangleCalculator.test.js` (14 tests): Validates Round/Oval inner diameters, outer circumference with metal height, standard stone capacity, target stones gap calculations, and 50%/100% stone coverage.
- `ringCalculator.test.js` (21 tests): Validates Easy-Select A-Z codes (Baby, Ladies, Gents, Unisex), legacy diameter lookups, outer circumference with metal height, eternity circumferences, and stone capacity.
- `braceletCalculator.test.js` (7 tests): Validates carat weight estimation, unit conversions (in, cm, mm), total length calculation, and financial valuation math.
- `customBangleCalculator.test.js` (5 tests): Validates resizing with gap preservation, gap derivation from known existing stone counts, stone size upgrades, target stone mode, and valuation with scaled gold weight.
- `stonePriceManager.test.js` (15 tests): Validates price lookup, immutable mutations, and Indian Rupee currency formatting.

---

## 7. Version History & Changelog

- **v30 (Current):**
  - Standard to Customized Bangle: implemented proportional gold weight scaling on quantity change. When quantity changes (e.g. 1 $\rightarrow$ 2), the gold weight input and valuation automatically scale proportionally ($2\times$).
  - Added unit test in `tests/customBangleCalculator.test.js` for custom bangle valuation with quantity and scaled gold weight (62 total unit tests).
- **v29:**
  - Updated Bangle Sub-Menu styling: arranged "New Eternity Bangle" and "Standard to Customized Bangle" cards side-by-side using a responsive centered 2-column grid.
  - Removed obsolete `#card-custom-bangle { grid-column: 1; }` rule that was forcing the cards into a vertical stack.
- **v28:**
  - Unified Bangle navigation: replaced separate "New Eternity Bangle" and "Standard to Customized Bangle" home screen cards with a single **"Bangle"** card.
  - Added intermediate **Bangle Sub-Menu View** (`#view-bangle-menu`) showing both "New Eternity Bangle" and "Standard to Customized Bangle" sub-cards.
  - Updated Back button routing: both bangle calculators navigate back to the Bangle Sub-Menu, which in turn returns to the Home screen.
- **v27:**
  - Fully implemented **"Standard to Customized Bangle"** calculator:
    - Standard reference bangle inputs (Easy-Select `A`–`Z` or manual Round/Oval, height, existing stone count, stone weight/size).
    - Customized target bangle inputs with "Copy Size from Standard" helper.
    - Custom stone selection: keep same stone size or customize.
    - Three spacing modes: "Maintain Standard Gap", "Prong Gap", and "Target Stones".
    - Dedicated Comparison Workshop Slip displaying prominent $\pm$ stone count and carat weight difference callout banner, 4-column side-by-side comparison table (Metric | Standard | Customized | Difference), and optional financial valuation.
    - Added unit test suite `tests/customBangleCalculator.test.js` (4 tests, total suite: 61 tests passing).
- **v26:**
  - Updated Tennis Bracelet Calculator: removed Lock Length option (calculating with total length only) and added multi-unit length support (Inch, cm, mm) with auto-conversion.
- **v25:**
  - Added new home screen button "Standard to Customized Bangle" positioned directly below New Eternity Bangle with the bangle image.
- **v24:**
  - Renamed home screen card from "Earring / Stud" $\rightarrow$ "String Neckware".
- **v23:**
  - Renamed home screen card from "Studded Bangle" $\rightarrow$ "New Eternity Bangle".
- **v22:**
  - Integrated full technical architecture into `CONTEXT.md` and updated `README.md`.
  - Fixed `STONE_WEIGHT_CHART` key lookups in `braceletCalculator.js` and `braceletForm.js` from `.size` to `.diameter`, enabling accurate carat weight estimation and valuation for Tennis Bracelets.
  - Added `tests/braceletCalculator.test.js` and updated `package.json` test script.
- **v21:**
  - Added metal height option (wall thickness, default 1.5mm) to the Finger Ring calculator with outer circumference calculations.
  - Added Finger Ring Easy-Select size codes (`A`–`Z`) categorized by Baby, Ladies, Gents, and Unisex with $\pm 0.15\text{ mm}$ tolerance.
  - Added high-resolution `images/ring-card.png` to the home screen Finger Ring card.
  - Formatted Nick Plate diamond size dropdown as `ct (mm)`.
  - Removed deprecated Indian size presets from the Manual Entry Bangle form.
- **v13:**
  - Renamed Bangle calculation labels:
    - *"Spacing Calculation:"* $\rightarrow$ *"Select Calculation Mode:"*
    - *"Prong Spacing"* $\rightarrow$ *"Number of stone calculation"*
    - *"Target Stones"* $\rightarrow$ *"Stone to Stone Gap Calculation"*
- **v12:**
  - Migrated Ring size inputs to manual inner diameter and size code options.
- **v11:**
  - Added high-resolution `images/bracelet-card.jpg` for the Tennis Bracelet home card.
  - Reordered home cards: Studded Bangle $\rightarrow$ Tennis Bracelet $\rightarrow$ Finger Ring $\rightarrow$ Earring.
- **v10:**
  - Integrated complete Tennis Bracelet Calculator (inputs: length in inches, lock length in mm, rows, quantity, stones).
  - Modernized home dashboard cards with 85px circular image avatars, floating hover transitions, and drop-shadows.
  - Added high-resolution `images/bangle-card.jpg` for Studded Bangle card.
  - Switched stone valuation formula from per-piece rate to **rate per carat (₹/ct)**.
  - Applied making charges to the **Total Material Value** (Gold + Stones), with 3% GST.
