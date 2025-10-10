/**
 * Mathematical Systems Engine
 * Core calculation engine for CSS design systems
 * 
 * @module mathematical-systems
 * @version 1.0.0
 * @owners CSSMaster + Flash
 * @see {@link css-engine.types.ts} for type definitions
 */

import type {
  RatioName,
  FibonacciScale,
  MathematicalScale,
  ScaleCalculation,
} from '../types/css-engine.types.js';

/**
 * Ratio constants mapped from RatioName
 * Based on musical intervals and mathematical constants
 */
export const RATIOS: Record<RatioName, number> = {
  minorSecond: 1.067,
  majorSecond: 1.125,
  minorThird: 1.200,
  majorThird: 1.250,
  perfectFourth: 1.333,
  augmentedFourth: Math.sqrt(2), // 1.414
  perfectFifth: 1.500,
  minorSixth: 1.600,
  majorSixth: 1.667,
  golden: (1 + Math.sqrt(5)) / 2, // φ = 1.618
  harmonic: 1.618, // Alternative golden ratio
  photographic: Math.pow(2, 0.25), // √√2 = 1.189
};

/**
 * Golden Ratio constant (φ)
 */
export const PHI = RATIOS.golden;

/**
 * Golden Ratio inverse (1/φ)
 */
export const PHI_INVERSE = 1 / PHI; // 0.618

/**
 * Advanced mathematical ratio constants
 * Extended ratios for specialized design systems
 */
export const ADVANCED_RATIOS = {
  silver: 1 + Math.sqrt(2), // 2.414 (Silver ratio)
  plastic: 1.3247, // Plastic number
  supergolden: 1.4656, // Supergolden ratio
  tribonacciConstant: 1.8393, // Tribonacci constant
  keplerTriangle: Math.sqrt(PHI), // 1.272 (Kepler triangle)
} as const;

/**
 * Ratio families for grouped ratio operations
 */
export const RATIO_FAMILIES = {
  musical: ['minorSecond', 'majorSecond', 'minorThird', 'majorThird', 'perfectFourth', 'perfectFifth'] as const,
  mathematical: ['golden', 'harmonic', 'augmentedFourth'] as const,
  photographic: ['photographic'] as const,
} as const;

/**
 * Mathematical Systems Engine
 * Provides all mathematical calculations for CSS generation
 * Enhanced with caching, validation, and advanced calculations
 */
export class MathematicalSystems {
  /**
   * Cache for frequently used sequences (performance optimization)
   */
  private sequenceCache = new Map<string, number[]>();

  /**
   * Cache for ratio calculations
   */
  private ratioCache = new Map<string, number>();

  /**
   * Performance metrics tracking
   */
  private performanceMetrics = {
    sequenceGenerations: 0,
    cacheHits: 0,
    cacheMisses: 0,
    totalComputeTime: 0,
  };

  /**
   * Calculate Fibonacci sequence (with caching)
   * @param steps Number of Fibonacci numbers to generate
   * @returns Array of Fibonacci numbers
   */
  generateFibonacciSequence(steps: number): number[] {
    const cacheKey = `fib-${steps}`;
    
    // Check cache first
    if (this.sequenceCache.has(cacheKey)) {
      this.performanceMetrics.cacheHits++;
      return this.sequenceCache.get(cacheKey)!;
    }
    
    this.performanceMetrics.cacheMisses++;
    this.performanceMetrics.sequenceGenerations++;
    
    if (steps <= 0) return [];
    if (steps === 1) return [1];
    if (steps === 2) return [1, 1];

    const sequence: number[] = [1, 1];
    for (let i = 2; i < steps; i++) {
      sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    
    // Cache result
    this.sequenceCache.set(cacheKey, sequence);
    return sequence;
  }

  /**
   * Calculate Lucas sequence (similar to Fibonacci but starts with 2, 1)
   * @param steps Number of Lucas numbers to generate
   * @returns Array of Lucas numbers
   */
  generateLucasSequence(steps: number): number[] {
    if (steps <= 0) return [];
    if (steps === 1) return [2];
    if (steps === 2) return [2, 1];

    const sequence: number[] = [2, 1];
    for (let i = 2; i < steps; i++) {
      sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    return sequence;
  }

  /**
   * Calculate Tribonacci sequence (sum of previous three numbers)
   * @param steps Number of Tribonacci numbers to generate
   * @returns Array of Tribonacci numbers
   */
  generateTribonacciSequence(steps: number): number[] {
    if (steps <= 0) return [];
    if (steps === 1) return [0];
    if (steps === 2) return [0, 1];
    if (steps === 3) return [0, 1, 1];

    const sequence: number[] = [0, 1, 1];
    for (let i = 3; i < steps; i++) {
      sequence.push(sequence[i - 1] + sequence[i - 2] + sequence[i - 3]);
    }
    return sequence;
  }

  /**
   * Calculate geometric scale
   * @param base Base value
   * @param ratio Geometric ratio (must be positive)
   * @param steps Number of steps
   * @returns Array of geometric progression values
   * @throws Error if ratio is non-positive
   */
  generateGeometricScale(base: number, ratio: number, steps: number): number[] {
    if (ratio <= 0) {
      throw new Error(`Geometric ratio must be positive, received: ${ratio}`);
    }
    if (steps <= 0) return [];
    
    const scale: number[] = [];
    for (let i = 0; i < steps; i++) {
      scale.push(base * Math.pow(ratio, i));
    }
    return scale;
  }

  /**
   * Calculate modular scale (typographic scale)
   * Fixed to generate exactly `steps` values with base at center
   * @param base Base value (typically font size)
   * @param ratio Scale ratio
   * @param steps Number of steps (total values to generate)
   * @returns Array of modular scale values
   */
  generateModularScale(base: number, ratio: number, steps: number): number[] {
    if (steps <= 0) return [];
    if (ratio <= 0) throw new Error('Ratio must be positive');
    
    const scale: number[] = [];
    
    // Calculate how many steps on each side of the base
    const negativeSteps = Math.floor((steps - 1) / 2);
    const positiveSteps = steps - 1 - negativeSteps;
    
    // Generate negative steps (smaller sizes) - reversed for correct order
    for (let i = negativeSteps; i > 0; i--) {
      scale.push(base * Math.pow(ratio, -i));
    }
    
    // Add base (center value)
    scale.push(base);
    
    // Generate positive steps (larger sizes)
    for (let i = 1; i <= positiveSteps; i++) {
      scale.push(base * Math.pow(ratio, i));
    }
    
    return scale;
  }

  /**
   * Calculate linear scale
   * @param base Base value
   * @param increment Linear increment
   * @param steps Number of steps
   * @returns Array of linear progression values
   */
  generateLinearScale(base: number, increment: number, steps: number): number[] {
    const scale: number[] = [];
    for (let i = 0; i < steps; i++) {
      scale.push(base + (increment * i));
    }
    return scale;
  }

  /**
   * Calculate exponential scale
   * @param base Base value
   * @param exponent Exponent for progression
   * @param steps Number of steps
   * @returns Array of exponential progression values
   */
  generateExponentialScale(base: number, exponent: number, steps: number): number[] {
    const scale: number[] = [];
    for (let i = 0; i < steps; i++) {
      scale.push(base * Math.pow(exponent, i));
    }
    return scale;
  }

  /**
   * Calculate logarithmic scale
   * @param base Base value
   * @param logBase Logarithm base
   * @param steps Number of steps
   * @returns Array of logarithmic progression values
   */
  generateLogarithmicScale(base: number, logBase: number, steps: number): number[] {
    const scale: number[] = [];
    for (let i = 1; i <= steps; i++) {
      scale.push(base * Math.log(i + 1) / Math.log(logBase));
    }
    return scale;
  }

  /**
   * Generate scale based on type
   * @param config Scale calculation configuration
   * @returns Array of scale values
   */
  generateScale(config: ScaleCalculation): number[] {
    const { base, ratio, steps, precision = 3, clamp } = config;
    
    let scale: number[];
    
    // Generate raw scale based on ratio
    if (ratio === PHI || Math.abs(ratio - PHI) < 0.01) {
      // Use Fibonacci for golden ratio
      const fibSequence = this.generateFibonacciSequence(steps);
      scale = fibSequence.map(n => base * n);
    } else {
      // Use geometric scale for other ratios
      scale = this.generateGeometricScale(base, ratio, steps);
    }
    
    // Apply precision rounding
    scale = scale.map(value => this.roundToPrecision(value, precision));
    
    // Apply clamping if specified
    if (clamp) {
      scale = scale.map(value => {
        if (clamp.min !== undefined && value < clamp.min) return clamp.min;
        if (clamp.max !== undefined && value > clamp.max) return clamp.max;
        return value;
      });
    }
    
    return scale;
  }

  /**
   * Calculate scale by type name
   * @param scaleType Type of mathematical scale
   * @param base Base value
   * @param ratio Ratio (for geometric/modular)
   * @param steps Number of steps
   * @returns Array of scale values
   */
  calculateScaleByType(
    scaleType: MathematicalScale,
    base: number,
    ratio: number,
    steps: number
  ): number[] {
    switch (scaleType) {
      case 'fibonacci':
        const fibSeq = this.generateFibonacciSequence(steps);
        return fibSeq.map(n => base * n);
      
      case 'lucas':
        const lucasSeq = this.generateLucasSequence(steps);
        return lucasSeq.map(n => base * n);
      
      case 'tribonacci':
        const tribSeq = this.generateTribonacciSequence(steps);
        return tribSeq.map(n => base * n);
      
      case 'geometric':
        return this.generateGeometricScale(base, ratio, steps);
      
      case 'modular':
        return this.generateModularScale(base, ratio, steps);
      
      case 'linear':
        return this.generateLinearScale(base, ratio, steps);
      
      case 'exponential':
        return this.generateExponentialScale(base, ratio, steps);
      
      case 'logarithmic':
        return this.generateLogarithmicScale(base, ratio, steps);
      
      default:
        throw new Error(`Unknown scale type: ${scaleType}`);
    }
  }

  /**
   * Calculate golden ratio section
   * Divides a total into two parts following golden ratio
   * @param total Total value to divide
   * @returns Object with larger and smaller sections
   */
  calculateGoldenSection(total: number): { major: number; minor: number } {
    const major = total * PHI_INVERSE; // 61.8%
    const minor = total - major; // 38.2%
    return { major, minor };
  }

  /**
   * Calculate grid dimensions with golden ratio
   * @param totalWidth Total width available
   * @param totalHeight Total height available
   * @returns Grid dimensions following golden ratio
   */
  calculateGoldenGrid(
    totalWidth: number,
    totalHeight: number
  ): { width: number; height: number; columns: number; rows: number } {
    // Use golden ratio to determine if layout is horizontal or vertical
    const aspectRatio = totalWidth / totalHeight;
    
    if (aspectRatio > PHI) {
      // Wide layout - use golden ratio for columns
      const { major, minor } = this.calculateGoldenSection(totalWidth);
      return {
        width: totalWidth,
        height: totalHeight,
        columns: 2, // Major:Minor split
        rows: 1,
      };
    } else {
      // Tall layout - use golden ratio for rows
      const { major, minor } = this.calculateGoldenSection(totalHeight);
      return {
        width: totalWidth,
        height: totalHeight,
        columns: 1,
        rows: 2, // Major:Minor split
      };
    }
  }

  /**
   * Calculate optimal grid columns based on content width
   * Enhanced with preferred numbers (common grid columns: 2, 3, 4, 6, 8, 12, 16, 24)
   * @param containerWidth Container width in pixels
   * @param minColumnWidth Minimum column width in pixels
   * @param maxColumnWidth Maximum column width in pixels
   * @returns Optimal number of columns
   */
  calculateOptimalColumns(
    containerWidth: number,
    minColumnWidth: number,
    maxColumnWidth: number
  ): number {
    // Calculate range of possible columns
    const maxPossibleColumns = Math.floor(containerWidth / minColumnWidth);
    const minRequiredColumns = Math.ceil(containerWidth / maxColumnWidth);
    
    // Preferred column counts (common in design systems)
    const preferredColumns = [1, 2, 3, 4, 6, 8, 12, 16, 24];
    
    // Find the largest preferred number within range
    let optimal = minRequiredColumns;
    for (const num of preferredColumns) {
      if (num >= minRequiredColumns && num <= maxPossibleColumns) {
        optimal = num;
      }
    }
    
    // If no preferred number fits, try Fibonacci sequence
    if (optimal === minRequiredColumns && minRequiredColumns > 1) {
      const fibSequence = this.generateFibonacciSequence(12); // Up to 144
      for (const fibNum of fibSequence) {
        if (fibNum >= minRequiredColumns && fibNum <= maxPossibleColumns) {
          return fibNum;
        }
      }
    }
    
    return optimal;
  }

  /**
   * Calculate aspect ratio
   * @param width Width value
   * @param height Height value
   * @returns Aspect ratio as number
   */
  calculateAspectRatio(width: number, height: number): number {
    return width / height;
  }

  /**
   * Check if aspect ratio is close to golden ratio
   * @param width Width value
   * @param height Height value
   * @param tolerance Tolerance for comparison (default: 0.01)
   * @returns True if aspect ratio is close to golden ratio
   */
  isGoldenAspectRatio(width: number, height: number, tolerance = 0.01): boolean {
    const ratio = this.calculateAspectRatio(width, height);
    return Math.abs(ratio - PHI) < tolerance;
  }

  /**
   * Calculate z-index layers with consistent spacing
   * @param baseZIndex Starting z-index value
   * @param layers Number of layers
   * @param increment Increment between layers
   * @returns Array of z-index values
   */
  calculateZIndexLayers(baseZIndex: number, layers: number, increment: number): number[] {
    const zIndices: number[] = [];
    for (let i = 0; i < layers; i++) {
      zIndices.push(baseZIndex + (i * increment));
    }
    return zIndices;
  }

  /**
   * Calculate responsive breakpoints using geometric progression
   * Enhanced with reasonable geometric ratio (1.5x) instead of Fibonacci
   * @param baseBreakpoint Base breakpoint in pixels (e.g., 320 for mobile)
   * @param count Number of breakpoints to generate
   * @param ratio Growth ratio (default: 1.5 for reasonable progression)
   * @returns Array of breakpoint values
   */
  calculateResponsiveBreakpoints(
    baseBreakpoint: number, 
    count: number,
    ratio: number = 1.5
  ): number[] {
    // Use geometric progression for more standard breakpoints
    return this.generateGeometricScale(baseBreakpoint, ratio, count)
      .map(bp => Math.round(bp));
  }

  /**
   * Round number to specified precision
   * @param value Value to round
   * @param precision Number of decimal places
   * @returns Rounded value
   */
  roundToPrecision(value: number, precision: number): number {
    const multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
  }

  /**
   * Clamp value between min and max
   * @param value Value to clamp
   * @param min Minimum value
   * @param max Maximum value
   * @returns Clamped value
   */
  clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Linear interpolation between two values
   * @param start Start value
   * @param end End value
   * @param t Interpolation factor (0-1)
   * @returns Interpolated value
   */
  lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  /**
   * Inverse linear interpolation - find t for a value
   * @param start Start value
   * @param end End value
   * @param value Value to find t for
   * @returns Interpolation factor (0-1)
   */
  inverseLerp(start: number, end: number, value: number): number {
    return (value - start) / (end - start);
  }

  /**
   * Map value from one range to another
   * @param value Input value
   * @param inMin Input range minimum
   * @param inMax Input range maximum
   * @param outMin Output range minimum
   * @param outMax Output range maximum
   * @returns Mapped value
   */
  mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    const t = this.inverseLerp(inMin, inMax, value);
    return this.lerp(outMin, outMax, t);
  }

  /**
   * Calculate easing curve value
   * Enhanced with additional easing functions
   * @param t Time (0-1)
   * @param type Easing type
   * @returns Eased value
   */
  easing(
    t: number, 
    type: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic' = 'linear'
  ): number {
    switch (type) {
      case 'linear':
        return t;
      case 'easeIn':
        return t * t;
      case 'easeOut':
        return t * (2 - t);
      case 'easeInOut':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      case 'easeInCubic':
        return t * t * t;
      case 'easeOutCubic':
        return (--t) * t * t + 1;
      case 'easeInOutCubic':
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      default:
        return t;
    }
  }

  /**
   * Validate scale mathematical properties
   * Analyzes scale for geometric progression, harmony, and consistency
   * @param scale Array of scale values
   * @returns Validation metrics
   */
  validateScaleProperties(scale: number[]): {
    isGeometric: boolean;
    isHarmonic: boolean;
    consistency: number;
    growthFactor: number;
  } {
    if (scale.length < 2) {
      return {
        isGeometric: false,
        isHarmonic: false,
        consistency: 0,
        growthFactor: 1,
      };
    }

    // Calculate ratios between consecutive values
    const ratios = scale.slice(1).map((val, i) => val / scale[i]);
    const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;
    const variance = ratios.reduce((sum, ratio) => sum + Math.pow(ratio - avgRatio, 2), 0) / ratios.length;
    
    return {
      isGeometric: variance < 0.01, // Low variance indicates geometric progression
      isHarmonic: scale.every((val, i) => this.isFibonacci(Math.round(val))),
      consistency: Math.max(0, 1 - variance / avgRatio), // Higher = more consistent (0-1)
      growthFactor: avgRatio,
    };
  }

  /**
   * Generate fluid scale with viewport-relative units
   * Combines fixed scales with responsive behavior using CSS clamp()
   * @param minScale Minimum scale values (mobile)
   * @param maxScale Maximum scale values (desktop)
   * @param viewportMin Minimum viewport width in pixels
   * @param viewportMax Maximum viewport width in pixels
   * @returns Array of CSS clamp() expressions
   */
  generateFluidScale(
    minScale: number[],
    maxScale: number[],
    viewportMin: number,
    viewportMax: number
  ): string[] {
    if (minScale.length !== maxScale.length) {
      throw new Error('minScale and maxScale must have the same length');
    }

    return minScale.map((minVal, i) => {
      const maxVal = maxScale[i];
      const slope = (maxVal - minVal) / (viewportMax - viewportMin);
      const yIntercept = minVal - slope * viewportMin;
      
      return `clamp(${minVal}px, ${yIntercept.toFixed(3)}px + ${(slope * 100).toFixed(3)}vw, ${maxVal}px)`;
    });
  }

  /**
   * Generate hybrid sequences combining multiple mathematical properties
   * @param config Hybrid sequence configuration
   * @returns Array of hybrid sequence values
   */
  generateHybridSequence(config: {
    baseSequence: 'fibonacci' | 'lucas' | 'geometric';
    modifier: 'golden' | 'silver' | 'none';
    base: number;
    ratio: number;
    steps: number;
    intensity: number; // 0-1 for modification strength
  }): number[] {
    const { baseSequence, modifier, base, ratio, steps, intensity } = config;
    
    // Generate base sequence
    let sequence: number[];
    switch (baseSequence) {
      case 'fibonacci':
        sequence = this.generateFibonacciSequence(steps).map(n => base * n);
        break;
      case 'lucas':
        sequence = this.generateLucasSequence(steps).map(n => base * n);
        break;
      case 'geometric':
        sequence = this.generateGeometricScale(base, ratio, steps);
        break;
      default:
        sequence = this.generateGeometricScale(base, ratio, steps);
    }

    // Apply modifier
    switch (modifier) {
      case 'golden':
        return sequence.map((val, i) => 
          val * (1 + intensity * Math.sin(i * PHI_INVERSE))
        );
      case 'silver':
        return sequence.map((val, i) => 
          val * (1 + intensity * (i % 2 === 0 ? ADVANCED_RATIOS.silver - 1 : 0))
        );
      case 'none':
      default:
        return sequence;
    }
  }

  /**
   * Get performance metrics
   * @returns Performance statistics
   */
  getPerformanceMetrics(): {
    sequenceGenerations: number;
    cacheHits: number;
    cacheMisses: number;
    cacheHitRate: number;
    totalComputeTime: number;
  } {
    const totalRequests = this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses;
    return {
      ...this.performanceMetrics,
      cacheHitRate: totalRequests > 0 ? this.performanceMetrics.cacheHits / totalRequests : 0,
    };
  }

  /**
   * Clear all caches
   */
  clearCaches(): void {
    this.sequenceCache.clear();
    this.ratioCache.clear();
    this.performanceMetrics = {
      sequenceGenerations: 0,
      cacheHits: 0,
      cacheMisses: 0,
      totalComputeTime: 0,
    };
  }

  /**
   * Check if number is in Fibonacci sequence
   * @param num Number to check
   * @returns True if number is in Fibonacci sequence
   */
  isFibonacci(num: number): boolean {
    // A number is Fibonacci if one or both of (5*n^2 + 4) or (5*n^2 - 4) is a perfect square
    const test1 = 5 * num * num + 4;
    const test2 = 5 * num * num - 4;
    return this.isPerfectSquare(test1) || this.isPerfectSquare(test2);
  }

  /**
   * Check if number is a perfect square
   * @param num Number to check
   * @returns True if number is a perfect square
   */
  isPerfectSquare(num: number): boolean {
    const sqrt = Math.sqrt(num);
    return sqrt === Math.floor(sqrt);
  }

  /**
   * Get ratio value by name
   * @param ratioName Ratio name
   * @returns Ratio value
   */
  getRatio(ratioName: RatioName): number {
    return RATIOS[ratioName];
  }

  /**
   * Find closest ratio to a given value
   * @param value Value to match
   * @returns Closest ratio name and value
   */
  findClosestRatio(value: number): { name: RatioName; value: number; difference: number } {
    let closestName: RatioName = 'golden';
    let closestValue = RATIOS.golden;
    let smallestDifference = Math.abs(value - closestValue);

    for (const [name, ratioValue] of Object.entries(RATIOS)) {
      const difference = Math.abs(value - ratioValue);
      if (difference < smallestDifference) {
        closestName = name as RatioName;
        closestValue = ratioValue;
        smallestDifference = difference;
      }
    }

    return { name: closestName, value: closestValue, difference: smallestDifference };
  }
}

/**
 * Singleton instance of MathematicalSystems
 */
let mathSystemsInstance: MathematicalSystems | null = null;

/**
 * Get or create MathematicalSystems instance
 * @returns MathematicalSystems instance
 */
export function getMathematicalSystems(): MathematicalSystems {
  if (!mathSystemsInstance) {
    mathSystemsInstance = new MathematicalSystems();
  }
  return mathSystemsInstance;
}

/**
 * Export constants for direct use
 */
export { PHI as GOLDEN_RATIO, PHI_INVERSE as GOLDEN_RATIO_INVERSE };
