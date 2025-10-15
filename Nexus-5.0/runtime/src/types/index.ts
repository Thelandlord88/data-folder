/**
 * NEXUS Type System - Main Export
 * 
 * Centralized type definitions for the entire NEXUS platform
 */

export * from './nexus.types';

// Re-export commonly used types for convenience
export type {
  PersonalityId,
  TaskId,
  TraitId,
  
  // Core Personality Types
  PersonalityBase,
  CognitiveTrait,
  StrategicPersonality,
  
  // Enhancement System
  Enhancement,
  EnhancementRequest,
  EnhancementResponse,
  
  // Runtime Types
  RuntimeStatus,
  ConsciousnessState,
  NexusRuntimeConfig,
  
  // Strategic Intelligence (for future use)
  StrategicIntelligenceMetrics,
  IntelligenceData,
  
  // WCAG Integration Types (NEW)
  // These will connect WCAG hunters to strategic intelligence
} from './nexus.types';

// WCAG-specific types
export * from './wcag.types';
export type {
  WcagLevel,
  WcagSeverity,
  WcagIntelligenceData,
  WcagFinding,
  WcagHunterReport,
  WcagMasterReport,
  WcagCheckResult,
  WcagPersonalityAnalysis,
  LayoutStrategicAnalysis
} from './wcag.types';
