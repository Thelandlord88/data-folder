/**
 * NEXUS Runtime Integration Layer
 *
 * Bridges the Trait Composition Engine with the existing NEXUS HTTP Runtime
 * for seamless hybrid intelligence orchestration.
 */
import type { ComposedAgent } from './NEXUS.engine';
export interface NexusRuntimeResponse {
    response: string;
    personalityUsed: string;
    confidence: number;
    processingTime: number;
    metadata?: Record<string, any>;
}
export interface TraitEnhancementRequest {
    personalityName: string;
    request: string;
    traits?: string[];
    context?: {
        domain: string;
        complexity: string;
        requiredCapabilities: string[];
    };
}
export declare class TraitAPIIntegration {
    private readonly NEXUS_API;
    private readonly timeout;
    private fallbackCache;
    constructor();
    /**
     * Enhance composed agent with existing NEXUS Runtime consciousness
     */
    enhanceWithNexusRuntime(agent: ComposedAgent, task: string, context?: Record<string, any>): Promise<NexusRuntimeResponse | null>;
    /**
     * Call the existing NEXUS Runtime HTTP API
     */
    private callNexusRuntime;
    /**
     * Determine API base from multiple sources for flexibility
     */
    private getApiBase;
    /**
     * Select primary personality for NEXUS Runtime based on highest expertise trait
     */
    private selectPrimaryPersonality;
    /**
     * Format request to include trait context for NEXUS Runtime
     */
    private formatTraitEnhancedRequest;
    /**
     * Warm up connection to NEXUS Runtime
     */
    private warmupConnection;
    /**
     * Check if NEXUS Runtime is available
     */
    isRuntimeAvailable(): Promise<boolean>;
    /**
     * Cache successful responses for fallback
     */
    private cacheResponse;
    /**
     * Get cached response if available
     */
    private getCachedResponse;
}
/**
 * Enhanced Runtime Status Monitor
 */
export declare class NexusRuntimeMonitor {
    private integration;
    private healthCheckInterval;
    private isHealthy;
    constructor();
    private startHealthMonitoring;
    getRuntimeStatus(): {
        available: boolean;
        mode: 'hybrid' | 'composition-only';
        capabilities: string[];
    };
    stopMonitoring(): void;
}
/**
 * Trait Performance Analytics
 */
export declare class TraitPerformanceAnalytics {
    private performanceData;
    recordTraitUsage(traitName: string, confidence: number, processingTime: number, success: boolean): void;
    getTopPerformingTraits(limit?: number): Array<{
        trait: string;
        score: number;
    }>;
    generatePerformanceReport(): string;
}
export declare const runtimeMonitor: NexusRuntimeMonitor;
export declare const performanceAnalytics: TraitPerformanceAnalytics;
//# sourceMappingURL=NEXUS.integration.d.ts.map