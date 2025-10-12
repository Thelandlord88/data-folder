/**
 * WCAG Contrast Calculations
 * Accessibility compliance for color combinations
 * 
 * @module contrast
 * @version 1.0.0
 * @see https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
 */

import { hexToOKLCH, oklchToHex, type OKLCHColor } from './oklch.js';

/**
 * WCAG compliance level
 */
export type WCAGLevel = 'AA' | 'AAA';

/**
 * Contrast audit result
 */
export interface ContrastAudit {
  pair: [string, string];  // [foreground, background]
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
export function relativeLuminance(r: number, g: number, b: number): number {
  // Convert to 0-1 range
  const [rs, gs, bs] = [r / 255, g / 255, b / 255];
  
  // Apply gamma correction
  const [rg, gg, bg] = [rs, gs, bs].map(c => {
    if (c <= 0.03928) {
      return c / 12.92;
    }
    return Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  // Calculate luminance
  return 0.2126 * rg + 0.7152 * gg + 0.0722 * bg;
}

/**
 * Calculate contrast ratio between two colors
 * 
 * @param color1 First color (hex or OKLCH)
 * @param color2 Second color (hex or OKLCH)
 * @returns Contrast ratio (1-21)
 */
export function contrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG requirements
 * 
 * @param ratio Contrast ratio
 * @param level WCAG level (AA or AAA)
 * @param usage Usage context
 * @returns Whether it passes
 */
export function passesWCAG(
  ratio: number,
  level: WCAGLevel = 'AA',
  usage: 'normal-text' | 'large-text' | 'ui-component' = 'normal-text'
): boolean {
  if (level === 'AAA') {
    if (usage === 'large-text') return ratio >= 4.5;
    return ratio >= 7;
  }
  
  // AA level
  if (usage === 'large-text') return ratio >= 3;
  if (usage === 'ui-component') return ratio >= 3;
  return ratio >= 4.5;
}

/**
 * Audit color ramp for contrast compliance
 * 
 * @param ramp Color ramp (50-900)
 * @param level WCAG level
 * @returns Array of contrast audits
 */
export function auditRamp(
  ramp: Record<string, string>,
  level: WCAGLevel = 'AA'
): ContrastAudit[] {
  const audits: ContrastAudit[] = [];
  
  // Common pairings to check
  const pairs: Array<[string, string, ContrastAudit['usage']]> = [
    ['900', '50', 'normal-text'],    // Dark text on light bg
    ['800', '100', 'normal-text'],
    ['700', '200', 'large-text'],
    ['600', '300', 'ui-component'],
    ['500', '400', 'ui-component'],
    ['50', '900', 'normal-text'],    // Light text on dark bg
    ['100', '800', 'normal-text'],
    ['200', '700', 'large-text'],
  ];
  
  for (const [fg, bg, usage] of pairs) {
    if (ramp[fg] && ramp[bg]) {
      const ratio = contrastRatio(ramp[fg], ramp[bg]);
      const pass = passesWCAG(ratio, level, usage);
      
      audits.push({
        pair: [ramp[fg], ramp[bg]],
        ratio: Math.round(ratio * 100) / 100,
        pass,
        level,
        usage,
      });
    }
  }
  
  return audits;
}

/**
 * Find optimal text color (light or dark) for background
 * 
 * @param backgroundColor Background color (hex or OKLCH)
 * @param level WCAG level
 * @returns Optimal text color (hex)
 */
export function optimalTextColor(
  backgroundColor: string,
  level: WCAGLevel = 'AA'
): string {
  const ratio = contrastRatio('#000000', backgroundColor);
  const minRatio = level === 'AAA' ? 7 : 4.5;
  
  // If black text meets requirements, use it
  if (ratio >= minRatio) {
    return '#000000';
  }
  
  // Otherwise use white
  return '#ffffff';
}

/**
 * Adjust color lightness to meet contrast requirements
 * 
 * @param foreground Foreground color (hex or OKLCH)
 * @param background Background color (hex or OKLCH)
 * @param level WCAG level
 * @returns Adjusted foreground color (hex)
 */
export function adjustForContrast(
  foreground: string,
  background: string,
  level: WCAGLevel = 'AA'
): string {
  const minRatio = level === 'AAA' ? 7 : 4.5;
  const currentRatio = contrastRatio(foreground, background);
  
  // Already passes
  if (currentRatio >= minRatio) {
    return foreground;
  }
  
  // Convert to OKLCH for manipulation
  const fgOKLCH = hexToOKLCH(foreground);
  const bgOKLCH = hexToOKLCH(background);
  
  // Determine if we need to lighten or darken
  const shouldLighten = fgOKLCH.l < bgOKLCH.l;
  
  // Binary search for optimal lightness
  let low = shouldLighten ? fgOKLCH.l : 0;
  let high = shouldLighten ? 1 : fgOKLCH.l;
  let adjusted = { ...fgOKLCH };
  
  for (let i = 0; i < 20; i++) {
    adjusted.l = (low + high) / 2;
    const testHex = oklchToHex(adjusted);
    const testRatio = contrastRatio(testHex, background);
    
    if (testRatio >= minRatio) {
      if (shouldLighten) {
        high = adjusted.l;
      } else {
        low = adjusted.l;
      }
    } else {
      if (shouldLighten) {
        low = adjusted.l;
      } else {
        high = adjusted.l;
      }
    }
  }
  
  return oklchToHex(adjusted);
}

/**
 * Generate accessible color pairs
 * 
 * @param baseColor Base color (hex or OKLCH)
 * @param level WCAG level
 * @returns Map of accessible pairs (text, background, accent)
 */
export function generateAccessiblePairs(
  baseColor: string,
  level: WCAGLevel = 'AA'
): {
  onLight: string;
  onDark: string;
  lightBg: string;
  darkBg: string;
} {
  const baseOKLCH = hexToOKLCH(baseColor);
  
  // Generate light background (95% lightness)
  const lightBg = oklchToHex({ ...baseOKLCH, l: 0.95, c: baseOKLCH.c * 0.2 });
  
  // Generate dark background (15% lightness)
  const darkBg = oklchToHex({ ...baseOKLCH, l: 0.15, c: baseOKLCH.c * 0.8 });
  
  // Generate text colors with proper contrast
  const onLight = adjustForContrast(baseColor, lightBg, level);
  const onDark = adjustForContrast(baseColor, darkBg, level);
  
  return { onLight, onDark, lightBg, darkBg };
}

// ============================================================================
// Internal helpers
// ============================================================================

function getLuminance(color: string): number {
  let hex = color;
  
  // Convert OKLCH to hex if needed
  if (color.startsWith('oklch')) {
    const oklch = parseOKLCHCSS(color);
    hex = oklchToHex(oklch);
  }
  
  // Remove # and parse RGB
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  return relativeLuminance(r, g, b);
}

function parseOKLCHCSS(css: string): OKLCHColor {
  const match = css.match(/oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/);
  
  if (!match) {
    throw new Error(`Invalid OKLCH string: ${css}`);
  }
  
  return {
    l: parseFloat(match[1]) / 100,
    c: parseFloat(match[2]),
    h: parseFloat(match[3]),
    alpha: match[4] ? parseFloat(match[4]) : undefined,
  };
}
