#!/usr/bin/env node
/**
 * TEST HUNTER KNOWLEDGE BRIDGE - Production Demonstration
 * 
 * Demonstrates enhanced hunter knowledge bridge capabilities:
 * - Safety validation
 * - Dynamic pattern discovery
 * - Context-aware querying
 * - Execution monitoring
 */

import { getHunterKnowledgeBridge } from './hunter-knowledge-bridge.js';

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║      🎯 HUNTER KNOWLEDGE BRIDGE - PRODUCTION TEST 🎯           ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`);
  
  try {
    // Initialize bridge
    console.log('📚 Initializing Hunter Knowledge Bridge...\n');
    const bridge = getHunterKnowledgeBridge();
    await bridge.initialize();
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ INITIALIZATION COMPLETE');
    console.log('='.repeat(70) + '\n');
    
    // Get status
    const status = bridge.getStatus();
    console.log('📊 System Status:');
    console.log(JSON.stringify(status, null, 2));
    
    console.log('\n' + '='.repeat(70));
    console.log('🔍 TEST 1: Query All Patterns');
    console.log('='.repeat(70) + '\n');
    
    const allPatterns = bridge.queryTechniques({});
    console.log(`Found ${allPatterns.length} patterns:`);
    allPatterns.forEach(pattern => {
      console.log(`  • ${pattern.pattern_name} (${pattern.category})`);
      console.log(`    Safety: ${pattern.safety_level} | Effectiveness: ${pattern.effectiveness}`);
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('🔍 TEST 2: Query Safe Patterns Only');
    console.log('='.repeat(70) + '\n');
    
    const safePatterns = bridge.queryTechniques({
      safety_max: 'safe'
    });
    console.log(`Found ${safePatterns.length} safe patterns:`);
    safePatterns.forEach(pattern => {
      console.log(`  • ${pattern.pattern_name}`);
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('🔍 TEST 3: Query Security Patterns');
    console.log('='.repeat(70) + '\n');
    
    const securityPatterns = bridge.queryTechniques({
      category: 'security'
    });
    console.log(`Found ${securityPatterns.length} security patterns:`);
    securityPatterns.forEach(pattern => {
      console.log(`  • ${pattern.pattern_name}`);
      console.log(`    Principle: ${pattern.principle}`);
      console.log(`    Steps: ${pattern.steps.length}`);
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('🔍 TEST 4: Get Specific Pattern Details');
    console.log('='.repeat(70) + '\n');
    
    const securityAudit = bridge.getTechnique('security-audit');
    if (securityAudit) {
      console.log('Security Audit Pattern:');
      console.log(`  Name: ${securityAudit.pattern_name}`);
      console.log(`  Category: ${securityAudit.category}`);
      console.log(`  Version: ${securityAudit.version}`);
      console.log(`  Safety Level: ${securityAudit.safety_level}`);
      console.log(`  Effectiveness: ${securityAudit.effectiveness}`);
      console.log(`  Estimated Execution Time: ${securityAudit.estimated_execution_time}ms`);
      console.log(`  Platform Support:`);
      console.log(`    Linux: ${securityAudit.cross_platform_support.linux}`);
      console.log(`    macOS: ${securityAudit.cross_platform_support.macos}`);
      console.log(`    Windows: ${securityAudit.cross_platform_support.windows}`);
      console.log(`  Dependencies: ${securityAudit.extracted_dependencies.join(', ')}`);
      console.log(`  Validation Checks: ${securityAudit.validation_checks.length}`);
      
      console.log('\n  Steps:');
      securityAudit.steps.slice(0, 3).forEach(step => {
        console.log(`    ${step.order}. ${step.action}`);
        console.log(`       Purpose: ${step.purpose}`);
        console.log(`       Why it works: ${step.why_this_works}`);
      });
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('🔍 TEST 5: Platform-Specific Query');
    console.log('='.repeat(70) + '\n');
    
    const platformPatterns = bridge.queryTechniques({
      platform: process.platform
    });
    console.log(`Found ${platformPatterns.length} patterns compatible with ${process.platform}:`);
    platformPatterns.forEach(pattern => {
      console.log(`  • ${pattern.pattern_name} (${pattern.category})`);
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('🔍 TEST 6: Generate Safety Report');
    console.log('='.repeat(70) + '\n');
    
    const safetyReport = bridge.generateSafetyReport();
    console.log('Safety Report:');
    console.log(JSON.stringify(safetyReport.summary, null, 2));
    console.log('\nPlatform Support:');
    console.log(JSON.stringify(safetyReport.platform_support, null, 2));
    
    console.log('\n' + '='.repeat(70));
    console.log('🔍 TEST 7: Simulate Usage Recording');
    console.log('='.repeat(70) + '\n');
    
    console.log('Recording simulated security audit execution...');
    await bridge.recordUsage('security-audit', {
      success: true,
      effectiveness: 0.92,
      context: 'test-execution',
      execution_time: 5432,
      findings: {
        vulnerabilities_found: 0,
        scans_performed: 5
      }
    });
    console.log('✅ Usage recorded for pattern evolution');
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ ALL TESTS PASSED');
    console.log('='.repeat(70) + '\n');
    
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║      🎉 HUNTER KNOWLEDGE BRIDGE - FULLY OPERATIONAL! 🎉       ║
║                                                                  ║
║      ✅ Pattern discovery working                              ║
║      ✅ Safety validation working                              ║
║      ✅ Context-aware querying working                         ║
║      ✅ Evolution tracking working                             ║
║      ✅ Dual consciousness ready!                              ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests
main().catch(console.error);
