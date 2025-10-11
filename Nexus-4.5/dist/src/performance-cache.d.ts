/**
 * NEXUS Performance Cache Module
 * High-speed LRU caching for 1000x performance gains on cache hits
 */
interface CacheStats {
    hits: number;
    misses: number;
    hitRate: number;
    size: number;
    keys: string[];
}
/**
 * Performance cache with LRU eviction
 * - 1 hour TTL by default
 * - 10,000 item capacity
 * - Automatic hash-based keys
 */
export declare class PerformanceCache {
    private cache;
    private hits;
    private misses;
    constructor(options?: {
        max?: number;
        ttl?: number;
    });
    /**
     * Get value from cache
     */
    get<T>(key: string): T | undefined;
    /**
     * Set value in cache
     */
    set<T>(key: string, value: T): void;
    /**
     * Get or compute value with automatic caching
     */
    getOrCompute<T>(key: string, computeFn: () => Promise<T>): Promise<T>;
    /**
     * Generate cache key from request object
     */
    static generateKey(obj: any): string;
    /**
     * Clear entire cache
     */
    clear(): void;
    /**
     * Get cache statistics
     */
    getStats(): CacheStats;
    /**
     * Delete specific key
     */
    delete(key: string): boolean;
    /**
     * Check if key exists
     */
    has(key: string): boolean;
    /**
     * Get current cache size
     */
    get size(): number;
}
export declare const performanceCache: PerformanceCache;
export declare const personalityCache: PerformanceCache;
export declare const responseCache: PerformanceCache;
export {};
//# sourceMappingURL=performance-cache.d.ts.map