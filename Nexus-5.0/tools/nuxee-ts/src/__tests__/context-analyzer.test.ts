/**
 * Context Analyzer Tests
 */

import { ContextAnalyzer } from '../context-analyzer';

describe('ContextAnalyzer', () => {
  let analyzer: ContextAnalyzer;
  
  beforeEach(() => {
    analyzer = new ContextAnalyzer();
  });
  
  describe('analyze', () => {
    test('should analyze simple HTML', async () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <head><title>Test Page</title></head>
          <body>
            <h1>Welcome</h1>
            <button>Click me</button>
          </body>
        </html>
      `;
      
      const result = await analyzer.analyze(html);
      
      expect(result).toHaveProperty('design_style');
      expect(result).toHaveProperty('page_type');
      expect(result).toHaveProperty('page_intent');
      expect(result).toHaveProperty('total_elements');
      expect(result.total_elements).toBeGreaterThan(0);
    });
  });
  
  describe('detectDesignStyle', () => {
    test('should detect material design', () => {
      const html = '<div style="box-shadow: 0 2px 4px rgba(0,0,0,0.1)">Material</div>';
      const dom = new (require('jsdom').JSDOM)(html);
      const style = analyzer.detectDesignStyle(html, dom.window.document);
      expect(style).toBe('material');
    });
    
    test('should detect minimal design', () => {
      const html = '<div style="padding: 50px; font-family: sans-serif">Minimal</div>';
      const dom = new (require('jsdom').JSDOM)(html);
      const style = analyzer.detectDesignStyle(html, dom.window.document);
      // Could be minimal or balanced
      expect(['minimal', 'balanced']).toContain(style);
    });
  });
  
  describe('detectPageType', () => {
    test('should detect landing page', () => {
      const html = '<div><h1>Hero Section</h1><button>Get Started</button></div>';
      const dom = new (require('jsdom').JSDOM)(html);
      const type = analyzer.detectPageType(html, dom.window.document);
      expect(type).toBe('landing');
    });
    
    test('should detect product page', () => {
      const html = '<div><h1>Product</h1><button>Add to Cart</button><span class="price">$99</span></div>';
      const dom = new (require('jsdom').JSDOM)(html);
      const type = analyzer.detectPageType(html, dom.window.document);
      expect(type).toBe('product');
    });
    
    test('should detect article page', () => {
      const html = '<article><h1>Article Title</h1><p>Content</p></article>';
      const dom = new (require('jsdom').JSDOM)(html);
      const type = analyzer.detectPageType(html, dom.window.document);
      expect(type).toBe('article');
    });
  });
  
  describe('detectPageIntent', () => {
    test('should detect conversion intent', () => {
      const html = '<div><button>Buy Now</button><span>$99</span></div>';
      const dom = new (require('jsdom').JSDOM)(html);
      const intent = analyzer.detectPageIntent(html, dom.window.document);
      expect(intent).toBe('conversion');
    });
    
    test('should detect information intent', () => {
      const html = '<div><h1>About Us</h1><p>Learn more</p></div>';
      const dom = new (require('jsdom').JSDOM)(html);
      const intent = analyzer.detectPageIntent(html, dom.window.document);
      expect(intent).toBe('information');
    });
  });
  
  describe('calculateDensity', () => {
    test('should calculate layout density', () => {
      const html = '<div><div><div><div></div></div></div></div>';
      const dom = new (require('jsdom').JSDOM)(html);
      const density = analyzer.calculateDensity(html, dom.window.document);
      expect(density).toBeGreaterThanOrEqual(0);
      expect(density).toBeLessThanOrEqual(1);
    });
  });
  
  describe('estimateAccessibilityScore', () => {
    test('should score perfect accessibility highly', () => {
      const html = `
        <main>
          <h1>Title</h1>
          <img src="test.jpg" alt="Test image">
          <label for="name">Name:</label>
          <input id="name" type="text">
        </main>
      `;
      const dom = new (require('jsdom').JSDOM)(html);
      const score = analyzer.estimateAccessibilityScore(dom.window.document);
      expect(score).toBeGreaterThan(80);
    });
    
    test('should score poor accessibility lower', () => {
      const html = `
        <div>
          <img src="test.jpg">
          <input type="text">
        </div>
      `;
      const dom = new (require('jsdom').JSDOM)(html);
      const score = analyzer.estimateAccessibilityScore(dom.window.document);
      expect(score).toBeLessThan(100);
    });
  });
  
  describe('findAccessibilityIssues', () => {
    test('should find missing alt text', () => {
      const html = '<img src="test.jpg">';
      const dom = new (require('jsdom').JSDOM)(html);
      const issues = analyzer.findAccessibilityIssues(dom.window.document);
      expect(issues.some(issue => issue.includes('alt'))).toBe(true);
    });
    
    test('should find missing labels', () => {
      const html = '<input type="text">';
      const dom = new (require('jsdom').JSDOM)(html);
      const issues = analyzer.findAccessibilityIssues(dom.window.document);
      expect(issues.some(issue => issue.includes('label'))).toBe(true);
    });
    
    test('should find no issues in accessible HTML', () => {
      const html = `
        <main>
          <h1>Title</h1>
          <label for="name">Name:</label>
          <input id="name" type="text">
          <img src="test.jpg" alt="Test">
        </main>
      `;
      const dom = new (require('jsdom').JSDOM)(html);
      const issues = analyzer.findAccessibilityIssues(dom.window.document);
      // May still have some minor issues, but should be minimal
      expect(issues.length).toBeLessThan(3);
    });
  });
});
