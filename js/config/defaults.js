export const DEFAULT_BANGLE_VALUES = {
    bangleShape: 'Round',       // 'Round' or 'Oval'
    diameter: 57.3,             // mm (for Round)
    shortDiameter: 54.0,        // mm (for Oval)
    longDiameter: 60.0,         // mm (for Oval)
    height: 4.0,                // mm
    coverage: 100,              // % (100% full eternity/full bangle, 50% half, or custom %)
    rows: 1,
    quantity: 1,
    stoneShape: 'Round',
    stoneSize: 2.0,             // mm
    prongStyle: 'common'        // 'common' or 'self'
};

export const PRONG_GAPS = {
    common: 0.2,  // 0.2 mm gap for common prong
    self: 0.5     // 0.5 mm gap for self prong
};

export const STONE_SHAPES = [
    { id: 'Round', label: 'Round (Brilliant)' },
    { id: 'Princess', label: 'Princess (Square)' },
    { id: 'Oval', label: 'Oval' },
    { id: 'Baguette', label: 'Baguette' },
    { id: 'Marquise', label: 'Marquise' },
    { id: 'Emerald', label: 'Emerald Cut' }
];

export const VALIDATION_RULES = {
    diameter: { min: 10, max: 200, type: 'number' },
    shortDiameter: { min: 10, max: 200, type: 'number' },
    longDiameter: { min: 10, max: 200, type: 'number' },
    height: { min: 0.1, max: 50, type: 'number' },
    coverage: { min: 1, max: 100, type: 'number' },
    rows: { min: 1, max: 50, type: 'number' },
    quantity: { min: 1, max: 1000, type: 'number' },
    stoneSize: { min: 0.1, max: 50, type: 'number' }
};

export const BANGLE_SIZE_PRESETS = [
    { label: '2-2', diameter: 54.0 },
    { label: '2-4', diameter: 57.2 },
    { label: '2-6', diameter: 60.3 },
    { label: '2-8', diameter: 63.5 },
    { label: '2-10', diameter: 66.7 },
    { label: '2-12', diameter: 69.9 }
];

// Easy-Select A–Z closing codes for bangle inner diameter
export const BANGLE_CLOSING_CODES = [
    // Oval sizes (A–J): shortDiameter × longDiameter
    { code: 'A', shape: 'Oval', shortDiameter: 45,   longDiameter: 55,   label: 'A — Oval 45 × 55 mm' },
    { code: 'B', shape: 'Oval', shortDiameter: 55,   longDiameter: 65,   label: 'B — Oval 55 × 65 mm' },
    { code: 'C', shape: 'Oval', shortDiameter: 58,   longDiameter: 68,   label: 'C — Oval 58 × 68 mm' },
    { code: 'D', shape: 'Oval', shortDiameter: 42,   longDiameter: 52,   label: 'D — Oval 42 × 52 mm' },
    { code: 'E', shape: 'Oval', shortDiameter: 47,   longDiameter: 57,   label: 'E — Oval 47 × 57 mm' },
    { code: 'F', shape: 'Oval', shortDiameter: 53,   longDiameter: 60,   label: 'F — Oval 53 × 60 mm' },
    { code: 'G', shape: 'Oval', shortDiameter: 50,   longDiameter: 59,   label: 'G — Oval 50 × 59 mm' },
    { code: 'H', shape: 'Oval', shortDiameter: 50,   longDiameter: 56,   label: 'H — Oval 50 × 56 mm' },
    { code: 'I', shape: 'Oval', shortDiameter: 55,   longDiameter: 60,   label: 'I — Oval 55 × 60 mm' },
    { code: 'J', shape: 'Oval', shortDiameter: 46,   longDiameter: 66,   label: 'J — Oval 46 × 66 mm' },
    // Round sizes (K–Z): single diameter
    { code: 'K', shape: 'Round', diameter: 38,   label: 'K — Round 38 mm' },
    { code: 'L', shape: 'Round', diameter: 40,   label: 'L — Round 40 mm' },
    { code: 'M', shape: 'Round', diameter: 42,   label: 'M — Round 42 mm' },
    { code: 'N', shape: 'Round', diameter: 50,   label: 'N — Round 50 mm' },
    { code: 'O', shape: 'Round', diameter: 52.5, label: 'O — Round 52.5 mm' },
    { code: 'P', shape: 'Round', diameter: 55,   label: 'P — Round 55 mm' },
    { code: 'Q', shape: 'Round', diameter: 57.5, label: 'Q — Round 57.5 mm' },
    { code: 'R', shape: 'Round', diameter: 60,   label: 'R — Round 60 mm' },
    { code: 'S', shape: 'Round', diameter: 62.5, label: 'S — Round 62.5 mm' },
    { code: 'T', shape: 'Round', diameter: 65,   label: 'T — Round 65 mm' },
    { code: 'U', shape: 'Round', diameter: 67.5, label: 'U — Round 67.5 mm' },
    { code: 'V', shape: 'Round', diameter: 70,   label: 'V — Round 70 mm' },
    { code: 'W', shape: 'Round', diameter: 72.5, label: 'W — Round 72.5 mm' },
    { code: 'X', shape: 'Round', diameter: 75,   label: 'X — Round 75 mm' },
    { code: 'Y', shape: 'Round', diameter: 80,   label: 'Y — Round 80 mm' },
    { code: 'Z', shape: 'Round', diameter: 80,   label: 'Z — Round 80+ mm' }
];

// Easy-Select A–Z size codes for finger rings (Method: Inner Diameter by Ring Stick, Tolerance ±0.15 mm)
export const RING_SIZE_CODES = [
    // Baby (A–E)
    { code: 'A', category: 'Baby',   diameter: 12.0, circumference: 38, label: 'A — Baby (12.0 mm / Circ 38 mm)' },
    { code: 'B', category: 'Baby',   diameter: 12.4, circumference: 39, label: 'B — Baby (12.4 mm / Circ 39 mm)' },
    { code: 'C', category: 'Baby',   diameter: 12.8, circumference: 40, label: 'C — Baby (12.8 mm / Circ 40 mm)' },
    { code: 'D', category: 'Baby',   diameter: 13.2, circumference: 41, label: 'D — Baby (13.2 mm / Circ 41 mm)' },
    { code: 'E', category: 'Baby',   diameter: 13.6, circumference: 43, label: 'E — Baby (13.6 mm / Circ 43 mm)' },
    // Ladies (F–N)
    { code: 'F', category: 'Ladies', diameter: 14.0, circumference: 44, label: 'F — Ladies (14.0 mm / Circ 44 mm)' },
    { code: 'G', category: 'Ladies', diameter: 14.4, circumference: 45, label: 'G — Ladies (14.4 mm / Circ 45 mm)' },
    { code: 'H', category: 'Ladies', diameter: 14.8, circumference: 47, label: 'H — Ladies (14.8 mm / Circ 47 mm)' },
    { code: 'I', category: 'Ladies', diameter: 15.2, circumference: 48, label: 'I — Ladies (15.2 mm / Circ 48 mm)' },
    { code: 'J', category: 'Ladies', diameter: 15.6, circumference: 49, label: 'J — Ladies (15.6 mm / Circ 49 mm)' },
    { code: 'K', category: 'Ladies', diameter: 16.0, circumference: 50, label: 'K — Ladies (16.0 mm / Circ 50 mm)' },
    { code: 'L', category: 'Ladies', diameter: 16.4, circumference: 52, label: 'L — Ladies (16.4 mm / Circ 52 mm)' },
    { code: 'M', category: 'Ladies', diameter: 16.8, circumference: 53, label: 'M — Ladies (16.8 mm / Circ 53 mm)' },
    { code: 'N', category: 'Ladies', diameter: 17.2, circumference: 54, label: 'N — Ladies (17.2 mm / Circ 54 mm)' },
    // Gents (O–U)
    { code: 'O', category: 'Gents',  diameter: 17.6, circumference: 55, label: 'O — Gents (17.6 mm / Circ 55 mm)' },
    { code: 'P', category: 'Gents',  diameter: 18.0, circumference: 57, label: 'P — Gents (18.0 mm / Circ 57 mm)' },
    { code: 'Q', category: 'Gents',  diameter: 18.4, circumference: 58, label: 'Q — Gents (18.4 mm / Circ 58 mm)' },
    { code: 'R', category: 'Gents',  diameter: 18.8, circumference: 59, label: 'R — Gents (18.8 mm / Circ 59 mm)' },
    { code: 'S', category: 'Gents',  diameter: 19.1, circumference: 60, label: 'S — Gents (19.1 mm / Circ 60 mm)' },
    { code: 'T', category: 'Gents',  diameter: 19.5, circumference: 61, label: 'T — Gents (19.5 mm / Circ 61 mm)' },
    { code: 'U', category: 'Gents',  diameter: 19.9, circumference: 63, label: 'U — Gents (19.9 mm / Circ 63 mm)' },
    // Unisex (V–Z)
    { code: 'V', category: 'Unisex', diameter: 20.3, circumference: 64, label: 'V — Unisex (20.3 mm / Circ 64 mm)' },
    { code: 'W', category: 'Unisex', diameter: 20.7, circumference: 65, label: 'W — Unisex (20.7 mm / Circ 65 mm)' },
    { code: 'X', category: 'Unisex', diameter: 21.1, circumference: 66, label: 'X — Unisex (21.1 mm / Circ 66 mm)' },
    { code: 'Y', category: 'Unisex', diameter: 21.5, circumference: 68, label: 'Y — Unisex (21.5 mm / Circ 68 mm)' },
    { code: 'Z', category: 'Unisex', diameter: 21.9, circumference: 69, label: 'Z — Unisex (21.9 mm / Circ 69 mm)' }
];
export const RING_SIZE_TOLERANCE = 0.15; // ±0.15 mm

export const DEFAULT_RING_VALUES = {
    sizeCode: '',
    diameter: 18.0,
    height: 1.5,   // mm (default 1.5 mm)
    coverage: 100, // 100% full eternity, 50% half eternity
    rows: 1,
    quantity: 1,
    stoneShape: 'Round',
    stoneSize: 1.5,
    prongStyle: 'common'
};

export const RING_SIZES = {
    US: [
        { size: 3, diameter: 14.1 },
        { size: 3.5, diameter: 14.5 },
        { size: 4, diameter: 14.9 },
        { size: 4.5, diameter: 15.3 },
        { size: 5, diameter: 15.7 },
        { size: 5.5, diameter: 16.1 },
        { size: 6, diameter: 16.5 },
        { size: 6.5, diameter: 16.9 },
        { size: 7, diameter: 17.3 },
        { size: 7.5, diameter: 17.7 },
        { size: 8, diameter: 18.1 },
        { size: 8.5, diameter: 18.5 },
        { size: 9, diameter: 18.9 },
        { size: 9.5, diameter: 19.4 },
        { size: 10, diameter: 19.8 },
        { size: 10.5, diameter: 20.2 },
        { size: 11, diameter: 20.6 },
        { size: 11.5, diameter: 21.0 },
        { size: 12, diameter: 21.4 },
        { size: 12.5, diameter: 21.8 },
        { size: 13, diameter: 22.2 }
    ],
    IN: [
        { size: 1, diameter: 12.4 }, { size: 2, diameter: 12.8 }, { size: 3, diameter: 13.1 }, { size: 4, diameter: 13.4 }, { size: 5, diameter: 13.7 },
        { size: 6, diameter: 14.0 }, { size: 7, diameter: 14.3 }, { size: 8, diameter: 14.6 }, { size: 9, diameter: 15.0 }, { size: 10, diameter: 15.3 },
        { size: 11, diameter: 15.6 }, { size: 12, diameter: 16.0 }, { size: 13, diameter: 16.2 }, { size: 14, diameter: 16.5 }, { size: 15, diameter: 16.8 },
        { size: 16, diameter: 17.2 }, { size: 17, diameter: 17.5 }, { size: 18, diameter: 17.8 }, { size: 19, diameter: 18.1 }, { size: 20, diameter: 18.5 },
        { size: 21, diameter: 18.8 }, { size: 22, diameter: 19.1 }, { size: 23, diameter: 19.4 }, { size: 24, diameter: 19.7 }, { size: 25, diameter: 20.0 },
        { size: 26, diameter: 20.4 }, { size: 27, diameter: 20.7 }, { size: 28, diameter: 21.0 }, { size: 29, diameter: 21.3 }, { size: 30, diameter: 21.6 }
    ]
};

// Nick Setting - Inspection Parameters (Image 1)
export const NICK_SETTING_DATA = [
    { diamondSize: 1.05, od: 1.8, id: 0.8, thickness: 0.6 },
    { diamondSize: 1.25, od: 2.0, id: 0.8, thickness: 0.6 },
    { diamondSize: 1.35, od: 2.2, id: 1.0, thickness: 0.6 },
    { diamondSize: 1.55, od: 2.5, id: 1.2, thickness: 0.6 },
    { diamondSize: 1.75, od: 2.8, id: 1.2, thickness: 0.6 },
    { diamondSize: 1.85, od: 3.0, id: 1.5, thickness: 0.8 },
    { diamondSize: 2.15, od: 3.5, id: 1.5, thickness: 0.8 }
];

// Round Diamond Diameter to Carat Weight — exact values from user-provided chart
export const STONE_WEIGHT_CHART = [
    { diameter: 0.95, weight: 0.004 },
    { diameter: 1.0,  weight: 0.005 },
    { diameter: 1.05, weight: 0.005 },
    { diameter: 1.1,  weight: 0.006 },
    { diameter: 1.15, weight: 0.007 },
    { diameter: 1.2,  weight: 0.007 },
    { diameter: 1.25, weight: 0.009 },
    { diameter: 1.3,  weight: 0.009 },
    { diameter: 1.35, weight: 0.01  },
    { diameter: 1.4,  weight: 0.012 },
    { diameter: 1.45, weight: 0.013 },
    { diameter: 1.5,  weight: 0.014 },
    { diameter: 1.55, weight: 0.017 },
    { diameter: 1.6,  weight: 0.017 },
    { diameter: 1.65, weight: 0.02  },
    { diameter: 1.7,  weight: 0.02  },
    { diameter: 1.75, weight: 0.023 },
    { diameter: 1.8,  weight: 0.025 },
    { diameter: 1.85, weight: 0.025 },
    { diameter: 1.9,  weight: 0.027 },
    { diameter: 1.95, weight: 0.031 },
    { diameter: 2.0,  weight: 0.033 },
    { diameter: 2.05, weight: 0.034 },
    { diameter: 2.1,  weight: 0.038 },
    { diameter: 2.15, weight: 0.04  },
    { diameter: 2.2,  weight: 0.043 },
    { diameter: 2.25, weight: 0.045 },
    { diameter: 2.3,  weight: 0.045 },
    { diameter: 2.35, weight: 0.05  },
    { diameter: 2.4,  weight: 0.057 },
    { diameter: 2.45, weight: 0.06  },
    { diameter: 2.5,  weight: 0.065 },
    { diameter: 2.55, weight: 0.07  },
    { diameter: 2.6,  weight: 0.07  },
    { diameter: 2.65, weight: 0.074 },
    { diameter: 2.7,  weight: 0.074 },
    { diameter: 2.75, weight: 0.08  },
    { diameter: 2.8,  weight: 0.085 },
    { diameter: 2.85, weight: 0.09  },
    { diameter: 2.9,  weight: 0.09  },
    { diameter: 2.95, weight: 0.102 },
    { diameter: 3.0,  weight: 0.102 },
    { diameter: 3.05, weight: 0.118 },
    { diameter: 3.1,  weight: 0.118 },
    { diameter: 3.15, weight: 0.12  },
    { diameter: 3.2,  weight: 0.125 },
    { diameter: 3.3,  weight: 0.13  },
    { diameter: 3.4,  weight: 0.14  },
    { diameter: 3.5,  weight: 0.15  },
    { diameter: 3.6,  weight: 0.17  },
    { diameter: 3.7,  weight: 0.17  },
    { diameter: 3.8,  weight: 0.20  },
    { diameter: 3.9,  weight: 0.22  },
    { diameter: 4.0,  weight: 0.235 },
    { diameter: 4.1,  weight: 0.25  },
    // Larger sizes (standard industry data)
    { diameter: 4.2, weight: 0.27 }, { diameter: 4.3, weight: 0.29 },
    { diameter: 4.4, weight: 0.31 }, { diameter: 4.5, weight: 0.33 }, { diameter: 4.6, weight: 0.35 },
    { diameter: 4.7, weight: 0.37 }, { diameter: 4.8, weight: 0.40 }, { diameter: 4.9, weight: 0.42 },
    { diameter: 5.0, weight: 0.45 }, { diameter: 5.1, weight: 0.48 }, { diameter: 5.2, weight: 0.50 },
    { diameter: 5.3, weight: 0.53 }, { diameter: 5.4, weight: 0.57 }, { diameter: 5.5, weight: 0.60 },
    { diameter: 5.6, weight: 0.63 }, { diameter: 5.7, weight: 0.66 }, { diameter: 5.8, weight: 0.70 },
    { diameter: 5.9, weight: 0.74 }, { diameter: 6.0, weight: 0.78 }, { diameter: 6.1, weight: 0.81 },
    { diameter: 6.2, weight: 0.86 }, { diameter: 6.3, weight: 0.90 }, { diameter: 6.4, weight: 0.94 },
    { diameter: 6.5, weight: 1.00 }, { diameter: 6.6, weight: 1.03 }, { diameter: 6.7, weight: 1.08 },
    { diameter: 6.8, weight: 1.13 }, { diameter: 6.9, weight: 1.18 }, { diameter: 7.0, weight: 1.23 },
    { diameter: 7.1, weight: 1.33 }, { diameter: 7.2, weight: 1.39 }, { diameter: 7.3, weight: 1.45 },
    { diameter: 7.4, weight: 1.51 }, { diameter: 7.5, weight: 1.57 }, { diameter: 7.6, weight: 1.63 },
    { diameter: 7.7, weight: 1.70 }, { diameter: 7.8, weight: 1.77 }, { diameter: 7.9, weight: 1.83 },
    { diameter: 8.0, weight: 1.91 }, { diameter: 8.1, weight: 1.98 }, { diameter: 8.2, weight: 2.05 },
    { diameter: 8.3, weight: 2.13 }, { diameter: 8.4, weight: 2.21 }, { diameter: 8.5, weight: 2.29 },
    { diameter: 8.6, weight: 2.37 }, { diameter: 8.7, weight: 2.45 }, { diameter: 8.8, weight: 2.54 },
    { diameter: 8.9, weight: 2.62 }, { diameter: 9.0, weight: 2.71 }, { diameter: 9.1, weight: 2.80 },
    { diameter: 9.2, weight: 2.90 }, { diameter: 9.3, weight: 2.99 }, { diameter: 9.4, weight: 3.09 }
];

export const DEFAULT_BRACELET_VALUES = {
    length: 7.0,
    lengthUnit: 'in', // 'in', 'cm', or 'mm'
    rows: 1,
    quantity: 1,
    stoneShape: "Round",
    stoneSize: 2.0,
    stoneGap: 0.5,
    wastagePercent: 0
};
