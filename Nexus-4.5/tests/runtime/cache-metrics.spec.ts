/**
 * Cache Metrics Test Suite
 * 
 * Tests for performance cache metrics tracking, including:
 * - Hit rate calculation
 * - Miss rate tracking
 * - Stats updates
 * - Cache key generation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PerformanceCache } from '../../src/performance-cache.js';

describe('PerformanceCache Metrics', () => {
  let cache: PerformanceCache<string>;

  beforeEach(() => {
    // Create fresh cache instance for each test
    cache = new PerformanceCache<string>({
      maxItems: 10,
      ttl: 60000 // 60 seconds
    });
  });

  describe('Basic Stats', () => {
    it('should initialize with zero stats', () => {
      const stats = cache.getStats();
      
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.hitRate).toBe(0);
      expect(stats.size).toBe(0);
    });

    it('should track cache hits', () => {
      const key = 'test-key';
      const value = 'test-value';
      
      // Set value
      cache.set(key, value);
      
      // First get - should be a hit
      const result = cache.get(key);
      expect(result).toBe(value);
      
      const stats = cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(0);
      expect(stats.hitRate).toBe(100);
    });

    it('should track cache misses', () => {
      const result = cache.get('nonexistent-key');
      expect(result).toBeUndefined();
      
      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBe(0);
    });

    it('should calculate hit rate correctly', () => {
      // Set some values
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      
      // 2 hits
      cache.get('key1');
      cache.get('key2');
      
      // 1 miss
      cache.get('nonexistent');
      
      const stats = cache.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBeCloseTo(66.67, 1); // 2/3 = 66.67%
    });
  });

  describe('Cache Size', () => {
    it('should track cache size', () => {
      expect(cache.getStats().size).toBe(0);
      
      cache.set('key1', 'value1');
      expect(cache.getStats().size).toBe(1);
      
      cache.set('key2', 'value2');
      expect(cache.getStats().size).toBe(2);
      
      cache.set('key3', 'value3');
      expect(cache.getStats().size).toBe(3);
    });

    it('should update size when items expire', async () => {
      // Create cache with very short TTL
      const shortCache = new PerformanceCache<string>({
        maxItems: 10,
        ttl: 50 // 50ms
      });
      
      shortCache.set('key1', 'value1');
      expect(shortCache.getStats().size).toBe(1);
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Trigger cleanup by attempting get
      shortCache.get('key1');
      
      expect(shortCache.getStats().size).toBe(0);
    });

    it('should respect max size (LRU eviction)', () => {
      // Fill cache to max
      for (let i = 0; i < 10; i++) {
        cache.set(`key${i}`, `value${i}`);
      }
      
      expect(cache.getStats().size).toBe(10);
      
      // Add one more - should evict oldest
      cache.set('key10', 'value10');
      
      expect(cache.getStats().size).toBe(10); // Still at max
      expect(cache.get('key0')).toBeUndefined(); // First item evicted
      expect(cache.get('key10')).toBe('value10'); // New item present
    });
  });

  describe('Cache Keys', () => {
    it('should return array of cached keys', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      
      const stats = cache.getStats();
      expect(stats.keys).toEqual(expect.arrayContaining(['key1', 'key2', 'key3']));
      expect(stats.keys.length).toBe(3);
    });

    it('should update keys list when items removed', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      expect(cache.getStats().keys).toHaveLength(2);
      
      cache.delete('key1');
      
      const stats = cache.getStats();
      expect(stats.keys).toEqual(['key2']);
      expect(stats.keys.length).toBe(1);
    });
  });

  describe('Key Generation', () => {
    it('should generate deterministic cache keys', () => {
      const obj1 = { mode: 'AUTO', request: 'test' };
      const obj2 = { mode: 'AUTO', request: 'test' };
      
      const key1 = PerformanceCache.generateKey(obj1);
      const key2 = PerformanceCache.generateKey(obj2);
      
      expect(key1).toBe(key2);
    });

    it('should generate different keys for different objects', () => {
      const obj1 = { mode: 'AUTO', request: 'test1' };
      const obj2 = { mode: 'AUTO', request: 'test2' };
      
      const key1 = PerformanceCache.generateKey(obj1);
      const key2 = PerformanceCache.generateKey(obj2);
      
      expect(key1).not.toBe(key2);
    });

    it('should handle nested objects', () => {
      const obj = { 
        mode: 'COMPOSE',
        request: 'test',
        context: { user: 'test', session: '123' }
      };
      
      const key = PerformanceCache.generateKey(obj);
      expect(key).toBeDefined();
      expect(typeof key).toBe('string');
    });
  });

  describe('Hit Rate Threshold', () => {
    it('should warn when hit rate is low', () => {
      // Generate mostly misses
      for (let i = 0; i < 10; i++) {
        cache.get(`nonexistent-${i}`); // 10 misses
      }
      
      // One hit
      cache.set('key1', 'value1');
      cache.get('key1'); // 1 hit
      
      const stats = cache.getStats();
      expect(stats.hitRate).toBeLessThan(70); // Below 70% threshold
      expect(stats.misses).toBeGreaterThan(stats.hits);
    });

    it('should have good hit rate with proper usage', () => {
      // Set values
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      
      // Multiple hits
      for (let i = 0; i < 10; i++) {
        cache.get('key1');
        cache.get('key2');
        cache.get('key3');
      }
      
      // One miss
      cache.get('nonexistent');
      
      const stats = cache.getStats();
      expect(stats.hitRate).toBeGreaterThan(70); // Above 70% threshold
      expect(stats.hits).toBeGreaterThan(stats.misses);
    });
  });

  describe('Clear Operations', () => {
    it('should reset stats on clear', () => {
      cache.set('key1', 'value1');
      cache.get('key1'); // 1 hit
      cache.get('missing'); // 1 miss
      
      expect(cache.getStats().hits).toBe(1);
      expect(cache.getStats().misses).toBe(1);
      
      cache.clear();
      
      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.hitRate).toBe(0);
      expect(stats.size).toBe(0);
      expect(stats.keys).toEqual([]);
    });
  });

  describe('Eviction Tracking', () => {
    it('should track evictions when max size reached', () => {
      // Fill beyond capacity
      for (let i = 0; i < 15; i++) {
        cache.set(`key${i}`, `value${i}`);
      }
      
      const stats = cache.getStats();
      expect(stats.size).toBe(10); // Max capacity
      expect(stats.evictions).toBeGreaterThanOrEqual(5); // At least 5 evicted
    });

    it('should include eviction count in stats', () => {
      const stats = cache.getStats();
      expect(stats).toHaveProperty('evictions');
      expect(typeof stats.evictions).toBe('number');
    });
  });
});

describe('Cache Integration', () => {
  it('should work with runtime /status endpoint', async () => {
    // This test verifies cache stats are properly exposed
    const cache = new PerformanceCache<any>({
      maxItems: 100,
      ttl: 3600000
    });
    
    // Simulate some cache activity
    cache.set('enhance:daedalus:test1', { response: 'test' });
    cache.get('enhance:daedalus:test1'); // Hit
    cache.get('enhance:missing:test'); // Miss
    
    const stats = cache.getStats();
    
    // Verify stats structure matches /status response
    expect(stats).toMatchObject({
      hits: expect.any(Number),
      misses: expect.any(Number),
      hitRate: expect.any(Number),
      size: expect.any(Number),
      keys: expect.any(Array),
      evictions: expect.any(Number)
    });
  });
});
