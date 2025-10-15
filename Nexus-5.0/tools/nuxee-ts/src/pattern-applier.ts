/**
 * Pattern Applier - Apply UX patterns to HTML
 * 
 * Generates CSS and injects it into HTML
 * 
 * @version 2.0.0
 */

import { JSDOM } from 'jsdom';
import type { UXPattern, PatternApplication, PatternCSS } from './types.js';

export class PatternApplier {
  private lastGeneratedCSSSize: number = 0;
  
  /**
   * Apply patterns to HTML
   */
  async apply(
    html: string,
    applications: PatternApplication[],
    allPatterns: UXPattern[]
  ): Promise<string> {
    
    if (applications.length === 0) {
      console.log('⚠️  No patterns to apply');
      return html;
    }
    
    // Generate CSS for all applications
    const css = this.generateCSS(applications, allPatterns);
    this.lastGeneratedCSSSize = css.length;
    
    // Inject CSS into HTML
    const enhancedHtml = this.injectCSS(html, css);
    
    return enhancedHtml;
  }
  
  /**
   * Generate CSS for pattern applications
   */
  generateCSS(applications: PatternApplication[], allPatterns: UXPattern[]): string {
    const cssBlocks: string[] = [];
    
    // Add motion safety media query
    cssBlocks.push(`
/* NUXEE Enhanced Styles v2.0 */
/* Generated: ${new Date().toISOString()} */

/* Motion safety - respect user preferences */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`);
    
    // Generate CSS for each application
    for (const application of applications) {
      const pattern = allPatterns.find(p => p.id === application.pattern_id);
      
      if (!pattern) {
        console.warn(`⚠️  Pattern not found: ${application.pattern_id}`);
        continue;
      }
      
      const patternCSS = this.generatePatternCSS(pattern, application);
      if (patternCSS) {
        cssBlocks.push(`\n/* Pattern: ${pattern.name} */`);
        cssBlocks.push(`/* ${pattern.description} */`);
        cssBlocks.push(patternCSS);
      }
    }
    
    return cssBlocks.join('\n');
  }
  
  /**
   * Generate CSS for a single pattern
   */
  private generatePatternCSS(pattern: UXPattern, application: PatternApplication): string {
    const cssRules: string[] = [];
    const css = pattern.css;
    const selectors = application.selectors_matched.join(', ');
    
    // Base styles
    if (css.base) {
      cssRules.push(`${selectors} {
  ${css.base}
}`);
    }
    
    // Hover styles
    if (css.hover) {
      cssRules.push(`${selectors}:hover {
  ${css.hover}
}`);
    }
    
    // Focus styles
    if (css.focus) {
      cssRules.push(`${selectors}:focus {
  ${css.focus}
}`);
    }
    
    // Active styles
    if (css.active) {
      cssRules.push(`${selectors}:active {
  ${css.active}
}`);
    }
    
    // Pseudo-elements
    if (css.before) {
      cssRules.push(`${selectors}::before {
  ${css.before}
}`);
    }
    
    if (css.after) {
      cssRules.push(`${selectors}::after {
  ${css.after}
}`);
    }
    
    // Hover pseudo-elements
    if (css.hover_before) {
      cssRules.push(`${selectors}:hover::before {
  ${css.hover_before}
}`);
    }
    
    if (css.hover_after) {
      cssRules.push(`${selectors}:hover::after {
  ${css.hover_after}
}`);
    }
    
    // Keyframes
    if (css.keyframes) {
      cssRules.push(css.keyframes);
    }
    
    // Media queries
    if (css.media_queries) {
      Object.entries(css.media_queries).forEach(([query, rules]) => {
        cssRules.push(`@media ${query} {
  ${selectors} {
    ${rules}
  }
}`);
      });
    }
    
    return cssRules.join('\n\n');
  }
  
  /**
   * Inject CSS into HTML
   */
  injectCSS(html: string, css: string): string {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-nuxee', '2.0');
    styleElement.textContent = css;
    
    // Find insertion point
    let insertionPoint = document.querySelector('head');
    
    if (!insertionPoint) {
      // No head tag, try to find body
      insertionPoint = document.querySelector('body');
      
      if (!insertionPoint) {
        // No body either, insert before first element
        const firstElement = document.querySelector('*');
        if (firstElement && firstElement.parentNode) {
          firstElement.parentNode.insertBefore(styleElement, firstElement);
        } else {
          console.warn('⚠️  Could not find insertion point for styles');
          return html;
        }
      } else {
        // Insert at beginning of body
        insertionPoint.insertBefore(styleElement, insertionPoint.firstChild);
      }
    } else {
      // Insert at end of head
      insertionPoint.appendChild(styleElement);
    }
    
    // Return serialized HTML
    return dom.serialize();
  }
  
  /**
   * Get size of last generated CSS
   */
  getLastGeneratedCSSSize(): number {
    return this.lastGeneratedCSSSize;
  }
  
  /**
   * Validate CSS (basic syntax check)
   */
  private validateCSS(css: string): boolean {
    // Basic validation - check for balanced braces
    const openBraces = (css.match(/{/g) || []).length;
    const closeBraces = (css.match(/}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      console.warn('⚠️  CSS validation failed: unbalanced braces');
      return false;
    }
    
    return true;
  }
  
  /**
   * Minify CSS (basic minification)
   */
  private minifyCSS(css: string): string {
    return css
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Remove space around selectors and braces
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*:\s*/g, ':')
      .replace(/\s*;\s*/g, ';')
      .trim();
  }
  
  /**
   * Extract existing NUXEE styles (for updates)
   */
  extractExistingNUXEEStyles(html: string): string | null {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    const nuxeeStyle = document.querySelector('style[data-nuxee]');
    return nuxeeStyle ? nuxeeStyle.textContent : null;
  }
  
  /**
   * Remove existing NUXEE styles
   */
  removeExistingNUXEEStyles(html: string): string {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    const nuxeeStyles = document.querySelectorAll('style[data-nuxee]');
    nuxeeStyles.forEach(style => style.remove());
    
    return dom.serialize();
  }
}

export default PatternApplier;
