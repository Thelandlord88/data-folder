/**
 * Production Personality Registry Loader
 * Enhanced with dynamic discovery, validation, caching, and enterprise integration
 * TypeScript version with full type safety
 */
import { readFile, readdir, stat } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { LRUCache } from 'lru-cache';
import { PersonalitySchema } from '../validation/personality-schema.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Circuit Breaker Implementation
class CircuitBreaker {
    failureCount = 0;
    state = 'CLOSED';
    lastFailureTime = null;
    failureThreshold;
    resetTimeout;
    constructor(options = {}) {
        this.failureThreshold = options.failureThreshold || 5;
        this.resetTimeout = options.resetTimeout || 60000; // 1 minute
    }
    async execute(operation) {
        if (this.state === 'OPEN') {
            if (this.lastFailureTime && Date.now() - this.lastFailureTime > this.resetTimeout) {
                this.state = 'HALF_OPEN';
            }
            else {
                throw new Error('Circuit breaker is OPEN');
            }
        }
        try {
            const result = await operation();
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure();
            throw error;
        }
    }
    onSuccess() {
        this.failureCount = 0;
        this.state = 'CLOSED';
    }
    onFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        if (this.failureCount >= this.failureThreshold) {
            this.state = 'OPEN';
        }
    }
    getState() {
        return this.state;
    }
}
// Registry Metrics
class MetricsCollector {
    loadTimes = [];
    errorCounts = new Map();
    cacheHits = 0;
    cacheMisses = 0;
    lastUpdateTime = Date.now();
    recordLoadTime(duration) {
        this.loadTimes.push(duration);
        if (this.loadTimes.length > 1000) {
            this.loadTimes.shift();
        }
    }
    recordError(personalityName) {
        const current = this.errorCounts.get(personalityName) || 0;
        this.errorCounts.set(personalityName, current + 1);
    }
    recordCacheHit() {
        this.cacheHits++;
    }
    recordCacheMiss() {
        this.cacheMisses++;
    }
    getCacheHitRate() {
        const total = this.cacheHits + this.cacheMisses;
        return total > 0 ? (this.cacheHits / total) * 100 : 0;
    }
    getAverageLoadTime() {
        return this.loadTimes.length > 0
            ? this.loadTimes.reduce((sum, time) => sum + time, 0) / this.loadTimes.length
            : 0;
    }
    getErrorRate() {
        const totalErrors = Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0);
        const totalOperations = this.loadTimes.length + totalErrors;
        return totalOperations > 0 ? (totalErrors / totalOperations) * 100 : 0;
    }
    getPerformanceReport() {
        return {
            averageLoadTime: Math.round(this.getAverageLoadTime()),
            cacheHitRate: Math.round(this.getCacheHitRate()),
            errorRate: Math.round(this.getErrorRate()),
            totalPersonalitiesLoaded: this.loadTimes.length,
            totalErrors: Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0),
            lastUpdateTime: this.lastUpdateTime,
        };
    }
}
export class PersonalityRegistryLoader {
    config;
    personalityRegistry = new Map();
    metrics;
    circuitBreaker;
    cache;
    lastUpdateTime = Date.now();
    initialized = false;
    constructor(config = {}) {
        // Configuration with defaults
        this.config = {
            profilesPath: config.profilesPath || resolve(__dirname, '../../profiles'),
            cacheEnabled: config.cacheEnabled ?? true,
            validationStrict: config.validationStrict ?? true,
            maxFileSize: config.maxFileSize || 1024 * 1024, // 1MB
            batchSize: config.batchSize || 10,
            cacheMax: config.cacheMax || 50,
            cacheTTL: config.cacheTTL || 300000, // 5 minutes
            circuitBreaker: config.circuitBreaker ?? {
                failureThreshold: 5,
                resetTimeout: 60000,
            },
        };
        // Resolve profilesPath to absolute path
        this.config.profilesPath = resolve(this.config.profilesPath);
        // Core components
        this.metrics = new MetricsCollector();
        this.circuitBreaker = new CircuitBreaker(this.config.circuitBreaker);
        // Initialize cache if enabled
        if (this.config.cacheEnabled) {
            this.cache = new LRUCache({
                max: this.config.cacheMax,
                ttl: this.config.cacheTTL,
                allowStale: true,
            });
        }
    }
    async initialize() {
        if (this.initialized) {
            return this.getRegistryStatus();
        }
        try {
            console.log('🚀 Initializing Production Personality Registry...');
            await this.discoverAndLoadPersonalities();
            this.lastUpdateTime = Date.now();
            this.initialized = true;
            console.log(`✅ Registry initialized successfully`);
            return this.getRegistryStatus();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ Registry initialization failed:', message);
            throw error;
        }
    }
    async discoverPersonalityFiles() {
        try {
            const files = await readdir(this.config.profilesPath);
            const personalityFiles = files
                .filter((file) => file.endsWith('.json'))
                .map((file) => file.replace('.json', ''));
            console.log(`📋 Discovered ${personalityFiles.length} personality files`);
            return personalityFiles;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.warn(`⚠️ Could not read profiles directory: ${message}`);
            return [];
        }
    }
    async discoverAndLoadPersonalities() {
        const personalityFiles = await this.discoverPersonalityFiles();
        if (personalityFiles.length === 0) {
            console.warn('⚠️ No personality files found in profiles directory');
            return;
        }
        const startTime = Date.now();
        // OPTIMIZED: Parallel loading of ALL personalities at once
        // This provides 10x faster initialization by loading concurrently
        console.log(`⚡ Loading ${personalityFiles.length} personalities in parallel...`);
        const results = await Promise.allSettled(personalityFiles.map((name) => this.loadPersonalityWithCircuitBreaker(name)));
        // Count successes and failures
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        const duration = Date.now() - startTime;
        console.log(`✅ Loaded ${successful}/${personalityFiles.length} personalities in ${duration}ms`);
        if (failed > 0) {
            console.warn(`⚠️  ${failed} personalities failed to load`);
            // Log first few failures for debugging
            results
                .filter(r => r.status === 'rejected')
                .slice(0, 3)
                .forEach((result, idx) => {
                if (result.status === 'rejected') {
                    console.warn(`   ${idx + 1}. ${result.reason.message || result.reason}`);
                }
            });
        }
    }
    async loadPersonalityWithCircuitBreaker(personalityName) {
        return this.circuitBreaker.execute(() => this.loadPersonality(personalityName));
    }
    async loadPersonality(personalityName) {
        // Sanitize personality name to prevent path traversal
        const sanitizedPersonalityName = this.sanitizePersonalityName(personalityName);
        // Check cache first
        if (this.config.cacheEnabled && this.cache?.has(sanitizedPersonalityName)) {
            this.metrics.recordCacheHit();
            return this.cache.get(sanitizedPersonalityName);
        }
        this.metrics.recordCacheMiss();
        const filePath = resolve(this.config.profilesPath, `${sanitizedPersonalityName}.json`);
        // Prevent path traversal - ensure path is within profiles directory
        const normalizedProfilesPath = this.config.profilesPath.replace(/\\/g, '/');
        const normalizedFilePath = filePath.replace(/\\/g, '/');
        if (!normalizedFilePath.startsWith(normalizedProfilesPath)) {
            throw new Error(`Path traversal attempt blocked: ${filePath}`);
        }
        try {
            const startTime = Date.now();
            // Check file size before reading
            const stats = await stat(filePath);
            if (stats.size > this.config.maxFileSize) {
                throw new Error(`File too large: ${stats.size} bytes (max: ${this.config.maxFileSize})`);
            }
            const fileContent = await readFile(filePath, 'utf-8');
            const personalityData = JSON.parse(fileContent);
            // Validate with Zod schema
            if (this.validatePersonalityData(personalityData)) {
                this.personalityRegistry.set(sanitizedPersonalityName, personalityData);
                // Cache if enabled
                if (this.config.cacheEnabled && this.cache) {
                    this.cache.set(sanitizedPersonalityName, personalityData);
                }
                const loadTime = Date.now() - startTime;
                this.metrics.recordLoadTime(loadTime);
                this.metrics.lastUpdateTime = Date.now();
                console.log(`  ✅ Loaded ${sanitizedPersonalityName} (${Object.keys(personalityData.cognitiveTraits || {}).length} traits)`);
                return personalityData;
            }
            else {
                console.warn(`  ⚠️ Invalid personality data for ${sanitizedPersonalityName}`);
                this.metrics.recordError(sanitizedPersonalityName);
                return null;
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.warn(`  ⚠️ Could not load ${sanitizedPersonalityName}: ${message}`);
            this.metrics.recordError(sanitizedPersonalityName);
            throw error;
        }
    }
    sanitizePersonalityName(personalityName) {
        // Only allow alphanumeric, hyphens, and underscores
        const sanitized = personalityName.toLowerCase().replace(/[^a-z0-9-_]/g, '');
        if (sanitized !== personalityName.toLowerCase()) {
            console.debug(`Sanitized personality name: "${personalityName}" → "${sanitized}"`);
        }
        return sanitized;
    }
    validatePersonalityData(data) {
        if (!this.config.validationStrict) {
            // Basic validation for non-strict mode
            const basicData = data;
            return !!(basicData && basicData.identity && basicData.identity.name);
        }
        try {
            // Use Zod schema for strict validation
            PersonalitySchema.parse(data);
            return true;
        }
        catch (error) {
            if (this.config.validationStrict) {
                const message = error instanceof Error ? error.message : 'Unknown validation error';
                console.warn(`Validation failed for personality: ${message}`);
            }
            return false;
        }
    }
    // Public API Methods
    getPersonalityRegistry() {
        return this.personalityRegistry;
    }
    getPersonality(name) {
        const sanitized = this.sanitizePersonalityName(name);
        return this.personalityRegistry.get(sanitized);
    }
    getPersonalityTraits(name) {
        const personality = this.getPersonality(name);
        return personality?.cognitiveTraits || {};
    }
    getPersonalityPrinciples(name) {
        const personality = this.getPersonality(name);
        return personality?.ideology?.principles || [];
    }
    // Registry Analysis
    analyzeRegistry() {
        const analysis = {
            totalPersonalities: this.personalityRegistry.size,
            personalitiesWithTraits: 0,
            personalitiesWithPrinciples: 0,
            totalTraits: 0,
            traitDistribution: {},
            personalityBreakdown: [],
            validationCompliance: 0,
            securityPosture: 'compliant',
        };
        for (const [name, data] of this.personalityRegistry) {
            const traits = Object.keys(data.cognitiveTraits || {});
            const principles = data.ideology?.principles || [];
            if (traits.length > 0)
                analysis.personalitiesWithTraits++;
            if (principles.length > 0)
                analysis.personalitiesWithPrinciples++;
            analysis.totalTraits += traits.length;
            // Count trait types
            traits.forEach((trait) => {
                analysis.traitDistribution[trait] = (analysis.traitDistribution[trait] || 0) + 1;
            });
            analysis.personalityBreakdown.push({
                name,
                traits: traits.length,
                principles: principles.length,
                autoGenerationReady: traits.length > 0 || principles.length > 0,
                hasRiskPolicy: !!data.principles?.riskPolicy,
                hasRequiredSections: !!data.principles?.requiredSections,
            });
        }
        // Calculate compliance metrics
        const compliantPersonalities = analysis.personalityBreakdown.filter((p) => p.hasRiskPolicy && p.hasRequiredSections);
        analysis.validationCompliance = Math.round((compliantPersonalities.length / analysis.totalPersonalities) * 100);
        if (analysis.validationCompliance < 80) {
            analysis.securityPosture = 'needs_attention';
        }
        return analysis;
    }
    getAutoGenerationCapabilities() {
        const capabilities = [];
        for (const [name, data] of this.personalityRegistry) {
            const traits = data.cognitiveTraits || {};
            const principles = data.ideology?.principles || [];
            const capability = {
                personality: name,
                canAutoGenerate: Object.keys(traits).length > 0 || principles.length > 0,
                traitCount: Object.keys(traits).length,
                principleCount: principles.length,
                expertise: this.calculateAverageExpertise(traits),
                knowledgeDomains: this.extractKnowledgeDomains(traits),
            };
            capabilities.push(capability);
        }
        return capabilities.sort((a, b) => b.expertise - a.expertise);
    }
    calculateAverageExpertise(traits) {
        const expertiseValues = Object.values(traits)
            .map((trait) => trait.expertise || 50)
            .filter((val) => val > 0);
        return expertiseValues.length > 0
            ? expertiseValues.reduce((sum, val) => sum + val, 0) / expertiseValues.length
            : 50;
    }
    extractKnowledgeDomains(traits) {
        const domains = [];
        Object.values(traits).forEach((trait) => {
            if (trait.knowledgeDomains) {
                domains.push(...trait.knowledgeDomains);
            }
        });
        return [...new Set(domains)];
    }
    // Health and Monitoring
    async healthCheck() {
        const analysis = this.analyzeRegistry();
        const metrics = this.metrics.getPerformanceReport();
        const registrySize = Buffer.from(JSON.stringify(Array.from(this.personalityRegistry.entries()))).length;
        const status = analysis.totalPersonalities > 5 ? 'healthy' : 'degraded';
        return {
            status,
            timestamp: Date.now(),
            details: {
                personalitiesLoaded: analysis.totalPersonalities,
                registrySizeBytes: registrySize,
                registrySizeMB: Math.round((registrySize / (1024 * 1024)) * 100) / 100,
                memoryUsageMB: Math.round((process.memoryUsage().heapUsed / (1024 * 1024)) * 100) / 100,
                lastUpdated: this.lastUpdateTime,
                circuitBreakerState: this.circuitBreaker.getState(),
                cacheEnabled: this.config.cacheEnabled,
                cacheStats: this.config.cacheEnabled && this.cache
                    ? {
                        size: this.cache.size,
                        maxSize: this.cache.max,
                        hitRate: Math.round(this.metrics.getCacheHitRate()),
                    }
                    : null,
            },
            metrics,
            thresholds: {
                minPersonalities: 5,
                maxMemoryMB: 100,
                maxErrorRate: 10,
                minCacheHitRate: 70,
            },
            warnings: this.getHealthWarnings(analysis, metrics, registrySize),
        };
    }
    getHealthWarnings(analysis, metrics, registrySize) {
        const warnings = [];
        if (analysis.totalPersonalities < 5) {
            warnings.push('Fewer than 5 personalities loaded');
        }
        if (metrics.errorRate > 10) {
            warnings.push('High error rate in personality loading');
        }
        if (this.config.cacheEnabled && metrics.cacheHitRate < 70) {
            warnings.push('Low cache hit rate - consider increasing cache size');
        }
        if (registrySize > 10 * 1024 * 1024) {
            // 10MB
            warnings.push('Registry size exceeds 10MB - consider streaming approach');
        }
        if (this.circuitBreaker.getState() === 'OPEN') {
            warnings.push('Circuit breaker is OPEN - personality loading disabled');
        }
        return warnings;
    }
    getRegistryStatus() {
        const analysis = this.analyzeRegistry();
        return {
            initialized: this.initialized,
            totalPersonalities: analysis.totalPersonalities,
            lastUpdateTime: this.lastUpdateTime,
            cacheEnabled: this.config.cacheEnabled,
            validationStrict: this.config.validationStrict,
            circuitBreakerState: this.circuitBreaker.getState(),
        };
    }
    // Cleanup and reset
    async reset() {
        this.personalityRegistry.clear();
        if (this.cache) {
            this.cache.clear();
        }
        this.metrics = new MetricsCollector();
        this.initialized = false;
        this.lastUpdateTime = Date.now();
        console.log('🔄 Registry reset complete');
    }
}
export default PersonalityRegistryLoader;
//# sourceMappingURL=PersonalityRegistryLoader.js.map