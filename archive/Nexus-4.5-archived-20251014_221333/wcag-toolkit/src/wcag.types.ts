/**
 * WCAG Hunter Integration Types
 * 
 * Extends NEXUS Strategic Intelligence types for WCAG compliance checking
 */

import type {
  IntelligenceData,
  StrategicImplications,
  ValidationResult,
  ValidatedIntelligence
} from './nexus.types';

// WCAG-specific extensions
export type WcagLevel = 'A' | 'AA' | 'AAA';
export type WcagSeverity = 'critical' | 'warning' | 'info';

/**
 * WCAG Intelligence Data - Extends base intelligence for accessibility
 */
export interface WcagIntelligenceData extends IntelligenceData {
  source: 'wcag_hunters';
  wcagLevel: WcagLevel;
  complianceScore: number;
  module: string;
  findings: WcagFinding[];
}

/**
 * Individual WCAG finding
 */
export interface WcagFinding {
  severity: WcagSeverity;
  rule: string;  // e.g., "WCAG 1.4.3"
  element?: string;
  issue: string;
  fix: string;
  confidence?: number;
}

/**
 * WCAG Strategic Implications - Accessibility impact analysis
 */
export interface WcagStrategicImplications extends StrategicImplications {
  accessibilityImpact: string[];
  legalRisks: string[];
  seoOpportunities: string[];
  userExperienceImpact: string[];
}

/**
 * WCAG Hunter Report (from Python hunters)
 */
export interface WcagHunterReport {
  schemaVersion: number;
  module: string;
  status: 'pass' | 'warn' | 'critical';
  issues: number;
  affected_elements: number;
  counts: Record<string, number>;
  findings: WcagFinding[];
  actions: string[];
  policy_invariants: string[];
  eta_minutes: number;
  unlocks: string[];
}

/**
 * WCAG Master Report (orchestrated results)
 */
export interface WcagMasterReport {
  schemaVersion: number;
  module: 'wcag_master';
  status: 'pass' | 'warn' | 'critical';
  total_issues: number;
  hunters_run: number;
  critical_hunters: string[];
  hunter_reports: Record<string, WcagHunterReport>;
  summary: {
    wcag_a_compliance: string;
    wcag_aa_compliance: string;
    estimated_fix_time_minutes: number;
  };
  next_actions: string[];
}

/**
 * WCAG + Personality Analysis
 */
export interface WcagPersonalityAnalysis {
  guardian: string;
  pragmatist: string;
  architect: string;
  visionary: string;
}

/**
 * Complete WCAG Check Result (NEXUS integration)
 */
export interface WcagCheckResult {
  wcag_report: WcagMasterReport;
  personality_analysis: WcagPersonalityAnalysis;
  intelligence_data: WcagIntelligenceData;
  strategic_implications: WcagStrategicImplications;
  compliance_summary: {
    level_a: string;
    level_aa: string;
    level_aaa?: string;
    estimated_fix_time_minutes: number;
  };
}

/**
 * Layout Strategic Analysis - CSS Engine integration
 */
export interface LayoutStrategicAnalysis {
  responsiveScore: number;
  accessibilityPrediction: number;
  performanceImpact: string[];
  recommendedOptimizations: string[];
  wcagCompliance: {
    predicted_level: WcagLevel;
    potential_issues: string[];
  };
}
