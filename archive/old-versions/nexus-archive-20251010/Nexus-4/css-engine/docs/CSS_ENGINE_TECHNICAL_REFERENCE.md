# NEXUS-4 CSS Engine Technical Reference

_Comprehensive implementation dossier covering every public module, import/export surface, and execution flow._

## 1. System Overview

- **Purpose**: Transform high-level "design DNA" into deterministic, production-ready design tokens and Tailwind v4 `@theme` CSS in under 200 ms.
- **Primary Entry Point**: `specialists/DesignSystemArchitect.ts` orchestrates the three specialists in parallel and synthesises the final package.
- **Inputs**:

  - `DesignDNA` objects (see `contracts.ts`) feeding normalized color, typography, spacing, layout, and contextual hints.
  - `CompileOptions` specifying performance budget, motion preferences, and accessibility targets.
- **Outputs**:

  - `DesignPackage` containing tokens, CSS, docs, diagnostics, cache keys, and audits.
  - Generated artifacts via integration scripts (e.g., `css-engine/output/*.json|css`).
- **Performance Envelope**: Observed ~3.5–5.1 ms for end-to-end design generation; sustained load remains <1 ms per invocation when warm.

```text
Design DNA → Validation → Specialists (Color | Typography | Spatial) → Orchestrator → CSS/Tokens/Docs
```

## 2. Core Data Contracts (`css-engine/contracts.ts`)

**Imports**: _None._

**Exports**:

- Types: `DesignInput`, `CompileOptions`, `DesignDNA`, `ColorFacts`, `TypeFacts`, `SpatialFacts`, `DesignPackage`, `Specialist`, `PerceptionAdapter`, `Critic`, `Cache`, `Notifier`, `GridConfig`, `SynthesisInput`, `PerformanceMetrics`.
- Errors: `DesignEngineError`, `SpecialistTimeoutError`, `ValidationError`.

**Key Responsibilities**:

- Define every structured input/output exchanged across the engine.
- Encode specialist expectations (e.g., `Specialist<TIn, TOut>` contract with `run()` signature and optional `timeoutMs`).
- Provide shared error hierarchy for orchestration and validation.

## 3. Mathematical Backbone (`css-engine/mathematical-systems.ts`)

**Imports**: `RatioName`, `FibonacciScale`, `MathematicalScale`, `ScaleCalculation` from `../types/css-engine.types.js`.

**Exports**: `RATIOS`, `PHI`, `PHI_INVERSE`, `ADVANCED_RATIOS`, `RATIO_FAMILIES`, class `MathematicalSystems`, factory `getMathematicalSystems()`, constants alias `GOLDEN_RATIO`, `GOLDEN_RATIO_INVERSE`.

**Public API of `MathematicalSystems`**:

- Sequence generators: `generateFibonacciSequence`, `generateLucasSequence`, `generateTribonacciSequence`.
- Scale generators: `generateGeometricScale`, `generateModularScale`, `generateLinearScale`, `generateExponentialScale`, `generateLogarithmicScale`, `generateScale`, `calculateScaleByType`.
- Golden-ratio tooling: `calculateGoldenSection`, `calculateGoldenGrid`, `isGoldenAspectRatio`.
- Layout helpers: `calculateOptimalColumns`, `calculateAspectRatio`, `calculateZIndexLayers`, `calculateResponsiveBreakpoints`.
- Numeric utilities: `roundToPrecision`, `clamp`, `lerp`, `inverseLerp`, `mapRange`, `easing`.
- Analytical helpers: `validateScaleProperties`, `generateFluidScale`, `generateHybridSequence`.
- Lifecycle/control: `getPerformanceMetrics`, `clearCaches`, `isFibonacci`, `isPerfectSquare`, `getRatio`, `findClosestRatio`.

**Key Inputs**:

- Accept raw numbers (base sizes, ratios, steps) and clamp them per `ScaleCalculation` descriptors.

**Notes**:

- Maintains internal caches for sequence reuse (`sequenceCache`, `ratioCache`) and performance telemetry.
- The singleton accessor `getMathematicalSystems()` guarantees reuse across specialists to minimise recalculation.

## 4. Validation Layer (`css-engine/validation-engine.ts`)

**Imports**: `z` (Zod) plus extensive type definitions from `../types/css-engine.types.js`.

**Exports**: `cssRequirementsSchema`, `cssCalculationRequestSchema`, classes `CSSValidationEngine`, `CSSValidationRulesFactory`, factory `getValidationEngine()`, constants `SECURITY_LIMITS`.

**Public API**:

- `CSSValidationEngine.validateRequirements(requirements)`
- `CSSValidationEngine.validateCalculationRequest(request)`
- `CSSValidationEngine.createRuleSet<T>(name, validate)` for custom validators.
- `CSSValidationEngine.validateScaleConfig`, `validateColorIntent`, `validateBreakpoints`, `validateLayout`, `validateZIndex`, `validatePerformanceBudget` (internal helpers exposed via rules factory).
- `CSSValidationRulesFactory.createColorRules`, `createTypographyRules`, `createSpacingRules`, `createBreakpointRules`, `createLayoutRules`, `createPerformanceRules`.

**Inputs**:

- Arbitrary user payloads (unknown) hardened into typed objects via Zod. Security limits throttle DoS vectors (max steps, ratios, breakpoints, etc.).
| `contracts.ts` | _(none)_ | All shared types + error classes | – | Type system |
| `mathematical-systems.ts` | `RatioName`, etc. | Constants, `MathematicalSystems`, `getMathematicalSystems` | numeric bases/ratios | sequences, scales, metrics |
| `validation-engine.ts` | `z`, CSS engine types | Validation schemas & engines | raw requirement payloads | `ValidationResult` objects |
| `specialists/ColorScientist.ts` | contracts, OKLCH, contrast utils | `ColorScientist`, factory | `DesignDNA.colors`, `CompileOptions` | `ColorFacts` |
| `specialists/TypographyArchitect.ts` | contracts | ratios, architect class | `DesignDNA.constraints`, text samples | `TypeFacts` |
| `specialists/SpatialEngineer.ts` | contracts, `getMathematicalSystems` | spacing constants, engineer class | `DesignDNA.constraints`, layout hints | `SpatialFacts` |
| `specialists/DesignSystemArchitect.ts` | contracts, specialists, `stableKey` | orchestrator class & factory | `DesignDNA`, `CompileOptions` | `DesignPackage`, diagnostics |
| `utils/oklch.ts` | _(none)_ | conversion utilities | Hex/OKLCH colors | conversions, ramps |
| `utils/contrast.ts` | _(none)_ | contrast + audit helpers | color pairs, WCAG levels | ratios, audits, accessible pairs |
| `utils/stableKey.ts` | `crypto` (native) | hashing utilities | arbitrary objects/strings | deterministic keys |

---

# Appendix B — Execution Flow Summary

1. **Intake**: Optional pre-validation via `CSSValidationEngine` to enforce bounds and rate limits.
2. **Orchestration**: `DesignSystemArchitect.run()`
   - builds context + cache keys (`stableKey`),
   - fires specialists in parallel with `Promise.allSettled`,
   - collects timings and handles fallbacks if a specialist rejects.
3. **Synthesis**: `synthesize()` merges `ColorFacts`, `TypeFacts`, and `SpatialFacts` into tokens, CSS variables, Tailwind CSS, documentation, and diagnostics.
4. **Diagnostics**: `generateDocs()` + `buildDiagnostics()` compress note/audit history including WCAG results, token counts, performance metrics.
5. **Persistence (optional)**: Integration scripts write outputs to `css-engine/output/` or product directories.

---

# Appendix C — Key Function Signatures (Selected)

```ts
// contracts.ts
type Specialist<TIn, TOut> = {
  id: string;
  timeoutMs?: number;
  run(input: TIn, opts: CompileOptions): Promise<TOut>;
};

// DesignSystemArchitect
async run(dna: DesignDNA, opts: CompileOptions): Promise<DesignPackage>;

// ColorScientist
async run(dna: DesignDNA, opts: CompileOptions): Promise<ColorFacts>;

// TypographyArchitect
async run(dna: DesignDNA, opts: CompileOptions): Promise<TypeFacts>;

// SpatialEngineer
async run(dna: DesignDNA, opts: CompileOptions): Promise<SpatialFacts>;

// Utilities
hexToOKLCH(hex: string): OKLCHColor;
contrastRatio(color1: string, color2: string): number;
stableKey(obj: unknown): string;
```

---

Prepared by **GitHub Copilot (NEXUS console)** — October 10, 2025.
