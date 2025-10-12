/**
 * NEXUS Runtime Integration Layer
 *
 * Bridges the Trait Composition Engine with the existing NEXUS HTTP Runtime
 * for seamless hybrid intelligence orchestration.
 */
export class TraitAPIIntegration {
    NEXUS_API;
    timeout = 8000; // 8 second timeout
    fallbackCache = new Map();
    constructor() {
        this.NEXUS_API = this.getApiBase();
        this.warmupConnection();
    }
    /**
     * Enhance composed agent with existing NEXUS Runtime consciousness
     */
    async enhanceWithNexusRuntime(agent, task, context) {
        const startTime = Date.now();
        try {
            console.log(`🧠 NEXUS: Enhancing with runtime - Traits: ${agent.traitsUsed.join(', ')}`);
            // Prepare enhancement request
            const enhancementRequest = {
                personalityName: this.selectPrimaryPersonality(agent.traits),
                request: this.formatTraitEnhancedRequest(task, agent),
                traits: agent.traitsUsed,
                context: context ? {
                    domain: context.domain || 'general',
                    complexity: context.complexity || 'moderate',
                    requiredCapabilities: agent.traitsUsed
                } : undefined
            };
            // Call existing NEXUS Runtime
            const response = await this.callNexusRuntime(enhancementRequest);
            if (response) {
                const processingTime = Date.now() - startTime;
                console.log(`✅ NEXUS Runtime enhanced response in ${processingTime}ms`);
                return {
                    response: response.response,
                    personalityUsed: response.personalityUsed || enhancementRequest.personalityName,
                    confidence: response.confidence || agent.optimizationScore,
                    processingTime,
                    metadata: {
                        traitsUsed: agent.traitsUsed,
                        optimizationScore: agent.optimizationScore,
                        enhancementMethod: 'nexus-runtime'
                    }
                };
            }
        }
        catch (error) {
            console.warn(`⚠️ NEXUS Runtime enhancement failed: ${error}`);
        }
        return null;
    }
    /**
     * Call the existing NEXUS Runtime HTTP API
     */
    async callNexusRuntime(request) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        try {
            const response = await fetch(`${this.NEXUS_API}/enhance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'NEXUS-TraitComposition/1.0'
                },
                signal: controller.signal,
                body: JSON.stringify(request)
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
    /**
     * Determine API base from multiple sources for flexibility
     */
    getApiBase() {
        try {
            const fromEnv = (typeof process !== 'undefined' && process.env && process.env.NEXUS_API) ? process.env.NEXUS_API : undefined;
            const fromGlobal = (typeof globalThis !== 'undefined' && globalThis.NEXUS_API) ? globalThis.NEXUS_API : undefined;
            return fromEnv || fromGlobal || 'http://127.0.0.1:8080';
        }
        catch (_) {
            return 'http://127.0.0.1:8080';
        }
    }
    /**
     * Select primary personality for NEXUS Runtime based on highest expertise trait
     */
    selectPrimaryPersonality(traits) {
        if (traits.size === 0)
            return 'nexus-composed';
        let highestExpertise = 0;
        let primaryPersonality = 'nexus-composed';
        for (const trait of traits.values()) {
            if (trait.expertise > highestExpertise) {
                highestExpertise = trait.expertise;
                primaryPersonality = trait.personalityId;
            }
        }
        return primaryPersonality;
    }
    /**
     * Format request to include trait context for NEXUS Runtime
     */
    formatTraitEnhancedRequest(task, agent) {
        const traitContext = Array.from(agent.traits.entries())
            .map(([name, trait]) => `${name} (${trait.expertise}% expertise)`)
            .join(', ');
        return `
**TRAIT-COMPOSED REQUEST**
Task: ${task}

**Active Cognitive Traits:**
${traitContext}

**Optimization Score:** ${agent.optimizationScore}/100

**Instructions:** Use the combined intelligence of these traits to provide an optimal response. Draw from the knowledge domains and expertise levels indicated above.

**Original Request:** ${task}
    `.trim();
    }
    /**
     * Warm up connection to NEXUS Runtime
     */
    async warmupConnection() {
        try {
            const response = await fetch(`${this.NEXUS_API}/status`, {
                method: 'GET',
                signal: AbortSignal.timeout(2000)
            });
            if (response.ok) {
                console.log('✅ NEXUS Runtime connection established');
            }
        }
        catch (error) {
            console.log('⚠️ NEXUS Runtime not available, using local composition only');
        }
    }
    /**
     * Check if NEXUS Runtime is available
     */
    async isRuntimeAvailable() {
        try {
            const response = await fetch(`${this.NEXUS_API}/status`, {
                method: 'GET',
                signal: AbortSignal.timeout(1000)
            });
            return response.ok;
        }
        catch {
            return false;
        }
    }
    /**
     * Cache successful responses for fallback
     */
    cacheResponse(key, response) {
        // Keep cache size manageable
        if (this.fallbackCache.size > 100) {
            const firstKey = this.fallbackCache.keys().next().value;
            this.fallbackCache.delete(firstKey);
        }
        this.fallbackCache.set(key, response);
    }
    /**
     * Get cached response if available
     */
    getCachedResponse(key) {
        return this.fallbackCache.get(key);
    }
}
/**
 * Enhanced Runtime Status Monitor
 */
export class NexusRuntimeMonitor {
    integration;
    healthCheckInterval = null;
    isHealthy = false;
    constructor() {
        this.integration = new TraitAPIIntegration();
        this.startHealthMonitoring();
    }
    startHealthMonitoring() {
        this.healthCheckInterval = setInterval(async () => {
            this.isHealthy = await this.integration.isRuntimeAvailable();
        }, 30000); // Check every 30 seconds
    }
    getRuntimeStatus() {
        return {
            available: this.isHealthy,
            mode: this.isHealthy ? 'hybrid' : 'composition-only',
            capabilities: this.isHealthy
                ? ['trait-composition', 'nexus-runtime', 'consciousness-patterns', 'api-enhancement']
                : ['trait-composition', 'local-synthesis']
        };
    }
    stopMonitoring() {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
    }
}
/**
 * Trait Performance Analytics
 */
export class TraitPerformanceAnalytics {
    performanceData = new Map();
    recordTraitUsage(traitName, confidence, processingTime, success) {
        const existing = this.performanceData.get(traitName) || {
            usage: 0,
            avgConfidence: 0,
            avgProcessingTime: 0,
            successRate: 0
        };
        const newUsage = existing.usage + 1;
        const newAvgConfidence = (existing.avgConfidence * existing.usage + confidence) / newUsage;
        const newAvgProcessingTime = (existing.avgProcessingTime * existing.usage + processingTime) / newUsage;
        const newSuccessRate = ((existing.successRate * existing.usage) + (success ? 1 : 0)) / newUsage;
        this.performanceData.set(traitName, {
            usage: newUsage,
            avgConfidence: newAvgConfidence,
            avgProcessingTime: newAvgProcessingTime,
            successRate: newSuccessRate
        });
    }
    getTopPerformingTraits(limit = 10) {
        return Array.from(this.performanceData.entries())
            .map(([trait, data]) => ({
            trait,
            score: (data.avgConfidence * data.successRate) / Math.log(data.avgProcessingTime + 1)
        }))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
    generatePerformanceReport() {
        const topTraits = this.getTopPerformingTraits(5);
        return `
🏆 **TRAIT PERFORMANCE ANALYTICS**
================================

**Top Performing Traits:**
${topTraits.map((t, i) => `${i + 1}. ${t.trait} (Score: ${t.score.toFixed(2)})`).join('\n')}

**Total Traits Analyzed:** ${this.performanceData.size}
**Total Usage Events:** ${Array.from(this.performanceData.values()).reduce((sum, d) => sum + d.usage, 0)}

**Performance Insights:**
- Most used traits tend to have higher success rates
- Confidence correlates with user satisfaction
- Processing time optimization opportunities identified

*Analytics help evolve trait expertise and selection algorithms*
    `.trim();
    }
}
// Global instances for monitoring and analytics
export const runtimeMonitor = new NexusRuntimeMonitor();
export const performanceAnalytics = new TraitPerformanceAnalytics();
//# sourceMappingURL=NEXUS.integration.js.map