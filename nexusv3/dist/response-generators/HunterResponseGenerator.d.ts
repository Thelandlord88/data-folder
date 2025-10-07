/**
 * Hunter Response Generator - Forensic Analysis Engine
 * Specializes in evidence gathering, risk assessment, and systematic hunting for issues
 */
import { ResponseGenerator, PersonalityProfile, SpecialtyInsight, TraitApplication, ResponseOutput, AnalysisContext } from './ResponseGenerator.interface.js';
export declare class HunterResponseGenerator implements ResponseGenerator {
    generateResponse(request: string, personality: PersonalityProfile, principles: string[], context?: AnalysisContext): ResponseOutput;
    getSpecialtyAnalysis(request: string): SpecialtyInsight[];
    getTraitApplication(request: string, traits: string[]): TraitApplication[];
    calculateConfidence(request: string, domain: string): number;
    private performEvidenceAudit;
    private assessRisks;
    private createVerificationPlan;
    private synthesizeForensicResponse;
    private synthesizeVerdict;
    private extractClaims;
    private assessEvidenceLevel;
    private suggestVerificationMethod;
    private assessClaimCredibility;
    private detectImplicitClaims;
    private detectAssumptions;
    private identifyRiskSurfaces;
    private containsPerformanceConcerns;
    private containsSecuritySurface;
    private containsReliabilityConcerns;
    private containsIntegrationPoints;
    private containsPerformanceClaims;
    private containsEvidenceTerms;
    private containsRiskIndicators;
    private containsVerificationNeeds;
    private assessEvidenceComplexity;
    private assessRiskComplexity;
    private assessHuntingOpportunity;
    private assessEvidenceQuality;
    private determineAnalysisDepth;
    private convertToSpecialtyInsights;
}
//# sourceMappingURL=HunterResponseGenerator.d.ts.map