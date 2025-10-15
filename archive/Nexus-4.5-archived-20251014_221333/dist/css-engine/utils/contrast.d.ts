/**
 * WCAG Contrast Calculations
 * Accessibility compliance for color combinations
 *
 * @module contrast
 * @version 1.0.0
 * @see https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
 */
/**
 * WCAG compliance level
 */
export type WCAGLevel = 'AA' | 'AAA';
/**
 * Contrast audit result
 */
export interface ContrastAudit {
    pair: [string, string];
    ratio: number;
    pass: boolean;
    level: WCAGLevel;
    usage: 'normal-text' | 'large-text' | 'ui-component';
}
/**
 * Calculate relative luminance from RGB
 *
 * @param r Red (0-255)
 * @param g Green (0-255)
 * @param b Blue (0-255)
 * @returns Relative luminance (0-1)
 */
export declare function relativeLuminance(r: number, g: number, b: number): number;
/**
 * Calculate contrast ratio between two colors
 *
 * @param color1 First color (hex or OKLCH)
 * @param color2 Second color (hex or OKLCH)
 * @returns Contrast ratio (1-21)
 */
export declare function contrastRatio(color1: string, color2: string): number;
/**
 * Check if contrast ratio meets WCAG requirements
 *
 * @param ratio Contrast ratio
 * @param level WCAG level (AA or AAA)
 * @param usage Usage context
 * @returns Whether it passes
 */
export declare function passesWCAG(ratio: number, level?: WCAGLevel, usage?: 'normal-text' | 'large-text' | 'ui-component'): boolean;
/**
 * Audit color ramp for contrast compliance
 *
 * @param ramp Color ramp (50-900)
 * @param level WCAG level
 * @returns Array of contrast audits
 */
export declare function auditRamp(ramp: Record<string, string>, level?: WCAGLevel): ContrastAudit[];
/**
 * Find optimal text color (light or dark) for background
 *
 * @param backgroundColor Background color (hex or OKLCH)
 * @param level WCAG level
 * @returns Optimal text color (hex)
 */
export declare function optimalTextColor(backgroundColor: string, level?: WCAGLevel): string;
/**
 * Adjust color lightness to meet contrast requirements
 *
 * @param foreground Foreground color (hex or OKLCH)
 * @param background Background color (hex or OKLCH)
 * @param level WCAG level
 * @returns Adjusted foreground color (hex)
 */
export declare function adjustForContrast(foreground: string, background: string, level?: WCAGLevel): string;
/**
 * Generate accessible color pairs
 *
 * @param baseColor Base color (hex or OKLCH)
 * @param level WCAG level
 * @returns Map of accessible pairs (text, background, accent)
 */
export declare function generateAccessiblePairs(baseColor: string, level?: WCAGLevel): {
    onLight: string;
    onDark: string;
    lightBg: string;
    darkBg: string;
};
//# sourceMappingURL=contrast.d.ts.map