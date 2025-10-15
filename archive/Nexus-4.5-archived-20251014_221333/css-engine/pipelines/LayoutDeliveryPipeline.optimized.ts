/**
 * Layout Delivery Pipeline — Optimized
 *
 * Purpose
 *  - Compute a responsive layout matrix per breakpoint (columns, gutters, margins, column widths)
 *  - Provide CSS variable output (as tokens) and Tailwind-friendly fragments
 *  - Integrate cleanly with a DesignSystemArchitect via DesignDNA
 *
 * Highlights (vs. baseline)
 *  - Computes per‑breakpoint column widths (not just one for the largest bp)
 *  - Adds container widths and emits CSS variables + @media blocks
 *  - Implements a real HYBRID mode (fixed columns, fluid gutters/margins)
 *  - Uses base‑unit rounding with clamping so gutters/margins never explode on ultrawide screens
 *  - Validates more invariants (container ≥ 0, column ≥ baseUnit, etc.)
 * 
 * Sprint 2+ Enhancement: Production-ready with per-breakpoint metrics
 */

import { LayoutAlgorithmist } from '../specialists/LayoutAlgorithmist.js';
import type { DesignDNA } from '../contracts.js';

/** Layout strategy options */
export type LayoutStrategy = 'fluid' | 'fixed' | 'hybrid' | 'auto';

/** Breakpoint configuration */
export interface Breakpoint {
  name: string;
  width: number; // nominal viewport width representative of the breakpoint
  columns: number;
  gutter: number; // px unless emitting as clamp() in CSS
  margin: number; // px unless emitting as clamp() in CSS
}

/** Per‑breakpoint computed metrics */
export interface ComputedMetrics {
  containerWidth: number; // width - 2*margin
  columnWidth: number; // (container - totalGutters) / columns
  totalGutters: number; // gutter * (columns - 1)
  /** Guard: was the value clamped to keep 
   *  columnWidth ≥ baseUnit and container ≥ 0? */
  clamped?: boolean;
}

/** Layout matrix for responsive systems */
export interface LayoutMatrix {
  strategy: LayoutStrategy;
  breakpoints: Breakpoint[];
  baseUnit: number;
  /** The columnWidth used by the largest breakpoint (kept for backward compat). */
  columnWidth: number;
  /** Nominal max viewport among breakpoints. */
  maxWidth: number;
  /** Nominal min viewport among breakpoints. */
  minWidth: number;
  /** Per‑breakpoint computed metrics keyed by breakpoint name. */
  computed: Record<string, ComputedMetrics>;
}

/** Pipeline configuration */
export interface PipelineConfig {
  layoutStrategy?: LayoutStrategy;
  customBreakpoints?: Breakpoint[];
  baseUnit?: number; // NEW: allow overriding the base 8px unit
  enableFluidTypography?: boolean; // (reserved) hook for type system
  enableResponsiveSpacing?: boolean; // (reserved) hook for spacing scale
  /** Optional clamp guards for fluid/hybrid gutters & margins */
  fluidClamp?: {
    gutterMin?: number; // px
    gutterMax?: number; // px
    marginMin?: number; // px
    marginMax?: number; // px
  };
}

export class LayoutDeliveryPipeline {
  private layoutAlgorithmist: LayoutAlgorithmist;

  constructor() {
    this.layoutAlgorithmist = new LayoutAlgorithmist();
  }

  /**
   * Generate layout matrix from design DNA and strategy
   */
  async generateLayoutMatrix(
    dna: DesignDNA,
    config: PipelineConfig = {}
  ): Promise<LayoutMatrix> {
    const strategy = config.layoutStrategy || this.recommendStrategy(dna);
    const baseUnit = config.baseUnit || 8;
    
    // Use custom breakpoints or generate defaults
    const breakpoints = config.customBreakpoints || this.generateDefaultBreakpoints(strategy, config);
    
    // Compute per-breakpoint metrics
    const computed: Record<string, ComputedMetrics> = {};
    for (const bp of breakpoints) {
      computed[bp.name] = this.computeBreakpointMetrics(bp, baseUnit);
    }
    
    // Use largest breakpoint for backward compat columnWidth
    const largestBp = breakpoints[breakpoints.length - 1];
    const columnWidth = computed[largestBp.name].columnWidth;
    
    return {
      strategy,
      breakpoints,
      baseUnit,
      columnWidth,
      maxWidth: Math.max(...breakpoints.map(bp => bp.width)),
      minWidth: Math.min(...breakpoints.map(bp => bp.width)),
      computed
    };
  }

  /**
   * Compute metrics for a single breakpoint
   */
  private computeBreakpointMetrics(bp: Breakpoint, baseUnit: number): ComputedMetrics {
    const containerWidth = Math.max(0, bp.width - 2 * bp.margin);
    const totalGutters = bp.gutter * (bp.columns - 1);
    
    let columnWidth = (containerWidth - totalGutters) / bp.columns;
    let clamped = false;
    
    // Ensure column width is at least baseUnit
    if (columnWidth < baseUnit) {
      columnWidth = baseUnit;
      clamped = true;
    }
    
    // Round to base unit
    columnWidth = Math.round(columnWidth / baseUnit) * baseUnit;
    
    return {
      containerWidth,
      columnWidth,
      totalGutters,
      clamped
    };
  }

  /**
   * Generate default responsive breakpoints based on strategy
   */
  private generateDefaultBreakpoints(strategy: LayoutStrategy, config: PipelineConfig): Breakpoint[] {
    const { fluidClamp } = config;
    
    const defaults: Breakpoint[] = [
      {
        name: 'mobile',
        width: 360,
        columns: 4,
        gutter: 16,
        margin: 16
      },
      {
        name: 'tablet',
        width: 768,
        columns: 8,
        gutter: 24,
        margin: 32
      },
      {
        name: 'desktop',
        width: 1024,
        columns: 12,
        gutter: 24,
        margin: 48
      },
      {
        name: 'wide',
        width: 1440,
        columns: 12,
        gutter: 32,
        margin: 64
      }
    ];

    if (strategy === 'fixed') {
      // Fixed layouts use consistent columns and spacing
      return defaults.map(bp => ({ ...bp, columns: 12 }));
    } else if (strategy === 'fluid') {
      // Fluid layouts scale gutters proportionally with clamps
      return defaults.map(bp => {
        let gutter = Math.round(bp.width * 0.03); // 3% of viewport
        let margin = Math.round(bp.width * 0.04); // 4% of viewport
        
        // Apply clamps if provided
        if (fluidClamp) {
          if (fluidClamp.gutterMin !== undefined) gutter = Math.max(gutter, fluidClamp.gutterMin);
          if (fluidClamp.gutterMax !== undefined) gutter = Math.min(gutter, fluidClamp.gutterMax);
          if (fluidClamp.marginMin !== undefined) margin = Math.max(margin, fluidClamp.marginMin);
          if (fluidClamp.marginMax !== undefined) margin = Math.min(margin, fluidClamp.marginMax);
        }
        
        return { ...bp, gutter, margin };
      });
    } else if (strategy === 'hybrid') {
      // Hybrid: fixed columns, fluid gutters/margins with clamps
      return defaults.map(bp => {
        let gutter = Math.round(bp.width * 0.025); // 2.5% of viewport
        let margin = Math.round(bp.width * 0.035); // 3.5% of viewport
        
        // Apply clamps
        if (fluidClamp) {
          if (fluidClamp.gutterMin !== undefined) gutter = Math.max(gutter, fluidClamp.gutterMin);
          if (fluidClamp.gutterMax !== undefined) gutter = Math.min(gutter, fluidClamp.gutterMax);
          if (fluidClamp.marginMin !== undefined) margin = Math.max(margin, fluidClamp.marginMin);
          if (fluidClamp.marginMax !== undefined) margin = Math.min(margin, fluidClamp.marginMax);
        }
        
        return { 
          ...bp, 
          columns: 12, // Fixed columns for hybrid
          gutter, 
          margin 
        };
      });
    }

    return defaults;
  }

  /**
   * Integrate layout matrix into design DNA
   */
  integrateLayoutIntoDNA(dna: DesignDNA, matrix: LayoutMatrix): DesignDNA & { layout: any } {
    return {
      ...dna,
      layout: {
        strategy: matrix.strategy,
        breakpoints: matrix.breakpoints,
        baseUnit: matrix.baseUnit,
        columnWidth: matrix.columnWidth,
        maxWidth: matrix.maxWidth,
        gridSystem: this.generateGridTokens(matrix)
      }
    };
  }

  /**
   * Generate CSS custom property tokens
   */
  generateGridTokens(matrix: LayoutMatrix): Record<string, string> {
    const tokens: Record<string, string> = {
      'grid-base-unit': `${matrix.baseUnit}px`,
      'grid-column-width': `${matrix.columnWidth}px`,
      'grid-max-width': `${matrix.maxWidth}px`
    };

    // Generate per-breakpoint tokens
    matrix.breakpoints.forEach(bp => {
      const prefix = `grid-${bp.name}`;
      const metrics = matrix.computed[bp.name];
      
      tokens[`${prefix}-columns`] = String(bp.columns);
      tokens[`${prefix}-gutter`] = `${bp.gutter}px`;
      tokens[`${prefix}-margin`] = `${bp.margin}px`;
      tokens[`${prefix}-width`] = `${bp.width}px`;
      tokens[`${prefix}-container`] = `${metrics.containerWidth}px`;
      tokens[`${prefix}-column-width`] = `${metrics.columnWidth}px`;
    });

    return tokens;
  }

  /**
   * Emit CSS with :root variables and @media queries
   */
  emitCSS(matrix: LayoutMatrix, options: { selector?: string } = {}): string {
    const selector = options.selector || ':root';
    let css = `${selector} {\n`;
    
    // Base tokens (using mobile as default)
    const mobileBp = matrix.breakpoints[0];
    const mobileMetrics = matrix.computed[mobileBp.name];
    
    css += `  --grid-base-unit: ${matrix.baseUnit}px;\n`;
    css += `  --grid-columns: ${mobileBp.columns};\n`;
    css += `  --grid-gutter: ${mobileBp.gutter}px;\n`;
    css += `  --grid-margin: ${mobileBp.margin}px;\n`;
    css += `  --grid-container: ${mobileMetrics.containerWidth}px;\n`;
    css += `  --grid-column-width: ${mobileMetrics.columnWidth}px;\n`;
    css += `}\n\n`;
    
    // Breakpoint-specific overrides
    for (let i = 1; i < matrix.breakpoints.length; i++) {
      const bp = matrix.breakpoints[i];
      const metrics = matrix.computed[bp.name];
      
      css += `@media (min-width: ${bp.width}px) {\n`;
      css += `  ${selector} {\n`;
      css += `    --grid-columns: ${bp.columns};\n`;
      css += `    --grid-gutter: ${bp.gutter}px;\n`;
      css += `    --grid-margin: ${bp.margin}px;\n`;
      css += `    --grid-container: ${metrics.containerWidth}px;\n`;
      css += `    --grid-column-width: ${metrics.columnWidth}px;\n`;
      css += `  }\n`;
      css += `}\n\n`;
    }
    
    return css;
  }

  /**
   * Generate Tailwind config fragments
   */
  toTailwindFragments(matrix: LayoutMatrix): {
    screens: Record<string, string>;
    container: Record<string, any>;
  } {
    const screens: Record<string, string> = {};
    const container: Record<string, any> = {
      center: true,
      padding: {}
    };
    
    matrix.breakpoints.forEach(bp => {
      screens[bp.name] = `${bp.width}px`;
      container.padding[bp.name] = `${bp.margin}px`;
    });
    
    return { screens, container };
  }

  /**
   * Validate layout matrix
   */
  validateMatrix(matrix: LayoutMatrix): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check breakpoints are ascending
    for (let i = 1; i < matrix.breakpoints.length; i++) {
      if (matrix.breakpoints[i].width <= matrix.breakpoints[i - 1].width) {
        errors.push(
          `Breakpoint ${matrix.breakpoints[i].name} width must be greater than ${matrix.breakpoints[i - 1].name}`
        );
      }
    }

    // Check column counts are reasonable
    matrix.breakpoints.forEach(bp => {
      if (bp.columns < 1 || bp.columns > 24) {
        errors.push(`Breakpoint ${bp.name} column count (${bp.columns}) must be between 1 and 24`);
      }
    });

    // Check gutters and margins are positive
    matrix.breakpoints.forEach(bp => {
      if (bp.gutter < 0 || bp.margin < 0) {
        errors.push(`Breakpoint ${bp.name} gutter and margin must be non-negative`);
      }
    });

    // Check computed metrics are valid
    Object.entries(matrix.computed).forEach(([name, metrics]) => {
      if (metrics.containerWidth < 0) {
        errors.push(`Breakpoint ${name} container width is negative (margins too large)`);
      }
      if (metrics.columnWidth < matrix.baseUnit) {
        errors.push(`Breakpoint ${name} column width (${metrics.columnWidth}px) is below base unit (${matrix.baseUnit}px)`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get layout strategy recommendation based on DNA
   */
  recommendStrategy(dna: DesignDNA): LayoutStrategy {
    // Check for breakpoints as indicator of responsive design
    if (dna.constraints?.breakpoints && Object.keys(dna.constraints.breakpoints).length > 0) {
      return 'fluid';
    }
    
    // Default to hybrid for balanced approach
    return 'hybrid';
  }
}

/**
 * Factory function for creating layout pipeline
 */
export function createLayoutPipeline(): LayoutDeliveryPipeline {
  return new LayoutDeliveryPipeline();
}

// Export singleton instance
export const layoutPipeline = new LayoutDeliveryPipeline();
