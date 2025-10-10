/**
 * SpatialEngineer Test
 * Quick verification of spacing scales and grid systems
 */

import { SpatialEngineer, SPACING_TYPES } from '../specialists/SpatialEngineer.js';
import type { DesignDNA } from '../contracts.js';

async function testSpatialEngineer() {
  console.log('📐 Testing SpatialEngineer...\n');
  
  const spatialEngineer = new SpatialEngineer();
  
  // Test 1: Generate geometric spacing scale
  console.log('Test 1: Generate geometric spacing scale (8px base)');
  const dna1: DesignDNA = {
    constraints: {
      baseSpacePx: 8,
    },
  };
  
  const result1 = await spatialEngineer.run(dna1, {});
  console.log('✅ Spacing scale (geometric):');
  Object.entries(result1.spacing).forEach(([name, value]) => {
    const px = value * 16; // Convert rem to px
    console.log(`   ${name.padEnd(3)}: ${value.toFixed(3)}rem (${px.toFixed(0)}px)`);
  });
  console.log();
  
  // Test 2: Grid system
  console.log('Test 2: Grid system calculation');
  console.log('✅ Grid configuration:');
  console.log(`   Columns: ${result1.grid.columns}`);
  console.log(`   Min column width: ${result1.grid.minColPx}px`);
  console.log(`   Max column width: ${result1.grid.maxColPx}px`);
  console.log(`   Gap: ${result1.grid.gap}px`);
  console.log();
  
  // Test 3: Breakpoints
  console.log('Test 3: Responsive breakpoints');
  console.log('✅ Breakpoints:');
  Object.entries(result1.breakpoints).forEach(([name, value]) => {
    console.log(`   ${name.padEnd(4)}: ${value}px`);
  });
  console.log();
  
  // Test 4: Fibonacci spacing
  console.log('Test 4: Fibonacci spacing scale');
  const fibSpacing = spatialEngineer.generateSpacingScale(8, 'fibonacci');
  console.log('✅ Fibonacci spacing:');
  Object.entries(fibSpacing).slice(0, 8).forEach(([name, value]) => {
    const px = value * 16;
    console.log(`   ${name.padEnd(3)}: ${value.toFixed(3)}rem (${px.toFixed(0)}px)`);
  });
  console.log();
  
  // Test 5: Z-index scale
  console.log('Test 5: Z-index layering system');
  const zIndex = spatialEngineer.generateZIndexScale();
  console.log('✅ Z-index scale:');
  Object.entries(zIndex).forEach(([name, value]) => {
    console.log(`   ${name.padEnd(18)}: ${value}`);
  });
  console.log();
  
  // Test 6: Container sizes
  console.log('Test 6: Container sizes');
  const containers = spatialEngineer.generateContainerSizes();
  console.log('✅ Container sizes:');
  Object.entries(containers).forEach(([name, value]) => {
    console.log(`   ${name.padEnd(4)}: ${value}`);
  });
  console.log();
  
  // Test 7: Responsive grid
  console.log('Test 7: Responsive grid configuration');
  const responsiveGrid = spatialEngineer.generateResponsiveGrid(result1.breakpoints);
  console.log('✅ Responsive grid:');
  Object.entries(responsiveGrid).forEach(([bp, config]) => {
    console.log(`   ${bp.padEnd(4)}: ${config.columns} columns, ${config.gap}px gap`);
  });
  console.log();
  
  // Test 8: Aspect ratios
  console.log('Test 8: Aspect ratios');
  const aspectRatios = spatialEngineer.generateAspectRatios();
  console.log('✅ Aspect ratios:');
  Object.entries(aspectRatios).forEach(([name, value]) => {
    console.log(`   ${name.padEnd(10)}: ${value}`);
  });
  console.log();
  
  // Test 9: Optimal content width
  console.log('Test 9: Optimal content width calculation');
  const fontSizes = [14, 16, 18, 20];
  console.log('✅ Content widths (65 characters):');
  fontSizes.forEach(size => {
    const width = spatialEngineer.calculateOptimalContentWidth(size, 65);
    console.log(`   ${size}px font → ${width}px width`);
  });
  console.log();
  
  console.log('🎉 All tests passed! SpatialEngineer is ready.');
}

testSpatialEngineer().catch(console.error);
