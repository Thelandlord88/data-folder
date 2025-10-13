/**
 * Breakthrough Analyzer
 * 
 * Multi-dimensional analysis of breakthrough moments:
 * - Significance: How important is this insight?
 * - Novelty: How new/unprecedented is this?
 * - Impact: How much value does it create?
 * - Reproducibility: Can we recreate this success?
 * 
 * Uses ML-inspired techniques to identify truly significant
 * learning opportunities vs. random successes.
 */

import { getPatternEvolutionEngine } from './PatternEvolutionEngine.js';

export interface BreakthroughAnalysis {
  significance: number;      // Overall importance (0-1)
  novelty: number;          // How unprecedented (0-1)
  impact: number;           // Value created (0-1)
  reproducibility: number;  // Likelihood of repeating (0-1)
  patterns_triggered: string[];
  composite_score: number;  // Weighted combination
}

export interface BreakthroughMetrics {
  task_completion: number;
  accuracy: number;
  efficiency_gain: number;
}

export class BreakthroughAnalyzer {
  private noveltyIndicators: string[] = [
    'first time',
    'unprecedented',
    'breakthrough',
    'innovative',
    'revolutionary',
    'game-changing',
    'paradigm shift',
    'never before',
    'discovered',
    'emergent'
  ];

  private impactIndicators: string[] = [
    'multiplier',
    'exponential',
    'massive',
    'significant',
    'dramatic',
    'transformative',
    'game-changer'
  ];

  /**
   * Multi-dimensional breakthrough analysis
   */
  analyzeBreakthrough(
    outcomeMetrics: BreakthroughMetrics,
    context: string,
    patternsUsed: string[]
  ): BreakthroughAnalysis {
    const significance = this.calculateSignificance(outcomeMetrics);
    const novelty = this.assessNovelty(context, patternsUsed);
    const impact = this.assessImpact(outcomeMetrics, context);
    const reproducibility = this.estimateReproducibility(patternsUsed, outcomeMetrics);

    // Weighted composite score
    const composite_score = (
      significance * 0.3 +
      novelty * 0.2 +
      impact * 0.35 +
      reproducibility * 0.15
    );

    return {
      significance,
      novelty,
      impact,
      reproducibility,
      patterns_triggered: patternsUsed,
      composite_score
    };
  }

  /**
   * Calculate significance based on metrics
   */
  private calculateSignificance(metrics: BreakthroughMetrics): number {
    // Weighted combination of metrics
    const baseSignificance = (
      metrics.task_completion * 0.3 +
      metrics.accuracy * 0.4 +
      Math.min(metrics.efficiency_gain, 3.0) / 3.0 * 0.3  // Normalize and cap
    );

    // Bonus for exceptional efficiency gains
    const efficiencyBonus = metrics.efficiency_gain > 2.0 ? 0.1 : 0;

    return Math.min(1.0, baseSignificance + efficiencyBonus);
  }

  /**
   * Assess novelty of the breakthrough
   */
  private assessNovelty(context: string, patternsUsed: string[]): number {
    const lowerContext = context.toLowerCase();

    // Check for novelty indicators in context
    const noveltyMatches = this.noveltyIndicators.filter(indicator =>
      lowerContext.includes(indicator)
    ).length;
    const contextNovelty = Math.min(1.0, noveltyMatches / 3); // 3+ indicators = max novelty

    // Pattern combination novelty
    // More patterns = potentially more novel combination
    const combinationNovelty = Math.min(1.0, (patternsUsed.length - 1) * 0.25);

    // Check if this is a rarely-used pattern combination
    const engine = getPatternEvolutionEngine();
    const emergentPatterns = engine.getEmergentPatterns();
    const compositeKey = patternsUsed.sort().join('+');
    const isNewCombination = !emergentPatterns.has(compositeKey);
    const combinationBonus = isNewCombination ? 0.3 : 0;

    return Math.min(1.0, (contextNovelty * 0.4) + (combinationNovelty * 0.3) + (combinationBonus * 0.3));
  }

  /**
   * Assess the impact of the breakthrough
   */
  private assessImpact(metrics: BreakthroughMetrics, context: string): number {
    // Base impact from metrics
    const baseImpact = (metrics.task_completion + metrics.accuracy) / 2;

    // Efficiency gain creates exponential impact
    const efficiencyImpact = Math.min(1.0, (metrics.efficiency_gain - 1) / 2);

    // Context-based impact amplification
    const lowerContext = context.toLowerCase();
    const impactMatches = this.impactIndicators.filter(indicator =>
      lowerContext.includes(indicator)
    ).length;
    const contextImpactMultiplier = 1 + (impactMatches * 0.15);

    const totalImpact = baseImpact * (1 + efficiencyImpact) * contextImpactMultiplier;

    return Math.min(1.0, totalImpact);
  }

  /**
   * Estimate how reproducible this breakthrough is
   */
  private estimateReproducibility(patternsUsed: string[], metrics: BreakthroughMetrics): number {
    // More patterns might mean less reproducibility (more complexity)
    const complexityPenalty = Math.max(0.3, 1 - (patternsUsed.length - 1) * 0.15);

    // Consider pattern stability from evolution engine
    const engine = getPatternEvolutionEngine();
    const avgEffectiveness = patternsUsed.reduce((sum, pattern) => {
      return sum + engine.getEffectiveness(pattern);
    }, 0) / patternsUsed.length;

    // High accuracy suggests reproducibility
    const accuracyBonus = metrics.accuracy > 0.9 ? 0.2 : 0;

    // Check if patterns have proven synergy
    let synergyBonus = 0;
    if (patternsUsed.length >= 2) {
      const relationship = engine.getRelationshipStrength(patternsUsed[0], patternsUsed[1]);
      if (relationship && relationship.co_activation_count > 3) {
        synergyBonus = 0.15; // Proven combination
      }
    }

    const reproducibility = (
      complexityPenalty * 0.3 +
      avgEffectiveness * 0.4 +
      accuracyBonus * 0.15 +
      synergyBonus * 0.15
    );

    return Math.min(1.0, reproducibility);
  }

  /**
   * Determine if this qualifies as a breakthrough
   */
  isBreakthrough(analysis: BreakthroughAnalysis, threshold: number = 0.7): boolean {
    return analysis.composite_score >= threshold;
  }

  /**
   * Get breakthrough classification
   */
  classifyBreakthrough(analysis: BreakthroughAnalysis): string {
    if (analysis.composite_score >= 0.9) return 'Revolutionary';
    if (analysis.composite_score >= 0.8) return 'Major';
    if (analysis.composite_score >= 0.7) return 'Significant';
    if (analysis.composite_score >= 0.6) return 'Moderate';
    return 'Minor';
  }

  /**
   * Generate human-readable breakthrough report
   */
  generateReport(analysis: BreakthroughAnalysis): string {
    const classification = this.classifyBreakthrough(analysis);
    const stars = '⭐'.repeat(Math.ceil(analysis.composite_score * 5));

    let report = `\n🎯 ${classification} Breakthrough Detected! ${stars}\n`;
    report += `   Composite Score: ${(analysis.composite_score * 100).toFixed(1)}%\n\n`;
    report += `   📊 Breakdown:\n`;
    report += `      Significance:     ${(analysis.significance * 100).toFixed(1)}%\n`;
    report += `      Novelty:         ${(analysis.novelty * 100).toFixed(1)}%\n`;
    report += `      Impact:          ${(analysis.impact * 100).toFixed(1)}%\n`;
    report += `      Reproducibility: ${(analysis.reproducibility * 100).toFixed(1)}%\n\n`;
    report += `   🧩 Patterns Involved: ${analysis.patterns_triggered.join(', ')}\n`;

    if (analysis.novelty > 0.7) {
      report += `   ✨ High novelty - potentially new capability discovered!\n`;
    }
    if (analysis.impact > 0.8) {
      report += `   🚀 High impact - significant value created!\n`;
    }
    if (analysis.reproducibility > 0.8) {
      report += `   🎯 High reproducibility - reliable pattern!\n`;
    }

    return report;
  }
}

// Singleton instance
let analyzerInstance: BreakthroughAnalyzer | null = null;

export function getBreakthroughAnalyzer(): BreakthroughAnalyzer {
  if (!analyzerInstance) {
    analyzerInstance = new BreakthroughAnalyzer();
  }
  return analyzerInstance;
}
