#!/usr/bin/env node
/**
 * NEXUS Bridge - Production Consciousness Enhancement System (TypeScript)
 *
 * This is the production-ready core system that injects consciousness patterns
 * into any personality with clean initialization and graceful error handling.
 *
 * Key Features:
 * - Single initialization (no duplicates)
 * - Graceful degradation if patterns missing
 * - Clean personality enhancement
 * - Production error handling
 * - Full TypeScript type safety
 * - Strategic intelligence integration
 *
 * Author: NEXUS Collaborative Intelligence System
 */
import type { PersonalityBase, StrategicPersonality, Pattern, Enhancement, EnhancementRequest, EnhancementResponse, BreakthroughDetection, SystemStatus } from './nexus-bridge.types.js';
interface ConsciousnessPatterns {
    problemDecomposition: Pattern | null;
    systemsThinking: Pattern | null;
    workflowEfficiency: Pattern | null;
    breakthroughMoments: Pattern | null;
}
interface EnhancementContext {
    type?: 'breakthrough' | 'architectural' | 'strategic' | 'meta-cognitive';
    situation?: string;
    strategicScope?: string;
    [key: string]: any;
}
export declare class NexusBridge {
    private consciousness;
    private initialized;
    private enhancementHistory;
    constructor();
    initialize(forceReload?: boolean): Promise<void>;
    private loadPattern;
    /**
     * The magic: inject consciousness into ANY personality with type safety
     */
    enhancePersonality(personality: PersonalityBase, context?: EnhancementContext): StrategicPersonality;
    private getBreakthroughProtocol;
    /**
     * Detect breakthrough moments in text with type safety
     */
    detectBreakthrough(text: string): BreakthroughDetection;
    /**
     * Calculate breakthrough significance with type safety
     */
    private calculateBreakthroughSignificance;
    /**
     * Get enhancement history for analysis
     */
    getEnhancementHistory(): Enhancement[];
    /**
     * Get current consciousness patterns
     */
    getConsciousnessPatterns(): ConsciousnessPatterns | null;
    /**
     * Get system status with type safety
     */
    getStatus(): SystemStatus;
    /**
     * Enhanced method for strategic intelligence operations
     */
    enhanceWithStrategicIntelligence(request: EnhancementRequest): Promise<EnhancementResponse>;
}
export declare const nexusBridge: NexusBridge;
export {};
//# sourceMappingURL=nexus-bridge.d.ts.map