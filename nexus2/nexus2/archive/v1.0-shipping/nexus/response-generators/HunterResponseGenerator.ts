/**
 * Hunter Response Generator - Forensic Analysis Engine
 * Specializes in evidence gathering, risk assessment, and systematic hunting for issues
 */

import { ResponseGenerator, PersonalityProfile, SpecialtyInsight, TraitApplication, ResponseOutput, AnalysisContext } from './ResponseGenerator.interface.js';

interface EvidenceAudit {
  claim: string;
  evidenceLevel: 'none' | 'weak' | 'moderate' | 'strong' | 'conclusive';
  verification: string;
  credibility: number;
}

interface RiskAssessment {
  risk: string;
  probability: 'low' | 'medium' | 'high' | 'critical';
  impact: 'minimal' | 'moderate' | 'significant' | 'severe';
  mitigation: string;
}

interface VerificationRequirement {
  requirement: string;
  method: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: 'minimal' | 'moderate' | 'substantial' | 'extensive';
}

export class HunterResponseGenerator implements ResponseGenerator {
  
  generateResponse(
    request: string, 
    personality: PersonalityProfile, 
    principles: string[],
    context?: AnalysisContext
  ): ResponseOutput {
    
    const evidenceAudit = this.performEvidenceAudit(request);
    const riskAssessment = this.assessRisks(request);
    const verificationPlan = this.createVerificationPlan(request);
    const traitApplications = this.getTraitApplication(request, ['evidenceGathering', 'riskAssessment', 'systematicHunting']);
    
    const content = this.synthesizeForensicResponse(
      request,
      evidenceAudit,
      riskAssessment,
      verificationPlan,
      personality.identity?.name || 'Hunter'
    );
    
    return {
      content,
      personalityUsed: personality.identity?.name || 'Hunter',
      nexusEnhanced: true,
      traitApplications: traitApplications.map(ta => ta.trait),
      specialtyInsights: this.convertToSpecialtyInsights(evidenceAudit, riskAssessment),
      confidenceScore: this.calculateConfidence(request, 'forensic'),
      analysisDepth: this.determineAnalysisDepth(request, evidenceAudit)
    };
  }

  getSpecialtyAnalysis(request: string): SpecialtyInsight[] {
    const analyses: SpecialtyInsight[] = [];
    
    // Evidence gap analysis
    const claims = this.extractClaims(request);
    if (claims.length > 0) {
      analyses.push({
        category: 'Evidence Integrity',
        insight: `${claims.length} claims identified requiring verification`,
        confidence: 0.9,
        evidence: claims.map(c => c.text)
      });
    }
    
    // Risk surface analysis
    const risks = this.identifyRiskSurfaces(request);
    if (risks.length > 0) {
      analyses.push({
        category: 'Risk Surface',
        insight: `${risks.length} potential risk vectors detected`,
        confidence: 0.8,
        evidence: risks
      });
    }
    
    // Assumption detection
    const assumptions = this.detectAssumptions(request);
    if (assumptions.length > 0) {
      analyses.push({
        category: 'Assumption Analysis',
        insight: `${assumptions.length} unvalidated assumptions present`,
        confidence: 0.85,
        evidence: assumptions
      });
    }
    
    return analyses;
  }

  getTraitApplication(request: string, traits: string[]): TraitApplication[] {
    const applications: TraitApplication[] = [];
    
    // Evidence Gathering
    if (traits.includes('evidenceGathering')) {
      applications.push({
        trait: 'evidenceGathering',
        application: 'Systematic collection and validation of supporting evidence',
        strength: this.assessEvidenceComplexity(request)
      });
    }
    
    // Risk Assessment
    if (traits.includes('riskAssessment')) {
      applications.push({
        trait: 'riskAssessment',
        application: 'Probability and impact analysis of potential failure modes',
        strength: this.assessRiskComplexity(request)
      });
    }
    
    // Systematic Hunting
    if (traits.includes('systematicHunting')) {
      applications.push({
        trait: 'systematicHunting',
        application: 'Methodical search for hidden issues and failure patterns',
        strength: this.assessHuntingOpportunity(request)
      });
    }
    
    return applications;
  }

  calculateConfidence(request: string, domain: string): number {
    let confidence = 0.6; // Base confidence for forensic work
    
    if (domain === 'forensic') {
      if (this.containsEvidenceTerms(request)) confidence += 0.25;
      if (this.containsRiskIndicators(request)) confidence += 0.15;
      if (this.containsVerificationNeeds(request)) confidence += 0.1;
    }
    
    // Evidence quality bonus
    const evidenceQuality = this.assessEvidenceQuality(request);
    if (evidenceQuality > 0.7) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  private performEvidenceAudit(request: string): EvidenceAudit[] {
    const audit: EvidenceAudit[] = [];
    const claims = this.extractClaims(request);
    
    claims.forEach(claim => {
      audit.push({
        claim: claim.text,
        evidenceLevel: this.assessEvidenceLevel(claim),
        verification: this.suggestVerificationMethod(claim),
        credibility: this.assessClaimCredibility(claim)
      });
    });
    
    // Add implicit claims
    const implicitClaims = this.detectImplicitClaims(request);
    implicitClaims.forEach(claim => {
      audit.push({
        claim: `Implicit assumption: ${claim}`,
        evidenceLevel: 'none',
        verification: 'Explicit validation required',
        credibility: 0.3
      });
    });
    
    return audit;
  }

  private assessRisks(request: string): RiskAssessment[] {
    const risks: RiskAssessment[] = [];
    
    // Performance risks
    if (this.containsPerformanceConcerns(request)) {
      risks.push({
        risk: 'Performance degradation under load',
        probability: 'medium',
        impact: 'significant',
        mitigation: 'Load testing and performance profiling required'
      });
    }
    
    // Security risks
    if (this.containsSecuritySurface(request)) {
      risks.push({
        risk: 'Security vulnerability introduction',
        probability: 'medium',
        impact: 'severe',
        mitigation: 'Security audit and penetration testing'
      });
    }
    
    // Reliability risks
    if (this.containsReliabilityConcerns(request)) {
      risks.push({
        risk: 'System reliability compromise',
        probability: 'high',
        impact: 'significant',
        mitigation: 'Fault injection testing and error path validation'
      });
    }
    
    // Integration risks
    if (this.containsIntegrationPoints(request)) {
      risks.push({
        risk: 'Integration failure cascade',
        probability: 'medium',
        impact: 'moderate',
        mitigation: 'Contract testing and service isolation'
      });
    }
    
    return risks;
  }

  private createVerificationPlan(request: string): VerificationRequirement[] {
    const plan: VerificationRequirement[] = [];
    
    // Evidence verification
    const claims = this.extractClaims(request);
    if (claims.length > 0) {
      plan.push({
        requirement: 'Validate all explicit claims with measurable evidence',
        method: 'Empirical testing and measurement',
        priority: 'high',
        effort: 'moderate'
      });
    }
    
    // Assumption validation
    const assumptions = this.detectAssumptions(request);
    if (assumptions.length > 0) {
      plan.push({
        requirement: 'Test all underlying assumptions',
        method: 'Controlled experimentation',
        priority: 'high',
        effort: 'substantial'
      });
    }
    
    // Risk mitigation verification
    plan.push({
      requirement: 'Verify risk mitigation effectiveness',
      method: 'Stress testing and failure mode analysis',
      priority: 'medium',
      effort: 'moderate'
    });
    
    // Performance verification
    if (this.containsPerformanceClaims(request)) {
      plan.push({
        requirement: 'Benchmark performance claims',
        method: 'Load testing and profiling',
        priority: 'medium',
        effort: 'moderate'
      });
    }
    
    return plan;
  }

  private synthesizeForensicResponse(
    request: string,
    evidenceAudit: EvidenceAudit[],
    riskAssessment: RiskAssessment[],
    verificationPlan: VerificationRequirement[],
    personalityName: string
  ): string {
    
    const evidenceSection = evidenceAudit.length > 0
      ? `### 🔍 Evidence Audit\n${evidenceAudit.map(e =>
          `- **${e.claim}**: ${e.evidenceLevel} evidence (${e.verification})`
        ).join('\n')}\n\n`
      : '';
    
    const riskSection = riskAssessment.length > 0
      ? `### ⚠️ Risk Assessment\n${riskAssessment.map(r =>
          `- **${r.risk}**: ${r.probability} probability, ${r.impact} impact\n  *Mitigation: ${r.mitigation}*`
        ).join('\n')}\n\n`
      : '';
    
    const verificationSection = verificationPlan.length > 0
      ? `### ✅ Verification Requirements\n${verificationPlan.map(v =>
          `- **${v.requirement}**: ${v.method} (${v.priority} priority, ${v.effort} effort)`
        ).join('\n')}\n\n`
      : '';
    
    const verdict = this.synthesizeVerdict(evidenceAudit, riskAssessment);
    
    return `### 🧠 ${personalityName} Forensic Analysis

**Request**: ${request}

${evidenceSection}${riskSection}${verificationSection}**Hunter's Verdict**: ${verdict}

*This analysis applies systematic forensic methodology to identify evidence gaps, assess risks, and establish verification requirements for reliable conclusions.*`;
  }

  private synthesizeVerdict(evidenceAudit: EvidenceAudit[], riskAssessment: RiskAssessment[]): string {
    const strongEvidence = evidenceAudit.filter(e => ['strong', 'conclusive'].includes(e.evidenceLevel)).length;
    const highRisks = riskAssessment.filter(r => ['high', 'critical'].includes(r.probability)).length;
    
    if (strongEvidence === 0 && evidenceAudit.length > 0) {
      return 'Evidence foundation insufficient. Additional validation required before proceeding.';
    }
    
    if (highRisks > 0) {
      return `${highRisks} high-probability risks identified. Risk mitigation must precede implementation.`;
    }
    
    if (strongEvidence > evidenceAudit.length / 2) {
      return 'Evidence foundation solid. Proceed with continuous verification protocols.';
    }
    
    return 'Mixed evidence quality. Strengthen weak points before full commitment.';
  }

  // Analysis helper methods
  private extractClaims(request: string): { text: string; type: string }[] {
    const claims: { text: string; type: string }[] = [];
    
    // Look for assertion patterns
    const assertionPatterns = [
      /is\s+(?:fast|slow|secure|reliable|scalable)/gi,
      /will\s+(?:improve|reduce|increase|decrease)/gi,
      /should\s+(?:work|perform|handle|process)/gi,
      /can\s+(?:handle|process|support|manage)/gi
    ];
    
    assertionPatterns.forEach(pattern => {
      const matches = request.match(pattern);
      if (matches) {
        matches.forEach(match => {
          claims.push({ text: match.trim(), type: 'assertion' });
        });
      }
    });
    
    return claims;
  }

  private assessEvidenceLevel(claim: { text: string; type: string }): 'none' | 'weak' | 'moderate' | 'strong' | 'conclusive' {
    // Simple heuristic - in real implementation, this would be more sophisticated
    if (claim.text.includes('test') || claim.text.includes('measure')) return 'strong';
    if (claim.text.includes('benchmark') || claim.text.includes('profile')) return 'moderate';
    if (claim.text.includes('should') || claim.text.includes('will')) return 'weak';
    return 'none';
  }

  private suggestVerificationMethod(claim: { text: string; type: string }): string {
    if (claim.text.includes('performance') || claim.text.includes('fast')) {
      return 'Benchmark testing required';
    }
    if (claim.text.includes('secure') || claim.text.includes('safe')) {
      return 'Security audit required';
    }
    if (claim.text.includes('reliable') || claim.text.includes('stable')) {
      return 'Stress testing required';
    }
    return 'Empirical validation required';
  }

  private assessClaimCredibility(claim: { text: string; type: string }): number {
    let credibility = 0.5;
    
    if (claim.text.includes('test') || claim.text.includes('benchmark')) credibility += 0.3;
    if (claim.text.includes('should') || claim.text.includes('might')) credibility -= 0.2;
    if (claim.text.includes('always') || claim.text.includes('never')) credibility -= 0.3;
    
    return Math.max(0.1, Math.min(1.0, credibility));
  }

  private detectImplicitClaims(request: string): string[] {
    const implicit: string[] = [];
    
    if (/deploy|production/i.test(request)) {
      implicit.push('System is production-ready');
    }
    
    if (/scale|performance/i.test(request)) {
      implicit.push('Current performance is insufficient');
    }
    
    if (/fix|solve/i.test(request)) {
      implicit.push('Problem root cause is understood');
    }
    
    return implicit;
  }

  private detectAssumptions(request: string): string[] {
    const assumptions: string[] = [];
    
    if (/users? will/i.test(request)) {
      assumptions.push('User behavior prediction');
    }
    
    if (/should work/i.test(request)) {
      assumptions.push('Implementation correctness');
    }
    
    if (/won\'t fail/i.test(request)) {
      assumptions.push('Failure mode exclusion');
    }
    
    return assumptions;
  }

  private identifyRiskSurfaces(request: string): string[] {
    const risks: string[] = [];
    
    if (/network|api|service/i.test(request)) risks.push('Network reliability');
    if (/database|storage|data/i.test(request)) risks.push('Data integrity');
    if (/user|input|form/i.test(request)) risks.push('Input validation');
    if (/deploy|production|release/i.test(request)) risks.push('Deployment failure');
    
    return risks;
  }

  // Risk detection helpers
  private containsPerformanceConcerns(request: string): boolean {
    return /performance|speed|latency|throughput|load/i.test(request);
  }
  
  private containsSecuritySurface(request: string): boolean {
    return /security|auth|login|password|token|permission/i.test(request);
  }
  
  private containsReliabilityConcerns(request: string): boolean {
    return /reliable|stable|crash|fail|error|exception/i.test(request);
  }
  
  private containsIntegrationPoints(request: string): boolean {
    return /integrat|api|service|microservice|connect/i.test(request);
  }
  
  private containsPerformanceClaims(request: string): boolean {
    return /fast|slow|quick|efficient|optimiz/i.test(request);
  }
  
  private containsEvidenceTerms(request: string): boolean {
    return /evidence|proof|verify|validate|test|measure/i.test(request);
  }
  
  private containsRiskIndicators(request: string): boolean {
    return /risk|danger|fail|problem|issue|concern/i.test(request);
  }
  
  private containsVerificationNeeds(request: string): boolean {
    return /verify|validate|confirm|check|audit|review/i.test(request);
  }
  
  private assessEvidenceComplexity(request: string): number {
    let complexity = 0.4;
    if (/evidence|proof|verify/i.test(request)) complexity += 0.4;
    if (/test|measure|benchmark/i.test(request)) complexity += 0.2;
    return Math.min(complexity, 1.0);
  }
  
  private assessRiskComplexity(request: string): number {
    let complexity = 0.3;
    if (/risk|fail|security|performance/i.test(request)) complexity += 0.5;
    if (/critical|severe|high/i.test(request)) complexity += 0.2;
    return Math.min(complexity, 1.0);
  }
  
  private assessHuntingOpportunity(request: string): number {
    let opportunity = 0.5;
    if (/hunt|find|discover|identify/i.test(request)) opportunity += 0.3;
    if (/hidden|unknown|potential|latent/i.test(request)) opportunity += 0.2;
    return Math.min(opportunity, 1.0);
  }
  
  private assessEvidenceQuality(request: string): number {
    let quality = 0.5;
    if (/test|benchmark|measure|data/i.test(request)) quality += 0.3;
    if (/proven|validated|verified/i.test(request)) quality += 0.2;
    if (/assume|believe|think|should/i.test(request)) quality -= 0.2;
    return Math.max(0.1, Math.min(1.0, quality));
  }
  
  private determineAnalysisDepth(request: string, evidenceAudit: EvidenceAudit[]): 'surface' | 'moderate' | 'deep' {
    const evidenceComplexity = evidenceAudit.length;
    const riskIndicators = this.containsRiskIndicators(request);
    
    if (evidenceComplexity >= 3 && riskIndicators) return 'deep';
    if (evidenceComplexity >= 2 || riskIndicators) return 'moderate';
    return 'surface';
  }
  
  private convertToSpecialtyInsights(
    evidenceAudit: EvidenceAudit[],
    riskAssessment: RiskAssessment[]
  ): SpecialtyInsight[] {
    const insights: SpecialtyInsight[] = [];
    
    evidenceAudit.forEach(evidence => {
      insights.push({
        category: 'Evidence Analysis',
        insight: `${evidence.claim}: ${evidence.evidenceLevel} evidence quality`,
        confidence: evidence.credibility,
        evidence: [evidence.verification]
      });
    });
    
    riskAssessment.forEach(risk => {
      insights.push({
        category: 'Risk Assessment',
        insight: `${risk.risk}: ${risk.probability} probability, ${risk.impact} impact`,
        confidence: 0.8,
        evidence: [risk.mitigation]
      });
    });
    
    return insights;
  }
}
