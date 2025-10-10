/**
 * NEXUS Trait Composition Engine (JavaScript)
 * 
 * Transforms personalities from monolithic entities into 
 * composable cognitive modules for optimal task execution.
 * 
 * Converted from NEXUS.engine.ts for runtime integration.
 */

/**
 * @typedef {Object} PersonalityTrait
 * @property {string} name - Name of the cognitive trait
 * @property {string} description - Detailed description of the trait's capability
 * @property {string[]} activationTriggers - Keywords that activate this trait
 * @property {string[]} knowledgeDomains - Domains of expertise for this trait
 * @property {number} expertise - Expertise level (0-100)
 * @property {string} personalityId - ID of the personality this trait belongs to
 * @property {string[]} [verificationMethods] - Methods to verify trait effectiveness
 */

/**
 * @typedef {Object} TaskRequirements
 * @property {string} domain - Primary domain of the task
 * @property {'simple'|'moderate'|'complex'|'expert'} complexity - Task complexity level
 * @property {string[]} requiredCapabilities - Required capabilities for the task
 * @property {string[]} contextTriggers - Context-specific trigger words
 */

/**
 * @typedef {Object} TraitSearchResult
 * @property {PersonalityTrait} trait - The matched trait
 * @property {number} relevanceScore - How relevant this trait is (0-1)
 * @property {string[]} matchedTriggers - Which triggers matched
 */

/**
 * TraitIndexer - Indexes and searches cognitive traits across all personalities
 */
export class TraitIndexer {
  constructor() {
    /** @type {Map<string, PersonalityTrait[]>} */
    this.traitIndex = new Map();
    
    /** @type {Map<string, PersonalityTrait[]>} */
    this.triggerIndex = new Map();
    
    /** @type {Map<string, PersonalityTrait[]>} */
    this.domainIndex = new Map();
    
    /** @type {Map<string, any>} */
    this.personalities = new Map();
    
    this.stats = {
      totalPersonalities: 0,
      totalTraits: 0,
      totalTriggers: 0,
      totalDomains: 0
    };
  }

  /**
   * Load personalities from the registry
   * @param {Map<string, any>} personalityRegistry - Registry from PersonalityRegistryLoader
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
   * @private
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

          // Add trait with personality reference
          this.traitIndex.get(traitName).push({
            ...trait,
            personalityId,
            traitKey
          });
        }
      }
    }

    this.stats.totalTraits = traitCount;
  }

  /**
   * Build index of traits by activation trigger
   * @private
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
                traitKey
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
   * @private
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
                traitKey
              });
            }
          }
        }
      }
    }

    this.stats.totalDomains = uniqueDomains.size;
  }

  /**
   * Get the best source for a specific trait (highest expertise)
   * @param {string} traitName - Name of the trait to find
   * @returns {PersonalityTrait|null}
   */
  getBestTraitSource(traitName) {
    const sources = this.traitIndex.get(traitName);
    if (!sources || sources.length === 0) return null;

    return sources.reduce((best, current) => 
      current.expertise > best.expertise ? current : best
    );
  }

  /**
   * Find traits that match a specific trigger word
   * @param {string} trigger - Trigger word to search for
   * @returns {PersonalityTrait[]} - Matching traits sorted by expertise
   */
  findTraitsByTrigger(trigger) {
    const normalizedTrigger = trigger.toLowerCase();
    const matchingTraits = [];

    // Direct trigger match
    if (this.triggerIndex.has(normalizedTrigger)) {
      matchingTraits.push(...this.triggerIndex.get(normalizedTrigger));
    }

    // Fuzzy match - check if trigger is contained in any indexed trigger
    for (const [indexedTrigger, traits] of this.triggerIndex.entries()) {
      if (indexedTrigger.includes(normalizedTrigger) || normalizedTrigger.includes(indexedTrigger)) {
        for (const trait of traits) {
          if (!matchingTraits.find(t => t.name === trait.name && t.personalityId === trait.personalityId)) {
            matchingTraits.push(trait);
          }
        }
      }
    }

    return matchingTraits.sort((a, b) => b.expertise - a.expertise);
  }

  /**
   * Find traits by knowledge domain
   * @param {string} domain - Knowledge domain to search for
   * @returns {PersonalityTrait[]} - Matching traits sorted by expertise
   */
  findTraitsByDomain(domain) {
    const normalizedDomain = domain.toLowerCase();
    const matchingTraits = this.domainIndex.get(normalizedDomain) || [];
    
    return matchingTraits.sort((a, b) => b.expertise - a.expertise);
  }

  /**
   * Search for traits relevant to a request
   * @param {string} requestText - The user's request text
   * @param {number} maxResults - Maximum number of results to return
   * @returns {TraitSearchResult[]} - Matched traits with relevance scores
   */
  searchTraitsForRequest(requestText, maxResults = 10) {
    const words = requestText.toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 3); // Filter out short words

    const traitScores = new Map();

    // Search by triggers
    for (const word of words) {
      const matchingTraits = this.findTraitsByTrigger(word);
      
      for (const trait of matchingTraits) {
        const key = `${trait.personalityId}:${trait.name}`;
        const currentScore = traitScores.get(key) || { trait, score: 0, matchedTriggers: [] };
        
        currentScore.score += (trait.expertise / 100) * 0.7; // Weight by expertise
        currentScore.matchedTriggers.push(word);
        
        traitScores.set(key, currentScore);
      }
    }

    // Convert to array and sort by score
    const results = Array.from(traitScores.values())
      .map(({ trait, score, matchedTriggers }) => ({
        trait,
        relevanceScore: Math.min(1, score), // Cap at 1.0
        matchedTriggers: [...new Set(matchedTriggers)] // Unique triggers
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);

    return results;
  }

  /**
   * Get all traits from a specific personality
   * @param {string} personalityId - ID of the personality
   * @returns {PersonalityTrait[]}
   */
  getPersonalityTraits(personalityId) {
    const personality = this.personalities.get(personalityId);
    if (!personality || !personality.cognitiveTraits) return [];

    return Object.entries(personality.cognitiveTraits).map(([traitKey, trait]) => ({
      ...trait,
      personalityId,
      traitKey
    }));
  }

  /**
   * Get statistics about the trait index
   * @returns {Object} - Index statistics
   */
  getStats() {
    return {
      ...this.stats,
      traitsPerPersonality: this.stats.totalTraits / this.stats.totalPersonalities,
      triggersPerTrait: this.stats.totalTriggers / this.stats.totalTraits,
      domainsPerTrait: this.stats.totalDomains / this.stats.totalTraits
    };
  }

  /**
   * Get all indexed traits
   * @returns {Map<string, PersonalityTrait[]>}
   */
  getAllTraits() {
    return this.traitIndex;
  }

  /**
   * Get all personalities
   * @returns {Map<string, any>}
   */
  getAllPersonalities() {
    return this.personalities;
  }
}

/**
 * TraitCompositionBridge - Integrates trait composition with NEXUS runtime
 */
export class TraitCompositionBridge {
  constructor() {
    this.traitIndexer = new TraitIndexer();
    this.agentFactory = null;
    this.initialized = false;
    this.compositionHistory = [];
  }

  /**
   * Initialize with personality registry
   * @param {Map<string, any>} personalityRegistry
   */
  async initialize(personalityRegistry) {
    console.log('🌉 Initializing Trait Composition Bridge...');
    
    this.traitIndexer.loadFromRegistry(personalityRegistry);
    this.agentFactory = new ComposedAgentFactory(this.traitIndexer);
    this.initialized = true;
    
    console.log('✅ Trait Composition Bridge initialized');
    console.log('   🏭 Composed agent factory ready');
    return this;
  }

  /**
   * Select optimal personality based on request
   * @param {string} request - User's request
   * @returns {string} - Personality ID
   */
  selectOptimalPersonality(request) {
    if (!this.initialized) {
      throw new Error('TraitCompositionBridge not initialized');
    }

    const traitMatches = this.traitIndexer.searchTraitsForRequest(request, 5);
    
    if (traitMatches.length === 0) {
      return 'sage'; // Default fallback
    }

    // Count personality occurrences in top matches
    const personalityCounts = new Map();
    for (const match of traitMatches) {
      const pid = match.trait.personalityId;
      personalityCounts.set(pid, (personalityCounts.get(pid) || 0) + match.relevanceScore);
    }

    // Return personality with highest total relevance
    let bestPersonality = 'sage';
    let bestScore = 0;

    for (const [personality, score] of personalityCounts.entries()) {
      if (score > bestScore) {
        bestScore = score;
        bestPersonality = personality;
      }
    }

    return bestPersonality;
  }

  /**
   * Compose an optimal multi-personality agent for request
   * @param {string} request - User's request
   * @param {number} maxTraits - Maximum traits to compose (default: 5)
   * @returns {ComposedAgent}
   */
  composeOptimalAgent(request, maxTraits = 5) {
    if (!this.initialized || !this.agentFactory) {
      throw new Error('TraitCompositionBridge not initialized');
    }

    const agent = this.agentFactory.composeAgent(request, maxTraits);
    
    // Record composition
    this.compositionHistory.push({
      timestamp: new Date().toISOString(),
      request: request.substring(0, 100),
      traitsUsed: agent.traits.length,
      personalitiesUsed: agent.personalitiesUsed.length,
      synergyScore: agent.synergyScore
    });

    return agent;
  }

  /**
   * Generate response using composed agent
   * @param {string} request 
   * @param {number} maxTraits 
   * @returns {Object}
   */
  generateComposedResponse(request, maxTraits = 5) {
    const agent = this.composeOptimalAgent(request, maxTraits);
    const generator = new MultiPersonalityResponseGenerator(agent);
    return generator.generateResponse(request);
  }

  /**
   * Get trait composition analytics
   * @returns {Object}
   */
  getCompositionAnalytics() {
    if (!this.initialized) {
      return { initialized: false };
    }

    const stats = this.traitIndexer.getStats();
    
    // Analyze composition history
    const historyStats = {
      totalCompositions: this.compositionHistory.length,
      avgTraitsPerComposition: 0,
      avgPersonalitiesPerComposition: 0,
      avgSynergyScore: 0
    };

    if (this.compositionHistory.length > 0) {
      historyStats.avgTraitsPerComposition = 
        this.compositionHistory.reduce((sum, c) => sum + c.traitsUsed, 0) / this.compositionHistory.length;
      
      historyStats.avgPersonalitiesPerComposition = 
        this.compositionHistory.reduce((sum, c) => sum + c.personalitiesUsed, 0) / this.compositionHistory.length;
      
      historyStats.avgSynergyScore = 
        this.compositionHistory.reduce((sum, c) => sum + c.synergyScore, 0) / this.compositionHistory.length;
    }
    
    return {
      initialized: true,
      ...stats,
      ...historyStats,
      indexHealth: stats.totalTraits > 0 ? 'healthy' : 'empty',
      composedAgentFactoryReady: this.agentFactory !== null
    };
  }

  /**
   * Get trait indexer instance
   * @returns {TraitIndexer}
   */
  getTraitIndexer() {
    return this.traitIndexer;
  }

  /**
   * Get agent factory instance
   * @returns {ComposedAgentFactory}
   */
  getAgentFactory() {
    return this.agentFactory;
  }
}

/**
 * @typedef {Object} ComposedAgent
 * @property {string} id - Unique identifier for this composed agent
 * @property {string} task - The task this agent was composed for
 * @property {PersonalityTrait[]} traits - Selected traits for this agent
 * @property {Set<string>} knowledgeDomains - Combined knowledge domains
 * @property {Map<string, PersonalityTrait>} traitsByName - Quick trait lookup
 * @property {number} synergyScore - How well traits work together (0-1)
 * @property {string[]} personalitiesUsed - Which personalities contributed traits
 */

/**
 * ComposedAgentFactory - Creates optimal multi-personality agents
 */
export class ComposedAgentFactory {
  constructor(traitIndexer) {
    this.traitIndexer = traitIndexer;
  }

  /**
   * Calculate synergy score between two traits
   * @param {PersonalityTrait} trait1 
   * @param {PersonalityTrait} trait2 
   * @returns {number} - Synergy score (0-1)
   */
  calculateTraitSynergy(trait1, trait2) {
    let synergyScore = 0;
    
    // 1. Domain overlap - traits with shared domains work well together
    const domains1 = new Set(trait1.knowledgeDomains || []);
    const domains2 = new Set(trait2.knowledgeDomains || []);
    const sharedDomains = [...domains1].filter(d => domains2.has(d));
    const domainSynergy = sharedDomains.length / Math.max(domains1.size, domains2.size, 1);
    synergyScore += domainSynergy * 0.3;
    
    // 2. Trigger complementarity - non-overlapping triggers = complementary
    const triggers1 = new Set((trait1.activationTriggers || []).map(t => t.toLowerCase()));
    const triggers2 = new Set((trait2.activationTriggers || []).map(t => t.toLowerCase()));
    const sharedTriggers = [...triggers1].filter(t => triggers2.has(t));
    const triggerOverlap = sharedTriggers.length / Math.max(triggers1.size, triggers2.size, 1);
    const complementarity = 1 - triggerOverlap; // Lower overlap = more complementary
    synergyScore += complementarity * 0.3;
    
    // 3. Expertise balance - similar expertise levels work well together
    const expertiseDiff = Math.abs(trait1.expertise - trait2.expertise);
    const expertiseBalance = 1 - (expertiseDiff / 100);
    synergyScore += expertiseBalance * 0.2;
    
    // 4. Same personality penalty - prefer diverse sources
    if (trait1.personalityId === trait2.personalityId) {
      synergyScore *= 0.7; // 30% penalty for same-personality traits
    }
    
    // 5. High expertise bonus - both high expertise = extra synergy
    if (trait1.expertise >= 90 && trait2.expertise >= 90) {
      synergyScore += 0.2;
    }
    
    return Math.min(1, synergyScore);
  }

  /**
   * Calculate overall synergy for a set of traits
   * @param {PersonalityTrait[]} traits 
   * @returns {number} - Average synergy score
   */
  calculateOverallSynergy(traits) {
    if (traits.length < 2) return 0.5;
    
    let totalSynergy = 0;
    let pairCount = 0;
    
    // Calculate pairwise synergy
    for (let i = 0; i < traits.length; i++) {
      for (let j = i + 1; j < traits.length; j++) {
        totalSynergy += this.calculateTraitSynergy(traits[i], traits[j]);
        pairCount++;
      }
    }
    
    return pairCount > 0 ? totalSynergy / pairCount : 0.5;
  }

  /**
   * Compose an optimal agent for a task
   * @param {string} taskDescription - Description of the task
   * @param {number} maxTraits - Maximum traits to include (default: 5)
   * @returns {ComposedAgent}
   */
  composeAgent(taskDescription, maxTraits = 5) {
    // 1. Search for relevant traits
    const traitMatches = this.traitIndexer.searchTraitsForRequest(taskDescription, maxTraits * 3);
    
    if (traitMatches.length === 0) {
      // No matches - return empty agent
      return this.createEmptyAgent(taskDescription);
    }
    
    // 2. Select top traits with diversity
    const selectedTraits = this.selectOptimalTraitMix(traitMatches, maxTraits);
    
    // 3. Calculate synergy
    const synergyScore = this.calculateOverallSynergy(selectedTraits);
    
    // 4. Build composed agent
    return this.buildComposedAgent(taskDescription, selectedTraits, synergyScore);
  }

  /**
   * Select optimal mix of traits considering synergy and diversity
   * @param {TraitSearchResult[]} traitMatches 
   * @param {number} maxTraits 
   * @returns {PersonalityTrait[]}
   */
  selectOptimalTraitMix(traitMatches, maxTraits) {
    const selected = [];
    const personalitiesUsed = new Set();
    
    // Greedy selection with diversity
    for (const match of traitMatches) {
      if (selected.length >= maxTraits) break;
      
      const trait = match.trait;
      
      // Calculate how well this trait synergizes with already-selected traits
      let avgSynergyWithSelected = 0;
      if (selected.length > 0) {
        avgSynergyWithSelected = selected.reduce((sum, t) => 
          sum + this.calculateTraitSynergy(trait, t), 0) / selected.length;
      } else {
        avgSynergyWithSelected = 1; // First trait always selected
      }
      
      // Bonus for new personality
      const diversityBonus = personalitiesUsed.has(trait.personalityId) ? 0 : 0.2;
      
      // Combined score
      const selectionScore = (match.relevanceScore * 0.5) + 
                            (avgSynergyWithSelected * 0.3) + 
                            diversityBonus;
      
      // Select if score is good enough or we need more traits
      if (selectionScore > 0.4 || selected.length < 2) {
        selected.push(trait);
        personalitiesUsed.add(trait.personalityId);
      }
    }
    
    return selected;
  }

  /**
   * Build the composed agent object
   * @param {string} task 
   * @param {PersonalityTrait[]} traits 
   * @param {number} synergyScore 
   * @returns {ComposedAgent}
   */
  buildComposedAgent(task, traits, synergyScore) {
    const knowledgeDomains = new Set();
    const traitsByName = new Map();
    const personalitiesUsed = new Set();
    
    for (const trait of traits) {
      // Collect knowledge domains
      if (trait.knowledgeDomains) {
        trait.knowledgeDomains.forEach(d => knowledgeDomains.add(d));
      }
      
      // Index by name
      traitsByName.set(trait.name, trait);
      
      // Track personalities
      personalitiesUsed.add(trait.personalityId);
    }
    
    return {
      id: `composed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      task,
      traits,
      knowledgeDomains,
      traitsByName,
      synergyScore,
      personalitiesUsed: Array.from(personalitiesUsed)
    };
  }

  /**
   * Create an empty agent as fallback
   * @param {string} task 
   * @returns {ComposedAgent}
   */
  createEmptyAgent(task) {
    return {
      id: `empty-${Date.now()}`,
      task,
      traits: [],
      knowledgeDomains: new Set(),
      traitsByName: new Map(),
      synergyScore: 0,
      personalitiesUsed: []
    };
  }
}

/**
 * MultiPersonalityResponseGenerator - Generates responses using composed agents
 */
export class MultiPersonalityResponseGenerator {
  constructor(composedAgent) {
    this.composedAgent = composedAgent;
  }

  /**
   * Generate a response using the composed agent's traits
   * @param {string} request 
   * @param {Object} context 
   * @returns {Object}
   */
  generateResponse(request, context = {}) {
    const agent = this.composedAgent;
    
    // Build response content
    const content = this.synthesizeMultiPersonalityResponse(request, agent);
    
    return {
      content,
      personalityUsed: agent.personalitiesUsed.join(' + '),
      composedAgent: true,
      nexusEnhanced: true,
      traits: agent.traits.map(t => ({
        name: t.name,
        personality: t.personalityId,
        expertise: t.expertise
      })),
      traitApplications: agent.traits.map(t => t.name),
      synergyScore: agent.synergyScore,
      knowledgeDomains: Array.from(agent.knowledgeDomains),
      specialtyInsights: this.extractSpecialtyInsights(agent),
      confidenceScore: this.calculateConfidence(agent),
      analysisDepth: agent.traits.length >= 4 ? 'deep' : agent.traits.length >= 2 ? 'moderate' : 'surface'
    };
  }

  /**
   * Synthesize response from multiple personality perspectives
   * @param {string} request 
   * @param {ComposedAgent} agent 
   * @returns {string}
   */
  synthesizeMultiPersonalityResponse(request, agent) {
    const { traits, personalitiesUsed, synergyScore } = agent;
    
    let content = `### 🧬 Multi-Personality Composed Response\n\n`;
    content += `**Request**: ${request}\n\n`;
    content += `**Composed Agent**: ${personalitiesUsed.join(' + ')}\n`;
    content += `**Synergy Score**: ${(synergyScore * 100).toFixed(0)}%\n\n`;
    
    content += `### 🎯 Trait Composition\n\n`;
    traits.forEach((trait, idx) => {
      content += `${idx + 1}. **${trait.name}** (${trait.personalityId})\n`;
      content += `   - Expertise: ${trait.expertise}%\n`;
      content += `   - ${trait.description}\n\n`;
    });
    
    content += `### 💡 Integrated Analysis\n\n`;
    content += `This response leverages cognitive capabilities from ${personalitiesUsed.length} different personalities, `;
    content += `creating a ${synergyScore >= 0.7 ? 'highly synergistic' : synergyScore >= 0.5 ? 'balanced' : 'diverse'} `;
    content += `analytical framework.\n\n`;
    
    // Add trait-specific insights
    content += `### 🔍 Multi-Perspective Insights\n\n`;
    traits.forEach(trait => {
      content += `**${trait.personalityId}'s ${trait.name}**:\n`;
      content += `- Brings ${trait.knowledgeDomains?.slice(0, 3).join(', ')} expertise\n`;
      content += `- Activates on: ${trait.activationTriggers?.slice(0, 4).join(', ')}\n\n`;
    });
    
    content += `*This composed agent combines the best traits from multiple personalities for optimal task execution.*\n`;
    
    return content;
  }

  /**
   * Extract specialty insights from composed agent
   * @param {ComposedAgent} agent 
   * @returns {string[]}
   */
  extractSpecialtyInsights(agent) {
    const insights = [];
    
    for (const trait of agent.traits) {
      insights.push(`Apply ${trait.name} from ${trait.personalityId} (${trait.expertise}% expertise)`);
    }
    
    if (agent.synergyScore >= 0.7) {
      insights.push(`High synergy detected: traits work exceptionally well together`);
    }
    
    return insights;
  }

  /**
   * Calculate confidence score based on agent composition
   * @param {ComposedAgent} agent 
   * @returns {number}
   */
  calculateConfidence(agent) {
    if (agent.traits.length === 0) return 0.3;
    
    // Average expertise
    const avgExpertise = agent.traits.reduce((sum, t) => sum + t.expertise, 0) / agent.traits.length;
    
    // Combine with synergy
    return Math.min(0.95, (avgExpertise / 100) * 0.7 + agent.synergyScore * 0.3);
  }
}
