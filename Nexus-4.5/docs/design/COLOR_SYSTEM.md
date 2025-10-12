# Color System Documentation

Comprehensive guide to NEXUS dual-mode color palette generation (light + dark modes) with WCAG accessibility compliance.

---

## Overview

The NEXUS Color System generates semantically rich, accessible color palettes for both light and dark modes using:

- **OKLCH color space** - Perceptually uniform colors
- **Dual-mode generation** - Paired light/dark tokens
- **WCAG 2.1 compliance** - Guaranteed 4.5:1 contrast ratios
- **Semantic naming** - Intent-based token names

---

## Color Modes

### Light Mode
- **Background:** Light tones (L: 95-100)
- **Foreground:** Dark tones (L: 10-30)
- **Surfaces:** Subtle grays (L: 85-95)
- **Emphasis:** High contrast

### Dark Mode
- **Background:** Dark tones (L: 10-20)
- **Foreground:** Light tones (L: 85-100)
- **Surfaces:** Elevated grays (L: 15-25)
- **Emphasis:** Controlled brightness

---

## Token Structure

###Generated Token Schema

```typescript
interface ColorTokens {
  mode: 'light' | 'dark';
  background: {
    default: string;         // Main background
    subtle: string;          // Secondary background
    surface: string;         // Card/panel surfaces
    overlay: string;         // Modal overlays
  };
  foreground: {
    default: string;         // Primary text
    muted: string;           // Secondary text
    subtle: string;          // Tertiary text
    disabled: string;        // Disabled state
  };
  primary: {
    default: string;         // Primary brand color
    hover: string;           // Hover state
    active: string;          // Active/pressed state
    subtle: string;          // Subtle background
    contrast: string;        // High contrast text
  };
  // ... additional semantic scales
}
```

---

## Generation Algorithm

### Phase 1: Base Color Selection
```typescript
// Input: Primary brand color
const primaryColor = { L: 60, C: 0.15, H: 240 }; // OKLCH

// Generate light mode palette
const lightPalette = ColorScientist.generateLightMode(primaryColor);

// Generate dark mode palette
const darkPalette = ColorScientist.generateDarkMode(primaryColor);
```

### Phase 2: Contrast Validation
```typescript
// Validate all foreground/background pairs
for (const pair of colorPairs) {
  const ratio = getContrastRatio(pair.fg, pair.bg);
  
  if (ratio < 4.5) {
    // Adjust lightness until contrast meets WCAG AA
    pair.fg = adjustLightnessForContrast(pair.fg, pair.bg, 4.5);
  }
}
```

### Phase 3: Mode Pairing
```typescript
// Ensure semantic consistency across modes
const pairedTokens = {
  'color-bg-default-light': lightPalette.background.default,
  'color-bg-default-dark': darkPalette.background.default,
  'color-text-default-light': lightPalette.foreground.default,
  'color-text-default-dark': darkPalette.foreground.default
};
```

---

## OKLCH Color Space

### Why OKLCH?

- **Perceptual uniformity** - Equal lightness = equal perceived brightness
- **Consistent chroma** - Predictable saturation across hues
- **Wide gamut** - Modern display support
- **Mathematical precision** - Reliable contrast calculations

### OKLCH Components

```typescript
interface OKLCH {
  L: number;  // Lightness (0-100)
  C: number;  // Chroma (0-0.4)
  H: number;  // Hue (0-360)
}
```

### Conversion Example

```typescript
// Hex → OKLCH
const oklch = hexToOKLCH('#3b82f6');
// { L: 60, C: 0.19, H: 248 }

// OKLCH → Hex
const hex = oklchToHex({ L: 60, C: 0.19, H: 248 });
// '#3b82f6'
```

---

## Dark Mode Generation Strategy

### Lightness Inversion

```
Light Mode Background: L = 98
Dark Mode Background:  L = 12

Light Mode Text: L = 20
Dark Mode Text:  L = 92
```

### Chroma Adjustment

```typescript
// Reduce chroma in dark mode to avoid eye strain
darkChroma = lightChroma * 0.8;

// Example:
lightPrimary: { L: 60, C: 0.20, H: 240 }
darkPrimary:  { L: 65, C: 0.16, H: 240 }  // 20% less saturated
```

### Hue Preservation

Hues remain consistent across modes to maintain brand identity:

```typescript
lightPrimary.H === darkPrimary.H  // true (both 240°)
```

---

## Semantic Color Scales

### Background Scale

| Token | Light Mode | Dark Mode | Purpose |
|-------|------------|-----------|---------|
| `bg-default` | L: 98 | L: 12 | Main background |
| `bg-subtle` | L: 95 | L: 15 | Secondary bg |
| `bg-surface` | L: 100 | L: 18 | Cards, panels |
| `bg-overlay` | L: 100, A: 0.9 | L: 8, A: 0.95 | Modals |

### Text Scale

| Token | Light Mode | Dark Mode | Purpose |
|-------|------------|-----------|---------|
| `text-default` | L: 18 | L: 92 | Body text |
| `text-muted` | L: 40 | L: 70 | Secondary text |
| `text-subtle` | L: 55 | L: 50 | Tertiary text |
| `text-disabled` | L: 70 | L: 40 | Disabled state |

### Interactive Scale

| Token | Light Mode | Dark Mode | Purpose |
|-------|------------|-----------|---------|
| `primary-default` | L: 55 | L: 60 | Primary actions |
| `primary-hover` | L: 45 | L: 70 | Hover state |
| `primary-active` | L: 40 | L: 75 | Active state |
| `primary-subtle` | L: 92 | L: 22 | Subtle bg |

---

## Accessibility Compliance

### WCAG 2.1 Levels

- **AA (4.5:1)** - Normal text (minimum)
- **AA Large (3:1)** - Large text (18pt+)
- **AAA (7:1)** - Enhanced contrast (recommended)

### Automated Validation

```typescript
// All color pairs validated during generation
const validation = validateContrast(
  tokens['text-default'],
  tokens['bg-default']
);

console.log(validation);
// {
//   ratio: 12.5,
//   passesAA: true,
//   passesAAA: true,
//   recommendation: 'Excellent contrast for normal text (AAA)'
// }
```

### Fallback Strategy

If contrast validation fails:

1. **Adjust lightness** incrementally (±5 units)
2. **Retry validation** until threshold met
3. **Log warning** if >20% adjustment needed
4. **Use safe fallback** (#000 or #fff) if unsolvable

---

## Usage Examples

### Basic Generation

```typescript
import { ColorScientist } from './css-engine/specialists/ColorScientist.js';

const scientist = new ColorScientist();

// Generate dual-mode palette
const palette = scientist.generateDualModePalette('#3b82f6');

console.log(palette.light['bg-default']);  // '#fafafa'
console.log(palette.dark['bg-default']);   // '#0c0c0c'
```

### With Design System

```typescript
const dna = {
  colors: ['#3b82f6'],  // Primary blue
  darkMode: true
};

const architect = new DesignSystemArchitect();
const designPackage = await architect.run(dna);

// Access mode-specific tokens
const lightTokens = designPackage.tokens.color.light;
const darkTokens = designPackage.tokens.color.dark;
```

### API Endpoint

```bash
curl -X POST http://127.0.0.1:8080/design \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "type": "color",
      "primary": "#3b82f6"
    },
    "options": {
      "darkMode": true,
      "contrastLevel": "AAA"
    }
  }'
```

---

## CSS Output

### CSS Custom Properties

```css
:root {
  /* Light mode (default) */
  --color-bg-default: oklch(98% 0.01 240);
  --color-text-default: oklch(18% 0.02 240);
  --color-primary-default: oklch(55% 0.20 240);
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode override */
    --color-bg-default: oklch(12% 0.01 240);
    --color-text-default: oklch(92% 0.02 240);
    --color-primary-default: oklch(60% 0.16 240);
  }
}

/* Manual toggle */
[data-theme="dark"] {
  --color-bg-default: oklch(12% 0.01 240);
  --color-text-default: oklch(92% 0.02 240);
  --color-primary-default: oklch(60% 0.16 240);
}
```

---

## Testing & Validation

### Unit Tests

```typescript
// tests/css-engine/color-system.spec.ts
describe('Dual Mode Color Generation', () => {
  it('should generate accessible light/dark pairs', () => {
    const palette = scientist.generateDualModePalette('#3b82f6');
    
    // Validate light mode contrast
    const lightRatio = getContrastRatio(
      palette.light['text-default'],
      palette.light['bg-default']
    );
    expect(lightRatio).toBeGreaterThanOrEqual(4.5);
    
    // Validate dark mode contrast
    const darkRatio = getContrastRatio(
      palette.dark['text-default'],
      palette.dark['bg-default']
    );
    expect(darkRatio).toBeGreaterThanOrEqual(4.5);
  });
});
```

### Manual Validation

```bash
# Generate design system
curl -X POST http://127.0.0.1:8080/design \
  -H "Content-Type: application/json" \
  -d '{"input":{"type":"color","primary":"#3b82f6"},"options":{"darkMode":true}}' \
  | jq '.design.tokens.color'

# Validate specific pair
node -e "
const { validateContrast } = require('./css-engine/utils/contrast.js');
console.log(validateContrast('#fafafa', '#0a0a0a'));
"
```

---

## Best Practices

1. **Always enable dark mode** in modern applications
2. **Test with real users** - perception varies
3. **Respect system preferences** - `prefers-color-scheme`
4. **Provide manual toggle** - user choice
5. **Validate on real devices** - screens differ
6. **Document mode-specific tokens** - clarity for designers
7. **Cache generated palettes** - reuse across sessions

---

## Troubleshooting

### Issue: Low Contrast in Dark Mode

**Symptom:** Text difficult to read on dark background

**Solution:**
```typescript
// Increase contrast target
const options = {
  darkMode: true,
  contrastLevel: 'AAA'  // Use 7:1 instead of 4.5:1
};
```

### Issue: Colors Look Washed Out in Dark Mode

**Symptom:** Overly desaturated appearance

**Solution:**
```typescript
// Reduce chroma adjustment factor
darkChroma = lightChroma * 0.9;  // Instead of 0.8
```

### Issue: Inconsistent Hues Across Modes

**Symptom:** Blue looks purple in dark mode

**Solution:**
- Verify OKLCH hue preservation
- Check color space conversions
- Test on calibrated display

---

## Performance

- **Generation Time:** ~3-5ms per palette
- **Cache Hit:** <1ms (with ThemeCache)
- **Validation:** <1ms per color pair
- **Token Count:** ~40-60 tokens per mode

---

## Future Enhancements

- [ ] High contrast mode support
- [ ] Tritanopia/deuteranopia adjustments
- [ ] Animated mode transitions
- [ ] Per-component mode overrides
- [ ] User-defined contrast preferences

---

**Last Updated:** 2025-10-11  
**Owner:** ColorScientist + Guardian  
**Status:** ✅ Sprint 2 Deliverable
