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
import type { DesignDNA } from '../contracts.js';
/** Layout strategy options */
export type LayoutStrategy = 'fluid' | 'fixed' | 'hybrid' | 'auto';
/** Breakpoint configuration */
export interface Breakpoint {
    name: string;
    width: number;
    columns: number;
    gutter: number;
    margin: number;
}
/** Per‑breakpoint computed metrics */
export interface ComputedMetrics {
    containerWidth: number;
    columnWidth: number;
    totalGutters: number;
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
    baseUnit?: number;
    enableFluidTypography?: boolean;
    enableResponsiveSpacing?: boolean;
    /** Optional clamp guards for fluid/hybrid gutters & margins */
    fluidClamp?: {
        gutterMin?: number;
        gutterMax?: number;
        marginMin?: number;
        marginMax?: number;
    };
}
export declare class LayoutDeliveryPipeline {
    private layoutAlgorithmist;
    constructor();
    /**
     * Generate layout matrix from design DNA and strategy
     */
    generateLayoutMatrix(dna: DesignDNA, config?: PipelineConfig): Promise<LayoutMatrix>;
    /**
     * Compute metrics for a single breakpoint
     */
    private computeBreakpointMetrics;
    /**
     * Generate default responsive breakpoints based on strategy
     */
    private generateDefaultBreakpoints;
    /**
     * Integrate layout matrix into design DNA
     */
    integrateLayoutIntoDNA(dna: DesignDNA, matrix: LayoutMatrix): DesignDNA & {
        layout: any;
    };
    /**
     * Generate CSS custom property tokens
     */
    generateGridTokens(matrix: LayoutMatrix): Record<string, string>;
    /**
     * Emit CSS with :root variables and @media queries
     */
    emitCSS(matrix: LayoutMatrix, options?: {
        selector?: string;
    }): string;
    /**
     * Generate Tailwind config fragments
     */
    toTailwindFragments(matrix: LayoutMatrix): {
        screens: Record<string, string>;
        container: Record<string, any>;
    };
    /**
     * Validate layout matrix
     */
    validateMatrix(matrix: LayoutMatrix): {
        valid: boolean;
        errors: string[];
    };
    /**
     * Get layout strategy recommendation based on DNA
     */
    recommendStrategy(dna: DesignDNA): LayoutStrategy;
}
/**
 * Factory function for creating layout pipeline
 */
export declare function createLayoutPipeline(): LayoutDeliveryPipeline;
export declare const layoutPipeline: LayoutDeliveryPipeline;
//# sourceMappingURL=LayoutDeliveryPipeline.optimized.d.ts.map