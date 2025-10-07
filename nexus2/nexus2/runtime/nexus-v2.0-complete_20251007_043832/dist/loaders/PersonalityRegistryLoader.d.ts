/**
 * Production Personality Registry Loader
 * Enhanced with dynamic discovery, validation, caching, and enterprise integration
 * TypeScript version with full type safety
 */
import type { PersonalityData, RegistryConfig, HealthCheckResult, RegistryAnalysis, AutoGenerationCapability, RegistryStatus, CognitiveTrait } from '../types/personality.types.js';
export declare class PersonalityRegistryLoader {
    private config;
    private personalityRegistry;
    private metrics;
    private circuitBreaker;
    private cache?;
    private lastUpdateTime;
    private initialized;
    constructor(config?: RegistryConfig);
    initialize(): Promise<RegistryStatus>;
    private discoverPersonalityFiles;
    private discoverAndLoadPersonalities;
    private loadPersonalityWithCircuitBreaker;
    private loadPersonality;
    private sanitizePersonalityName;
    private validatePersonalityData;
    getPersonalityRegistry(): Map<string, PersonalityData>;
    getPersonality(name: string): PersonalityData | undefined;
    getPersonalityTraits(name: string): Record<string, CognitiveTrait>;
    getPersonalityPrinciples(name: string): string[];
    analyzeRegistry(): RegistryAnalysis;
    getAutoGenerationCapabilities(): AutoGenerationCapability[];
    private calculateAverageExpertise;
    private extractKnowledgeDomains;
    healthCheck(): Promise<HealthCheckResult>;
    private getHealthWarnings;
    getRegistryStatus(): RegistryStatus;
    reset(): Promise<void>;
}
export default PersonalityRegistryLoader;
//# sourceMappingURL=PersonalityRegistryLoader.d.ts.map