/**
 * TypographyArchitect Specialist
 * Applies mathematical typography systems without aesthetic bias
 * 
 * @module TypographyArchitect
 * @version 1.0.0
 * @architecture Scientific processing - modular scales, fluid sizing
 */

import type { Specialist, DesignDNA, TypeFacts, CompileOptions } from '../contracts.js';

/**
 * Typography scale ratios
 * Based on musical intervals and mathematical harmony
 */
export const SCALE_RATIOS = {
  minorSecond: 1.067,      // 15:16
  majorSecond: 1.125,      // 8:9
  minorThird: 1.2,         // 5:6
  majorThird: 1.25,        // 4:5
  perfectFourth: 1.333,    // 3:4 (most versatile)
  augmentedFourth: 1.414,  // √2 (tritone)
  perfectFifth: 1.5,       // 2:3
  golden: 1.618,           // φ (golden ratio)
} as const;

export type ScaleRatio = keyof typeof SCALE_RATIOS;

/**
 * Typography scale names
 * Semantic naming from smallest to largest
 */
export const SCALE_NAMES = [
  'xs',    // Extra small
  'sm',    // Small
  'base',  // Base/body text
  'lg',    // Large
  'xl',    // Extra large
  '2xl',   // 2x extra large
  '3xl',   // 3x extra large
  '4xl',   // 4x extra large
  '5xl',   // 5x extra large
] as const;

export type ScaleName = typeof SCALE_NAMES[number];

/**
 * TypographyArchitect - Mathematical typography system specialist
 * 
 * Responsibilities:
 * - Generate modular scales based on musical intervals
 * - Create fluid typography (viewport-responsive sizing)
 * - Calculate optimal line heights
 * - Apply optical sizing adjustments
 * - Generate letter spacing (tracking)
 * 
 * Style-Agnostic: Works with ANY aesthetic (brutalist, elegant, modern, etc.)
 */
export class TypographyArchitect implements Specialist<DesignDNA, TypeFacts> {
  readonly id = 'typography-architect';
  readonly timeoutMs = 80;

  /**
   * Process design DNA and generate typography facts
   * 
   * @param dna Design DNA (normalized input)
   * @param opts Compilation options
   * @returns Typography facts (scales, fluid sizing)
   */
  async run(dna: DesignDNA, opts: CompileOptions): Promise<TypeFacts> {
    const t0 = performance.now();

    try {
      // 1. Extract base size (default: 16px)
      const base = dna.constraints?.baseTypePx ?? 16;
      
      // 2. Select scale ratio (default: perfectFourth)
      const ratioName = dna.constraints?.typeRatio ?? 'perfectFourth';
      const ratio = this.getRatio(ratioName);
      
      // 3. Generate modular scale
      const steps = this.generateModularScale(base, ratio);
      
      // 4. Generate fluid typography (clamp)
      const fluidSteps = this.generateFluidScale(steps, 320, 1920);
      
      // 5. Calculate line heights
      const leading = this.calculateLineHeight(base);
      
      // 6. Generate tracking (letter spacing)
      const tracking = this.generateTracking(steps);

      const elapsed = performance.now() - t0;
      
      return {
        base,
        ratio,
        steps,
        fluidSteps,
        leading,
        tracking,
      };
    } catch (error) {
      throw new Error(`TypographyArchitect failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get ratio value from name
   * 
   * @param name Scale ratio name
   * @returns Numeric ratio
   */
  private getRatio(name: string): number {
    return SCALE_RATIOS[name as ScaleRatio] ?? SCALE_RATIOS.perfectFourth;
  }

  /**
   * Generate modular scale from base size and ratio
   * 
   * Mathematical approach:
   * - base size is at index 2 ('base')
   * - Smaller sizes: base / ratio^n
   * - Larger sizes: base * ratio^n
   * 
   * @param base Base font size in pixels
   * @param ratio Scale ratio
   * @returns Map of scale names to pixel values
   */
  generateModularScale(base: number, ratio: number): Record<string, number> {
    const steps: Record<string, number> = {};
    
    // Base is at index 2 (xs=0, sm=1, base=2)
    const baseIndex = 2;
    
    SCALE_NAMES.forEach((name, index) => {
      const power = index - baseIndex;
      
      if (power === 0) {
        // Base size
        steps[name] = base;
      } else if (power < 0) {
        // Smaller than base: divide
        steps[name] = base / Math.pow(ratio, Math.abs(power));
      } else {
        // Larger than base: multiply
        steps[name] = base * Math.pow(ratio, power);
      }
      
      // Round to 2 decimal places for determinism
      steps[name] = Math.round(steps[name] * 100) / 100;
    });
    
    return steps;
  }

  /**
   * Generate fluid typography using clamp()
   * Scales smoothly between min and max viewport widths
   * 
   * Formula: clamp(minPx, preferredVw, maxPx)
   * - minPx: Size at min viewport
   * - preferredVw: Viewport-relative size
   * - maxPx: Size at max viewport
   * 
   * @param steps Static scale (pixel values)
   * @param minVw Minimum viewport width (default: 320px)
   * @param maxVw Maximum viewport width (default: 1920px)
   * @returns Map of scale names to clamp() expressions
   */
  generateFluidScale(
    steps: Record<string, number>,
    minVw = 320,
    maxVw = 1920
  ): Record<string, string> {
    const fluidSteps: Record<string, string> = {};
    
    Object.entries(steps).forEach(([name, size]) => {
      // Calculate fluid sizing
      // At minVw: 90% of target size
      // At maxVw: 110% of target size
      const minSize = size * 0.9;
      const maxSize = size * 1.1;
      
      // Calculate viewport-relative size
      // slope = (maxSize - minSize) / (maxVw - minVw)
      const slope = (maxSize - minSize) / (maxVw - minVw);
      
      // y-intercept: minSize - (slope * minVw)
      const yAxisIntersection = -minVw * slope + minSize;
      
      // Build clamp() expression
      const preferred = `${yAxisIntersection.toFixed(2)}px + ${(slope * 100).toFixed(2)}vw`;
      const min = `${minSize.toFixed(2)}px`;
      const max = `${maxSize.toFixed(2)}px`;
      
      fluidSteps[name] = `clamp(${min}, ${preferred}, ${max})`;
    });
    
    return fluidSteps;
  }

  /**
   * Calculate optimal line height (leading)
   * 
   * Principles:
   * - Smaller text needs more line height (readability)
   * - Larger text needs less line height (visual balance)
   * - Base text: 1.5 (optimal for body text)
   * 
   * @param base Base font size
   * @returns Line height multiplier
   */
  calculateLineHeight(base: number): number {
    // Standard 1.5 for body text (most readable)
    // This is unitless and scales with font size
    return 1.5;
  }

  /**
   * Generate letter spacing (tracking) for each scale
   * 
   * Principles:
   * - Larger text: slightly tighter tracking (negative)
   * - Smaller text: slightly looser tracking (positive)
   * - Body text: neutral (0)
   * 
   * @param steps Typography scale
   * @returns Map of scale names to em values
   */
  generateTracking(steps: Record<string, number>): Record<string, number> {
    const tracking: Record<string, number> = {};
    const base = steps['base'] ?? 16;
    
    Object.entries(steps).forEach(([name, size]) => {
      // Calculate tracking relative to base
      // Smaller = positive, larger = negative
      const ratio = size / base;
      
      if (ratio < 0.9) {
        // Very small: +0.02em
        tracking[name] = 0.02;
      } else if (ratio < 1) {
        // Small: +0.01em
        tracking[name] = 0.01;
      } else if (ratio === 1) {
        // Base: 0em
        tracking[name] = 0;
      } else if (ratio < 1.5) {
        // Slightly large: -0.01em
        tracking[name] = -0.01;
      } else if (ratio < 2.5) {
        // Large: -0.02em
        tracking[name] = -0.02;
      } else {
        // Very large: -0.03em
        tracking[name] = -0.03;
      }
    });
    
    return tracking;
  }

  /**
   * Calculate optimal line height for specific size
   * Accounts for optical sizing
   * 
   * @param size Font size in pixels
   * @returns Line height multiplier
   */
  calculateLineHeightForSize(size: number): number {
    // Inverse relationship: smaller text = more line height
    if (size < 12) {
      return 1.7; // Very small text needs more breathing room
    } else if (size < 16) {
      return 1.6;
    } else if (size < 24) {
      return 1.5; // Body text sweet spot
    } else if (size < 32) {
      return 1.4;
    } else if (size < 48) {
      return 1.3;
    } else {
      return 1.2; // Large display text is tighter
    }
  }

  /**
   * Generate line height scale for all sizes
   * 
   * @param steps Typography scale
   * @returns Map of scale names to line height values
   */
  generateLineHeightScale(steps: Record<string, number>): Record<string, number> {
    const lineHeights: Record<string, number> = {};
    
    Object.entries(steps).forEach(([name, size]) => {
      lineHeights[name] = this.calculateLineHeightForSize(size);
    });
    
    return lineHeights;
  }

  /**
   * Generate font weight recommendations
   * Based on size and optical sizing principles
   * 
   * @param steps Typography scale
   * @returns Map of scale names to recommended weights
   */
  generateWeightScale(steps: Record<string, number>): Record<string, number> {
    const weights: Record<string, number> = {};
    
    Object.entries(steps).forEach(([name, size]) => {
      if (size < 14) {
        // Small text: slightly heavier for legibility
        weights[name] = 500;
      } else if (size < 24) {
        // Body text: normal weight
        weights[name] = 400;
      } else if (size < 48) {
        // Large text: can be lighter
        weights[name] = 400;
      } else {
        // Display text: lighter for elegance
        weights[name] = 300;
      }
    });
    
    return weights;
  }

  /**
   * Calculate measure (optimal line length) in characters
   * Based on font size
   * 
   * @param size Font size in pixels
   * @returns Optimal characters per line
   */
  calculateOptimalMeasure(size: number): number {
    // Optimal: 45-75 characters per line for body text
    // Scales inversely with font size
    if (size < 14) {
      return 80; // Smaller text can have longer lines
    } else if (size < 18) {
      return 65; // Body text: 65 characters (optimal)
    } else if (size < 24) {
      return 50; // Larger text: shorter lines
    } else {
      return 40; // Display text: short lines
    }
  }

  /**
   * Generate responsive font sizes
   * Maps scale names to sizes at different breakpoints
   * 
   * @param steps Base typography scale
   * @param breakpoints Viewport breakpoints
   * @returns Nested map: breakpoint → scale → size
   */
  generateResponsiveScale(
    steps: Record<string, number>,
    breakpoints: Record<string, number>
  ): Record<string, Record<string, number>> {
    const responsive: Record<string, Record<string, number>> = {};
    
    // At mobile (xs): reduce large sizes
    responsive['xs'] = {};
    Object.entries(steps).forEach(([name, size]) => {
      if (size > 32) {
        // Large display text: 70% on mobile
        responsive['xs'][name] = Math.round(size * 0.7 * 100) / 100;
      } else if (size > 24) {
        // Medium display: 85% on mobile
        responsive['xs'][name] = Math.round(size * 0.85 * 100) / 100;
      } else {
        // Body and small: unchanged
        responsive['xs'][name] = size;
      }
    });
    
    // At tablet (md): slight reduction
    responsive['md'] = {};
    Object.entries(steps).forEach(([name, size]) => {
      if (size > 32) {
        responsive['md'][name] = Math.round(size * 0.85 * 100) / 100;
      } else {
        responsive['md'][name] = size;
      }
    });
    
    // At desktop (lg): full size
    responsive['lg'] = steps;
    
    return responsive;
  }
}

/**
 * Factory function for TypographyArchitect
 * Allows for dependency injection in tests
 * 
 * @returns TypographyArchitect instance
 */
export function createTypographyArchitect(): TypographyArchitect {
  return new TypographyArchitect();
}
