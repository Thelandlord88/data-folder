/**
 * CSS Engine Type Definitions
 * Type contracts for NEXUS CSS calculation engine
 * 
 * @module css-engine.types
 * @version 1.0.0
 * @see {@link NEXUS_CSS_ENGINE_BOARDROOM_MEETING.md} for architecture decisions
 */

/**
 * Mathematical ratio presets for typography and spacing scales
 * Enhanced with additional musical and mathematical ratios
 */
export type RatioName = 
  | 'minorSecond'     // 1.067
  | 'majorSecond'     // 1.125
  | 'minorThird'      // 1.200
  | 'majorThird'      // 1.250
  | 'perfectFourth'   // 1.333
  | 'augmentedFourth' // 1.414 (√2)
  | 'perfectFifth'    // 1.500
  | 'minorSixth'      // 1.600
  | 'majorSixth'      // 1.667
  | 'golden'          // 1.618 (φ)
  | 'harmonic'        // 1.618 (alternative golden)
  | 'photographic';   // 1.189 (√√2)

/**
 * Fibonacci sequence scale types
 */
export type FibonacciScale = 'fibonacci' | 'lucas' | 'tribonacci';

/**
 * Mathematical scale types for calculation
 */
export type MathematicalScale = 
  | FibonacciScale 
  | 'geometric' 
  | 'modular' 
  | 'linear'
  | 'exponential'
  | 'logarithmic';

/**
 * Scale calculation parameters with precision control
 */
export interface ScaleCalculation {
  /** Base value for scale generation */
  base: number;
  /** Ratio for progression (geometric/modular) */
  ratio: number;
  /** Number of steps in the scale */
  steps: number;
  /** Decimal places for rounding (default: 3) */
  precision?: number;
  /** Optional clamping to prevent extreme values */
  clamp?: { 
    min?: number; 
    max?: number;
  };
}

/**
 * Color harmony calculation methods
 */
export type ColorHarmony = 
  | 'triadic'       // 120° apart
  | 'analogous'     // 30° apart
  | 'complementary' // 180° apart
  | 'split-complementary'
  | 'tetradic'      // 90° apart
  | 'square';       // Equal spacing

/**
 * WCAG contrast compliance levels
 */
export type WCAGLevel = 'AA' | 'AAA';

/**
 * Color space for accurate calculations
 */
export type ColorSpace = 'hsl' | 'lab' | 'lch' | 'rgb';

/**
 * Palette generation strategy
 */
export type PaletteGeneration = 'harmonic' | 'scientific' | 'artistic';

/**
 * Lightness curve adjustment for palette generation
 */
export type LightnessCurve = 'linear' | 'exponential' | 'logarithmic' | 's-curve';

/**
 * Chroma (saturation) management strategy
 */
export type ChromaManagement = 'constant' | 'descending' | 'ascending' | 'custom';

/**
 * Advanced color configuration for precise calculations
 */
export interface AdvancedColorConfig {
  /** Color space for calculations (HSL/LCH recommended) */
  colorSpace: ColorSpace;
  /** Palette generation strategy */
  generation: PaletteGeneration;
  /** Lightness curve adjustment */
  lightnessCurve?: LightnessCurve;
  /** Chroma (saturation) management */
  chromaManagement?: ChromaManagement;
  /** Custom chroma values (if chromaManagement='custom') */
  customChromaSteps?: number[];
}

/**
 * Accessibility enhancements for color system
 */
export interface ColorAccessibility {
  /** Compensate for color blindness (deuteranopia, protanopia, tritanopia) */
  compensateForColorBlindness?: boolean;
  /** Maintain contrast ratios in dark mode */
  maintainContrastInDarkMode?: boolean;
  /** Adjust for ambient light conditions */
  adjustForAmbientLight?: boolean;
  /** Ensure color is not the only differentiator */
  ensureNonColorCues?: boolean;
}

/**
 * Color intent specification for palette generation
 * Enhanced with advanced calculation options
 */
export interface ColorIntent {
  /** Primary brand color (hex, hsl, rgb) */
  primary: string;
  /** Neutral/background colors */
  neutral?: string;
  /** Success state colors */
  success?: string;
  /** Warning state colors */
  warning?: string;
  /** Danger/error state colors */
  danger?: string;
  /** WCAG contrast target level */
  contrastTarget?: WCAGLevel;
  /** Color harmony calculation method */
  harmony?: ColorHarmony;
  /** Advanced color configuration */
  advanced?: AdvancedColorConfig;
  /** Accessibility adjustments */
  accessibility?: ColorAccessibility;
}

/**
 * Typography scale requirements
 */
export interface TypographyReq {
  /** Base font size in pixels */
  baseSizePx: number;
  /** Ratio for scale progression */
  ratio: RatioName;
  /** Line height calculation strategy */
  lineHeightStrategy?: 'unitless' | 'tight' | 'loose' | 'golden';
  /** Font family stack */
  fontFamily?: string;
}

/**
 * Spacing system requirements using mathematical sequences
 * Enhanced with scale type support
 */
export interface SpacingReq {
  /** Base spacing unit in pixels */
  baseUnitPx: number;
  /** Scale type (Fibonacci, geometric, modular, etc.) */
  scaleType?: MathematicalScale;
  /** Scale ratio for geometric/modular (ignored for Fibonacci) */
  scaleRatio?: number;
  /** Number of steps in the scale */
  steps: number;
  /** Minimum touch target size (WCAG 2.2 requirement: 44px) */
  minTouchTarget?: number;
  /** Precision for calculations (decimal places) */
  precision?: number;
  /** Optional clamping to prevent extreme values */
  clamp?: {
    min?: number;
    max?: number;
  };
}

/**
 * Responsive breakpoint configuration
 */
export interface BreakpointsReq {
  /** Extra small (mobile) */
  xs: number;
  /** Small (large mobile/small tablet) */
  sm: number;
  /** Medium (tablet) */
  md: number;
  /** Large (desktop) */
  lg: number;
  /** Extra large (wide desktop) */
  xl: number;
  /** Optional: 2xl for ultra-wide */
  xxl?: number;
}

/**
 * Grid calculation strategy
 */
export type GridCalculationStrategy = 'optimal-fit' | 'mathematical' | 'aesthetic';

/**
 * Responsive breakpoint behavior
 */
export type BreakpointBehavior = 'recalculate' | 'scale' | 'reflow';

/**
 * Grid constraint configuration
 */
export interface GridConstraints {
  /** Minimum number of columns */
  minColumns?: number;
  /** Maximum number of columns */
  maxColumns?: number;
  /** Preferred aspect ratios for items */
  preferredAspectRatios?: number[];
  /** Content priorities for editorial layouts (0-1 scale) */
  contentPriorities?: number[];
}

/**
 * Responsive grid behavior configuration
 */
export interface ResponsiveGridConfig {
  /** Enable fluid resizing between breakpoints */
  fluid?: boolean;
  /** Minimum viewport width for calculations */
  minViewport?: number;
  /** Maximum viewport width for calculations */
  maxViewport?: number;
  /** How grid behaves at breakpoints */
  breakpointBehavior?: BreakpointBehavior;
}

/**
 * Layout calculation requirements
 * Enhanced with precision controls and responsive behavior
 */
export interface LayoutReq {
  /** Grid layout style */
  gridStyle?: 'simple' | 'complex' | 'editorial' | 'modular' | 'radial' | 'fibonacci-spiral';
  /** Desired number of columns or 'optimal' for auto-calculation */
  desiredColumns?: 'optimal' | number;
  /** Desired number of rows or 'dynamic' for auto-calculation */
  desiredRows?: 'dynamic' | number;
  /** Minimum column width in pixels */
  minColumnPx?: number;
  /** Maximum column width in pixels */
  maxColumnPx?: number;
  /** Gap between columns/rows */
  gap?: number | 'fibonacci' | 'golden';
  /** Aspect ratio for grid items */
  aspectRatio?: '1:1' | '4:3' | '16:9' | 'golden' | number;
  /** Grid calculation strategy */
  calculationStrategy?: GridCalculationStrategy;
  /** Constraint solving approach */
  constraints?: GridConstraints;
  /** Responsive behavior configuration */
  responsive?: ResponsiveGridConfig;
}

/**
 * Z-index layering requirements
 */
export interface ZIndexReq {
  /** Layer name (e.g., 'modal', 'dropdown', 'tooltip') */
  layer: string;
  /** Sibling layers to consider for conflict-free calculation */
  siblings?: string[];
  /** Base z-index value */
  base?: number;
  /** Increment between layers */
  increment?: number;
}

/**
 * Performance and optimization requirements
 * Enhanced with memory management and parallelism
 */
export interface PerfReq {
  /** Target compute budget in milliseconds */
  budgetMs?: number;
  /** Enable reduced motion support */
  reducedMotion?: boolean;
  /** Generate compressed/minified output */
  minify?: boolean;
  /** Lazy calculation strategy (calculate on-demand) */
  lazyCalculation?: boolean;
  /** Enable incremental updates for large systems */
  incremental?: boolean;
  /** Memory usage limit in megabytes */
  memoryBudgetMB?: number;
  /** Parallel computation settings ('auto' or specific thread count) */
  parallelism?: 'auto' | number;
}

/**
 * Complete CSS requirements specification
 * This is the main input interface for the CSS Engine
 */
export interface CSSRequirements {
  /** Design system configuration */
  design: {
    /** Color palette requirements */
    color: ColorIntent;
    /** Typography scale requirements */
    typography: TypographyReq;
    /** Spacing system requirements */
    spacing: SpacingReq;
    /** Responsive breakpoints */
    breakpoints: BreakpointsReq;
  };
  /** Layout calculation requirements */
  layout: LayoutReq;
  /** Z-index layering (optional) */
  zIndex?: ZIndexReq;
  /** Performance optimization settings */
  performance?: PerfReq;
}

/**
 * Design token output structure
 * Following W3C design tokens specification (simplified)
 */
export interface DesignTokens {
  /** Color tokens with resolved values */
  color: Record<string, string>;
  /** Spacing tokens (px values) */
  spacing: Record<string, string | number>;
  /** Typography tokens */
  typography: Record<string, string | number>;
  /** Breakpoint tokens (px values) */
  breakpoints: Record<string, number>;
  /** Elevation/shadow tokens */
  elevation: Record<string, string>;
  /** Animation/transition tokens */
  animation: Record<string, string>;
  /** Z-index tokens (if requested) */
  zIndex?: Record<string, number>;
}

/**
 * WCAG contrast audit result
 */
export interface ContrastAudit {
  /** Color pair being tested */
  pair: [string, string];
  /** Calculated contrast ratio */
  ratio: number;
  /** Pass AA requirements (4.5:1 for normal text) */
  passAA: boolean;
  /** Pass AAA requirements (7:1 for normal text) */
  passAAA: boolean;
  /** Font size being tested */
  fontSize?: string;
  /** Recommendation if fails */
  recommendation?: string;
}

/**
 * Grid layout solution from solver
 */
export interface GridSolution {
  /** Number of columns calculated */
  columns: number;
  /** Number of rows calculated */
  rows: number;
  /** Column width in pixels or CSS unit */
  columnWidth: string;
  /** Row height in pixels or CSS unit */
  rowHeight: string;
  /** Gap size */
  gap: string;
  /** Aspect ratio applied */
  aspectRatio?: string;
  /** CSS Grid template areas (optional) */
  areas?: string[][];
}

/**
 * Validation result structure
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Error messages */
  errors: string[];
  /** Warning messages */
  warnings: string[];
  /** Suggestions for improvement */
  suggestions: string[];
}

/**
 * Validation rule definition
 */
export interface ValidationRule<T> {
  /** Validation function */
  validate: (value: T) => ValidationResult;
  /** Rule description */
  message: string;
  /** Severity level */
  severity: 'error' | 'warning' | 'info';
}

/**
 * Performance metrics for diagnostics
 */
export interface PerformanceMetrics {
  /** Memory usage in megabytes */
  memoryUsageMB: number;
  /** Calculation complexity assessment */
  calculationComplexity: 'low' | 'medium' | 'high';
  /** Cache hit rate (0-1 scale) */
  cacheHitRate?: number;
  /** Number of computations performed */
  computationCount?: number;
}

/**
 * Mathematical integrity checks
 */
export interface MathematicalIntegrity {
  /** Whether ratios are preserved throughout */
  ratioPreservation: boolean;
  /** Whether scale is consistent */
  scaleConsistency: boolean;
  /** Symmetry score (0-1 scale, 1=perfect symmetry) */
  symmetryScore?: number;
  /** Golden ratio adherence (0-1 scale) */
  goldenRatioAdherence?: number;
}

/**
 * Accessibility compliance summary
 */
export interface AccessibilityCompliance {
  /** Overall accessibility score (0-100) */
  overallScore: number;
  /** WCAG contrast compliance level */
  contrastCompliance: 'full' | 'partial' | 'none';
  /** Safe for color blind users */
  colorBlindSafe: boolean;
  /** Safe for users with motion sensitivity */
  motionSafe: boolean;
  /** Minimum touch target compliance */
  touchTargetCompliant?: boolean;
}

/**
 * Diagnostic information about calculations
 * Enhanced with performance and accessibility metrics
 */
export interface CSSEngineDiagnostics {
  /** WCAG contrast audits performed */
  contrastAudits?: ContrastAudit[];
  /** Grid layout solution details */
  gridSolution?: GridSolution;
  /** Mathematical calculations used */
  calculations?: {
    fibonacci?: number[];
    goldenRatio?: number;
    modularScale?: number[];
    geometricScale?: number[];
  };
  /** Warnings generated during computation */
  warnings?: string[];
  /** Compute time in milliseconds */
  computeTimeMs?: number;
  /** Performance metrics */
  performance?: PerformanceMetrics;
  /** Mathematical integrity checks */
  mathematicalIntegrity?: MathematicalIntegrity;
  /** Accessibility compliance summary */
  accessibility?: AccessibilityCompliance;
}

/**
 * Complete design package output from CSS Engine
 * This is the main output interface
 */
export interface DesignPackage {
  /** Computed design tokens */
  tokens: DesignTokens;
  /** Compiled CSS custom properties (ready to use) */
  cssVariables: string;
  /** Optional Tailwind CSS configuration extension */
  tailwindExtension?: Record<string, unknown>;
  /** Human-readable notes and recommendations */
  notes: string[];
  /** Diagnostic information */
  diagnostics: CSSEngineDiagnostics;
  /** Stable cache key for this result */
  cacheKey: string;
  /** Whether result was served from cache */
  cached?: boolean;
  /** Generation timestamp */
  timestamp?: number;
}

/**
 * CSS calculation request types
 * Used by personalities to request specific calculations
 */
export type CSSCalculationType =
  | 'spacing-system'        // Generate spacing scale
  | 'color-palette'         // Generate color palette
  | 'typography-scale'      // Generate typography scale
  | 'grid-layout'           // Calculate grid layout
  | 'z-index-layer'         // Calculate z-index layering
  | 'wcag-contrast'         // Calculate WCAG contrast
  | 'aspect-ratio-grid'     // Calculate aspect-ratio based grid
  | 'responsive-breakpoints' // Calculate responsive breakpoints
  | 'full-design-system';   // Generate complete design system

/**
 * Simplified CSS calculation request for personality traits
 * Personalities use this to request CSS calculations
 */
export interface CSSCalculationRequest {
  /** Type of calculation to perform */
  type: CSSCalculationType;
  /** Requirements for the calculation (varies by type) */
  requirements: Partial<CSSRequirements>;
  /** Optional: Auto-fix non-compliant values */
  autoFix?: boolean;
  /** Optional: Request caching (default: true) */
  cache?: boolean;
}

/**
 * CSS calculation result for personality traits
 * Simplified response format for personalities
 */
export interface CSSCalculationResult {
  /** Computed CSS custom properties */
  customProperties: string;
  /** Structured token data */
  tokens: Partial<DesignTokens>;
  /** Validation results */
  validation: {
    pass: boolean;
    errors?: string[];
    warnings?: string[];
  };
  /** Whether result was cached */
  cached: boolean;
  /** Compute time in milliseconds */
  computeTime: number;
  /** Any adjustments made (if autoFix enabled) */
  adjustments?: string[];
}

/**
 * CSS Engine configuration
 * Enhanced with performance and profiling options
 */
export interface CSSEngineConfig {
  /** Enable caching */
  cacheEnabled: boolean;
  /** Cache TTL in milliseconds (default: 600000 = 10 minutes) */
  cacheTTL: number;
  /** Maximum cache size (default: 100 entries) */
  cacheMaxSize: number;
  /** Compute timeout in milliseconds (default: 5000) */
  computeTimeout: number;
  /** Enable auto-fix for non-compliant values */
  autoFixEnabled: boolean;
  /** Enable incremental calculation for large systems */
  incrementalEnabled: boolean;
  /** Maximum memory usage in MB (default: 50MB) */
  maxMemoryMB: number;
  /** Enable Web Workers for heavy computations */
  useWebWorkers: boolean;
  /** Enable profiling and metrics collection */
  enableProfiling: boolean;
}

/**
 * Validation rules for CSS requirements
 */
export interface CSSValidationRules {
  /** Color validation rules */
  color: ValidationRule<ColorIntent>[];
  /** Typography validation rules */
  typography: ValidationRule<TypographyReq>[];
  /** Spacing validation rules */
  spacing: ValidationRule<SpacingReq>[];
  /** Layout validation rules */
  layout: ValidationRule<LayoutReq>[];
}

/**
 * CSS Engine error types
 */
export class CSSEngineError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'CSSEngineError';
  }
}

/**
 * Validation error for CSS requirements
 */
export class CSSValidationError extends CSSEngineError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'CSSValidationError';
  }
}

/**
 * Compute timeout error
 */
export class CSSComputeTimeoutError extends CSSEngineError {
  constructor(timeoutMs: number) {
    super(`CSS computation exceeded timeout of ${timeoutMs}ms`, 'COMPUTE_TIMEOUT');
    this.name = 'CSSComputeTimeoutError';
  }
}

/**
 * WCAG contrast failure error
 */
export class WCAGContrastError extends CSSEngineError {
  constructor(
    message: string,
    public foreground: string,
    public background: string,
    public ratio: number,
    public required: number
  ) {
    super(message, 'WCAG_CONTRAST_FAIL', { foreground, background, ratio, required });
    this.name = 'WCAGContrastError';
  }
}

/**
 * Export all types as namespace for convenience
 */
export namespace CSSEngine {
  export type Ratio = RatioName;
  export type Scale = FibonacciScale;
  export type Harmony = ColorHarmony;
  export type WCAG = WCAGLevel;
  export type CalculationType = CSSCalculationType;
  export type Request = CSSCalculationRequest;
  export type Result = CSSCalculationResult;
  export type Package = DesignPackage;
  export type Config = CSSEngineConfig;
  export type Requirements = CSSRequirements;
}
