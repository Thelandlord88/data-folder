#!/usr/bin/env node
/**
 * NUXEE CLI - Command-line interface
 * 
 * Simple CLI for NUXEE v2.0
 * 
 * @version 2.0.0
 */

import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { NUXEEEngine } from './nuxee-engine.js';
import { PATTERN_LIBRARY } from './pattern-library.js';

// Simple argument parsing
const args = process.argv.slice(2);
const command = args[0];

/**
 * Main CLI handler
 */
async function main() {
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    return;
  }
  
  if (command === 'version' || command === '--version' || command === '-v') {
    console.log('NUXEE v2.0.0');
    return;
  }
  
  if (command === 'list-patterns') {
    listPatterns();
    return;
  }
  
  if (command === 'stats') {
    showStats();
    return;
  }
  
  if (command === 'enhance') {
    await enhanceFile();
    return;
  }
  
  console.error(`Unknown command: ${command}`);
  console.log('Run "nuxee help" for usage information');
  process.exit(1);
}

/**
 * Show help information
 */
function showHelp() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🎨 NUXEE v2.0 - UX Enhancement Engine                  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

USAGE:
  nuxee <command> [options]

COMMANDS:
  enhance <file>         Enhance an HTML file
  list-patterns          List all available patterns
  stats                  Show pattern statistics
  help, --help, -h       Show this help message
  version, --version, -v Show version

EXAMPLES:
  # Enhance a file
  nuxee enhance index.html

  # List patterns
  nuxee list-patterns

  # Show statistics
  nuxee stats

OPTIONS:
  --output, -o <file>    Output file (default: <input>-enhanced.html)
  --patterns <ids>       Comma-separated pattern IDs to use
  --min-confidence <n>   Minimum confidence score (0-1)
  --no-aaa              Allow non-AAA patterns

For more information, visit: https://github.com/nexus/nuxee
`);
}

/**
 * List all patterns
 */
function listPatterns() {
  console.log('\n📚 Available UX Patterns:\n');
  
  const byCategory = {
    'micro-interaction': [] as typeof PATTERN_LIBRARY,
    'visual-feedback': [] as typeof PATTERN_LIBRARY,
    'form-ux': [] as typeof PATTERN_LIBRARY,
    'navigation': [] as typeof PATTERN_LIBRARY,
    'content-enhancement': [] as typeof PATTERN_LIBRARY,
    'loading-states': [] as typeof PATTERN_LIBRARY
  };
  
  PATTERN_LIBRARY.forEach(pattern => {
    byCategory[pattern.category].push(pattern);
  });
  
  Object.entries(byCategory).forEach(([category, patterns]) => {
    if (patterns.length > 0) {
      console.log(`\n${category.toUpperCase().replace('-', ' ')}:`);
      patterns.forEach(p => {
        const effectiveness = Math.round(p.effectiveness * 100);
        console.log(`  • ${p.name} (${effectiveness}% effective)`);
        console.log(`    ID: ${p.id}`);
        console.log(`    ${p.description}`);
      });
    }
  });
  
  console.log(`\nTotal: ${PATTERN_LIBRARY.length} patterns\n`);
}

/**
 * Show pattern statistics
 */
function showStats() {
  console.log('\n📊 NUXEE Pattern Statistics:\n');
  
  const stats = {
    total: PATTERN_LIBRARY.length,
    aaa_compliant: PATTERN_LIBRARY.filter(p => p.wcag_level === 'AAA').length,
    avg_effectiveness: PATTERN_LIBRARY.reduce((sum, p) => sum + p.effectiveness, 0) / PATTERN_LIBRARY.length,
    by_category: {} as Record<string, number>,
    by_impact: { low: 0, medium: 0, high: 0 },
    top_5: PATTERN_LIBRARY
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .slice(0, 5)
  };
  
  PATTERN_LIBRARY.forEach(p => {
    stats.by_category[p.category] = (stats.by_category[p.category] || 0) + 1;
    stats.by_impact[p.impact]++;
  });
  
  console.log(`Total Patterns:        ${stats.total}`);
  console.log(`AAA Compliant:         ${stats.aaa_compliant} (${Math.round(stats.aaa_compliant / stats.total * 100)}%)`);
  console.log(`Avg Effectiveness:     ${Math.round(stats.avg_effectiveness * 100)}%`);
  
  console.log('\nBy Category:');
  Object.entries(stats.by_category).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });
  
  console.log('\nBy Impact:');
  Object.entries(stats.by_impact).forEach(([impact, count]) => {
    console.log(`  ${impact}: ${count}`);
  });
  
  console.log('\nTop 5 Most Effective:');
  stats.top_5.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name} (${Math.round(p.effectiveness * 100)}%)`);
  });
  
  console.log('');
}

/**
 * Enhance HTML file
 */
async function enhanceFile() {
  const inputFile = args[1];
  
  if (!inputFile) {
    console.error('❌ Error: No input file specified');
    console.log('Usage: nuxee enhance <file>');
    process.exit(1);
  }
  
  try {
    console.log(`\n🎨 NUXEE v2.0 - Enhancing ${inputFile}...\n`);
    
    // Read input file
    const inputPath = resolve(process.cwd(), inputFile);
    const html = await readFile(inputPath, 'utf-8');
    
    // Create engine
    const nuxee = new NUXEEEngine({
      patterns: PATTERN_LIBRARY,
      enable_learning: true,
      enable_analytics: true
    });
    
    // Register all patterns
    PATTERN_LIBRARY.forEach(pattern => nuxee.registerPattern(pattern));
    
    // Enhance
    const result = await nuxee.enhance(html, {
      auto_select: true,
      require_aaa: !args.includes('--no-aaa'),
      min_confidence: parseFloat(args.find(a => a.startsWith('--min-confidence='))?.split('=')[1] || '0.6'),
      explain: true
    });
    
    // Determine output file
    let outputFile = inputFile.replace(/\.html$/, '-enhanced.html');
    const outputIndex = args.indexOf('--output') !== -1 ? args.indexOf('--output') : args.indexOf('-o');
    if (outputIndex !== -1 && args[outputIndex + 1]) {
      outputFile = args[outputIndex + 1];
    }
    
    // Write output
    const outputPath = resolve(process.cwd(), outputFile);
    await writeFile(outputPath, result.enhanced_html, 'utf-8');
    
    // Show results
    console.log('✅ Enhancement complete!\n');
    console.log(`📊 Results:`);
    console.log(`   Input:              ${inputFile}`);
    console.log(`   Output:             ${outputFile}`);
    console.log(`   Patterns applied:   ${result.patterns_applied.length}`);
    console.log(`   Elements enhanced:  ${result.elements_enhanced}`);
    console.log(`   Processing time:    ${result.processing_time_ms}ms`);
    console.log(`   Confidence:         ${Math.round(result.confidence_score * 100)}%`);
    console.log(`   AAA compliant:      ${result.aaa_compliant ? '✅ Yes' : '⚠️  No'}`);
    
    if (result.patterns_applied.length > 0) {
      console.log('\n📝 Patterns applied:');
      result.patterns_applied.forEach(p => {
        console.log(`   • ${p.pattern_name}`);
        console.log(`     ${p.elements_affected} elements (${Math.round(p.confidence * 100)}% confidence)`);
      });
    }
    
    if (result.explanation) {
      console.log(`\n💡 ${result.explanation}`);
    }
    
    console.log('');
    
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run CLI
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
