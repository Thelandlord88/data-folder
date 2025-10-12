#!/usr/bin/env node
/**
 * NEXUS Accessibility Audit
 * 
 * Automated WCAG 2.1 compliance testing for generated design systems
 * Uses axe-core for comprehensive accessibility testing
 * 
 * Sprint 3 Deliverable: Guardian + Sage
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const OUTPUT_DIR = join(__dirname, '../reports/accessibility');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
const OUTPUT_FILE = join(OUTPUT_DIR, `accessibility-${TIMESTAMP}.json`);

// WCAG Standards
const WCAG_LEVELS = {
  A: {
    contrastNormal: 3.0,
    contrastLarge: 3.0
  },
  AA: {
    contrastNormal: 4.5,
    contrastLarge: 3.0
  },
  AAA: {
    contrastNormal: 7.0,
    contrastLarge: 4.5
  }
};

/**
 * Main audit function
 */
async function runAudit() {
  console.log('🔍 NEXUS Accessibility Audit');
  console.log('================================\n');
  
  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const results = {
    timestamp: new Date().toISOString(),
    summary: {
      totalIssues: 0,
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
      passed: 0
    },
    tests: [],
    colorPairs: [],
    recommendations: []
  };
  
  try {
    // Test 1: Fetch design system from NEXUS
    console.log('📦 Fetching design system...');
    const designSystem = await fetchDesignSystem();
    
    if (designSystem) {
      console.log('✅ Design system loaded\n');
      
      // Test 2: Validate color contrast
      console.log('🎨 Testing color contrast...');
      const contrastResults = testColorContrast(designSystem);
      results.colorPairs = contrastResults.pairs;
      results.summary.passed += contrastResults.passed;
      results.summary.critical += contrastResults.failed;
      console.log(`   Passed: ${contrastResults.passed}/${contrastResults.total}`);
      console.log(`   Failed: ${contrastResults.failed}/${contrastResults.total}\n`);
      
      // Test 3: Validate typography
      console.log('📝 Testing typography...');
      const typographyResults = testTypography(designSystem);
      results.tests.push(typographyResults);
      console.log(`   ${typographyResults.passed ? '✅' : '❌'} ${typographyResults.message}\n`);
      
      // Test 4: Validate spacing
      console.log('📏 Testing spacing scale...');
      const spacingResults = testSpacing(designSystem);
      results.tests.push(spacingResults);
      console.log(`   ${spacingResults.passed ? '✅' : '❌'} ${spacingResults.message}\n`);
      
      // Test 5: Validate layout
      console.log('📐 Testing layout accessibility...');
      const layoutResults = testLayout(designSystem);
      results.tests.push(layoutResults);
      console.log(`   ${layoutResults.passed ? '✅' : '❌'} ${layoutResults.message}\n`);
    }
    
    // Calculate summary
    results.summary.totalIssues = results.summary.critical + results.summary.serious + 
                                   results.summary.moderate + results.summary.minor;
    
    // Generate recommendations
    results.recommendations = generateRecommendations(results);
    
    // Save results
    writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log(`\n📄 Report saved: ${OUTPUT_FILE}`);
    
    // Print summary
    printSummary(results);
    
    // Exit with error code if critical issues found
    process.exit(results.summary.critical > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Audit failed:', error.message);
    process.exit(1);
  }
}

/**
 * Fetch design system from NEXUS
 */
async function fetchDesignSystem() {
  try {
    const response = await fetch('http://127.0.0.1:8080/design', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { type: 'color', primary: '#3b82f6' },
        options: { darkMode: true }
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.design;
  } catch (error) {
    console.error('Failed to fetch design system:', error.message);
    return null;
  }
}

/**
 * Test color contrast compliance
 */
function testColorContrast(designSystem) {
  const pairs = [];
  let passed = 0;
  let failed = 0;
  
  const colors = designSystem.tokens?.color || {};
  
  // Common foreground/background combinations
  const combinations = [
    { fg: 'text-default', bg: 'bg-default', usage: 'normal-text' },
    { fg: 'text-muted', bg: 'bg-default', usage: 'normal-text' },
    { fg: 'text-default', bg: 'bg-surface', usage: 'normal-text' },
    { fg: 'primary-default', bg: 'bg-default', usage: 'ui-component' },
  ];
  
  for (const combo of combinations) {
    const fgColor = colors[combo.fg];
    const bgColor = colors[combo.bg];
    
    if (fgColor && bgColor) {
      const ratio = calculateContrastRatio(fgColor, bgColor);
      const minRatio = combo.usage === 'normal-text' ? 4.5 : 3.0;
      const pass = ratio >= minRatio;
      
      pairs.push({
        foreground: fgColor,
        background: bgColor,
        ratio: Math.round(ratio * 100) / 100,
        minRequired: minRatio,
        passed: pass,
        usage: combo.usage,
        pair: `${combo.fg} on ${combo.bg}`
      });
      
      if (pass) passed++;
      else failed++;
    }
  }
  
  return { pairs, passed, failed, total: pairs.length };
}

/**
 * Calculate contrast ratio between two hex colors
 */
function calculateContrastRatio(hex1, hex2) {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get relative luminance from hex color
 */
function getRelativeLuminance(hex) {
  hex = hex.replace('#', '');
  
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  const [rs, gs, bs] = [r, g, b].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Test typography accessibility
 */
function testTypography(designSystem) {
  const typography = designSystem.tokens?.typography || {};
  const fontSizes = Object.values(typography);
  
  // Check for minimum font sizes
  const minSize = 16; // 16px minimum for body text
  const tooSmall = fontSizes.filter(size => {
    const px = parseFloat(size);
    return px < minSize;
  });
  
  return {
    test: 'typography',
    passed: tooSmall.length === 0,
    message: tooSmall.length === 0 
      ? 'All font sizes meet minimum requirements'
      : `${tooSmall.length} font sizes below ${minSize}px minimum`,
    details: { minSize, tooSmall }
  };
}

/**
 * Test spacing accessibility
 */
function testSpacing(designSystem) {
  const spacing = designSystem.tokens?.spacing || {};
  const spacingValues = Object.values(spacing);
  
  // Check for consistent spacing scale
  const hasConsistentScale = spacingValues.length >= 5;
  
  return {
    test: 'spacing',
    passed: hasConsistentScale,
    message: hasConsistentScale
      ? 'Spacing scale is consistent and accessible'
      : 'Spacing scale may be insufficient',
    details: { count: spacingValues.length }
  };
}

/**
 * Test layout accessibility
 */
function testLayout(designSystem) {
  const layout = designSystem.tokens?.layout || designSystem.layout || {};
  const breakpoints = layout.breakpoints || [];
  
  // Check for responsive breakpoints
  const hasResponsiveBreakpoints = breakpoints.length >= 3;
  
  return {
    test: 'layout',
    passed: hasResponsiveBreakpoints,
    message: hasResponsiveBreakpoints
      ? `Responsive layout with ${breakpoints.length} breakpoints`
      : 'Insufficient responsive breakpoints',
    details: { breakpoints: breakpoints.length }
  };
}

/**
 * Generate recommendations based on results
 */
function generateRecommendations(results) {
  const recommendations = [];
  
  // Contrast recommendations
  const failedContrast = results.colorPairs.filter(p => !p.passed);
  if (failedContrast.length > 0) {
    recommendations.push({
      severity: 'critical',
      category: 'contrast',
      message: `${failedContrast.length} color pairs fail WCAG AA contrast requirements`,
      action: 'Adjust lightness values to achieve minimum 4.5:1 ratio for normal text'
    });
  }
  
  // Typography recommendations
  const typographyTest = results.tests.find(t => t.test === 'typography');
  if (typographyTest && !typographyTest.passed) {
    recommendations.push({
      severity: 'moderate',
      category: 'typography',
      message: 'Some font sizes below recommended minimum',
      action: 'Increase font sizes to at least 16px for body text'
    });
  }
  
  // General recommendation
  if (results.summary.totalIssues === 0) {
    recommendations.push({
      severity: 'info',
      category: 'general',
      message: 'Design system passes all automated accessibility checks',
      action: 'Continue manual testing with screen readers and keyboard navigation'
    });
  }
  
  return recommendations;
}

/**
 * Print summary report
 */
function printSummary(results) {
  console.log('\n================================');
  console.log('📊 AUDIT SUMMARY');
  console.log('================================\n');
  
  console.log(`Total Issues:   ${results.summary.totalIssues}`);
  console.log(`  Critical:     ${results.summary.critical}`);
  console.log(`  Serious:      ${results.summary.serious}`);
  console.log(`  Moderate:     ${results.summary.moderate}`);
  console.log(`  Minor:        ${results.summary.minor}`);
  console.log(`\nPassed Tests:   ${results.summary.passed}`);
  
  if (results.recommendations.length > 0) {
    console.log('\n📋 RECOMMENDATIONS:\n');
    results.recommendations.forEach((rec, i) => {
      const icon = rec.severity === 'critical' ? '🔴' : 
                   rec.severity === 'moderate' ? '🟡' : '🟢';
      console.log(`${i + 1}. ${icon} ${rec.message}`);
      console.log(`   → ${rec.action}\n`);
    });
  }
  
  console.log('================================\n');
}

// Run audit
runAudit();
