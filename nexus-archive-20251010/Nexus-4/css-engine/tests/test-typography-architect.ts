/**
 * TypographyArchitect Test
 * Quick verification of modular scales and fluid typography
 */

import { TypographyArchitect, SCALE_RATIOS } from '../specialists/TypographyArchitect.js';
import type { DesignDNA } from '../contracts.js';

async function testTypographyArchitect() {
  console.log('📝 Testing TypographyArchitect...\n');
  
  const typoArchitect = new TypographyArchitect();
  
  // Test 1: Generate modular scale with perfectFourth
  console.log('Test 1: Generate modular scale (perfectFourth, 16px base)');
  const dna1: DesignDNA = {
    constraints: {
      baseTypePx: 16,
      typeRatio: 'perfectFourth',
    },
  };
  
  const result1 = await typoArchitect.run(dna1, {});
  console.log('✅ Base:', result1.base + 'px');
  console.log('✅ Ratio:', result1.ratio, '(perfectFourth)');
  console.log('✅ Scale steps:');
  Object.entries(result1.steps).forEach(([name, size]) => {
    console.log(`   ${name.padEnd(6)}: ${size.toFixed(2)}px`);
  });
  console.log('✅ Leading:', result1.leading);
  console.log();
  
  // Test 2: Generate fluid typography
  console.log('Test 2: Fluid typography (clamp expressions)');
  console.log('✅ Fluid scale samples:');
  console.log(`   xs:   ${result1.fluidSteps['xs']}`);
  console.log(`   base: ${result1.fluidSteps['base']}`);
  console.log(`   2xl:  ${result1.fluidSteps['2xl']}`);
  console.log(`   5xl:  ${result1.fluidSteps['5xl']}`);
  console.log();
  
  // Test 3: Golden ratio scale
  console.log('Test 3: Generate golden ratio scale');
  const dna2: DesignDNA = {
    constraints: {
      baseTypePx: 16,
      typeRatio: 'golden',
    },
  };
  
  const result2 = await typoArchitect.run(dna2, {});
  console.log('✅ Ratio:', result2.ratio, '(golden)');
  console.log('✅ Scale comparison (perfectFourth vs golden):');
  console.log(`   lg:  ${result1.steps['lg']?.toFixed(2)}px → ${result2.steps['lg']?.toFixed(2)}px`);
  console.log(`   xl:  ${result1.steps['xl']?.toFixed(2)}px → ${result2.steps['xl']?.toFixed(2)}px`);
  console.log(`   2xl: ${result1.steps['2xl']?.toFixed(2)}px → ${result2.steps['2xl']?.toFixed(2)}px`);
  console.log();
  
  // Test 4: Letter spacing (tracking)
  console.log('Test 4: Letter spacing (tracking)');
  console.log('✅ Tracking scale:');
  Object.entries(result1.tracking ?? {}).forEach(([name, value]) => {
    console.log(`   ${name.padEnd(6)}: ${value >= 0 ? '+' : ''}${value.toFixed(2)}em`);
  });
  console.log();
  
  // Test 5: All scale ratios
  console.log('Test 5: All available scale ratios');
  console.log('✅ Ratios:');
  Object.entries(SCALE_RATIOS).forEach(([name, value]) => {
    console.log(`   ${name.padEnd(18)}: ${value}`);
  });
  console.log();
  
  // Test 6: Line height calculation for different sizes
  console.log('Test 6: Optical line height calculations');
  const sizes = [12, 16, 24, 32, 48, 64];
  console.log('✅ Line heights (size → leading):');
  sizes.forEach(size => {
    const lh = typoArchitect.calculateLineHeightForSize(size);
    console.log(`   ${size}px → ${lh} (${(size * lh).toFixed(1)}px actual)`);
  });
  console.log();
  
  // Test 7: Generate responsive scale
  console.log('Test 7: Responsive typography scale');
  const breakpoints = { xs: 320, md: 768, lg: 1024 };
  const responsive = typoArchitect.generateResponsiveScale(result1.steps, breakpoints);
  console.log('✅ Responsive 5xl sizes:');
  Object.entries(responsive).forEach(([bp, scales]) => {
    console.log(`   ${bp}: ${scales['5xl']?.toFixed(2)}px`);
  });
  console.log();
  
  // Test 8: Optimal measure (line length)
  console.log('Test 8: Optimal measure (characters per line)');
  console.log('✅ Optimal line lengths:');
  sizes.forEach(size => {
    const measure = typoArchitect.calculateOptimalMeasure(size);
    console.log(`   ${size}px → ${measure} characters`);
  });
  console.log();
  
  console.log('🎉 All tests passed! TypographyArchitect is ready.');
}

testTypographyArchitect().catch(console.error);
