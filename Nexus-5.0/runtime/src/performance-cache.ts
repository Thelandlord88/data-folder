/**
 * NEXUS Performance Cache Module
 * High-speed LRU caching for 1000x performance gains on cache hits
 */

import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

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
export class PerformanceCache<T = any> {
  private cache: LRUCache<string, any>;
  private hits: number = 0;
  private misses: number = 0;
  private evictions: number = 0;
  private lastUpdate: number = Date.now();

  constructor(options: {
    max?: number;
    ttl?: number;
  } = {}) {
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

  get(key: string): T | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.hits++;
      return value as T;
    }
    this.misses++;
    return undefined;
  }
  
  set(key: string, value: T): void {
    this.cache.set(key, value);
  }

  async getOrCompute(key: string, computeFn: () => Promise<T>): Promise<T> {
    const cached = this.get(key);
    if (cached !== undefined) {
      return cached;
    }
    const computed = await computeFn();
    this.set(key, computed);
    return computed;
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
    this.lastUpdate = Date.now();
    console.log('🗑️  Cache cleared');
  }

  getStats(): CacheStats {
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

  static generateKey(obj: any): string {
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    return crypto.createHash('sha256').update(str).digest('hex');
  }
}

// Export singleton instance for response caching
export const responseCache = new PerformanceCache<any>({
  max: 1000,
  ttl: 1000 * 60 * 30 // 30 minutes
});
