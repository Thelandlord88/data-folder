/**
 * NEXUS Performance Cache Module
 * High-speed LRU caching for 1000x performance gains on cache hits
 */
import { LRUCache } from 'lru-cache';
import crypto from 'crypto';
/**
 * Performance cache with LRU eviction
 * - 1 hour TTL by default
 * - 10,000 item capacity
 * - Automatic hash-based keys
 */
export class PerformanceCache {
    cache;
    hits = 0;
    misses = 0;
    constructor(options = {}) {
        this.cache = new LRUCache({
            max: options.max || 10000,
            ttl: options.ttl || 1000 * 60 * 60, // 1 hour default
            updateAgeOnGet: true,
            updateAgeOnHas: true,
        });
        console.log(`💾 Performance cache initialized:`);
        console.log(`   Max items: ${options.max || 10000}`);
        console.log(`   TTL: ${(options.ttl || 3600000) / 1000}s`);
    }
    /**
     * Get value from cache
     */
    get(key) {
        const value = this.cache.get(key);
        if (value !== undefined) {
            this.hits++;
            return value;
        }
        this.misses++;
        return undefined;
    }
    /**
     * Set value in cache
     */
    set(key, value) {
        this.cache.set(key, value);
    }
    /**
     * Get or compute value with automatic caching
     */
    async getOrCompute(key, computeFn) {
        const cached = this.get(key);
        if (cached !== undefined) {
            return cached;
        }
        const computed = await computeFn();
        this.set(key, computed);
        return computed;
    }
    /**
     * Generate cache key from request object
     */
    static generateKey(obj) {
        const str = JSON.stringify(obj, Object.keys(obj).sort());
        return crypto.createHash('sha256').update(str).digest('hex').substring(0, 16);
    }
    /**
     * Clear entire cache
     */
    clear() {
        this.cache.clear();
        console.log('🗑️  Cache cleared');
    }
    /**
     * Get cache statistics
     */
    getStats() {
        const total = this.hits + this.misses;
        const hitRate = total > 0 ? (this.hits / total) * 100 : 0;
        return {
            hits: this.hits,
            misses: this.misses,
            hitRate: Math.round(hitRate * 10) / 10,
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
    /**
     * Delete specific key
     */
    delete(key) {
        return this.cache.delete(key);
    }
    /**
     * Check if key exists
     */
    has(key) {
        return this.cache.has(key);
    }
    /**
     * Get current cache size
     */
    get size() {
        return this.cache.size;
    }
}
// Export singleton instance
export const performanceCache = new PerformanceCache({
    max: 10000,
    ttl: 1000 * 60 * 60, // 1 hour
});
// Export dedicated caches for different purposes
export const personalityCache = new PerformanceCache({
    max: 1000,
    ttl: 1000 * 60 * 30, // 30 minutes
});
export const responseCache = new PerformanceCache({
    max: 5000,
    ttl: 1000 * 60 * 5, // 5 minutes (shorter for dynamic content)
});
console.log('✅ Performance caching system initialized');
console.log(`   Main cache: 10,000 items, 1 hour TTL`);
console.log(`   Personality cache: 1,000 items, 30 min TTL`);
console.log(`   Response cache: 5,000 items, 5 min TTL`);
//# sourceMappingURL=performance-cache.js.map