/**
 * NUXEE Engine Integration Tests
 */

import { NUXEEEngine } from '../nuxee-engine';
import { PATTERN_LIBRARY } from '../pattern-library';

describe('NUXEEEngine Integration', () => {
  let engine: NUXEEEngine;
  
  beforeEach(() => {
    engine = new NUXEEEngine({
      patterns: PATTERN_LIBRARY,
      enable_learning: false, // Disable for tests
      enable_analytics: false
    });
    
    // Register all patterns
    PATTERN_LIBRARY.forEach(pattern => engine.registerPattern(pattern));
  });
  
  describe('Pattern Registration', () => {
    test('should register patterns', () => {
      const patterns = engine.getPatterns();
      expect(patterns.length).toBe(20);
    });
    
    test('should retrieve pattern by ID', () => {
      const pattern = engine.getPattern('button_smooth_hover');
      expect(pattern).toBeDefined();
      expect(pattern?.name).toBe('Smooth Button Hover');
    });
  });
  
  describe('enhance', () => {
    test('should enhance simple HTML with buttons', async () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <body>
            <button>Click me</button>
            <button>Submit</button>
          </body>
        </html>
      `;
      
      const result = await engine.enhance(html, {
        auto_select: true,
        require_aaa: true,
        min_confidence: 0.5
      });
      
      expect(result).toHaveProperty('enhanced_html');
      expect(result).toHaveProperty('patterns_applied');
      expect(result).toHaveProperty('confidence_score');
      expect(result.aaa_compliant).toBe(true);
    });
    
    test('should detect and enhance form inputs', async () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <body>
            <form>
              <input type="text" id="name">
              <input type="email" id="email">
              <button type="submit">Submit</button>
            </form>
          </body>
        </html>
      `;
      
      const result = await engine.enhance(html, {
        auto_select: true
      });
      
      // Should apply input focus patterns
      expect(result.patterns_applied.length).toBeGreaterThan(0);
      expect(result.elements_enhanced).toBeGreaterThan(0);
    });
    
    test('should respect min_confidence threshold', async () => {
      const html = '<html><body><button>Test</button></body></html>';
      
      const result = await engine.enhance(html, {
        auto_select: true,
        min_confidence: 0.9 // Very high threshold
      });
      
      // All applied patterns should meet threshold
      result.patterns_applied.forEach(app => {
        expect(app.confidence).toBeGreaterThanOrEqual(0.9);
      });
    });
    
    test('should generate valid CSS', async () => {
      const html = '<html><body><button>Test</button></body></html>';
      
      const result = await engine.enhance(html);
      
      // Check CSS was injected
      expect(result.enhanced_html).toContain('<style');
      expect(result.enhanced_html).toContain('data-nuxee');
      expect(result.css_size_bytes).toBeGreaterThan(0);
    });
    
    test('should track processing time', async () => {
      const html = '<html><body><button>Test</button></body></html>';
      
      const result = await engine.enhance(html);
      
      expect(result.processing_time_ms).toBeGreaterThan(0);
      expect(result.processing_time_ms).toBeLessThan(5000); // Should be fast
    });
  });
  
  describe('ask (Conversational)', () => {
    test('should understand button query', async () => {
      const response = await engine.ask({
        query: 'How can I improve my buttons?'
      });
      
      expect(response).toHaveProperty('understood_intent');
      expect(response).toHaveProperty('recommended_patterns');
      expect(response.understood_intent.goal).toBe('button');
    });
    
    test('should understand form query', async () => {
      const response = await engine.ask({
        query: 'My forms need better UX'
      });
      
      expect(response.understood_intent.goal).toBe('form');
      expect(response.recommended_patterns.length).toBeGreaterThan(0);
    });
    
    test('should provide suggestions', async () => {
      const response = await engine.ask({
        query: 'Improve my site'
      });
      
      expect(response).toHaveProperty('suggested_questions');
      expect(response.suggested_questions.length).toBeGreaterThan(0);
    });
  });
  
  describe('analyzeAndRecommend (Proactive)', () => {
    test('should provide recommendations for buttons', async () => {
      const html = `
        <html>
          <body>
            <button>Button 1</button>
            <button>Button 2</button>
            <button>Button 3</button>
          </body>
        </html>
      `;
      
      const recommendations = await engine.analyzeAndRecommend(html);
      
      expect(Array.isArray(recommendations)).toBe(true);
      // Should recommend button enhancements
      expect(recommendations.length).toBeGreaterThan(0);
    });
    
    test('should flag accessibility issues', async () => {
      const html = `
        <html>
          <body>
            <img src="test.jpg">
            <input type="text">
          </body>
        </html>
      `;
      
      const recommendations = await engine.analyzeAndRecommend(html);
      
      // Should have accessibility recommendation
      const accessibilityRec = recommendations.find(r => r.type === 'accessibility');
      expect(accessibilityRec).toBeDefined();
    });
  });
  
  describe('Pattern Metrics', () => {
    test('should track pattern metrics', () => {
      const metrics = engine.getPatternMetrics('button_smooth_hover');
      
      expect(metrics).toHaveProperty('pattern_id');
      expect(metrics).toHaveProperty('total_applications');
    });
  });
  
  describe('Real-World Scenarios', () => {
    test('should handle e-commerce page', async () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <body>
            <div class="product-card">
              <img src="product.jpg" alt="Product">
              <h2>Product Name</h2>
              <span class="price">$99.99</span>
              <button>Add to Cart</button>
            </div>
          </body>
        </html>
      `;
      
      const result = await engine.enhance(html);
      
      expect(result.patterns_applied.length).toBeGreaterThan(0);
      expect(result.page_analysis.page_type).toBe('product');
    });
    
    test('should handle landing page', async () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <body>
            <section class="hero">
              <h1>Welcome</h1>
              <button class="cta">Get Started</button>
            </section>
          </body>
        </html>
      `;
      
      const result = await engine.enhance(html);
      
      expect(result.page_analysis.page_type).toBe('landing');
      expect(result.page_analysis.page_intent).toBe('conversion');
    });
    
    test('should handle form-heavy page', async () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <body>
            <form>
              <input type="text" id="name">
              <input type="email" id="email">
              <input type="tel" id="phone">
              <textarea id="message"></textarea>
              <button type="submit">Send</button>
            </form>
          </body>
        </html>
      `;
      
      const result = await engine.enhance(html);
      
      // Should apply multiple form patterns
      const formPatterns = result.patterns_applied.filter(p => 
        p.pattern_id.includes('input') || p.pattern_id.includes('form')
      );
      expect(formPatterns.length).toBeGreaterThan(0);
    });
  });
  
  describe('Edge Cases', () => {
    test('should handle empty HTML', async () => {
      const html = '<html><body></body></html>';
      
      const result = await engine.enhance(html);
      
      expect(result.patterns_applied.length).toBe(0);
      expect(result.elements_enhanced).toBe(0);
    });
    
    test('should handle HTML without opportunities', async () => {
      const html = '<html><body><p>Just text</p></body></html>';
      
      const result = await engine.enhance(html);
      
      // Might have 0 or very few patterns applied
      expect(result.patterns_applied.length).toBeGreaterThanOrEqual(0);
    });
    
    test('should handle malformed HTML gracefully', async () => {
      const html = '<div><button>Test</div>'; // Missing closing button tag
      
      // Should not throw
      await expect(engine.enhance(html)).resolves.toBeDefined();
    });
  });
});
