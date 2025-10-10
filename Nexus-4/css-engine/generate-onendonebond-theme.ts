/**
 * Generate One N Done Bond Clean Theme
 * Based on screenshot: Dark navy blue theme, professional, move-out focused
 */

import { DesignSystemArchitect } from './specialists/DesignSystemArchitect.js';
import { writeFileSync } from 'fs';

console.log('🧹 Generating One N Done Bond Clean Theme\n');

const architect = new DesignSystemArchitect();

// Design from screenshot: Dark navy blue with cyan accents
const designDNA = {
  colors: ['#0891b2'],  // Cyan/teal from the CTA button in screenshot
  constraints: {
    baseTypePx: 16,
    typeRatio: 'perfectFourth' as const,
    baseSpacePx: 8,
  }
};

const system = await architect.run(designDNA, {
  budgetMs: 200,
  accessibilityTarget: 'AAA' as const,
  reducedMotion: false,
});

console.log('✅ One N Done Theme Generated!\n');
console.log('📊 Statistics:');
console.log('  Primary Color (Cyan):', system.tokens.color['primary-500']);
console.log('  Performance:', system.diagnostics.timings.total.toFixed(2), 'ms');

writeFileSync('../onendonebond-theme.json', JSON.stringify({ generated: new Date().toISOString(), tokens: system.tokens, css: system.css }, null, 2));
writeFileSync('../onendonebond-theme.css', system.css);

console.log('\n✨ Ready to build One N Done Bond Clean website!');
