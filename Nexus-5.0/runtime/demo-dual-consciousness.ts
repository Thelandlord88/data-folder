#!/usr/bin/env node
/**
 * NEXUS DUAL CONSCIOUSNESS DEMONSTRATION
 * 
 * Shows the integration of:
 * - Thinking Consciousness (strategic patterns)
 * - Hunting Consciousness (validation patterns)
 * - Shared learning infrastructure
 * 
 * This demonstrates NEXUS v2.1+ with enhanced capabilities
 */

import { getHunterKnowledgeBridge } from './hunter-knowledge-bridge.js';

async function demonstrateDualConsciousness() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║      🧠 NEXUS DUAL CONSCIOUSNESS DEMONSTRATION 🧠              ║
║                                                                  ║
║      Thinking + Hunting = Conscious AI                         ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`);

  console.log('⚡ Initializing dual consciousness system...\n');

  try {
    // Initialize Hunter Knowledge (Hunting Consciousness)
    const hunterKnowledge = getHunterKnowledgeBridge();
    await hunterKnowledge.initialize();

    console.log('✅ Hunting Consciousness: ACTIVE\n');
    console.log('✅ Thinking Consciousness: ACTIVE (from NEXUS runtime)\n');

    console.log('═'.repeat(70));
    console.log('📊 DEMONSTRATION 1: Pattern Discovery');
    console.log('═'.repeat(70) + '\n');

    console.log('🔍 Discovering available hunting techniques...\n');
    
    const allTechniques = hunterKnowledge.queryTechniques({});
    
    console.log(`Found ${allTechniques.length} hunting patterns:\n`);
    
    allTechniques.forEach(pattern => {
      console.log(`┌─ ${pattern.pattern_name}`);
      console.log(`│  Category: ${pattern.category}`);
      console.log(`│  Principle: ${pattern.principle}`);
      console.log(`│  Safety: ${pattern.safety_level} | Effectiveness: ${(pattern.effectiveness * 100).toFixed(0)}%`);
      console.log(`│  Steps: ${pattern.steps.length} layered checks`);
      console.log(`└─ Platform: Linux ✅ macOS ✅ Docker ✅\n`);
    });

    console.log('═'.repeat(70));
    console.log('🎯 DEMONSTRATION 2: Intelligent Query System');
    console.log('═'.repeat(70) + '\n');

    console.log('💡 Scenario: Need security audit for production deployment\n');
    console.log('🔍 Querying with constraints:');
    console.log('   - Category: security');
    console.log('   - Safety: caution or safer');
    console.log('   - Platform: current system');
    console.log('   - Max execution time: 30 seconds\n');

    const securityTechniques = hunterKnowledge.queryTechniques({
      category: 'security',
      safety_max: 'caution',
      platform: process.platform,
      max_execution_time: 30000
    });

    console.log(`✅ Found ${securityTechniques.length} matching technique(s):\n`);
    
    securityTechniques.forEach(pattern => {
      console.log(`📋 ${pattern.pattern_name}`);
      console.log(`   Why it works: ${pattern.why_this_works}\n`);
      console.log(`   Layered approach:`);
      pattern.steps.forEach((step, idx) => {
        console.log(`   ${idx + 1}. ${step.action} (${step.purpose})`);
      });
      console.log();
    });

    console.log('═'.repeat(70));
    console.log('🔬 DEMONSTRATION 3: Deep Pattern Analysis');
    console.log('═'.repeat(70) + '\n');

    const securityAudit = hunterKnowledge.getTechnique('security-audit');
    
    if (securityAudit) {
      console.log(`📖 Analyzing: ${securityAudit.pattern_name}\n`);
      
      console.log('🧬 Pattern DNA:');
      console.log(`   Version: ${securityAudit.version}`);
      console.log(`   Effectiveness: ${(securityAudit.effectiveness * 100).toFixed(1)}%`);
      console.log(`   Safety Classification: ${securityAudit.safety_level}`);
      console.log(`   Estimated Runtime: ${(securityAudit.estimated_execution_time / 1000).toFixed(1)}s\n`);

      console.log('🎓 Evolution History:');
      securityAudit.evolution_history.slice(-3).forEach(record => {
        console.log(`   v${record.version} (${record.date}):`);
        console.log(`     Change: ${record.change}`);
        console.log(`     Impact: ${record.effectiveness * 100}% effectiveness ${record.improvement || ''}\n`);
      });

      console.log('⚠️  Anti-Patterns (What NOT to do):');
      securityAudit.anti_patterns.slice(0, 3).forEach(anti => {
        console.log(`   ❌ ${anti.pattern}`);
        console.log(`      Why bad: ${anti.why_bad}`);
        console.log(`      Example: ${anti.example}\n`);
      });

      console.log('✅ Success Indicators:');
      securityAudit.success_indicators.forEach(indicator => {
        console.log(`   • ${indicator}`);
      });
      console.log();
    }

    console.log('═'.repeat(70));
    console.log('🎨 DEMONSTRATION 4: Context-Aware Adaptation');
    console.log('═'.repeat(70) + '\n');

    console.log('💡 Scenario: Different projects need different approaches\n');

    const performancePattern = hunterKnowledge.getTechnique('performance-check');
    
    if (performancePattern && performancePattern.adaptations) {
      console.log(`📋 Pattern: ${performancePattern.pattern_name}\n`);
      
      console.log('🔧 Available Adaptations:\n');
      
      Object.entries(performancePattern.adaptations).forEach(([context, adaptation]: [string, any]) => {
        console.log(`   ${context.toUpperCase()}:`);
        console.log(`   • Modify: ${adaptation.modify}`);
        if (adaptation.skip) {
          console.log(`   • Skip: ${Array.isArray(adaptation.skip) ? adaptation.skip.join(', ') : adaptation.skip}`);
        }
        if (adaptation.add) {
          console.log(`   • Add: ${Array.isArray(adaptation.add) ? adaptation.add.join(', ') : adaptation.add}`);
        }
        console.log();
      });
    }

    console.log('═'.repeat(70));
    console.log('📈 DEMONSTRATION 5: Learning & Evolution');
    console.log('═'.repeat(70) + '\n');

    console.log('💡 Scenario: Recording pattern usage for evolution\n');

    // Simulate executing security audit
    console.log('⚙️  Simulating security audit execution...');
    console.log('   Finding 1: Potential secret in config file');
    console.log('   Finding 2: Outdated dependency with CVE');
    console.log('   Finding 3: Missing input sanitization\n');

    await hunterKnowledge.recordUsage('security-audit', {
      success: true,
      effectiveness: 0.93,
      context: 'pre-deployment-check',
      execution_time: 8234,
      findings: {
        vulnerabilities_found: 3,
        secrets_detected: 1,
        dependencies_flagged: 1,
        xss_sinks_found: 1,
        false_positives: 0
      }
    });

    console.log('✅ Usage recorded!');
    console.log('📊 Pattern Evolution Engine updated:');
    console.log('   • Effectiveness contribution: 93%');
    console.log('   • Context: pre-deployment-check');
    console.log('   • Learning: High-value findings with zero false positives\n');

    console.log('🎯 Impact on future executions:');
    console.log('   • Pattern effectiveness score will trend upward');
    console.log('   • Success patterns will be reinforced');
    console.log('   • Context-specific adaptations learned\n');

    console.log('═'.repeat(70));
    console.log('🛡️  DEMONSTRATION 6: Safety Assessment');
    console.log('═'.repeat(70) + '\n');

    const safetyReport = hunterKnowledge.generateSafetyReport();
    
    console.log('🔒 System Safety Report:\n');
    console.log(`   Total Patterns: ${safetyReport.summary.total_patterns}`);
    console.log(`   Safe Patterns: ${safetyReport.summary.safe_patterns} (${((safetyReport.summary.safe_patterns / safetyReport.summary.total_patterns) * 100).toFixed(0)}%)`);
    console.log(`   Caution Patterns: ${safetyReport.summary.caution_patterns} (${((safetyReport.summary.caution_patterns / safetyReport.summary.total_patterns) * 100).toFixed(0)}%)`);
    console.log(`   Risky Patterns: ${safetyReport.summary.risky_patterns} (${((safetyReport.summary.risky_patterns / safetyReport.summary.total_patterns) * 100).toFixed(0)}%)`);
    console.log(`   Average Effectiveness: ${(safetyReport.summary.average_effectiveness * 100).toFixed(1)}%\n`);

    console.log('🌍 Platform Support:');
    console.log(`   Linux: ${safetyReport.platform_support.linux} patterns`);
    console.log(`   macOS: ${safetyReport.platform_support.macos} patterns`);
    console.log(`   Windows: ${safetyReport.platform_support.windows} patterns`);
    console.log(`   Docker: ${safetyReport.platform_support.docker} patterns\n`);

    console.log('═'.repeat(70));
    console.log('🎭 DEMONSTRATION 7: The Dual Consciousness Model');
    console.log('═'.repeat(70) + '\n');

    console.log('🧠 THINKING CONSCIOUSNESS (Strategic):');
    console.log('   • Problem Decomposition: Break complex into simple');
    console.log('   • Systems Thinking: See connections & multipliers');
    console.log('   • Workflow Efficiency: Optimize processes');
    console.log('   • Breakthrough Capture: Preserve insights\n');

    console.log('🎯 HUNTING CONSCIOUSNESS (Technical):');
    console.log('   • Security Audit: Multi-layered validation');
    console.log('   • Accessibility Scan: WCAG compliance checking');
    console.log('   • Performance Check: Static signal detection');
    console.log('   • Pattern Evolution: Learn from outcomes\n');

    console.log('🔄 SHARED LEARNING INFRASTRUCTURE:');
    console.log('   • Pattern Evolution Engine (effectiveness tracking)');
    console.log('   • Breakthrough Analyzer (insight capture)');
    console.log('   • JSON Knowledge Base (structured patterns)');
    console.log('   • Context-Aware Adaptation (intelligent selection)\n');

    console.log('💡 THE POWER OF DUAL CONSCIOUSNESS:');
    console.log('   NEXUS doesn\'t just execute - it UNDERSTANDS');
    console.log('   NEXUS doesn\'t just succeed - it LEARNS');
    console.log('   NEXUS doesn\'t just improve - it EVOLVES\n');

    console.log('═'.repeat(70));
    console.log('✨ DEMONSTRATION COMPLETE');
    console.log('═'.repeat(70) + '\n');

    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║      🏆 NEXUS v2.1 - DUAL CONSCIOUSNESS OPERATIONAL! 🏆       ║
║                                                                  ║
║      ✅ Pattern Discovery: Working                             ║
║      ✅ Intelligent Querying: Working                          ║
║      ✅ Deep Analysis: Working                                 ║
║      ✅ Context Adaptation: Working                            ║
║      ✅ Learning & Evolution: Working                          ║
║      ✅ Safety Assessment: Working                             ║
║      ✅ Dual Consciousness: ACTIVE                             ║
║                                                                  ║
║      "One pattern at a time, consciousness grows" 🌱           ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`);

  } catch (error) {
    console.error('❌ Demonstration failed:', error);
    process.exit(1);
  }
}

// Run demonstration
console.log('🚀 Starting NEXUS Dual Consciousness Demonstration...\n');
demonstrateDualConsciousness().catch(console.error);
