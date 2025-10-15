/**
 * Opportunity Detector - Find enhancement opportunities in HTML
 * 
 * Scans HTML to detect elements that could benefit from UX patterns
 * 
 * @version 2.0.0
 */

import { JSDOM } from 'jsdom';
import type { OpportunityDetection } from './types.js';

export class OpportunityDetector {
  
  /**
   * Detect all enhancement opportunities in HTML
   */
  async detect(html: string): Promise<OpportunityDetection[]> {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    const opportunities: OpportunityDetection[] = [];
    
    // Detect button opportunities
    opportunities.push(...this.detectButtonOpportunities(document));
    
    // Detect form opportunities
    opportunities.push(...this.detectFormOpportunities(document));
    
    // Detect card opportunities
    opportunities.push(...this.detectCardOpportunities(document));
    
    // Detect link opportunities
    opportunities.push(...this.detectLinkOpportunities(document));
    
    // Detect navigation opportunities
    opportunities.push(...this.detectNavigationOpportunities(document));
    
    // Detect image opportunities
    opportunities.push(...this.detectImageOpportunities(document));
    
    // Detect interactive opportunities
    opportunities.push(...this.detectInteractiveOpportunities(document));
    
    return opportunities.filter(opp => opp.count > 0);
  }
  
  /**
   * Detect button enhancement opportunities
   */
  private detectButtonOpportunities(document: Document): OpportunityDetection[] {
    const opportunities: OpportunityDetection[] = [];
    
    const buttons = document.querySelectorAll('button, .btn, input[type="submit"], [role="button"]');
    
    if (buttons.length > 0) {
      opportunities.push({
        element_type: 'button',
        selector: 'button, .btn, input[type="submit"]',
        count: buttons.length,
        suggested_patterns: ['button_smooth_hover', 'button_press_effect'],
        priority: buttons.length > 3 ? 'high' : 'medium',
        reasoning: `${buttons.length} buttons detected. Hover feedback significantly improves perceived quality.`
      });
    }
    
    // Primary action buttons
    const primaryButtons = document.querySelectorAll('.btn-primary, .cta, button[type="submit"]');
    if (primaryButtons.length > 0) {
      opportunities.push({
        element_type: 'primary-button',
        selector: '.btn-primary, .cta, button[type="submit"]',
        count: primaryButtons.length,
        suggested_patterns: ['button_smooth_hover', 'button_glow_effect'],
        priority: 'high',
        reasoning: 'Primary action buttons benefit from prominent hover effects'
      });
    }
    
    return opportunities;
  }
  
  /**
   * Detect form enhancement opportunities
   */
  private detectFormOpportunities(document: Document): OpportunityDetection[] {
    const opportunities: OpportunityDetection[] = [];
    
    // Text inputs
    const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="tel"], textarea');
    if (textInputs.length > 0) {
      opportunities.push({
        element_type: 'text-input',
        selector: 'input[type="text"], input[type="email"], textarea',
        count: textInputs.length,
        suggested_patterns: ['input_focus_glow', 'input_smooth_transition'],
        priority: textInputs.length > 3 ? 'high' : 'medium',
        reasoning: `${textInputs.length} form inputs detected. Focus feedback is critical for form UX and accessibility.`
      });
    }
    
    // Select dropdowns
    const selects = document.querySelectorAll('select');
    if (selects.length > 0) {
      opportunities.push({
        element_type: 'select',
        selector: 'select',
        count: selects.length,
        suggested_patterns: ['dropdown_smooth_open'],
        priority: 'medium',
        reasoning: 'Dropdown animations improve perceived responsiveness'
      });
    }
    
    // Checkboxes and radios
    const checkboxes = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    if (checkboxes.length > 0) {
      opportunities.push({
        element_type: 'checkbox',
        selector: 'input[type="checkbox"], input[type="radio"]',
        count: checkboxes.length,
        suggested_patterns: ['checkbox_smooth_check'],
        priority: 'low',
        reasoning: 'Smooth check animations add polish'
      });
    }
    
    return opportunities;
  }
  
  /**
   * Detect card enhancement opportunities
   */
  private detectCardOpportunities(document: Document): OpportunityDetection[] {
    const opportunities: OpportunityDetection[] = [];
    
    const cards = document.querySelectorAll('.card, article, .service-card, .product-card, .feature-card');
    
    if (cards.length > 0) {
      opportunities.push({
        element_type: 'card',
        selector: '.card, article',
        count: cards.length,
        suggested_patterns: ['card_elevation', 'card_hover_lift'],
        priority: cards.length > 4 ? 'high' : 'medium',
        reasoning: `${cards.length} cards detected. Elevation effects create depth and interactivity.`
      });
    }
    
    // Product cards specifically
    const productCards = document.querySelectorAll('.product, .product-card, [data-product]');
    if (productCards.length > 0) {
      opportunities.push({
        element_type: 'product-card',
        selector: '.product-card, [data-product]',
        count: productCards.length,
        suggested_patterns: ['card_elevation', 'image_zoom_hover'],
        priority: 'high',
        reasoning: 'Product cards benefit from prominent hover effects to encourage interaction'
      });
    }
    
    return opportunities;
  }
  
  /**
   * Detect link enhancement opportunities
   */
  private detectLinkOpportunities(document: Document): OpportunityDetection[] {
    const opportunities: OpportunityDetection[] = [];
    
    // Regular links (excluding buttons)
    const links = Array.from(document.querySelectorAll('a')).filter(
      a => !a.classList.contains('btn') && !a.classList.contains('button')
    );
    
    if (links.length > 5) {
      opportunities.push({
        element_type: 'link',
        selector: 'a:not(.btn):not(.button)',
        count: links.length,
        suggested_patterns: ['link_underline_slide', 'link_color_transition'],
        priority: 'medium',
        reasoning: `${links.length} links detected. Animated underlines improve visual feedback.`
      });
    }
    
    return opportunities;
  }
  
  /**
   * Detect navigation enhancement opportunities
   */
  private detectNavigationOpportunities(document: Document): OpportunityDetection[] {
    const opportunities: OpportunityDetection[] = [];
    
    const navLinks = document.querySelectorAll('nav a, .nav-link, .menu-item a');
    
    if (navLinks.length > 0) {
      opportunities.push({
        element_type: 'nav-link',
        selector: 'nav a, .nav-link',
        count: navLinks.length,
        suggested_patterns: ['nav_item_highlight', 'nav_underline_slide'],
        priority: 'medium',
        reasoning: `${navLinks.length} navigation items detected. Clear hover states improve navigation UX.`
      });
    }
    
    // Dropdown menus
    const dropdowns = document.querySelectorAll('.dropdown, .menu-dropdown, [role="menu"]');
    if (dropdowns.length > 0) {
      opportunities.push({
        element_type: 'dropdown',
        selector: '.dropdown, [role="menu"]',
        count: dropdowns.length,
        suggested_patterns: ['dropdown_smooth_open', 'dropdown_fade_in'],
        priority: 'medium',
        reasoning: 'Smooth dropdown animations improve perceived performance'
      });
    }
    
    return opportunities;
  }
  
  /**
   * Detect image enhancement opportunities
   */
  private detectImageOpportunities(document: Document): OpportunityDetection[] {
    const opportunities: OpportunityDetection[] = [];
    
    const images = document.querySelectorAll('img');
    
    if (images.length > 5) {
      opportunities.push({
        element_type: 'image',
        selector: 'img',
        count: images.length,
        suggested_patterns: ['image_lazy_fade', 'image_hover_zoom'],
        priority: 'low',
        reasoning: `${images.length} images detected. Lazy load fades create smooth loading experience.`
      });
    }
    
    // Gallery images
    const galleryImages = document.querySelectorAll('.gallery img, .portfolio img, [data-gallery]');
    if (galleryImages.length > 0) {
      opportunities.push({
        element_type: 'gallery-image',
        selector: '.gallery img, .portfolio img',
        count: galleryImages.length,
        suggested_patterns: ['image_hover_zoom', 'image_overlay_fade'],
        priority: 'medium',
        reasoning: 'Gallery images benefit from zoom effects'
      });
    }
    
    return opportunities;
  }
  
  /**
   * Detect other interactive opportunities
   */
  private detectInteractiveOpportunities(document: Document): OpportunityDetection[] {
    const opportunities: OpportunityDetection[] = [];
    
    // Badges
    const badges = document.querySelectorAll('.badge, .tag, .label');
    if (badges.length > 0) {
      opportunities.push({
        element_type: 'badge',
        selector: '.badge, .tag',
        count: badges.length,
        suggested_patterns: ['badge_pulse'],
        priority: 'low',
        reasoning: 'Badge pulse effects add subtle engagement'
      });
    }
    
    // Icons
    const icons = document.querySelectorAll('.icon, i[class*="fa-"], svg[class*="icon"]');
    if (icons.length > 5) {
      opportunities.push({
        element_type: 'icon',
        selector: '.icon, i[class*="fa-"]',
        count: icons.length,
        suggested_patterns: ['icon_spin_hover', 'icon_bounce'],
        priority: 'low',
        reasoning: 'Icon animations add playfulness'
      });
    }
    
    // Testimonials
    const testimonials = document.querySelectorAll('.testimonial, .review, .quote');
    if (testimonials.length > 0) {
      opportunities.push({
        element_type: 'testimonial',
        selector: '.testimonial, .review',
        count: testimonials.length,
        suggested_patterns: ['testimonial_fade_slide'],
        priority: 'medium',
        reasoning: 'Testimonial animations draw attention to social proof'
      });
    }
    
    // Pricing cards
    const pricingCards = document.querySelectorAll('.price, .pricing-card, [data-price]');
    if (pricingCards.length > 0) {
      opportunities.push({
        element_type: 'price',
        selector: '.price, .pricing-card',
        count: pricingCards.length,
        suggested_patterns: ['price_highlight', 'price_pop'],
        priority: 'high',
        reasoning: 'Price highlighting increases conversion focus'
      });
    }
    
    // Stats/numbers
    const stats = document.querySelectorAll('.stat, .number, [data-count]');
    if (stats.length > 0) {
      opportunities.push({
        element_type: 'stat',
        selector: '.stat, .number',
        count: stats.length,
        suggested_patterns: ['stat_count_up'],
        priority: 'medium',
        reasoning: 'Count-up animations make statistics engaging'
      });
    }
    
    // Modals
    const modals = document.querySelectorAll('.modal, [role="dialog"]');
    if (modals.length > 0) {
      opportunities.push({
        element_type: 'modal',
        selector: '.modal, [role="dialog"]',
        count: modals.length,
        suggested_patterns: ['modal_scale_fade', 'modal_slide_up'],
        priority: 'medium',
        reasoning: 'Modal animations improve perceived performance'
      });
    }
    
    // Tabs
    const tabs = document.querySelectorAll('[role="tab"], .tab, .tab-item');
    if (tabs.length > 0) {
      opportunities.push({
        element_type: 'tab',
        selector: '[role="tab"], .tab',
        count: tabs.length,
        suggested_patterns: ['tab_underline_slide', 'tab_highlight'],
        priority: 'medium',
        reasoning: 'Tab animations improve navigation clarity'
      });
    }
    
    return opportunities;
  }
  
  /**
   * Count elements matching selector
   */
  findElements(html: string, selector: string): number {
    const dom = new JSDOM(html);
    return dom.window.document.querySelectorAll(selector).length;
  }
}

export default OpportunityDetector;
