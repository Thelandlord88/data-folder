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
    expertise: number;
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
export declare class TraitIndexer {
    private traitIndex;
    private personalities;
    constructor();
    private initializePersonalities;
    private addPersonalityArchitect;
    private addPerformanceSpecialist;
    private addAccessibilityChampion;
    private addMobileUXSpecialist;
    private addRealTimeCollaborationSpecialist;
    private addImplementationBridgeSpecialist;
    private buildTraitIndex;
    getBestTraitSource(traitName: string): PersonalityTrait | null;
    findTraitsByTrigger(trigger: string): PersonalityTrait[];
    getAllTraits(): Map<string, PersonalityTrait[]>;
    getAllPersonalities(): Map<string, any>;
}
export declare class TaskAnalyzer {
    private taskPatterns;
    extractRequiredTraits(taskDescription: string): string[];
    analyzeComplexity(taskDescription: string): 'simple' | 'moderate' | 'complex' | 'expert';
}
export declare class ComposedAgentFactory {
    private traitIndexer;
    private taskAnalyzer;
    constructor(traitIndexer: TraitIndexer, taskAnalyzer: TaskAnalyzer);
    createComposedAgent(taskDescription: string, options?: {
        requiredTraits?: string[];
    }): ComposedAgent;
    private calculateOptimizationScore;
    private executeComposedAgent;
    private executeTraitLogic;
    private synthesizeResults;
    private calculateConfidence;
}
/**
 * NEXUS Orchestrator with Trait Composition
 */
export declare class NEXUSOrchestrator {
    private traitIndexer;
    private taskAnalyzer;
    private agentFactory;
    constructor();
    createOptimizedSession(taskDescription: string, options?: {
        requiredTraits?: string[];
    }): Promise<ComposedAgent>;
    getTraitIndexer(): TraitIndexer;
    getTaskAnalyzer(): TaskAnalyzer;
    getAllPersonalities(): Map<string, any>;
    executeFollowUpAudit(workDescription: string, scope: any): Promise<any>;
    getAvailableTraits(): string[];
    getPersonalityTraits(personalityId: string): string[];
}
export declare const nexus: NEXUSOrchestrator;
//# sourceMappingURL=NEXUS.engine.d.ts.map