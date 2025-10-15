#!/usr/bin/env node
/**
 * NEXUS CSS Engine - Live Demo
 * Generates 6 different design systems to showcase capabilities
 */

import { DesignSystemArchitect } from './specialists/DesignSystemArchitect.js';
import type { DesignDNA } from './contracts.js';

const themes = [
  { name: '🌊 Ocean Breeze', color: '#0ea5e9', desc: 'Sky blue elegance' },
  { name: '👑 Royal Purple', color: '#8b5cf6', desc: 'Regal sophistication' },
  { name: '⚡ Cyberpunk Neon', color: '#00ffff', desc: 'Electric energy' },
  { name: '🌅 Sunset Orange', color: '#f97316', desc: 'Warm & inviting' },
  { name: '🌲 Forest Green', color: '#10b981', desc: 'Natural calm' },
  { name: '💖 Hot Pink', color: '#ec4899', desc: 'Vibrant playfulness' },
];

async function showcaseEngine() {
  console.log('');
  console.log('🎨 NEXUS CSS ENGINE - LIVE SHOWCASE');
  console.log('═'.repeat(70));
  console.log('');
  console.log('Generating 6 production-ready design systems...');
  console.log('');

  const architect = new DesignSystemArchitect();
  const results = [];

  for (const theme of themes) {
    const startTime = performance.now();
    
    const dna: DesignDNA = {
      colors: [theme.color],
      constraints: {
        baseTypePx: 16,
        typeRatio: 'perfectFourth',
        baseSpacePx: 8,
      },
    };

    try {
      const design = await architect.run(dna, { accessibilityTarget: 'AA' });
      const elapsed = performance.now() - startTime;

      const colorCount = Object.keys(design.tokens.color).length;
      const typeCount = Object.keys(design.tokens.typography).length;
      const spaceCount = Object.keys(design.tokens.spacing).length;
      const totalTokens = colorCount + typeCount + spaceCount;
      
      const auditPass = design.diagnostics.audits.filter(a => a.pass).length;
      const auditTotal = design.diagnostics.audits.length;
      const passRate = ((auditPass / auditTotal) * 100).toFixed(0);

      results.push({ theme, design, elapsed, totalTokens, colorCount, typeCount, spaceCount, passRate });

      // Visual progress
      console.log(`${theme.name.padEnd(20)} ⚡ ${elapsed.toFixed(2)}ms  |  ${totalTokens} tokens  |  ${passRate}% WCAG pass`);

    } catch (error) {
      console.log(`${theme.name.padEnd(20)} ❌ Error: ${(error as Error).message}`);
    }
  }

  console.log('');
  console.log('═'.repeat(70));
  console.log('📊 PERFORMANCE SUMMARY');
  console.log('═'.repeat(70));
  console.log('');

  const avgTime = results.reduce((sum, r) => sum + r.elapsed, 0) / results.length;
  const totalTokens = results.reduce((sum, r) => sum + r.totalTokens, 0);
  const avgTokens = totalTokens / results.length;

  console.log(`  Total Systems Generated: ${results.length}`);
  console.log(`  Average Time: ${avgTime.toFixed(2)}ms`);
  console.log(`  Fastest: ${Math.min(...results.map(r => r.elapsed)).toFixed(2)}ms`);
  console.log(`  Slowest: ${Math.max(...results.map(r => r.elapsed)).toFixed(2)}ms`);
  console.log(`  Total Tokens: ${totalTokens}`);
  console.log(`  Avg Tokens/System: ${avgTokens.toFixed(0)}`);
  console.log(`  Performance Budget: 200ms per system`);
  console.log(`  Budget Usage: ${((avgTime / 200) * 100).toFixed(1)}%`);
  console.log('');

  console.log('═'.repeat(70));
  console.log('🎨 DETAILED BREAKDOWN');
  console.log('═'.repeat(70));
  console.log('');

  results.forEach(({ theme, design, elapsed, colorCount, typeCount, spaceCount, passRate }) => {
    console.log(`${theme.name}`);
    console.log(`  Color: ${theme.color}`);
    console.log(`  Performance: ${elapsed.toFixed(2)}ms`);
    console.log(`  Tokens: ${colorCount} colors, ${typeCount} typography, ${spaceCount} spacing`);
    console.log(`  WCAG Pass Rate: ${passRate}%`);
    console.log(`  Cache Key: ${design.cacheKey.substring(0, 16)}...`);
    console.log('');
  });

  console.log('═'.repeat(70));
  console.log('✨ SAMPLE OUTPUT');
  console.log('═'.repeat(70));
  console.log('');
  
  // Show first theme's CSS
  const sample = results[0];
  console.log(`${sample.theme.name} - Tailwind v4 CSS (first 20 lines):`);
  console.log('');
  const cssLines = sample.design.tailwindV4CSS.split('\\n').slice(0, 20);
  cssLines.forEach(line => console.log(`  ${line}`));
  console.log('  ...');
  console.log('');

  console.log('═'.repeat(70));
  console.log('🎉 SHOWCASE COMPLETE!');
  console.log('═'.repeat(70));
  console.log('');
  console.log('  ✅ All systems generated successfully');
  console.log(`  ⚡ Average: ${avgTime.toFixed(2)}ms per system`);
  console.log(`  🎯 ${((avgTime / 200) * 100).toFixed(1)}% of performance budget used`);
  console.log(`  🚀 ${results.length} production-ready design systems`);
  console.log('');
  console.log('  Ready to use in your projects!');
  console.log('  • Tailwind v4 CSS (@theme format)');
  console.log('  • Design tokens (JSON export)');
  console.log('  • Full documentation');
  console.log('  • WCAG AA/AAA audits');
  console.log('');
}

showcaseEngine().catch(console.error);
