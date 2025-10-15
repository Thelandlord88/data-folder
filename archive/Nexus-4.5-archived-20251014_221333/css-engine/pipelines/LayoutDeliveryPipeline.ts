/**
 * Layout Delivery Pipeline
 * 
 * Orchestrates LayoutAlgorithmist output → DesignSystemArchitect
 * Provides layout matrix integration for responsive grid systems
 * 
 * Sprint 2 Deliverable: Stellar + SpatialEngineer
 */

import { LayoutAlgorithmist } from '../specialists/LayoutAlgorithmist.js';
import type { DesignDNA } from '../types/design-system.types.js';

/**
 * Layout strategy options
 */
export type LayoutStrategy = 'fluid' | 'fixed' | 'hybrid' | 'auto';

/**
 * Breakpoint configuration
 */
export interface Breakpoint {
  name: string;
  width: number;
  columns: number;
  gutter: number;
  margin: number;
}

/**
 * Layout matrix for responsive systems
 */
export interface LayoutMatrix {
  strategy: LayoutStrategy;
  breakpoints: Breakpoint[];
  baseUnit: number;
  columnWidth: number;
  maxWidth: number;
  minWidth: number;
}

/**
 * Pipeline configuration
 */
export interface PipelineConfig {
  layoutStrategy?: LayoutStrategy;
  customBreakpoints?: Breakpoint[];
  enableFluidTypography?: boolean;
  enableResponsiveSpacing?: boolean;
}

/**
 * Layout Delivery Pipeline
 * 
 * Computes optimal layout matrix and integrates with design system generation
 */
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
    const strategy = config.layoutStrategy || 'auto';
    
    // Use custom breakpoints or generate default responsive breakpoints
    const breakpoints = config.customBreakpoints || this.generateDefaultBreakpoints(strategy);
    
    // Calculate optimal column width and gutters based on golden ratio
    const baseUnit = 8; // 8px grid system
    const goldenRatio = 1.618;
    
    // Compute column width using layout algorithm
    const columnWidth = await this.computeOptimalColumnWidth(breakpoints, baseUnit);
    
    return {
      strategy,
      breakpoints,
      baseUnit,
      columnWidth,
      maxWidth: Math.max(...breakpoints.map(bp => bp.width)),
      minWidth: Math.min(...breakpoints.map(bp => bp.width))
    };
  }

  /**
   * Generate default responsive breakpoints
   */
  private generateDefaultBreakpoints(strategy: LayoutStrategy): Breakpoint[] {
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

    // Adjust based on strategy
    if (strategy === 'fixed') {
      // Fixed layouts use consistent columns
      return defaults.map(bp => ({ ...bp, columns: 12 }));
    } else if (strategy === 'fluid') {
      // Fluid layouts scale gutters proportionally
      return defaults.map(bp => ({
        ...bp,
        gutter: Math.round(bp.width * 0.03), // 3% of viewport
        margin: Math.round(bp.width * 0.04)  // 4% of viewport
      }));
    }

    return defaults;
  }

  /**
   * Compute optimal column width using LayoutAlgorithmist
   */
  private async computeOptimalColumnWidth(
    breakpoints: Breakpoint[],
    baseUnit: number
  ): Promise<number> {
    // Use largest breakpoint as reference
    const largestBp = breakpoints.reduce((max, bp) => 
      bp.width > max.width ? bp : max
    , breakpoints[0]);

    // Calculate column width: (viewport - margins - gutters) / columns
    const availableWidth = largestBp.width - (largestBp.margin * 2);
    const gutterSpace = largestBp.gutter * (largestBp.columns - 1);
    const columnWidth = (availableWidth - gutterSpace) / largestBp.columns;

    // Round to nearest base unit
    return Math.round(columnWidth / baseUnit) * baseUnit;
  }

  /**
   * Integrate layout matrix into design DNA
   * This method is called by DesignSystemArchitect
   */
  integrateLayoutIntoDNA(dna: DesignDNA, matrix: LayoutMatrix): DesignDNA {
    return {
      ...dna,
      layout: {
        strategy: matrix.strategy,
        breakpoints: matrix.breakpoints,
        baseUnit: matrix.baseUnit,
        columnWidth: matrix.columnWidth,
        maxWidth: matrix.maxWidth,
        gridSystem: this.generateGridCSS(matrix)
      }
    };
  }

  /**
   * Generate CSS grid system tokens
   */
  private generateGridCSS(matrix: LayoutMatrix): Record<string, string> {
    const css: Record<string, string> = {
      'grid-base-unit': `${matrix.baseUnit}px`,
      'grid-column-width': `${matrix.columnWidth}px`,
      'grid-max-width': `${matrix.maxWidth}px`
    };

    // Generate breakpoint-specific grid values
    matrix.breakpoints.forEach(bp => {
      const prefix = `grid-${bp.name}`;
      css[`${prefix}-columns`] = String(bp.columns);
      css[`${prefix}-gutter`] = `${bp.gutter}px`;
      css[`${prefix}-margin`] = `${bp.margin}px`;
      css[`${prefix}-width`] = `${bp.width}px`;
    });

    return css;
  }

  /**
   * Validate layout matrix
   */
  validateMatrix(matrix: LayoutMatrix): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check breakpoints are ascending
    for (let i = 1; i < matrix.breakpoints.length; i++) {
      if (matrix.breakpoints[i].width <= matrix.breakpoints[i - 1].width) {
        errors.push(`Breakpoint ${matrix.breakpoints[i].name} width must be greater than previous breakpoint`);
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
        errors.push(`Breakpoint ${bp.name} gutter and margin must be positive`);
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
    // Analyze DNA constraints to recommend optimal strategy
    if (dna.constraints?.fixedWidth) {
      return 'fixed';
    } else if (dna.constraints?.responsive === true) {
      return 'fluid';
    } else if (dna.constraints?.hybrid === true) {
      return 'hybrid';
    }
    
    return 'auto';
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
