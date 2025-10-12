/**
 * SpatialEngineer Specialist
 * Applies mathematical spacing and grid systems without aesthetic bias
 *
 * @module SpatialEngineer
 * @version 1.0.0
 * @architecture Scientific processing - geometric progressions, optimal grids
 */
import type { Specialist, DesignDNA, SpatialFacts, CompileOptions } from '../contracts.js';
/**
 * Spacing scale types
 * Different mathematical progressions for spacing systems
 */
export declare const SPACING_TYPES: {
    readonly fibonacci: "fibonacci";
    readonly geometric: "geometric";
    readonly modular: "modular";
    readonly linear: "linear";
};
export type SpacingType = keyof typeof SPACING_TYPES;
/**
 * Spacing scale names
 * Semantic naming from smallest to largest
 */
export declare const SPACING_NAMES: readonly ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24"];
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
export declare class SpatialEngineer implements Specialist<DesignDNA, SpatialFacts> {
    readonly id = "spatial-engineer";
    readonly timeoutMs = 80;
    private gridMathematician;
    constructor();
    private getPreferredColumns;
    private getLayoutRatio;
    private estimateContainerWidths;
    private selectRepresentativeMatrix;
    /**
     * Process design DNA and generate spatial facts
     *
     * @param dna Design DNA (normalized input)
     * @param opts Compilation options
     * @returns Spatial facts (spacing, grid, breakpoints)
     */
    run(dna: DesignDNA, opts: CompileOptions): Promise<SpatialFacts>;
    /**
     * Generate spacing scale using different mathematical progressions
     *
     * @param base Base spacing unit in pixels
     * @param type Spacing scale type
     * @returns Map of spacing names to rem values
     */
    generateSpacingScale(base: number, type?: SpacingType): Record<string, number>;
    /**
     * Generate Fibonacci-based spacing scale
     * Uses Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34...
     *
     * @param base Base spacing unit
     * @returns Spacing map
     */
    private generateFibonacciSpacing;
    /**
     * Generate geometric spacing scale
     * Simple multiples of base unit: 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6
     *
     * @param base Base spacing unit
     * @returns Spacing map
     */
    private generateGeometricSpacing;
    /**
     * Generate modular spacing scale
     * Uses a ratio similar to typography scales
     *
     * @param base Base spacing unit
     * @returns Spacing map
     */
    private generateModularSpacing;
    /**
     * Generate linear spacing scale
     * Simple increments based on base unit
     *
     * @param base Base spacing unit
     * @returns Spacing map
     */
    private generateLinearSpacing;
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
    calculateOptimalGrid(constraints?: any): {
        minColPx: number;
        maxColPx: number;
        columns: number;
        gap: number;
        responsive: boolean;
    };
    /**
     * Get default responsive breakpoints
     * Based on common device widths and content optimization
     *
     * @returns Breakpoint map
     */
    getDefaultBreakpoints(): Record<string, number>;
    /**
     * Generate z-index scale for layering
     * Provides semantic naming for stacking contexts
     *
     * @returns Z-index map
     */
    generateZIndexScale(): Record<string, number>;
    /**
     * Generate container sizes
     * Max-width values for centered containers
     *
     * @returns Container size map
     */
    generateContainerSizes(): Record<string, string>;
    /**
     * Calculate optimal content width (measure)
     * Based on typography size and readability
     *
     * @param fontSize Font size in pixels
     * @param characters Optimal characters per line (default: 65)
     * @returns Content width in pixels
     */
    calculateOptimalContentWidth(fontSize: number, characters?: number): number;
    /**
     * Generate responsive grid configuration
     * Maps breakpoints to column counts
     *
     * @param breakpoints Breakpoint map
     * @returns Responsive grid config
     */
    generateResponsiveGrid(breakpoints: Record<string, number>): Record<string, {
        columns: number;
        gap: number;
    }>;
    /**
     * Generate aspect ratios
     * Common aspect ratios for media and layouts
     *
     * @returns Aspect ratio map
     */
    generateAspectRatios(): Record<string, string>;
    /**
     * Calculate safe area insets for mobile devices
     * Accounts for notches, home indicators, etc.
     *
     * @returns Safe area insets
     */
    generateSafeAreaInsets(): Record<string, string>;
}
/**
 * Factory function for SpatialEngineer
 * Allows for dependency injection in tests
 *
 * @returns SpatialEngineer instance
 */
export declare function createSpatialEngineer(): SpatialEngineer;
//# sourceMappingURL=SpatialEngineer.d.ts.map