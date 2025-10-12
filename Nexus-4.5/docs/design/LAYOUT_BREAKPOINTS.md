# Layout Breakpoints Reference

Comprehensive guide to NEXUS responsive breakpoint system for accessible, multi-device layouts.

---

## Overview

The NEXUS Layout System provides a **4-breakpoint responsive architecture** optimized for modern devices:

- **Mobile** (360px) - Smartphones
- **Tablet** (768px) - Tablets, small laptops
- **Desktop** (1024px) - Standard desktops, laptops
- **Wide** (1440px+) - Large displays, 4K monitors

---

## Default Breakpoint Matrix

| Breakpoint | Width | Columns | Gutter | Margin | Use Case |
|------------|-------|---------|--------|--------|----------|
| **Mobile** | 360px | 4 | 16px | 16px | Smartphones (portrait) |
| **Tablet** | 768px | 8 | 24px | 32px | Tablets, small laptops |
| **Desktop** | 1024px | 12 | 24px | 48px | Standard desktops |
| **Wide** | 1440px | 12 | 32px | 64px | Large displays, 4K |

---

## Breakpoint Anatomy

### Mobile (360px)
```typescript
{
  name: 'mobile',
  width: 360,
  columns: 4,
  gutter: 16,
  margin: 16
}
```

**Characteristics:**
- **4-column grid** for compact layouts
- **16px gutters** for tight spacing
- **16px margins** to maximize content area
- **Single-column** content recommended

**Best For:**
- Primary content flow
- Stacked navigation
- Full-width images
- Vertical lists

**Accessibility Considerations:**
- Minimum 44×44px touch targets
- Single-column reading flow
- Large, easy-to-tap buttons

---

### Tablet (768px)
```typescript
{
  name: 'tablet',
  width: 768,
  columns: 8,
  gutter: 24,
  margin: 32
}
```

**Characteristics:**
- **8-column grid** for flexible layouts
- **24px gutters** for comfortable spacing
- **32px margins** for visual breathing room
- **2-column** content possible

**Best For:**
- Sidebar + main content
- Grid galleries (2×2, 2×3)
- Horizontal navigation
- Modal dialogs

**Accessibility Considerations:**
- 48×48px touch targets recommended
- Support both portrait/landscape
- Readable line lengths (45-75 characters)

---

### Desktop (1024px)
```typescript
{
  name: 'desktop',
  width: 1024,
  columns: 12,
  gutter: 24,
  margin: 48
}
```

**Characteristics:**
- **12-column grid** for complex layouts
- **24px gutters** (standard spacing)
- **48px margins** for focus
- **Multi-column** content supported

**Best For:**
- Dashboard layouts
- Multi-panel interfaces
- Complex forms
- Data tables

**Accessibility Considerations:**
- Keyboard navigation critical
- Focus indicators clear
- Skip links implemented
- Hover states supplemented with focus

---

### Wide (1440px+)
```typescript
{
  name: 'wide',
  width: 1440,
  columns: 12,
  gutter: 32,
  margin: 64
}
```

**Characteristics:**
- **12-column grid** (same as desktop)
- **32px gutters** for spacious feel
- **64px margins** to prevent edge-to-edge
- **Max-width constraints** recommended

**Best For:**
- High-density information
- Multiple simultaneous panels
- Advanced data visualization
- Professional tools

**Accessibility Considerations:**
- Avoid excessive line lengths
- Use max-width containers (1280-1440px)
- Maintain visual hierarchy at scale
- High contrast for larger displays

---

## Grid Calculations

### Column Width Formula

```
availableWidth = viewportWidth - (2 × margin)
gutterSpace = (columns - 1) × gutter
columnWidth = (availableWidth - gutterSpace) / columns
```

### Example: Desktop (1024px)

```
availableWidth = 1024 - (2 × 48) = 928px
gutterSpace = (12 - 1) × 24 = 264px
columnWidth = (928 - 264) / 12 = 55.33px
```

---

## CSS Implementation

### Media Queries

```css
/* Mobile First (default) */
.container {
  width: 100%;
  padding: 0 16px;
  max-width: 360px;
  margin: 0 auto;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 0 32px;
    max-width: 768px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 0 48px;
    max-width: 1024px;
  }
}

/* Wide */
@media (min-width: 1440px) {
  .container {
    padding: 0 64px;
    max-width: 1440px;
  }
}
```

### CSS Grid Layout

```css
.grid {
  display: grid;
  gap: var(--gutter);
  padding: 0 var(--margin);
}

/* Mobile */
:root {
  --columns: 4;
  --gutter: 16px;
  --margin: 16px;
}

.grid {
  grid-template-columns: repeat(var(--columns), 1fr);
}

/* Tablet */
@media (min-width: 768px) {
  :root {
    --columns: 8;
    --gutter: 24px;
    --margin: 32px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  :root {
    --columns: 12;
    --gutter: 24px;
    --margin: 48px;
  }
}

/* Wide */
@media (min-width: 1440px) {
  :root {
    --gutter: 32px;
    --margin: 64px;
  }
}
```

---

## Component Examples

### Card Grid

```css
.card-grid {
  display: grid;
  gap: var(--gutter);
}

/* Mobile: 1 column */
.card-grid {
  grid-template-columns: 1fr;
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Wide: 4 columns */
@media (min-width: 1440px) {
  .card-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Dashboard Layout

```css
.dashboard {
  display: grid;
  gap: var(--gutter);
}

/* Mobile: Stack everything */
.dashboard {
  grid-template-columns: 1fr;
  grid-template-areas:
    "header"
    "nav"
    "main"
    "sidebar";
}

/* Tablet: Sidebar below */
@media (min-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "header header"
      "nav nav"
      "main main"
      "sidebar sidebar";
  }
}

/* Desktop: Full layout */
@media (min-width: 1024px) {
  .dashboard {
    grid-template-columns: 200px 1fr 300px;
    grid-template-areas:
      "header header header"
      "nav main sidebar";
  }
}
```

---

## Accessibility Guidelines

### WCAG 2.1 Compliance

✅ **Responsive Text**
- Use `clamp()` for fluid typography
- Minimum 16px for body text
- Maximum 75 characters per line

✅ **Touch Targets**
- Mobile: 44×44px minimum
- Tablet/Desktop: 48×48px recommended
- Sufficient spacing between interactive elements

✅ **Content Reflow**
- Support 320px width minimum
- No horizontal scrolling at 100% zoom
- Content adapts gracefully across breakpoints

✅ **Focus Management**
- Visible focus indicators at all breakpoints
- Keyboard navigation works at all sizes
- Skip links available on mobile

### Testing Checklist

- [ ] Test at exact breakpoint widths (360, 768, 1024, 1440)
- [ ] Test between breakpoints (e.g., 500px, 900px)
- [ ] Verify touch targets on mobile/tablet
- [ ] Check keyboard navigation at all sizes
- [ ] Validate content reflow without horizontal scroll
- [ ] Test with browser zoom (100%, 200%, 400%)
- [ ] Verify in portrait and landscape orientations

---

## Performance Considerations

### Container Queries (Modern Browsers)

```css
@container (min-width: 768px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

### Conditional Loading

```typescript
// Load breakpoint-specific assets
if (window.innerWidth >= 1024) {
  import('./desktop-components.js');
} else if (window.innerWidth >= 768) {
  import('./tablet-components.js');
} else {
  import('./mobile-components.js');
}
```

---

## Custom Breakpoints

### Defining Custom Breakpoints

```typescript
const customBreakpoints: Breakpoint[] = [
  { name: 'xs', width: 320, columns: 4, gutter: 12, margin: 12 },
  { name: 'sm', width: 640, columns: 6, gutter: 16, margin: 24 },
  { name: 'md', width: 960, columns: 12, gutter: 20, margin: 40 },
  { name: 'lg', width: 1280, columns: 12, gutter: 24, margin: 56 },
  { name: 'xl', width: 1920, columns: 12, gutter: 32, margin: 80 },
];

const matrix = await layoutPipeline.generateLayoutMatrix(dna, {
  customBreakpoints
});
```

---

## Best Practices

1. **Mobile-First Design**
   - Start with mobile layout
   - Progressively enhance for larger screens
   - Avoid "desktop-only" features

2. **Consistent Spacing**
   - Use gutter values consistently
   - Maintain margin proportions
   - Follow 8px grid system

3. **Content Priority**
   - Most important content first (mobile)
   - Reorganize for optimal viewing at each breakpoint
   - Avoid hiding critical content

4. **Performance**
   - Load breakpoint-specific assets
   - Use `srcset` for responsive images
   - Defer non-critical CSS

5. **Testing**
   - Test on real devices
   - Use browser dev tools
   - Validate across orientations
   - Check accessibility at all sizes

---

**Last Updated:** 2025-10-11  
**Owner:** SpatialEngineer  
**Status:** ✅ Sprint 3 Deliverable
