/**
 * Personality Data Type Definitions
 * Core interfaces for NEXUS personality system
 */
export interface PersonalityIdentity {
    name: string;
    aliases?: string[];
    tagline?: string;
    priority?: string;
}
export interface PersonalityIdeology {
    principles: string[];
    ethos?: string[];
}
export interface CognitiveTrait {
    name: string;
    description: string;
    activationTriggers?: string[];
    expertise?: number;
    knowledgeDomains?: string[];
    responsePatterns?: string[];
}
export interface PersonalityPrinciples {
    riskPolicy?: {
        allowedOperations?: string[];
        forbiddenOperations?: string[];
    };
    requiredSections?: string[];
}
export interface PersonalityData {
    version: string;
    identity: PersonalityIdentity;
    ideology: PersonalityIdeology;
    cognitiveTraits: Record<string, CognitiveTrait>;
    principles?: PersonalityPrinciples;
}
export interface CircuitBreakerConfig {
    failureThreshold?: number;
    resetTimeout?: number;
}
export interface RegistryConfig {
    profilesPath?: string;
    cacheEnabled?: boolean;
    validationStrict?: boolean;
    maxFileSize?: number;
    batchSize?: number;
    cacheMax?: number;
    cacheTTL?: number;
    circuitBreaker?: CircuitBreakerConfig;
}
export interface RegistryMetrics {
    averageLoadTime: number;
    cacheHitRate: number;
    errorRate: number;
    totalPersonalitiesLoaded: number;
    totalErrors: number;
    lastUpdateTime: number;
}
export interface HealthCheckResult {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: number;
    details: {
        personalitiesLoaded: number;
        registrySizeBytes: number;
        registrySizeMB: number;
        memoryUsageMB: number;
        lastUpdated: number;
        circuitBreakerState: string;
        cacheEnabled: boolean;
        cacheStats: {
            size: number;
            maxSize: number;
            hitRate: number;
        } | null;
    };
    metrics: RegistryMetrics;
    thresholds: {
        minPersonalities: number;
        maxMemoryMB: number;
        maxErrorRate: number;
        minCacheHitRate: number;
    };
    warnings: string[];
}
export interface RegistryAnalysis {
    totalPersonalities: number;
    personalitiesWithTraits: number;
    personalitiesWithPrinciples: number;
    totalTraits: number;
    traitDistribution: Record<string, number>;
    personalityBreakdown: Array<{
        name: string;
        traits: number;
        principles: number;
        autoGenerationReady: boolean;
        hasRiskPolicy: boolean;
        hasRequiredSections: boolean;
    }>;
    validationCompliance: number;
    securityPosture: 'compliant' | 'needs_attention';
}
export interface AutoGenerationCapability {
    personality: string;
    canAutoGenerate: boolean;
    traitCount: number;
    principleCount: number;
    expertise: number;
    knowledgeDomains: string[];
}
export interface RegistryStatus {
    initialized: boolean;
    totalPersonalities: number;
    lastUpdateTime: number;
    cacheEnabled: boolean;
    validationStrict: boolean;
    circuitBreakerState: string;
}
//# sourceMappingURL=personality.types.d.ts.map