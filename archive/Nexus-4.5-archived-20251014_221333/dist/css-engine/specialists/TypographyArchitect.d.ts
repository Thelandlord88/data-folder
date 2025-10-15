/**
 * TypographyArchitect Specialist
 * Applies mathematical typography systems without aesthetic bias
 *
 * @module TypographyArchitect
 * @version 1.0.0
 * @architecture Scientific processing - modular scales, fluid sizing
 */
import type { Specialist, DesignDNA, TypeFacts, CompileOptions } from '../contracts.js';
/**
 * Typography scale ratios
 * Based on musical intervals and mathematical harmony
 */
export declare const SCALE_RATIOS: {
    readonly minorSecond: 1.067;
    readonly majorSecond: 1.125;
    readonly minorThird: 1.2;
    readonly majorThird: 1.25;
    readonly perfectFourth: 1.333;
    readonly augmentedFourth: 1.414;
    readonly perfectFifth: 1.5;
    readonly golden: 1.618;
};
export type ScaleRatio = keyof typeof SCALE_RATIOS;
/**
 * Typography scale names
 * Semantic naming from smallest to largest
 */
export declare const SCALE_NAMES: readonly ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl"];
export type ScaleName = typeof SCALE_NAMES[number];
/**
 * TypographyArchitect - Mathematical typography system specialist
 *
 * Responsibilities:
 * - Generate modular scales based on musical intervals
 * - Create fluid typography (viewport-responsive sizing)
 * - Calculate optimal line heights
 * - Apply optical sizing adjustments
 * - Generate letter spacing (tracking)
 *
 * Style-Agnostic: Works with ANY aesthetic (brutalist, elegant, modern, etc.)
 */
export declare class TypographyArchitect implements Specialist<DesignDNA, TypeFacts> {
    readonly id = "typography-architect";
    readonly timeoutMs = 80;
    /**
     * Process design DNA and generate typography facts
     *
     * @param dna Design DNA (normalized input)
     * @param opts Compilation options
     * @returns Typography facts (scales, fluid sizing)
     */
    run(dna: DesignDNA, opts: CompileOptions): Promise<TypeFacts>;
    /**
     * Get ratio value from name
     *
     * @param name Scale ratio name
     * @returns Numeric ratio
     */
    private getRatio;
    /**
     * Generate modular scale from base size and ratio
     *
     * Mathematical approach:
     * - base size is at index 2 ('base')
     * - Smaller sizes: base / ratio^n
     * - Larger sizes: base * ratio^n
     *
     * @param base Base font size in pixels
     * @param ratio Scale ratio
     * @returns Map of scale names to pixel values
     */
    generateModularScale(base: number, ratio: number): Record<string, number>;
    /**
     * Generate fluid typography using clamp()
     * Scales smoothly between min and max viewport widths
     *
     * Formula: clamp(minPx, preferredVw, maxPx)
     * - minPx: Size at min viewport
     * - preferredVw: Viewport-relative size
     * - maxPx: Size at max viewport
     *
     * @param steps Static scale (pixel values)
     * @param minVw Minimum viewport width (default: 320px)
     * @param maxVw Maximum viewport width (default: 1920px)
     * @returns Map of scale names to clamp() expressions
     */
    generateFluidScale(steps: Record<string, number>, minVw?: number, maxVw?: number): Record<string, string>;
    /**
     * Calculate optimal line height (leading)
     *
     * Principles:
     * - Smaller text needs more line height (readability)
     * - Larger text needs less line height (visual balance)
     * - Base text: 1.5 (optimal for body text)
     *
     * @param base Base font size
     * @returns Line height multiplier
     */
    calculateLineHeight(base: number): number;
    /**
     * Generate letter spacing (tracking) for each scale
     *
     * Principles:
     * - Larger text: slightly tighter tracking (negative)
     * - Smaller text: slightly looser tracking (positive)
     * - Body text: neutral (0)
     *
     * @param steps Typography scale
     * @returns Map of scale names to em values
     */
    generateTracking(steps: Record<string, number>): Record<string, number>;
    /**
     * Calculate optimal line height for specific size
     * Accounts for optical sizing
     *
     * @param size Font size in pixels
     * @returns Line height multiplier
     */
    calculateLineHeightForSize(size: number): number;
    /**
     * Generate line height scale for all sizes
     *
     * @param steps Typography scale
     * @returns Map of scale names to line height values
     */
    generateLineHeightScale(steps: Record<string, number>): Record<string, number>;
    /**
     * Generate font weight recommendations
     * Based on size and optical sizing principles
     *
     * @param steps Typography scale
     * @returns Map of scale names to recommended weights
     */
    generateWeightScale(steps: Record<string, number>): Record<string, number>;
    /**
     * Calculate measure (optimal line length) in characters
     * Based on font size
     *
     * @param size Font size in pixels
     * @returns Optimal characters per line
     */
    calculateOptimalMeasure(size: number): number;
    /**
     * Generate responsive font sizes
     * Maps scale names to sizes at different breakpoints
     *
     * @param steps Base typography scale
     * @param breakpoints Viewport breakpoints
     * @returns Nested map: breakpoint → scale → size
     */
    generateResponsiveScale(steps: Record<string, number>, breakpoints: Record<string, number>): Record<string, Record<string, number>>;
}
/**
 * Factory function for TypographyArchitect
 * Allows for dependency injection in tests
 *
 * @returns TypographyArchitect instance
 */
export declare function createTypographyArchitect(): TypographyArchitect;
//# sourceMappingURL=TypographyArchitect.d.ts.map