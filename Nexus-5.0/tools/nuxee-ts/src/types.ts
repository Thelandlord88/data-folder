/**
 * NUXEE v2.0 - Core Type Definitions
 * 
 * TypeScript types for the enhanced NUXEE system
 * Integrated with NEXUS Capability Registry
 * 
 * @version 2.0.0
 * @date October 15, 2025
 */

/**
 * UX Pattern - Core pattern definition
 * Extends EnhancedCapability from NEXUS registry
 */
export interface UXPattern {
  // Core identification
  id: string;
  name: string;
  version: string;
  
  // Classification
  category: PatternCategory;
  type: 'micro-interaction' | 'visual-feedback' | 'form-ux' | 'navigation' | 'content' | 'loading';
  tags: string[];
  
  // Description
  description: string;
  use_cases: string[];
  
  // Technical specification
  target: string; // CSS selector
  css: PatternCSS;
  
  // Compliance & Safety
  aaa_safe: boolean;
  requires_motion_check: boolean;
  wcag_level: 'A' | 'AA' | 'AAA';
  
  // Performance
  impact: 'low' | 'medium' | 'high';
  complexity: 'low' | 'medium' | 'high';
  estimated_performance_cost: number; // 0-1
  
  // Effectiveness & Learning
  effectiveness: number; // 0-1, overall effectiveness
  usage_count: number;
  success_rate: number; // 0-1
  
  // Context-specific effectiveness
  contextual_effectiveness?: Record<string, number>; // context -> effectiveness
  
  // Relationships
  dependencies?: string[]; // Pattern IDs this depends on
  conflicts_with?: string[]; // Patterns that conflict
  works_well_with?: string[]; // Synergistic patterns
  
  // Metadata
  created_at: Date;
  updated_at: Date;
  author?: string;
  
  // Capability integration (optional, added when registered)
  capability_id?: string;
}

/**
 * Pattern CSS Definition
 */
export interface PatternCSS {
  base?: string;
  hover?: string;
  focus?: string;
  active?: string;
  before?: string;
  after?: string;
  hover_before?: string;
  hover_after?: string;
  media_queries?: Record<string, string>;
  keyframes?: string;
}

/**
 * Pattern Category
 */
export type PatternCategory =
  | 'micro-interaction'
  | 'visual-feedback'
  | 'form-ux'
  | 'navigation'
  | 'content-enhancement'
  | 'loading-states'
  | 'accessibility'
  | 'animation';

/**
 * Enhancement Options
 */
export interface EnhanceOptions {
  // Input
  html: string;
  url?: string;
  
  // Pattern selection
  patterns?: string[]; // Specific pattern IDs to use
  categories?: PatternCategory[]; // Categories to consider
  exclude_patterns?: string[]; // Patterns to exclude
  
  // Behavior
  auto_select?: boolean; // Automatically select patterns (default: true)
  min_confidence?: number; // Minimum confidence score (0-1)
  max_patterns?: number; // Maximum patterns to apply
  
  // Context
  page_type?: PageType;
  design_style?: DesignStyle;
  target_audience?: string;
  
  // Compliance
  require_aaa?: boolean; // Only AAA-compliant patterns
  motion_safe?: boolean; // Respect prefers-reduced-motion
  
  // Learning
  record_usage?: boolean; // Record for learning (default: true)
  context_name?: string; // Context for learning tracking
  
  // Output
  preview?: boolean; // Generate preview HTML
  explain?: boolean; // Include explanation of selections
}

/**
 * Enhancement Result
 */
export interface EnhancementResult {
  // Input
  original_html: string;
  
  // Output
  enhanced_html: string;
  
  // Patterns applied
  patterns_applied: PatternApplication[];
  patterns_available: number;
  patterns_selected: number;
  
  // Analysis
  opportunities_detected: OpportunityDetection[];
  page_analysis: PageAnalysis;
  
  // Performance
  processing_time_ms: number;
  elements_enhanced: number;
  css_size_bytes: number;
  
  // Quality
  confidence_score: number; // 0-1
  aaa_compliant: boolean;
  estimated_improvement: EstimatedImprovement;
  
  // Explanation (if requested)
  explanation?: string;
  recommendations?: string[];
  
  // Learning data (if recorded)
  usage_id?: string;
}

/**
 * Pattern Application
 */
export interface PatternApplication {
  pattern_id: string;
  pattern_name: string;
  elements_affected: number;
  selectors_matched: string[];
  confidence: number; // 0-1
  reasoning: string;
  estimated_impact: string;
}

/**
 * Opportunity Detection
 */
export interface OpportunityDetection {
  element_type: string;
  selector: string;
  count: number;
  suggested_patterns: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  reasoning: string;
}

/**
 * Page Analysis
 */
export interface PageAnalysis {
  // Design characteristics
  design_style: DesignStyle;
  layout_density: number; // 0-1
  color_palette: string[];
  typography_style: string;
  
  // Content analysis
  page_type: PageType;
  page_intent: PageIntent;
  primary_actions: string[];
  
  // Technical
  total_elements: number;
  interactive_elements: number;
  form_elements: number;
  
  // Existing patterns
  existing_patterns: string[];
  existing_transitions: boolean;
  existing_animations: boolean;
  
  // Accessibility
  current_accessibility_score: number; // 0-100
  accessibility_issues: string[];
  
  // Recommendations
  recommended_focus_areas: string[];
}

/**
 * Design Style
 */
export type DesignStyle =
  | 'minimal'
  | 'material'
  | 'corporate'
  | 'playful'
  | 'elegant'
  | 'modern'
  | 'classic'
  | 'balanced';

/**
 * Page Type
 */
export type PageType =
  | 'landing'
  | 'product'
  | 'checkout'
  | 'article'
  | 'blog'
  | 'documentation'
  | 'dashboard'
  | 'portfolio'
  | 'unknown';

/**
 * Page Intent
 */
export type PageIntent =
  | 'conversion'
  | 'information'
  | 'entertainment'
  | 'utility'
  | 'education'
  | 'engagement';

/**
 * Estimated Improvement
 */
export interface EstimatedImprovement {
  perceived_quality: string; // e.g., "+60%"
  user_engagement: string; // e.g., "+40%"
  professional_polish: string; // e.g., "+70%"
  accessibility_score: string; // e.g., "+15 points"
  confidence: number; // 0-1
}

/**
 * Context Analyzer Interface
 */
export interface IContextAnalyzer {
  analyze(html: string): Promise<PageAnalysis>;
  detectDesignStyle(html: string): DesignStyle;
  detectPageType(html: string): PageType;
  detectPageIntent(html: string): PageIntent;
  calculateDensity(html: string): number;
}

/**
 * Pattern Selector Interface
 */
export interface IPatternSelector {
  select(
    opportunities: OpportunityDetection[],
    analysis: PageAnalysis,
    options: EnhanceOptions
  ): Promise<PatternApplication[]>;
  
  scorePattern(
    pattern: UXPattern,
    opportunity: OpportunityDetection,
    analysis: PageAnalysis
  ): number;
}

/**
 * Pattern Applier Interface
 */
export interface IPatternApplier {
  apply(
    html: string,
    patterns: PatternApplication[]
  ): Promise<string>;
  
  generateCSS(patterns: PatternApplication[]): string;
  injectCSS(html: string, css: string): string;
}

/**
 * Opportunity Detector Interface
 */
export interface IOpportunityDetector {
  detect(html: string): Promise<OpportunityDetection[]>;
  findElements(html: string, selector: string): number;
}

/**
 * NUXEE Engine Options
 */
export interface NUXEEEngineOptions {
  // Pattern library
  patterns?: UXPattern[];
  pattern_library_path?: string;
  
  // Capability integration
  capability_registry?: any; // Reference to NEXUS registry
  
  // Behavior
  enable_learning?: boolean;
  enable_analytics?: boolean;
  
  // Defaults
  default_options?: Partial<EnhanceOptions>;
}

/**
 * Learning Record
 */
export interface LearningRecord {
  timestamp: Date;
  pattern_id: string;
  context: string;
  success: boolean;
  execution_time_ms: number;
  elements_enhanced: number;
  related_patterns: string[];
  page_type?: PageType;
  design_style?: DesignStyle;
  feedback?: {
    quality_improvement: number; // 0-1
    user_satisfaction: number; // 0-1
  };
}

/**
 * Pattern Performance Metrics
 */
export interface PatternMetrics {
  pattern_id: string;
  total_applications: number;
  success_rate: number; // 0-1
  avg_processing_time_ms: number;
  avg_elements_per_application: number;
  
  // Context breakdown
  by_context: Record<string, {
    applications: number;
    success_rate: number;
    effectiveness: number;
  }>;
  
  // Co-occurrence
  frequently_used_with: Array<{
    pattern_id: string;
    count: number;
    synergy_score: number;
  }>;
  
  // Trends
  trend: 'increasing' | 'stable' | 'decreasing';
  last_30_days: {
    applications: number;
    success_rate: number;
  };
}

/**
 * Conversational Query
 */
export interface ConversationalQuery {
  query: string;
  context?: {
    current_page_html?: string;
    page_type?: PageType;
    existing_patterns?: string[];
  };
}

/**
 * Conversational Response
 */
export interface ConversationalResponse {
  // Understanding
  understood_intent: {
    goal: string;
    confidence: number; // 0-1
    interpreted_as: string;
  };
  
  // Recommendations
  recommended_patterns: Array<{
    pattern: UXPattern;
    relevance_score: number; // 0-1
    reasoning: string;
    estimated_impact: string;
  }>;
  
  // Guidance
  suggested_questions: string[];
  quick_start?: string;
  alternative_approaches?: string[];
  
  // Warnings
  warnings?: string[];
  prerequisites?: string[];
}

/**
 * Proactive Recommendation
 */
export interface ProactiveRecommendation {
  type: 'enhancement' | 'accessibility' | 'performance' | 'engagement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  message: string;
  reasoning: string;
  
  patterns: UXPattern[];
  expected_impact: string;
  estimated_improvement: Partial<EstimatedImprovement>;
  
  quick_fix?: {
    command: string;
    description: string;
  };
}

/**
 * Pattern Bundle
 */
export interface PatternBundle {
  id: string;
  name: string;
  description: string;
  
  patterns: string[]; // Pattern IDs
  synergy_score: number; // 0-1
  combined_effectiveness: number; // 0-1
  
  use_cases: string[];
  best_for: PageType[];
  
  estimated_impact: EstimatedImprovement;
}

/**
 * Export all types
 */
export type {
  UXPattern as Pattern,
  EnhanceOptions as Options,
  EnhancementResult as Result
};
