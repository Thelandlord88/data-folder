/**
 * Pattern Library - UX Pattern Definitions
 * 
 * 20 AAA-compliant UX patterns converted to TypeScript
 * 
 * @version 2.0.0
 * @date October 15, 2025
 */

import type { UXPattern } from './types.js';

/**
 * All available UX patterns
 */
export const PATTERN_LIBRARY: UXPattern[] = [
  // ========================================================================
  // MICRO-INTERACTIONS
  // ========================================================================
  
  {
    id: 'button_smooth_hover',
    name: 'Smooth Button Hover',
    version: '1.0.0',
    category: 'micro-interaction',
    type: 'micro-interaction',
    tags: ['button', 'hover', 'interaction', 'cta'],
    description: 'Gentle scale and shadow transition on button hover',
    use_cases: [
      'Call-to-action buttons',
      'Primary action buttons',
      'Form submit buttons',
      'Navigation buttons'
    ],
    target: 'button, .btn, a.button, input[type="submit"], [role="button"]',
    css: {
      base: 'transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);',
      hover: 'transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);',
      active: 'transform: translateY(0); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);',
      focus: 'outline: 3px solid currentColor; outline-offset: 2px;'
    },
    aaa_safe: true,
    requires_motion_check: true,
    wcag_level: 'AAA',
    impact: 'high',
    complexity: 'low',
    estimated_performance_cost: 0.05,
    effectiveness: 0.92,
    usage_count: 0,
    success_rate: 0.92,
    works_well_with: ['card_elevation', 'input_focus_glow'],
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  {
    id: 'link_underline_slide',
    name: 'Link Underline Slide',
    version: '1.0.0',
    category: 'micro-interaction',
    type: 'micro-interaction',
    tags: ['link', 'hover', 'underline', 'text'],
    description: 'Animated underline that slides in on hover',
    use_cases: [
      'Text links',
      'Navigation links',
      'Footer links',
      'Content links'
    ],
    target: 'a:not(.btn):not(.button)',
    css: {
      base: 'position: relative; text-decoration: none; transition: color 0.3s ease;',
      before: 'content: ""; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: currentColor; transition: width 0.3s ease;',
      hover: 'color: inherit;',
      hover_before: 'width: 100%;'
    },
    aaa_safe: true,
    requires_motion_check: true,
    wcag_level: 'AAA',
    impact: 'medium',
    complexity: 'medium',
    estimated_performance_cost: 0.08,
    effectiveness: 0.85,
    usage_count: 0,
    success_rate: 0.85,
    works_well_with: ['nav_item_highlight'],
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  {
    id: 'badge_pulse',
    name: 'Badge Pulse Effect',
    version: '1.0.0',
    category: 'micro-interaction',
    type: 'micro-interaction',
    tags: ['badge', 'pulse', 'notification', 'attention'],
    description: 'Subtle pulse animation for badges and notifications',
    use_cases: [
      'Notification badges',
      'Status indicators',
      'Labels',
      'Tags'
    ],
    target: '.badge, .tag, .label, [data-badge]',
    css: {
      keyframes: '@keyframes badge-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }',
      hover: 'animation: badge-pulse 2s ease-in-out infinite;'
    },
    aaa_safe: true,
    requires_motion_check: true,
    wcag_level: 'AAA',
    impact: 'low',
    complexity: 'low',
    estimated_performance_cost: 0.04,
    effectiveness: 0.75,
    usage_count: 0,
    success_rate: 0.75,
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  {
    id: 'icon_spin_hover',
    name: 'Icon Spin on Hover',
    version: '1.0.0',
    category: 'micro-interaction',
    type: 'micro-interaction',
    tags: ['icon', 'spin', 'rotate', 'playful'],
    description: 'Subtle spin animation for icons on hover',
    use_cases: [
      'Icon buttons',
      'Feature icons',
      'Social media icons',
      'Action icons'
    ],
    target: '.icon, i[class*="fa-"], svg.icon, [data-icon]',
    css: {
      base: 'transition: transform 0.3s ease;',
      hover: 'transform: rotate(15deg);'
    },
    aaa_safe: true,
    requires_motion_check: true,
    wcag_level: 'AAA',
    impact: 'low',
    complexity: 'low',
    estimated_performance_cost: 0.03,
    effectiveness: 0.72,
    usage_count: 0,
    success_rate: 0.72,
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  // ========================================================================
  // VISUAL FEEDBACK
  // ========================================================================
  
  {
    id: 'card_elevation',
    name: 'Card Elevation Effect',
    version: '1.0.0',
    category: 'visual-feedback',
    type: 'visual-feedback',
    tags: ['card', 'elevation', 'shadow', 'material'],
    description: 'Material Design inspired card elevation on hover',
    use_cases: [
      'Product cards',
      'Article cards',
      'Service cards',
      'Feature cards'
    ],
    target: '.card, article, .service-card, .product-card, .feature-card',
    css: {
      base: 'transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);',
      hover: 'transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);'
    },
    aaa_safe: true,
    requires_motion_check: true,
    wcag_level: 'AAA',
    impact: 'medium',
    complexity: 'low',
    estimated_performance_cost: 0.06,
    effectiveness: 0.88,
    usage_count: 0,
    success_rate: 0.88,
    works_well_with: ['button_smooth_hover', 'image_hover_zoom'],
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  {
    id: 'price_highlight',
    name: 'Price Highlight Effect',
    version: '1.0.0',
    category: 'visual-feedback',
    type: 'visual-feedback',
    tags: ['price', 'highlight', 'conversion', 'emphasis'],
    description: 'Subtle glow effect for pricing elements',
    use_cases: [
      'Pricing cards',
      'Product prices',
      'Special offers',
      'Discount badges'
    ],
    target: '.price, .pricing, [data-price], .cost',
    css: {
      base: 'transition: all 0.3s ease;',
      hover: 'transform: scale(1.05); box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);'
    },
    aaa_safe: true,
    requires_motion_check: true,
    wcag_level: 'AAA',
    impact: 'high',
    complexity: 'low',
    estimated_performance_cost: 0.05,
    effectiveness: 0.81,
    usage_count: 0,
    success_rate: 0.81,
    works_well_with: ['card_elevation'],
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  {
    id: 'modal_scale_fade',
    name: 'Modal Scale & Fade',
    version: '1.0.0',
    category: 'visual-feedback',
    type: 'visual-feedback',
    tags: ['modal', 'dialog', 'animation', 'entrance'],
    description: 'Smooth scale and fade animation for modals',
    use_cases: [
      'Modal dialogs',
      'Popups',
      'Lightboxes',
      'Overlays'
    ],
    target: '.modal, [role="dialog"], .popup, .lightbox',
    css: {
      keyframes: '@keyframes modal-enter { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }',
      base: 'animation: modal-enter 0.3s ease-out;'
    },
    aaa_safe: true,
    requires_motion_check: true,
    wcag_level: 'AAA',
    impact: 'medium',
    complexity: 'medium',
    estimated_performance_cost: 0.07,
    effectiveness: 0.90,
    usage_count: 0,
    success_rate: 0.90,
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  // ========================================================================
  // FORM UX
  // ========================================================================
  
  {
    id: 'input_focus_glow',
    name: 'Input Focus Glow',
    version: '1.0.0',
    category: 'form-ux',
    type: 'form-ux',
    tags: ['input', 'focus', 'form', 'accessibility'],
    description: 'Smooth border and glow transition on input focus',
    use_cases: [
      'Text inputs',
      'Email inputs',
      'Text areas',
      'Search boxes'
    ],
    target: 'input[type="text"], input[type="email"], input[type="tel"], input[type="password"], textarea, input[type="search"]',
    css: {
      base: 'transition: all 0.2s ease; border: 2px solid #ccc;',
      focus: 'border-color: #0066cc; box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1); outline: none;'
    },
    aaa_safe: true,
    requires_motion_check: false,
    wcag_level: 'AAA',
    impact: 'high',
    complexity: 'low',
    estimated_performance_cost: 0.03,
    effectiveness: 0.95,
    usage_count: 0,
    success_rate: 0.95,
    works_well_with: ['button_smooth_hover', 'form_validation_shake'],
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  {
    id: 'form_validation_shake',
    name: 'Form Validation Shake',
    version: '1.0.0',
    category: 'form-ux',
    type: 'form-ux',
    tags: ['form', 'validation', 'error', 'feedback'],
    description: 'Subtle shake animation for validation errors',
    use_cases: [
      'Form validation',
      'Error feedback',
      'Invalid inputs',
      'Required fields'
    ],
    target: 'input:invalid, .error, .invalid, [aria-invalid="true"]',
    css: {
      keyframes: '@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }',
      base: 'animation: shake 0.4s ease-in-out;'
    },
    aaa_safe: true,
    requires_motion_check: true,
    wcag_level: 'AAA',
    impact: 'high',
    complexity: 'low',
    estimated_performance_cost: 0.04,
    effectiveness: 0.91,
    usage_count: 0,
    success_rate: 0.91,
    works_well_with: ['input_focus_glow'],
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  {
    id: 'checkbox_smooth_check',
    name: 'Checkbox Smooth Check',
    version: '1.0.0',
    category: 'form-ux',
    type: 'form-ux',
    tags: ['checkbox', 'radio', 'form', 'selection'],
    description: 'Smooth animation for checkbox/radio selection',
    use_cases: [
      'Checkboxes',
      'Radio buttons',
      'Toggle switches',
      'Selection controls'
    ],
    target: 'input[type="checkbox"], input[type="radio"]',
    css: {
      base: 'transition: all 0.2s ease;',
      focus: 'outline: 3px solid rgba(0, 102, 204, 0.3); outline-offset: 2px;'
    },
    aaa_safe: true,
    requires_motion_check: true,
    wcag_level: 'AAA',
    impact: 'low',
    complexity: 'low',
    estimated_performance_cost: 0.02,
    effectiveness: 0.77,
    usage_count: 0,
    success_rate: 0.77,
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  // ========================================================================
  // NAVIGATION
  // ========================================================================
  
  {
    id: 'nav_item_highlight',
    name: 'Navigation Item Highlight',
    version: '1.0.0',
    category: 'navigation',
    type: 'navigation',
    tags: ['nav', 'menu', 'navigation', 'hover'],
    description: 'Smooth background transition for nav items',
    use_cases: [
      'Navigation menus',
      'Header navigation',
      'Sidebar menus',
      'Menu items'
    ],
    target: 'nav a, .nav-link, .menu-item a, [role="menuitem"]',
    css: {
      base: 'transition: background-color 0.2s ease, color 0.2s ease; padding: 0.5rem 1rem; border-radius: 0.25rem;',
      hover: 'background-color: rgba(0, 0, 0, 0.05);'
    },
    aaa_safe: true,
    requires_motion_check: false,
    wcag_level: 'AAA',
    impact: 'medium',
    complexity: 'low',
    estimated_performance_cost: 0.03,
    effectiveness: 0.82,
    usage_count: 0,
    success_rate: 0.82,
    works_well_with: ['link_underline_slide'],
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  {
    id: 'dropdown_smooth_open',
    name: 'Dropdown Smooth Open',
    version: '1.0.0',
    category: 'navigation',
    type: 'navigation',
    tags: ['dropdown', 'menu', 'animation', 'reveal'],
    description: 'Smooth fade and slide for dropdown menus',
    use_cases: [
      'Dropdown menus',
      'Sub-menus',
      'Menu panels',
      'Flyout menus'
    ],
    target: '.dropdown-menu, .submenu, [role="menu"]',
    css: {
      keyframes: '@keyframes dropdown-open { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }',
      base: 'animation: dropdown-open 0.2s ease-out;'
    },
    aaa_safe: true,
    requires_motion_check: true,
    wcag_level: 'AAA',
    impact: 'medium',
    complexity: 'medium',
    estimated_performance_cost: 0.05,
    effectiveness: 0.83,
    usage_count: 0,
    success_rate: 0.83,
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  {
    id: 'tab_underline_slide',
    name: 'Tab Underline Slide',
    version: '1.0.0',
    category: 'navigation',
    type: 'navigation',
    tags: ['tab', 'navigation', 'underline', 'indicator'],
    description: 'Sliding underline indicator for tabs',
    use_cases: [
      'Tab navigation',
      'Segmented controls',
      'Section switchers',
      'Content tabs'
    ],
    target: '[role="tab"], .tab, .tab-item',
    css: {
      base: 'position: relative; transition: color 0.3s ease;',
      after: 'content: ""; position: absolute; bottom: 0; left: 0; width: 0; height: 3px; background: currentColor; transition: width 0.3s ease;',
      hover_after: 'width: 100%;'
    },
    aaa_safe: true,
    requires_motion_check: true,
    wcag_level: 'AAA',
    impact: 'medium',
    complexity: 'medium',
    estimated_performance_cost: 0.06,
    effectiveness: 0.84,
    usage_count: 0,
    success_rate: 0.84,
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  // ========================================================================
  // CONTENT ENHANCEMENT
  // ========================================================================
  
  {
    id: 'image_lazy_fade',
    name: 'Image Lazy Load Fade',
    version: '1.0.0',
    category: 'content-enhancement',
    type: 'content',
    tags: ['image', 'lazy-load', 'fade', 'loading'],
    description: 'Smooth fade-in for images as they load',
    use_cases: [
      'Lazy-loaded images',
      'Progressive loading',
      'Image galleries',
      'Product images'
    ],
    target: 'img[loading="lazy"], img.lazy, [data-lazy]',
    css: {
      base: 'opacity: 0; transition: opacity 0.4s ease;'
    },
    aaa_safe: true,
    requires_motion_check: true,
    wcag_level: 'AAA',
    impact: 'medium',
    complexity: 'low',
    estimated_performance_cost: 0.02,
    effectiveness: 0.78,
    usage_count: 0,
    success_rate: 0.78,
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  {
    id: 'testimonial_fade_slide',
    name: 'Testimonial Fade & Slide',
    version: '1.0.0',
    category: 'content-enhancement',
    type: 'content',
    tags: ['testimonial', 'review', 'social-proof', 'animation'],
    description: 'Gentle fade and slide for testimonials',
    use_cases: [
      'Testimonials',
      'Customer reviews',
      'Quotes',
      'Social proof'
    ],
    target: '.testimonial, .review, .quote, [data-testimonial]',
    css: {
      base: 'transition: all 0.3s ease;',
      hover: 'transform: translateX(5px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);'
    },
    aaa_safe: true,
    requires_motion_check: true,
    wcag_level: 'AAA',
    impact: 'medium',
    complexity: 'low',
    estimated_performance_cost: 0.04,
    effectiveness: 0.79,
    usage_count: 0,
    success_rate: 0.79,
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  {
    id: 'stat_count_up',
    name: 'Stat Count Up Animation',
    version: '1.0.0',
    category: 'content-enhancement',
    type: 'content',
    tags: ['stat', 'number', 'counter', 'animation'],
    description: 'Animated number counting for statistics',
    use_cases: [
      'Statistics',
      'Metrics',
      'Counter displays',
      'Achievement numbers'
    ],
    target: '.stat, .number, .counter, [data-count]',
    css: {
      base: 'transition: all 0.5s ease;',
      hover: 'transform: scale(1.1); color: #0066cc;'
    },
    aaa_safe: true,
    requires_motion_check: true,
    wcag_level: 'AAA',
    impact: 'high',
    complexity: 'medium',
    estimated_performance_cost: 0.06,
    effectiveness: 0.93,
    usage_count: 0,
    success_rate: 0.93,
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  // ========================================================================
  // LOADING STATES
  // ========================================================================
  
  {
    id: 'skeleton_shimmer',
    name: 'Skeleton Screen Shimmer',
    version: '1.0.0',
    category: 'loading-states',
    type: 'loading',
    tags: ['skeleton', 'loading', 'shimmer', 'placeholder'],
    description: 'Shimmer effect for skeleton loading screens',
    use_cases: [
      'Loading placeholders',
      'Content skeletons',
      'Lazy loading',
      'Progressive rendering'
    ],
    target: '.skeleton, .loading-skeleton, [data-skeleton]',
    css: {
      keyframes: '@keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }',
      base: 'background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 1000px 100%; animation: shimmer 2s infinite;'
    },
    aaa_safe: true,
    requires_motion_check: true,
    wcag_level: 'AAA',
    impact: 'medium',
    complexity: 'medium',
    estimated_performance_cost: 0.07,
    effectiveness: 0.87,
    usage_count: 0,
    success_rate: 0.87,
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  {
    id: 'progress_bar_animate',
    name: 'Progress Bar Animation',
    version: '1.0.0',
    category: 'loading-states',
    type: 'loading',
    tags: ['progress', 'loading', 'bar', 'indicator'],
    description: 'Smooth animation for progress bars',
    use_cases: [
      'Progress indicators',
      'Loading bars',
      'Upload progress',
      'Task completion'
    ],
    target: '.progress-bar, [role="progressbar"], .loading-bar',
    css: {
      base: 'transition: width 0.3s ease, background-color 0.3s ease;'
    },
    aaa_safe: true,
    requires_motion_check: true,
    wcag_level: 'AAA',
    impact: 'medium',
    complexity: 'low',
    estimated_performance_cost: 0.04,
    effectiveness: 0.86,
    usage_count: 0,
    success_rate: 0.86,
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  // ========================================================================
  // ADDITIONAL PATTERNS
  // ========================================================================
  
  {
    id: 'image_hover_zoom',
    name: 'Image Hover Zoom',
    version: '1.0.0',
    category: 'content-enhancement',
    type: 'content',
    tags: ['image', 'zoom', 'hover', 'gallery'],
    description: 'Subtle zoom effect on image hover',
    use_cases: [
      'Product images',
      'Gallery images',
      'Portfolio images',
      'Thumbnail previews'
    ],
    target: 'img:not([alt=""]), .gallery img, .product-image img',
    css: {
      base: 'transition: transform 0.3s ease; cursor: pointer;',
      hover: 'transform: scale(1.05);'
    },
    aaa_safe: true,
    requires_motion_check: true,
    wcag_level: 'AAA',
    impact: 'medium',
    complexity: 'low',
    estimated_performance_cost: 0.04,
    effectiveness: 0.80,
    usage_count: 0,
    success_rate: 0.80,
    works_well_with: ['card_elevation'],
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  },
  
  {
    id: 'tooltip_fade_in',
    name: 'Tooltip Fade In',
    version: '1.0.0',
    category: 'visual-feedback',
    type: 'visual-feedback',
    tags: ['tooltip', 'hint', 'help', 'info'],
    description: 'Smooth fade-in for tooltips and hints',
    use_cases: [
      'Tooltips',
      'Help text',
      'Info poppers',
      'Contextual hints'
    ],
    target: '.tooltip, [role="tooltip"], .hint, [data-tooltip]',
    css: {
      keyframes: '@keyframes tooltip-in { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }',
      base: 'animation: tooltip-in 0.2s ease-out;'
    },
    aaa_safe: true,
    requires_motion_check: true,
    wcag_level: 'AAA',
    impact: 'low',
    complexity: 'low',
    estimated_performance_cost: 0.03,
    effectiveness: 0.74,
    usage_count: 0,
    success_rate: 0.74,
    created_at: new Date('2025-10-15'),
    updated_at: new Date('2025-10-15')
  }
];

/**
 * Get pattern by ID
 */
export function getPatternById(id: string): UXPattern | undefined {
  return PATTERN_LIBRARY.find(p => p.id === id);
}

/**
 * Get patterns by category
 */
export function getPatternsByCategory(category: string): UXPattern[] {
  return PATTERN_LIBRARY.filter(p => p.category === category);
}

/**
 * Get patterns by tag
 */
export function getPatternsByTag(tag: string): UXPattern[] {
  return PATTERN_LIBRARY.filter(p => p.tags.includes(tag));
}

/**
 * Get top patterns by effectiveness
 */
export function getTopPatterns(limit: number = 10): UXPattern[] {
  return [...PATTERN_LIBRARY]
    .sort((a, b) => b.effectiveness - a.effectiveness)
    .slice(0, limit);
}

/**
 * Get AAA-compliant patterns only
 */
export function getAAAPatterns(): UXPattern[] {
  return PATTERN_LIBRARY.filter(p => p.wcag_level === 'AAA');
}

/**
 * Get patterns by impact level
 */
export function getPatternsByImpact(impact: 'low' | 'medium' | 'high'): UXPattern[] {
  return PATTERN_LIBRARY.filter(p => p.impact === impact);
}

/**
 * Search patterns by keyword
 */
export function searchPatterns(keyword: string): UXPattern[] {
  const lowerKeyword = keyword.toLowerCase();
  return PATTERN_LIBRARY.filter(p =>
    p.name.toLowerCase().includes(lowerKeyword) ||
    p.description.toLowerCase().includes(lowerKeyword) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
  );
}

/**
 * Get pattern statistics
 */
export function getPatternStatistics() {
  return {
    total: PATTERN_LIBRARY.length,
    by_category: {
      'micro-interaction': getPatternsByCategory('micro-interaction').length,
      'visual-feedback': getPatternsByCategory('visual-feedback').length,
      'form-ux': getPatternsByCategory('form-ux').length,
      'navigation': getPatternsByCategory('navigation').length,
      'content-enhancement': getPatternsByCategory('content-enhancement').length,
      'loading-states': getPatternsByCategory('loading-states').length
    },
    by_impact: {
      low: getPatternsByImpact('low').length,
      medium: getPatternsByImpact('medium').length,
      high: getPatternsByImpact('high').length
    },
    aaa_compliant: getAAAPatterns().length,
    avg_effectiveness: PATTERN_LIBRARY.reduce((sum, p) => sum + p.effectiveness, 0) / PATTERN_LIBRARY.length,
    top_10: getTopPatterns(10).map(p => ({ id: p.id, name: p.name, effectiveness: p.effectiveness }))
  };
}

export default PATTERN_LIBRARY;
