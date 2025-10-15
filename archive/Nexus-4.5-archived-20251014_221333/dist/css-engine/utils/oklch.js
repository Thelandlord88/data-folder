/**
 * OKLCH Color Space Utilities
 * Perceptually uniform color transformations
 *
 * @module oklch
 * @version 1.0.0
 * @see https://oklch.com/
 */
/**
 * Convert hex color to OKLCH
 *
 * @param hex Hex color (#RGB, #RRGGBB, #RRGGBBAA)
 * @returns OKLCH color
 */
export function hexToOKLCH(hex) {
    const rgb = hexToRGB(hex);
    return rgbToOKLCH(rgb);
}
/**
 * Convert OKLCH to hex color
 *
 * @param oklch OKLCH color
 * @returns Hex string (#RRGGBB or #RRGGBBAA)
 */
export function oklchToHex(oklch) {
    const rgb = oklchToRGB(oklch);
    return rgbToHex(rgb);
}
/**
 * Convert OKLCH to CSS string
 *
 * @param oklch OKLCH color
 * @returns CSS oklch() string
 */
export function oklchToCSS(oklch) {
    const l = (oklch.l * 100).toFixed(2);
    const c = oklch.c.toFixed(3);
    const h = oklch.h.toFixed(1);
    if (oklch.alpha !== undefined && oklch.alpha < 1) {
        return `oklch(${l}% ${c} ${h} / ${oklch.alpha.toFixed(2)})`;
    }
    return `oklch(${l}% ${c} ${h})`;
}
/**
 * Parse OKLCH CSS string
 *
 * @param css CSS oklch() string
 * @returns OKLCH color
 */
export function parseOKLCH(css) {
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
/**
 * Generate color ramp from base OKLCH color
 * Creates perceptually uniform shades (50-900)
 *
 * @param base Base OKLCH color
 * @param steps Number of steps (default: 10)
 * @returns Map of shade values (50, 100, 200, ..., 900)
 */
export function generateRamp(base, steps = 10) {
    const ramp = {};
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    // Base color is typically 500
    const baseIndex = 5;
    for (let i = 0; i < steps; i++) {
        const shade = shades[i];
        const delta = i - baseIndex;
        // Adjust lightness and chroma
        const l = clamp(base.l + (delta * 0.08), 0, 1);
        const c = clamp(base.c * (1 - Math.abs(delta) * 0.08), 0, 0.4);
        const h = base.h; // Keep hue constant
        ramp[shade.toString()] = oklchToCSS({ l, c, h });
    }
    return ramp;
}
/**
 * Adjust lightness of OKLCH color
 *
 * @param color OKLCH color
 * @param amount Delta (-1 to +1)
 * @returns Adjusted OKLCH color
 */
export function adjustLightness(color, amount) {
    return {
        ...color,
        l: clamp(color.l + amount, 0, 1),
    };
}
/**
 * Adjust chroma of OKLCH color
 *
 * @param color OKLCH color
 * @param amount Delta (-0.4 to +0.4)
 * @returns Adjusted OKLCH color
 */
export function adjustChroma(color, amount) {
    return {
        ...color,
        c: clamp(color.c + amount, 0, 0.4),
    };
}
/**
 * Rotate hue of OKLCH color
 *
 * @param color OKLCH color
 * @param degrees Rotation in degrees
 * @returns Adjusted OKLCH color
 */
export function rotateHue(color, degrees) {
    return {
        ...color,
        h: (color.h + degrees + 360) % 360,
    };
}
// ============================================================================
// Internal conversion functions
// ============================================================================
function hexToRGB(hex) {
    // Remove # prefix
    hex = hex.replace(/^#/, '');
    // Handle short form (#RGB)
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    // Parse RGB(A)
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const alpha = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : undefined;
    return { r, g, b, alpha };
}
function rgbToHex(rgb) {
    const r = Math.round(rgb.r).toString(16).padStart(2, '0');
    const g = Math.round(rgb.g).toString(16).padStart(2, '0');
    const b = Math.round(rgb.b).toString(16).padStart(2, '0');
    if (rgb.alpha !== undefined && rgb.alpha < 1) {
        const a = Math.round(rgb.alpha * 255).toString(16).padStart(2, '0');
        return `#${r}${g}${b}${a}`;
    }
    return `#${r}${g}${b}`;
}
function rgbToOKLCH(rgb) {
    // Convert RGB to linear RGB
    const r = sRGBToLinear(rgb.r / 255);
    const g = sRGBToLinear(rgb.g / 255);
    const b = sRGBToLinear(rgb.b / 255);
    // Convert to OKLAB
    const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);
    const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
    const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
    // Convert to OKLCH
    const C = Math.sqrt(a * a + b_ * b_);
    let H = Math.atan2(b_, a) * 180 / Math.PI;
    if (H < 0)
        H += 360;
    return {
        l: L,
        c: C,
        h: H,
        alpha: rgb.alpha,
    };
}
function oklchToRGB(oklch) {
    // Convert to OKLAB
    const a = oklch.c * Math.cos(oklch.h * Math.PI / 180);
    const b = oklch.c * Math.sin(oklch.h * Math.PI / 180);
    const l_ = oklch.l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = oklch.l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = oklch.l - 0.0894841775 * a - 1.2914855480 * b;
    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;
    // Convert to linear RGB
    const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const b_ = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
    // Convert to sRGB
    return {
        r: linearToSRGB(r) * 255,
        g: linearToSRGB(g) * 255,
        b: linearToSRGB(b_) * 255,
        alpha: oklch.alpha,
    };
}
function sRGBToLinear(value) {
    if (value <= 0.04045) {
        return value / 12.92;
    }
    return Math.pow((value + 0.055) / 1.055, 2.4);
}
function linearToSRGB(value) {
    if (value <= 0.0031308) {
        return value * 12.92;
    }
    return 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
}
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
//# sourceMappingURL=oklch.js.map