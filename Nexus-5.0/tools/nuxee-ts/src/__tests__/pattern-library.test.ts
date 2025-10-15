/**
 * Pattern Library Tests
 * 
 * Tests for UX pattern definitions and utilities
 */

import {
  PATTERN_LIBRARY,
  getPatternById,
  getPatternsByCategory,
  getPatternsByTag,
  getTopPatterns,
  getAAAPatterns,
  getPatternsByImpact,
  searchPatterns,
  getPatternStatistics
} from '../pattern-library';

describe('Pattern Library', () => {
  
  describe('PATTERN_LIBRARY', () => {
    test('should have 20 patterns', () => {
      expect(PATTERN_LIBRARY).toHaveLength(20);
    });
    
    test('all patterns should have required fields', () => {
      PATTERN_LIBRARY.forEach(pattern => {
        expect(pattern).toHaveProperty('id');
        expect(pattern).toHaveProperty('name');
        expect(pattern).toHaveProperty('category');
        expect(pattern).toHaveProperty('description');
        expect(pattern).toHaveProperty('target');
        expect(pattern).toHaveProperty('css');
        expect(pattern).toHaveProperty('aaa_safe');
        expect(pattern).toHaveProperty('effectiveness');
      });
    });
    
    test('all patterns should be AAA compliant', () => {
      PATTERN_LIBRARY.forEach(pattern => {
        expect(pattern.aaa_safe).toBe(true);
        expect(pattern.wcag_level).toBe('AAA');
      });
    });
    
    test('effectiveness should be between 0 and 1', () => {
      PATTERN_LIBRARY.forEach(pattern => {
        expect(pattern.effectiveness).toBeGreaterThanOrEqual(0);
        expect(pattern.effectiveness).toBeLessThanOrEqual(1);
      });
    });
    
    test('should have unique IDs', () => {
      const ids = PATTERN_LIBRARY.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(PATTERN_LIBRARY.length);
    });
  });
  
  describe('getPatternById', () => {
    test('should find pattern by ID', () => {
      const pattern = getPatternById('button_smooth_hover');
      expect(pattern).toBeDefined();
      expect(pattern?.name).toBe('Smooth Button Hover');
    });
    
    test('should return undefined for non-existent ID', () => {
      const pattern = getPatternById('non_existent');
      expect(pattern).toBeUndefined();
    });
  });
  
  describe('getPatternsByCategory', () => {
    test('should find patterns by category', () => {
      const patterns = getPatternsByCategory('micro-interaction');
      expect(patterns.length).toBeGreaterThan(0);
      patterns.forEach(p => {
        expect(p.category).toBe('micro-interaction');
      });
    });
    
    test('should return empty array for non-existent category', () => {
      const patterns = getPatternsByCategory('non-existent');
      expect(patterns).toEqual([]);
    });
  });
  
  describe('getPatternsByTag', () => {
    test('should find patterns by tag', () => {
      const patterns = getPatternsByTag('button');
      expect(patterns.length).toBeGreaterThan(0);
      patterns.forEach(p => {
        expect(p.tags).toContain('button');
      });
    });
  });
  
  describe('getTopPatterns', () => {
    test('should return top 10 patterns by default', () => {
      const patterns = getTopPatterns();
      expect(patterns).toHaveLength(10);
    });
    
    test('should return patterns sorted by effectiveness', () => {
      const patterns = getTopPatterns();
      for (let i = 1; i < patterns.length; i++) {
        expect(patterns[i - 1].effectiveness).toBeGreaterThanOrEqual(
          patterns[i].effectiveness
        );
      }
    });
    
    test('should respect limit parameter', () => {
      const patterns = getTopPatterns(5);
      expect(patterns).toHaveLength(5);
    });
  });
  
  describe('getAAAPatterns', () => {
    test('should return all patterns (all are AAA)', () => {
      const patterns = getAAAPatterns();
      expect(patterns).toHaveLength(20);
      patterns.forEach(p => {
        expect(p.wcag_level).toBe('AAA');
      });
    });
  });
  
  describe('getPatternsByImpact', () => {
    test('should filter by high impact', () => {
      const patterns = getPatternsByImpact('high');
      patterns.forEach(p => {
        expect(p.impact).toBe('high');
      });
    });
    
    test('should filter by medium impact', () => {
      const patterns = getPatternsByImpact('medium');
      patterns.forEach(p => {
        expect(p.impact).toBe('medium');
      });
    });
    
    test('should filter by low impact', () => {
      const patterns = getPatternsByImpact('low');
      patterns.forEach(p => {
        expect(p.impact).toBe('low');
      });
    });
  });
  
  describe('searchPatterns', () => {
    test('should search by name', () => {
      const patterns = searchPatterns('button');
      expect(patterns.length).toBeGreaterThan(0);
    });
    
    test('should search by description', () => {
      const patterns = searchPatterns('hover');
      expect(patterns.length).toBeGreaterThan(0);
    });
    
    test('should be case-insensitive', () => {
      const lower = searchPatterns('button');
      const upper = searchPatterns('BUTTON');
      expect(lower).toEqual(upper);
    });
    
    test('should return empty array for no matches', () => {
      const patterns = searchPatterns('xyzabc123');
      expect(patterns).toEqual([]);
    });
  });
  
  describe('getPatternStatistics', () => {
    test('should return statistics object', () => {
      const stats = getPatternStatistics();
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('by_category');
      expect(stats).toHaveProperty('by_impact');
      expect(stats).toHaveProperty('aaa_compliant');
      expect(stats).toHaveProperty('avg_effectiveness');
      expect(stats).toHaveProperty('top_10');
    });
    
    test('should have correct total', () => {
      const stats = getPatternStatistics();
      expect(stats.total).toBe(20);
    });
    
    test('should calculate average effectiveness', () => {
      const stats = getPatternStatistics();
      expect(stats.avg_effectiveness).toBeGreaterThan(0);
      expect(stats.avg_effectiveness).toBeLessThanOrEqual(1);
    });
    
    test('should have top 10 patterns', () => {
      const stats = getPatternStatistics();
      expect(stats.top_10).toHaveLength(10);
    });
  });
  
  describe('Pattern Quality', () => {
    test('Input Focus Glow should be most effective', () => {
      const pattern = getPatternById('input_focus_glow');
      expect(pattern?.effectiveness).toBe(0.95);
    });
    
    test('all form patterns should have high effectiveness', () => {
      const formPatterns = getPatternsByCategory('form-ux');
      formPatterns.forEach(p => {
        expect(p.effectiveness).toBeGreaterThanOrEqual(0.75);
      });
    });
    
    test('average effectiveness should be above 80%', () => {
      const stats = getPatternStatistics();
      expect(stats.avg_effectiveness).toBeGreaterThan(0.8);
    });
  });
});
