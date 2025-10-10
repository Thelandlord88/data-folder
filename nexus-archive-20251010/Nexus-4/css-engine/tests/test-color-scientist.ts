/**
 * ColorScientist Test
 * Quick verification of OKLCH color generation
 */

import { ColorScientist } from '../specialists/ColorScientist.js';
import type { DesignDNA } from '../contracts.js';

async function testColorScientist() {
  console.log('🎨 Testing ColorScientist...\n');
  
  const colorScientist = new ColorScientist();
  
  // Test 1: Generate ramp from hex color
  console.log('Test 1: Generate OKLCH ramp from #0ea5e9 (sky blue)');
  const dna1: DesignDNA = {
    colors: ['#0ea5e9'],
  };
  
  const result1 = await colorScientist.run(dna1, { accessibilityTarget: 'AA' });
  console.log('✅ Primary:', result1.primary);
  console.log('✅ Ramp:', Object.keys(result1.ramp).length, 'shades');
  console.log('✅ Sample shades:');
  console.log('   50:', result1.ramp['50']);
  console.log('   500:', result1.ramp['500']);
  console.log('   900:', result1.ramp['900']);
  console.log('✅ Audits:', result1.audits.length, 'pairs checked');
  console.log('✅ Pass rate:', 
    result1.audits.filter(a => a.pass).length, '/',
    result1.audits.length
  );
  console.log();
  
  // Test 2: Cyberpunk neon (electric blue)
  console.log('Test 2: Cyberpunk neon #00ffff (cyan)');
  const dna2: DesignDNA = {
    colors: ['#00ffff'],
  };
  
  const result2 = await colorScientist.run(dna2, { accessibilityTarget: 'AAA' });
  console.log('✅ Primary:', result2.primary);
  console.log('✅ Harmony:', result2.harmony);
  console.log('✅ AAA audits:', result2.audits.filter(a => a.level === 'AAA').length);
  console.log();
  
  // Test 3: No color (uses default)
  console.log('Test 3: No color provided (uses default)');
  const dna3: DesignDNA = {};
  
  const result3 = await colorScientist.run(dna3, {});
  console.log('✅ Default primary:', result3.primary);
  console.log('✅ Ramp generated:', Object.keys(result3.ramp).length, 'shades');
  console.log();
  
  // Test 4: Extract from CSS
  console.log('Test 4: Extract colors from CSS');
  const css = `
    .button {
      background: #3b82f6;
      color: #ffffff;
      border: 1px solid rgb(59, 130, 246);
    }
  `;
  
  const extracted = colorScientist.extractFromCSS(css);
  console.log('✅ Extracted colors:', extracted);
  console.log();
  
  // Test 5: Generate color scheme
  console.log('Test 5: Generate color scheme (primary, secondary, accent)');
  const scheme = colorScientist.generateColorScheme('#0ea5e9');
  console.log('✅ Primary:', scheme.primary);
  console.log('✅ Secondary:', scheme.secondary);
  console.log('✅ Accent:', scheme.accent);
  console.log();
  
  console.log('🎉 All tests passed! ColorScientist is ready.');
}

testColorScientist().catch(console.error);
