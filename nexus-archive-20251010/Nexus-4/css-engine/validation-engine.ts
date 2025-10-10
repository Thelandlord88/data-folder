/**
 * CSS Engine Validation System
 * Comprehensive input validation with Zod schemas
 * 
 * @module validation-engine
 * @version 1.0.0
 * @owner Hunter (Security Lead)
 * @see {@link css-engine.types.ts} for type definitions
 */

import { z } from 'zod';
import type {
  CSSRequirements,
  CSSCalculationRequest,
  ColorIntent,
  TypographyReq,
  SpacingReq,
  BreakpointsReq,
  LayoutReq,
  ZIndexReq,
  PerfReq,
  ValidationResult,
  ValidationRule,
  CSSValidationRules,
} from '../types/css-engine.types.js';

/**
 * Security limits to prevent DoS attacks
 */
const SECURITY_LIMITS = {
  // Scale generation limits
  MAX_STEPS: 100,
  MIN_STEPS: 1,
  
  // Value range limits
  MAX_BASE_UNIT: 1000,
  MIN_BASE_UNIT: 0.1,
  MAX_RATIO: 10,
  MIN_RATIO: 0.1,
  
  // Grid limits
  MAX_COLUMNS: 100,
  MIN_COLUMNS: 1,
  MAX_ROWS: 100,
  MIN_ROWS: 1,
  
  // Breakpoint limits
  MAX_BREAKPOINT: 10000,
  MIN_BREAKPOINT: 1,
  
  // Color limits
  MAX_HEX_LENGTH: 9, // #RRGGBBAA
  
  // Performance limits
  MAX_BUDGET_MS: 30000, // 30 seconds
  MAX_MEMORY_MB: 500,
  
  // Z-index limits
  MAX_Z_INDEX: 999999,
  MIN_Z_INDEX: -999999,
} as const;

/**
 * Zod schema for RatioName
 */
const ratioNameSchema = z.enum([
  'minorSecond',
  'majorSecond',
  'minorThird',
  'majorThird',
  'perfectFourth',
  'augmentedFourth',
  'perfectFifth',
  'minorSixth',
  'majorSixth',
  'golden',
  'harmonic',
  'photographic',
]);

/**
 * Zod schema for MathematicalScale
 */
const mathematicalScaleSchema = z.enum([
  'fibonacci',
  'lucas',
  'tribonacci',
  'geometric',
  'modular',
  'linear',
  'exponential',
  'logarithmic',
]);

/**
 * Zod schema for ColorHarmony
 */
const colorHarmonySchema = z.enum([
  'triadic',
  'analogous',
  'complementary',
  'split-complementary',
  'tetradic',
  'square',
]);

/**
 * Zod schema for WCAG level
 */
const wcagLevelSchema = z.enum(['AA', 'AAA']);

/**
 * Zod schema for ColorSpace
 */
const colorSpaceSchema = z.enum(['hsl', 'lab', 'lch', 'rgb']);

/**
 * Color string validation (hex, rgb, hsl)
 */
const colorStringSchema = z.string()
  .refine((val) => {
    // Hex color validation
    const hexRegex = /^#([A-Fa-f0-9]{3}){1,2}([A-Fa-f0-9]{2})?$/;
    if (hexRegex.test(val)) return true;
    
    // RGB validation
    const rgbRegex = /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*[\d.]+\s*)?\)$/;
    if (rgbRegex.test(val)) return true;
    
    // HSL validation
    const hslRegex = /^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(,\s*[\d.]+\s*)?\)$/;
    if (hslRegex.test(val)) return true;
    
    return false;
  }, { message: 'Invalid color format. Use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb(), or hsl()' });

/**
 * Zod schema for AdvancedColorConfig
 */
const advancedColorConfigSchema = z.object({
  colorSpace: colorSpaceSchema,
  generation: z.enum(['harmonic', 'scientific', 'artistic']),
  lightnessCurve: z.enum(['linear', 'exponential', 'logarithmic', 's-curve']).optional(),
  chromaManagement: z.enum(['constant', 'descending', 'ascending', 'custom']).optional(),
  customChromaSteps: z.array(z.number().min(0).max(100)).optional(),
}).strict();

/**
 * Zod schema for ColorAccessibility
 */
const colorAccessibilitySchema = z.object({
  compensateForColorBlindness: z.boolean().optional(),
  maintainContrastInDarkMode: z.boolean().optional(),
  adjustForAmbientLight: z.boolean().optional(),
  ensureNonColorCues: z.boolean().optional(),
}).strict();

/**
 * Zod schema for ColorIntent
 */
const colorIntentSchema = z.object({
  primary: colorStringSchema,
  neutral: colorStringSchema.optional(),
  success: colorStringSchema.optional(),
  warning: colorStringSchema.optional(),
  danger: colorStringSchema.optional(),
  contrastTarget: wcagLevelSchema.optional(),
  harmony: colorHarmonySchema.optional(),
  advanced: advancedColorConfigSchema.optional(),
  accessibility: colorAccessibilitySchema.optional(),
}).strict();

/**
 * Zod schema for TypographyReq
 */
const typographyReqSchema = z.object({
  baseSizePx: z.number()
    .min(SECURITY_LIMITS.MIN_BASE_UNIT, `Base size must be >= ${SECURITY_LIMITS.MIN_BASE_UNIT}px`)
    .max(SECURITY_LIMITS.MAX_BASE_UNIT, `Base size must be <= ${SECURITY_LIMITS.MAX_BASE_UNIT}px`),
  ratio: ratioNameSchema,
  lineHeightStrategy: z.enum(['unitless', 'tight', 'loose', 'golden']).optional(),
  fontFamily: z.string().max(500).optional(),
}).strict();

/**
 * Zod schema for SpacingReq
 */
const spacingReqSchema = z.object({
  baseUnitPx: z.number()
    .min(SECURITY_LIMITS.MIN_BASE_UNIT, `Base unit must be >= ${SECURITY_LIMITS.MIN_BASE_UNIT}px`)
    .max(SECURITY_LIMITS.MAX_BASE_UNIT, `Base unit must be <= ${SECURITY_LIMITS.MAX_BASE_UNIT}px`),
  scaleType: mathematicalScaleSchema.optional(),
  scaleRatio: z.number()
    .min(SECURITY_LIMITS.MIN_RATIO, `Scale ratio must be >= ${SECURITY_LIMITS.MIN_RATIO}`)
    .max(SECURITY_LIMITS.MAX_RATIO, `Scale ratio must be <= ${SECURITY_LIMITS.MAX_RATIO}`)
    .optional(),
  steps: z.number()
    .int('Steps must be an integer')
    .min(SECURITY_LIMITS.MIN_STEPS, `Steps must be >= ${SECURITY_LIMITS.MIN_STEPS}`)
    .max(SECURITY_LIMITS.MAX_STEPS, `Steps must be <= ${SECURITY_LIMITS.MAX_STEPS}`),
  minTouchTarget: z.number().min(0).max(100).optional(),
  precision: z.number().int().min(0).max(10).optional(),
  clamp: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
}).strict();

/**
 * Zod schema for BreakpointsReq
 */
const breakpointsReqSchema = z.object({
  xs: z.number()
    .min(SECURITY_LIMITS.MIN_BREAKPOINT)
    .max(SECURITY_LIMITS.MAX_BREAKPOINT),
  sm: z.number()
    .min(SECURITY_LIMITS.MIN_BREAKPOINT)
    .max(SECURITY_LIMITS.MAX_BREAKPOINT),
  md: z.number()
    .min(SECURITY_LIMITS.MIN_BREAKPOINT)
    .max(SECURITY_LIMITS.MAX_BREAKPOINT),
  lg: z.number()
    .min(SECURITY_LIMITS.MIN_BREAKPOINT)
    .max(SECURITY_LIMITS.MAX_BREAKPOINT),
  xl: z.number()
    .min(SECURITY_LIMITS.MIN_BREAKPOINT)
    .max(SECURITY_LIMITS.MAX_BREAKPOINT),
  xxl: z.number()
    .min(SECURITY_LIMITS.MIN_BREAKPOINT)
    .max(SECURITY_LIMITS.MAX_BREAKPOINT)
    .optional(),
}).strict()
  .refine((data) => data.xs < data.sm, { message: 'xs must be < sm' })
  .refine((data) => data.sm < data.md, { message: 'sm must be < md' })
  .refine((data) => data.md < data.lg, { message: 'md must be < lg' })
  .refine((data) => data.lg < data.xl, { message: 'lg must be < xl' })
  .refine((data) => !data.xxl || data.xl < data.xxl, { message: 'xl must be < xxl if xxl is provided' });

/**
 * Zod schema for GridConstraints
 */
const gridConstraintsSchema = z.object({
  minColumns: z.number().int().min(SECURITY_LIMITS.MIN_COLUMNS).max(SECURITY_LIMITS.MAX_COLUMNS).optional(),
  maxColumns: z.number().int().min(SECURITY_LIMITS.MIN_COLUMNS).max(SECURITY_LIMITS.MAX_COLUMNS).optional(),
  preferredAspectRatios: z.array(z.number().positive()).max(20).optional(),
  contentPriorities: z.array(z.number().min(0).max(1)).max(100).optional(),
}).strict();

/**
 * Zod schema for ResponsiveGridConfig
 */
const responsiveGridConfigSchema = z.object({
  fluid: z.boolean().optional(),
  minViewport: z.number().min(1).max(SECURITY_LIMITS.MAX_BREAKPOINT).optional(),
  maxViewport: z.number().min(1).max(SECURITY_LIMITS.MAX_BREAKPOINT).optional(),
  breakpointBehavior: z.enum(['recalculate', 'scale', 'reflow']).optional(),
}).strict();

/**
 * Zod schema for LayoutReq
 */
const layoutReqSchema = z.object({
  gridStyle: z.enum(['simple', 'complex', 'editorial', 'modular', 'radial', 'fibonacci-spiral']).optional(),
  desiredColumns: z.union([z.literal('optimal'), z.number().int().min(SECURITY_LIMITS.MIN_COLUMNS).max(SECURITY_LIMITS.MAX_COLUMNS)]).optional(),
  desiredRows: z.union([z.literal('dynamic'), z.number().int().min(SECURITY_LIMITS.MIN_ROWS).max(SECURITY_LIMITS.MAX_ROWS)]).optional(),
  minColumnPx: z.number().positive().max(10000).optional(),
  maxColumnPx: z.number().positive().max(10000).optional(),
  gap: z.union([z.number().min(0).max(1000), z.literal('fibonacci'), z.literal('golden')]).optional(),
  aspectRatio: z.union([z.literal('1:1'), z.literal('4:3'), z.literal('16:9'), z.literal('golden'), z.number().positive()]).optional(),
  calculationStrategy: z.enum(['optimal-fit', 'mathematical', 'aesthetic']).optional(),
  constraints: gridConstraintsSchema.optional(),
  responsive: responsiveGridConfigSchema.optional(),
}).strict();

/**
 * Zod schema for ZIndexReq
 */
const zIndexReqSchema = z.object({
  layer: z.string().min(1).max(100),
  siblings: z.array(z.string().min(1).max(100)).max(50).optional(),
  base: z.number()
    .int()
    .min(SECURITY_LIMITS.MIN_Z_INDEX)
    .max(SECURITY_LIMITS.MAX_Z_INDEX)
    .optional(),
  increment: z.number().int().min(1).max(1000).optional(),
}).strict();

/**
 * Zod schema for PerfReq
 */
const perfReqSchema = z.object({
  budgetMs: z.number()
    .int()
    .min(1)
    .max(SECURITY_LIMITS.MAX_BUDGET_MS)
    .optional(),
  reducedMotion: z.boolean().optional(),
  minify: z.boolean().optional(),
  lazyCalculation: z.boolean().optional(),
  incremental: z.boolean().optional(),
  memoryBudgetMB: z.number()
    .positive()
    .max(SECURITY_LIMITS.MAX_MEMORY_MB)
    .optional(),
  parallelism: z.union([z.literal('auto'), z.number().int().min(1).max(32)]).optional(),
}).strict();

/**
 * Main Zod schema for CSSRequirements
 */
export const cssRequirementsSchema = z.object({
  design: z.object({
    color: colorIntentSchema,
    typography: typographyReqSchema,
    spacing: spacingReqSchema,
    breakpoints: breakpointsReqSchema,
  }).strict(),
  layout: layoutReqSchema,
  zIndex: zIndexReqSchema.optional(),
  performance: perfReqSchema.optional(),
}).strict();

/**
 * Zod schema for CSSCalculationType
 */
const cssCalculationTypeSchema = z.enum([
  'spacing-system',
  'color-palette',
  'typography-scale',
  'grid-layout',
  'z-index-layer',
  'wcag-contrast',
  'aspect-ratio-grid',
  'responsive-breakpoints',
  'full-design-system',
]);

/**
 * Zod schema for CSSCalculationRequest
 */
export const cssCalculationRequestSchema = z.object({
  type: cssCalculationTypeSchema,
  requirements: cssRequirementsSchema.partial(),
  autoFix: z.boolean().optional(),
  cache: z.boolean().optional(),
}).strict();

/**
 * CSS Validation Engine
 * Provides comprehensive validation with security controls
 */
export class CSSValidationEngine {
  /**
   * Validate CSSRequirements with Zod
   * @param requirements CSS requirements to validate
   * @returns Validation result
   */
  validateRequirements(requirements: unknown): ValidationResult {
    try {
      cssRequirementsSchema.parse(requirements);
      return {
        valid: true,
        errors: [],
        warnings: [],
        suggestions: [],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
          warnings: [],
          suggestions: this.generateSuggestions(error),
        };
      }
      return {
        valid: false,
        errors: ['Unknown validation error occurred'],
        warnings: [],
        suggestions: [],
      };
    }
  }

  /**
   * Validate CSSCalculationRequest with Zod
   * @param request CSS calculation request to validate
   * @returns Validation result
   */
  validateCalculationRequest(request: unknown): ValidationResult {
    try {
      cssCalculationRequestSchema.parse(request);
      return {
        valid: true,
        errors: [],
        warnings: [],
        suggestions: [],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
          warnings: [],
          suggestions: this.generateSuggestions(error),
        };
      }
      return {
        valid: false,
        errors: ['Unknown validation error occurred'],
        warnings: [],
        suggestions: [],
      };
    }
  }

  /**
   * Sanitize and clamp numeric values to safe ranges
   * @param value Input value
   * @param min Minimum allowed value
   * @param max Maximum allowed value
   * @returns Clamped value
   */
  sanitizeNumber(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) {
      throw new Error('Value must be a finite number');
    }
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Sanitize color string (prevent injection)
   * @param color Color string
   * @returns Sanitized color or null if invalid
   */
  sanitizeColor(color: string): string | null {
    try {
      colorStringSchema.parse(color);
      return color;
    } catch {
      return null;
    }
  }

  /**
   * Generate helpful suggestions from Zod errors
   * @param error Zod error
   * @returns Array of suggestions
   */
  private generateSuggestions(error: z.ZodError): string[] {
    const suggestions: string[] = [];
    
    for (const issue of error.errors) {
      const path = issue.path.join('.');
      
      // Suggest valid values for enums
      if (issue.code === 'invalid_enum_value') {
        const enumIssue = issue as z.ZodInvalidEnumValueIssue;
        suggestions.push(
          `For "${path}", valid values are: ${enumIssue.options.join(', ')}`
        );
      }
      
      // Suggest ranges for numbers
      if (issue.code === 'too_small' || issue.code === 'too_big') {
        suggestions.push(
          `Value for "${path}" should be within the specified range`
        );
      }
      
      // Suggest type fixes
      if (issue.code === 'invalid_type') {
        const typeIssue = issue as z.ZodInvalidTypeIssue;
        suggestions.push(
          `"${path}" should be of type "${typeIssue.expected}", received "${typeIssue.received}"`
        );
      }
    }
    
    return suggestions;
  }

  /**
   * Create custom validation rule
   * @param validate Validation function
   * @param message Rule description
   * @param severity Severity level
   * @returns Validation rule
   */
  createRule<T>(
    validate: (value: T) => ValidationResult,
    message: string,
    severity: 'error' | 'warning' | 'info' = 'error'
  ): ValidationRule<T> {
    return {
      validate,
      message,
      severity,
    };
  }

  /**
   * Get security limits
   * @returns Security limits configuration
   */
  getSecurityLimits() {
    return { ...SECURITY_LIMITS };
  }
}

/**
 * Pre-defined validation rules for common scenarios
 */
export class CSSValidationRulesFactory {
  private engine = new CSSValidationEngine();

  /**
   * Color validation rules
   */
  createColorRules(): ValidationRule<ColorIntent>[] {
    return [
      this.engine.createRule<ColorIntent>(
        (color) => {
          const sanitized = this.engine.sanitizeColor(color.primary);
          if (!sanitized) {
            return {
              valid: false,
              errors: ['Primary color is invalid'],
              warnings: [],
              suggestions: ['Use hex (#RGB), rgb(), or hsl() format'],
            };
          }
          return {
            valid: true,
            errors: [],
            warnings: [],
            suggestions: [],
          };
        },
        'Primary color must be valid',
        'error'
      ),
    ];
  }

  /**
   * Typography validation rules
   */
  createTypographyRules(): ValidationRule<TypographyReq>[] {
    return [
      this.engine.createRule<TypographyReq>(
        (typography) => {
          const warnings: string[] = [];
          
          // Warn if base size is very small or very large
          if (typography.baseSizePx < 12) {
            warnings.push('Base font size below 12px may harm readability');
          }
          if (typography.baseSizePx > 24) {
            warnings.push('Base font size above 24px is unusually large');
          }
          
          return {
            valid: true,
            errors: [],
            warnings,
            suggestions: warnings.length > 0 ? ['Consider using 14-18px for body text'] : [],
          };
        },
        'Typography should follow accessibility guidelines',
        'warning'
      ),
    ];
  }

  /**
   * Spacing validation rules
   */
  createSpacingRules(): ValidationRule<SpacingReq>[] {
    return [
      this.engine.createRule<SpacingReq>(
        (spacing) => {
          const errors: string[] = [];
          const warnings: string[] = [];
          
          // Validate base unit
          if (spacing.baseUnitPx < 4) {
            warnings.push('Base unit below 4px may be too granular');
          }
          
          // Validate steps
          if (spacing.steps > 20) {
            warnings.push('More than 20 steps may create an overly complex spacing system');
          }
          
          // Validate clamp if present
          if (spacing.clamp) {
            if (spacing.clamp.min && spacing.clamp.max && spacing.clamp.min >= spacing.clamp.max) {
              errors.push('Clamp min must be less than clamp max');
            }
          }
          
          return {
            valid: errors.length === 0,
            errors,
            warnings,
            suggestions: [],
          };
        },
        'Spacing system should be practical and accessible',
        'warning'
      ),
    ];
  }

  /**
   * Layout validation rules
   */
  createLayoutRules(): ValidationRule<LayoutReq>[] {
    return [
      this.engine.createRule<LayoutReq>(
        (layout) => {
          const errors: string[] = [];
          const warnings: string[] = [];
          
          // Validate column/row constraints
          if (layout.minColumnPx && layout.maxColumnPx && layout.minColumnPx >= layout.maxColumnPx) {
            errors.push('minColumnPx must be less than maxColumnPx');
          }
          
          // Warn about very small columns
          if (layout.minColumnPx && layout.minColumnPx < 50) {
            warnings.push('Columns below 50px may be too narrow for content');
          }
          
          return {
            valid: errors.length === 0,
            errors,
            warnings,
            suggestions: [],
          };
        },
        'Layout should be practical for content',
        'warning'
      ),
    ];
  }

  /**
   * Get all validation rules
   */
  getAllRules(): CSSValidationRules {
    return {
      color: this.createColorRules(),
      typography: this.createTypographyRules(),
      spacing: this.createSpacingRules(),
      layout: this.createLayoutRules(),
    };
  }
}

/**
 * Singleton instance of validation engine
 */
let validationEngineInstance: CSSValidationEngine | null = null;

/**
 * Get or create validation engine instance
 * @returns CSSValidationEngine instance
 */
export function getValidationEngine(): CSSValidationEngine {
  if (!validationEngineInstance) {
    validationEngineInstance = new CSSValidationEngine();
  }
  return validationEngineInstance;
}

/**
 * Export security limits for reference
 */
export { SECURITY_LIMITS };
