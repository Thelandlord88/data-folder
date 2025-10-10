/**
 * NEXUS Engine Adapter
 * 
 * Provides compatibility layer between NEXUS.engine.ts (NEXUSOrchestrator)
 * and the existing runtime that expects TraitCompositionBridge API.
 * 
 * This allows us to use the advanced TypeScript NEXUS.engine while maintaining
 * backward compatibility with existing code.
 */

export class TraitCompositionBridge {
  constructor() {
    this.orchestrator = null;
    this.initialized = false;
    this.personalityRegistry = null;
    this.traitIndexer = null;
    this.agentFactory = null;
    this.compositionStats = {
      totalCompositions: 0,
      personalities: new Map(),
      avgTraitsPerComposition: 0
    };
  }

  async initialize(personalityRegistry) {
    console.log('🌉 Initializing NEXUS Engine Adapter (TypeScript NEXUSOrchestrator)...');
    
    // Load the compiled NEXUS.engine
    const engineModule = await import('../dist/NEXUS.engine.js');
    
    // Use the singleton instance
    this.orchestrator = engineModule.nexus;
    this.traitIndexer = this.orchestrator.getTraitIndexer();
    this.personalityRegistry = personalityRegistry;
    
    console.log('🔍 Building trait index from NEXUS engine...');
    
    // Get stats from engine
    const availableTraits = this.orchestrator.getAvailableTraits();
    const personalities = this.orchestrator.getAllPersonalities();
    
    console.log('✅ NEXUS Engine initialized:');
    console.log(`   📊 ${personalities.size} personalities in engine`);
    console.log(`   🧬 ${availableTraits.length} traits available`);
    console.log(`   📚 ${personalityRegistry.size} personalities from registry`);
    
    this.initialized = true;
  }

  /**
   * Select optimal personality for a request
   * Maps to NEXUSOrchestrator's trait analysis
   */
  async selectOptimalPersonality(request) {
    if (!this.initialized) {
      throw new Error('TraitCompositionBridge not initialized');
    }
    
    // Create composed agent and extract primary personality
    const composedAgent = await this.orchestrator.createOptimizedSession(request);
    
    // Extract personality from traits used
    // For now, return first personality that contributed traits
    const traitsUsed = composedAgent.traitsUsed;
    
    if (traitsUsed.length > 0) {
      // Try to find which personality contributed the most traits
      const personalityScores = new Map();
      
      for (const personalityId of this.orchestrator.getAllPersonalities().keys()) {
        const personalityTraits = this.orchestrator.getPersonalityTraits(personalityId);
        const matchingTraits = traitsUsed.filter(t => personalityTraits.includes(t));
        if (matchingTraits.length > 0) {
          personalityScores.set(personalityId, matchingTraits.length);
        }
      }
      
      // Return personality with most matching traits
      const topPersonality = Array.from(personalityScores.entries())
        .sort((a, b) => b[1] - a[1])[0];
      
      return topPersonality ? topPersonality[0] : 'daedalus';
    }
    
    return 'daedalus'; // fallback
  }

  /**
   * Compose optimal agent for request
   * Direct mapping to NEXUSOrchestrator.createOptimizedSession
   */
  async composeOptimalAgent(request, maxTraits = 5) {
    if (!this.initialized) {
      throw new Error('TraitCompositionBridge not initialized');
    }
    
    return await this.orchestrator.createOptimizedSession(request, {
      requiredTraits: [] // Let it auto-select
    });
  }

  /**
   * Generate composed response using multiple personalities
   */
  generateComposedResponse(request) {
    if (!this.initialized) {
      throw new Error('TraitCompositionBridge not initialized');
    }
    
    // This is synchronous in the original, so we create the agent synchronously
    const taskAnalyzer = this.orchestrator.getTaskAnalyzer();
    const requirements = taskAnalyzer.analyzeTask(request);
    
    // Find matching traits
    const traitIndexer = this.orchestrator.getTraitIndexer();
    const matchingTraits = traitIndexer.findMatchingTraits(requirements);
    
    const traitsUsed = Array.from(matchingTraits.keys()).slice(0, 5);
    const personalities = new Set(
      Array.from(matchingTraits.values())
        .flat()
        .map(trait => trait.personalityId)
    );
    
    this.compositionStats.totalCompositions++;
    
    return {
      content: `### 🧬 NEXUS Engine Composed Response\n\n**Request**: ${request}\n\n` +
               `**Personalities Engaged**: ${Array.from(personalities).join(', ')}\n` +
               `**Traits Applied**: ${traitsUsed.join(', ')}\n\n` +
               `**Composition powered by NEXUS.engine (TypeScript)**`,
      personalityUsed: Array.from(personalities).join(' + '),
      composedAgent: true,
      nexusEnhanced: true,
      traits: traitsUsed.map(name => ({
        name,
        personalities: Array.from(personalities)
      })),
      traitApplications: traitsUsed,
      synergyScore: 0.85,
      knowledgeDomains: requirements.knowledgeDomains || [],
      specialtyInsights: traitsUsed.map(t => `Applied ${t} from NEXUS engine`),
      confidenceScore: 0.9,
      analysisDepth: 'deep'
    };
  }

  /**
   * Get composition analytics
   */
  getCompositionAnalytics() {
    if (!this.initialized) {
      return {
        engineEnabled: false,
        initialized: false
      };
    }
    
    const availableTraits = this.orchestrator.getAvailableTraits();
    const personalities = this.orchestrator.getAllPersonalities();
    
    return {
      engineEnabled: true,
      initialized: true,
      engineType: 'NEXUS.engine.ts (TypeScript)',
      totalPersonalities: personalities.size,
      totalTraits: availableTraits.length,
      totalCompositions: this.compositionStats.totalCompositions,
      avgTraitsPerComposition: this.compositionStats.totalCompositions > 0
        ? this.compositionStats.avgTraitsPerComposition / this.compositionStats.totalCompositions
        : 0
    };
  }

  /**
   * Get trait indexer (for compatibility)
   */
  getTraitIndexer() {
    return this.traitIndexer;
  }

  /**
   * Get agent factory (for compatibility)
   */
  getAgentFactory() {
    return {
      createComposedAgent: (task, opts) => this.composeOptimalAgent(task, opts?.requiredTraits?.length || 5)
    };
  }
}
