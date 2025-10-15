# LayoutAlgorithmist Specialist Specification

**Status:** Draft (v0.1)  
**Owner:** Cody  
**Date:** 2025-10-11  
**Scope:** Compute intelligent layout strategies from component metadata, grids, and spacing heuristics.

---

## Mission
Build a layout intelligence module that transforms component inventories and constraints into optimal flex/grid configurations, honoring accessibility, readability, and mathematical harmony. The output feeds Tailwind/Astro generators with ready-to-use layout tokens and recipes.

---

## Inputs
- `GridMathematician` results (responsive grid matrices, aspect ratios)
- `SpatialFacts.spacing` & `SpatialFacts.breakpoints`
- `TypographyFacts` (for measure, vertical rhythm)
- Component descriptors:
  ```ts
  interface ComponentNode {
    id: string;
    type: 'hero' | 'card' | 'list' | 'form' | 'cta' | 'custom';
    priority: 'primary' | 'secondary' | 'supporting';
    minWidth?: number; // px
    maxWidth?: number; // px
    minHeight?: number;
    prefersColumns?: number; // desired column span
    alignment?: 'start' | 'center' | 'end' | 'stretch';
    breakAfter?: boolean; // forces new row
    children?: ComponentNode[];
  }
  ```
- Container metadata:
  - `viewportRange`: `{ min: number; max: number }`
  - `contentDensity`: `'airy' | 'balanced' | 'compact'`
  - `motionPreference`: `'auto' | 'reduced'`

---

## Outputs (proposed extensions)
```ts
interface LayoutRecipe {
  breakpoint: string; // xs, sm, md...
  display: 'flex' | 'grid';
  columns?: number;
  columnSpans: Record<string, number>; // componentId -> span count
  rows?: number;
  flow: 'row' | 'column';
  gap: number; // px
  alignItems: 'flex-start' | 'center' | 'stretch';
  justifyContent: 'flex-start' | 'center' | 'space-between';
  autoPlacementNotes?: string[]; // diagnostics
}

interface LayoutDiagnostic {
  componentId: string;
  issue: string; // e.g. "Min width exceeded at md"
  resolution: string; // e.g. "Span increased to 6"
}

interface LayoutPlan {
  recipes: LayoutRecipe[];
  diagnostics: LayoutDiagnostic[];
  motionGuidance: Record<string, { easing: string; duration: number }>;
}
```

---

## Core Responsibilities
1. **Auto Column Assignment**
   - Map components to grid columns honoring priority and preferred spans.
   - Prevent overflows; move overflow components to next row.
2. **Responsive Adaptation**
   - Recalculate spans per breakpoint using grid matrices.
   - Collapse to single-column flows for narrow widths while preserving order.
3. **Flex/Grid Decision Engine**
   - Choose flex vs. grid per breakpoint based on component count, alignment needs, and flow hints.
4. **Whitespace Optimization**
   - Derive gaps from spacing scale; adjust for `contentDensity` preferences.
5. **Accessibility & Measure Checks**
   - Ensure text-heavy components stay within readable widths.
   - Flag violations in diagnostics.
6. **Motion Guidance Hooks**
   - Suggest motion presets (e.g., spring for hero reveal) respecting `motionPreference`.

---

## Algorithm Outline
1. **Preparation**
   - Expand component tree into flattened sequence with hierarchy metadata.
   - Attach grid data per breakpoint (from GridMathematician).
2. **Per Breakpoint Processing**
   - Determine available columns/gaps.
   - Allocate spans greedily by priority, then adjust with constraint satisfaction.
   - Track remaining space; push overflow nodes to new rows.
   - Decide layout mode: `grid` when multiple rows/columns, `flex` when linear flows dominate.
3. **Constraint Resolution**
   - If component `minWidth` not met, increase span or push to next row.
   - If `maxWidth` exceeded, reduce span or split component into sub-units (for lists).
   - Honor `breakAfter` by forcing new row after component.
4. **Diagnostics Collection**
   - Log span adjustments, fallback columns, collapsed states.
   - Note components hidden or reordered due to constraints (avoid unless forced).
5. **Motion Guidance**
   - Map component types to default easing/duration (e.g., hero -> `cubic-bezier(0.22, 1, 0.36, 1)`).
   - If `contentDensity === 'compact'`, shorten durations to keep UI snappy.

---

## Failure Modes
- **Exceeded Columns**: total spans > available columns → re-run allocation with fallback columns.
- **Incompatible Constraints**: component minWidth > container width → emit diagnostic, set span to max and stack.
- **Unknown Component Type**: treat as `custom`, default spans=full width; warn diagnostic.
- **Missing Grid Data**: fallback to simple flex column layout with spacing scale gaps.

All failure cases must yield a valid layout plan and register actionable diagnostics.

---

## Telemetry & Diagnostics
- Record layout computation time per breakpoint.
- Log column span decisions and overrides.
- Count number of forced single-column fallbacks.
- Emit metrics: average component span, unused columns, diagnostics count.

---

## Open Questions
1. Should LayoutAlgorithmist support multi-container (e.g., sidebar vs. main) simultaneously?
2. Do we allow component reordering for optimal packing, or always preserve input order?
3. How deeply should we integrate motion recommendations with MotionPhysicist once available?

Feedback required from SpatialEngineer, TypographyArchitect, Visionary, and MotionPhysicist candidates.

---

## Next Steps
1. Extend contracts to include `LayoutPlan` and related interfaces.
2. Implement LayoutAlgorithmist scaffold that consumes GridMathematician + component descriptors.
3. Update SpatialEngineer (or a new LayoutCoordinator) to invoke the LayoutAlgorithmist.
4. Add unit tests covering:
   - Responsive span adjustments
   - Constraint resolution (min/max width)
   - Diagnostics output for edge cases.
