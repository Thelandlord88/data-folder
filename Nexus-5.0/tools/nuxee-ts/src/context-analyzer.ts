/**
 * Context Analyzer - Intelligent page analysis
 * 
 * Analyzes HTML pages to understand design style, layout, and intent
 * 
 * @version 2.0.0
 */

import { JSDOM } from 'jsdom';
import type { PageAnalysis, DesignStyle, PageType, PageIntent } from './types.js';

export class ContextAnalyzer {
  
  /**
   * Perform comprehensive page analysis
   */
  async analyze(html: string): Promise<PageAnalysis> {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    return {
      design_style: this.detectDesignStyle(html, document),
      layout_density: this.calculateDensity(html, document),
      color_palette: this.extractColors(html),
      typography_style: this.detectTypographyStyle(html),
      
      page_type: this.detectPageType(html, document),
      page_intent: this.detectPageIntent(html, document),
      primary_actions: this.findPrimaryActions(document),
      
      total_elements: document.querySelectorAll('*').length,
      interactive_elements: this.countInteractiveElements(document),
      form_elements: document.querySelectorAll('input, textarea, select').length,
      
      existing_patterns: this.detectExistingPatterns(html),
      existing_transitions: html.includes('transition'),
      existing_animations: html.includes('animation') || html.includes('@keyframes'),
      
      current_accessibility_score: this.estimateAccessibilityScore(document),
      accessibility_issues: this.findAccessibilityIssues(document),
      
      recommended_focus_areas: this.recommendFocusAreas(document)
    };
  }
  
  /**
   * Detect design style (minimal, material, corporate, etc.)
   */
  detectDesignStyle(html: string, document: Document): DesignStyle {
    const htmlLower = html.toLowerCase();
    const scores: Record<DesignStyle, number> = {
      minimal: 0,
      material: 0,
      corporate: 0,
      playful: 0,
      elegant: 0,
      modern: 0,
      classic: 0,
      balanced: 0
    };
    
    // Minimal indicators
    if (htmlLower.match(/padding.*\d{2,}px/g)?.length || 0 > 10) scores.minimal += 3;
    if (htmlLower.includes('sans-serif')) scores.minimal += 2;
    if (htmlLower.includes('clean') || htmlLower.includes('simple')) scores.minimal += 2;
    
    // Material design indicators
    if (htmlLower.includes('box-shadow')) scores.material += 5;
    if (htmlLower.includes('elevation')) scores.material += 3;
    if (htmlLower.includes('card')) scores.material += 2;
    if (htmlLower.includes('material')) scores.material += 4;
    
    // Corporate indicators
    if (htmlLower.includes('professional') || htmlLower.includes('business')) scores.corporate += 3;
    if (htmlLower.includes('enterprise')) scores.corporate += 2;
    if (document.querySelectorAll('.container, .wrapper').length > 5) scores.corporate += 2;
    
    // Playful indicators
    if (htmlLower.includes('colorful') || htmlLower.includes('vibrant')) scores.playful += 3;
    if (htmlLower.includes('fun') || htmlLower.includes('creative')) scores.playful += 2;
    if ((html.match(/#[0-9a-fA-F]{6}/g)?.length || 0) > 15) scores.playful += 2;
    
    // Modern indicators
    if (htmlLower.includes('grid') || htmlLower.includes('flex')) scores.modern += 3;
    if (htmlLower.includes('gradient')) scores.modern += 2;
    if (htmlLower.includes('backdrop-filter')) scores.modern += 3;
    
    // Elegant indicators
    if (htmlLower.includes('serif')) scores.elegant += 2;
    if (htmlLower.includes('elegant') || htmlLower.includes('sophisticated')) scores.elegant += 3;
    if (htmlLower.includes('luxury')) scores.elegant += 2;
    
    // Find highest score
    let maxStyle: DesignStyle = 'balanced';
    let maxScore = 0;
    
    Object.entries(scores).forEach(([style, score]) => {
      if (score > maxScore) {
        maxScore = score;
        maxStyle = style as DesignStyle;
      }
    });
    
    return maxScore > 0 ? maxStyle : 'balanced';
  }
  
  /**
   * Calculate layout density (0-1, sparse to dense)
   */
  calculateDensity(html: string, document: Document): number {
    const contentTags = document.querySelectorAll('div, section, article, aside, nav').length;
    const pageLength = html.length;
    
    // Density = content elements per 1000 chars
    const density = contentTags / (pageLength / 1000);
    
    // Normalize to 0-1 scale (assuming 10 elements per 1000 chars is very dense)
    return Math.min(density / 10, 1.0);
  }
  
  /**
   * Extract color palette
   */
  extractColors(html: string): string[] {
    const hexColors = html.match(/#[0-9a-fA-F]{6}/g) || [];
    const uniqueColors = Array.from(new Set(hexColors));
    return uniqueColors.slice(0, 10); // Return up to 10 colors
  }
  
  /**
   * Detect typography style
   */
  detectTypographyStyle(html: string): string {
    const htmlLower = html.toLowerCase();
    
    if (htmlLower.includes('serif') && !htmlLower.includes('sans-serif')) {
      return 'serif';
    }
    if (htmlLower.includes('monospace')) {
      return 'monospace';
    }
    if (htmlLower.includes('cursive')) {
      return 'cursive';
    }
    
    return 'sans-serif'; // Default
  }
  
  /**
   * Detect page type
   */
  detectPageType(html: string, document: Document): PageType {
    const htmlLower = html.toLowerCase();
    const title = document.title.toLowerCase();
    
    // Landing page indicators
    if (htmlLower.includes('hero') || htmlLower.includes('cta') || 
        htmlLower.includes('get started') || htmlLower.includes('sign up')) {
      return 'landing';
    }
    
    // Product page indicators
    if (htmlLower.includes('add to cart') || htmlLower.includes('buy now') ||
        htmlLower.includes('price') || htmlLower.includes('product')) {
      return 'product';
    }
    
    // Checkout indicators
    if (htmlLower.includes('checkout') || htmlLower.includes('payment') ||
        htmlLower.includes('billing')) {
      return 'checkout';
    }
    
    // Article indicators
    if (document.querySelector('article') || 
        htmlLower.includes('published') || htmlLower.includes('author')) {
      return 'article';
    }
    
    // Blog indicators
    if (htmlLower.includes('blog') || htmlLower.includes('post')) {
      return 'blog';
    }
    
    // Documentation indicators
    if (htmlLower.includes('documentation') || htmlLower.includes('api') ||
        htmlLower.includes('reference')) {
      return 'documentation';
    }
    
    // Dashboard indicators
    if (htmlLower.includes('dashboard') || htmlLower.includes('analytics') ||
        document.querySelectorAll('.widget, .panel, .card').length > 6) {
      return 'dashboard';
    }
    
    // Portfolio indicators
    if (htmlLower.includes('portfolio') || htmlLower.includes('showcase') ||
        document.querySelectorAll('img').length > 10) {
      return 'portfolio';
    }
    
    return 'unknown';
  }
  
  /**
   * Detect page intent
   */
  detectPageIntent(html: string, document: Document): PageIntent {
    const htmlLower = html.toLowerCase();
    
    // Conversion intent
    const conversionKeywords = ['book', 'buy', 'subscribe', 'sign up', 'pricing', 'charter', 'reserve', 'purchase'];
    if (conversionKeywords.some(kw => htmlLower.includes(kw))) {
      return 'conversion';
    }
    
    // Information intent
    const infoKeywords = ['about', 'learn', 'guide', 'documentation', 'information', 'help'];
    if (infoKeywords.some(kw => htmlLower.includes(kw))) {
      return 'information';
    }
    
    // Entertainment intent
    const entertainmentKeywords = ['gallery', 'showcase', 'portfolio', 'explore', 'discover'];
    if (entertainmentKeywords.some(kw => htmlLower.includes(kw))) {
      return 'entertainment';
    }
    
    // Utility intent
    const utilityKeywords = ['tool', 'calculator', 'converter', 'generator'];
    if (utilityKeywords.some(kw => htmlLower.includes(kw))) {
      return 'utility';
    }
    
    // Education intent
    const educationKeywords = ['course', 'tutorial', 'lesson', 'training'];
    if (educationKeywords.some(kw => htmlLower.includes(kw))) {
      return 'education';
    }
    
    return 'engagement'; // Default
  }
  
  /**
   * Find primary action buttons/links
   */
  findPrimaryActions(document: Document): string[] {
    const actions: string[] = [];
    
    // Look for CTAs
    const buttons = document.querySelectorAll('button, .btn, .cta, [role="button"]');
    buttons.forEach(btn => {
      const text = btn.textContent?.trim();
      if (text && text.length < 50) {
        actions.push(text);
      }
    });
    
    return actions.slice(0, 5); // Top 5 actions
  }
  
  /**
   * Count interactive elements
   */
  countInteractiveElements(document: Document): number {
    const selectors = [
      'button',
      'a',
      'input',
      'select',
      'textarea',
      '[onclick]',
      '[role="button"]',
      '.btn'
    ];
    
    let count = 0;
    selectors.forEach(selector => {
      count += document.querySelectorAll(selector).length;
    });
    
    return count;
  }
  
  /**
   * Detect existing UX patterns
   */
  detectExistingPatterns(html: string): string[] {
    const patterns: string[] = [];
    const htmlLower = html.toLowerCase();
    
    if (htmlLower.includes('transition')) patterns.push('transitions');
    if (htmlLower.includes('transform')) patterns.push('transforms');
    if (htmlLower.includes('@keyframes') || htmlLower.includes('animation')) patterns.push('animations');
    if (htmlLower.includes('box-shadow')) patterns.push('shadows');
    if (htmlLower.includes(':hover')) patterns.push('hover_states');
    if (htmlLower.includes('gradient')) patterns.push('gradients');
    if (htmlLower.includes('backdrop-filter')) patterns.push('backdrop_filters');
    
    return patterns;
  }
  
  /**
   * Estimate accessibility score (0-100)
   */
  estimateAccessibilityScore(document: Document): number {
    let score = 100;
    
    // Check for images without alt text
    const imagesWithoutAlt = Array.from(document.querySelectorAll('img')).filter(
      img => !img.getAttribute('alt')
    );
    score -= imagesWithoutAlt.length * 2;
    
    // Check for form inputs without labels
    const inputsWithoutLabels = Array.from(document.querySelectorAll('input')).filter(
      input => {
        const id = input.getAttribute('id');
        return !id || !document.querySelector(`label[for="${id}"]`);
      }
    );
    score -= inputsWithoutLabels.length * 3;
    
    // Check for missing heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) score -= 10;
    
    // Check for missing landmarks
    const landmarks = document.querySelectorAll('main, nav, header, footer');
    if (landmarks.length < 2) score -= 5;
    
    return Math.max(score, 0);
  }
  
  /**
   * Find accessibility issues
   */
  findAccessibilityIssues(document: Document): string[] {
    const issues: string[] = [];
    
    // Images without alt
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length} images missing alt text`);
    }
    
    // Inputs without labels
    const inputs = Array.from(document.querySelectorAll('input'));
    const inputsWithoutLabels = inputs.filter(input => {
      const id = input.getAttribute('id');
      return !id || !document.querySelector(`label[for="${id}"]`);
    });
    if (inputsWithoutLabels.length > 0) {
      issues.push(`${inputsWithoutLabels.length} form inputs missing labels`);
    }
    
    // Missing heading
    if (!document.querySelector('h1')) {
      issues.push('Missing h1 heading');
    }
    
    // Missing landmarks
    if (!document.querySelector('main')) {
      issues.push('Missing main landmark');
    }
    
    return issues;
  }
  
  /**
   * Recommend focus areas
   */
  recommendFocusAreas(document: Document): string[] {
    const recommendations: string[] = [];
    
    const buttons = document.querySelectorAll('button, .btn').length;
    const forms = document.querySelectorAll('form, input').length;
    const cards = document.querySelectorAll('.card, article').length;
    const links = document.querySelectorAll('a').length;
    
    if (buttons > 3) recommendations.push('Button interactions');
    if (forms > 2) recommendations.push('Form UX');
    if (cards > 4) recommendations.push('Card elevations');
    if (links > 10) recommendations.push('Link styling');
    
    return recommendations;
  }
}

export default ContextAnalyzer;
