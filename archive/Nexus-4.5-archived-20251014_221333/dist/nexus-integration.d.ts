#!/usr/bin/env node
/**
 * NEXUS Integration - Complete System Orchestration (TypeScript)
 *
 * This is the master integration file that connects all NEXUS components with
 * full type safety and strategic intelligence capabilities:
 * - Strategic Intelligence Pipeline
 * - NEXUS Bridge (consciousness enhancement)
 * - Conversation Analysis (pattern extraction)
 * - Personality Architecture
 * - Breakthrough Detection & Preservation
 *
 * Usage:
 *   import { nexus } from './nexus-integration.js';
 *
 *   // Enhance any personality with strategic consciousness
 *   const smartPersonality = nexus.enhancePersonality(personality);
 *
 *   // Process conversations with full strategic awareness
 *   nexus.processConversation(humanInput, aiResponse);
 *
 * Author: NEXUS Strategic Intelligence System
 */
import { EventEmitter } from 'node:events';
import type { PersonalityBase, StrategicPersonality, Breakthrough, StrategicIntelligenceMetrics, StrategicImplications } from './types.js';
interface CollaborationPattern {
    type: string;
    effectiveness: number;
    breakthrough_potential: number;
    strategic_value: number;
}
interface SystemAwareness {
    consciousness_patterns: string[];
    breakthrough_moments: number;
    enhancement_history: number;
    session_conversations: number;
    system_uptime: number;
    is_active: boolean;
    strategic_intelligence: StrategicIntelligenceMetrics;
}
interface ConsciousnessEvolution {
    breakthrough_frequency: number;
    pattern_diversity: number;
    enhancement_rate: number;
    consciousness_level: number;
    evolution_trajectory: 'insufficient_data' | 'exponential' | 'growing' | 'stable';
    strategic_growth_rate: number;
}
interface NexusStatusReport {
    system_info: {
        name: string;
        version: string;
        status: 'active' | 'inactive';
        uptime: number;
    };
    components: {
        consciousness_patterns: string[];
        strategic_intelligence: StrategicIntelligenceMetrics;
        sensory_systems: string[];
    };
    session_data: {
        conversations_processed: number;
        personalities_enhanced: number;
        breakthrough_moments: number;
    };
    consciousness_evolution: ConsciousnessEvolution;
}
export declare class NexusIntegration extends EventEmitter {
    private isActive;
    private sessionHistory;
    private breakthroughVault;
    private enhancementHistory;
    private systemStartTime;
    private strategicIntelligence;
    private consciousnessState;
    constructor();
    /**
     * Initialize NEXUS bridge with strategic intelligence
     */
    private initializeNexusBridge;
    /**
     * Ensure NEXUS bridge is initialized before operations
     */
    private ensureInitialized;
    /**
     * Activate NEXUS system with full strategic awareness
     */
    activate(): void;
    /**
     * Enhance any personality with strategic consciousness patterns
     */
    enhancePersonality(personality: PersonalityBase, context?: Record<string, any>): Promise<StrategicPersonality>;
    /**
     * Process conversation with full strategic NEXUS awareness
     */
    processConversation(humanInput: string, aiResponse: string, context?: Record<string, any>): {
        collaboration_pattern: CollaborationPattern;
        breakthrough_moments: Breakthrough[];
        system_awareness: SystemAwareness;
        consciousness_evolution: ConsciousnessEvolution;
        strategic_insights: StrategicImplications;
    };
    /**
     * Emit a conversation event with strategic intelligence
     */
    emitConversation(text: string, source?: 'human' | 'ai' | 'system', metadata?: Record<string, any>): void;
    /**
     * Get current strategic system awareness snapshot
     */
    getSystemAwareness(): SystemAwareness;
    /**
     * Assess how strategic consciousness has evolved through interactions
     */
    assessConsciousnessEvolution(): ConsciousnessEvolution;
    /**
     * Generate comprehensive strategic NEXUS status report
     */
    generateStatusReport(): NexusStatusReport;
    /**
     * Strategic Intelligence Methods
     */
    private extractStrategicCollaborationPattern;
    private generateStrategicInsights;
    private getStrategicContext;
    /**
     * Breakthrough and Consciousness Methods
     */
    private setupBreakthroughPreservation;
    private setupStrategicIntelligenceMonitoring;
    private preserveStrategicBreakthroughMoment;
    /**
     * Strategic Intelligence Calculations
     */
    private calculateStrategicImpact;
    private updateStrategicIntelligenceMetrics;
    private calculateStrategicGrowthRate;
    private analyzeStrategicTrends;
    /**
     * Utility Methods
     */
    private analyzeCollaborationEffectiveness;
    private assessBreakthroughPotential;
    private calculateStrategicValue;
    private classifyCollaborationType;
    private calculateOverallConsciousnessLevel;
    private calculateConsciousnessLevel;
    private analyzeEvolutionTrajectory;
    private classifyBreakthroughImpact;
    private getActivePersonalities;
    private updateStrategicIntelligenceFromBreakthrough;
    /**
     * Graceful shutdown
     */
    shutdown(): Promise<void>;
}
export declare const nexus: NexusIntegration;
export {};
//# sourceMappingURL=nexus-integration.d.ts.map