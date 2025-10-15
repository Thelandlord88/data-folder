#!/usr/bin/env node
/**
 * NEXUS SYSTEM RESTART - Enhanced v2.0
 * 
 * Fresh initialization with all enhanced capabilities
 * 
 * @version 2.0.0
 * @date October 15, 2025
 */

import {
  initializeNexusCapabilitySystem,
  getNexusCapabilityRegistry,
  NEXUS_CAPABILITY_SYSTEM_VERSION
} from './capabilities/index.js';

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║                  🧠 NEXUS SYSTEM RESTART 🧠                     ║
║                                                                  ║
║              Enhanced Capability System v${NEXUS_CAPABILITY_SYSTEM_VERSION}              ║
║                                                                  ║
║    "NEXUS persists. Agents are ephemeral. NEXUS must teach."   ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`);

async function restartNexus() {
  try {
    console.log('═'.repeat(70));
    console.log('🔄 INITIALIZING NEXUS...');
    console.log('═'.repeat(70) + '\n');

    // Initialize with production settings
    const {
      registry,
      status,
      providersLoaded,
      capabilitiesRegistered,
      errors
    } = await initializeNexusCapabilitySystem({
      autoLoadProviders: true,
      enableMonitoring: true,
      enableLearning: true,
      persistenceEnabled: true,
      persistencePath: './nexus-capabilities-state.json'
    });

    console.log('\n' + '═'.repeat(70));
    console.log('📊 NEXUS STATUS');
    console.log('═'.repeat(70));
    console.log(`Status:          ${status.toUpperCase()}`);
    console.log(`Providers:       ${providersLoaded} loaded`);
    console.log(`Capabilities:    ${capabilitiesRegistered} registered`);
    console.log(`Errors:          ${errors.length}`);
    console.log();

    if (errors.length > 0) {
      console.log('⚠️  Warnings:');
      errors.forEach(error => console.log(`   - ${error}`));
      console.log();
    }

    // Display system health
    const health = registry.getSystemHealth();
    console.log('═'.repeat(70));
    console.log('🏥 SYSTEM HEALTH');
    console.log('═'.repeat(70));
    console.log(`Overall Health:  ${(health.overall_health * 100).toFixed(0)}%`);
    console.log(`Available:       ${health.available_capabilities} capabilities`);
    console.log(`Degraded:        ${health.degraded_capabilities}`);
    console.log(`Critical Alerts: ${health.critical_alerts}`);
    console.log();

    // Display statistics
    const stats = registry.getStatistics();
    console.log('═'.repeat(70));
    console.log('📈 REGISTRY STATISTICS');
    console.log('═'.repeat(70));
    console.log(`Total Capabilities:  ${stats.total_capabilities}`);
    console.log(`Usage Records:       ${stats.total_usage_records}`);
    console.log(`Avg Effectiveness:   ${(stats.avg_effectiveness * 100).toFixed(1)}%`);
    console.log(`Patterns Discovered: ${stats.patterns}`);
    console.log();

    if (stats.most_used.length > 0) {
      console.log('🏆 Most Used Capabilities:');
      stats.most_used.slice(0, 5).forEach((cap: any, idx: number) => {
        console.log(`   ${idx + 1}. ${cap.name} (${cap.usage_count} uses)`);
      });
      console.log();
    }

    console.log('═'.repeat(70));
    console.log('🎯 AVAILABLE FEATURES');
    console.log('═'.repeat(70));
    console.log('✅ Dependencies & Conflicts Management');
    console.log('✅ Performance & Cost Tracking');
    console.log('✅ Learning & Adaptation System');
    console.log('✅ Security & Access Control');
    console.log('✅ Real-time Health Monitoring');
    console.log('✅ Conversational Discovery');
    console.log('✅ Proactive Recommendations');
    console.log('✅ Persistence & Backup');
    console.log('✅ Self-Maintenance');
    console.log();

    console.log('═'.repeat(70));
    console.log('💡 QUICK START EXAMPLES');
    console.log('═'.repeat(70));
    console.log(`
// Get the registry
import { getNexusCapabilityRegistry } from './capabilities/index.js';
const registry = getNexusCapabilityRegistry();

// Discover capabilities
const results = registry.discover('security validation');

// Record usage (enables learning)
registry.recordUsage('capability-id', true, 'my-context', 1500);

// Get proactive recommendations
const systemState = {
  performance_metrics: { slow_pages: 5 },
  security_scan: { failed_checks: 2 },
  code_quality: { score: 85 }
};
const recs = registry.getProactiveRecommendations(systemState);

// Check system health
const health = registry.getSystemHealth();

// Conversational discovery
const response = registry.conversationalDiscover(
  'I need to validate my web form'
);
`);

    console.log('═'.repeat(70));
    console.log('✅ NEXUS RESTART COMPLETE');
    console.log('═'.repeat(70));
    console.log();
    console.log('🚀 System is ready for use!');
    console.log('📚 See NEXUS_INTEGRATION_COMPLETE.md for usage guide');
    console.log('🗺️  See NEXUS_V3_ROADMAP.md for future enhancements');
    console.log();

    // Demonstrate conversational discovery
    console.log('═'.repeat(70));
    console.log('🎯 DEMO: Conversational Discovery');
    console.log('═'.repeat(70) + '\n');

    const query = "I need to analyze code quality";
    console.log(`Query: "${query}"\n`);

    const conversation = registry.conversationalDiscover(query);
    
    console.log(`Understood Intent:`);
    console.log(`  Goal: ${conversation.understood_intent.goal}`);
    console.log(`  Confidence: ${(conversation.understood_intent.confidence * 100).toFixed(0)}%\n`);

    if (conversation.recommended_capabilities.length > 0) {
      console.log(`Recommendations: ${conversation.recommended_capabilities.length}\n`);
      conversation.recommended_capabilities.slice(0, 3).forEach((rec, idx) => {
        console.log(`${idx + 1}. ${rec.capability.name}`);
        console.log(`   Relevance: ${(rec.relevance_score * 100).toFixed(0)}%`);
        console.log(`   Reasoning: ${rec.reasoning}`);
        console.log();
      });
    }

    if (conversation.suggested_questions.length > 0) {
      console.log(`Suggested Questions:`);
      conversation.suggested_questions.forEach(q => console.log(`  • ${q}`));
      console.log();
    }

    console.log('═'.repeat(70));
    console.log('🎉 NEXUS is running with enhanced intelligence!');
    console.log('═'.repeat(70));
    console.log();

    return {
      success: true,
      registry,
      status,
      health,
      stats
    };

  } catch (error) {
    console.error('\n' + '═'.repeat(70));
    console.error('❌ NEXUS RESTART FAILED');
    console.error('═'.repeat(70));
    console.error(`Error: ${error}`);
    console.error();
    console.error('Troubleshooting:');
    console.error('  1. Check that all dependencies are installed');
    console.error('  2. Verify TypeScript compilation succeeded');
    console.error('  3. Ensure capability providers are available');
    console.error('  4. Review error logs above for details');
    console.error();
    
    return {
      success: false,
      error: String(error)
    };
  }
}

// Run NEXUS restart
restartNexus()
  .then(result => {
    if (result.success) {
      console.log('✅ NEXUS restart successful!\n');
      process.exit(0);
    } else {
      console.error('❌ NEXUS restart failed!\n');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Unexpected error during restart:', error);
    process.exit(1);
  });
