/**
 * Pattern Selector - Intelligent pattern selection
 * 
 * Uses multi-dimensional scoring to select optimal patterns
 * 
 * @version 2.0.0
 */

import type {
  UXPattern,
  PageAnalysis,
  OpportunityDetection,
  PatternApplication,
  EnhanceOptions
} from './types.js';

export class PatternSelector {
  
  /**
   * Select optimal patterns based on opportunities and analysis
   */
  async select(
    opportunities: OpportunityDetection[],
    analysis: PageAnalysis,
    options: EnhanceOptions,
    availablePatterns: UXPattern[]
  ): Promise<PatternApplication[]> {
    
    const applications: PatternApplication[] = [];
    
    // Filter patterns if specific ones requested
    let patternsToConsider = availablePatterns;
    if (options.patterns && options.patterns.length > 0) {
      patternsToConsider = availablePatterns.filter(p => 
        options.patterns!.includes(p.id)
      );
    }
    
    // Filter by category if specified
    if (options.categories && options.categories.length > 0) {
      patternsToConsider = patternsToConsider.filter(p =>
        options.categories!.includes(p.category)
      );
    }
    
    // Exclude patterns if specified
    if (options.exclude_patterns) {
      patternsToConsider = patternsToConsider.filter(p =>
        !options.exclude_patterns!.includes(p.id)
      );
    }
    
    // Filter by AAA requirement
    if (options.require_aaa) {
      patternsToConsider = patternsToConsider.filter(p => p.aaa_safe);
    }
    
    // Score each opportunity against available patterns
    for (const opportunity of opportunities) {
      const scoredPatterns = this.scorePatterns(
        opportunity,
        patternsToConsider,
        analysis
      );
      
      // Select best pattern for this opportunity
      if (scoredPatterns.length > 0) {
        const bestPattern = scoredPatterns[0];
        
        if (bestPattern.score >= (options.min_confidence || 0.6)) {
          applications.push({
            pattern_id: bestPattern.pattern.id,
            pattern_name: bestPattern.pattern.name,
            elements_affected: opportunity.count,
            selectors_matched: [opportunity.selector],
            confidence: bestPattern.score,
            reasoning: bestPattern.reasoning,
            estimated_impact: this.estimateImpact(bestPattern.pattern, opportunity)
          });
        }
      }
    }
    
    // Sort by confidence
    applications.sort((a, b) => b.confidence - a.confidence);
    
    return applications;
  }
  
  /**
   * Score patterns against an opportunity
   */
  private scorePatterns(
    opportunity: OpportunityDetection,
    patterns: UXPattern[],
    analysis: PageAnalysis
  ): Array<{ pattern: UXPattern; score: number; reasoning: string }> {
    
    const scored = patterns
      .filter(pattern => {
        // Check if pattern is suggested for this opportunity
        return opportunity.suggested_patterns.includes(pattern.id);
      })
      .map(pattern => {
        const score = this.calculateScore(pattern, opportunity, analysis);
        const reasoning = this.generateReasoning(pattern, opportunity, analysis, score);
        
        return { pattern, score, reasoning };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
    
    return scored;
  }
  
  /**
   * Calculate multi-dimensional score for pattern
   * 
   * Scoring dimensions:
   * 1. Pattern effectiveness (30%)
   * 2. Context relevance (25%)
   * 3. Element importance (20%)
   * 4. Design style fit (15%)
   * 5. Page intent alignment (10%)
   */
  private calculateScore(
    pattern: UXPattern,
    opportunity: OpportunityDetection,
    analysis: PageAnalysis
  ): number {
    
    let score = 0;
    
    // 1. Pattern effectiveness (30%)
    const effectiveness = pattern.effectiveness || 0.5;
    score += effectiveness * 0.30;
    
    // 2. Context relevance (25%)
    const contextRelevance = this.calculateContextRelevance(pattern, analysis);
    score += contextRelevance * 0.25;
    
    // 3. Element importance (20%)
    const elementImportance = this.calculateElementImportance(opportunity, analysis);
    score += elementImportance * 0.20;
    
    // 4. Design style fit (15%)
    const designFit = this.calculateDesignFit(pattern, analysis);
    score += designFit * 0.15;
    
    // 5. Page intent alignment (10%)
    const intentAlignment = this.calculateIntentAlignment(pattern, analysis);
    score += intentAlignment * 0.10;
    
    return Math.min(score, 1.0);
  }
  
  /**
   * Calculate context relevance
   */
  private calculateContextRelevance(pattern: UXPattern, analysis: PageAnalysis): number {
    let relevance = 0.5; // Base relevance
    
    // Check if pattern type matches page context
    if (analysis.page_type === 'product' || analysis.page_type === 'checkout') {
      if (pattern.category === 'micro-interaction') relevance += 0.3;
      if (pattern.tags.includes('conversion')) relevance += 0.2;
    }
    
    if (analysis.page_type === 'landing') {
      if (pattern.category === 'visual-feedback') relevance += 0.3;
      if (pattern.impact === 'high') relevance += 0.2;
    }
    
    if (analysis.page_type === 'article' || analysis.page_type === 'blog') {
      if (pattern.category === 'content-enhancement') relevance += 0.3;
    }
    
    if (analysis.form_elements > 3) {
      if (pattern.category === 'form-ux') relevance += 0.4;
    }
    
    return Math.min(relevance, 1.0);
  }
  
  /**
   * Calculate element importance
   */
  private calculateElementImportance(
    opportunity: OpportunityDetection,
    analysis: PageAnalysis
  ): number {
    // Priority mapping
    const priorityScores = {
      critical: 1.0,
      high: 0.8,
      medium: 0.5,
      low: 0.3
    };
    
    let importance = priorityScores[opportunity.priority];
    
    // Adjust based on element count
    if (opportunity.count > 5) importance += 0.1;
    if (opportunity.count > 10) importance += 0.1;
    
    return Math.min(importance, 1.0);
  }
  
  /**
   * Calculate design style fit
   */
  private calculateDesignFit(pattern: UXPattern, analysis: PageAnalysis): number {
    let fit = 0.5; // Base fit
    
    const style = analysis.design_style;
    
    // Material design loves shadows and elevation
    if (style === 'material') {
      if (pattern.id.includes('elevation') || pattern.id.includes('shadow')) {
        fit += 0.4;
      }
    }
    
    // Minimal design prefers subtle effects
    if (style === 'minimal') {
      if (pattern.complexity === 'low') fit += 0.3;
      if (pattern.id.includes('subtle')) fit += 0.2;
    }
    
    // Playful design allows more animation
    if (style === 'playful') {
      if (pattern.category === 'micro-interaction') fit += 0.3;
      if (pattern.id.includes('bounce') || pattern.id.includes('pulse')) fit += 0.2;
    }
    
    // Corporate design prefers professional effects
    if (style === 'corporate') {
      if (pattern.complexity === 'low' && pattern.impact === 'medium') fit += 0.3;
    }
    
    return Math.min(fit, 1.0);
  }
  
  /**
   * Calculate page intent alignment
   */
  private calculateIntentAlignment(pattern: UXPattern, analysis: PageAnalysis): number {
    let alignment = 0.5; // Base alignment
    
    const intent = analysis.page_intent;
    
    // Conversion pages benefit from high-impact patterns
    if (intent === 'conversion') {
      if (pattern.impact === 'high') alignment += 0.3;
      if (pattern.tags.includes('cta') || pattern.tags.includes('button')) {
        alignment += 0.2;
      }
    }
    
    // Information pages need subtle enhancements
    if (intent === 'information') {
      if (pattern.complexity === 'low') alignment += 0.3;
    }
    
    // Entertainment pages can use more creative patterns
    if (intent === 'entertainment') {
      if (pattern.category === 'micro-interaction') alignment += 0.2;
      if (pattern.tags.includes('playful')) alignment += 0.3;
    }
    
    return Math.min(alignment, 1.0);
  }
  
  /**
   * Generate reasoning for pattern selection
   */
  private generateReasoning(
    pattern: UXPattern,
    opportunity: OpportunityDetection,
    analysis: PageAnalysis,
    score: number
  ): string {
    const parts: string[] = [];
    
    // Pattern effectiveness
    if (pattern.effectiveness > 0.8) {
      parts.push(`highly effective (${Math.round(pattern.effectiveness * 100)}% success rate)`);
    } else if (pattern.effectiveness > 0.6) {
      parts.push(`proven effective (${Math.round(pattern.effectiveness * 100)}%)`);
    }
    
    // Design fit
    if (analysis.design_style) {
      parts.push(`fits ${analysis.design_style} design style`);
    }
    
    // Element importance
    if (opportunity.priority === 'high' || opportunity.priority === 'critical') {
      parts.push(`high-priority elements`);
    }
    
    // Page type
    if (analysis.page_type !== 'unknown') {
      parts.push(`appropriate for ${analysis.page_type} pages`);
    }
    
    // Element count
    if (opportunity.count > 5) {
      parts.push(`applies to ${opportunity.count} elements`);
    }
    
    const reasoning = parts.join(', ');
    return reasoning.charAt(0).toUpperCase() + reasoning.slice(1);
  }
  
  /**
   * Estimate impact of pattern application
   */
  private estimateImpact(pattern: UXPattern, opportunity: OpportunityDetection): string {
    const effectiveness = pattern.effectiveness || 0.5;
    const impactPercent = Math.round(effectiveness * 70);
    
    if (opportunity.priority === 'critical') {
      return `Critical improvement: +${impactPercent}% perceived quality`;
    } else if (opportunity.priority === 'high') {
      return `High impact: +${impactPercent}% perceived quality`;
    } else if (opportunity.priority === 'medium') {
      return `Medium impact: +${impactPercent}% perceived quality`;
    } else {
      return `Subtle enhancement: +${impactPercent}% polish`;
    }
  }
  
  /**
   * Score a single pattern (public method for testing)
   */
  scorePattern(
    pattern: UXPattern,
    opportunity: OpportunityDetection,
    analysis: PageAnalysis
  ): number {
    return this.calculateScore(pattern, opportunity, analysis);
  }
}

export default PatternSelector;
