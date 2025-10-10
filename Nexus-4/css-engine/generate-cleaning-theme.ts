/**
 * Generate Cleaning Website Theme
 * Using the CSS Engine with fresh, clean design concept
 */

import { DesignSystemArchitect } from './specialists/DesignSystemArchitect.js';
import { writeFileSync } from 'fs';

console.log('🧹 Generating Cleaning Website Theme with CSS Engine\n');

const architect = new DesignSystemArchitect();

// Design concept: Fresh, clean, professional
const designDNA = {
  colors: ['#10b981'],  // Fresh green - cleanliness, freshness, eco-friendly
  constraints: {
    baseTypePx: 16,
    typeRatio: 'perfectFourth' as const,  // 1.333 for clean hierarchy
    baseSpacePx: 8,
  }
};

const system = await architect.run(designDNA, {
  budgetMs: 200,
  accessibilityTarget: 'AAA' as const,
  reducedMotion: false,
});

console.log('✅ Cleaning Theme Generated!\n');
console.log('📊 Statistics:');
console.log('  Colors:', Object.keys(system.tokens.color).length);
console.log('  Typography:', Object.keys(system.tokens.typography).length);
console.log('  Spacing:', Object.keys(system.tokens.spacing).length);
console.log('  Performance:', system.diagnostics.timings.total.toFixed(2), 'ms');
console.log('');

// Save theme
const themeData = {
  generated: new Date().toISOString(),
  concept: 'Fresh & Clean Professional Cleaning Services',
  colors: designDNA.colors,
  tokens: system.tokens,
  css: system.css,
  diagnostics: system.diagnostics
};

writeFileSync('../cleaning-theme.json', JSON.stringify(themeData, null, 2));
writeFileSync('../cleaning-theme.css', system.css);

console.log('💾 Saved:');
console.log('  cleaning-theme.json - Complete theme data');
console.log('  cleaning-theme.css - Generated CSS');
console.log('');

console.log('🎨 Sample Colors:');
console.log('  Primary-500:', system.tokens.color['primary-500']);
console.log('  Primary-100:', system.tokens.color['primary-100']);
console.log('  Primary-900:', system.tokens.color['primary-900']);
console.log('');

console.log('✨ Ready to build the cleaning website!');
