/**
 * ColorScientist Specialist
 * Applies perceptually uniform color theory without aesthetic bias
 *
 * @module ColorScientist
 * @version 1.0.0
 * @architecture Scientific processing - no style preferences
 */
import type { Specialist, DesignDNA, ColorFacts, CompileOptions } from '../contracts.js';
import { type OKLCHColor } from '../utils/oklch.js';
/**
 * ColorScientist - Perceptual color theory specialist
 *
 * Responsibilities:
 * - Extract primary colors from design DNA
 * - Convert to OKLCH (perceptually uniform color space)
 * - Generate color ramps (50-900 shades)
 * - Perform WCAG contrast audits
 * - Create accessible color pairs
 *
 * Style-Agnostic: Works with ANY aesthetic (brutalist, cyberpunk, zen, etc.)
 */
export declare class ColorScientist implements Specialist<DesignDNA, ColorFacts> {
    readonly id = "color-scientist";
    readonly timeoutMs = 80;
    /**
     * Process design DNA and generate color facts
     *
     * @param dna Design DNA (normalized input)
     * @param opts Compilation options
     * @returns Color facts (OKLCH format)
     */
    run(dna: DesignDNA, opts: CompileOptions): Promise<ColorFacts>;
    /**
     * Extract primary color from design DNA
     * Priority: explicit primary > first color > default blue
     *
     * @param colors Array of hex colors
     * @returns Primary hex color
     */
    private extractPrimary;
    /**
     * Detect color harmony type from hue
     * This is for informational purposes only - not used for generation
     *
     * @param color OKLCH color
     * @returns Harmony type
     */
    private detectHarmony;
    /**
     * Validate color input
     *
     * @param color Hex color string
     * @returns Whether valid
     */
    private isValidHex;
    /**
     * Extract colors from CSS code (for existing-css input type)
     *
     * @param css CSS code
     * @returns Array of hex colors
     */
    extractFromCSS(css: string): string[];
    /**
     * Convert RGB to hex
     *
     * @param r Red (0-255)
     * @param g Green (0-255)
     * @param b Blue (0-255)
     * @returns Hex color
     */
    private rgbToHex;
    /**
     * Generate semantic color names from ramp
     * Maps numeric shades to semantic meanings
     *
     * @param ramp Color ramp (50-900)
     * @returns Semantic color map
     */
    generateSemanticNames(ramp: Record<string, string>): Record<string, string>;
    /**
     * Simulate color blindness for accessibility testing
     *
     * @param color OKLCH color
     * @param type Color blindness type
     * @returns Simulated OKLCH color
     */
    simulateColorBlindness(color: OKLCHColor, type: 'protanopia' | 'deuteranopia' | 'tritanopia'): OKLCHColor;
    /**
     * Generate color scheme variations
     *
     * @param primary Primary color
     * @returns Color scheme with secondary and accent
     */
    generateColorScheme(primary: string): {
        primary: string;
        secondary: string;
        accent: string;
    };
}
/**
 * Factory function for ColorScientist
 * Allows for dependency injection in tests
 *
 * @returns ColorScientist instance
 */
export declare function createColorScientist(): ColorScientist;
//# sourceMappingURL=ColorScientist.d.ts.map