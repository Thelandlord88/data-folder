/**
 * ENHANCED CAPABILITY REGISTRY v2.0
 * 
 * Enterprise-grade capability management system with:
 * - Dependency management & conflict detection
 * - Performance & cost tracking
 * - Learning & adaptation system
 * - Security & access control
 * - Real-time monitoring
 * - Conversational discovery
 * - Proactive recommendations
 * - Persistence & backup
 * - Self-maintenance
 * 
 * @version 2.0.0
 * @date October 15, 2025
 */

import type { Capability } from './types.js';
import { writeFile, readFile } from 'node:fs/promises';

// ============================================================================
// ENHANCED TYPE DEFINITIONS
// ============================================================================

export interface EnhancedCapability extends Capability {
  // Dependencies & Conflicts
  dependencies?: string[];
  conflicts_with?: string[];
  prerequisites?: string[];
  compatible_with?: string[];
  
  // Performance & Cost
  performance?: PerformanceMetrics;
  cost_per_use?: number;
  rate_limits?: RateLimits;
  
  // Security
  required_permissions?: string[];
  allowed_environments?: Environment[];
  data_access_level?: DataAccessLevel;
  audit_required?: boolean;
  
  // Learning
  effectiveness: number;
  usage_count?: number;
  last_used?: Date;
  success_rate?: number;
}

export interface PerformanceMetrics {
  execution_time_ms: number;
  memory_usage_mb: number;
  cpu_percent: number;
  cost_units?: number;
  reliability: number;
}

export interface RateLimits {
  requests_per_minute: number;
  requests_per_day: number;
}

export type Environment = 'development' | 'staging' | 'production';
export type DataAccessLevel = 'low' | 'medium' | 'high';

export interface SecurityContext {
  user_roles: string[];
  permissions: string[];
  environment: Environment;
  data_sensitivity: DataAccessLevel;
}

export interface Recommendation {
  capability: EnhancedCapability;
  relevance_score: number;
  reasoning: string;
  estimated_effectiveness: number;
  dependencies_met: boolean;
  conflicts: string[];
}

export interface CapabilityBundle {
  goal: string;
  bundles: BundleRecommendation[];
  best_match: BundleRecommendation;
}

export interface BundleRecommendation {
  primary: Recommendation;
  dependencies: Recommendation[];
  total_effectiveness: number;
  total_cost?: number;
  estimated_time?: number;
}

export interface CapabilityStatus {
  is_available: boolean;
  last_checked: Date;
  response_time_ms?: number;
  error_rate?: number;
  health_score: number;
}

export interface SystemHealth {
  overall_health: number;
  available_capabilities: number;
  degraded_capabilities: number;
  critical_alerts: number;
  last_updated: Date;
}

export interface UsageRecord {
  capability_id: string;
  timestamp: Date;
  success: boolean;
  context: string;
  execution_time?: number;
  related_capabilities?: string[];
}

export interface CapabilityPattern {
  capabilities: string[];
  frequency: number;
  success_rate: number;
  contexts: string[];
}

export interface MaintenanceReport {
  timestamp: Date;
  actions_taken: string[];
  issues_found: string[];
  recommendations: string[];
}

export interface ConversationalResponse {
  understood_intent: Intent;
  recommended_capabilities: Recommendation[];
  suggested_questions: string[];
  quick_start?: string;
  alternative_approaches: string[];
}

export interface Intent {
  goal: string;
  confidence: number;
  entities?: Record<string, string>;
}

export interface ProactiveRecommendation {
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  capabilities: Recommendation[];
  expected_impact: string;
}

export interface SystemState {
  performance_metrics: {
    slow_pages: number;
    avg_response_time: number;
    error_rate: number;
  };
  security_scan: {
    failed_checks: number;
    vulnerabilities: number;
  };
  code_quality: {
    score: number;
    issues: number;
  };
}

// ============================================================================
// ENHANCED CAPABILITY REGISTRY
// ============================================================================

export class EnhancedCapabilityRegistry {
  private capabilities = new Map<string, EnhancedCapability>();
  
  // Multi-dimensional indexes
  private category_index = new Map<string, Set<string>>();
  private tag_index = new Map<string, Set<string>>();
  private type_index = new Map<string, Set<string>>();
  private dependency_index = new Map<string, Set<string>>();
  
  // Learning & monitoring
  private usage_history: UsageRecord[] = [];
  private outcomes = new Map<string, { success: boolean; context: string; timestamp: Date }[]>();
  private statuses = new Map<string, CapabilityStatus>();
  private checkIntervals = new Map<string, NodeJS.Timeout>();
  
  // Singleton pattern
  private static instance: EnhancedCapabilityRegistry;
  
  private constructor() {
    console.log('🧠 Enhanced Capability Registry v2.0 initialized');
  }
  
  static getInstance(): EnhancedCapabilityRegistry {
    if (!EnhancedCapabilityRegistry.instance) {
      EnhancedCapabilityRegistry.instance = new EnhancedCapabilityRegistry();
    }
    return EnhancedCapabilityRegistry.instance;
  }

  // ============================================================================
  // BASIC OPERATIONS (Enhanced)
  // ============================================================================

  register(capability: EnhancedCapability): void {
    this.capabilities.set(capability.id, capability);
    this.updateIndexes(capability);
    console.log(`✅ Registered capability: ${capability.name}`);
  }

  get(id: string): EnhancedCapability | undefined {
    return this.capabilities.get(id);
  }

  getAll(): EnhancedCapability[] {
    return Array.from(this.capabilities.values());
  }

  private updateIndexes(capability: EnhancedCapability): void {
    // Category index
    if (!this.category_index.has(capability.category)) {
      this.category_index.set(capability.category, new Set());
    }
    this.category_index.get(capability.category)!.add(capability.id);

    // Tag index
    const tags = capability.metadata.tags || [];
    tags.forEach((tag: string) => {
      if (!this.tag_index.has(tag)) {
        this.tag_index.set(tag, new Set());
      }
      this.tag_index.get(tag)!.add(capability.id);
    });

    // Type index
    if (!this.type_index.has(capability.type)) {
      this.type_index.set(capability.type, new Set());
    }
    this.type_index.get(capability.type)!.add(capability.id);
    
    // Dependency index
    if (capability.dependencies) {
      capability.dependencies.forEach(dep => {
        if (!this.dependency_index.has(dep)) {
          this.dependency_index.set(dep, new Set());
        }
        this.dependency_index.get(dep)!.add(capability.id);
      });
    }
  }

  // ============================================================================
  // DISCOVERY & RECOMMENDATIONS
  // ============================================================================

  discover(need: string, context: string[] = []): Recommendation[] {
    const allCapabilities = this.getAll();
    const candidates = allCapabilities.map(cap => ({
      capability: cap,
      relevance_score: this.calculateRelevance(cap, need, context),
      reasoning: this.explainRelevance(cap, need, context),
      estimated_effectiveness: this.getContextualEffectiveness(cap.id, need),
      dependencies_met: this.checkDependencies(cap).length === 0,
      conflicts: this.checkConflicts(cap, [])
    }));

    return candidates
      .filter(rec => rec.relevance_score > 0.3)
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 10);
  }

  private calculateRelevance(
    cap: EnhancedCapability,
    need: string,
    context: string[]
  ): number {
    let score = 0;
    const lowerNeed = need.toLowerCase();
    const lowerName = cap.name.toLowerCase();
    const lowerSummary = cap.summary_one_line.toLowerCase();

    // Name matching (highest weight)
    if (lowerName.includes(lowerNeed)) score += 0.4;
    if (lowerNeed.includes(lowerName)) score += 0.3;

    // Summary matching
    if (lowerSummary.includes(lowerNeed)) score += 0.2;

    // Context matching
    const tags = cap.metadata.tags || [];
    context.forEach(ctx => {
      if (tags.includes(ctx)) score += 0.1;
    });

    // Effectiveness boost
    score *= (1 + cap.effectiveness * 0.5);

    // Usage boost (popular capabilities)
    const usageCount = cap.usage_count || 0;
    if (usageCount > 10) score *= 1.1;
    if (usageCount > 50) score *= 1.2;

    return Math.min(score, 1.0);
  }

  private explainRelevance(
    cap: EnhancedCapability,
    need: string,
    context: string[]
  ): string {
    const reasons: string[] = [];

    if (cap.name.toLowerCase().includes(need.toLowerCase())) {
      reasons.push('Name matches need');
    }

    if (cap.effectiveness > 0.8) {
      reasons.push(`High effectiveness (${(cap.effectiveness * 100).toFixed(0)}%)`);
    }

    if ((cap.usage_count || 0) > 50) {
      reasons.push('Proven track record');
    }

    const contextMatches = context.filter(ctx => 
      (cap.metadata.tags || []).includes(ctx)
    );
    if (contextMatches.length > 0) {
      reasons.push(`Matches context: ${contextMatches.join(', ')}`);
    }

    return reasons.join('; ') || 'General match';
  }

  // ============================================================================
  // DEPENDENCIES & CONFLICTS
  // ============================================================================

  validateCapabilityCompatibility(
    capability: EnhancedCapability,
    existingCapabilities: string[]
  ): { compatible: boolean; conflicts: string[]; missingDeps: string[] } {
    const conflicts = capability.conflicts_with?.filter(conflict =>
      existingCapabilities.includes(conflict)
    ) || [];

    const missingDeps = this.checkDependencies(capability);

    return {
      compatible: conflicts.length === 0 && missingDeps.length === 0,
      conflicts,
      missingDeps
    };
  }

  private checkDependencies(capability: EnhancedCapability): string[] {
    if (!capability.dependencies) return [];
    
    return capability.dependencies.filter(depId => 
      !this.capabilities.has(depId)
    );
  }

  private checkConflicts(
    capability: EnhancedCapability,
    existingCapabilities: string[]
  ): string[] {
    if (!capability.conflicts_with) return [];
    
    return capability.conflicts_with.filter(conflictId =>
      existingCapabilities.includes(conflictId)
    );
  }

  suggestCapabilityBundle(goal: string, context: string[] = []): CapabilityBundle {
    const primary = this.discover(goal, context);
    
    const bundles = primary.map(rec => {
      const deps = rec.capability.dependencies || [];
      const dependencyRecs = deps
        .map(depId => this.get(depId))
        .filter(Boolean)
        .map(dep => ({
          capability: dep!,
          relevance_score: 0.8,
          reasoning: 'Required dependency',
          estimated_effectiveness: dep!.effectiveness,
          dependencies_met: true,
          conflicts: []
        }));

      return {
        primary: rec,
        dependencies: dependencyRecs,
        total_effectiveness: this.calculateBundleEffectiveness([rec, ...dependencyRecs]),
        total_cost: this.calculateBundleCost([rec, ...dependencyRecs]),
        estimated_time: this.estimateBundleTime([rec, ...dependencyRecs])
      };
    });

    const sortedBundles = bundles.sort((a, b) => 
      b.total_effectiveness - a.total_effectiveness
    );
    
    const bestMatch = sortedBundles[0] || bundles[0];

    return {
      goal,
      bundles,
      best_match: bestMatch
    };
  }

  private calculateBundleEffectiveness(recommendations: Recommendation[]): number {
    if (recommendations.length === 0) return 0;
    
    // Weighted average with diminishing returns
    let totalScore = 0;
    let weight = 1.0;
    
    recommendations.forEach(rec => {
      totalScore += rec.estimated_effectiveness * weight;
      weight *= 0.8; // Diminishing returns for additional capabilities
    });
    
    return totalScore / recommendations.length;
  }

  private calculateBundleCost(recommendations: Recommendation[]): number {
    return recommendations.reduce((total, rec) => 
      total + (rec.capability.cost_per_use || 0), 0
    );
  }

  private estimateBundleTime(recommendations: Recommendation[]): number {
    return recommendations.reduce((total, rec) => 
      total + (rec.capability.performance?.execution_time_ms || 0), 0
    );
  }

  // ============================================================================
  // LEARNING & ADAPTATION
  // ============================================================================

  recordUsage(
    capabilityId: string,
    success: boolean,
    context: string,
    executionTime?: number,
    relatedCapabilities?: string[]
  ): void {
    const record: UsageRecord = {
      capability_id: capabilityId,
      timestamp: new Date(),
      success,
      context,
      execution_time: executionTime,
      related_capabilities: relatedCapabilities
    };

    this.usage_history.push(record);

    // Update outcomes map
    if (!this.outcomes.has(capabilityId)) {
      this.outcomes.set(capabilityId, []);
    }
    this.outcomes.get(capabilityId)!.push({
      success,
      context,
      timestamp: new Date()
    });

    // Update capability metrics
    const capability = this.get(capabilityId);
    if (capability) {
      capability.usage_count = (capability.usage_count || 0) + 1;
      capability.last_used = new Date();
      this.updateCapabilityEffectiveness(capabilityId);
    }
  }

  private updateCapabilityEffectiveness(capabilityId: string): void {
    const outcomes = this.outcomes.get(capabilityId);
    if (!outcomes || outcomes.length === 0) return;

    // Calculate success rate from recent outcomes (last 20)
    const recentOutcomes = outcomes.slice(-20);
    const successCount = recentOutcomes.filter(o => o.success).length;
    const successRate = successCount / recentOutcomes.length;

    const capability = this.get(capabilityId);
    if (capability) {
      // Blend base effectiveness with learned success rate
      capability.effectiveness = (capability.effectiveness * 0.7) + (successRate * 0.3);
      capability.success_rate = successRate;
    }
  }

  getContextualEffectiveness(capabilityId: string, context: string): number {
    const capability = this.get(capabilityId);
    if (!capability) return 0;

    const relevantOutcomes = this.outcomes.get(capabilityId)?.filter(
      outcome => outcome.context.toLowerCase().includes(context.toLowerCase())
    ) || [];

    if (relevantOutcomes.length === 0) {
      return capability.effectiveness;
    }

    const successRate = relevantOutcomes.filter(o => o.success).length / relevantOutcomes.length;
    return successRate;
  }

  findPatterns(): CapabilityPattern[] {
    const patterns = new Map<string, CapabilityPattern>();

    this.usage_history.forEach(usage => {
      const usedTogether = usage.related_capabilities || [];
      if (usedTogether.length > 1) {
        const key = usedTogether.sort().join('|');
        
        if (!patterns.has(key)) {
          patterns.set(key, {
            capabilities: usedTogether,
            frequency: 0,
            success_rate: 0,
            contexts: []
          });
        }

        const pattern = patterns.get(key)!;
        pattern.frequency++;
        pattern.success_rate = (pattern.success_rate * (pattern.frequency - 1) + (usage.success ? 1 : 0)) / pattern.frequency;
        if (!pattern.contexts.includes(usage.context)) {
          pattern.contexts.push(usage.context);
        }
      }
    });

    return Array.from(patterns.values())
      .filter(p => p.frequency >= 3)
      .sort((a, b) => b.frequency - a.frequency);
  }

  // ============================================================================
  // SECURITY & ACCESS CONTROL
  // ============================================================================

  discoverSecure(need: string, securityContext: SecurityContext): Recommendation[] {
    let candidates = this.discover(need);

    // Filter by permissions
    candidates = candidates.filter(rec =>
      !rec.capability.required_permissions ||
      rec.capability.required_permissions.every(perm =>
        securityContext.permissions.includes(perm)
      )
    );

    // Filter by environment
    candidates = candidates.filter(rec =>
      !rec.capability.allowed_environments ||
      rec.capability.allowed_environments.includes(securityContext.environment)
    );

    // Filter by data sensitivity
    candidates = candidates.filter(rec => {
      if (!rec.capability.data_access_level) return true;
      return this.getDataAccessLevelValue(rec.capability.data_access_level) <=
             this.getDataAccessLevelValue(securityContext.data_sensitivity);
    });

    return candidates;
  }

  private getDataAccessLevelValue(level: DataAccessLevel): number {
    const levels: Record<DataAccessLevel, number> = {
      'low': 1,
      'medium': 2,
      'high': 3
    };
    return levels[level] || 0;
  }

  // ============================================================================
  // MONITORING & HEALTH
  // ============================================================================

  async startMonitoring(capabilityId: string, checkIntervalMs: number = 60000): Promise<void> {
    const checkHealth = async () => {
      const status = await this.checkCapabilityHealth(capabilityId);
      this.statuses.set(capabilityId, status);

      if (status.health_score < 0.5) {
        console.warn(`⚠️  Degraded capability: ${capabilityId} (health: ${(status.health_score * 100).toFixed(0)}%)`);
      }
    };

    await checkHealth();

    this.checkIntervals.set(
      capabilityId,
      setInterval(checkHealth, checkIntervalMs)
    );
  }

  private async checkCapabilityHealth(capabilityId: string): Promise<CapabilityStatus> {
    const capability = this.get(capabilityId);
    if (!capability) {
      return {
        is_available: false,
        last_checked: new Date(),
        health_score: 0
      };
    }

    // Calculate health based on recent usage
    const recentOutcomes = this.outcomes.get(capabilityId)?.slice(-10) || [];
    const successRate = recentOutcomes.length > 0
      ? recentOutcomes.filter(o => o.success).length / recentOutcomes.length
      : 1;

    return {
      is_available: true,
      last_checked: new Date(),
      error_rate: 1 - successRate,
      health_score: successRate
    };
  }

  getSystemHealth(): SystemHealth {
    const allStatuses = Array.from(this.statuses.values());

    if (allStatuses.length === 0) {
      return {
        overall_health: 1.0,
        available_capabilities: this.capabilities.size,
        degraded_capabilities: 0,
        critical_alerts: 0,
        last_updated: new Date()
      };
    }

    const overallHealth = allStatuses.reduce((acc, status) => 
      acc + status.health_score, 0
    ) / allStatuses.length;

    return {
      overall_health: overallHealth,
      available_capabilities: allStatuses.filter(s => s.is_available).length,
      degraded_capabilities: allStatuses.filter(s => s.health_score < 0.7).length,
      critical_alerts: allStatuses.filter(s => s.health_score < 0.3).length,
      last_updated: new Date()
    };
  }

  stopMonitoring(capabilityId: string): void {
    const interval = this.checkIntervals.get(capabilityId);
    if (interval) {
      clearInterval(interval);
      this.checkIntervals.delete(capabilityId);
    }
  }

  // ============================================================================
  // CONVERSATIONAL INTERFACE
  // ============================================================================

  conversationalDiscover(query: string): ConversationalResponse {
    const intent = this.parseIntent(query);
    const context = this.extractContext(query);

    const capabilities = this.discover(intent.goal, context);

    return {
      understood_intent: intent,
      recommended_capabilities: capabilities,
      suggested_questions: this.generateFollowUpQuestions(capabilities, intent),
      quick_start: capabilities[0] ? this.generateQuickStart(capabilities[0]) : undefined,
      alternative_approaches: this.findAlternativeApproaches(intent, capabilities)
    };
  }

  private parseIntent(query: string): Intent {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('validate') || lowerQuery.includes('check')) {
      return { goal: 'validation', confidence: 0.8 };
    } else if (lowerQuery.includes('analyze') || lowerQuery.includes('scan')) {
      return { goal: 'analysis', confidence: 0.9 };
    } else if (lowerQuery.includes('enhance') || lowerQuery.includes('improve')) {
      return { goal: 'enhancement', confidence: 0.7 };
    } else if (lowerQuery.includes('security')) {
      return { goal: 'security', confidence: 0.85 };
    } else if (lowerQuery.includes('performance')) {
      return { goal: 'performance', confidence: 0.85 };
    }

    return { goal: 'general', confidence: 0.5 };
  }

  private extractContext(query: string): string[] {
    const contexts: string[] = [];
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('form')) contexts.push('form');
    if (lowerQuery.includes('web') || lowerQuery.includes('website')) contexts.push('web');
    if (lowerQuery.includes('api')) contexts.push('api');
    if (lowerQuery.includes('mobile')) contexts.push('mobile');
    if (lowerQuery.includes('database')) contexts.push('database');

    return contexts;
  }

  private generateFollowUpQuestions(capabilities: Recommendation[], intent: Intent): string[] {
    const questions: string[] = [];

    if (capabilities.length === 0) {
      questions.push("Could you provide more context about what you're trying to achieve?");
      questions.push("What specific problem are you trying to solve?");
    } else {
      questions.push(`Would you like to see how to use ${capabilities[0].capability.name}?`);
      if (capabilities.length > 1) {
        questions.push(`Should I compare the top ${Math.min(3, capabilities.length)} options for you?`);
      }
      questions.push("Do you need capabilities that work together?");
    }

    return questions;
  }

  private generateQuickStart(recommendation: Recommendation): string {
    return `To use ${recommendation.capability.name}:\n1. Ensure dependencies are met\n2. Check ${recommendation.capability.type} requirements\n3. Execute with context: ${recommendation.reasoning}`;
  }

  private findAlternativeApproaches(intent: Intent, recommendations: Recommendation[]): string[] {
    const alternatives: string[] = [];

    if (recommendations.length > 0) {
      const categories = new Set(recommendations.map(r => r.capability.category));
      categories.forEach(cat => {
        if (cat !== recommendations[0].capability.category) {
          alternatives.push(`Try ${cat} approach instead`);
        }
      });
    }

    return alternatives.slice(0, 3);
  }

  // ============================================================================
  // PROACTIVE RECOMMENDATIONS
  // ============================================================================

  getProactiveRecommendations(systemState: SystemState): ProactiveRecommendation[] {
    const recommendations: ProactiveRecommendation[] = [];

    // Performance issues
    if (systemState.performance_metrics.slow_pages > 5) {
      const perfCaps = this.discover('performance optimization');
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: `Detected ${systemState.performance_metrics.slow_pages} slow pages. Consider optimization.`,
        capabilities: perfCaps,
        expected_impact: '20-40% improvement in load times'
      });
    }

    // Security concerns
    if (systemState.security_scan.failed_checks > 0) {
      const securityCaps = this.discover('security audit');
      recommendations.push({
        type: 'security',
        priority: 'critical',
        message: `${systemState.security_scan.failed_checks} security checks failed. Immediate action required.`,
        capabilities: securityCaps,
        expected_impact: 'Critical risk reduction'
      });
    }

    // Code quality
    if (systemState.code_quality.score < 80) {
      const qualityCaps = this.discover('code quality');
      recommendations.push({
        type: 'quality',
        priority: 'medium',
        message: `Code quality score is ${systemState.code_quality.score}/100. Consider improvements.`,
        capabilities: qualityCaps,
        expected_impact: 'Improved maintainability and reduced technical debt'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // ============================================================================
  // PERSISTENCE & BACKUP
  // ============================================================================

  async saveToFile(path: string): Promise<void> {
    const data = {
      capabilities: Array.from(this.capabilities.entries()),
      usage_history: this.usage_history,
      outcomes: Array.from(this.outcomes.entries()),
      indexes: {
        category: Array.from(this.category_index.entries()).map(([k, v]) => [k, Array.from(v)]),
        tag: Array.from(this.tag_index.entries()).map(([k, v]) => [k, Array.from(v)]),
        type: Array.from(this.type_index.entries()).map(([k, v]) => [k, Array.from(v)])
      },
      metadata: {
        version: '2.0.0',
        saved_at: new Date().toISOString(),
        total_capabilities: this.capabilities.size,
        total_usage_records: this.usage_history.length
      }
    };

    await writeFile(path, JSON.stringify(data, null, 2));
    console.log(`💾 Registry saved to ${path}`);
  }

  async loadFromFile(path: string): Promise<void> {
    const content = await readFile(path, 'utf8');
    const data = JSON.parse(content);

    // Restore capabilities
    this.capabilities.clear();
    data.capabilities.forEach(([id, cap]: [string, EnhancedCapability]) => {
      this.capabilities.set(id, cap);
    });

    // Restore usage history
    this.usage_history = data.usage_history || [];

    // Restore outcomes
    this.outcomes.clear();
    if (data.outcomes) {
      data.outcomes.forEach(([id, outcomes]: [string, any[]]) => {
        this.outcomes.set(id, outcomes);
      });
    }

    // Rebuild indexes
    this.rebuildIndexes();

    console.log(`📂 Registry loaded from ${path} (${this.capabilities.size} capabilities)`);
  }

  private rebuildIndexes(): void {
    this.category_index.clear();
    this.tag_index.clear();
    this.type_index.clear();
    this.dependency_index.clear();

    this.capabilities.forEach(cap => this.updateIndexes(cap));
  }

  // ============================================================================
  // MAINTENANCE
  // ============================================================================

  performMaintenance(): MaintenanceReport {
    const report: MaintenanceReport = {
      timestamp: new Date(),
      actions_taken: [],
      issues_found: [],
      recommendations: []
    };

    // Clean old usage history (>90 days)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const oldRecords = this.usage_history.filter(r => r.timestamp < ninetyDaysAgo);
    
    if (oldRecords.length > 0) {
      this.usage_history = this.usage_history.filter(r => r.timestamp >= ninetyDaysAgo);
      report.actions_taken.push(`Cleaned ${oldRecords.length} old usage records`);
    }

    // Find orphaned capabilities (no usage in 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const orphaned = this.getAll().filter(cap =>
      !cap.last_used || cap.last_used < thirtyDaysAgo
    );

    if (orphaned.length > 0) {
      report.recommendations.push(
        `Consider archiving ${orphaned.length} unused capabilities: ${orphaned.map(c => c.name).join(', ')}`
      );
    }

    // Check for low effectiveness
    const lowEffectiveness = this.getAll().filter(cap => cap.effectiveness < 0.5);
    if (lowEffectiveness.length > 0) {
      report.issues_found.push(
        `${lowEffectiveness.length} capabilities have low effectiveness (<50%)`
      );
    }

    // Validate index consistency
    const indexErrors = this.validateIndexConsistency();
    if (indexErrors.length > 0) {
      report.issues_found.push(...indexErrors);
      this.rebuildIndexes();
      report.actions_taken.push('Rebuilt indexes due to inconsistencies');
    }

    console.log(`🔧 Maintenance complete: ${report.actions_taken.length} actions, ${report.issues_found.length} issues`);
    return report;
  }

  private validateIndexConsistency(): string[] {
    const errors: string[] = [];

    // Check category index
    this.category_index.forEach((ids, category) => {
      ids.forEach(id => {
        const cap = this.get(id);
        if (!cap) {
          errors.push(`Category index references missing capability: ${id}`);
        } else if (cap.category !== category) {
          errors.push(`Category index mismatch for ${id}: expected ${category}, got ${cap.category}`);
        }
      });
    });

    return errors;
  }

  // ============================================================================
  // STATISTICS & REPORTING
  // ============================================================================

  getStatistics(): Record<string, any> {
    return {
      total_capabilities: this.capabilities.size,
      total_usage_records: this.usage_history.length,
      avg_effectiveness: this.getAll().reduce((sum, cap) => sum + cap.effectiveness, 0) / this.capabilities.size,
      most_used: this.getMostUsedCapabilities(5),
      least_used: this.getLeastUsedCapabilities(5),
      by_category: this.getCapabilityCountByCategory(),
      health: this.getSystemHealth(),
      patterns: this.findPatterns().length
    };
  }

  private getMostUsedCapabilities(limit: number): Array<{ name: string; usage_count: number }> {
    return this.getAll()
      .filter(cap => cap.usage_count && cap.usage_count > 0)
      .sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))
      .slice(0, limit)
      .map(cap => ({ name: cap.name, usage_count: cap.usage_count || 0 }));
  }

  private getLeastUsedCapabilities(limit: number): Array<{ name: string; usage_count: number }> {
    return this.getAll()
      .sort((a, b) => (a.usage_count || 0) - (b.usage_count || 0))
      .slice(0, limit)
      .map(cap => ({ name: cap.name, usage_count: cap.usage_count || 0 }));
  }

  private getCapabilityCountByCategory(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.getAll().forEach(cap => {
      counts[cap.category] = (counts[cap.category] || 0) + 1;
    });
    return counts;
  }
}

// Export singleton instance
export function getEnhancedCapabilityRegistry(): EnhancedCapabilityRegistry {
  return EnhancedCapabilityRegistry.getInstance();
}

export default EnhancedCapabilityRegistry;
