/**
 * NUXEE v2.1 - Enhanced Component Scanner Type Definitions
 * 
 * Enterprise-grade types for comprehensive component analysis with AI-powered insights
 * 
 * @version 2.1.0
 * @date October 15, 2025
 */

import type { UXPattern } from './types.js';

/**
 * Enhanced Component Analysis with AI-powered insights
 */
export interface ComponentAnalysis {
  // File information
  path: string;
  relative_path: string;
  name: string;
  type: ComponentType;
  size_bytes: number;
  lines_of_code: number;
  last_modified: string;
  
  // Structure detection (enhanced)
  has_forms: boolean;
  has_inputs: boolean;
  has_buttons: boolean;
  has_textareas: boolean;
  has_images: boolean;
  has_hero: boolean;
  has_cards: boolean;
  has_animations: boolean;
  has_navigation: boolean;
  has_modals: boolean;
  has_tables: boolean;
  
  // Interactive element analysis
  interactive_elements: InteractiveElement[];
  form_controls: FormControl[];
  
  // Pattern detection (enhanced)
  existing_nuxee_patterns: PatternUsage[];
  dynamic_classes: string[];
  inline_styles: boolean;
  css_frameworks: CssFramework[];
  
  // Complexity assessment (enhanced)
  complexity: 'simple' | 'moderate' | 'complex';
  complexity_score: number;
  maintainability_index: number;
  cognitive_complexity: number;
  
  // Performance metrics
  estimated_bundle_size: number;
  render_complexity: 'low' | 'medium' | 'high';
  accessibility_score: number; // 0-100
  
  // Opportunities (enhanced)
  opportunities: ComponentOpportunity[];
  recommended_patterns: PatternRecommendation[];
  quick_wins: ComponentOpportunity[];
  
  // Scoring (enhanced)
  nuxee_coverage: number;
  enhancement_potential: number;
  priority_score: number; // Combined score for prioritization
  
  // AI-powered insights
  ai_insights: AIInsight[];
  user_journey_impact: 'low' | 'medium' | 'high';
  conversion_impact: number; // 0-1 estimated impact on conversions
}

/**
 * Enhanced Component Type with sub-types
 */
export type ComponentType = 
  | 'page'
  | 'layout' 
  | 'form'
  | 'card'
  | 'hero'
  | 'section'
  | 'interactive'
  | 'utility'
  | 'navigation'
  | 'modal'
  | 'data_display'
  | 'feedback'
  | 'unknown';

/**
 * Enhanced Component Opportunity with ROI analysis
 */
export interface ComponentOpportunity {
  type: OpportunityType;
  priority: 'low' | 'medium' | 'high' | 'critical';
  pattern_id: string;
  pattern_name: string;
  reason: string;
  expected_impact: string;
  
  // Enhanced effort analysis
  effort: 'trivial' | 'low' | 'medium' | 'high' | 'extreme';
  estimated_hours: number;
  required_skills: SkillLevel[];
  
  // ROI analysis
  expected_roi: number; // Estimated return on investment
  user_impact_score: number; // 0-1
  business_impact_score: number; // 0-1
  
  // Technical details
  code_location?: CodeLocation;
  before_after_examples?: BeforeAfterExample;
  dependencies?: string[]; // Other patterns this depends on
  
  // Validation
  confidence: number; // 0-1 confidence in recommendation
  validation_status: 'untested' | 'tested' | 'validated' | 'rejected';
}

/**
 * Enhanced Opportunity Types
 */
export type OpportunityType = 
  | 'missing_pattern'
  | 'upgrade_pattern' 
  | 'optimization'
  | 'accessibility'
  | 'performance'
  | 'maintainability'
  | 'user_experience'
  | 'conversion_optimization'
  | 'mobile_optimization';

/**
 * Enhanced Workspace Scan Result with AI insights
 */
export interface WorkspaceScanResult {
  // Summary (enhanced)
  scan_date: string;
  duration_ms: number;
  workspace_path: string;
  scanner_version: string;
  scan_id: string;
  
  // Component counts (enhanced)
  total_components: number;
  components_analyzed: number;
  components_skipped: number;
  components_by_framework: Record<string, number>;
  
  // Coverage metrics (enhanced)
  components_with_nuxee: number;
  components_without_nuxee: number;
  overall_coverage: number;
  coverage_trend: 'improving' | 'declining' | 'stable';
  
  // Pattern usage (enhanced)
  patterns_detected: PatternUsage[];
  most_used_pattern: string;
  least_used_pattern: string;
  pattern_effectiveness: PatternEffectiveness[];
  
  // Opportunities (enhanced)
  total_opportunities: number;
  opportunities_by_priority: PriorityBreakdown;
  opportunities_by_type: Record<OpportunityType, number>;
  estimated_total_effort: number; // in hours
  estimated_total_roi: number;
  
  // Top recommendations (enhanced)
  top_opportunities: ComponentOpportunity[];
  quick_wins: ComponentOpportunity[];
  high_roi_opportunities: ComponentOpportunity[];
  
  // Component breakdown (enhanced)
  components_by_type: Record<ComponentType, number>;
  components_by_complexity: Record<string, number>;
  
  // Detailed results
  components: ComponentAnalysis[];
  
  // Statistics (enhanced)
  avg_coverage_per_component: number;
  avg_complexity: number;
  total_enhancement_potential: number;
  overall_health_score: number;
  
  // AI-powered insights
  workspace_insights: WorkspaceInsight[];
  improvement_recommendations: StrategicRecommendation[];
  risk_assessment: RiskAssessment;
}

/**
 * Enhanced Pattern Usage with effectiveness tracking
 */
export interface PatternUsage {
  pattern_id: string;
  pattern_name: string;
  usage_count: number;
  components_using: string[];
  effectiveness: number;
  
  // Enhanced tracking
  implementation_quality: 'poor' | 'fair' | 'good' | 'excellent';
  customizations: string[];
  performance_impact: number; // -1 to +1
  user_satisfaction: number; // 0-1 if available
}

/**
 * Pattern Effectiveness Tracking
 */
export interface PatternEffectiveness {
  pattern_id: string;
  pattern_name: string;
  average_effectiveness: number;
  usage_count: number;
  user_satisfaction: number;
  performance_score: number;
}

/**
 * Enhanced Scanner Options with AI features
 */
export interface ScannerOptions {
  // Paths (enhanced)
  workspace_path?: string;
  include_patterns?: string[];
  exclude_patterns?: string[];
  scan_node_modules?: boolean;
  
  // File types (enhanced)
  scan_astro?: boolean;
  scan_tsx?: boolean;
  scan_jsx?: boolean;
  scan_vue?: boolean;
  scan_svelte?: boolean;
  scan_html?: boolean;
  scan_css?: boolean;
  
  // Analysis depth (enhanced)
  analyze_complexity?: boolean;
  detect_dynamic_classes?: boolean;
  suggest_optimizations?: boolean;
  calculate_performance_impact?: boolean;
  assess_accessibility?: boolean;
  
  // AI Features
  enable_ai_insights?: boolean;
  analyze_user_journey?: boolean;
  estimate_business_impact?: boolean;
  generate_code_suggestions?: boolean;
  
  // Filtering (enhanced)
  min_complexity?: 'simple' | 'moderate' | 'complex';
  only_missing_patterns?: boolean;
  priority_threshold?: 'low' | 'medium' | 'high' | 'critical';
  max_effort_level?: 'trivial' | 'low' | 'medium' | 'high' | 'extreme';
  
  // Performance (enhanced)
  max_files?: number;
  concurrent_analysis?: number;
  cache_results?: boolean;
  incremental_scan?: boolean;
  
  // Output (enhanced)
  verbose?: boolean;
  include_snippets?: boolean;
  generate_reports?: boolean;
  export_formats?: ('json' | 'html' | 'markdown' | 'csv')[];
  
  // Integration
  ci_mode?: boolean;
  fail_on_critical?: boolean;
  threshold_coverage?: number;
}

/**
 * Enhanced Scan Progress Event with detailed metrics
 */
export interface ScanProgressEvent {
  type: 'start' | 'progress' | 'complete' | 'error' | 'warning' | 'insight';
  current: number;
  total: number;
  current_file?: string;
  message?: string;
  error?: Error;
  
  // Enhanced metrics
  metrics?: ScanMetrics;
  insights?: string[];
  recommendations?: string[];
}

/**
 * Enhanced Component Parser Result
 */
export interface ParsedComponent {
  content: string;
  frontmatter?: Record<string, any>;
  html_elements: HtmlElement[];
  css_classes: string[];
  imports: string[];
  exports: string[];
  
  // Enhanced parsing
  scripts: ScriptBlock[];
  styles: StyleBlock[];
  dependencies: string[];
  props: ComponentProp[];
  events: string[];
  
  // AST information
  ast_complexity: number;
  depth: number;
}

/**
 * Enhanced HTML Element Detection
 */
export interface HtmlElement {
  tag: string;
  classes: string[];
  attributes: Record<string, string>;
  line_number: number;
  is_interactive: boolean;
  
  // Enhanced analysis
  children_count: number;
  depth: number;
  semantic_role: string;
  accessibility_attributes: string[];
  event_listeners: string[];
}

/**
 * Enhanced Coverage Report with trends and predictions
 */
export interface CoverageReport {
  timestamp: string;
  overall_coverage: number;
  coverage_by_category: Record<string, number>;
  coverage_trend: CoverageTrend[];
  improvement_suggestions: string[];
  
  // Enhanced reporting
  prediction: CoveragePrediction;
  milestones: CoverageMilestone[];
  team_performance: TeamPerformance;
  kpis: CoverageKPI[];
}

/**
 * Coverage Trend over time
 */
export interface CoverageTrend {
  date: string;
  coverage: number;
  components_analyzed: number;
}

/**
 * Interactive Element Analysis
 */
export interface InteractiveElement {
  type: 'button' | 'link' | 'input' | 'select' | 'textarea' | 'custom';
  selector: string;
  line_number: number;
  has_feedback: boolean;
  accessibility: AccessibilityScore;
  recommended_patterns: string[];
}

/**
 * Form Control Analysis
 */
export interface FormControl {
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'radio';
  name: string;
  required: boolean;
  validation: ValidationInfo;
  accessibility: AccessibilityScore;
}

/**
 * CSS Framework Detection
 */
export type CssFramework = 
  | 'tailwind'
  | 'bootstrap'
  | 'material-ui'
  | 'chakra-ui'
  | 'vanilla'
  | 'custom'
  | 'unknown';

/**
 * Pattern Recommendation with confidence
 */
export interface PatternRecommendation {
  pattern_id: string;
  pattern_name: string;
  confidence: number;
  expected_impact: number;
  implementation_effort: number;
  dependencies: string[];
  alternative_patterns: string[];
}

/**
 * AI Insight
 */
export interface AIInsight {
  type: 'performance' | 'ux' | 'accessibility' | 'maintenance' | 'business';
  title: string;
  description: string;
  confidence: number;
  evidence: string[];
  recommendations: string[];
}

/**
 * Code Location with context
 */
export interface CodeLocation {
  line_start: number;
  line_end: number;
  snippet: string;
  context_before: string;
  context_after: string;
  file_path: string;
}

/**
 * Before/After Example
 */
export interface BeforeAfterExample {
  before: string;
  after: string;
  explanation: string;
}

/**
 * Skill Level Requirements
 */
export interface SkillLevel {
  skill: 'css' | 'javascript' | 'animation' | 'accessibility' | 'performance';
  level: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Priority Breakdown
 */
export interface PriorityBreakdown {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

/**
 * Workspace Insight
 */
export interface WorkspaceInsight {
  category: 'patterns' | 'performance' | 'maintainability' | 'team' | 'process';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  evidence: string[];
}

/**
 * Strategic Recommendation
 */
export interface StrategicRecommendation {
  type: 'quick_win' | 'strategic_investment' | 'process_improvement' | 'training';
  title: string;
  description: string;
  expected_impact: number;
  implementation_effort: number;
  timeline: 'immediate' | 'short_term' | 'long_term';
  owners: string[];
}

/**
 * Risk Assessment
 */
export interface RiskAssessment {
  overall_risk: 'low' | 'medium' | 'high';
  risks: Risk[];
  mitigations: string[];
}

/**
 * Risk
 */
export interface Risk {
  category: 'technical_debt' | 'performance' | 'accessibility' | 'maintainability';
  description: string;
  severity: 'low' | 'medium' | 'high';
  likelihood: 'low' | 'medium' | 'high';
}

/**
 * Coverage Prediction
 */
export interface CoveragePrediction {
  target_date: string;
  predicted_coverage: number;
  confidence: number;
  assumptions: string[];
}

/**
 * Coverage Milestone
 */
export interface CoverageMilestone {
  target: number;
  deadline: string;
  description: string;
  progress: number;
}

/**
 * Team Performance
 */
export interface TeamPerformance {
  velocity: number; // components enhanced per week
  quality: number; // 0-1 score
  adoption_rate: number; // pattern adoption rate
}

/**
 * Coverage KPI
 */
export interface CoverageKPI {
  name: string;
  current_value: number;
  target_value: number;
  unit: string;
  trend: 'improving' | 'declining' | 'stable';
}

/**
 * Script Block Analysis
 */
export interface ScriptBlock {
  language: 'javascript' | 'typescript' | 'jsx' | 'tsx';
  content: string;
  line_start: number;
  line_end: number;
  complexity: number;
}

/**
 * Style Block Analysis
 */
export interface StyleBlock {
  language: 'css' | 'scss' | 'sass' | 'less';
  content: string;
  line_start: number;
  line_end: number;
  specificity: number;
}

/**
 * Component Prop
 */
export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  default_value?: string;
  description?: string;
}

/**
 * Accessibility Score
 */
export interface AccessibilityScore {
  overall: number; // 0-100
  aria_attributes: number;
  keyboard_navigation: number;
  screen_reader: number;
  color_contrast: number;
}

/**
 * Validation Info
 */
export interface ValidationInfo {
  has_validation: boolean;
  validation_type?: 'html5' | 'javascript' | 'custom';
  error_messages: boolean;
  real_time_validation: boolean;
}

/**
 * Scan Metrics for progress tracking
 */
export interface ScanMetrics {
  files_processed: number;
  patterns_detected: number;
  opportunities_found: number;
  processing_speed: number; // files per second
  memory_usage: number;
}

export default ComponentAnalysis;
