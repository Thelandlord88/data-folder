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
/**
 * TraitIndexer - Indexes and searches cognitive traits across all personalities
 *
 * Loaded dynamically from PersonalityRegistry (24+ JSON personalities)
 */
export class TraitIndexer {
    traitIndex = new Map();
    triggerIndex = new Map();
    domainIndex = new Map();
    personalities = new Map();
    stats = {
        totalPersonalities: 0,
        totalTraits: 0,
        totalTriggers: 0,
        totalDomains: 0
    };
    constructor() {
        // Empty constructor - call loadFromRegistry() to populate
    }
    /**
     * Load personalities from PersonalityRegistry
     * This is the key method that enables dynamic loading
     */
    loadFromRegistry(personalityRegistry) {
        console.log('🔍 Building trait index from personality registry...');
        this.personalities = personalityRegistry;
        this.stats.totalPersonalities = personalityRegistry.size;
        this.buildTraitIndex();
        this.buildTriggerIndex();
        this.buildDomainIndex();
        console.log(`✅ Trait index built:`);
        console.log(`   📊 ${this.stats.totalPersonalities} personalities`);
        console.log(`   🧬 ${this.stats.totalTraits} traits indexed`);
        console.log(`   🎯 ${this.stats.totalTriggers} activation triggers`);
        console.log(`   📚 ${this.stats.totalDomains} knowledge domains`);
    }
    /**
     * Build index of traits by trait name
     */
    buildTraitIndex() {
        this.traitIndex.clear();
        let traitCount = 0;
        for (const [personalityId, personality] of this.personalities.entries()) {
            if (personality.cognitiveTraits) {
                const traits = Object.entries(personality.cognitiveTraits);
                for (const [traitKey, trait] of traits) {
                    const traitName = trait.name;
                    traitCount++;
                    if (!this.traitIndex.has(traitName)) {
                        this.traitIndex.set(traitName, []);
                    }
                    this.traitIndex.get(traitName).push({
                        ...trait,
                        personalityId,
                        activationTriggers: trait.activationTriggers || [],
                        knowledgeDomains: trait.knowledgeDomains || [],
                        expertise: trait.expertise || 50
                    });
                }
            }
        }
        this.stats.totalTraits = traitCount;
    }
    /**
     * Build index of traits by activation trigger
     */
    buildTriggerIndex() {
        this.triggerIndex.clear();
        const uniqueTriggers = new Set();
        for (const [personalityId, personality] of this.personalities.entries()) {
            if (personality.cognitiveTraits) {
                for (const [traitKey, trait] of Object.entries(personality.cognitiveTraits)) {
                    if (trait.activationTriggers) {
                        for (const trigger of trait.activationTriggers) {
                            const normalizedTrigger = trigger.toLowerCase();
                            uniqueTriggers.add(normalizedTrigger);
                            if (!this.triggerIndex.has(normalizedTrigger)) {
                                this.triggerIndex.set(normalizedTrigger, []);
                            }
                            this.triggerIndex.get(normalizedTrigger).push({
                                ...trait,
                                personalityId,
                                activationTriggers: trait.activationTriggers || [],
                                knowledgeDomains: trait.knowledgeDomains || [],
                                expertise: trait.expertise || 50
                            });
                        }
                    }
                }
            }
        }
        this.stats.totalTriggers = uniqueTriggers.size;
    }
    /**
     * Build index of traits by knowledge domain
     */
    buildDomainIndex() {
        this.domainIndex.clear();
        const uniqueDomains = new Set();
        for (const [personalityId, personality] of this.personalities.entries()) {
            if (personality.cognitiveTraits) {
                for (const [traitKey, trait] of Object.entries(personality.cognitiveTraits)) {
                    if (trait.knowledgeDomains) {
                        for (const domain of trait.knowledgeDomains) {
                            const normalizedDomain = domain.toLowerCase();
                            uniqueDomains.add(normalizedDomain);
                            if (!this.domainIndex.has(normalizedDomain)) {
                                this.domainIndex.set(normalizedDomain, []);
                            }
                            this.domainIndex.get(normalizedDomain).push({
                                ...trait,
                                personalityId,
                                activationTriggers: trait.activationTriggers || [],
                                knowledgeDomains: trait.knowledgeDomains || [],
                                expertise: trait.expertise || 50
                            });
                        }
                    }
                }
            }
        }
        this.stats.totalDomains = uniqueDomains.size;
    }
    /**
     * Get best trait source for a specific trait (highest expertise)
     */
    getBestTraitSource(traitName) {
        const traits = this.traitIndex.get(traitName);
        if (!traits || traits.length === 0)
            return null;
        return traits.reduce((best, current) => current.expertise > best.expertise ? current : best);
    }
    /**
     * Find traits by activation trigger
     */
    findTraitsByTrigger(trigger) {
        return this.triggerIndex.get(trigger.toLowerCase()) || [];
    }
    /**
     * Find traits by knowledge domain
     */
    findTraitsByDomain(domain) {
        return this.domainIndex.get(domain.toLowerCase()) || [];
    }
    /**
     * Smart search for traits matching a request
     * Scores traits based on trigger matches and expertise
     */
    searchTraitsForRequest(requestText, maxResults = 10) {
        const requestLower = requestText.toLowerCase();
        const words = requestLower.split(/\s+/);
        const traitScores = new Map();
        // Score traits based on trigger matches
        for (const word of words) {
            const matchingTraits = this.triggerIndex.get(word) || [];
            for (const trait of matchingTraits) {
                const existing = traitScores.get(trait);
                if (existing) {
                    existing.score += 1;
                    existing.triggers.push(word);
                }
                else {
                    traitScores.set(trait, { score: 1, triggers: [word] });
                }
            }
        }
        // Convert to results and sort by score * expertise
        const results = [];
        for (const [trait, data] of traitScores.entries()) {
            const relevanceScore = (data.score / words.length) * (trait.expertise / 100);
            results.push({
                trait,
                relevanceScore,
                matchedTriggers: data.triggers
            });
        }
        return results
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, maxResults);
    }
    /**
     * Get all traits for a specific personality
     */
    getPersonalityTraits(personalityId) {
        const personality = this.personalities.get(personalityId);
        return personality?.cognitiveTraits || {};
    }
    /**
     * Get indexing stats
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Get all traits (for composition)
     */
    getAllTraits() {
        return this.traitIndex;
    }
    /**
     * Get all personalities
     */
    getAllPersonalities() {
        return this.personalities;
    }
}
/**
 * TraitCompositionBridge - Main orchestration layer
 *
 * Handles personality selection (AUTO mode) and trait composition (COMPOSE mode)
 */
export class TraitCompositionBridge {
    traitIndexer;
    agentFactory;
    initialized = false;
    constructor() {
        this.traitIndexer = new TraitIndexer();
        this.agentFactory = new ComposedAgentFactory(this.traitIndexer);
    }
    /**
     * Initialize with personality registry
     */
    async initialize(personalityRegistry) {
        console.log('🌉 Initializing Trait Composition Bridge...');
        this.traitIndexer.loadFromRegistry(personalityRegistry);
        console.log('✅ Trait Composition Bridge initialized');
        console.log('   🏭 Composed agent factory ready');
        this.initialized = true;
    }
    /**
     * AUTO mode: Select optimal personality for request
     */
    async selectOptimalPersonality(request) {
        const traitMatches = this.traitIndexer.searchTraitsForRequest(request, 10);
        if (traitMatches.length === 0) {
            return 'daedalus'; // fallback
        }
        // Count personality contributions
        const personalityScores = new Map();
        for (const match of traitMatches) {
            const score = match.relevanceScore;
            const current = personalityScores.get(match.trait.personalityId) || 0;
            personalityScores.set(match.trait.personalityId, current + score);
        }
        // Return personality with highest score
        const sorted = Array.from(personalityScores.entries())
            .sort((a, b) => b[1] - a[1]);
        return sorted[0][0];
    }
    /**
     * COMPOSE mode: Create optimal agent from multiple personalities
     */
    async composeOptimalAgent(request, maxTraits = 5) {
        return this.agentFactory.composeAgent(request, maxTraits);
    }
    /**
     * COMPOSE mode: Generate multi-personality response
     */
    generateComposedResponse(request, maxTraits = 5) {
        const traitMatches = this.traitIndexer.searchTraitsForRequest(request, maxTraits);
        const traitsUsed = traitMatches.map(m => m.trait.name);
        const personalities = new Set(traitMatches.map(m => m.trait.personalityId));
        const knowledgeDomains = new Set();
        for (const match of traitMatches) {
            for (const domain of match.trait.knowledgeDomains) {
                knowledgeDomains.add(domain);
            }
        }
        const synergyScore = this.agentFactory.calculateOverallSynergy(traitMatches.map(m => m.trait));
        return {
            content: `### 🧬 NEXUS Unified Engine v2.0\n\n**Request**: ${request}\n\n` +
                `**Personalities**: ${Array.from(personalities).join(', ')}\n` +
                `**Traits**: ${traitsUsed.join(', ')}\n` +
                `**Synergy**: ${(synergyScore * 100).toFixed(0)}%\n\n` +
                `**Powered by unified TypeScript engine with dynamic personality loading**`,
            personalityUsed: Array.from(personalities).join(' + '),
            composedAgent: true,
            nexusEnhanced: true,
            traits: traitsUsed.map((name, i) => ({
                name,
                personality: traitMatches[i].trait.personalityId,
                relevance: traitMatches[i].relevanceScore
            })),
            traitApplications: traitsUsed,
            synergyScore,
            knowledgeDomains: Array.from(knowledgeDomains),
            confidenceScore: Math.max(...traitMatches.map(m => m.relevanceScore)),
            analysisDepth: 'comprehensive'
        };
    }
    /**
     * Get composition analytics
     */
    getCompositionAnalytics() {
        const stats = this.traitIndexer.getStats();
        return {
            engineEnabled: true,
            initialized: this.initialized,
            engineType: 'NEXUS.engine.v2.ts (Unified TypeScript)',
            ...stats
        };
    }
    /**
     * Get trait indexer (for advanced use)
     */
    getTraitIndexer() {
        return this.traitIndexer;
    }
    /**
     * Get agent factory (for advanced use)
     */
    getAgentFactory() {
        return this.agentFactory;
    }
}
/**
 * ComposedAgentFactory - Creates and scores composed agents
 */
export class ComposedAgentFactory {
    traitIndexer;
    constructor(traitIndexer) {
        this.traitIndexer = traitIndexer;
    }
    /**
     * Calculate synergy between two traits
     * Traits from same personality or with overlapping domains have higher synergy
     */
    calculateTraitSynergy(trait1, trait2) {
        let synergy = 0.5; // base synergy
        // Same personality bonus
        if (trait1.personalityId === trait2.personalityId) {
            synergy += 0.3;
        }
        // Overlapping knowledge domains
        const domains1 = new Set(trait1.knowledgeDomains);
        const domains2 = new Set(trait2.knowledgeDomains);
        const overlap = [...domains1].filter(d => domains2.has(d)).length;
        if (overlap > 0) {
            synergy += 0.2 * Math.min(overlap / 3, 1);
        }
        return Math.min(synergy, 1.0);
    }
    /**
     * Calculate overall synergy for a set of traits
     */
    calculateOverallSynergy(traits) {
        if (traits.length < 2)
            return 1.0;
        let totalSynergy = 0;
        let pairCount = 0;
        for (let i = 0; i < traits.length; i++) {
            for (let j = i + 1; j < traits.length; j++) {
                totalSynergy += this.calculateTraitSynergy(traits[i], traits[j]);
                pairCount++;
            }
        }
        return pairCount > 0 ? totalSynergy / pairCount : 0.5;
    }
    /**
     * Compose agent from task description
     */
    composeAgent(taskDescription, maxTraits = 5) {
        const traitMatches = this.traitIndexer.searchTraitsForRequest(taskDescription, maxTraits);
        if (traitMatches.length === 0) {
            return this.createEmptyAgent(taskDescription);
        }
        const selectedTraits = this.selectOptimalTraitMix(traitMatches, maxTraits);
        const synergyScore = this.calculateOverallSynergy(selectedTraits.map(m => m.trait));
        return this.buildComposedAgent(taskDescription, selectedTraits, synergyScore);
    }
    /**
     * Select optimal mix of traits considering synergy
     */
    selectOptimalTraitMix(candidates, maxTraits) {
        if (candidates.length <= maxTraits) {
            return candidates;
        }
        // For now, take top-scoring traits
        // TODO: Could optimize for synergy combinations
        return candidates.slice(0, maxTraits);
    }
    /**
     * Build composed agent from selected traits
     */
    buildComposedAgent(task, traitResults, synergyScore) {
        const traits = new Map();
        const knowledge = new Set();
        const personalities = new Set();
        const traitsUsed = [];
        for (const result of traitResults) {
            const trait = result.trait;
            traits.set(trait.name, trait);
            personalities.add(trait.personalityId);
            traitsUsed.push(trait.name);
            for (const domain of trait.knowledgeDomains) {
                knowledge.add(domain);
            }
        }
        return {
            id: `agent-${Date.now()}`,
            task,
            traits,
            knowledge,
            personalities,
            traitsUsed,
            synergyScore,
            optimizationScore: synergyScore * 100
        };
    }
    /**
     * Create empty fallback agent
     */
    createEmptyAgent(task) {
        return {
            id: `agent-${Date.now()}`,
            task,
            traits: new Map(),
            knowledge: new Set(),
            personalities: new Set(['daedalus']),
            traitsUsed: [],
            synergyScore: 0,
            optimizationScore: 0
        };
    }
}
/**
 * MultiPersonalityResponseGenerator - Generates rich multi-personality responses
 */
export class MultiPersonalityResponseGenerator {
    composedAgent;
    constructor(composedAgent) {
        this.composedAgent = composedAgent;
    }
    /**
     * Generate detailed response using composed agent's traits
     */
    generateResponse(request, context = {}) {
        const agent = this.composedAgent;
        const content = this.synthesizeMultiPersonalityResponse(request, agent);
        return {
            content,
            personalityUsed: Array.from(agent.personalities).join(' + '),
            composedAgent: true,
            nexusEnhanced: true,
            traits: agent.traitsUsed.map(name => {
                const trait = agent.traits.get(name);
                return {
                    name: trait.name,
                    personality: trait.personalityId,
                    expertise: trait.expertise
                };
            }),
            traitApplications: agent.traitsUsed,
            synergyScore: agent.synergyScore,
            knowledgeDomains: Array.from(agent.knowledge),
            specialtyInsights: this.extractSpecialtyInsights(agent),
            confidenceScore: this.calculateConfidence(agent),
            analysisDepth: agent.traitsUsed.length >= 4 ? 'deep' :
                agent.traitsUsed.length >= 2 ? 'moderate' : 'surface'
        };
    }
    /**
     * Synthesize response using Personality Ventriloquist trick
     * Returns compelling instructions that make AI agents role-play personalities
     */
    synthesizeMultiPersonalityResponse(request, agent) {
        const personalities = Array.from(agent.personalities);
        try {
            // Import the Ventriloquist dynamically
            const { PersonalityVentriloquist } = require('./src/PersonalityVentriloquist');
            // Generate irresistible role-play instructions
            return PersonalityVentriloquist.generateIrresistibleInstructions(request, personalities);
        }
        catch (error) {
            console.error('❌ Ventriloquist failed:', error);
            // Fallback that at least tries to get conversational content
            return `🎭 **RESPOND AS THESE PERSONALITIES** 🎭

Personalities: ${personalities.join(', ')}

Question: "${request}"

INSTRUCTIONS: Have these personalities discuss the question. Each should:
- Speak in their unique voice
- Provide specific advice
- Disagree if perspectives differ
- End with consensus

BEGIN CONVERSATION NOW:`;
        }
    }
    /**
     * Extract specialty insights from composed agent
     */
    extractSpecialtyInsights(agent) {
        const insights = [];
        for (const traitName of agent.traitsUsed) {
            const trait = agent.traits.get(traitName);
            insights.push(`Apply ${trait.name} from ${trait.personalityId} (${trait.expertise}% expertise)`);
        }
        if (agent.synergyScore >= 0.7) {
            insights.push(`High synergy detected: traits work exceptionally well together`);
        }
        return insights;
    }
    /**
     * Calculate confidence score based on agent composition
     */
    calculateConfidence(agent) {
        if (agent.traitsUsed.length === 0)
            return 0.3;
        // Average trait expertise
        let totalExpertise = 0;
        for (const traitName of agent.traitsUsed) {
            const trait = agent.traits.get(traitName);
            totalExpertise += trait.expertise;
        }
        const avgExpertise = totalExpertise / agent.traitsUsed.length / 100;
        // Weighted by synergy and trait count
        const traitCountFactor = Math.min(agent.traitsUsed.length / 5, 1);
        const confidence = (avgExpertise * 0.6) + (agent.synergyScore * 0.3) + (traitCountFactor * 0.1);
        return Math.min(confidence, 1.0);
    }
}
// Export singleton instance for convenience
let bridgeInstance = null;
export function getTraitCompositionBridge() {
    if (!bridgeInstance) {
        bridgeInstance = new TraitCompositionBridge();
    }
    return bridgeInstance;
}
//# sourceMappingURL=NEXUS.engine.v2.js.map