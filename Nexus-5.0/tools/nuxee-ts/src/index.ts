/**
 * NUXEE v2.0 - Main Export
 * 
 * Intelligent UX Enhancement Engine
 * 
 * @version 2.0.0
 * @date October 15, 2025
 */

// Main engine
export { NUXEEEngine as default, NUXEEEngine } from './nuxee-engine.js';

// Components
export { ContextAnalyzer } from './context-analyzer.js';
export { OpportunityDetector } from './opportunity-detector.js';
export { PatternSelector } from './pattern-selector.js';
export { PatternApplier } from './pattern-applier.js';

// Types
export type {
  // Core types
  UXPattern,
  PatternCSS,
  PatternCategory,
  
  // Enhancement
  EnhanceOptions,
  EnhancementResult,
  PatternApplication,
  OpportunityDetection,
  
  // Analysis
  PageAnalysis,
  DesignStyle,
  PageType,
  PageIntent,
  
  // Learning
  LearningRecord,
  PatternMetrics,
  
  // Conversational
  ConversationalQuery,
  ConversationalResponse,
  
  // Recommendations
  ProactiveRecommendation,
  PatternBundle,
  EstimatedImprovement,
  
  // Engine
  NUXEEEngineOptions,
  
  // Interfaces
  IContextAnalyzer,
  IPatternSelector,
  IPatternApplier,
  IOpportunityDetector
} from './types.js';

/**
 * Quick Start Example:
 * 
 * ```typescript
 * import { NUXEEEngine } from '@nexus/nuxee';
 * 
 * const nuxee = new NUXEEEngine({
 *   enable_learning: true,
 *   enable_analytics: true
 * });
 * 
 * // Register patterns
 * await nuxee.registerPattern(myPattern);
 * 
 * // Enhance HTML
 * const result = await nuxee.enhance(html, {
 *   auto_select: true,
 *   require_aaa: true
 * });
 * 
 * // Conversational interface
 * const response = await nuxee.ask({
 *   query: "How can I make my buttons more engaging?"
 * });
 * 
 * // Proactive analysis
 * const recommendations = await nuxee.analyzeAndRecommend(html);
 * ```
 */
