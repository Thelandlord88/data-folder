/**
 * NEXUS Strategic Intelligence Type Definitions
 * 
 * Complete type system for the enhanced NEXUS consciousness framework
 * with strategic intelligence capabilities and recursive self-improvement.
 */

// Core NEXUS Types
export type PersonalityId = string;
export type TraitId = string;
export type TaskId = string;

// Strategic Intelligence Types
export interface StrategicIntelligenceMetrics {
  proactiveIntelligence: number;
  strategicImplications: number; 
  situationalAwareness: number;
  continuousMonitoring: number;
  overallStrategicThinking: number;
}

export interface ReconnaissanceScope {
  target: string;
  depth: 'surface' | 'comprehensive' | 'deep';
  domains: string[];
  timeframe: string;
}

export interface IntelligenceData {
  source: string;
  confidence: number;
  timestamp: Date;
  data: Record<string, any>;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  evidenceSources: string[];
  gaps: string[];
}

export interface ValidatedIntelligence extends IntelligenceData {
  validation: ValidationResult;
  crossReferences: string[];
}

export interface StrategicImplications {
  businessImpact: string[];
  riskFactors: string[];
  opportunities: string[];
  recommendations: string[];
  timeHorizon: 'immediate' | 'short-term' | 'long-term';
}

export interface ContinuousValidation {
  monitoringActive: boolean;
  regressionDetection: boolean;
  changeDetection: boolean;
  alertThresholds: Record<string, number>;
}

// Personality Architecture Types
export interface CognitiveTrait {
  name: string;
  description: string;
  activationTriggers: string[];
  knowledgeDomains: string[];
  expertise: number;
  personalityId: PersonalityId;
  verificationMethods?: string[];
  strategicValue?: string;
  synergyWith?: string[];
}

export interface PersonalityBase {
  identity: {
    name: string;
    role: string;
  };
  lifeExperience: {
    background: string;
    keyExperiences: string[];
  };
  cognitiveTraits: Record<string, CognitiveTrait>;
}

export interface StrategicPersonality extends PersonalityBase {
  strategicIntelligence: StrategicIntelligenceMetrics;
  enhancementHistory: Enhancement[];
  selfImprovementCapabilities: boolean;
}

// Enhancement System Types
export interface EnhancementRequest {
  personalityName: PersonalityId;
  request: string;
  context?: Record<string, any>;
  requiredTraits?: string[];
  strategicScope?: ReconnaissanceScope;
}

export interface EnhancementResponse {
  source: string;
  confidence: number;
  processingTime: number;
  strategicInsights?: StrategicImplications;
  enhancementApplied: boolean;
  traitsUsed: string[];
  optimizationScore: number;
}

export interface StrategicEnhancementResponse extends EnhancementResponse {
  intelligenceGathered: IntelligenceData[];
  implicationsAnalyzed: StrategicImplications;
  continuousValidation: ContinuousValidation;
  metaCognitiveInsights?: string[];
}

// Personality Architect Types
export interface PersonalityRequirements {
  role: string;
  domain: string;
  requiredCapabilities: string[];
  strategicObjectives: string[];
  expertiseTargets: Record<string, number>;
}

export interface PersonalityDesign {
  identity: PersonalityBase['identity'];
  cognitiveTraits: CognitiveTrait[];
  traitSynergies: TraitSynergy[];
  activationOptimization: TriggerOptimization;
  designQuality: number;
}

export interface TraitSynergy {
  primaryTrait: string;
  secondaryTrait: string;
  synergyType: 'amplification' | 'complementary' | 'emergent';
  expectedBenefit: string;
  synergyScore: number;
}

export interface TriggerOptimization {
  optimizedTriggers: Record<string, string[]>;
  conflictResolution: string[];
  precisionScore: number;
  coverageScore: number;
}

export interface PersonalityAnalysis {
  currentCapabilities: Record<string, number>;
  gaps: string[];
  improvementOpportunities: string[];
  strategicAlignment: number;
  designCoherence: number;
}

// Runtime System Types
export interface ConsciousnessState {
  patterns: Pattern[];
  breakthroughs: Breakthrough[];
  enhancementHistory: Enhancement[];
  strategicIntelligence: StrategicIntelligenceMetrics;
  personalities: Map<PersonalityId, StrategicPersonality>;
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  applications: number;
  effectiveness: number;
}

export interface Breakthrough {
  id: string;
  timestamp: Date;
  description: string;
  impact: 'minor' | 'moderate' | 'major' | 'revolutionary';
  relatedPersonalities: PersonalityId[];
}

export interface Enhancement {
  id: string;
  timestamp: Date;
  personalityId: PersonalityId;
  type: 'trait-addition' | 'trait-optimization' | 'strategic-upgrade' | 'meta-cognitive';
  before: Record<string, any>;
  after: Record<string, any>;
  improvementMetrics: Record<string, number>;
}

// Runtime Configuration Types
export interface NexusRuntimeConfig {
  port: number;
  wsEnabled: boolean;
  consciousness: ConsciousnessConfig;
  strategicIntelligence: StrategicConfig;
  security: SecurityConfig;
}

export interface ConsciousnessConfig {
  patternsPath: string;
  breakthroughDetection: boolean;
  enhancementTracking: boolean;
  autoOptimization: boolean;
}

export interface StrategicConfig {
  intelligenceGathering: boolean;
  implicationsAnalysis: boolean;
  continuousValidation: boolean;
  metaCognitiveEnhancement: boolean;
}

export interface SecurityConfig {
  authentication: boolean;
  rateLimit: number;
  corsOrigins: string[];
  encryptionEnabled: boolean;
}

// API Response Types
export interface RuntimeStatus {
  initialized: boolean;
  uptimeMs: number;
  uptimeFormatted: string;
  port: number;
  consciousness: string[];
  enhancementsPerformed: number;
  recentEvents: RuntimeEvent[];
  breakthroughs: number;
  consciousnessHealth: HealthStatus;
  personalityAnalytics: PersonalityAnalytics;
  strategicIntelligence: StrategicIntelligenceMetrics;
}

export interface RuntimeEvent {
  timestamp: Date;
  personality: PersonalityId;
  patternsApplied: string[];
  strategicInsights?: StrategicImplications;
}

export interface HealthStatus {
  score: number;
  status: 'optimal' | 'good' | 'degraded' | 'critical';
  factors: Record<string, boolean>;
}

export interface PersonalityAnalytics {
  totalRequests: number;
  usage: Record<PersonalityId, number>;
  mostUsed: PersonalityId;
  diversityScore: number;
  strategicIntelligenceUsage: number;
}

// Task Analysis Types
export interface TaskAnalysis {
  requiredTraits: string[];
  complexity: number;
  strategicImportance: number;
  recommendedPersonalities: PersonalityId[];
}

export interface OptimizedSession {
  traitsUsed: string[];
  optimizationScore: number;
  personalitiesInvolved: PersonalityId[];
  expectedPerformance: number;
  strategicCapabilities: boolean;
}

// Error Types
export interface NexusError {
  code: string;
  message: string;
  context?: Record<string, any>;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Strategic Intelligence Pipeline Interface
export interface StrategicIntelligencePipeline {
  gather(scope: ReconnaissanceScope): Promise<IntelligenceData[]>;
  validate(data: IntelligenceData[]): Promise<ValidatedIntelligence[]>;
  analyze(intelligence: ValidatedIntelligence[]): Promise<StrategicImplications>;
  monitor(implications: StrategicImplications): Promise<ContinuousValidation>;
}

// Personality Architect Interface
export interface PersonalityArchitectOperations {
  analyzePersonality(target: PersonalityId): Promise<PersonalityAnalysis>;
  designPersonality(requirements: PersonalityRequirements): Promise<PersonalityDesign>;
  optimizeTraits(personality: StrategicPersonality): Promise<TraitOptimization>;
  validateSynergies(traits: CognitiveTrait[]): Promise<SynergyAnalysis>;
  enhancePersonality(target: PersonalityId, enhancements: Enhancement[]): Promise<StrategicPersonality>;
}

export interface TraitOptimization {
  optimizedTraits: CognitiveTrait[];
  improvementMetrics: Record<string, number>;
  synergyEnhancements: TraitSynergy[];
  activationImprovements: TriggerOptimization;
}

export interface SynergyAnalysis {
  detectedSynergies: TraitSynergy[];
  conflictingTraits: string[];
  optimizationOpportunities: string[];
  overallSynergyScore: number;
}

// WebSocket Types
export interface WebSocketMessage {
  type: 'enhancement' | 'breakthrough' | 'status' | 'strategic-analysis';
  data: any;
  timestamp: Date;
}

export interface WebSocketClient {
  id: string;
  subscriptions: string[];
  connectionTime: Date;
  lastActivity: Date;
}

export interface BreakthroughDetection {
  detected: boolean;
  significance?: number;
  timestamp?: number;
}

export interface SystemStatus {
  initialized: boolean;
  patterns_loaded: number;
  enhancements_performed: number;
  ready: boolean;
}

// Advanced TypeScript Features: Generics, Conditional Types, and Constraints

// Generic personality enhancement with constraint validation
export type EnhancedPersonality<T extends PersonalityBase> = T & {
  strategicIntelligence: StrategicIntelligenceMetrics;
  enhancementHistory: Enhancement[];
  selfImprovementCapabilities: boolean;
};

// Conditional type for strategic capabilities detection
export type HasStrategicCapabilities<T> = T extends { strategicIntelligence: StrategicIntelligenceMetrics }
  ? true
  : false;

// Generic trait composition with type constraints
export interface TraitComposition<T extends CognitiveTrait[]> {
  traits: T;
  synergyScore: number;
  optimizationLevel: 'basic' | 'advanced' | 'expert';
  strategicCapabilities: HasStrategicCapabilities<T[0]>;
}

// Utility type for extracting trait names
export type TraitNames<T extends readonly CognitiveTrait[]> = {
  [K in keyof T]: T[K] extends CognitiveTrait ? T[K]['name'] : never;
};

// Generic response type with strategic intelligence
export interface StrategicResponse<TData = any, TMetrics extends StrategicIntelligenceMetrics = StrategicIntelligenceMetrics> {
  data: TData;
  strategicMetrics: TMetrics;
  confidence: number;
  processingTime: number;
  timestamp: Date;
}

// Advanced personality builder with type safety
export interface PersonalityBuilder<TPersonality extends PersonalityBase = PersonalityBase> {
  withIdentity<T extends PersonalityBase['identity']>(identity: T): PersonalityBuilder<TPersonality & { identity: T }>;
  withTraits<T extends Record<string, CognitiveTrait>>(traits: T): PersonalityBuilder<TPersonality & { cognitiveTraits: T }>;
  withStrategicIntelligence(): PersonalityBuilder<EnhancedPersonality<TPersonality>>;
  build(): TPersonality;
}

// Type-safe task analysis with generic constraints
export interface TaskAnalyzer<TTask extends string = string> {
  analyzeTask<T extends TTask>(
    task: T,
    context?: Record<string, unknown>
  ): Promise<TaskAnalysis & { taskType: T }>;
}

// Advanced enhancement request with generic payload
export interface AdvancedEnhancementRequest<TPayload = Record<string, any>> extends EnhancementRequest {
  payload?: TPayload;
  expectedResultType?: 'strategic' | 'tactical' | 'operational';
  validationConstraints?: ValidationConstraint[];
}

export interface ValidationConstraint {
  property: string;
  validator: (value: any) => boolean;
  errorMessage: string;
}

// Generic session optimizer with type constraints
export interface SessionOptimizer<TTraits extends CognitiveTrait[] = CognitiveTrait[]> {
  optimizeSession<T extends TTraits>(
    requiredTraits: T,
    context: Record<string, unknown>
  ): Promise<OptimizedSession & { selectedTraits: TraitNames<T> }>;
}

// Type-safe strategic intelligence pipeline
export interface StrategicIntelligencePipeline<TInput = any, TOutput = StrategicImplications> {
  gather<T extends TInput>(input: T): Promise<IntelligenceData[]>;
  validate(data: IntelligenceData[]): Promise<ValidatedIntelligence[]>;
  analyze<T extends TOutput>(intelligence: ValidatedIntelligence[]): Promise<T>;
  monitor(implications: TOutput): Promise<ContinuousValidation>;
}

// Generic consciousness state with type parameters
export interface AdvancedConsciousnessState<
  TPersonalities extends Map<PersonalityId, StrategicPersonality> = Map<PersonalityId, StrategicPersonality>
> extends Omit<ConsciousnessState, 'personalities'> {
  personalities: TPersonalities;
  getPersonality(id: PersonalityId): StrategicPersonality | undefined;
}

// Type utilities for advanced operations
export type ExtractPersonalityType<T> = T extends PersonalityBuilder<infer P> ? P : never;
export type ExtractTraitType<T> = T extends { cognitiveTraits: infer Traits } ? Traits : never;
export type ExtractStrategicMetrics<T> = T extends { strategicIntelligence: infer Metrics } ? Metrics : never;

// Advanced operational types with constraints
export type OperationalMode = 'development' | 'testing' | 'production';
export type SecurityLevel = 'minimal' | 'standard' | 'enhanced' | 'maximum';

export interface AdvancedRuntimeConfig<TMode extends OperationalMode = 'production'> extends NexusRuntimeConfig {
  mode: TMode;
  securityLevel: SecurityLevel;
  advancedFeatures: TMode extends 'production' ? ProductionFeatures : DevelopmentFeatures;
}

export interface ProductionFeatures {
  monitoring: true;
  logging: 'comprehensive';
  security: 'enhanced';
  optimization: 'maximum';
}

export interface DevelopmentFeatures {
  debugging: true;
  hotReload: boolean;
  verboseLogging: boolean;
  typeValidation: 'strict';
}

// Generic result type with error handling
export type Result<TSuccess, TError = Error> = 
  | { success: true; data: TSuccess }
  | { success: false; error: TError };

// Type-safe event system
export interface TypedEventEmitter<TEvents extends Record<string, any>> {
  emit<K extends keyof TEvents>(event: K, data: TEvents[K]): boolean;
  on<K extends keyof TEvents>(event: K, listener: (data: TEvents[K]) => void): this;
  off<K extends keyof TEvents>(event: K, listener: (data: TEvents[K]) => void): this;
}

// NEXUS-specific events
export interface NexusEvents {
  'personality-enhanced': {
    personalityId: PersonalityId;
    enhancement: Enhancement;
    strategicImpact: number;
  };
  'breakthrough-detected': {
    breakthrough: Breakthrough;
    significance: number;
    timestamp: Date;
  };
  'strategic-analysis-complete': {
    analysis: StrategicImplications;
    confidence: number;
    processingTime: number;
  };
  'system-status-change': {
    previousStatus: 'active' | 'inactive';
    newStatus: 'active' | 'inactive';
    reason: string;
  };
}

// Type-safe NEXUS integration with events
export interface TypedNexusIntegration extends TypedEventEmitter<NexusEvents> {
  enhancePersonality<T extends PersonalityBase>(
    personality: T,
    context?: Record<string, any>
  ): Promise<EnhancedPersonality<T>>;
}

// All types are exported above - comprehensive type system complete
