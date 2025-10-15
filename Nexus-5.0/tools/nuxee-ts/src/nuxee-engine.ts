/**
 * NUXEE v2.0 - Core Engine
 * 
 * Intelligent UX Enhancement Engine with Learning Capabilities
 * 
 * @version 2.0.0
 * @date October 15, 2025
 */

import type {
  UXPattern,
  EnhanceOptions,
  EnhancementResult,
  PageAnalysis,
  OpportunityDetection,
  PatternApplication,
  NUXEEEngineOptions,
  LearningRecord,
  ConversationalQuery,
  ConversationalResponse,
  ProactiveRecommendation
} from './types.js';

import { ContextAnalyzer } from './context-analyzer.js';
import { OpportunityDetector } from './opportunity-detector.js';
import { PatternSelector } from './pattern-selector.js';
import { PatternApplier } from './pattern-applier.js';

/**
 * NUXEE Engine - Main orchestration class
 */
export class NUXEEEngine {
  private patterns: Map<string, UXPattern> = new Map();
  private contextAnalyzer: ContextAnalyzer;
  private opportunityDetector: OpportunityDetector;
  private patternSelector: PatternSelector;
  private patternApplier: PatternApplier;
  private learningRecords: LearningRecord[] = [];
  
  // Options
  private enableLearning: boolean;
  private enableAnalytics: boolean;
  private capabilityRegistry?: any;
  
  constructor(options: NUXEEEngineOptions = {}) {
    // Initialize components
    this.contextAnalyzer = new ContextAnalyzer();
    this.opportunityDetector = new OpportunityDetector();
    this.patternSelector = new PatternSelector();
    this.patternApplier = new PatternApplier();
    
    // Set options
    this.enableLearning = options.enable_learning ?? true;
    this.enableAnalytics = options.enable_analytics ?? true;
    this.capabilityRegistry = options.capability_registry;
    
    // Load patterns
    if (options.patterns) {
      options.patterns.forEach(pattern => this.registerPattern(pattern));
    }
  }
  
  /**
   * Register a UX pattern
   */
  registerPattern(pattern: UXPattern): void {
    this.patterns.set(pattern.id, {
      ...pattern,
      created_at: pattern.created_at || new Date(),
      updated_at: new Date(),
      usage_count: pattern.usage_count || 0,
      success_rate: pattern.success_rate || 0.5
    });
    
    // Register with capability registry if available
    if (this.capabilityRegistry) {
      this.registerPatternAsCapability(pattern);
    }
  }
  
  /**
   * Register pattern as NEXUS capability
   */
  private async registerPatternAsCapability(pattern: UXPattern): Promise<void> {
    if (!this.capabilityRegistry) return;
    
    try {
      await this.capabilityRegistry.register({
        id: `ux-pattern-${pattern.id}`,
        name: pattern.name,
        type: 'ux-enhancement',
        category: pattern.category,
        summary_one_line: pattern.description,
        effectiveness: pattern.effectiveness,
        metadata: {
          pattern_id: pattern.id,
          target: pattern.target,
          aaa_safe: pattern.aaa_safe,
          css: pattern.css,
          tags: pattern.tags
        },
        dependencies: pattern.dependencies || [],
        related_capabilities: pattern.works_well_with?.map(id => `ux-pattern-${id}`) || []
      });
      
      console.log(`✅ Registered pattern as capability: ${pattern.name}`);
    } catch (error) {
      console.warn(`⚠️  Failed to register pattern: ${pattern.name}`, error);
    }
  }
  
  /**
   * Enhance HTML with intelligent pattern selection
   */
  async enhance(html: string, options: EnhanceOptions = {}): Promise<EnhancementResult> {
    const startTime = Date.now();
    
    // Merge with default options
    const opts: EnhanceOptions = {
      auto_select: true,
      min_confidence: 0.6,
      max_patterns: 10,
      require_aaa: true,
      motion_safe: true,
      record_usage: this.enableLearning,
      ...options
    };
    
    try {
      // Step 1: Analyze page context
      console.log('📊 Analyzing page context...');
      const analysis = await this.contextAnalyzer.analyze(html);
      
      // Step 2: Detect opportunities
      console.log('🔍 Detecting enhancement opportunities...');
      const opportunities = await this.opportunityDetector.detect(html);
      console.log(`   Found ${opportunities.length} opportunities`);
      
      // Step 3: Select patterns (if auto-select)
      let patternsToApply: PatternApplication[];
      
      if (opts.auto_select) {
        console.log('🧠 Selecting optimal patterns...');
        patternsToApply = await this.patternSelector.select(
          opportunities,
          analysis,
          opts,
          Array.from(this.patterns.values())
        );
        console.log(`   Selected ${patternsToApply.length} patterns`);
      } else {
        // Use specified patterns
        patternsToApply = this.createManualApplications(opts.patterns || [], opportunities);
      }
      
      // Filter by confidence
      patternsToApply = patternsToApply.filter(p => p.confidence >= opts.min_confidence!);
      
      // Limit count
      if (opts.max_patterns) {
        patternsToApply = patternsToApply
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, opts.max_patterns);
      }
      
      // Step 4: Apply patterns
      console.log('🎨 Applying patterns...');
      const enhancedHtml = await this.patternApplier.apply(html, patternsToApply, Array.from(this.patterns.values()));
      
      const processingTime = Date.now() - startTime;
      
      // Step 5: Calculate metrics
      const elementsEnhanced = patternsToApply.reduce((sum, p) => sum + p.elements_affected, 0);
      const cssSize = this.patternApplier.getLastGeneratedCSSSize();
      
      // Step 6: Estimate improvement
      const estimatedImprovement = this.estimateImprovement(patternsToApply, analysis);
      
      // Step 7: Record learning (if enabled)
      if (opts.record_usage && this.enableLearning) {
        await this.recordLearning(patternsToApply, opts, analysis, processingTime);
      }
      
      // Create result
      const result: EnhancementResult = {
        original_html: html,
        enhanced_html: enhancedHtml,
        patterns_applied: patternsToApply,
        patterns_available: this.patterns.size,
        patterns_selected: patternsToApply.length,
        opportunities_detected: opportunities,
        page_analysis: analysis,
        processing_time_ms: processingTime,
        elements_enhanced: elementsEnhanced,
        css_size_bytes: cssSize,
        confidence_score: this.calculateOverallConfidence(patternsToApply),
        aaa_compliant: this.checkAAACompliance(patternsToApply),
        estimated_improvement: estimatedImprovement
      };
      
      // Add explanation if requested
      if (opts.explain) {
        result.explanation = this.generateExplanation(result);
        result.recommendations = this.generateRecommendations(result);
      }
      
      console.log(`✅ Enhancement complete in ${processingTime}ms`);
      console.log(`   ${elementsEnhanced} elements enhanced`);
      console.log(`   ${patternsToApply.length} patterns applied`);
      
      return result;
      
    } catch (error) {
      console.error('❌ Enhancement failed:', error);
      throw error;
    }
  }
  
  /**
   * Conversational enhancement query
   */
  async ask(query: ConversationalQuery): Promise<ConversationalResponse> {
    console.log(`💬 Processing query: "${query.query}"`);
    
    // Parse intent
    const intent = this.parseIntent(query.query);
    
    // Find relevant patterns
    const relevantPatterns = this.findRelevantPatterns(intent, query.context);
    
    // Generate response
    const response: ConversationalResponse = {
      understood_intent: intent,
      recommended_patterns: relevantPatterns.map(pattern => ({
        pattern,
        relevance_score: this.calculateRelevance(pattern, intent),
        reasoning: this.generateReasoning(pattern, intent),
        estimated_impact: this.estimatePatternImpact(pattern)
      })),
      suggested_questions: this.generateSuggestedQuestions(intent),
      quick_start: this.generateQuickStart(relevantPatterns)
    };
    
    return response;
  }
  
  /**
   * Proactive analysis and recommendations
   */
  async analyzeAndRecommend(html: string): Promise<ProactiveRecommendation[]> {
    console.log('🎯 Performing proactive analysis...');
    
    const analysis = await this.contextAnalyzer.analyze(html);
    const opportunities = await this.opportunityDetector.detect(html);
    
    const recommendations: ProactiveRecommendation[] = [];
    
    // Check for accessibility issues
    if (analysis.accessibility_issues.length > 0) {
      recommendations.push({
        type: 'accessibility',
        priority: 'critical',
        message: `${analysis.accessibility_issues.length} accessibility issues detected`,
        reasoning: 'Improving accessibility ensures your site is usable by everyone',
        patterns: this.findAccessibilityPatterns(),
        expected_impact: 'WCAG 2.1 Level A compliance',
        estimated_improvement: {
          accessibility_score: '+15 points',
          confidence: 0.9
        }
      });
    }
    
    // Check for missing hover states
    const interactiveWithoutHover = opportunities.filter(
      o => o.element_type.includes('button') && o.priority === 'high'
    );
    
    if (interactiveWithoutHover.length > 0) {
      recommendations.push({
        type: 'enhancement',
        priority: 'high',
        message: `${interactiveWithoutHover.reduce((sum, o) => sum + o.count, 0)} interactive elements without hover feedback`,
        reasoning: 'Hover feedback significantly improves perceived quality',
        patterns: this.findHoverPatterns(),
        expected_impact: '+60% perceived quality',
        estimated_improvement: {
          perceived_quality: '+60%',
          user_engagement: '+40%',
          confidence: 0.85
        }
      });
    }
    
    console.log(`   Generated ${recommendations.length} recommendations`);
    
    return recommendations;
  }
  
  /**
   * Get pattern metrics
   */
  getPatternMetrics(patternId: string): any {
    const pattern = this.patterns.get(patternId);
    if (!pattern) return null;
    
    const records = this.learningRecords.filter(r => r.pattern_id === patternId);
    
    return {
      pattern_id: patternId,
      total_applications: records.length,
      success_rate: records.filter(r => r.success).length / records.length || 0,
      avg_processing_time_ms: records.reduce((sum, r) => sum + r.execution_time_ms, 0) / records.length || 0,
      contextual_effectiveness: this.calculateContextualEffectiveness(patternId, records)
    };
  }
  
  // ========================================================================
  // Private Helper Methods
  // ========================================================================
  
  private createManualApplications(patternIds: string[], opportunities: OpportunityDetection[]): PatternApplication[] {
    return patternIds
      .map(id => {
        const pattern = this.patterns.get(id);
        if (!pattern) return null;
        
        const matchingOpportunity = opportunities.find(o =>
          o.suggested_patterns.includes(id)
        );
        
        return {
          pattern_id: id,
          pattern_name: pattern.name,
          elements_affected: matchingOpportunity?.count || 0,
          selectors_matched: matchingOpportunity ? [matchingOpportunity.selector] : [],
          confidence: 1.0, // Manual selection has full confidence
          reasoning: 'Manually selected by user',
          estimated_impact: this.estimatePatternImpact(pattern)
        };
      })
      .filter((app): app is PatternApplication => app !== null);
  }
  
  private calculateOverallConfidence(applications: PatternApplication[]): number {
    if (applications.length === 0) return 0;
    return applications.reduce((sum, app) => sum + app.confidence, 0) / applications.length;
  }
  
  private checkAAACompliance(applications: PatternApplication[]): boolean {
    return applications.every(app => {
      const pattern = this.patterns.get(app.pattern_id);
      return pattern?.aaa_safe ?? false;
    });
  }
  
  private estimateImprovement(applications: PatternApplication[], analysis: PageAnalysis): any {
    // Simplified estimation - could be much more sophisticated
    const totalConfidence = this.calculateOverallConfidence(applications);
    
    return {
      perceived_quality: `+${Math.round(totalConfidence * 60)}%`,
      user_engagement: `+${Math.round(totalConfidence * 40)}%`,
      professional_polish: `+${Math.round(totalConfidence * 70)}%`,
      accessibility_score: `+${Math.round(totalConfidence * 15)} points`,
      confidence: totalConfidence
    };
  }
  
  private async recordLearning(
    applications: PatternApplication[],
    options: EnhanceOptions,
    analysis: PageAnalysis,
    executionTime: number
  ): Promise<void> {
    for (const app of applications) {
      const record: LearningRecord = {
        timestamp: new Date(),
        pattern_id: app.pattern_id,
        context: options.context_name || analysis.page_type,
        success: true, // Assume success unless feedback says otherwise
        execution_time_ms: executionTime,
        elements_enhanced: app.elements_affected,
        related_patterns: applications.map(a => a.pattern_id).filter(id => id !== app.pattern_id),
        page_type: analysis.page_type,
        design_style: analysis.design_style
      };
      
      this.learningRecords.push(record);
      
      // Update pattern usage count
      const pattern = this.patterns.get(app.pattern_id);
      if (pattern) {
        pattern.usage_count++;
        pattern.updated_at = new Date();
      }
      
      // Record in capability registry if available
      if (this.capabilityRegistry) {
        await this.capabilityRegistry.recordUsage(
          `ux-pattern-${app.pattern_id}`,
          true,
          options.context_name || analysis.page_type,
          executionTime,
          applications.map(a => `ux-pattern-${a.pattern_id}`)
        );
      }
    }
  }
  
  private calculateContextualEffectiveness(patternId: string, records: LearningRecord[]): Record<string, number> {
    const byContext: Record<string, { success: number; total: number }> = {};
    
    records.forEach(record => {
      if (!byContext[record.context]) {
        byContext[record.context] = { success: 0, total: 0 };
      }
      byContext[record.context].total++;
      if (record.success) {
        byContext[record.context].success++;
      }
    });
    
    const effectiveness: Record<string, number> = {};
    Object.entries(byContext).forEach(([context, stats]) => {
      effectiveness[context] = stats.success / stats.total;
    });
    
    return effectiveness;
  }
  
  private parseIntent(query: string): any {
    const lowerQuery = query.toLowerCase();
    
    // Simple intent parsing (could be much more sophisticated with NLP)
    const intents = {
      form: ['form', 'input', 'field', 'validation'],
      button: ['button', 'cta', 'action', 'click'],
      navigation: ['nav', 'menu', 'navigation', 'link'],
      card: ['card', 'item', 'product'],
      accessibility: ['accessible', 'a11y', 'wcag', 'screen reader'],
      engagement: ['engaging', 'interactive', 'delightful', 'polish']
    };
    
    let bestMatch = 'general';
    let bestScore = 0;
    
    Object.entries(intents).forEach(([intent, keywords]) => {
      const score = keywords.filter(kw => lowerQuery.includes(kw)).length;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = intent;
      }
    });
    
    return {
      goal: bestMatch,
      confidence: Math.min(bestScore / 2, 1),
      interpreted_as: query
    };
  }
  
  private findRelevantPatterns(intent: any, context?: any): UXPattern[] {
    // Filter patterns by relevance to intent
    return Array.from(this.patterns.values())
      .filter(pattern => {
        // Match by category or tags
        if (intent.goal === 'form') {
          return pattern.category === 'form-ux' || pattern.tags.includes('form');
        }
        if (intent.goal === 'button') {
          return pattern.tags.includes('button') || pattern.target.includes('button');
        }
        if (intent.goal === 'accessibility') {
          return pattern.aaa_safe && pattern.wcag_level === 'AAA';
        }
        return true;
      })
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .slice(0, 5);
  }
  
  private calculateRelevance(pattern: UXPattern, intent: any): number {
    // Simplified relevance calculation
    return pattern.effectiveness * intent.confidence;
  }
  
  private generateReasoning(pattern: UXPattern, intent: any): string {
    return `${pattern.name} is highly effective (${Math.round(pattern.effectiveness * 100)}% success rate) for ${intent.goal} enhancement`;
  }
  
  private estimatePatternImpact(pattern: UXPattern): string {
    const impact = Math.round(pattern.effectiveness * 70);
    return `+${impact}% perceived quality`;
  }
  
  private generateSuggestedQuestions(intent: any): string[] {
    return [
      `Would you like to see how to use these patterns?`,
      `Should I analyze your current page first?`,
      `Do you need ${intent.goal}-specific recommendations?`
    ];
  }
  
  private generateQuickStart(patterns: UXPattern[]): string {
    if (patterns.length === 0) return '';
    const patternIds = patterns.slice(0, 3).map(p => p.id).join(',');
    return `Apply these patterns with: nuxee enhance --patterns ${patternIds}`;
  }
  
  private findAccessibilityPatterns(): UXPattern[] {
    return Array.from(this.patterns.values())
      .filter(p => p.wcag_level === 'AAA' && p.category === 'form-ux')
      .slice(0, 3);
  }
  
  private findHoverPatterns(): UXPattern[] {
    return Array.from(this.patterns.values())
      .filter(p => p.tags.includes('hover') || p.category === 'micro-interaction')
      .slice(0, 3);
  }
  
  private generateExplanation(result: EnhancementResult): string {
    return `Applied ${result.patterns_applied.length} patterns to enhance ${result.elements_enhanced} elements. ` +
      `Page analysis revealed ${result.page_analysis.design_style} design style with ${result.page_analysis.page_intent} intent. ` +
      `Estimated improvement: ${result.estimated_improvement.perceived_quality} perceived quality.`;
  }
  
  private generateRecommendations(result: EnhancementResult): string[] {
    const recommendations: string[] = [];
    
    if (result.confidence_score < 0.8) {
      recommendations.push('Consider manual review of pattern selections for optimal results');
    }
    
    if (!result.aaa_compliant) {
      recommendations.push('Some patterns may not meet AAA accessibility standards');
    }
    
    if (result.patterns_available > result.patterns_selected * 2) {
      recommendations.push(`${result.patterns_available - result.patterns_selected} additional patterns available for consideration`);
    }
    
    return recommendations;
  }
  
  /**
   * Get all registered patterns
   */
  getPatterns(): UXPattern[] {
    return Array.from(this.patterns.values());
  }
  
  /**
   * Get pattern by ID
   */
  getPattern(id: string): UXPattern | undefined {
    return this.patterns.get(id);
  }
}

export default NUXEEEngine;
