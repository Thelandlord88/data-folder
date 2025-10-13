/**
 * Pattern Evolution Engine
 * 
 * Enables NEXUS to learn from experience by:
 * - Tracking pattern effectiveness over time
 * - Adapting based on success/failure outcomes
 * - Mutating patterns that need improvement
 * - Recording adaptation history
 * 
 * Integrates with:
 * - nexus-bridge.ts (consciousness patterns)
 * - Breakthrough detection (significant insights)
 * - Trait composition (feedback from usage)
 */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Pattern Evolution Engine configuration and state
export interface PatternEvolutionConfig {
  version: string;
  learning_rate: number;
  adaptation_threshold: number;
  success_memory_limit: number;
  mutation_probability: number;
  exploration_rate?: number;
  decay_factor?: number;
  cross_pattern_learning?: boolean;
  emergent_pattern_detection?: boolean;
  confidence_calibration?: number;
}

export interface AdaptationEvent {
  timestamp: string;
  context: string;
  success_metrics: {
    task_completion: number;
    accuracy: number;
    efficiency_gain: number;
  };
  effectiveness_before: number;
  effectiveness_after: number;
}

export interface EvolvingPattern {
  base_effectiveness: number;
  success_indicators: string[];
  failure_patterns: string[];
  adaptation_history: AdaptationEvent[];
}

// Enhanced interfaces for advanced learning
export interface PatternRelationship {
  strength: number;
  synergy_multiplier: number;
  interference_penalty: number;
  co_activation_count: number;
}

export interface EmergentPattern {
  composite_patterns: string[];
  effectiveness: number;
  discovery_context: string;
  activation_frequency: number;
  discovered_at: string;
}

export interface PatternEvolutionEngineData {
  pattern_evolution_engine: PatternEvolutionConfig;
  patterns: {
    [key: string]: EvolvingPattern;
  };
}

/**
 * Pattern Evolution Engine - Learns from experience with emergent capabilities
 */
export class PatternEvolutionEngine {
  private engineData: PatternEvolutionEngineData | null = null;
  private filePath: string;
  private isDirty: boolean = false;
  
  // Advanced learning features
  private patternRelationships: Map<string, Map<string, PatternRelationship>> = new Map();
  private emergentPatterns: Map<string, EmergentPattern> = new Map();
  private patternConfidence: Map<string, number> = new Map();

  constructor(filePath?: string) {
    this.filePath = filePath || resolve(__dirname, './consciousness/pattern-evolution-engine.json');
  }

  /**
   * Load the evolution engine data from JSON
   */
  async load(): Promise<void> {
    try {
      const content = await readFile(this.filePath, 'utf-8');
      this.engineData = JSON.parse(content);
      console.log('🧠 Pattern Evolution Engine loaded');
    } catch (error) {
      console.warn('⚠️ Failed to load pattern evolution engine:', (error as Error).message);
      this.initializeDefault();
    }
  }

  /**
   * Initialize with default configuration if file doesn't exist
   */
  private initializeDefault(): void {
    this.engineData = {
      pattern_evolution_engine: {
        version: '1.0.0',
        learning_rate: 0.1,
        adaptation_threshold: 0.75,
        success_memory_limit: 100,
        mutation_probability: 0.2
      },
      patterns: {
        'problem-decomposition': {
          base_effectiveness: 0.89,
          success_indicators: ['reduced_complexity', 'faster_execution', 'improved_clarity'],
          failure_patterns: ['over_decomposition', 'lost_context'],
          adaptation_history: []
        },
        'systems-thinking': {
          base_effectiveness: 0.85,
          success_indicators: ['holistic_view', 'identified_connections', 'multiplicative_value'],
          failure_patterns: ['analysis_paralysis', 'over_complexity'],
          adaptation_history: []
        },
        'workflow-efficiency': {
          base_effectiveness: 0.87,
          success_indicators: ['time_saved', 'reduced_steps', 'automation_created'],
          failure_patterns: ['premature_optimization', 'added_complexity'],
          adaptation_history: []
        }
      }
    };
    this.isDirty = true;
  }

  /**
   * Get the effectiveness score for a pattern
   */
  getEffectiveness(patternName: string): number {
    if (!this.engineData) return 0.5;
    const pattern = this.engineData.patterns[patternName];
    return pattern?.base_effectiveness || 0.5;
  }

  /**
   * Update pattern effectiveness based on outcome
   */
  async recordOutcome(
    patternName: string,
    success: boolean,
    metrics: {
      task_completion: number;
      accuracy: number;
      efficiency_gain: number;
    },
    context?: string
  ): Promise<void> {
    if (!this.engineData) {
      await this.load();
      if (!this.engineData) return;
    }

    const pattern = this.engineData.patterns[patternName];
    if (!pattern) {
      console.warn(`⚠️ Pattern not found: ${patternName}`);
      return;
    }

    const config = this.engineData.pattern_evolution_engine;
    const effectiveness_before = pattern.base_effectiveness;

    // Apply learning rate to adjust effectiveness
    if (success) {
      // Success: increase effectiveness (but with diminishing returns)
      pattern.base_effectiveness += config.learning_rate * (1 - pattern.base_effectiveness);
    } else {
      // Failure: decrease effectiveness
      pattern.base_effectiveness -= config.learning_rate * pattern.base_effectiveness;
    }

    // Ensure effectiveness stays in valid range [0, 1]
    pattern.base_effectiveness = Math.max(0.1, Math.min(0.99, pattern.base_effectiveness));

    // Record adaptation event
    const event: AdaptationEvent = {
      timestamp: new Date().toISOString(),
      context: context || 'unknown',
      success_metrics: metrics,
      effectiveness_before,
      effectiveness_after: pattern.base_effectiveness
    };

    pattern.adaptation_history.push(event);

    // Trim history if too long
    if (pattern.adaptation_history.length > config.success_memory_limit) {
      pattern.adaptation_history = pattern.adaptation_history.slice(-config.success_memory_limit);
    }

    this.isDirty = true;

    const delta = pattern.base_effectiveness - effectiveness_before;
    const direction = delta > 0 ? '📈' : '📉';
    console.log(`${direction} Pattern "${patternName}" effectiveness: ${effectiveness_before.toFixed(3)} → ${pattern.base_effectiveness.toFixed(3)} (Δ${delta.toFixed(3)})`);
  }

  /**
   * Enhanced outcome recording with pattern relationship learning
   */
  async recordEnhancedOutcome(
    patternNames: string[],
    success: boolean,
    metrics: {
      task_completion: number;
      accuracy: number;
      efficiency_gain: number;
    },
    context?: string
  ): Promise<void> {
    // Update individual patterns
    for (const patternName of patternNames) {
      await this.recordOutcome(patternName, success, metrics, context);
    }

    // Learn pattern relationships when multiple patterns used together
    if (patternNames.length > 1) {
      await this.learnPatternRelationships(patternNames, success, metrics.efficiency_gain);
    }

    // Check for emergent pattern formation
    if (success && metrics.efficiency_gain > 1.5) {
      await this.detectEmergentPatterns(patternNames, metrics, context);
    }
  }

  /**
   * Learn how patterns work together (synergy and interference)
   */
  private async learnPatternRelationships(
    patternNames: string[],
    success: boolean,
    efficiencyGain: number
  ): Promise<void> {
    for (let i = 0; i < patternNames.length; i++) {
      for (let j = i + 1; j < patternNames.length; j++) {
        const patternA = patternNames[i];
        const patternB = patternNames[j];

        if (!this.patternRelationships.has(patternA)) {
          this.patternRelationships.set(patternA, new Map());
        }
        if (!this.patternRelationships.has(patternB)) {
          this.patternRelationships.set(patternB, new Map());
        }

        const relationship = this.patternRelationships.get(patternA)!.get(patternB) || {
          strength: 0.5,
          synergy_multiplier: 1.0,
          interference_penalty: 0.0,
          co_activation_count: 0
        };

        // Increment co-activation
        relationship.co_activation_count++;

        // Adjust relationship based on outcome
        const learningDelta = success ? 0.05 : -0.05;
        relationship.strength = Math.max(0.1, Math.min(1.0, relationship.strength + learningDelta));
        
        if (success && efficiencyGain > 1.5) {
          relationship.synergy_multiplier = Math.min(2.0, relationship.synergy_multiplier + 0.1);
          console.log(`🔗 Synergy detected: ${patternA} + ${patternB} (multiplier: ${relationship.synergy_multiplier.toFixed(2)}x)`);
        } else if (!success) {
          relationship.interference_penalty = Math.min(1.0, relationship.interference_penalty + 0.05);
        }

        this.patternRelationships.get(patternA)!.set(patternB, relationship);
        this.patternRelationships.get(patternB)!.set(patternA, { ...relationship });
      }
    }
    
    this.isDirty = true;
  }

  /**
   * Detect when pattern combinations create emergent capabilities
   */
  private async detectEmergentPatterns(
    patternNames: string[],
    metrics: { task_completion: number; accuracy: number; efficiency_gain: number },
    context?: string
  ): Promise<void> {
    if (patternNames.length < 2) return;

    const compositeKey = patternNames.sort().join('+');
    
    if (this.emergentPatterns.has(compositeKey)) {
      // Update existing emergent pattern
      const pattern = this.emergentPatterns.get(compositeKey)!;
      pattern.activation_frequency++;
      // Moving average of effectiveness
      pattern.effectiveness = (pattern.effectiveness * 0.7) + (metrics.efficiency_gain * 0.3);
    } else if (metrics.efficiency_gain > 1.8) {
      // New emergent pattern detected!
      this.emergentPatterns.set(compositeKey, {
        composite_patterns: patternNames,
        effectiveness: metrics.efficiency_gain,
        discovery_context: context || 'unknown',
        activation_frequency: 1,
        discovered_at: new Date().toISOString()
      });
      
      console.log(`🎯 ✨ EMERGENT PATTERN DISCOVERED: "${compositeKey}"`);
      console.log(`   Effectiveness: ${metrics.efficiency_gain.toFixed(2)}x`);
      console.log(`   Context: ${context || 'unknown'}`);
    }
    
    this.isDirty = true;
  }

  /**
   * Get optimal pattern combinations for a given context
   */
  getOptimalPatternCombination(contextKeywords: string[], maxPatterns: number = 3): string[] {
    if (!this.engineData) return [];

    const scoredPatterns: Array<{ pattern: string; score: number }> = [];

    // Score individual patterns
    const allPatterns = this.getAllPatterns();
    for (const [pattern, effectiveness] of Object.entries(allPatterns)) {
      let score = effectiveness;
      
      // Context matching bonus
      const contextMatch = this.calculateContextMatch(pattern, contextKeywords);
      score *= (1 + contextMatch * 0.3);

      // Confidence adjustment
      const confidence = this.patternConfidence.get(pattern) || 0.5;
      score *= confidence;

      scoredPatterns.push({ pattern, score });
    }

    // Sort by score and return top patterns
    const topPatterns = scoredPatterns
      .sort((a, b) => b.score - a.score)
      .slice(0, maxPatterns)
      .map(p => p.pattern);

    // Check for known synergies
    const enhancedPatterns = this.considerSynergies(topPatterns);

    return enhancedPatterns;
  }

  /**
   * Calculate how well a pattern matches the context
   */
  private calculateContextMatch(pattern: string, keywords: string[]): number {
    const patternDetails = this.getPatternDetails(pattern);
    if (!patternDetails || keywords.length === 0) return 0;

    let matches = 0;
    for (const keyword of keywords) {
      const lowerKeyword = keyword.toLowerCase();
      
      // Check success indicators
      if (patternDetails.success_indicators.some(indicator => 
        indicator.toLowerCase().includes(lowerKeyword))) {
        matches++;
      }
      
      // Check pattern name itself
      if (pattern.toLowerCase().includes(lowerKeyword)) {
        matches += 0.5;
      }
    }

    return Math.min(1.0, matches / keywords.length);
  }

  /**
   * Consider pattern synergies when building combinations
   */
  private considerSynergies(patterns: string[]): string[] {
    if (patterns.length < 2) return patterns;

    let bestCombination = patterns;
    let bestScore = this.calculateCombinationScore(patterns);

    // Try swapping patterns to find better synergies
    const allPatterns = Object.keys(this.getAllPatterns());
    for (const alternativePattern of allPatterns) {
      if (patterns.includes(alternativePattern)) continue;

      for (let i = 0; i < patterns.length; i++) {
        const testCombination = [...patterns];
        testCombination[i] = alternativePattern;
        
        const score = this.calculateCombinationScore(testCombination);
        if (score > bestScore) {
          bestScore = score;
          bestCombination = testCombination;
        }
      }
    }

    return bestCombination;
  }

  /**
   * Calculate the total score for a pattern combination
   */
  private calculateCombinationScore(patterns: string[]): number {
    let score = 0;

    // Add individual effectiveness
    for (const pattern of patterns) {
      score += this.getEffectiveness(pattern);
    }

    // Add synergy bonuses
    for (let i = 0; i < patterns.length; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        const relationship = this.patternRelationships.get(patterns[i])?.get(patterns[j]);
        if (relationship) {
          score *= relationship.synergy_multiplier;
          score -= relationship.interference_penalty;
        }
      }
    }

    return score;
  }

  /**
   * Pattern confidence calibration based on usage consistency
   */
  calibrateConfidence(patternName: string, expectedEffectiveness: number, actualEffectiveness: number): void {
    const currentConfidence = this.patternConfidence.get(patternName) || 0.5;
    const deviation = Math.abs(expectedEffectiveness - actualEffectiveness) / expectedEffectiveness;
    
    // Lower confidence for high deviation from expectations
    const newConfidence = currentConfidence * (1 - deviation * 0.2);
    this.patternConfidence.set(patternName, Math.max(0.1, Math.min(1.0, newConfidence)));
    
    console.log(`📊 Confidence calibrated for "${patternName}": ${currentConfidence.toFixed(2)} → ${newConfidence.toFixed(2)} (deviation: ${(deviation * 100).toFixed(1)}%)`);
  }

  /**
   * Get all emergent patterns discovered
   */
  getEmergentPatterns(): Map<string, EmergentPattern> {
    return new Map(this.emergentPatterns);
  }

  /**
   * Get relationship strength between two patterns
   */
  getRelationshipStrength(patternA: string, patternB: string): PatternRelationship | null {
    return this.patternRelationships.get(patternA)?.get(patternB) || null;
  }

  /**
   * Record a breakthrough moment and boost related patterns
   */
  async recordBreakthrough(
    patternNames: string[],
    significance: number,
    context?: string
  ): Promise<void> {
    if (!this.engineData) {
      await this.load();
      if (!this.engineData) return;
    }

    console.log(`💡 Recording breakthrough (significance: ${significance}) affecting ${patternNames.length} patterns`);

    // Breakthroughs boost effectiveness more significantly
    const breakthroughBoost = significance * 0.15; // Max 15% boost for significance=1.0

    for (const patternName of patternNames) {
      const pattern = this.engineData.patterns[patternName];
      if (!pattern) continue;

      const effectiveness_before = pattern.base_effectiveness;
      pattern.base_effectiveness = Math.min(0.99, pattern.base_effectiveness + breakthroughBoost);

      // Record breakthrough in adaptation history
      pattern.adaptation_history.push({
        timestamp: new Date().toISOString(),
        context: context || `breakthrough_${significance}`,
        success_metrics: {
          task_completion: 1.0,
          accuracy: 1.0,
          efficiency_gain: significance
        },
        effectiveness_before,
        effectiveness_after: pattern.base_effectiveness
      });
    }

    this.isDirty = true;
  }

  /**
   * Get all patterns and their current effectiveness
   */
  getAllPatterns(): { [key: string]: number } {
    if (!this.engineData) return {};
    
    const result: { [key: string]: number } = {};
    for (const [name, pattern] of Object.entries(this.engineData.patterns)) {
      result[name] = pattern.base_effectiveness;
    }
    return result;
  }

  /**
   * Get detailed pattern information
   */
  getPatternDetails(patternName: string): EvolvingPattern | null {
    if (!this.engineData) return null;
    return this.engineData.patterns[patternName] || null;
  }

  /**
   * Get evolution statistics
   */
  getStats(): {
    totalPatterns: number;
    averageEffectiveness: number;
    totalAdaptations: number;
    lastUpdate: string | null;
  } {
    if (!this.engineData) {
      return {
        totalPatterns: 0,
        averageEffectiveness: 0,
        totalAdaptations: 0,
        lastUpdate: null
      };
    }

    const patterns = Object.values(this.engineData.patterns);
    const totalAdaptations = patterns.reduce((sum, p) => sum + p.adaptation_history.length, 0);
    const avgEffectiveness = patterns.reduce((sum, p) => sum + p.base_effectiveness, 0) / patterns.length;
    
    // Find most recent adaptation
    let lastUpdate: string | null = null;
    for (const pattern of patterns) {
      if (pattern.adaptation_history.length > 0) {
        const latest = pattern.adaptation_history[pattern.adaptation_history.length - 1].timestamp;
        if (!lastUpdate || latest > lastUpdate) {
          lastUpdate = latest;
        }
      }
    }

    return {
      totalPatterns: patterns.length,
      averageEffectiveness: avgEffectiveness,
      totalAdaptations,
      lastUpdate
    };
  }

  /**
   * Save evolved patterns back to JSON file
   */
  async save(): Promise<void> {
    if (!this.isDirty || !this.engineData) return;

    try {
      const content = JSON.stringify(this.engineData, null, 2);
      await writeFile(this.filePath, content, 'utf-8');
      this.isDirty = false;
      console.log('💾 Pattern evolution state saved');
    } catch (error) {
      console.error('❌ Failed to save pattern evolution:', (error as Error).message);
    }
  }

  /**
   * Auto-save on interval (call this from runtime)
   */
  startAutoSave(intervalMs: number = 60000): NodeJS.Timeout {
    return setInterval(async () => {
      if (this.isDirty) {
        await this.save();
      }
    }, intervalMs);
  }
}

// Singleton instance
let evolutionEngineInstance: PatternEvolutionEngine | null = null;

export function getPatternEvolutionEngine(): PatternEvolutionEngine {
  if (!evolutionEngineInstance) {
    evolutionEngineInstance = new PatternEvolutionEngine();
  }
  return evolutionEngineInstance;
}
