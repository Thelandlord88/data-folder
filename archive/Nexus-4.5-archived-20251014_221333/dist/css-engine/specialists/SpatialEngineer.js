/**
 * SpatialEngineer Specialist
 * Applies mathematical spacing and grid systems without aesthetic bias
 *
 * @module SpatialEngineer
 * @version 1.0.0
 * @architecture Scientific processing - geometric progressions, optimal grids
 */
import { GridMathematician } from './GridMathematician.js';
/**
 * Spacing scale types
 * Different mathematical progressions for spacing systems
 */
export const SPACING_TYPES = {
    fibonacci: 'fibonacci', // 0, 1, 1, 2, 3, 5, 8, 13, 21, 34...
    geometric: 'geometric', // Base * ratio^n (e.g., 8, 16, 24, 32...)
    modular: 'modular', // Like typography scales
    linear: 'linear', // Simple increments (8, 16, 24, 32...)
};
/**
 * Spacing scale names
 * Semantic naming from smallest to largest
 */
export const SPACING_NAMES = [
    '0', // 0px
    '1', // 0.25rem (4px @ 16px base)
    '2', // 0.5rem (8px)
    '3', // 0.75rem (12px)
    '4', // 1rem (16px)
    '5', // 1.25rem (20px)
    '6', // 1.5rem (24px)
    '8', // 2rem (32px)
    '10', // 2.5rem (40px)
    '12', // 3rem (48px)
    '16', // 4rem (64px)
    '20', // 5rem (80px)
    '24', // 6rem (96px)
];
/**
 * SpatialEngineer - Mathematical spacing and grid system specialist
 *
 * Responsibilities:
 * - Generate spacing scales (Fibonacci, geometric, modular)
 * - Calculate optimal grid systems (12-column, content-based)
 * - Generate responsive breakpoints
 * - Create z-index layering systems
 * - Apply container query logic
 *
 * Style-Agnostic: Works with ANY aesthetic (spacious, compact, etc.)
 */
export class SpatialEngineer {
    id = 'spatial-engineer';
    timeoutMs = 80;
    gridMathematician;
    constructor() {
        this.gridMathematician = new GridMathematician();
    }
    getPreferredColumns(dna) {
        const defaultSet = [4, 6, 8, 12];
        const featureRecord = dna.features;
        const candidate = featureRecord?.['preferredColumns'];
        if (Array.isArray(candidate)) {
            const numeric = candidate.filter((col) => typeof col === 'number' && Number.isInteger(col) && col > 0);
            if (numeric.length) {
                const unique = Array.from(new Set(numeric)).sort((a, b) => a - b);
                return unique.length ? unique : defaultSet;
            }
        }
        return defaultSet;
    }
    getLayoutRatio(dna) {
        switch (dna.constraints?.typeRatio) {
            case 'golden':
                return 'golden';
            case 'perfectFourth':
                return 'perfectFourth';
            default:
                return 'harmonic';
        }
    }
    estimateContainerWidths(breakpoints, baseSpace) {
        const minWidth = 320;
        const maxWidth = 1600;
        const widths = {};
        for (const [name, value] of Object.entries(breakpoints)) {
            const candidate = value > 0 ? value : minWidth;
            const margin = baseSpace * 4;
            const usable = Math.max(candidate - margin, minWidth);
            widths[name] = Math.min(Math.max(usable, minWidth), maxWidth);
        }
        return widths;
    }
    selectRepresentativeMatrix(computation) {
        if (!computation.grids.length) {
            return null;
        }
        const priorityOrder = ['lg', 'xl', '2xl', 'md'];
        for (const key of priorityOrder) {
            const match = computation.grids.find(matrix => matrix.breakpoint === key);
            if (match) {
                return match;
            }
        }
        return computation.grids[computation.grids.length - 1];
    }
    /**
     * Process design DNA and generate spatial facts
     *
     * @param dna Design DNA (normalized input)
     * @param opts Compilation options
     * @returns Spatial facts (spacing, grid, breakpoints)
     */
    async run(dna, opts) {
        const t0 = performance.now();
        try {
            // 1. Extract base spacing unit (default: 8px)
            const baseSpace = dna.constraints?.baseSpacePx ?? 8;
            // 2. Generate spacing scale (geometric by default)
            const spacing = this.generateSpacingScale(baseSpace, 'geometric');
            // 3. Generate breakpoints
            const breakpoints = dna.constraints?.breakpoints ?? this.getDefaultBreakpoints();
            // 4. Calculate advanced grid matrices
            const gridInput = {
                breakpoints,
                preferredColumns: this.getPreferredColumns(dna),
                ratio: this.getLayoutRatio(dna),
                baseUnit: baseSpace,
                containerWidths: this.estimateContainerWidths(breakpoints, baseSpace),
            };
            const gridComputation = await this.gridMathematician.run(gridInput);
            // 5. Provide legacy grid summary for backward compatibility
            const representativeMatrix = this.selectRepresentativeMatrix(gridComputation);
            const grid = representativeMatrix
                ? {
                    minColPx: Math.floor(representativeMatrix.grid.columnWidth),
                    maxColPx: Math.ceil(representativeMatrix.grid.columnWidth),
                    columns: representativeMatrix.grid.columns,
                }
                : this.calculateOptimalGrid(dna.constraints);
            const elapsed = performance.now() - t0;
            return {
                spacing,
                grid,
                breakpoints,
                grids: gridComputation.grids,
                aspectRatios: gridComputation.aspectRatios,
                contentWidthRecommendations: gridComputation.contentWidthRecommendations,
                diagnostics: gridComputation.diagnostics,
            };
        }
        catch (error) {
            throw new Error(`SpatialEngineer failed: ${error.message}`);
        }
    }
    /**
     * Generate spacing scale using different mathematical progressions
     *
     * @param base Base spacing unit in pixels
     * @param type Spacing scale type
     * @returns Map of spacing names to rem values
     */
    generateSpacingScale(base, type = 'geometric') {
        const spacing = {};
        switch (type) {
            case 'fibonacci':
                return this.generateFibonacciSpacing(base);
            case 'geometric':
                return this.generateGeometricSpacing(base);
            case 'modular':
                return this.generateModularSpacing(base);
            case 'linear':
                return this.generateLinearSpacing(base);
            default:
                return this.generateGeometricSpacing(base);
        }
    }
    /**
     * Generate Fibonacci-based spacing scale
     * Uses Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34...
     *
     * @param base Base spacing unit
     * @returns Spacing map
     */
    generateFibonacciSpacing(base) {
        const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
        const spacing = {};
        const baseRem = base / 16; // Convert px to rem (assuming 16px base)
        SPACING_NAMES.forEach((name, index) => {
            if (index < fib.length) {
                const value = (fib[index] * baseRem) / 4; // Scale down Fibonacci numbers
                spacing[name] = Math.round(value * 1000) / 1000; // Round to 3 decimals
            }
        });
        return spacing;
    }
    /**
     * Generate geometric spacing scale
     * Simple multiples of base unit: 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6
     *
     * @param base Base spacing unit
     * @returns Spacing map
     */
    generateGeometricSpacing(base) {
        const spacing = {};
        const baseRem = base / 16; // Convert px to rem
        // Multiples: 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6
        const multiples = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6];
        SPACING_NAMES.forEach((name, index) => {
            if (index < multiples.length) {
                const value = multiples[index] * baseRem;
                spacing[name] = Math.round(value * 1000) / 1000;
            }
        });
        return spacing;
    }
    /**
     * Generate modular spacing scale
     * Uses a ratio similar to typography scales
     *
     * @param base Base spacing unit
     * @returns Spacing map
     */
    generateModularSpacing(base) {
        const spacing = {};
        const baseRem = base / 16;
        const ratio = 1.5; // 3:2 ratio (perfect fifth)
        SPACING_NAMES.forEach((name, index) => {
            const power = index - 4; // Center at index 4 (value 1rem)
            const value = power === 0 ? baseRem : baseRem * Math.pow(ratio, power);
            spacing[name] = Math.max(0, Math.round(value * 1000) / 1000);
        });
        return spacing;
    }
    /**
     * Generate linear spacing scale
     * Simple increments based on base unit
     *
     * @param base Base spacing unit
     * @returns Spacing map
     */
    generateLinearSpacing(base) {
        const spacing = {};
        const baseRem = base / 16;
        // Linear increments
        const increments = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];
        SPACING_NAMES.forEach((name, index) => {
            if (index < increments.length) {
                const value = (increments[index] * baseRem) / 4;
                spacing[name] = Math.round(value * 1000) / 1000;
            }
        });
        return spacing;
    }
    /**
     * Calculate optimal grid system
     *
     * Principles:
     * - 12-column grid is most versatile (divisible by 2, 3, 4, 6)
     * - Min column width: 60px (readable content)
     * - Max column width: 120px (prevent overly wide content)
     * - Gaps between columns for breathing room
     *
     * @param constraints Design constraints
     * @returns Grid configuration
     */
    calculateOptimalGrid(constraints) {
        // Default 12-column grid
        const columns = 12;
        // Optimal column widths for readability
        const minColPx = 60; // Minimum readable column width
        const maxColPx = 120; // Maximum for comfortable reading
        // Calculate based on container width
        // For a 1200px container with 12 columns and 24px gaps:
        // (1200 - (11 * 24)) / 12 = ~78px per column (ideal!)
        return {
            minColPx,
            maxColPx,
            columns,
            gap: 24, // Default gap in pixels
            responsive: true,
        };
    }
    /**
     * Get default responsive breakpoints
     * Based on common device widths and content optimization
     *
     * @returns Breakpoint map
     */
    getDefaultBreakpoints() {
        return {
            xs: 320, // Mobile portrait
            sm: 640, // Mobile landscape
            md: 768, // Tablet portrait
            lg: 1024, // Tablet landscape / Small desktop
            xl: 1280, // Desktop
            '2xl': 1536, // Large desktop
        };
    }
    /**
     * Generate z-index scale for layering
     * Provides semantic naming for stacking contexts
     *
     * @returns Z-index map
     */
    generateZIndexScale() {
        return {
            'base': 0,
            'dropdown': 1000,
            'sticky': 1100,
            'fixed': 1200,
            'modal-backdrop': 1300,
            'modal': 1400,
            'popover': 1500,
            'tooltip': 1600,
        };
    }
    /**
     * Generate container sizes
     * Max-width values for centered containers
     *
     * @returns Container size map
     */
    generateContainerSizes() {
        return {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
            'full': '100%',
        };
    }
    /**
     * Calculate optimal content width (measure)
     * Based on typography size and readability
     *
     * @param fontSize Font size in pixels
     * @param characters Optimal characters per line (default: 65)
     * @returns Content width in pixels
     */
    calculateOptimalContentWidth(fontSize, characters = 65) {
        // Average character width is ~0.5em for most fonts
        const charWidth = fontSize * 0.5;
        return Math.round(charWidth * characters);
    }
    /**
     * Generate responsive grid configuration
     * Maps breakpoints to column counts
     *
     * @param breakpoints Breakpoint map
     * @returns Responsive grid config
     */
    generateResponsiveGrid(breakpoints) {
        return {
            xs: { columns: 4, gap: 16 }, // Mobile: 4 columns
            sm: { columns: 6, gap: 16 }, // Mobile landscape: 6 columns
            md: { columns: 8, gap: 20 }, // Tablet: 8 columns
            lg: { columns: 12, gap: 24 }, // Desktop: 12 columns
            xl: { columns: 12, gap: 24 }, // Large desktop: 12 columns
            '2xl': { columns: 12, gap: 32 }, // Extra large: 12 columns with larger gaps
        };
    }
    /**
     * Generate aspect ratios
     * Common aspect ratios for media and layouts
     *
     * @returns Aspect ratio map
     */
    generateAspectRatios() {
        return {
            'square': '1 / 1',
            'video': '16 / 9',
            'wide': '21 / 9',
            'portrait': '3 / 4',
            'photo': '4 / 3',
            'golden': '1.618 / 1', // Golden ratio
        };
    }
    /**
     * Calculate safe area insets for mobile devices
     * Accounts for notches, home indicators, etc.
     *
     * @returns Safe area insets
     */
    generateSafeAreaInsets() {
        return {
            'top': 'env(safe-area-inset-top)',
            'right': 'env(safe-area-inset-right)',
            'bottom': 'env(safe-area-inset-bottom)',
            'left': 'env(safe-area-inset-left)',
        };
    }
}
/**
 * Factory function for SpatialEngineer
 * Allows for dependency injection in tests
 *
 * @returns SpatialEngineer instance
 */
export function createSpatialEngineer() {
    return new SpatialEngineer();
}
//# sourceMappingURL=SpatialEngineer.js.map