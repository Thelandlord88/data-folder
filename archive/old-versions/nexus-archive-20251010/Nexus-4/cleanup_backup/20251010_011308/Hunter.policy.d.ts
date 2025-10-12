import type { PersonalityTrait } from './NEXUS.engine';
/**
 * Hunter's Forensic Policy Framework
 *
 * Implements evidence-based auditing with trait composition
 * for systematic follow-up on all development work.
 */
export interface ForensicEvidence {
    type: 'violation' | 'gap' | 'assumption' | 'untested' | 'missing';
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    evidence: string[];
    impact: string;
    recommendation: string;
    testable: boolean;
}
export interface CognitiveTrait extends PersonalityTrait {
    verificationMethods: string[];
}
export interface AuditScope {
    codeFiles: string[];
    testFiles: string[];
    configFiles: string[];
    dependencies: string[];
    buildOutputs: string[];
}
export declare class HunterPolicy {
    private readonly traits;
    private readonly evidenceChain;
    private readonly tokenDefinitions;
    private tokenScopeSignature;
    constructor();
    private initializeTraits;
    /**
     * POLICY 1: Immediate Evidence Verification
     * Every claim must be backed by verifiable evidence
     */
    verifyEvidence(claim: string, scope: AuditScope): Promise<ForensicEvidence[]>;
    /**
     * POLICY 2: Gap Analysis Protocol
     * Identify what hasn't been tested or considered
     */
    analyzeGaps(scope: AuditScope): Promise<ForensicEvidence[]>;
    /**
     * POLICY 3: Architectural Violation Detection
     * Spot patterns that violate clean architecture principles
     */
    detectArchitecturalViolations(scope: AuditScope): Promise<ForensicEvidence[]>;
    /**
     * POLICY 4: Brutal Honesty Assessment
     * Document what we don't know and can't verify
     */
    assessLimitations(scope: AuditScope): Promise<ForensicEvidence[]>;
    /**
     * Generate comprehensive audit report
     */
    auditComponent(scope: AuditScope): Promise<{
        findings: ForensicEvidence[];
        summary: {
            critical: number;
            high: number;
            medium: number;
            low: number;
        };
        productionReady: boolean;
        recommendations: string[];
    }>;
    private readFile;
    private ensureTokenDefinitions;
    private isTokenDefined;
    private findDuplicatePatterns;
}
/**
 * NEXUS Integration: Hunter's Trait Composition
 */
export declare const hunterTraits: {
    forensicAnalysis: {
        description: string;
        activationTriggers: string[];
        knowledgeDomains: string[];
        expertise: number;
    };
    gapDetection: {
        description: string;
        activationTriggers: string[];
        knowledgeDomains: string[];
        expertise: number;
    };
    brutalHonesty: {
        description: string;
        activationTriggers: string[];
        knowledgeDomains: string[];
        expertise: number;
    };
};
//# sourceMappingURL=Hunter.policy.d.ts.map