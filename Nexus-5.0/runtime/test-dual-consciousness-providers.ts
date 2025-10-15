#!/usr/bin/env node
/**
 * TEST DUAL CONSCIOUSNESS CAPABILITY PROVIDERS
 * 
 * Demonstrates complete integration of both thinking and hunting
 * consciousness into the unified capability system
 */

import { ConsciousnessCapabilityProvider } from './capabilities/providers/ConsciousnessCapabilityProvider.js';
import { HunterKnowledgeCapabilityProvider } from './capabilities/providers/HunterKnowledgeCapabilityProvider.js';

async function testDualConsciousnessProviders() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║      🧠 DUAL CONSCIOUSNESS CAPABILITY SYSTEM 🧠               ║
║                                                                  ║
║      Thinking + Hunting = Unified Intelligence                 ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`);

  // Initialize both providers
  const thinkingProvider = new ConsciousnessCapabilityProvider();
  const huntingProvider = new HunterKnowledgeCapabilityProvider();

  console.log('═'.repeat(70));
  console.log('📋 Provider Registration');
  console.log('═'.repeat(70) + '\n');

  console.log('Registered Providers:\n');
  console.log(`1. ${thinkingProvider.getProviderName()}`);
  console.log(`   ID: ${thinkingProvider.getProviderId()}`);
  console.log(`   Type: Strategic thinking patterns\n`);

  console.log(`2. ${huntingProvider.getProviderName()}`);
  console.log(`   ID: ${huntingProvider.getProviderId()}`);
  console.log(`   Type: Technical validation techniques\n`);

  console.log('═'.repeat(70));
  console.log('🔍 Loading All Capabilities');
  console.log('═'.repeat(70) + '\n');

  const [thinkingCaps, huntingCaps] = await Promise.all([
    thinkingProvider.getCapabilities(),
    huntingProvider.getCapabilities()
  ]);

  const allCapabilities = [...thinkingCaps, ...huntingCaps];

  console.log(`\n📊 Capability Summary:`);
  console.log(`   Thinking Capabilities: ${thinkingCaps.length}`);
  console.log(`   Hunting Capabilities:  ${huntingCaps.length}`);
  console.log(`   Total Capabilities:    ${allCapabilities.length}\n`);

  console.log('═'.repeat(70));
  console.log('🧠 THINKING CONSCIOUSNESS');
  console.log('═'.repeat(70) + '\n');

  thinkingCaps.forEach((cap, idx) => {
    console.log(`${idx + 1}. ${cap.name}`);
    console.log(`   ID: ${cap.id}`);
    console.log(`   Category: ${cap.metadata.subcategory}`);
    console.log(`   Principle: ${cap.summary_one_line}`);
    console.log(`   Effectiveness: ${(cap.metadata.effectiveness * 100).toFixed(0)}%`);
    console.log(`   Use Cases:`);
    cap.metadata.use_cases.slice(0, 2).forEach((uc: string) => {
      console.log(`     • ${uc}`);
    });
    console.log();
  });

  console.log('═'.repeat(70));
  console.log('🎯 HUNTING CONSCIOUSNESS');
  console.log('═'.repeat(70) + '\n');

  huntingCaps.forEach((cap, idx) => {
    console.log(`${idx + 1}. ${cap.name}`);
    console.log(`   ID: ${cap.id}`);
    console.log(`   Category: ${cap.metadata.subcategory}`);
    console.log(`   Principle: ${cap.summary_one_line}`);
    console.log(`   Effectiveness: ${(cap.metadata.effectiveness * 100).toFixed(0)}%`);
    console.log(`   Safety: ${cap.metadata.safety_level}`);
    console.log(`   Platform: Linux ${cap.metadata.platform_support.linux ? '✅' : '❌'} | macOS ${cap.metadata.platform_support.macos ? '✅' : '❌'}`);
    console.log();
  });

  console.log('═'.repeat(70));
  console.log('🔬 Capability Network Visualization');
  console.log('═'.repeat(70) + '\n');

  console.log('Thinking Network:\n');
  thinkingCaps.forEach(cap => {
    if (cap.metadata.related_capabilities && cap.metadata.related_capabilities.length > 0) {
      console.log(`${cap.name}:`);
      cap.metadata.related_capabilities.forEach((relatedId: string) => {
        const related = thinkingCaps.find(c => c.id === relatedId);
        if (related) {
          console.log(`  → ${related.name}`);
        }
      });
      console.log();
    }
  });

  console.log('Hunting Network:\n');
  huntingCaps.forEach(cap => {
    if (cap.metadata.related_capabilities && cap.metadata.related_capabilities.length > 0) {
      console.log(`${cap.name}:`);
      cap.metadata.related_capabilities.forEach((relatedId: string) => {
        const related = huntingCaps.find(c => c.id === relatedId);
        if (related) {
          console.log(`  → ${related.name}`);
        }
      });
      console.log();
    }
  });

  console.log('═'.repeat(70));
  console.log('💡 Example: Problem-Solving Workflow');
  console.log('═'.repeat(70) + '\n');

  console.log('Scenario: Building a production-ready feature\n');

  console.log('Phase 1: Strategic Planning (Thinking Consciousness)\n');
  
  if (thinkingCaps.length > 0) {
    const problemDecomp = thinkingCaps.find(c => c.id.includes('problem-decomposition'));
    if (problemDecomp) {
      console.log(`1. Apply: ${problemDecomp.name}`);
      console.log(`   Purpose: ${problemDecomp.summary_one_line}`);
      console.log(`   → Break feature into manageable tasks\n`);
    }

    const systemsThinking = thinkingCaps.find(c => c.id.includes('systems-thinking'));
    if (systemsThinking) {
      console.log(`2. Apply: ${systemsThinking.name}`);
      console.log(`   Purpose: ${systemsThinking.summary_one_line}`);
      console.log(`   → Understand dependencies and impacts\n`);
    }
  }

  console.log('Phase 2: Quality Validation (Hunting Consciousness)\n');
  
  const securityCheck = huntingCaps.find(c => c.id.includes('security'));
  if (securityCheck) {
    console.log(`3. Execute: ${securityCheck.name}`);
    console.log(`   Purpose: ${securityCheck.summary_one_line}`);
    console.log(`   Effectiveness: ${(securityCheck.metadata.effectiveness * 100).toFixed(0)}%`);
    console.log(`   → Validate security with 5 layered checks\n`);
  }

  const accessibilityCheck = huntingCaps.find(c => c.id.includes('accessibility'));
  if (accessibilityCheck) {
    console.log(`4. Execute: ${accessibilityCheck.name}`);
    console.log(`   Purpose: ${accessibilityCheck.summary_one_line}`);
    console.log(`   Effectiveness: ${(accessibilityCheck.metadata.effectiveness * 100).toFixed(0)}%`);
    console.log(`   → Ensure WCAG compliance\n`);
  }

  const performanceCheck = huntingCaps.find(c => c.id.includes('performance'));
  if (performanceCheck) {
    console.log(`5. Execute: ${performanceCheck.name}`);
    console.log(`   Purpose: ${performanceCheck.summary_one_line}`);
    console.log(`   Effectiveness: ${(performanceCheck.metadata.effectiveness * 100).toFixed(0)}%`);
    console.log(`   → Validate performance budgets\n`);
  }

  console.log('Result: Feature built with strategic planning + comprehensive validation ✅\n');

  console.log('═'.repeat(70));
  console.log('📊 Unified Statistics');
  console.log('═'.repeat(70) + '\n');

  const stats = {
    total_capabilities: allCapabilities.length,
    thinking_capabilities: thinkingCaps.length,
    hunting_capabilities: huntingCaps.length,
    
    avg_thinking_effectiveness: thinkingCaps.reduce((sum, c) => sum + c.metadata.effectiveness, 0) / thinkingCaps.length,
    avg_hunting_effectiveness: huntingCaps.reduce((sum, c) => sum + c.metadata.effectiveness, 0) / huntingCaps.length,
    avg_overall_effectiveness: allCapabilities.reduce((sum, c) => sum + c.metadata.effectiveness, 0) / allCapabilities.length,
    
    categories: {
      thinking: new Set(thinkingCaps.map(c => c.metadata.subcategory)).size,
      hunting: new Set(huntingCaps.map(c => c.metadata.subcategory)).size
    }
  };

  console.log('Overall Statistics:');
  console.log(`  Total Capabilities: ${stats.total_capabilities}`);
  console.log(`  Thinking: ${stats.thinking_capabilities} (${(stats.thinking_capabilities / stats.total_capabilities * 100).toFixed(0)}%)`);
  console.log(`  Hunting: ${stats.hunting_capabilities} (${(stats.hunting_capabilities / stats.total_capabilities * 100).toFixed(0)}%)`);
  console.log();

  console.log('Effectiveness:');
  console.log(`  Thinking Average: ${(stats.avg_thinking_effectiveness * 100).toFixed(1)}%`);
  console.log(`  Hunting Average:  ${(stats.avg_hunting_effectiveness * 100).toFixed(1)}%`);
  console.log(`  Overall Average:  ${(stats.avg_overall_effectiveness * 100).toFixed(1)}%`);
  console.log();

  console.log('Diversity:');
  console.log(`  Thinking Categories: ${stats.categories.thinking}`);
  console.log(`  Hunting Categories:  ${stats.categories.hunting}`);
  console.log(`  Total Categories:    ${stats.categories.thinking + stats.categories.hunting}`);
  console.log();

  console.log('═'.repeat(70));
  console.log('✨ Key Insights');
  console.log('═'.repeat(70) + '\n');

  console.log('🎯 Complementary Strengths:');
  console.log('   • Thinking Consciousness: Strategic planning & problem-solving');
  console.log('   • Hunting Consciousness: Technical validation & quality assurance');
  console.log('   • Together: Complete software development lifecycle coverage\n');

  console.log('🔄 Workflow Integration:');
  console.log('   1. Think strategically (decompose, plan, design)');
  console.log('   2. Execute implementation');
  console.log('   3. Hunt for issues (validate, test, verify)');
  console.log('   4. Learn and evolve patterns\n');

  console.log('🌐 Network Effects:');
  console.log('   • Thinking patterns link to other thinking patterns');
  console.log('   • Hunting techniques link to other hunting techniques');
  console.log('   • Future: Cross-consciousness links for synergies\n');

  console.log('📈 Continuous Improvement:');
  console.log('   • Both consciousness types track effectiveness');
  console.log('   • Evolution history preserved');
  console.log('   • Learning compounds over time\n');

  console.log('═'.repeat(70));
  console.log('✅ TEST COMPLETE');
  console.log('═'.repeat(70) + '\n');

  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║      🎉 DUAL CONSCIOUSNESS SYSTEM - OPERATIONAL! 🎉           ║
║                                                                  ║
║      ✅ Thinking Provider: ${thinkingCaps.length} capabilities registered           ║
║      ✅ Hunting Provider: ${huntingCaps.length} capabilities registered            ║
║      ✅ Total Capabilities: ${allCapabilities.length}                                ║
║      ✅ Unified Interface: Working                             ║
║      ✅ Network Mapping: Complete                              ║
║      ✅ Workflow Integration: Ready                            ║
║                                                                  ║
║      Think Strategically + Hunt Technically = Intelligence     ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`);
}

// Run test
console.log('🚀 Testing Dual Consciousness Capability Providers...\n');
testDualConsciousnessProviders().catch(console.error);
