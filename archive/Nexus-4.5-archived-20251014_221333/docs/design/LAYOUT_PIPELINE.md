# Layout Pipeline Documentation

Comprehensive guide to the Layout Delivery Pipeline for responsive grid systems.

---

## Overview

The Layout Delivery Pipeline orchestrates the LayoutAlgorithmist specialist to generate optimal layout matrices for responsive design systems. It provides:

- **Responsive breakpoint management** (mobile, tablet, desktop, wide)
- **Grid system generation** (columns, gutters, margins)
- **Layout strategy selection** (fluid, fixed, hybrid, auto)
- **Integration with DesignSystemArchitect**

---

## Architecture

```
DesignDNA → LayoutDeliveryPipeline → LayoutMatrix → DesignSystemArchitect → Design Package
```

### Components

1. **LayoutDeliveryPipeline** - Main orchestrator
2. **LayoutAlgorithmist** - Computes optimal column widths
3. **LayoutMatrix** - Responsive configuration data structure
4. **Integration Layer** - Injects layout into design DNA

---

## Layout Strategies

### 1. Fluid (`'fluid'`)
- Gutters and margins scale proportionally with viewport
- Columns adjust based on available space
- Best for: Content-heavy sites, editorial layouts

**Example:**
```typescript
const matrix = await pipeline.generateLayoutMatrix(dna, {
  layoutStrategy: 'fluid'
});
```

### 2. Fixed (`'fixed'`)
- Consistent column count across all breakpoints (typically 12)
- Fixed gutters and margins
- Best for: Application UIs, dashboards

### 3. Hybrid (`'hybrid'`)
- Combines fixed structure with fluid spacing
- Columns fixed, gutters/margins scale
- Best for: E-commerce, marketing sites

### 4. Auto (`'auto'`)
- Automatically selects strategy based on design DNA constraints
- Analyzes responsive requirements
- **Default strategy**

---

## Breakpoints

### Default Responsive Breakpoints

| Name | Width | Columns | Gutter | Margin |
|------|-------|---------|--------|--------|
| mobile | 360px | 4 | 16px | 16px |
| tablet | 768px | 8 | 24px | 32px |
| desktop | 1024px | 12 | 24px | 48px |
| wide | 1440px | 12 | 32px | 64px |

### Custom Breakpoints

```typescript
const customBreakpoints: Breakpoint[] = [
  { name: 'xs', width: 320, columns: 4, gutter: 12, margin: 12 },
  { name: 'sm', width: 640, columns: 6, gutter: 16, margin: 24 },
  { name: 'md', width: 960, columns: 12, gutter: 20, margin: 40 },
  { name: 'lg', width: 1280, columns: 12, gutter: 24, margin: 56 },
  { name: 'xl', width: 1920, columns: 12, gutter: 32, margin: 80 }
];

const matrix = await pipeline.generateLayoutMatrix(dna, {
  customBreakpoints
});
```

---

## Usage Examples

### Basic Usage

```typescript
import { LayoutDeliveryPipeline } from './css-engine/pipelines/LayoutDeliveryPipeline.js';

const pipeline = new LayoutDeliveryPipeline();

// Generate layout matrix
const matrix = await pipeline.generateLayoutMatrix(dna, {
  layoutStrategy: 'fluid'
});

// Validate matrix
const validation = pipeline.validateMatrix(matrix);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}

// Integrate into design DNA
const enhancedDNA = pipeline.integrateLayoutIntoDNA(dna, matrix);
```

### With DesignSystemArchitect

```typescript
import { DesignSystemArchitect } from './css-engine/specialists/DesignSystemArchitect.js';
import { layoutPipeline } from './css-engine/pipelines/LayoutDeliveryPipeline.js';

// Generate layout matrix
const matrix = await layoutPipeline.generateLayoutMatrix(dna, {
  layoutStrategy: 'hybrid',
  enableFluidTypography: true,
  enableResponsiveSpacing: true
});

// Integrate with design DNA
const enhancedDNA = layoutPipeline.integrateLayoutIntoDNA(dna, matrix);

// Generate design system
const architect = new DesignSystemArchitect();
const designPackage = await architect.run(enhancedDNA);
```

### API Endpoint Integration

In `nexus-runtime.v2.ts`:

```typescript
// POST /design with layout strategy
const body = await this.readBody(req);
const { dna, layoutStrategy } = body;

// Generate layout matrix
const matrix = await layoutPipeline.generateLayoutMatrix(dna, {
  layoutStrategy: layoutStrategy || 'auto'
});

// Integrate and generate
const enhancedDNA = layoutPipeline.integrateLayoutIntoDNA(dna, matrix);
const designPackage = await architect.run(enhancedDNA);
```

---

## Layout Matrix Structure

```typescript
interface LayoutMatrix {
  strategy: 'fluid' | 'fixed' | 'hybrid' | 'auto';
  breakpoints: Breakpoint[];
  baseUnit: number;          // Grid base unit (8px)
  columnWidth: number;       // Computed optimal column width
  maxWidth: number;          // Maximum layout width
  minWidth: number;          // Minimum layout width
}

interface Breakpoint {
  name: string;              // Breakpoint identifier
  width: number;             // Viewport width in px
  columns: number;           // Number of columns
  gutter: number;            // Space between columns (px)
  margin: number;            // Left/right page margins (px)
}
```

---

## Generated CSS Tokens

The pipeline generates CSS custom properties for each breakpoint:

```css
:root {
  /* Base grid system */
  --grid-base-unit: 8px;
  --grid-column-width: 64px;
  --grid-max-width: 1440px;
  
  /* Mobile breakpoint */
  --grid-mobile-columns: 4;
  --grid-mobile-gutter: 16px;
  --grid-mobile-margin: 16px;
  --grid-mobile-width: 360px;
  
  /* Tablet breakpoint */
  --grid-tablet-columns: 8;
  --grid-tablet-gutter: 24px;
  --grid-tablet-margin: 32px;
  --grid-tablet-width: 768px;
  
  /* ... desktop and wide breakpoints */
}
```

---

## Validation

The pipeline includes built-in validation:

### Validation Rules

1. **Breakpoint Order** - Widths must be ascending
2. **Column Count** - Must be between 1 and 24
3. **Positive Values** - Gutters and margins must be ≥ 0
4. **Logical Constraints** - Column width must fit within viewport

### Example Validation

```typescript
const validation = pipeline.validateMatrix(matrix);

if (!validation.valid) {
  validation.errors.forEach(error => {
    console.error('❌', error);
  });
}
```

---

## Golden Ratio Integration

The pipeline uses the golden ratio (φ = 1.618) for:

- **Column width calculations**
- **Gutter proportions**
- **Margin scaling**

This ensures visually harmonious layouts following mathematical principles of proportion.

---

## Performance Considerations

- **Lazy Computation** - Matrix generated only when needed
- **Caching** - Results cached via ThemeCache
- **Async/Await** - Non-blocking generation
- **Validation** - Fast validation before generation

**Target Performance:**
- Matrix generation: <5ms
- Validation: <1ms
- Integration: <2ms

---

## Integration with Theme Caching

Layout matrices are included in theme cache keys:

```typescript
const cacheKey = ThemeCache.generateKey({
  ...dna,
  layoutStrategy: 'fluid'
}, options);

const cached = themeCache.get(cacheKey);
```

This ensures layout changes invalidate cached themes appropriately.

---

## Error Handling

```typescript
try {
  const matrix = await pipeline.generateLayoutMatrix(dna, config);
  const validation = pipeline.validateMatrix(matrix);
  
  if (!validation.valid) {
    throw new Error(`Invalid layout matrix: ${validation.errors.join(', ')}`);
  }
  
  const enhancedDNA = pipeline.integrateLayoutIntoDNA(dna, matrix);
} catch (error) {
  console.error('Layout pipeline error:', error);
  // Fallback to default layout
}
```

---

## Best Practices

1. **Always validate** matrices before use
2. **Use auto strategy** unless specific requirements
3. **Test across all breakpoints** during development
4. **Cache aggressively** - layouts change infrequently
5. **Profile generation time** if >10ms
6. **Document custom breakpoints** in design system docs

---

## Future Enhancements

- [ ] Container query support
- [ ] Subgrid integration
- [ ] Dynamic column count based on content
- [ ] CSS Grid Layout generation
- [ ] Flexbox fallbacks
- [ ] Print layout optimization

---

**Last Updated:** 2025-10-11  
**Owner:** Stellar + SpatialEngineer  
**Status:** ✅ Sprint 2 Deliverable
