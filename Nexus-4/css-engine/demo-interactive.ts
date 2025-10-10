#!/usr/bin/env node
/**
 * Interactive CSS Engine Demo
 * Shows live generation with different colors
 */

import { DesignSystemArchitect } from './specialists/DesignSystemArchitect.js';
import type { DesignDNA } from './contracts.js';

const colors = {
  '1': { name: '🌊 Sky Blue', hex: '#0ea5e9' },
  '2': { name: '👑 Purple', hex: '#8b5cf6' },
  '3': { name: '⚡ Cyan', hex: '#00ffff' },
  '4': { name: '🌺 Pink', hex: '#ec4899' },
  '5': { name: '🍊 Orange', hex: '#f97316' },
  '6': { name: '🌲 Green', hex: '#10b981' },
};

console.log('\n🎨 NEXUS CSS ENGINE - INTERACTIVE DEMO\n');
console.log('═'.repeat(70));
console.log('\nSelect a color to generate a complete design system:\n');

Object.entries(colors).forEach(([key, { name, hex }]) => {
  console.log(`  ${key}. ${name.padEnd(20)} ${hex}`);
});

console.log('\n═'.repeat(70));
console.log('\n💡 Usage: node demo.js [1-6] or just run to see all\n');

const choice = process.argv[2] || '2'; // Default to purple
const selected = colors[choice as keyof typeof colors] || colors['2'];

async function demonstrate() {
  console.log(`\n✨ Generating: ${selected.name} (${selected.hex})\n`);
  console.log('─'.repeat(70));
  
  const architect = new DesignSystemArchitect();
  
  const dna: DesignDNA = {
    colors: [selected.hex],
    constraints: {
      baseTypePx: 16,
      typeRatio: 'perfectFourth',
      baseSpacePx: 8,
    },
  };
  
  const startTime = performance.now();
  const design = await architect.run(dna, { accessibilityTarget: 'AA' });
  const elapsed = performance.now() - startTime;
  
  // Display color ramp
  console.log('\n🎨 COLOR PALETTE (OKLCH)\n');
  Object.entries(design.tokens.color).slice(0, 11).forEach(([shade, color]) => {
    const bar = '█'.repeat(30);
    console.log(`  ${shade.padEnd(6)} ${color.padEnd(35)} ${bar}`);
  });
  
  // Display typography scale
  console.log('\n📝 TYPOGRAPHY SCALE\n');
  Object.entries(design.tokens.typography).slice(0, 9).forEach(([size, value]) => {
    if (typeof value === 'number') {
      console.log(`  ${size.padEnd(6)} ${value}px`);
    }
  });
  
  // Display spacing
  console.log('\n📐 SPACING SCALE\n');
  Object.entries(design.tokens.spacing).slice(0, 8).forEach(([key, value]) => {
    console.log(`  ${key.padEnd(6)} ${value}rem`);
  });
  
  // Display performance
  console.log('\n⚡ PERFORMANCE\n');
  console.log(`  Generation Time: ${elapsed.toFixed(2)}ms`);
  console.log(`  Total Tokens: ${Object.keys(design.tokens.color).length + Object.keys(design.tokens.typography).length + Object.keys(design.tokens.spacing).length}`);
  console.log(`  Color Shades: ${Object.keys(design.tokens.color).length}`);
  console.log(`  Typography: ${Object.keys(design.tokens.typography).length}`);
  console.log(`  Spacing: ${Object.keys(design.tokens.spacing).length}`);
  
  // Display diagnostics
  console.log('\n✅ DIAGNOSTICS\n');
  design.diagnostics.notes.forEach(note => {
    console.log(`  ${note}`);
  });
  
  // Display sample CSS
  console.log('\n💾 GENERATED CSS (first 15 lines)\n');
  const cssLines = design.tailwindV4CSS.split('\n').slice(0, 15);
  cssLines.forEach(line => {
    console.log(`  ${line}`);
  });
  console.log('  ...\n');
  
  console.log('─'.repeat(70));
  console.log(`\n🎉 Complete design system generated in ${elapsed.toFixed(2)}ms!`);
  console.log('\n📦 Includes:');
  console.log('   • Full color palette (OKLCH)');
  console.log('   • Typography scale (modular)');
  console.log('   • Spacing system (geometric)');
  console.log('   • Tailwind v4 CSS (@theme)');
  console.log('   • WCAG accessibility audits');
  console.log('   • Production-ready tokens\n');
}

demonstrate().catch(console.error);
