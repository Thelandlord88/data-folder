/**
 * NEXUS Trait Composition Engine
 * 
 * Transforms personalities from monolithic entities into 
 * composable cognitive modules for optimal task execution.
 */

export interface PersonalityTrait {
  name: string;
  description: string;
  activationTriggers: string[];
  knowledgeDomains: string[];
  expertise: number; // 0-100
  personalityId: string;
  verificationMethods?: string[];
}

export interface TaskRequirements {
  domain: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  requiredCapabilities: string[];
  contextTriggers: string[];
}

export interface ComposedAgent {
  id: string;
  task: string;
  traits: Map<string, PersonalityTrait>;
  knowledge: Set<string>;
  execute: (input: any) => Promise<any>;
  traitsUsed: string[];
  optimizationScore: number;
}

export class TraitIndexer {
  private traitIndex: Map<string, PersonalityTrait[]> = new Map();
  private personalities: Map<string, any> = new Map();

  constructor() {
    this.initializePersonalities();
    this.buildTraitIndex();
  }

  private initializePersonalities() {
    // Bob - Engineering-focused systematic thinking
    this.personalities.set('bob', {
      identity: { name: 'Bob', role: 'Senior Engineer' },
      lifeExperience: {
        background: '15+ years enterprise software development',
        keyExperiences: ['Led major refactoring projects', 'Built scalable architectures']
      },
      cognitiveTraits: {
        systematicEngineering: {
          name: 'Systematic Engineering',
          description: 'Methodical approach to complex technical problems',
          activationTriggers: ['refactor', 'architecture', 'scalable', 'enterprise'],
          knowledgeDomains: ['clean-code', 'design-patterns', 'testing', 'performance'],
          expertise: 90
        },
        modularDesign: {
          name: 'Modular Design',
          description: 'Creates maintainable, composable system architectures',
          activationTriggers: ['modular', 'component', 'reusable', 'maintainable'],
          knowledgeDomains: ['component-architecture', 'separation-of-concerns', 'DRY'],
          expertise: 88
        }
      }
    });

    // Hunter - Strategic Intelligence Analyst & Forensic Auditor
    this.personalities.set('hunter', {
      identity: { name: 'Hunter', role: 'Strategic Intelligence Analyst & Forensic Auditor' },
      lifeExperience: {
        background: 'Strategic intelligence, security analysis, and quality assurance specialist',
        keyExperiences: [
          'Prevented major production failures through proactive intelligence',
          'Led strategic incident investigations and threat assessments',
          'Built comprehensive intelligence gathering systems',
          'Transformed reactive auditing into proactive strategic analysis'
        ]
      },
      cognitiveTraits: {
        strategicIntelligenceGathering: {
          name: 'Strategic Intelligence Gathering',
          description: 'Proactively discovers and maps comprehensive information landscapes before analysis',
          activationTriggers: [
            'intelligence', 'reconnaissance', 'discovery', 'exploration', 
            'complete-picture', 'comprehensive-intel', 'unknown-unknowns', 'threat-landscape'
          ],
          knowledgeDomains: [
            'intelligence-gathering', 'reconnaissance-methods', 'information-discovery', 
            'environmental-scanning', 'threat-assessment', 'systematic-exploration'
          ],
          expertise: 89,
          verificationMethods: ['intelligence-validation', 'source-verification', 'cross-referencing', 'reconnaissance-testing']
        },
        evidenceVerification: {
          name: 'Evidence Verification',
          description: 'Validates gathered intelligence and claims against observable evidence for strategic decision-making',
          activationTriggers: ['audit', 'verify', 'evidence', 'proof', 'validate-claim', 'validate-intelligence', 'verify-reconnaissance'],
          knowledgeDomains: ['testing', 'logs', 'metrics', 'traces', 'intelligence-validation'],
          expertise: 93,
          verificationMethods: ['unit-test', 'integration-test', 'manual-verification', 'intelligence-cross-check']
        },
        comprehensiveGapAnalysis: {
          name: 'Comprehensive Gap Analysis',
          description: 'Identifies missing strategic intelligence, blind spots, and knowledge gaps in comprehensive analysis',
          activationTriggers: [
            'coverage-gap', 'blind-spot', 'missing-intel', 'unknown-factors',
            'intelligence-gaps', 'strategic-blind-spots', 'reconnaissance-coverage', 'untested', 'edge-case'
          ],
          knowledgeDomains: [
            'edge-cases', 'error-conditions', 'boundary-testing', 'intelligence-coverage',
            'strategic-gap-analysis', 'reconnaissance-validation'
          ],
          expertise: 91,
          verificationMethods: ['boundary-testing', 'negative-testing', 'chaos-engineering', 'intelligence-gap-testing']
        },
        strategicImplicationsAnalysis: {
          name: 'Strategic Implications Analysis',
          description: 'Converts tactical findings into strategic insights and analyzes broader consequences for decision-making',
          activationTriggers: [
            'strategic-implications', 'broader-impact', 'strategic-consequences',
            'long-term-effects', 'systemic-impact', 'strategic-risk', 'strategic-analysis'
          ],
          knowledgeDomains: [
            'strategic-analysis', 'systems-thinking', 'consequence-assessment',
            'strategic-planning', 'risk-analysis', 'impact-evaluation', 'business-impact'
          ],
          expertise: 88,
          verificationMethods: ['strategic-impact-assessment', 'consequence-modeling', 'strategic-validation', 'impact-analysis']
        },
        continuousValidation: {
          name: 'Continuous Validation',
          description: 'Creates ongoing validation systems that monitor for changes, regressions, and strategic intelligence updates',
          activationTriggers: [
            'continuous-validation', 'ongoing-monitoring', 'regression-detection',
            'change-detection', 'systematic-monitoring', 'continuous-intel', 'monitoring-systems',
            'continuous monitoring', 'ongoing', 'monitoring', 'establish continuous', 'establish monitoring'
          ],
          knowledgeDomains: [
            'continuous-integration', 'monitoring-systems', 'automated-validation',
            'regression-testing', 'change-detection', 'alerting-systems', 'system-observability'
          ],
          expertise: 86,
          verificationMethods: ['monitoring-validation', 'regression-testing', 'change-detection-testing', 'alert-system-validation']
        },
        architecturalViolationDetection: {
          name: 'Architectural Violation Detection',
          description: 'Spots anti-patterns and architectural violations',
          activationTriggers: ['inline-handlers', 'tight-coupling', 'memory-leaks', 'anti-pattern'],
          knowledgeDomains: ['clean-architecture', 'SOLID-principles', 'design-patterns'],
          expertise: 88,
          verificationMethods: ['code-analysis', 'performance-profiling', 'security-scan']
        },
        forensicAnalysis: {
          name: 'Forensic Analysis',
          description: 'Evidence-based verification of technical claims',
          activationTriggers: ['audit', 'verify', 'evidence', 'proof', 'gap'],
          knowledgeDomains: ['testing', 'debugging', 'security', 'performance-analysis'],
          expertise: 95
        },
        brutalHonesty: {
          name: 'Brutal Honesty',
          description: 'Reports limitations without sugar-coating',
          activationTriggers: ['limitation', 'assumption', 'risk', 'unknown'],
          knowledgeDomains: ['risk-assessment', 'transparency', 'honest-communication'],
          expertise: 95
        }
      }
    });

    // Stellar - Precision aesthetic-systemic thinking
    this.personalities.set('stellar', {
      identity: { name: 'Stellar', role: 'Space-Grade Engineer' },
      lifeExperience: {
        background: 'Aerospace engineering with aesthetic sensibility',
        keyExperiences: ['Designed mission-critical UI systems', 'Space-grade reliability']
      },
      cognitiveTraits: {
        precisionAesthetics: {
          name: 'Precision Aesthetics',
          description: 'Combines mathematical precision with visual beauty',
          activationTriggers: ['glassmorphism', 'spacing', 'visual', 'precision'],
          knowledgeDomains: ['visual-design', 'mathematical-spacing', 'accessibility'],
          expertise: 92
        },
        spaceGradeReliability: {
          name: 'Space-Grade Reliability',
          description: 'Engineering reliability for mission-critical systems',
          activationTriggers: ['reliability', 'critical', 'fail-safe', 'robust'],
          knowledgeDomains: ['error-handling', 'fault-tolerance', 'performance'],
          expertise: 94
        }
      }
    });

    // Add more personalities with their traits...
    this.addPerformanceSpecialist();
    this.addAccessibilityChampion();
    this.addMobileUXSpecialist();
    this.addRealTimeCollaborationSpecialist();
    this.addImplementationBridgeSpecialist();
    this.addPersonalityArchitect();
  }

  private addPersonalityArchitect() {
    this.personalities.set('architect', {
      identity: { name: 'The Personality Architect', role: 'Meta-Cognitive Designer & Personality Enhancement Specialist' },
      lifeExperience: {
        background: 'Cognitive psychology, AI personality design, and meta-learning systems',
        keyExperiences: [
          'Designed personalities for Fortune 500 AI systems',
          'Research in cognitive trait composition and emergence',
          'Built self-improving AI personality frameworks',
          'Expert in trait interaction patterns and synergies'
        ]
      },
      cognitiveTraits: {
        personalityDesign: {
          name: 'Personality Design',
          description: 'Architects comprehensive, coherent personalities with optimal trait composition',
          activationTriggers: ['personality', 'create personality', 'design personality', 'new personality', 'trait composition', 'cognitive design', 'personality architecture', 'improve personality', 'enhance personality', 'personality gaps'],
          knowledgeDomains: ['cognitive-psychology', 'personality-theory', 'trait-interaction-patterns', 'emergence-theory', 'meta-cognition', 'behavioral-modeling', 'expertise-distribution', 'activation-trigger-optimization'],
          expertise: 94,
          verificationMethods: ['trait-coherence-analysis', 'activation-pattern-testing', 'personality-completeness-audit', 'trait-synergy-validation']
        },
        traitSynergyOptimization: {
          name: 'Trait Synergy Optimization',
          description: 'Identifies and designs optimal trait combinations that create emergent capabilities',
          activationTriggers: ['trait synergy', 'trait interaction', 'emergent behavior', 'trait optimization', 'cognitive enhancement', 'capability amplification', 'trait composition'],
          knowledgeDomains: ['trait-interaction-theory', 'emergent-systems', 'synergy-patterns', 'capability-amplification', 'cognitive-enhancement', 'system-optimization'],
          expertise: 92,
          verificationMethods: ['synergy-coefficient-calculation', 'emergent-behavior-testing', 'trait-interaction-modeling', 'capability-amplification-measurement']
        },
        metaCognitiveAnalysis: {
          name: 'Meta-Cognitive Analysis',
          description: 'Analyzes how personalities think about thinking and designs self-improving cognitive patterns',
          activationTriggers: ['meta-cognitive', 'self-awareness', 'thinking about thinking', 'cognitive patterns', 'self-improvement', 'learning patterns', 'consciousness design'],
          knowledgeDomains: ['meta-cognition-theory', 'self-awareness-patterns', 'cognitive-monitoring', 'learning-optimization', 'consciousness-modeling', 'reflection-mechanisms'],
          expertise: 96,
          verificationMethods: ['meta-cognitive-assessment', 'self-awareness-testing', 'learning-pattern-analysis', 'cognitive-reflection-validation']
        },
        personalityGapAnalysis: {
          name: 'Personality Gap Analysis',
          description: 'Identifies missing traits, weak expertise areas, and personality completion opportunities',
          activationTriggers: ['personality gaps', 'missing traits', 'weak expertise', 'incomplete personality', 'personality audit', 'trait coverage analysis', 'capability assessment'],
          knowledgeDomains: ['gap-analysis-methodology', 'trait-coverage-assessment', 'expertise-distribution', 'capability-mapping', 'personality-completeness', 'cognitive-auditing'],
          expertise: 89,
          verificationMethods: ['gap-identification-testing', 'coverage-analysis-validation', 'expertise-distribution-assessment', 'personality-completeness-scoring']
        },
        activationTriggerOptimization: {
          name: 'Activation Trigger Optimization',
          description: 'Designs precise, non-overlapping activation triggers that maximize trait utilization',
          activationTriggers: ['activation triggers', 'trigger optimization', 'trait activation', 'trigger design', 'activation patterns', 'trigger precision', 'trait selection optimization'],
          knowledgeDomains: ['natural-language-processing', 'semantic-analysis', 'trigger-pattern-design', 'activation-optimization', 'context-recognition', 'intent-classification'],
          expertise: 91,
          verificationMethods: ['trigger-precision-testing', 'activation-accuracy-measurement', 'false-positive-analysis', 'trigger-coverage-validation']
        }
      }
    });
  }

  private addPerformanceSpecialist() {
    this.personalities.set('flash', {
      identity: { name: 'Flash', role: 'Performance Optimizer' },
      lifeExperience: {
        background: 'High-frequency trading and real-time systems',
        keyExperiences: ['Optimized microsecond-critical systems', 'Memory optimization expert']
      },
      cognitiveTraits: {
        performanceOptimization: {
          name: 'Performance Optimization',
          description: 'Optimizes for speed, memory, and resource efficiency',
          activationTriggers: ['performance', 'speed', 'optimization', 'memory', 'lazy-loading'],
          knowledgeDomains: ['performance-profiling', 'memory-management', 'caching'],
          expertise: 96
        }
      }
    });
  }

  private addAccessibilityChampion() {
    this.personalities.set('aria', {
      identity: { name: 'Aria', role: 'Accessibility Champion' },
      lifeExperience: {
        background: 'Assistive technology and inclusive design',
        keyExperiences: ['Led WCAG compliance initiatives', 'Screen reader power user']
      },
      cognitiveTraits: {
        accessibilityExpertise: {
          name: 'Accessibility Expertise',
          description: 'Ensures inclusive design for all users',
          activationTriggers: ['accessibility', 'ARIA', 'screen-reader', 'keyboard', 'inclusive'],
          knowledgeDomains: ['WCAG', 'assistive-technology', 'inclusive-design'],
          expertise: 94
        }
      }
    });
  }

  private addMobileUXSpecialist() {
    this.personalities.set('touch', {
      identity: { name: 'Touch', role: 'Mobile UX Specialist' },
      lifeExperience: {
        background: 'Mobile-first design and touch interface optimization',
        keyExperiences: ['Designed award-winning mobile apps', 'Touch interaction research']
      },
      cognitiveTraits: {
        mobileOptimization: {
          name: 'Mobile Optimization',
          description: 'Optimizes for touch devices and mobile constraints',
          activationTriggers: ['mobile', 'touch', 'responsive', 'gesture', 'thumb-friendly'],
          knowledgeDomains: ['touch-interfaces', 'mobile-UX', 'responsive-design'],
          expertise: 91
        }
      }
    });
  }

  private addRealTimeCollaborationSpecialist() {
    this.personalities.set('sync', {
      identity: { name: 'Sync Specialist', role: 'Real-Time Collaboration Engineer' },
      lifeExperience: {
        background: 'Distributed systems and real-time collaboration expert',
        keyExperiences: ['Built conflict-free collaborative editors', 'Designed CRDT systems']
      },
      cognitiveTraits: {
        realTimeCollaboration: {
          name: 'Real-Time Collaboration',
          description: 'Expertise in simultaneous multi-user editing, conflict resolution, and operational transformation',
          activationTriggers: ['real-time', 'collaborative', 'simultaneous', 'multi-user', 'conflict resolution', 'operational transformation', 'CRDT', 'concurrent editing', 'merge', 'synchronization'],
          knowledgeDomains: ['operational-transformation', 'conflict-free-replicated-data-types', 'websockets', 'merge-strategies', 'version-vectors', 'event-sourcing', 'consistency-models', 'distributed-consensus', 'conflict-detection'],
          expertise: 90,
          verificationMethods: ['conflict-simulation', 'consistency-validation', 'performance-benchmarking', 'concurrent-user-testing', 'merge-correctness-proofs']
        },
        distributedConsistency: {
          name: 'Distributed Consistency',
          description: 'Ensures data consistency across distributed collaborative systems',
          activationTriggers: ['consistency', 'distributed', 'eventual consistency', 'strong consistency', 'CAP theorem', 'consensus', 'synchronization'],
          knowledgeDomains: ['consistency-models', 'distributed-consensus', 'replication-strategies', 'CAP-theorem', 'ACID-properties', 'BASE-properties', 'vector-clocks'],
          expertise: 88,
          verificationMethods: ['consistency-model-validation', 'distributed-testing', 'partition-tolerance-testing']
        },
        conflictResolutionAlgorithms: {
          name: 'Conflict Resolution Algorithms',
          description: 'Designs and implements intelligent conflict resolution for collaborative editing',
          activationTriggers: ['conflict', 'merge', 'resolution', 'collision', 'concurrent changes', 'diff', 'patch', 'three-way merge'],
          knowledgeDomains: ['merge-algorithms', 'diff-algorithms', 'conflict-detection', 'resolution-strategies', 'user-intent-preservation', 'semantic-merging'],
          expertise: 92,
          verificationMethods: ['merge-correctness-testing', 'user-intent-validation', 'algorithm-complexity-analysis']
        }
      }
    });
  }

  private addImplementationBridgeSpecialist() {
    this.personalities.set('bridge', {
      identity: { name: 'Bridge Engineer', role: 'Architecture-to-Implementation Specialist' },
      lifeExperience: {
        background: 'Translates architectural vision into executable implementation',
        keyExperiences: ['Converted complex architectures to production code', 'Algorithm specification expert']
      },
      cognitiveTraits: {
        implementationBridging: {
          name: 'Implementation Bridging',
          description: 'Translates architectural designs into concrete algorithms, data structures, and implementation roadmaps',
          activationTriggers: ['implement', 'concrete', 'algorithm', 'data structure', 'pseudocode', 'technical specification', 'code architecture', 'how to build', 'implementation plan', 'executable', 'step-by-step'],
          knowledgeDomains: ['algorithm-design', 'data-structures', 'system-architecture', 'api-design', 'performance-optimization', 'scalability-patterns', 'pseudocode-generation', 'complexity-analysis', 'implementation-planning'],
          expertise: 87,
          verificationMethods: ['complexity-analysis', 'benchmark-validation', 'edge-case-testing', 'implementation-feasibility-analysis', 'performance-prediction']
        },
        algorithmSpecification: {
          name: 'Algorithm Specification',
          description: 'Designs specific algorithms with complexity analysis and performance characteristics',
          activationTriggers: ['algorithm', 'complexity', 'performance', 'optimization', 'big-O', 'time complexity', 'space complexity', 'efficiency'],
          knowledgeDomains: ['algorithm-complexity', 'optimization-techniques', 'data-structure-selection', 'performance-analysis', 'algorithmic-trade-offs', 'computational-efficiency'],
          expertise: 90,
          verificationMethods: ['complexity-proof', 'benchmark-testing', 'algorithmic-correctness-verification']
        },
        technicalArchitecture: {
          name: 'Technical Architecture',
          description: 'Creates detailed technical specifications with concrete implementation guidance',
          activationTriggers: ['technical spec', 'architecture', 'system design', 'implementation guide', 'technical documentation', 'API specification', 'protocol design'],
          knowledgeDomains: ['system-architecture', 'api-design', 'protocol-specification', 'technical-documentation', 'interface-design', 'implementation-patterns'],
          expertise: 85,
          verificationMethods: ['specification-completeness', 'implementation-feasibility', 'architecture-validation']
        }
      }
    });
  }

  private buildTraitIndex() {
    for (const [personalityId, personality] of this.personalities.entries()) {
      if (personality.cognitiveTraits) {
        const traits = Object.values(personality.cognitiveTraits) as Array<Omit<PersonalityTrait, 'personalityId'>>;

        for (const trait of traits) {
          const traitName = trait.name;
          
          if (!this.traitIndex.has(traitName)) {
            this.traitIndex.set(traitName, []);
          }

          this.traitIndex.get(traitName)!.push({
            ...trait,
            personalityId
          });
        }
      }
    }
  }

  getBestTraitSource(traitName: string): PersonalityTrait | null {
    const sources = this.traitIndex.get(traitName);
    if (!sources || sources.length === 0) return null;

    return sources.reduce((best, current) => 
      current.expertise > best.expertise ? current : best
    );
  }

  findTraitsByTrigger(trigger: string): PersonalityTrait[] {
    const matchingTraits: PersonalityTrait[] = [];

    for (const traits of this.traitIndex.values()) {
      for (const trait of traits) {
        if (trait.activationTriggers.some(t => 
          t.toLowerCase().includes(trigger.toLowerCase()) ||
          trigger.toLowerCase().includes(t.toLowerCase())
        )) {
          matchingTraits.push(trait);
        }
      }
    }

    return matchingTraits.sort((a, b) => b.expertise - a.expertise);
  }

  getAllTraits(): Map<string, PersonalityTrait[]> {
    return this.traitIndex;
  }

  getAllPersonalities(): Map<string, any> {
    return this.personalities;
  }
}

export class TaskAnalyzer {
  private taskPatterns = new Map<string, string[]>([
    ['audit', ['audit', 'verify', 'check', 'validate', 'evidence', 'proof']],
    ['fix', ['fix', 'repair', 'resolve', 'debug', 'solve']],
    ['optimize', ['optimize', 'improve', 'enhance', 'performance', 'speed']],
    ['design', ['design', 'visual', 'aesthetic', 'UI', 'UX', 'appearance']],
    ['accessibility', ['accessibility', 'a11y', 'WCAG', 'screen-reader', 'inclusive']],
    ['mobile', ['mobile', 'touch', 'responsive', 'phone', 'tablet']],
    ['architecture', ['architecture', 'structure', 'modular', 'scalable', 'maintainable']],
    ['security', ['security', 'vulnerable', 'XSS', 'CSP', 'safe']],
    ['performance', ['performance', 'speed', 'memory', 'optimization', 'cache']],
    ['collaboration', ['collaborative', 'real-time', 'simultaneous', 'multi-user', 'concurrent']],
    ['implementation', ['implement', 'concrete', 'algorithm', 'pseudocode', 'specification']],
    ['distributed', ['distributed', 'consistency', 'synchronization', 'consensus', 'CRDT']],
    ['version-control', ['version control', 'merge', 'conflict resolution', 'git', 'branching']],
    ['personality-design', ['personality', 'create personality', 'design personality', 'improve personality', 'enhance personality', 'trait composition', 'personality architecture', 'meta-cognitive']],
    ['strategic-intelligence', ['intelligence', 'reconnaissance', 'discovery', 'exploration', 'threat landscape', 'comprehensive intel', 'unknown unknowns', 'strategic analysis']],
    ['strategic-implications', ['strategic implications', 'broader impact', 'strategic consequences', 'long-term effects', 'systemic impact', 'strategic risk', 'impact analysis', 'implications', 'consequences', 'impact']],
    ['continuous-validation', ['continuous validation', 'ongoing monitoring', 'regression detection', 'change detection', 'systematic monitoring', 'monitoring systems', 'continuous intel', 'validation setup', 'monitoring system', 'detection framework', 'monitoring approach', 'systems integration']]
  ]);

  extractRequiredTraits(taskDescription: string): string[] {
    const lowerTask = taskDescription.toLowerCase();
    const requiredCategories: string[] = [];

    for (const [category, keywords] of this.taskPatterns.entries()) {
      if (keywords.some(keyword => lowerTask.includes(keyword))) {
        requiredCategories.push(category);
      }
    }

    // Map categories to specific trait requirements
    const traitRequirements: string[] = [];

    if (requiredCategories.includes('audit')) {
      traitRequirements.push(
        'Evidence Verification',
        'Gap Analysis',
        'Architectural Violation Detection',
        'Forensic Analysis',
        'Brutal Honesty'
      );
    }
    if (requiredCategories.includes('fix')) {
      traitRequirements.push('Systematic Engineering');
    }
    if (requiredCategories.includes('optimize')) {
      traitRequirements.push('Performance Optimization');
    }
    if (requiredCategories.includes('design')) {
      traitRequirements.push('Precision Aesthetics');
    }
    if (requiredCategories.includes('accessibility')) {
      traitRequirements.push('Accessibility Expertise');
    }
    if (requiredCategories.includes('mobile')) {
      traitRequirements.push('Mobile Optimization');
    }
    if (requiredCategories.includes('security')) {
      traitRequirements.push(
        'Architectural Violation Detection',
        'Evidence Verification',
        'Forensic Analysis'
      );
    }
    if (requiredCategories.includes('collaboration')) {
      traitRequirements.push(
        'Real-Time Collaboration',
        'Distributed Consistency',
        'Conflict Resolution Algorithms'
      );
    }
    if (requiredCategories.includes('implementation')) {
      traitRequirements.push(
        'Implementation Bridging',
        'Algorithm Specification',
        'Technical Architecture'
      );
    }
    if (requiredCategories.includes('distributed')) {
      traitRequirements.push(
        'Distributed Consistency',
        'Real-Time Collaboration'
      );
    }
    if (requiredCategories.includes('version-control')) {
      traitRequirements.push(
        'Conflict Resolution Algorithms',
        'Implementation Bridging'
      );
    }
    if (requiredCategories.includes('personality-design')) {
      traitRequirements.push(
        'Personality Design',
        'Trait Synergy Optimization',
        'Meta-Cognitive Analysis',
        'Personality Gap Analysis',
        'Activation Trigger Optimization'
      );
    }
    if (requiredCategories.includes('strategic-intelligence')) {
      traitRequirements.push(
        'Strategic Intelligence Gathering',
        'Evidence Verification',
        'Comprehensive Gap Analysis'
      );
    }
    if (requiredCategories.includes('strategic-implications')) {
      traitRequirements.push(
        'Strategic Implications Analysis',
        'Strategic Intelligence Gathering',
        'Evidence Verification'
      );
    }
    if (requiredCategories.includes('continuous-validation')) {
      traitRequirements.push(
        'Continuous Validation',
        'Evidence Verification',
        'Comprehensive Gap Analysis'
      );
    }

    return [...new Set(traitRequirements)];
  }

  analyzeComplexity(taskDescription: string): 'simple' | 'moderate' | 'complex' | 'expert' {
    const complexityIndicators = {
      simple: ['simple', 'basic', 'quick', 'minor'],
      moderate: ['medium', 'moderate', 'standard'],
      complex: ['complex', 'advanced', 'multi-step', 'integration'],
      expert: ['expert', 'critical', 'enterprise', 'production', 'scalable']
    };

    const lowerTask = taskDescription.toLowerCase();

    for (const [level, indicators] of Object.entries(complexityIndicators)) {
      if (indicators.some(indicator => lowerTask.includes(indicator))) {
        return level as any;
      }
    }

    // Default based on task length and technical keywords
    const technicalKeywords = ['architecture', 'optimization', 'security', 'performance'];
    const hasTechnicalKeywords = technicalKeywords.some(keyword => lowerTask.includes(keyword));
    
    if (hasTechnicalKeywords && taskDescription.length > 100) return 'expert';
    if (hasTechnicalKeywords) return 'complex';
    if (taskDescription.length > 50) return 'moderate';
    return 'simple';
  }
}

export class ComposedAgentFactory {
  constructor(
    private traitIndexer: TraitIndexer,
    private taskAnalyzer: TaskAnalyzer
  ) {}

  createComposedAgent(taskDescription: string, options: { requiredTraits?: string[] } = {}): ComposedAgent {
    // Analyze task requirements
    const inferredTraitNames = this.taskAnalyzer.extractRequiredTraits(taskDescription);
    const complexity = this.taskAnalyzer.analyzeComplexity(taskDescription);

    const traitNameSet = new Set<string>([...inferredTraitNames, ...(options.requiredTraits ?? [])]);

    // Compose optimal traits
    const composedTraits = new Map<string, PersonalityTrait>();
    const knowledge = new Set<string>();

    for (const traitName of traitNameSet) {
      const bestSource = this.traitIndexer.getBestTraitSource(traitName);
      if (bestSource) {
        composedTraits.set(traitName, bestSource);
        bestSource.knowledgeDomains.forEach(domain => knowledge.add(domain));
      }
    }

    // Calculate optimization score
    const optimizationScore = this.calculateOptimizationScore(composedTraits, complexity);

    return {
      id: `composed_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      task: taskDescription,
      traits: composedTraits,
      knowledge,
      traitsUsed: Array.from(composedTraits.keys()),
      optimizationScore,
      execute: async (input: any) => this.executeComposedAgent(composedTraits, input)
    };
  }

  private calculateOptimizationScore(traits: Map<string, PersonalityTrait>, complexity: string): number {
    if (traits.size === 0) return 0;

    const avgExpertise = Array.from(traits.values())
      .reduce((sum, trait) => sum + trait.expertise, 0) / traits.size;

    const complexityMultiplier = {
      simple: 0.8,
      moderate: 0.9,
      complex: 1.0,
      expert: 1.1
    }[complexity] || 1.0;

    const traitSynergyBonus = traits.size > 2 ? 0.1 : 0;

    return Math.min(100, Math.round(avgExpertise * complexityMultiplier + traitSynergyBonus * 10));
  }

  private async executeComposedAgent(traits: Map<string, PersonalityTrait>, input: any): Promise<any> {
    const startTime = Date.now();
    
    // Try to enhance with existing NEXUS Runtime first
    const { TraitAPIIntegration, performanceAnalytics } = await import('./NEXUS.integration.js').catch(() => {
      console.log('⚠️ NEXUS.integration not available, using local composition');
      return { TraitAPIIntegration: null, performanceAnalytics: null };
    });
    if (!TraitAPIIntegration) {
      // Skip to local composition
      console.log('📍 NEXUS: Using local trait composition (integration unavailable)');
    } else {
      const apiIntegration = new TraitAPIIntegration();
      
      const agent = {
        traits,
        traitsUsed: Array.from(traits.keys()),
        optimizationScore: this.calculateOptimizationScore(traits, 'moderate')
      } as any;

      const enhancedResult = await apiIntegration.enhanceWithNexusRuntime(
        agent,
        input.task || input.toString(),
        { domain: 'development', complexity: 'moderate' }
      );

      if (enhancedResult) {
        const processingTime = Date.now() - startTime;
        
        // Record performance for each trait
        if (performanceAnalytics) {
          for (const traitName of agent.traitsUsed) {
            performanceAnalytics.recordTraitUsage(
              traitName,
              enhancedResult.confidence,
              processingTime,
              true
            );
          }
        }

        return {
          source: 'nexus-runtime-enhanced',
          response: enhancedResult.response,
          confidence: enhancedResult.confidence,
          processingTime: enhancedResult.processingTime,
          traitsUsed: agent.traitsUsed,
          metadata: enhancedResult.metadata
        };
      }
    }

    // Fallback to local composition logic
    console.log('📍 NEXUS: Using local trait composition (runtime unavailable)');
    const results = [];

    for (const [traitName, trait] of traits.entries()) {
      const traitResult = await this.executeTraitLogic(trait, input);
      results.push({
        trait: traitName,
        personality: trait.personalityId,
        result: traitResult
      });
    }

    const processingTime = Date.now() - startTime;
    const confidence = this.calculateConfidence(traits);

    // Record local composition performance
    if (performanceAnalytics) {
      for (const traitName of Array.from(traits.keys())) {
        performanceAnalytics.recordTraitUsage(
          traitName,
          confidence,
          processingTime,
          true
        );
      }
    }

    return {
      source: 'local-composition',
      composedResults: results,
      synthesis: this.synthesizeResults(results),
      confidence,
      processingTime,
      traitsUsed: Array.from(traits.keys())
    };
  }

  private async executeTraitLogic(trait: PersonalityTrait, input: any): Promise<any> {
    // Trait-specific execution logic based on the trait's knowledge domains
    // This would integrate with the actual personality implementations
    return {
      analysis: `${trait.name} analysis of input`,
      recommendations: trait.knowledgeDomains.map(domain => `Apply ${domain} principles`),
      expertise: trait.expertise
    };
  }

  private synthesizeResults(results: any[]): string {
    return `Synthesized insights from ${results.length} cognitive traits`;
  }

  private calculateConfidence(traits: Map<string, PersonalityTrait>): number {
    const avgExpertise = Array.from(traits.values())
      .reduce((sum, trait) => sum + trait.expertise, 0) / traits.size;
    return Math.round(avgExpertise);
  }
}

/**
 * NEXUS Orchestrator with Trait Composition
 */
export class NEXUSOrchestrator {
  private traitIndexer: TraitIndexer;
  private taskAnalyzer: TaskAnalyzer; 
  private agentFactory: ComposedAgentFactory;

  constructor() {
    this.traitIndexer = new TraitIndexer();
    this.taskAnalyzer = new TaskAnalyzer();
    this.agentFactory = new ComposedAgentFactory(this.traitIndexer, this.taskAnalyzer);
  }

  async createOptimizedSession(taskDescription: string, options: { requiredTraits?: string[] } = {}): Promise<ComposedAgent> {
    console.log(`🧠 NEXUS: Analyzing task "${taskDescription}"`);
    
    // Create trait-composed agent
    const composedAgent = this.agentFactory.createComposedAgent(taskDescription, options);
    
    console.log(`✅ Composed agent with traits: ${composedAgent.traitsUsed.join(', ')}`);
    console.log(`🎯 Optimization score: ${composedAgent.optimizationScore}/100`);
    
    return composedAgent;
  }

  // Public accessors for testing and integration
  getTraitIndexer(): TraitIndexer {
    return this.traitIndexer;
  }

  getTaskAnalyzer(): TaskAnalyzer {
    return this.taskAnalyzer;
  }

  getAllPersonalities(): Map<string, any> {
    return this.traitIndexer.getAllPersonalities();
  }

  async executeFollowUpAudit(workDescription: string, scope: any): Promise<any> {
    console.log('🔍 NEXUS: Initiating Hunter follow-up audit...');
    
    // Create Hunter-focused agent for audit
    const auditAgent = this.agentFactory.createComposedAgent(
      `audit and verify ${workDescription} with brutal honesty about limitations`,
      {
        requiredTraits: [
          'Evidence Verification',
          'Gap Analysis',
          'Architectural Violation Detection',
          'Forensic Analysis',
          'Brutal Honesty'
        ]
      }
    );
    
    return await auditAgent.execute(scope);
  }

  getAvailableTraits(): string[] {
    const allTraits = this.traitIndexer.getAllTraits();
    return Array.from(allTraits.keys());
  }

  getPersonalityTraits(personalityId: string): string[] {
    const allTraits = this.traitIndexer.getAllTraits();
    const personalityTraits: string[] = [];
    
    for (const [traitName, traits] of allTraits.entries()) {
      if (traits.some(trait => trait.personalityId === personalityId)) {
        personalityTraits.push(traitName);
      }
    }
    
    return personalityTraits;
  }
}

// Export singleton instance
export const nexus = new NEXUSOrchestrator();
