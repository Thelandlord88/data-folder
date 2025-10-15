/**
 * NEXUS Performance Cache Module
 * High-speed LRU caching for 1000x performance gains on cache hits
 */
interface CacheStats {
    hits: number;
    misses: number;
    hitRate: number;
    missRate: number;
    size: number;
    keys: string[];
    evictions: number;
    lastUpdate?: number;
}
/**
 * Performance cache with LRU eviction
 */
export declare class PerformanceCache<T = any> {
    private cache;
    private hits;
    private misses;
    private evictions;
    private lastUpdate;
    constructor(options?: {
        max?: number;
        ttl?: number;
    });
    get(key: string): T | undefined;
    set(key: string, value: T): void;
    getOrCompute(key: string, computeFn: () => Promise<T>): Promise<T>;
    clear(): void;
    getStats(): CacheStats;
    static generateKey(obj: any): string;
}
export declare const responseCache: PerformanceCache<any>;
export {};
//# sourceMappingURL=performance-cache.d.ts.map