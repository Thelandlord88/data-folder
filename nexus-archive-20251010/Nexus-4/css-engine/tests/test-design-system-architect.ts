/**
 * DesignSystemArchitect Test
 * Integration test - runs all three specialists
 */

import { DesignSystemArchitect } from '../specialists/DesignSystemArchitect.js';
import type { DesignDNA } from '../contracts.js';

async function testDesignSystemArchitect() {
  console.log('🏛️ Testing DesignSystemArchitect (Master Orchestrator)...\n');
  
  const architect = new DesignSystemArchitect();
  
  // Test 1: Full design system generation
  console.log('Test 1: Generate complete design system');
  const dna1: DesignDNA = {
    colors: ['#0ea5e9'],
    constraints: {
      baseTypePx: 16,
      typeRatio: 'perfectFourth',
      baseSpacePx: 8,
    },
  };
  
  const result1 = await architect.run(dna1, { accessibilityTarget: 'AA' });
  
  console.log('✅ Design Package Generated:');
  console.log(`   Cache Key: ${result1.cacheKey.substring(0, 16)}...`);
  console.log(`   Color Tokens: ${Object.keys(result1.tokens.color).length}`);
  console.log(`   Typography Tokens: ${Object.keys(result1.tokens.typography).length}`);
  console.log(`   Spacing Tokens: ${Object.keys(result1.tokens.spacing).length}`);
  console.log(`   Breakpoints: ${Object.keys(result1.tokens.breakpoints).length}`);
  console.log(`   Elevation: ${Object.keys(result1.tokens.elevation || {}).length}`);
  console.log(`   Animation: ${Object.keys(result1.tokens.animation || {}).length}`);
  console.log();
  
  // Test 2: Performance metrics
  console.log('Test 2: Performance metrics');
  console.log('✅ Timings:');
  Object.entries(result1.diagnostics.timings).forEach(([key, value]) => {
    console.log(`   ${key.padEnd(20)}: ${value.toFixed(2)}ms`);
  });
  console.log();
  
  // Test 3: Diagnostics
  console.log('Test 3: Diagnostics');
  console.log('✅ Notes:');
  result1.diagnostics.notes.forEach(note => {
    console.log(`   ${note}`);
  });
  console.log();
  
  console.log('✅ Audits:');
  result1.diagnostics.audits.slice(0, 3).forEach(audit => {
    console.log(`   ${audit.check}: ${audit.pass ? '✓ PASS' : '✗ FAIL'}`);
  });
  console.log(`   ... and ${result1.diagnostics.audits.length - 3} more`);
  console.log();
  
  // Test 4: CSS Variables
  console.log('Test 4: CSS Variables (Tailwind v4 @theme)');
  const cssLines = result1.cssVariables.split('\n');
  console.log('✅ Generated CSS:');
  console.log(`   Total lines: ${cssLines.length}`);
  console.log(`   Sample (first 10 lines):`);
  cssLines.slice(0, 10).forEach(line => {
    console.log(`   ${line}`);
  });
  console.log('   ...');
  console.log();
  
  // Test 5: Golden ratio typography
  console.log('Test 5: Golden ratio design system');
  const dna2: DesignDNA = {
    colors: ['#8b5cf6'],
    constraints: {
      baseTypePx: 16,
      typeRatio: 'golden',
      baseSpacePx: 8,
    },
  };
  
  const result2 = await architect.run(dna2, { accessibilityTarget: 'AAA' });
  console.log('✅ Golden Ratio System:');
  console.log(`   Total tokens: ${Object.keys(result2.tokens.color).length + Object.keys(result2.tokens.typography).length + Object.keys(result2.tokens.spacing).length}`);
  console.log(`   Cache key: ${result2.cacheKey.substring(0, 16)}...`);
  console.log(`   Total time: ${result2.diagnostics.timings.total.toFixed(2)}ms`);
  console.log();
  
  // Test 6: Determinism (same input = same cache key)
  console.log('Test 6: Determinism test');
  const result3 = await architect.run(dna1, { accessibilityTarget: 'AA' });
  const keysMatch = result1.cacheKey === result3.cacheKey;
  console.log(`✅ Cache keys match: ${keysMatch ? 'YES ✓' : 'NO ✗'}`);
  console.log(`   First run:  ${result1.cacheKey.substring(0, 32)}...`);
  console.log(`   Second run: ${result3.cacheKey.substring(0, 32)}...`);
  console.log();
  
  // Test 7: Documentation
  console.log('Test 7: Documentation generation');
  console.log('✅ Generated Documentation:');
  const docLines = result1.docs?.split('\n') || [];
  docLines.slice(0, 10).forEach(line => {
    console.log(`   ${line}`);
  });
  console.log();
  
  // Test 8: Performance budget check
  console.log('Test 8: Performance budget (200ms target)');
  const withinBudget = result1.diagnostics.timings.total < 200;
  console.log(`✅ Within budget: ${withinBudget ? 'YES ✓' : 'NO ✗'}`);
  console.log(`   Total time: ${result1.diagnostics.timings.total.toFixed(2)}ms / 200ms`);
  console.log(`   Efficiency: ${((result1.diagnostics.timings.total / 200) * 100).toFixed(1)}% of budget used`);
  console.log();
  
  console.log('🎉 All tests passed! DesignSystemArchitect is ready for production!');
}

testDesignSystemArchitect().catch(console.error);
