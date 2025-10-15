/**
 * NEXUS Performance Cache Module
 * High-speed LRU caching for 1000x performance gains on cache hits
 */
import { LRUCache } from 'lru-cache';
import crypto from 'crypto';
/**
 * Performance cache with LRU eviction
 */
export class PerformanceCache {
    cache;
    hits = 0;
    misses = 0;
    evictions = 0;
    lastUpdate = Date.now();
    constructor(options = {}) {
        this.cache = new LRUCache({
            max: options.max || 10000,
            ttl: options.ttl || 1000 * 60 * 60,
            updateAgeOnGet: true,
            updateAgeOnHas: true,
            dispose: () => {
                this.evictions++;
            }
        });
        console.log('💾 Performance cache initialized:');
        console.log('   Max items: ' + (options.max || 10000));
        console.log('   TTL: ' + ((options.ttl || 3600000) / 1000) + 's');
    }
    get(key) {
        const value = this.cache.get(key);
        if (value !== undefined) {
            this.hits++;
            return value;
        }
        this.misses++;
        return undefined;
    }
    set(key, value) {
        this.cache.set(key, value);
    }
    async getOrCompute(key, computeFn) {
        const cached = this.get(key);
        if (cached !== undefined) {
            return cached;
        }
        const computed = await computeFn();
        this.set(key, computed);
        return computed;
    }
    clear() {
        this.cache.clear();
        this.hits = 0;
        this.misses = 0;
        this.evictions = 0;
        this.lastUpdate = Date.now();
        console.log('🗑️  Cache cleared');
    }
    getStats() {
        const total = this.hits + this.misses;
        return {
            hits: this.hits,
            misses: this.misses,
            hitRate: total > 0 ? this.hits / total : 0,
            missRate: total > 0 ? this.misses / total : 0,
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            evictions: this.evictions,
            lastUpdate: this.lastUpdate
        };
    }
    static generateKey(obj) {
        const str = JSON.stringify(obj, Object.keys(obj).sort());
        return crypto.createHash('sha256').update(str).digest('hex');
    }
}
// Export singleton instance for response caching
export const responseCache = new PerformanceCache({
    max: 1000,
    ttl: 1000 * 60 * 30 // 30 minutes
});
//# sourceMappingURL=performance-cache.js.map