/**
 * NEXUS Response Generator Interface
 * Defines the contract for personality-specific response generation
 */
export interface PersonalityProfile {
    identity?: {
        name?: string;
        role?: string;
    };
    ideology?: {
        principles?: string[];
    };
    traits?: string[];
}
export interface SpecialtyInsight {
    category: string;
    insight: string;
    confidence: number;
    evidence?: string[];
}
export interface TraitApplication {
    trait: string;
    application: string;
    strength: number;
}
export interface AnalysisContext {
    requestType?: string;
    complexity?: 'simple' | 'moderate' | 'complex';
    domain?: string[];
}
export interface ResponseOutput {
    content: string;
    personalityUsed: string;
    nexusEnhanced: boolean;
    traitApplications: string[];
    specialtyInsights: SpecialtyInsight[];
    confidenceScore: number;
    analysisDepth: 'surface' | 'moderate' | 'deep';
}
export interface ResponseGenerator {
    generateResponse(request: string, personality: PersonalityProfile, principles: string[], context?: AnalysisContext): ResponseOutput;
    getSpecialtyAnalysis(request: string): SpecialtyInsight[];
    getTraitApplication(request: string, traits: string[]): TraitApplication[];
    calculateConfidence(request: string, domain: string): number;
}
//# sourceMappingURL=ResponseGenerator.interface.d.ts.map