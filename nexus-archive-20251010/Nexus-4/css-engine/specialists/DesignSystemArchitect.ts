/**
 * DesignSystemArchitect - Master Orchestrator
 * Coordinates ColorScientist, TypographyArchitect, and SpatialEngineer
 * 
 * @module DesignSystemArchitect
 * @version 1.0.0
 * @architecture Parallel orchestration with resilience
 */

import type { 
  Specialist, 
  DesignDNA, 
  DesignPackage, 
  CompileOptions,
  ColorFacts,
  TypeFacts,
  SpatialFacts,
  SynthesisInput,
  PerformanceMetrics
} from '../contracts.js';
import { ColorScientist } from './ColorScientist.js';
import { TypographyArchitect } from './TypographyArchitect.js';
import { SpatialEngineer } from './SpatialEngineer.js';
import { stableKey } from '../utils/stableKey.js';

/**
 * DesignSystemArchitect - Master orchestrator
 * 
 * Responsibilities:
 * - Coordinate all three specialists in parallel
 * - Handle specialist failures gracefully (Promise.allSettled)
 * - Synthesize outputs into coherent design system
 * - Generate Tailwind v4 CSS (@theme format)
 * - Manage performance budgets (200ms total)
 * - Provide comprehensive diagnostics
 * 
 * Philosophy: Resilient, fast, deterministic
 */
export class DesignSystemArchitect implements Specialist<DesignDNA, DesignPackage> {
  readonly id = 'design-system-architect';
  readonly timeoutMs = 200; // Total budget for all specialists

  private colorScientist: ColorScientist;
  private typographyArchitect: TypographyArchitect;
  private spatialEngineer: SpatialEngineer;

  constructor() {
    this.colorScientist = new ColorScientist();
    this.typographyArchitect = new TypographyArchitect();
    this.spatialEngineer = new SpatialEngineer();
  }

  /**
   * Main orchestration method
   * Runs all specialists in parallel and synthesizes results
   * 
   * @param dna Design DNA (normalized input)
   * @param opts Compilation options
   * @returns Complete design package
   */
  async run(dna: DesignDNA, opts: CompileOptions): Promise<DesignPackage> {
    const startTime = performance.now();
    const metrics: PerformanceMetrics = { total: 0 };

    try {
      // 1. Generate cache key for memoization
      const cacheKey = stableKey({ dna, opts });

      // 2. Run all specialists in parallel (Promise.allSettled for resilience)
      const perceptionStart = performance.now();
      const [colorResult, typeResult, spatialResult] = await Promise.allSettled([
        this.colorScientist.run(dna, opts),
        this.typographyArchitect.run(dna, opts),
        this.spatialEngineer.run(dna, opts),
      ]);
      metrics.perception = performance.now() - perceptionStart;

      // 3. Synthesize results
      const synthesisStart = performance.now();
      const synthesis: SynthesisInput = {
        color: colorResult,
        type: typeResult,
        spatial: spatialResult,
      };
      
      const designPackage = this.synthesize(synthesis, opts, cacheKey);
      metrics.synthesis = performance.now() - synthesisStart;

      // 4. Add performance metrics
      metrics.total = performance.now() - startTime;
      designPackage.diagnostics.timings = {
        perception: metrics.perception,
        synthesis: metrics.synthesis,
        total: metrics.total,
      };

      // 5. Add specialist timings
      if (colorResult.status === 'fulfilled') {
        designPackage.diagnostics.timings.colorScientist = 
          colorResult.value ? metrics.perception / 3 : 0;
      }
      if (typeResult.status === 'fulfilled') {
        designPackage.diagnostics.timings.typographyArchitect = 
          typeResult.value ? metrics.perception / 3 : 0;
      }
      if (spatialResult.status === 'fulfilled') {
        designPackage.diagnostics.timings.spatialEngineer = 
          spatialResult.value ? metrics.perception / 3 : 0;
      }

      return designPackage;
    } catch (error) {
      throw new Error(`DesignSystemArchitect failed: ${(error as Error).message}`);
    }
  }

  /**
   * Synthesize specialist outputs into coherent design package
   * Handles partial failures gracefully
   * 
   * @param synthesis Specialist results (settled promises)
   * @param opts Compilation options
   * @param cacheKey Stable cache key
   * @returns Design package
   */
  private synthesize(
    synthesis: SynthesisInput,
    opts: CompileOptions,
    cacheKey: string
  ): DesignPackage {
    const diagnostics = {
      notes: [] as string[],
      audits: [] as Array<{ check: string; pass: boolean; details?: unknown }>,
      timings: {} as Record<string, number>,
    };

    // Extract successful results
    const colorFacts = synthesis.color.status === 'fulfilled' ? synthesis.color.value : null;
    const typeFacts = synthesis.type.status === 'fulfilled' ? synthesis.type.value : null;
    const spatialFacts = synthesis.spatial.status === 'fulfilled' ? synthesis.spatial.value : null;

    // Handle failures
    if (synthesis.color.status === 'rejected') {
      diagnostics.notes.push(`⚠️ ColorScientist failed: ${synthesis.color.reason}`);
    }
    if (synthesis.type.status === 'rejected') {
      diagnostics.notes.push(`⚠️ TypographyArchitect failed: ${synthesis.type.reason}`);
    }
    if (synthesis.spatial.status === 'rejected') {
      diagnostics.notes.push(`⚠️ SpatialEngineer failed: ${synthesis.spatial.reason}`);
    }

    // Build tokens with proper naming
    const tokens = {
      color: this.formatColorTokens(colorFacts?.ramp ?? {}),
      spacing: spatialFacts?.spacing ?? {},
      typography: typeFacts?.steps ?? {},
      breakpoints: spatialFacts?.breakpoints ?? {},
      elevation: this.generateElevation(),
      animation: this.generateAnimation(opts.reducedMotion),
    };

    // Add success notes
    if (colorFacts) {
      diagnostics.notes.push(`✅ Generated ${Object.keys(colorFacts.ramp).length} color shades`);
    }
    if (typeFacts) {
      diagnostics.notes.push(`✅ Generated ${Object.keys(typeFacts.steps).length} typography sizes (ratio: ${typeFacts.ratio})`);
    }
    if (spatialFacts) {
      diagnostics.notes.push(`✅ Generated ${Object.keys(spatialFacts.spacing).length} spacing values`);
      diagnostics.notes.push(`✅ Grid: ${spatialFacts.grid.columns} columns, ${spatialFacts.grid.minColPx}-${spatialFacts.grid.maxColPx}px`);
    }

    // Add color audits
    if (colorFacts?.audits) {
      colorFacts.audits.forEach(audit => {
        diagnostics.audits.push({
          check: `contrast-ratio`,
          pass: audit.pass,
          details: {
            foreground: audit.pair[0],
            background: audit.pair[1],
            ratio: audit.ratio.toFixed(2),
            level: audit.level,
          },
        });
      });
    }

    // Generate CSS
    const cssVariables = this.generateCSSVariables(tokens, typeFacts, spatialFacts);
    const tailwindV4CSS = this.generateTailwindV4CSS(tokens, typeFacts, spatialFacts);

    // Generate documentation
    const docs = this.generateDocs(tokens, colorFacts, typeFacts, spatialFacts);

    return {
      tokens,
      css: tailwindV4CSS,  // Add 'css' as primary property
      cssVariables,        // Keep for backward compatibility
      tailwindV4CSS,       // Keep for backward compatibility
      docs,
      diagnostics,
      cacheKey,
    };
  }

  /**
   * Format color tokens with proper naming (primary-50, primary-100, etc.)
   * 
   * @param ramp Color ramp from ColorScientist
   * @returns Formatted color tokens
   */
  private formatColorTokens(ramp: Record<string, string>): Record<string, string> {
    const formatted: Record<string, string> = {};
    
    Object.entries(ramp).forEach(([key, value]) => {
      // Only add primary- prefix if not already prefixed
      if (key.startsWith('primary-') || key.includes('-')) {
        formatted[key] = value;  // Already has prefix or is special (on-light, etc.)
      } else {
        formatted[`primary-${key}`] = value;  // Add prefix: "50" -> "primary-50"
      }
    });
    
    return formatted;
  }

  /**
   * Generate CSS custom properties (Tailwind v4 @theme format)
   * 
   * @param tokens Design tokens
   * @param typeFacts Typography facts
   * @param spatialFacts Spatial facts
   * @returns CSS @theme block
   */
  private generateCSSVariables(
    tokens: any,
    typeFacts: TypeFacts | null,
    spatialFacts: SpatialFacts | null
  ): string {
    const lines = ['@theme {'];

    // Colors
    if (Object.keys(tokens.color).length > 0) {
      lines.push('  /* Colors */');
      Object.entries(tokens.color).forEach(([key, value]) => {
        // Key already has 'primary-' prefix from formatColorTokens
        lines.push(`  --color-${key}: ${value};`);
      });
      lines.push('');
    }

    // Typography
    if (Object.keys(tokens.typography).length > 0) {
      lines.push('  /* Typography */');
      Object.entries(tokens.typography).forEach(([key, value]) => {
        lines.push(`  --font-size-${key}: ${value}px;`);
      });
      
      // Fluid typography
      if (typeFacts?.fluidSteps) {
        lines.push('');
        lines.push('  /* Fluid Typography */');
        Object.entries(typeFacts.fluidSteps).forEach(([key, value]) => {
          lines.push(`  --font-size-${key}-fluid: ${value};`);
        });
      }
      
      // Line heights
      if (typeFacts?.leading) {
        lines.push('');
        lines.push('  /* Line Heights */');
        lines.push(`  --leading: ${typeFacts.leading};`);
      }
      lines.push('');
    }

    // Spacing
    if (Object.keys(tokens.spacing).length > 0) {
      lines.push('  /* Spacing */');
      Object.entries(tokens.spacing).forEach(([key, value]) => {
        lines.push(`  --spacing-${key}: ${value}rem;`);
      });
      lines.push('');
    }

    // Breakpoints
    if (Object.keys(tokens.breakpoints).length > 0) {
      lines.push('  /* Breakpoints */');
      Object.entries(tokens.breakpoints).forEach(([key, value]) => {
        lines.push(`  --breakpoint-${key}: ${value}px;`);
      });
      lines.push('');
    }

    // Grid
    if (spatialFacts?.grid) {
      lines.push('  /* Grid */');
      lines.push(`  --grid-columns: ${spatialFacts.grid.columns};`);
      lines.push('');
    }

    // Elevation
    if (Object.keys(tokens.elevation).length > 0) {
      lines.push('  /* Elevation (shadows) */');
      Object.entries(tokens.elevation).forEach(([key, value]) => {
        lines.push(`  --shadow-${key}: ${value};`);
      });
      lines.push('');
    }

    // Animation
    if (Object.keys(tokens.animation).length > 0) {
      lines.push('  /* Animation */');
      Object.entries(tokens.animation).forEach(([key, value]) => {
        lines.push(`  --${key}: ${value};`);
      });
    }

    lines.push('}');
    return lines.join('\n');
  }

  /**
   * Generate full Tailwind v4 CSS with utility classes
   * 
   * @param tokens Design tokens
   * @param typeFacts Typography facts
   * @param spatialFacts Spatial facts
   * @returns Full CSS output
   */
  private generateTailwindV4CSS(
    tokens: any,
    typeFacts: TypeFacts | null,
    spatialFacts: SpatialFacts | null
  ): string {
    const css = [this.generateCSSVariables(tokens, typeFacts, spatialFacts)];

    // Add utility classes
    css.push('');
    css.push('/* Utility Classes */');
    
    // Color utilities
    if (Object.keys(tokens.color).length > 0) {
      css.push('.text-primary { color: var(--color-primary-500); }');
      css.push('.bg-primary { background-color: var(--color-primary-500); }');
      css.push('.border-primary { border-color: var(--color-primary-500); }');
    }

    return css.join('\n');
  }

  /**
   * Generate elevation (shadow) scale
   * 
   * @returns Elevation tokens
   */
  private generateElevation(): Record<string, string> {
    return {
      'none': 'none',
      'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      'base': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    };
  }

  /**
   * Generate animation tokens
   * Respects prefers-reduced-motion
   * 
   * @param reducedMotion Whether to reduce motion
   * @returns Animation tokens
   */
  private generateAnimation(reducedMotion?: boolean): Record<string, string> {
    const duration = reducedMotion ? '0.01ms' : '150ms';
    const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';

    return {
      'duration-fast': reducedMotion ? '0.01ms' : '100ms',
      'duration-base': duration,
      'duration-slow': reducedMotion ? '0.01ms' : '300ms',
      'easing': easing,
    };
  }

  /**
   * Generate documentation for the design system
   * 
   * @param tokens Design tokens
   * @param colorFacts Color facts
   * @param typeFacts Typography facts
   * @param spatialFacts Spatial facts
   * @returns Markdown documentation
   */
  private generateDocs(
    tokens: any,
    colorFacts: ColorFacts | null,
    typeFacts: TypeFacts | null,
    spatialFacts: SpatialFacts | null
  ): string {
    const lines = ['# Design System'];
    lines.push('');
    lines.push('Generated by NEXUS CSS Engine');
    lines.push('');

    // Colors
    if (colorFacts) {
      lines.push('## Colors');
      lines.push('');
      lines.push(`Color space: ${colorFacts.colorSpace.toUpperCase()}`);
      lines.push(`Primary: ${colorFacts.primary}`);
      lines.push(`Shades: ${Object.keys(colorFacts.ramp).length}`);
      lines.push('');
    }

    // Typography
    if (typeFacts) {
      lines.push('## Typography');
      lines.push('');
      lines.push(`Base size: ${typeFacts.base}px`);
      lines.push(`Scale ratio: ${typeFacts.ratio}`);
      lines.push(`Leading: ${typeFacts.leading}`);
      lines.push('');
    }

    // Spacing
    if (spatialFacts) {
      lines.push('## Spacing');
      lines.push('');
      lines.push(`Spacing values: ${Object.keys(spatialFacts.spacing).length}`);
      lines.push(`Grid: ${spatialFacts.grid.columns} columns`);
      lines.push(`Breakpoints: ${Object.keys(spatialFacts.breakpoints).length}`);
      lines.push('');
    }

    return lines.join('\n');
  }
}

/**
 * Factory function for DesignSystemArchitect
 * 
 * @returns DesignSystemArchitect instance
 */
export function createDesignSystemArchitect(): DesignSystemArchitect {
  return new DesignSystemArchitect();
}
