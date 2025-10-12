/**
 * CSS Engine Core Contracts
 * Type-safe interfaces for the NEXUS CSS Engine specialists
 * 
 * @module contracts
 * @version 1.0.0
 * @architecture Hybrid (Phase 1) → Neural Network (Phase 2)
 */

/**
 * Design input types (multi-format support)
 */
export type DesignInput =
  | { type: 'verbal'; description: string; style?: string }
  | { type: 'color'; primary: string; secondary?: string; accent?: string }
  | { type: 'screenshot'; data: ArrayBuffer; hint?: string }
  | { type: 'existing-css'; code: string }
  | { type: 'figma-url'; url: string }
  | { type: 'brand-guidelines'; bytes: ArrayBuffer }
  | { type: 'sketch'; svg: string };

/**
 * Compilation options
 */
export interface CompileOptions {
  budgetMs?: number;              // Performance budget (default: 200ms)
  reducedMotion?: boolean;        // Respect prefers-reduced-motion
  engineVersion?: string;         // For cache busting
  accessibilityTarget?: 'AA' | 'AAA'; // WCAG level
}

/**
 * Design DNA (extracted from input)
 * Normalized, style-agnostic representation
 */
export interface DesignDNA {
  colors?: string[];                        // Hex or OKLCH samples
  textSamples?: string[];                   // Extracted text
  layoutHints?: Array<{type: string; value: unknown}>;
  brandSignals?: Record<string, unknown>;   // Brand guidelines data
  features?: Record<string, unknown>;       // Misc features
  constraints?: {
    baseTypePx?: number;
    baseSpacePx?: number;
    typeRatio?: 'minorThird' | 'majorThird' | 'perfectFourth' | 'golden';
    breakpoints?: Record<string, number>;
  };
}

/**
 * Color facts (output from ColorScientist)
 */
export interface ColorFacts {
  primary: string;                          // OKLCH format
  ramp: Record<string, string>;             // 50, 100, 200, ..., 900
  audits: Array<{
    pair: [string, string];
    ratio: number;
    pass: boolean;
    level?: 'AA' | 'AAA';
  }>;
  colorSpace: 'oklch';
  harmony?: 'triadic' | 'complementary' | 'analogous';
}

/**
 * Typography facts (output from TypographyArchitect)
 */
export interface TypeFacts {
  base: number;                             // Base font size (px)
  ratio: number;                            // Scale ratio
  steps: Record<string, number>;            // xs, sm, base, lg, xl, 2xl, etc.
  fluidSteps: Record<string, string>;       // clamp() expressions
  leading: number;                          // Line height multiplier
  tracking?: Record<string, number>;        // Letter spacing
}

/**
 * Spatial facts (output from SpatialEngineer)
 */
export interface GridMatrix {
  columns: number;
  columnWidth: number;                      // Width per column (px)
  gutterWidth: number;                      // Gutter size (px)
  marginWidth: number;                      // Outer margin (px)
  ratioUsed: 'golden' | 'perfectFourth' | 'harmonic';
}

export interface ResponsiveGridMatrix {
  breakpoint: string;                       // xs, sm, md...
  containerWidth: number;                   // Container size in px
  grid: GridMatrix;
}

export interface GridComputation {
  grids: ResponsiveGridMatrix[];
  aspectRatios: Record<string, string>;
  contentWidthRecommendations: Record<string, number>;
  diagnostics: string[];
}

export interface SpatialFacts {
  spacing: Record<string, number>;          // 0, 1, 2, ..., 12
  grid: {
    minColPx: number;
    maxColPx: number;
    columns: number;
  };
  breakpoints: Record<string, number>;      // xs, sm, md, lg, xl, xxl
  grids?: ResponsiveGridMatrix[];
  aspectRatios?: Record<string, string>;
  contentWidthRecommendations?: Record<string, number>;
  diagnostics?: string[];
}

export interface LayoutRecipe {
  breakpoint: string;
  display: 'flex' | 'grid';
  columns?: number;
  columnSpans: Record<string, number>;
  rows?: number;
  flow: 'row' | 'column';
  gap: number;
  alignItems: 'flex-start' | 'center' | 'stretch';
  justifyContent: 'flex-start' | 'center' | 'space-between';
  autoPlacementNotes?: string[];
}

export interface LayoutDiagnostic {
  componentId: string;
  issue: string;
  resolution: string;
}

export interface LayoutPlan {
  recipes: LayoutRecipe[];
  diagnostics: LayoutDiagnostic[];
  motionGuidance: Record<string, { easing: string; duration: number }>;
}

/**
 * Complete design package (final output)
 */
export interface DesignPackage {
  tokens: {
    color: Record<string, string>;
    spacing: Record<string, string | number>;
    typography: Record<string, string | number>;
    breakpoints: Record<string, number>;
    elevation?: Record<string, string>;
    animation?: Record<string, string>;
  };
  cssVariables: string;                     // Tailwind v4 @theme format
  tailwindV4CSS: string;                    // Full CSS output
  docs?: string;                            // Usage documentation
  diagnostics: {
    notes: string[];
    audits: Array<{
      check: string;
      pass: boolean;
      details?: unknown;
    }>;
    timings: Record<string, number>;
  };
  cacheKey: string;
}

/**
 * Generic specialist interface
 */
export interface Specialist<TIn = unknown, TOut = unknown> {
  id: string;
  timeoutMs?: number;
  run(input: TIn, opts: CompileOptions): Promise<TOut>;
}

/**
 * Perception adapter (input processing)
 */
export interface PerceptionAdapter extends Specialist<DesignInput, Partial<DesignDNA>> {
  canProcess(input: DesignInput): boolean;
}

/**
 * Critic (quality gates)
 */
export interface Critic extends Specialist<DesignPackage, {
  notes: string[];
  audits: Array<{check: string; pass: boolean; details?: unknown}>;
}> {}

/**
 * Cache interface
 */
export interface Cache<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  has(key: K): boolean;
  delete(key: K): boolean;
  clear(): void;
  size: number;
}

/**
 * WebSocket notifier
 */
export interface Notifier {
  send(event: string, payload: unknown): void;
}

/**
 * Grid configuration
 */
export interface GridConfig {
  minColPx: number;
  maxColPx: number;
  columns: number;
  gap?: number;
  responsive?: boolean;
}

/**
 * Synthesis input (combined specialist outputs)
 */
export interface SynthesisInput {
  color: PromiseSettledResult<ColorFacts>;
  type: PromiseSettledResult<TypeFacts>;
  spatial: PromiseSettledResult<SpatialFacts>;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  perception?: number;
  specialists?: number;
  synthesis?: number;
  total: number;
  cached?: boolean;
}

/**
 * Error types
 */
export class DesignEngineError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'DesignEngineError';
  }
}

export class SpecialistTimeoutError extends DesignEngineError {
  constructor(specialistId: string, timeoutMs: number) {
    super(
      `Specialist "${specialistId}" exceeded timeout of ${timeoutMs}ms`,
      'SPECIALIST_TIMEOUT',
      { specialistId, timeoutMs }
    );
    this.name = 'SpecialistTimeoutError';
  }
}

export class ValidationError extends DesignEngineError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', { field });
    this.name = 'ValidationError';
  }
}
