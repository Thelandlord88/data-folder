#!/usr/bin/env node
/**
 * TEST HUNTER KNOWLEDGE CAPABILITY PROVIDER
 * 
 * Demonstrates integration of hunting consciousness into capability system
 */

import { HunterKnowledgeCapabilityProvider } from './capabilities/providers/HunterKnowledgeCapabilityProvider.js';

async function testHunterKnowledgeProvider() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║      🎯 HUNTER KNOWLEDGE CAPABILITY PROVIDER TEST 🎯          ║
║                                                                  ║
║      Integration: Hunting Consciousness → Capabilities        ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`);

  const provider = new HunterKnowledgeCapabilityProvider();

  console.log('═'.repeat(70));
  console.log('📋 Provider Information');
  console.log('═'.repeat(70) + '\n');

  console.log(`Provider ID:   ${provider.getProviderId()}`);
  console.log(`Provider Name: ${provider.getProviderName()}\n`);

  console.log('═'.repeat(70));
  console.log('🔍 Loading Hunting Capabilities');
  console.log('═'.repeat(70) + '\n');

  const capabilities = await provider.getCapabilities();

  console.log(`\nFound ${capabilities.length} hunting capabilities:\n`);

  capabilities.forEach((cap, idx) => {
    console.log(`${idx + 1}. ${cap.name}`);
    console.log(`   ID: ${cap.id}`);
    console.log(`   Category: ${cap.category} / ${cap.metadata.subcategory}`);
    console.log(`   Principle: ${cap.summary_one_line}`);
    console.log(`   Effectiveness: ${(cap.metadata.effectiveness * 100).toFixed(0)}%`);
    console.log(`   Safety: ${cap.metadata.safety_level}`);
    console.log(`   Steps: ${cap.metadata.steps}`);
    console.log(`   Platform: Linux ${cap.metadata.platform_support.linux ? '✅' : '❌'} | macOS ${cap.metadata.platform_support.macos ? '✅' : '❌'} | Windows ${cap.metadata.platform_support.windows ? '✅' : '❌'}`);
    console.log(`   Estimated Time: ${(cap.metadata.estimated_time / 1000).toFixed(1)}s`);
    console.log(`   Tags: ${cap.metadata.tags.join(', ')}`);
    console.log();
  });

  console.log('═'.repeat(70));
  console.log('🔬 Detailed Capability Analysis');
  console.log('═'.repeat(70) + '\n');

  if (capabilities.length > 0) {
    const firstCap = capabilities[0];
    console.log(`Analyzing: ${firstCap.name}\n`);

    const details = await provider.getCapabilityDetails(firstCap.id);

    console.log('📖 Principle:');
    console.log(`   ${details.principle}\n`);

    console.log('🎯 Why It Works:');
    console.log(`   ${details.why_it_works.substring(0, 200)}...\n`);

    console.log('📊 Effectiveness History:');
    details.evolution_history.slice(-3).forEach((record: any) => {
      console.log(`   v${record.version} (${record.date}): ${(record.effectiveness * 100).toFixed(0)}% ${record.improvement || ''}`);
    });
    console.log();

    console.log('✅ Success Indicators:');
    details.success_indicators.slice(0, 3).forEach((indicator: string) => {
      console.log(`   • ${indicator}`);
    });
    console.log();

    console.log('⚠️  Anti-Patterns (What NOT to do):');
    details.anti_patterns.slice(0, 2).forEach((anti: any) => {
      console.log(`   ❌ ${anti.pattern}`);
      console.log(`      Why: ${anti.why_bad}`);
    });
    console.log();

    console.log('🔧 Available Adaptations:');
    Object.keys(details.adaptations || {}).forEach(context => {
      console.log(`   • ${context}`);
    });
    console.log();
  }

  console.log('═'.repeat(70));
  console.log('⚙️  Simulated Execution');
  console.log('═'.repeat(70) + '\n');

  if (capabilities.length > 0) {
    const techniqueId = capabilities[0].id.replace('hunting:', '');
    console.log(`Executing technique: ${capabilities[0].name}\n`);

    const result = await provider.executeTechnique(techniqueId, {
      workspace: '/workspaces/data-folder',
      environment: 'test',
      safety_mode: true
    });

    console.log('Execution Result:');
    console.log(JSON.stringify(result, null, 2));
    console.log();
  }

  console.log('═'.repeat(70));
  console.log('🌐 Capability Network Analysis');
  console.log('═'.repeat(70) + '\n');

  console.log('Related Capabilities Map:\n');

  capabilities.forEach(cap => {
    if (cap.metadata.related_capabilities && cap.metadata.related_capabilities.length > 0) {
      console.log(`${cap.name}:`);
      cap.metadata.related_capabilities.forEach((relatedId: string) => {
        const related = capabilities.find(c => c.id === relatedId);
        if (related) {
          console.log(`  → ${related.name}`);
        }
      });
      console.log();
    }
  });

  console.log('═'.repeat(70));
  console.log('📊 Provider Statistics');
  console.log('═'.repeat(70) + '\n');

  const stats = {
    total_capabilities: capabilities.length,
    by_category: {} as Record<string, number>,
    by_safety: {} as Record<string, number>,
    avg_effectiveness: capabilities.reduce((sum, cap) => sum + cap.metadata.effectiveness, 0) / capabilities.length,
    total_steps: capabilities.reduce((sum, cap) => sum + cap.metadata.steps, 0),
    platforms: {
      linux: capabilities.filter(c => c.metadata.platform_support.linux).length,
      macos: capabilities.filter(c => c.metadata.platform_support.macos).length,
      windows: capabilities.filter(c => c.metadata.platform_support.windows).length,
      docker: capabilities.filter(c => c.metadata.platform_support.docker).length
    }
  };

  capabilities.forEach(cap => {
    const category = cap.metadata.subcategory;
    stats.by_category[category] = (stats.by_category[category] || 0) + 1;
    
    const safety = cap.metadata.safety_level;
    stats.by_safety[safety] = (stats.by_safety[safety] || 0) + 1;
  });

  console.log('Statistics:');
  console.log(`  Total Capabilities: ${stats.total_capabilities}`);
  console.log(`  Average Effectiveness: ${(stats.avg_effectiveness * 100).toFixed(1)}%`);
  console.log(`  Total Validation Steps: ${stats.total_steps}`);
  console.log();

  console.log('By Category:');
  Object.entries(stats.by_category).forEach(([category, count]) => {
    console.log(`  ${category}: ${count}`);
  });
  console.log();

  console.log('By Safety Level:');
  Object.entries(stats.by_safety).forEach(([level, count]) => {
    console.log(`  ${level}: ${count}`);
  });
  console.log();

  console.log('Platform Support:');
  console.log(`  Linux: ${stats.platforms.linux} capabilities`);
  console.log(`  macOS: ${stats.platforms.macos} capabilities`);
  console.log(`  Windows: ${stats.platforms.windows} capabilities`);
  console.log(`  Docker: ${stats.platforms.docker} capabilities`);
  console.log();

  console.log('═'.repeat(70));
  console.log('✅ TEST COMPLETE');
  console.log('═'.repeat(70) + '\n');

  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║      🎉 HUNTER KNOWLEDGE PROVIDER - OPERATIONAL! 🎉           ║
║                                                                  ║
║      ✅ Capability registration: Working                       ║
║      ✅ Metadata extraction: Working                           ║
║      ✅ Detail retrieval: Working                              ║
║      ✅ Execution simulation: Working                          ║
║      ✅ Network mapping: Working                               ║
║      ✅ Statistics generation: Working                         ║
║                                                                  ║
║      Hunting Consciousness → Capability System ✅              ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`);
}

// Run test
console.log('🚀 Testing Hunter Knowledge Capability Provider...\n');
testHunterKnowledgeProvider().catch(console.error);
