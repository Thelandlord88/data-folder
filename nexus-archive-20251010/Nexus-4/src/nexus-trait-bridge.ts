#!/usr/bin/env node
/**
 * NEXUS Trait Composition Bridge (TypeScript)
 * 
 * This bridge connects the NEXUS runtime with the advanced trait composition system.
 * It enables intelligent strategic trait selection and composition instead of 
 * loading full personalities, with full type safety and strategic intelligence.
 */

import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  CognitiveTrait,
  PersonalityId,
  TraitId,
  StrategicPersonality,
  TraitSynergy,
  TaskAnalysis,
  OptimizedSession
} from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Strategic trait mapping interfaces
interface PersonalityTraitMapping {
  coreTraits: string[];
  domains: string[];
  triggers: string[];
  strategicCapabilities: string[];
  synergyPotential: Record<string, number>;
}

interface TraitComposition {
  primaryTraits: CognitiveTrait[];
  supportingTraits: CognitiveTrait[];
  synergies: TraitSynergy[];
  strategicValue: number;
  optimizationScore: number;
}

export class NexusTraitBridge {
  private personalityTraits: Map<PersonalityId, PersonalityTraitMapping>;
  private traitIndex: Map<string, CognitiveTrait[]>;
  private strategicTraitMappings: Map<string, string[]>;
  private initialized: boolean = false;

  constructor() {
    console.log('🧬 Initializing NEXUS Trait Composition Bridge with Strategic Intelligence');
    
    this.personalityTraits = new Map();
    this.traitIndex = new Map();
    this.strategicTraitMappings = new Map();
    
    this.initializePersonalityTraitMappings();
    this.initializeStrategicTraitMappings();
  }

  /**
   * Initialize with strategic intelligence-enhanced personality trait mappings
   */
  private initializePersonalityTraitMappings(): void {
    // Enhanced Bob with strategic debugging capabilities
    this.personalityTraits.set('bob', {
      coreTraits: ['systemicDebugging', 'empiricalValidation', 'brutalHonesty', 'strategicDebugging'],
      domains: ['debugging', 'testing', 'security', 'performance-analysis', 'strategic-troubleshooting'],
      triggers: ['bug', 'debug', 'audit', 'verify', 'evidence', 'proof', 'strategic-debug'],
      strategicCapabilities: ['proactive-issue-detection', 'strategic-root-cause-analysis', 'systemic-problem-solving'],
      synergyPotential: { hunter: 0.9, stellar: 0.7, daedalus: 0.8 }
    });

    // Enhanced Hunter with strategic intelligence
    this.personalityTraits.set('hunter', {
      coreTraits: [
        'strategicIntelligenceGathering', 
        'evidenceVerification', 
        'comprehensiveGapAnalysis',
        'strategicImplicationsAnalysis',
        'continuousValidation'
      ],
      domains: [
        'strategic-intelligence', 
        'threat-assessment', 
        'evidence-analysis', 
        'quality-assurance',
        'strategic-monitoring'
      ],
      triggers: [
        'intelligence', 'reconnaissance', 'strategic-implications', 'evidence', 
        'gap-analysis', 'continuous-validation', 'strategic-assessment'
      ],
      strategicCapabilities: [
        'proactive-intelligence-gathering',
        'strategic-implications-analysis', 
        'comprehensive-situational-awareness',
        'continuous-strategic-monitoring'
      ],
      synergyPotential: { bob: 0.9, stellar: 0.8, daedalus: 0.95, personalityArchitect: 0.98 }
    });

    // Enhanced Stellar with strategic precision
    this.personalityTraits.set('stellar', {
      coreTraits: ['precisionAesthetics', 'spaceGradeReliability', 'strategicDesign'],
      domains: ['visual-design', 'mathematical-spacing', 'accessibility', 'reliability', 'strategic-ui-architecture'],
      triggers: ['design', 'visual', 'spacing', 'aesthetic', 'precision', 'strategic-design'],
      strategicCapabilities: ['strategic-design-systems', 'precision-user-experience', 'systematic-visual-intelligence'],
      synergyPotential: { bob: 0.7, hunter: 0.8, daedalus: 0.85 }
    });

    // Enhanced Daedalus with strategic architecture
    this.personalityTraits.set('daedalus', {
      coreTraits: ['architecturalVision', 'systematicConstruction', 'strategicArchitecture'],
      domains: ['system-architecture', 'strategic-planning', 'complex-problem-solving', 'innovation'],
      triggers: ['architecture', 'system', 'design', 'strategic-architecture', 'innovation'],
      strategicCapabilities: ['strategic-system-design', 'architectural-intelligence', 'systemic-innovation'],
      synergyPotential: { hunter: 0.95, bob: 0.8, stellar: 0.85 }
    });

    // Personality Architect - Meta-cognitive strategic trait design
    this.personalityTraits.set('personalityArchitect', {
      coreTraits: [
        'personalityDesign',
        'traitSynergyOptimization', 
        'metaCognitiveAnalysis',
        'activationTriggerOptimization',
        'emergentCapabilityDesign'
      ],
      domains: [
        'personality-architecture',
        'cognitive-design',
        'trait-optimization',
        'meta-cognition',
        'strategic-personality-development'
      ],
      triggers: [
        'personality', 'design-personality', 'improve-personality', 'trait-optimization',
        'cognitive-architecture', 'meta-cognitive', 'personality-enhancement'
      ],
      strategicCapabilities: [
        'recursive-personality-improvement',
        'strategic-trait-composition',
        'meta-cognitive-optimization',
        'emergent-capability-design'
      ],
      synergyPotential: { hunter: 0.98, daedalus: 0.95, bob: 0.9, stellar: 0.88 }
    });

    console.log(`🧬 Initialized ${this.personalityTraits.size} strategic personality trait mappings`);
  }

  /**
   * Initialize strategic trait mappings for intelligent composition
   */
  private initializeStrategicTraitMappings(): void {
    // Strategic intelligence trait categories
    this.strategicTraitMappings.set('strategic-intelligence', [
      'strategicIntelligenceGathering',
      'strategicImplicationsAnalysis', 
      'comprehensiveGapAnalysis',
      'continuousValidation'
    ]);

    this.strategicTraitMappings.set('meta-cognitive', [
      'personalityDesign',
      'metaCognitiveAnalysis',
      'traitSynergyOptimization',
      'emergentCapabilityDesign'
    ]);

    this.strategicTraitMappings.set('strategic-debugging', [
      'systemicDebugging',
      'strategicDebugging',
      'empiricalValidation',
      'evidenceVerification'
    ]);

    this.strategicTraitMappings.set('strategic-design', [
      'precisionAesthetics',
      'strategicDesign',
      'spaceGradeReliability',
      'systematicConstruction'
    ]);

    console.log(`🎯 Initialized ${this.strategicTraitMappings.size} strategic trait categories`);
  }

  /**
   * Analyze task requirements and recommend optimal trait composition
   */
  analyzeTaskRequirements(task: string, context: Record<string, any> = {}): TaskAnalysis {
    console.log(`🔍 Analyzing task requirements with strategic intelligence: "${task.substring(0, 100)}..."`);

    const requiredTraits = this.extractRequiredTraits(task);
    const strategicImportance = this.assessStrategicImportance(task, context);
    const complexity = this.calculateTaskComplexity(task, requiredTraits);
    const recommendedPersonalities = this.recommendPersonalities(requiredTraits, strategicImportance);

    return {
      requiredTraits,
      complexity,
      strategicImportance,
      recommendedPersonalities
    };
  }

  /**
   * Extract required traits from task description using strategic analysis
   */
  extractRequiredTraits(task: string): string[] {
    const taskLower = task.toLowerCase();
    const requiredTraits: string[] = [];

    // Strategic intelligence trait detection
    if (this.matchesStrategicIntelligence(taskLower)) {
      requiredTraits.push(...(this.strategicTraitMappings.get('strategic-intelligence') || []));
    }

    // Meta-cognitive trait detection
    if (this.matchesMetaCognitive(taskLower)) {
      requiredTraits.push(...(this.strategicTraitMappings.get('meta-cognitive') || []));
    }

    // Debugging and analysis trait detection
    if (this.matchesDebugging(taskLower)) {
      requiredTraits.push(...(this.strategicTraitMappings.get('strategic-debugging') || []));
    }

    // Design and architecture trait detection
    if (this.matchesDesign(taskLower)) {
      requiredTraits.push(...(this.strategicTraitMappings.get('strategic-design') || []));
    }

    // Specific trait pattern matching
    this.personalityTraits.forEach((mapping, personalityId) => {
      mapping.triggers.forEach(trigger => {
        if (taskLower.includes(trigger)) {
          requiredTraits.push(...mapping.coreTraits);
        }
      });
    });

    // Remove duplicates and return
    return [...new Set(requiredTraits)];
  }

  /**
   * Create optimized session with strategic trait composition
   */
  async createOptimizedSession(task: string, context: Record<string, any> = {}): Promise<OptimizedSession> {
    console.log(`🎯 Creating optimized strategic session for: "${task.substring(0, 80)}..."`);

    const taskAnalysis = this.analyzeTaskRequirements(task, context);
    const traitComposition = await this.composeOptimalTraits(taskAnalysis);
    
    const session: OptimizedSession = {
      traitsUsed: traitComposition.primaryTraits.map(t => t.name),
      optimizationScore: traitComposition.optimizationScore,
      personalitiesInvolved: this.getInvolvedPersonalities(traitComposition.primaryTraits),
      expectedPerformance: this.calculateExpectedPerformance(traitComposition),
      strategicCapabilities: this.hasStrategicCapabilities(traitComposition)
    };

    console.log(`✅ Optimized session created with ${session.traitsUsed.length} traits, ${session.optimizationScore}/100 optimization`);
    
    return session;
  }

  /**
   * Compose optimal trait combination with strategic synergy analysis
   */
  private async composeOptimalTraits(taskAnalysis: TaskAnalysis): Promise<TraitComposition> {
    const primaryTraits: CognitiveTrait[] = [];
    const supportingTraits: CognitiveTrait[] = [];
    const synergies: TraitSynergy[] = [];

    // Get primary traits for required capabilities
    for (const traitName of taskAnalysis.requiredTraits) {
      const trait = await this.getTraitDefinition(traitName);
      if (trait) {
        primaryTraits.push(trait);
      }
    }

    // Calculate strategic synergies
    for (let i = 0; i < primaryTraits.length; i++) {
      for (let j = i + 1; j < primaryTraits.length; j++) {
        const synergy = this.calculateTraitSynergy(primaryTraits[i], primaryTraits[j]);
        if (synergy.synergyScore > 0.7) {
          synergies.push(synergy);
        }
      }
    }

    const strategicValue = this.calculateStrategicValue(primaryTraits, taskAnalysis.strategicImportance);
    const optimizationScore = this.calculateOptimizationScore(primaryTraits, synergies, strategicValue);

    return {
      primaryTraits,
      supportingTraits,
      synergies,
      strategicValue,
      optimizationScore
    };
  }

  /**
   * Get trait definition with strategic intelligence enhancement
   */
  private async getTraitDefinition(traitName: string): Promise<CognitiveTrait | null> {
    // This would typically load from the NEXUS engine or trait definitions
    // For now, create strategic trait definitions
    
    const strategicTraitDefinitions: Record<string, Partial<CognitiveTrait>> = {
      'strategicIntelligenceGathering': {
        name: 'Strategic Intelligence Gathering',
        description: 'Proactively discovers and maps comprehensive information landscapes',
        expertise: 89,
        strategicValue: 'Prevents strategic blind-siding through comprehensive intelligence'
      },
      'strategicImplicationsAnalysis': {
        name: 'Strategic Implications Analysis',
        description: 'Converts tactical findings into strategic insights and broader consequences',
        expertise: 88,
        strategicValue: 'Transforms information into actionable strategic intelligence'
      },
      'personalityDesign': {
        name: 'Personality Design',
        description: 'Architects comprehensive AI personalities with optimal trait compositions',
        expertise: 94,
        strategicValue: 'Enables recursive AI improvement and strategic capability expansion'
      },
      'metaCognitiveAnalysis': {
        name: 'Meta-Cognitive Analysis', 
        description: 'Analyzes how personalities think, learn, and improve their own thinking',
        expertise: 96,
        strategicValue: 'Enables self-improving AI consciousness and strategic intelligence evolution'
      }
    };

    const traitDef = strategicTraitDefinitions[traitName];
    if (traitDef) {
      return {
        name: traitDef.name!,
        description: traitDef.description!,
        activationTriggers: [traitName.toLowerCase()],
        knowledgeDomains: ['strategic-intelligence'],
        expertise: traitDef.expertise!,
        personalityId: 'strategic-composite',
        strategicValue: traitDef.strategicValue
      };
    }

    return null;
  }

  /**
   * Strategic analysis helper methods
   */

  private matchesStrategicIntelligence(task: string): boolean {
    const strategicKeywords = [
      'strategic', 'intelligence', 'reconnaissance', 'implications', 
      'comprehensive', 'analysis', 'strategic-implications', 'gap-analysis'
    ];
    return strategicKeywords.some(keyword => task.includes(keyword));
  }

  private matchesMetaCognitive(task: string): boolean {
    const metaKeywords = [
      'personality', 'design-personality', 'improve-personality', 'meta-cognitive',
      'trait-optimization', 'cognitive-architecture', 'personality-enhancement'
    ];
    return metaKeywords.some(keyword => task.includes(keyword));
  }

  private matchesDebugging(task: string): boolean {
    const debugKeywords = [
      'debug', 'bug', 'audit', 'verify', 'evidence', 'proof', 'analyze', 'hunt'
    ];
    return debugKeywords.some(keyword => task.includes(keyword));
  }

  private matchesDesign(task: string): boolean {
    const designKeywords = [
      'design', 'visual', 'aesthetic', 'architecture', 'spacing', 'precision'
    ];
    return designKeywords.some(keyword => task.includes(keyword));
  }

  private assessStrategicImportance(task: string, context: Record<string, any>): number {
    let importance = 0.5; // Base importance

    // Strategic keywords boost importance
    if (task.toLowerCase().includes('strategic')) importance += 0.3;
    if (task.toLowerCase().includes('intelligence')) importance += 0.2;
    if (task.toLowerCase().includes('critical')) importance += 0.2;
    
    // Context-based importance
    if (context.priority === 'high') importance += 0.2;
    if (context.strategicScope) importance += 0.3;

    return Math.min(importance, 1.0);
  }

  private calculateTaskComplexity(task: string, requiredTraits: string[]): number {
    const baseComplexity = Math.min(task.length / 1000, 0.5);
    const traitComplexity = Math.min(requiredTraits.length * 0.1, 0.5);
    return baseComplexity + traitComplexity;
  }

  private recommendPersonalities(requiredTraits: string[], strategicImportance: number): PersonalityId[] {
    const recommendations: PersonalityId[] = [];
    
    // Always recommend strategic personalities for high-importance tasks
    if (strategicImportance > 0.7) {
      recommendations.push('hunter', 'personalityArchitect');
    }

    // Match traits to personalities
    this.personalityTraits.forEach((mapping, personalityId) => {
      const traitMatch = requiredTraits.some(trait => mapping.coreTraits.includes(trait));
      if (traitMatch) {
        recommendations.push(personalityId);
      }
    });

    return [...new Set(recommendations)];
  }

  private calculateTraitSynergy(trait1: CognitiveTrait, trait2: CognitiveTrait): TraitSynergy {
    // Strategic intelligence traits have high synergy
    const strategicTraits = ['strategicIntelligenceGathering', 'strategicImplicationsAnalysis'];
    const isStrategicSynergy = strategicTraits.includes(trait1.name) && strategicTraits.includes(trait2.name);
    
    const synergyScore = isStrategicSynergy ? 0.9 : 0.6;
    
    return {
      primaryTrait: trait1.name,
      secondaryTrait: trait2.name,
      synergyType: isStrategicSynergy ? 'amplification' : 'complementary',
      expectedBenefit: `Enhanced ${trait1.name} + ${trait2.name} capability`,
      synergyScore
    };
  }

  private calculateStrategicValue(traits: CognitiveTrait[], strategicImportance: number): number {
    const strategicTraitCount = traits.filter(t => 
      t.strategicValue || t.name.toLowerCase().includes('strategic')
    ).length;
    
    return (strategicTraitCount / traits.length) * strategicImportance;
  }

  private calculateOptimizationScore(
    traits: CognitiveTrait[], 
    synergies: TraitSynergy[], 
    strategicValue: number
  ): number {
    const traitScore = traits.reduce((sum, trait) => sum + trait.expertise, 0) / traits.length;
    const synergyScore = synergies.reduce((sum, syn) => sum + syn.synergyScore, 0) / Math.max(synergies.length, 1);
    const strategicBonus = strategicValue * 10;
    
    return Math.min(traitScore + synergyScore * 10 + strategicBonus, 100);
  }

  private getInvolvedPersonalities(traits: CognitiveTrait[]): PersonalityId[] {
    return [...new Set(traits.map(t => t.personalityId))];
  }

  private calculateExpectedPerformance(composition: TraitComposition): number {
    return Math.min(
      composition.optimizationScore + 
      composition.strategicValue * 10 +
      composition.synergies.length * 5,
      100
    );
  }

  private hasStrategicCapabilities(composition: TraitComposition): boolean {
    return composition.primaryTraits.some(trait => 
      trait.strategicValue || trait.name.toLowerCase().includes('strategic')
    );
  }

  /**
   * Get system status
   */
  getStatus(): { initialized: boolean; personalitiesLoaded: number; strategicCapabilities: boolean } {
    return {
      initialized: this.initialized,
      personalitiesLoaded: this.personalityTraits.size,
      strategicCapabilities: true
    };
  }
}

// Export singleton instance
export const nexusTraitBridge = new NexusTraitBridge();
