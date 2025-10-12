# GridMathematician Specialist Specification

**Status:** Draft (v0.1)  
**Owner:** Cody  
**Date:** 2025-10-11  
**Scope:** Provide mathematically precise grid systems for the CSS Engine.

---

## Mission
Deliver a grid computation brain that can reason about container widths, golden ratio layouts, responsive breakpoints, and contiguous column systems. Outputs must be deterministic and WCAG-friendly.

---

## Inputs
- `DesignDNA.constraints`: base layout hints (if provided)
- `SpatialFacts.spacing`: existing spacing scale (for gap harmonization)
- `TypographyFacts`: optional for measure calculations
- Direct parameters:
  - `containerWidth`: numeric (px)
  - `preferredColumns`: number[] (e.g., `[4, 8, 12]`)
  - `ratio`: `'golden' | 'perfectFourth' | 'harmonic'`
  - `baseUnit`: px (default 8)
  - `viewportRange`: `{ min: number; max: number }`

---

## Outputs (proposed extensions to SpatialFacts)
```ts
interface GridMatrix {
  columns: number;
  columnWidth: number; // px
  gutterWidth: number; // px
  marginWidth: number; // px
  ratioUsed: 'golden' | 'perfectFourth' | 'harmonic';
}

interface ResponsiveGridMatrix {
  breakpoint: string; // xs, sm, md...
  containerWidth: number;
  grid: GridMatrix;
}

interface SpatialFacts {
  // existing fields...
  grids: ResponsiveGridMatrix[];
  aspectRatios: Record<string, string>; // e.g., 'golden-portrait': '1:1.618'
  contentWidthRecommendations: Record<string, number>; // per breakpoint
}
```

---

## Core Responsibilities
1. **Golden Ratio Grid**
   - Split container widths into column + gutter sequences aligned with φ.
   - Provide variants: major/minor sections (e.g., 5/8 split).
2. **Responsive Column Matrix**
   - For each breakpoint, determine optimal column count and width.
   - Guarantee readable column width (60–120px).
3. **Aspect Ratio Catalog**
   - Provide ratios for media blocks (16:9, 4:3, φ, square).
4. **Measure Guidance**
   - Use typography data to recommend ideal content widths.
5. **Constraint Satisfaction**
   - Accept manual overrides (preference for 10 columns, etc.).
   - Gracefully degrade if container width is small (stack columns).

---

## Algorithm Outline
1. Normalize constraints:
   - Container widths (default: 320–1600px).
   - Preferred column counts (default: `[4, 8, 12]`).
2. For each breakpoint:
   - Evaluate candidate column counts.
   - Compute column width: `(container - (cols-1)*gutter - 2*margin) / cols`.
   - Adjust gutter/margin using baseUnit (align to spacing scale).
   - Validate width range, adjust columns if needed.
3. Select layout ratio:
   - Golden split: container * (1/φ).
   - Provide sub-grid suggestions (e.g., hero + sidebar).
4. Emit `ResponsiveGridMatrix` list.

---

## Failure Modes
- **Container too narrow** (< 320px): fall back to single column stack.
- **Invalid ratios** (non-supported keyword): default to `golden` and log diagnostic.
- **Conflicting overrides** (e.g., requested 14 columns in 720px viewport): select closest viable column count and report adjustment.
- **Missing spacing scale**: generate gutters from `baseUnit` with geometric progression.
- **Numeric instability**: clamp floating point noise using 0.01 precision.

All failure cases must produce a usable grid and add a diagnostic note rather than throwing.

---

## Telemetry & Diagnostics
- Record computation time per breakpoint.
- Emit selected column counts and ratios.
- Surface adjustments (e.g., “requested 16 columns → using 12 for readability”).
- Provide warnings when column widths fall outside 60–120px range.

---

## Open Questions
1. Should aspect ratio library be customizable per brand (e.g., cinematic vs. product)?
2. Do we expose sub-grid definitions directly to Tailwind/Astro, or only via tokens?
3. How aggressively do we snap to the spacing scale for gutters/margins?

Pending feedback from ColorScientist, TypographyArchitect, and SpatialEngineer before finalizing implementation.

---

## Next Steps
1. Extend `SpatialFacts` interface to include `grids`, `aspectRatios`, `contentWidthRecommendations`.
2. Implement GridMathematician specialist stub with deterministic outputs and diagnostics.
3. Update SpatialEngineer to invoke GridMathematician, maintaining backward compatibility.
4. Add unit tests covering:
   - Golden ratio grids across breakpoints
   - Manual column overrides
   - Edge cases (narrow containers, missing spacing).
