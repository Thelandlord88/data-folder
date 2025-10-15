/**
 * Theme Cache
 * 
 * High-performance LRU cache for generated design systems
 * Target: <100ms preview load with warm cache
 * 
 * Sprint 2 Deliverable: Stellar + Flash
 */

import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

/**
 * Cached theme entry
 */
export interface CachedTheme {
  designPackage: any;
  generatedAt: number;
  dna: any;
  metadata: {
    generationTimeMs: number;
    tokenCount: number;
    cacheKey: string;
  };
}

/**
 * Cache statistics
 */
export interface ThemeCacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  maxSize: number;
  evictions: number;
  averageGenerationTime: number;
  cacheEnabled: boolean;
}

/**
 * Theme Cache configuration
 */
export interface ThemeCacheConfig {
  maxThemes?: number;
  ttl?: number; // milliseconds
  enabled?: boolean;
}

/**
 * Theme Cache
 * 
 * LRU cache optimized for design system generation
 * - 100 themes max (configurable)
 * - 30 minute TTL (configurable)
 * - Deterministic cache keys
 * - Performance metrics
 */
export class ThemeCache {
  private cache: LRUCache<string, CachedTheme>;
  private hits: number = 0;
  private misses: number = 0;
  private evictions: number = 0;
  private totalGenerationTime: number = 0;
  private generationCount: number = 0;
  private enabled: boolean;
  private maxSize: number;

  constructor(config: ThemeCacheConfig = {}) {
    this.maxSize = config.maxThemes || 100;
    this.enabled = config.enabled !== false; // Default to enabled

    this.cache = new LRUCache<string, CachedTheme>({
      max: this.maxSize,
      ttl: config.ttl || 1000 * 60 * 30, // 30 minutes default
      updateAgeOnGet: true,
      updateAgeOnHas: true,
      dispose: () => {
        this.evictions++;
      }
    });

    console.log(`🎨 Theme cache initialized:`);
    console.log(`   Max themes: ${this.maxSize}`);
    console.log(`   TTL: ${((config.ttl || 1800000) / 1000 / 60).toFixed(0)} minutes`);
    console.log(`   Enabled: ${this.enabled}`);
  }

  /**
   * Generate deterministic cache key from design DNA
   */
  static generateKey(dna: any, options?: any): string {
    const payload = {
      dna: JSON.stringify(dna, Object.keys(dna).sort()),
      options: options ? JSON.stringify(options, Object.keys(options).sort()) : ''
    };
    
    const str = JSON.stringify(payload);
    return crypto.createHash('sha256').update(str).digest('hex').substring(0, 24);
  }

  /**
   * Get cached theme
   */
  get(key: string): CachedTheme | undefined {
    if (!this.enabled) {
      this.misses++;
      return undefined;
    }

    const cached = this.cache.get(key);
    
    if (cached !== undefined) {
      this.hits++;
      console.log(`⚡ Theme cache HIT (${this.getHitRate().toFixed(1)}% hit rate)`);
      return cached;
    }
    
    this.misses++;
    console.log(`🔄 Theme cache MISS - generating theme...`);
    return undefined;
  }

  /**
   * Set cached theme with metadata
   */
  set(key: string, designPackage: any, dna: any, generationTimeMs: number): void {
    if (!this.enabled) {
      return;
    }

    const tokenCount = this.countTokens(designPackage);
    
    const cachedTheme: CachedTheme = {
      designPackage,
      generatedAt: Date.now(),
      dna,
      metadata: {
        generationTimeMs,
        tokenCount,
        cacheKey: key
      }
    };

    this.cache.set(key, cachedTheme);
    this.totalGenerationTime += generationTimeMs;
    this.generationCount++;

    console.log(`💾 Theme cached (${this.cache.size}/${this.maxSize} themes, ${generationTimeMs.toFixed(1)}ms generation)`);
  }

  /**
   * Get or generate theme
   */
  async getOrGenerate(
    dna: any,
    options: any,
    generateFn: () => Promise<{ designPackage: any; generationTime: number }>
  ): Promise<{ designPackage: any; fromCache: boolean; generationTime?: number }> {
    const key = ThemeCache.generateKey(dna, options);
    const cached = this.get(key);

    if (cached) {
      return {
        designPackage: cached.designPackage,
        fromCache: true
      };
    }

    // Generate new theme
    const startTime = performance.now();
    const { designPackage, generationTime } = await generateFn();
    const elapsed = generationTime || (performance.now() - startTime);

    // Cache the result
    this.set(key, designPackage, dna, elapsed);

    return {
      designPackage,
      fromCache: false,
      generationTime: elapsed
    };
  }

  /**
   * Count tokens in design package
   */
  private countTokens(designPackage: any): number {
    let count = 0;
    
    if (designPackage.tokens) {
      if (designPackage.tokens.color) count += Object.keys(designPackage.tokens.color).length;
      if (designPackage.tokens.typography) count += Object.keys(designPackage.tokens.typography).length;
      if (designPackage.tokens.spacing) count += Object.keys(designPackage.tokens.spacing).length;
      if (designPackage.tokens.layout) count += Object.keys(designPackage.tokens.layout).length;
    }
    
    return count;
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
    this.totalGenerationTime = 0;
    this.generationCount = 0;
    console.log('🗑️  Theme cache cleared');
  }

  /**
   * Delete specific cached theme
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Check if theme is cached
   */
  has(key: string): boolean {
    return this.enabled && this.cache.has(key);
  }

  /**
   * Get cache statistics
   */
  getStats(): ThemeCacheStats {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? (this.hits / total) * 100 : 0;
    const avgGenerationTime = this.generationCount > 0 
      ? this.totalGenerationTime / this.generationCount 
      : 0;

    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: Math.round(hitRate * 10) / 10,
      size: this.cache.size,
      maxSize: this.maxSize,
      evictions: this.evictions,
      averageGenerationTime: Math.round(avgGenerationTime * 10) / 10,
      cacheEnabled: this.enabled
    };
  }

  /**
   * Get current hit rate
   */
  private getHitRate(): number {
    const total = this.hits + this.misses;
    return total > 0 ? (this.hits / total) * 100 : 0;
  }

  /**
   * Enable/disable cache
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    console.log(`🎨 Theme cache ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get cache size
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Check if cache is enabled
   */
  get isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Get all cached keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Prune expired entries
   */
  prune(): void {
    this.cache.purgeStale();
    console.log(`🧹 Theme cache pruned (${this.cache.size}/${this.maxSize} themes remaining)`);
  }
}

/**
 * Create theme cache with environment variable override
 */
export function createThemeCache(config?: ThemeCacheConfig): ThemeCache {
  const enabled = process.env.NEXUS_THEME_CACHE_DISABLED !== 'true';
  
  return new ThemeCache({
    ...config,
    enabled: config?.enabled !== undefined ? config.enabled : enabled
  });
}

// Export singleton instance
export const themeCache = createThemeCache();
