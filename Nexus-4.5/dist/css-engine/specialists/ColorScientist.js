/**
 * ColorScientist Specialist
 * Applies perceptually uniform color theory without aesthetic bias
 *
 * @module ColorScientist
 * @version 1.0.0
 * @architecture Scientific processing - no style preferences
 */
import { hexToOKLCH, generateRamp, oklchToCSS } from '../utils/oklch.js';
import { auditRamp, generateAccessiblePairs } from '../utils/contrast.js';
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
export class ColorScientist {
    id = 'color-scientist';
    timeoutMs = 80;
    /**
     * Process design DNA and generate color facts
     *
     * @param dna Design DNA (normalized input)
     * @param opts Compilation options
     * @returns Color facts (OKLCH format)
     */
    async run(dna, opts) {
        const t0 = performance.now();
        try {
            // 1. Extract primary color
            const primary = this.extractPrimary(dna.colors);
            // 2. Convert to OKLCH (perceptually uniform)
            const oklchPrimary = hexToOKLCH(primary);
            // 3. Generate color ramp (50-900)
            const ramp = generateRamp(oklchPrimary, 10);
            // 4. Perform WCAG contrast audits
            const wcagLevel = opts.accessibilityTarget ?? 'AA';
            const audits = auditRamp(ramp, wcagLevel);
            // 5. Generate accessible pairs (if needed)
            const pairs = generateAccessiblePairs(primary, wcagLevel);
            // 6. Add accessible pairs to ramp if they pass
            if (audits.every(a => a.pass)) {
                // All audits pass - ramp is good as-is
            }
            else {
                // Some audits failed - add guaranteed accessible pairs
                ramp['on-light'] = pairs.onLight;
                ramp['on-dark'] = pairs.onDark;
                ramp['light-bg'] = pairs.lightBg;
                ramp['dark-bg'] = pairs.darkBg;
            }
            const elapsed = performance.now() - t0;
            return {
                primary: oklchToCSS(oklchPrimary),
                ramp,
                audits,
                colorSpace: 'oklch',
                harmony: this.detectHarmony(oklchPrimary),
            };
        }
        catch (error) {
            throw new Error(`ColorScientist failed: ${error.message}`);
        }
    }
    /**
     * Extract primary color from design DNA
     * Priority: explicit primary > first color > default blue
     *
     * @param colors Array of hex colors
     * @returns Primary hex color
     */
    extractPrimary(colors) {
        if (!colors || colors.length === 0) {
            // Default to a neutral blue (not too opinionated)
            return '#0ea5e9'; // sky-500 from Tailwind
        }
        // Use first color as primary
        return colors[0];
    }
    /**
     * Detect color harmony type from hue
     * This is for informational purposes only - not used for generation
     *
     * @param color OKLCH color
     * @returns Harmony type
     */
    detectHarmony(color) {
        // Simple heuristic based on hue
        // This is just metadata - doesn't affect generation
        const hue = color.h;
        if (hue >= 0 && hue < 60)
            return 'triadic';
        if (hue >= 60 && hue < 180)
            return 'analogous';
        return 'complementary';
    }
    /**
     * Validate color input
     *
     * @param color Hex color string
     * @returns Whether valid
     */
    isValidHex(color) {
        return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(color);
    }
    /**
     * Extract colors from CSS code (for existing-css input type)
     *
     * @param css CSS code
     * @returns Array of hex colors
     */
    extractFromCSS(css) {
        const colors = [];
        // Match hex colors
        const hexRegex = /#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})/g;
        let hexMatch;
        while ((hexMatch = hexRegex.exec(css)) !== null) {
            const hex = hexMatch[0];
            if (this.isValidHex(hex) && !colors.includes(hex)) {
                colors.push(hex);
            }
        }
        // Match rgb/rgba colors
        const rgbRegex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/g;
        let rgbMatch;
        while ((rgbMatch = rgbRegex.exec(css)) !== null) {
            const r = parseInt(rgbMatch[1]);
            const g = parseInt(rgbMatch[2]);
            const b = parseInt(rgbMatch[3]);
            const hex = this.rgbToHex(r, g, b);
            if (!colors.includes(hex)) {
                colors.push(hex);
            }
        }
        return colors;
    }
    /**
     * Convert RGB to hex
     *
     * @param r Red (0-255)
     * @param g Green (0-255)
     * @param b Blue (0-255)
     * @returns Hex color
     */
    rgbToHex(r, g, b) {
        const rHex = r.toString(16).padStart(2, '0');
        const gHex = g.toString(16).padStart(2, '0');
        const bHex = b.toString(16).padStart(2, '0');
        return `#${rHex}${gHex}${bHex}`;
    }
    /**
     * Generate semantic color names from ramp
     * Maps numeric shades to semantic meanings
     *
     * @param ramp Color ramp (50-900)
     * @returns Semantic color map
     */
    generateSemanticNames(ramp) {
        return {
            // Backgrounds
            'bg-primary': ramp['50'],
            'bg-primary-hover': ramp['100'],
            'bg-surface': ramp['100'],
            // Text
            'text-primary': ramp['900'],
            'text-secondary': ramp['700'],
            'text-tertiary': ramp['500'],
            // Borders
            'border-default': ramp['300'],
            'border-hover': ramp['400'],
            // Interactive
            'interactive-default': ramp['500'],
            'interactive-hover': ramp['600'],
            'interactive-active': ramp['700'],
            // Status (if applicable)
            'status-default': ramp['500'],
        };
    }
    /**
     * Simulate color blindness for accessibility testing
     *
     * @param color OKLCH color
     * @param type Color blindness type
     * @returns Simulated OKLCH color
     */
    simulateColorBlindness(color, type) {
        // Simplified simulation - adjusts hue based on type
        const adjusted = { ...color };
        switch (type) {
            case 'protanopia': // Red-blind
                if (color.h >= 0 && color.h < 60) {
                    adjusted.h = 60; // Shift reds to yellow
                }
                break;
            case 'deuteranopia': // Green-blind
                if (color.h >= 60 && color.h < 180) {
                    adjusted.h = 180; // Shift greens to cyan
                }
                break;
            case 'tritanopia': // Blue-blind
                if (color.h >= 180 && color.h < 300) {
                    adjusted.h = 300; // Shift blues to purple
                }
                break;
        }
        return adjusted;
    }
    /**
     * Generate color scheme variations
     *
     * @param primary Primary color
     * @returns Color scheme with secondary and accent
     */
    generateColorScheme(primary) {
        const oklchPrimary = hexToOKLCH(primary);
        // Secondary: Analogous (30° hue shift)
        const oklchSecondary = {
            ...oklchPrimary,
            h: (oklchPrimary.h + 30) % 360,
        };
        // Accent: Complementary (180° hue shift)
        const oklchAccent = {
            ...oklchPrimary,
            h: (oklchPrimary.h + 180) % 360,
            c: oklchPrimary.c * 1.2, // Boost chroma for accent
        };
        return {
            primary: oklchToCSS(oklchPrimary),
            secondary: oklchToCSS(oklchSecondary),
            accent: oklchToCSS(oklchAccent),
        };
    }
}
/**
 * Factory function for ColorScientist
 * Allows for dependency injection in tests
 *
 * @returns ColorScientist instance
 */
export function createColorScientist() {
    return new ColorScientist();
}
//# sourceMappingURL=ColorScientist.js.map