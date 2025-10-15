/**
 * DesignSystemArchitect - Master Orchestrator
 * Coordinates ColorScientist, TypographyArchitect, and SpatialEngineer
 *
 * @module DesignSystemArchitect
 * @version 1.0.0
 * @architecture Parallel orchestration with resilience
 */
import type { Specialist, DesignDNA, DesignPackage, CompileOptions } from '../contracts.js';
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
export declare class DesignSystemArchitect implements Specialist<DesignDNA, DesignPackage> {
    readonly id = "design-system-architect";
    readonly timeoutMs = 200;
    private colorScientist;
    private typographyArchitect;
    private spatialEngineer;
    constructor();
    /**
     * Main orchestration method
     * Runs all specialists in parallel and synthesizes results
     *
     * @param dna Design DNA (normalized input)
     * @param opts Compilation options
     * @returns Complete design package
     */
    run(dna: DesignDNA, opts: CompileOptions): Promise<DesignPackage>;
    /**
     * Synthesize specialist outputs into coherent design package
     * Handles partial failures gracefully
     *
     * @param synthesis Specialist results (settled promises)
     * @param opts Compilation options
     * @param cacheKey Stable cache key
     * @returns Design package
     */
    private synthesize;
    /**
     * Generate CSS custom properties (Tailwind v4 @theme format)
     *
     * @param tokens Design tokens
     * @param typeFacts Typography facts
     * @param spatialFacts Spatial facts
     * @returns CSS @theme block
     */
    private generateCSSVariables;
    /**
     * Generate full Tailwind v4 CSS with utility classes
     *
     * @param tokens Design tokens
     * @param typeFacts Typography facts
     * @param spatialFacts Spatial facts
     * @returns Full CSS output
     */
    private generateTailwindV4CSS;
    /**
     * Generate elevation (shadow) scale
     *
     * @returns Elevation tokens
     */
    private generateElevation;
    /**
     * Generate animation tokens
     * Respects prefers-reduced-motion
     *
     * @param reducedMotion Whether to reduce motion
     * @returns Animation tokens
     */
    private generateAnimation;
    /**
     * Generate documentation for the design system
     *
     * @param tokens Design tokens
     * @param colorFacts Color facts
     * @param typeFacts Typography facts
     * @param spatialFacts Spatial facts
     * @returns Markdown documentation
     */
    private generateDocs;
}
/**
 * Factory function for DesignSystemArchitect
 *
 * @returns DesignSystemArchitect instance
 */
export declare function createDesignSystemArchitect(): DesignSystemArchitect;
//# sourceMappingURL=DesignSystemArchitect.d.ts.map