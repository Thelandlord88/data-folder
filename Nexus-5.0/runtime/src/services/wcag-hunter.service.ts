/**
 * WCAG Hunter Integration - TypeScript Bridge
 * 
 * Connects Python WCAG hunters to NEXUS TypeScript runtime
 */

import { spawn } from 'child_process';
import type {
  WcagHunterReport,
  WcagMasterReport,
  WcagCheckResult,
  WcagPersonalityAnalysis,
  WcagIntelligenceData,
  WcagStrategicImplications
} from '../types';

export class WcagHunterService {
  private pythonPath: string;
  private hunterPath: string;

  constructor() {
    this.pythonPath = 'python3';
    this.hunterPath = './hunters/wcag_hunters.py';
  }

  /**
   * Run WCAG hunters on HTML content
   */
  async checkHtml(html: string): Promise<WcagMasterReport> {
    const { writeFileSync, unlinkSync, readFileSync } = await import('fs');
    
    return new Promise((resolve, reject) => {
      // Create temporary file with HTML
      const tmpFile = `/tmp/wcag-check-${Date.now()}.html`;
      writeFileSync(tmpFile, html);

      // Spawn Python hunter
      const hunter = spawn(this.pythonPath, [this.hunterPath, tmpFile]);
      
      let stdout = '';
      let stderr = '';

      hunter.stdout.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      hunter.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      hunter.on('close', (code: number) => {
        // Clean up temp file
        try { unlinkSync(tmpFile); } catch (e) {}

        if (code !== 0) {
          reject(new Error(`Hunter failed: ${stderr}`));
          return;
        }

        try {
          // Read master report
          const reportPath = '__reports/hunt/wcag_master.json';
          const report = JSON.parse(readFileSync(reportPath, 'utf8'));
          resolve(report as WcagMasterReport);
        } catch (err) {
          reject(new Error(`Failed to read report: ${err}`));
        }
      });
    });
  }

  /**
   * Get personality analysis of WCAG findings
   */
  async getPersonalityAnalysis(report: WcagMasterReport): Promise<WcagPersonalityAnalysis> {
    const total = report.total_issues;
    const estTime = report.summary.estimated_fix_time_minutes;

    return {
      guardian: `🛡️  Found ${total} accessibility issues. ${total > 0 ? 'Critical items must be addressed to ensure all users can access content.' : 'Site is accessible - excellent work!'}`,
      
      pragmatist: `🔧 WCAG compliance impacts SEO and legal requirements. ${total > 0 ? `Estimated fix time: ${estTime} minutes. Focus on Level AA for industry standard.` : 'No compliance issues detected.'}`,
      
      architect: `🏗️  ${report.critical_hunters.length > 0 ? `${report.critical_hunters.length} areas need architectural attention. Consider baking WCAG checks into CSS Engine generation.` : 'Architecture supports accessibility well.'}`,
      
      visionary: `🚀 Accessibility enhances design for everyone. ${total > 0 ? 'Future: AI-powered alt text generation and real-time WCAG validation.' : 'Excellent foundation for inclusive design!'}`
    };
  }

  /**
   * Convert WCAG report to Strategic Intelligence format
   */
  async toIntelligenceData(report: WcagMasterReport): Promise<WcagIntelligenceData> {
    const confidence = report.total_issues === 0 ? 1.0 : 
                      report.total_issues <= 5 ? 0.8 : 0.6;

    const threatLevel = report.total_issues === 0 ? 'low' :
                       report.total_issues <= 5 ? 'medium' : 'high';

    return {
      source: 'wcag_hunters',
      confidence,
      timestamp: new Date(),
      data: report,
      threatLevel: threatLevel as 'low' | 'medium' | 'high' | 'critical',
      wcagLevel: 'AA', // Default target
      complianceScore: report.total_issues === 0 ? 100 : 
                      Math.max(0, 100 - (report.total_issues * 10)),
      module: 'wcag_master',
      findings: this.extractFindings(report)
    };
  }

  /**
   * Generate strategic implications from WCAG findings
   */
  async getStrategicImplications(report: WcagMasterReport): Promise<WcagStrategicImplications> {
    const implications: WcagStrategicImplications = {
      businessImpact: [],
      riskFactors: [],
      opportunities: [],
      recommendations: report.next_actions || [],
      timeHorizon: 'immediate',
      accessibilityImpact: [],
      legalRisks: [],
      seoOpportunities: [],
      userExperienceImpact: []
    };

    // Analyze accessibility impact
    if (report.total_issues > 0) {
      implications.accessibilityImpact.push(
        'Vision-impaired users may face barriers',
        'Screen reader compatibility issues detected'
      );

      implications.legalRisks.push(
        'Non-compliance with WCAG may expose to legal action',
        'ADA/Section 508 requirements not fully met'
      );

      implications.businessImpact.push(
        `Estimated fix time: ${report.summary.estimated_fix_time_minutes} minutes`,
        'User base excludes people with disabilities'
      );

      implications.userExperienceImpact.push(
        'Some users cannot access content',
        'Navigation may be difficult without mouse'
      );
    } else {
      implications.accessibilityImpact.push('Fully accessible to all users');
      implications.seoOpportunities.push('Semantic HTML improves search ranking');
      implications.businessImpact.push('Compliant with accessibility standards');
    }

    // SEO opportunities
    if (report.summary.wcag_aa_compliance === 'fully-compliant') {
      implications.seoOpportunities.push(
        'Semantic structure improves SEO',
        'Alt text provides content for search engines'
      );
    }

    return implications;
  }

  /**
   * Full WCAG check with personality analysis and strategic intelligence
   */
  async runFullCheck(html: string): Promise<WcagCheckResult> {
    const report = await this.checkHtml(html);
    const personalityAnalysis = await this.getPersonalityAnalysis(report);
    const intelligenceData = await this.toIntelligenceData(report);
    const strategicImplications = await this.getStrategicImplications(report);

    return {
      wcag_report: report,
      personality_analysis: personalityAnalysis,
      intelligence_data: intelligenceData,
      strategic_implications: strategicImplications,
      compliance_summary: {
        level_a: report.summary.wcag_a_compliance,
        level_aa: report.summary.wcag_aa_compliance,
        estimated_fix_time_minutes: report.summary.estimated_fix_time_minutes
      }
    };
  }

  /**
   * Extract findings from hunter reports
   */
  private extractFindings(report: WcagMasterReport): any[] {
    const findings: any[] = [];
    
    for (const [hunterName, hunterReport] of Object.entries(report.hunter_reports)) {
      if (hunterReport.findings && hunterReport.findings.length > 0) {
        findings.push(...hunterReport.findings);
      }
    }

    return findings;
  }
}

// Export singleton instance
export const wcagHunterService = new WcagHunterService();
