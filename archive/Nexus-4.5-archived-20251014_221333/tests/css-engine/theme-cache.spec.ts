/**
 * Theme Cache Test Suite
 * 
 * Tests for CSS Engine theme caching layer
 * Target: <100ms preview load with warm cache
 * 
 * Sprint 2 Deliverable: Stellar + Flash
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeCache, createThemeCache } from '../../css-engine/runtime/theme-cache.js';

describe('ThemeCache', () => {
  let cache: ThemeCache;

  beforeEach(() => {
    cache = new ThemeCache({
      maxThemes: 10,
      ttl: 60000 // 60 seconds for testing
    });
  });

  describe('Basic Operations', () => {
    it('should initialize with correct configuration', () => {
      const stats = cache.getStats();
      
      expect(stats.size).toBe(0);
      expect(stats.maxSize).toBe(10);
      expect(stats.cacheEnabled).toBe(true);
    });

    it('should generate deterministic cache keys', () => {
      const dna1 = { colors: ['#3b82f6'], constraints: { responsive: true } };
      const dna2 = { colors: ['#3b82f6'], constraints: { responsive: true } };
      
      const key1 = ThemeCache.generateKey(dna1);
      const key2 = ThemeCache.generateKey(dna2);
      
      expect(key1).toBe(key2);
    });

    it('should generate different keys for different DNA', () => {
      const dna1 = { colors: ['#3b82f6'] };
      const dna2 = { colors: ['#ef4444'] };
      
      const key1 = ThemeCache.generateKey(dna1);
      const key2 = ThemeCache.generateKey(dna2);
      
      expect(key1).not.toBe(key2);
    });
  });

  describe('Cache Hit/Miss Tracking', () => {
    it('should track cache misses', () => {
      const key = 'test-key';
      const result = cache.get(key);
      
      expect(result).toBeUndefined();
      
      const stats = cache.getStats();
      expect(stats.misses).toBe(1);
      expect(stats.hits).toBe(0);
    });

    it('should track cache hits', () => {
      const key = 'test-key';
      const designPackage = { tokens: { color: {}, typography: {} } };
      const dna = { colors: ['#3b82f6'] };
      
      cache.set(key, designPackage, dna, 5.5);
      
      const result = cache.get(key);
      expect(result).toBeDefined();
      expect(result?.designPackage).toEqual(designPackage);
      
      const stats = cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(0);
    });

    it('should calculate hit rate correctly', () => {
      const key1 = 'theme-1';
      const key2 = 'theme-2';
      const designPackage = { tokens: {} };
      const dna = { colors: ['#3b82f6'] };
      
      // Set two themes
      cache.set(key1, designPackage, dna, 3.0);
      cache.set(key2, designPackage, dna, 3.5);
      
      // 2 hits
      cache.get(key1);
      cache.get(key2);
      
      // 1 miss
      cache.get('nonexistent');
      
      const stats = cache.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBeCloseTo(66.7, 1); // 2/3 = 66.7%
    });
  });

  describe('Cache Eviction', () => {
    it('should evict oldest theme when max size reached', () => {
      const dna = { colors: ['#000'] };
      
      // Fill cache to max (10 themes)
      for (let i = 0; i < 10; i++) {
        const key = `theme-${i}`;
        cache.set(key, { tokens: {} }, dna, 2.0);
      }
      
      expect(cache.size).toBe(10);
      
      // Add one more - should evict oldest
      cache.set('theme-10', { tokens: {} }, dna, 2.0);
      
      expect(cache.size).toBe(10);
      expect(cache.has('theme-0')).toBe(false); // First item evicted
      expect(cache.has('theme-10')).toBe(true); // New item present
    });

    it('should track eviction count', () => {
      const dna = { colors: ['#000'] };
      
      // Exceed max size
      for (let i = 0; i < 15; i++) {
        cache.set(`theme-${i}`, { tokens: {} }, dna, 2.0);
      }
      
      const stats = cache.getStats();
      expect(stats.evictions).toBeGreaterThanOrEqual(5);
    });
  });

  describe('TTL Expiration', () => {
    it('should expire themes after TTL', async () => {
      const shortCache = new ThemeCache({
        maxThemes: 10,
        ttl: 50 // 50ms
      });
      
      const key = 'short-lived-theme';
      shortCache.set(key, { tokens: {} }, { colors: ['#000'] }, 2.0);
      
      expect(shortCache.has(key)).toBe(true);
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Trigger cleanup
      const result = shortCache.get(key);
      
      expect(result).toBeUndefined();
      expect(shortCache.size).toBe(0);
    });
  });

  describe('getOrGenerate', () => {
    it('should return cached theme if available', async () => {
      const dna = { colors: ['#3b82f6'] };
      const options = {};
      const designPackage = { tokens: { color: { primary: '#3b82f6' } } };
      
      const key = ThemeCache.generateKey(dna, options);
      cache.set(key, designPackage, dna, 3.0);
      
      const generateFn = vi.fn().mockResolvedValue({
        designPackage: { tokens: {} },
        generationTime: 5.0
      });
      
      const result = await cache.getOrGenerate(dna, options, generateFn);
      
      expect(result.fromCache).toBe(true);
      expect(result.designPackage).toEqual(designPackage);
      expect(generateFn).not.toHaveBeenCalled();
    });

    it('should generate and cache if not available', async () => {
      const dna = { colors: ['#3b82f6'] };
      const options = {};
      const designPackage = { tokens: { color: { primary: '#3b82f6' } } };
      
      const generateFn = vi.fn().mockResolvedValue({
        designPackage,
        generationTime: 5.5
      });
      
      const result = await cache.getOrGenerate(dna, options, generateFn);
      
      expect(result.fromCache).toBe(false);
      expect(result.designPackage).toEqual(designPackage);
      expect(result.generationTime).toBe(5.5);
      expect(generateFn).toHaveBeenCalledTimes(1);
      
      // Verify it was cached
      const key = ThemeCache.generateKey(dna, options);
      expect(cache.has(key)).toBe(true);
    });
  });

  describe('Performance Metrics', () => {
    it('should track average generation time', () => {
      const dna = { colors: ['#000'] };
      
      cache.set('theme-1', { tokens: {} }, dna, 3.0);
      cache.set('theme-2', { tokens: {} }, dna, 5.0);
      cache.set('theme-3', { tokens: {} }, dna, 4.0);
      
      const stats = cache.getStats();
      expect(stats.averageGenerationTime).toBe(4.0); // (3 + 5 + 4) / 3
    });

    it('should include token count in cached metadata', () => {
      const designPackage = {
        tokens: {
          color: { primary: '#000', secondary: '#fff' },
          typography: { body: '16px', heading: '24px' },
          spacing: { small: '8px' }
        }
      };
      const dna = { colors: ['#000'] };
      
      cache.set('theme-rich', designPackage, dna, 5.0);
      
      const cached = cache.get('theme-rich');
      expect(cached?.metadata.tokenCount).toBe(5); // 2 + 2 + 1
    });
  });

  describe('Enable/Disable', () => {
    it('should respect disabled state', () => {
      cache.setEnabled(false);
      
      const key = 'theme-disabled';
      cache.set(key, { tokens: {} }, { colors: ['#000'] }, 2.0);
      
      const result = cache.get(key);
      expect(result).toBeUndefined();
      
      const stats = cache.getStats();
      expect(stats.cacheEnabled).toBe(false);
    });

    it('should work normally when re-enabled', () => {
      cache.setEnabled(false);
      cache.setEnabled(true);
      
      const key = 'theme-reenabled';
      cache.set(key, { tokens: {} }, { colors: ['#000'] }, 2.0);
      
      const result = cache.get(key);
      expect(result).toBeDefined();
    });
  });

  describe('Clear Operations', () => {
    it('should clear all cached themes', () => {
      const dna = { colors: ['#000'] };
      
      for (let i = 0; i < 5; i++) {
        cache.set(`theme-${i}`, { tokens: {} }, dna, 2.0);
      }
      
      expect(cache.size).toBe(5);
      
      cache.clear();
      
      expect(cache.size).toBe(0);
      
      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.evictions).toBe(0);
    });

    it('should delete specific theme', () => {
      const dna = { colors: ['#000'] };
      
      cache.set('theme-1', { tokens: {} }, dna, 2.0);
      cache.set('theme-2', { tokens: {} }, dna, 2.0);
      
      expect(cache.size).toBe(2);
      
      cache.delete('theme-1');
      
      expect(cache.size).toBe(1);
      expect(cache.has('theme-1')).toBe(false);
      expect(cache.has('theme-2')).toBe(true);
    });
  });

  describe('Environment Variable Override', () => {
    it('should respect NEXUS_THEME_CACHE_DISABLED env var', () => {
      process.env.NEXUS_THEME_CACHE_DISABLED = 'true';
      
      const envCache = createThemeCache();
      
      expect(envCache.isEnabled).toBe(false);
      
      delete process.env.NEXUS_THEME_CACHE_DISABLED;
    });
  });

  describe('Performance Target: <100ms', () => {
    it('should serve cached theme in <1ms', () => {
      const dna = { colors: ['#3b82f6'] };
      const designPackage = { tokens: { color: {}, typography: {}, spacing: {} } };
      
      const key = ThemeCache.generateKey(dna);
      cache.set(key, designPackage, dna, 5.0);
      
      // Warm up
      cache.get(key);
      
      // Measure cached retrieval
      const start = performance.now();
      const result = cache.get(key);
      const elapsed = performance.now() - start;
      
      expect(result).toBeDefined();
      expect(elapsed).toBeLessThan(1); // <1ms target
    });
  });
});

describe('ThemeCache Integration', () => {
  it('should integrate with DesignSystemArchitect workflow', async () => {
    const cache = new ThemeCache({ maxThemes: 100 });
    const dna = { colors: ['#3b82f6'], constraints: { responsive: true } };
    
    // Simulate first generation (cache miss)
    const generateFn = vi.fn().mockResolvedValue({
      designPackage: { tokens: { color: {}, typography: {}, spacing: {} } },
      generationTime: 4.5
    });
    
    const firstResult = await cache.getOrGenerate(dna, {}, generateFn);
    
    expect(firstResult.fromCache).toBe(false);
    expect(firstResult.generationTime).toBe(4.5);
    
    // Simulate second request (cache hit)
    const secondResult = await cache.getOrGenerate(dna, {}, generateFn);
    
    expect(secondResult.fromCache).toBe(true);
    expect(generateFn).toHaveBeenCalledTimes(1); // Only called once
    
    // Verify hit rate
    const stats = cache.getStats();
    expect(stats.hitRate).toBe(50); // 1 hit, 1 miss = 50%
  });
});
