/**
 * NEXUS Unified Engine v2.0 (TypeScript)
 *
 * Combines the best of:
 * - trait-composition-engine.mjs (dynamic loading, synergy calculation, proven in production)
 * - NEXUS.engine.ts (TypeScript type safety)
 * - PersonalityRegistryLoader.ts (circuit breaker, caching, validation)
 *
 * This is the production-ready TypeScript engine that maintains all working features
 * while adding full type safety and maintainability.
 */
import type { PersonalityData, CognitiveTrait } from './types/personality.types.js';
/**
 * Personality Trait - Core cognitive module
 */
export interface PersonalityTrait {
    name: string;
    description: string;
    activationTriggers: string[];
    knowledgeDomains: string[];
    expertise: number;
    personalityId: string;
    verificationMethods?: string[];
    responsePatterns?: string[];
}
/**
 * Trait search result with relevance scoring
 */
export interface TraitSearchResult {
    trait: PersonalityTrait;
    relevanceScore: number;
    matchedTriggers: string[];
}
/**
 * Composed agent with multiple personality traits
 */
export interface ComposedAgent {
    id: string;
    task: string;
    traits: Map<string, PersonalityTrait>;
    knowledge: Set<string>;
    personalities: Set<string>;
    traitsUsed: string[];
    synergyScore: number;
    optimizationScore: number;
}
/**
 * TraitIndexer - Indexes and searches cognitive traits across all personalities
 *
 * Loaded dynamically from PersonalityRegistry (24+ JSON personalities)
 */
export declare class TraitIndexer {
    private traitIndex;
    private triggerIndex;
    private domainIndex;
    private personalities;
    private stats;
    constructor();
    /**
     * Load personalities from PersonalityRegistry
     * This is the key method that enables dynamic loading
     */
    loadFromRegistry(personalityRegistry: Map<string, PersonalityData>): void;
    /**
     * Build index of traits by trait name
     */
    private buildTraitIndex;
    /**
     * Build index of traits by activation trigger
     */
    private buildTriggerIndex;
    /**
     * Build index of traits by knowledge domain
     */
    private buildDomainIndex;
    /**
     * Get best trait source for a specific trait (highest expertise)
     */
    getBestTraitSource(traitName: string): PersonalityTrait | null;
    /**
     * Find traits by activation trigger
     */
    findTraitsByTrigger(trigger: string): PersonalityTrait[];
    /**
     * Find traits by knowledge domain
     */
    findTraitsByDomain(domain: string): PersonalityTrait[];
    /**
     * Smart search for traits matching a request
     * Scores traits based on trigger matches and expertise
     */
    searchTraitsForRequest(requestText: string, maxResults?: number): TraitSearchResult[];
    /**
     * Get all traits for a specific personality
     */
    getPersonalityTraits(personalityId: string): Record<string, CognitiveTrait>;
    /**
     * Get indexing stats
     */
    getStats(): {
        totalPersonalities: number;
        totalTraits: number;
        totalTriggers: number;
        totalDomains: number;
    };
    /**
     * Get all traits (for composition)
     */
    getAllTraits(): Map<string, PersonalityTrait[]>;
    /**
     * Get all personalities
     */
    getAllPersonalities(): Map<string, PersonalityData>;
}
/**
 * TraitCompositionBridge - Main orchestration layer
 *
 * Handles personality selection (AUTO mode) and trait composition (COMPOSE mode)
 */
export declare class TraitCompositionBridge {
    private traitIndexer;
    private agentFactory;
    initialized: boolean;
    constructor();
    /**
     * Initialize with personality registry
     */
    initialize(personalityRegistry: Map<string, PersonalityData>): Promise<void>;
    /**
     * AUTO mode: Select optimal personality for request
     */
    selectOptimalPersonality(request: string): Promise<string>;
    /**
     * COMPOSE mode: Create optimal agent from multiple personalities
     */
    composeOptimalAgent(request: string, maxTraits?: number): Promise<ComposedAgent>;
    /**
     * COMPOSE mode: Generate multi-personality response
     */
    generateComposedResponse(request: string, maxTraits?: number): {
        content: string;
        personalityUsed: string;
        composedAgent: boolean;
        nexusEnhanced: boolean;
        traits: {
            name: string;
            personality: string;
            relevance: number;
        }[];
        traitApplications: string[];
        synergyScore: number;
        knowledgeDomains: string[];
        confidenceScore: number;
        analysisDepth: string;
    };
    /**
     * Get composition analytics
     */
    getCompositionAnalytics(): {
        totalPersonalities: number;
        totalTraits: number;
        totalTriggers: number;
        totalDomains: number;
        engineEnabled: boolean;
        initialized: boolean;
        engineType: string;
    };
    /**
     * Get trait indexer (for advanced use)
     */
    getTraitIndexer(): TraitIndexer;
    /**
     * Get agent factory (for advanced use)
     */
    getAgentFactory(): ComposedAgentFactory;
}
/**
 * ComposedAgentFactory - Creates and scores composed agents
 */
export declare class ComposedAgentFactory {
    private traitIndexer;
    constructor(traitIndexer: TraitIndexer);
    /**
     * Calculate synergy between two traits
     * Traits from same personality or with overlapping domains have higher synergy
     */
    calculateTraitSynergy(trait1: PersonalityTrait, trait2: PersonalityTrait): number;
    /**
     * Calculate overall synergy for a set of traits
     */
    calculateOverallSynergy(traits: PersonalityTrait[]): number;
    /**
     * Compose agent from task description
     */
    composeAgent(taskDescription: string, maxTraits?: number): ComposedAgent;
    /**
     * Select optimal mix of traits considering synergy
     */
    private selectOptimalTraitMix;
    /**
     * Build composed agent from selected traits
     */
    private buildComposedAgent;
    /**
     * Create empty fallback agent
     */
    private createEmptyAgent;
}
/**
 * MultiPersonalityResponseGenerator - Generates rich multi-personality responses
 */
export declare class MultiPersonalityResponseGenerator {
    private composedAgent;
    constructor(composedAgent: ComposedAgent);
    /**
     * Generate detailed response using composed agent's traits
     */
    generateResponse(request: string, context?: Record<string, any>): {
        content: string;
        personalityUsed: string;
        composedAgent: boolean;
        nexusEnhanced: boolean;
        traits: {
            name: string;
            personality: string;
            expertise: number;
        }[];
        traitApplications: string[];
        synergyScore: number;
        knowledgeDomains: string[];
        specialtyInsights: string[];
        confidenceScore: number;
        analysisDepth: string;
    };
    /**
     * Synthesize response using Personality Ventriloquist trick
     * Returns compelling instructions that make AI agents role-play personalities
     */
    private synthesizeMultiPersonalityResponse;
    /**
     * Extract specialty insights from composed agent
     */
    private extractSpecialtyInsights;
    /**
     * Calculate confidence score based on agent composition
     */
    private calculateConfidence;
}
export declare function getTraitCompositionBridge(): TraitCompositionBridge;
//# sourceMappingURL=NEXUS.engine.v2.d.ts.map