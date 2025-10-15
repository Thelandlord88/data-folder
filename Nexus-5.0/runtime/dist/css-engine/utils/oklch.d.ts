/**
 * OKLCH Color Space Utilities
 * Perceptually uniform color transformations
 *
 * @module oklch
 * @version 1.0.0
 * @see https://oklch.com/
 */
/**
 * OKLCH color representation
 */
export interface OKLCHColor {
    l: number;
    c: number;
    h: number;
    alpha?: number;
}
/**
 * RGB color representation
 */
export interface RGBColor {
    r: number;
    g: number;
    b: number;
    alpha?: number;
}
/**
 * Convert hex color to OKLCH
 *
 * @param hex Hex color (#RGB, #RRGGBB, #RRGGBBAA)
 * @returns OKLCH color
 */
export declare function hexToOKLCH(hex: string): OKLCHColor;
/**
 * Convert OKLCH to hex color
 *
 * @param oklch OKLCH color
 * @returns Hex string (#RRGGBB or #RRGGBBAA)
 */
export declare function oklchToHex(oklch: OKLCHColor): string;
/**
 * Convert OKLCH to CSS string
 *
 * @param oklch OKLCH color
 * @returns CSS oklch() string
 */
export declare function oklchToCSS(oklch: OKLCHColor): string;
/**
 * Parse OKLCH CSS string
 *
 * @param css CSS oklch() string
 * @returns OKLCH color
 */
export declare function parseOKLCH(css: string): OKLCHColor;
/**
 * Generate color ramp from base OKLCH color
 * Creates perceptually uniform shades (50-900)
 *
 * @param base Base OKLCH color
 * @param steps Number of steps (default: 10)
 * @returns Map of shade values (50, 100, 200, ..., 900)
 */
export declare function generateRamp(base: OKLCHColor, steps?: number): Record<string, string>;
/**
 * Adjust lightness of OKLCH color
 *
 * @param color OKLCH color
 * @param amount Delta (-1 to +1)
 * @returns Adjusted OKLCH color
 */
export declare function adjustLightness(color: OKLCHColor, amount: number): OKLCHColor;
/**
 * Adjust chroma of OKLCH color
 *
 * @param color OKLCH color
 * @param amount Delta (-0.4 to +0.4)
 * @returns Adjusted OKLCH color
 */
export declare function adjustChroma(color: OKLCHColor, amount: number): OKLCHColor;
/**
 * Rotate hue of OKLCH color
 *
 * @param color OKLCH color
 * @param degrees Rotation in degrees
 * @returns Adjusted OKLCH color
 */
export declare function rotateHue(color: OKLCHColor, degrees: number): OKLCHColor;
//# sourceMappingURL=oklch.d.ts.map