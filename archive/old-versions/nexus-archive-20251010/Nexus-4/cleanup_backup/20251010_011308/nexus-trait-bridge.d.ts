#!/usr/bin/env node
/**
 * NEXUS Trait Composition Bridge (TypeScript)
 *
 * This bridge connects the NEXUS runtime with the advanced trait composition system.
 * It enables intelligent strategic trait selection and composition instead of
 * loading full personalities, with full type safety and strategic intelligence.
 */
import type { TaskAnalysis, OptimizedSession } from './types.js';
export declare class NexusTraitBridge {
    private personalityTraits;
    private traitIndex;
    private strategicTraitMappings;
    private initialized;
    constructor();
    /**
     * Initialize with strategic intelligence-enhanced personality trait mappings
     */
    private initializePersonalityTraitMappings;
    /**
     * Initialize strategic trait mappings for intelligent composition
     */
    private initializeStrategicTraitMappings;
    /**
     * Analyze task requirements and recommend optimal trait composition
     */
    analyzeTaskRequirements(task: string, context?: Record<string, any>): TaskAnalysis;
    /**
     * Extract required traits from task description using strategic analysis
     */
    extractRequiredTraits(task: string): string[];
    /**
     * Create optimized session with strategic trait composition
     */
    createOptimizedSession(task: string, context?: Record<string, any>): Promise<OptimizedSession>;
    /**
     * Compose optimal trait combination with strategic synergy analysis
     */
    private composeOptimalTraits;
    /**
     * Get trait definition with strategic intelligence enhancement
     */
    private getTraitDefinition;
    /**
     * Strategic analysis helper methods
     */
    private matchesStrategicIntelligence;
    private matchesMetaCognitive;
    private matchesDebugging;
    private matchesDesign;
    private assessStrategicImportance;
    private calculateTaskComplexity;
    private recommendPersonalities;
    private calculateTraitSynergy;
    private calculateStrategicValue;
    private calculateOptimizationScore;
    private getInvolvedPersonalities;
    private calculateExpectedPerformance;
    private hasStrategicCapabilities;
    /**
     * Get system status
     */
    getStatus(): {
        initialized: boolean;
        personalitiesLoaded: number;
        strategicCapabilities: boolean;
    };
}
export declare const nexusTraitBridge: NexusTraitBridge;
//# sourceMappingURL=nexus-trait-bridge.d.ts.map