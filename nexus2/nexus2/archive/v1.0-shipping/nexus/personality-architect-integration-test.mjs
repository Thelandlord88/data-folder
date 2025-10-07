#!/usr/bin/env node
/**
 * NEXUS Personality Architect Integration Test
 * 
 * Tests that the Personality Architect has been successfully integrated
 * and can be activated through NEXUS trait composition.
 */

import { nexus } from './NEXUS.engine.js';

async function testPersonalityArchitectIntegration() {
  console.log('🧠 NEXUS PERSONALITY ARCHITECT: Integration Test');
  console.log('================================================');
  console.log();
  
  // Test 1: Verify Personality Architect is loaded
  console.log('🔍 TEST 1: Personality Architect Registration');
  console.log('---------------------------------------------');
  
  const allPersonalities = nexus.getAllPersonalities();
  const architectExists = allPersonalities.has('architect');
  
  console.log(`  Personality Architect Registered: ${architectExists ? '✅ YES' : '❌ NO'}`);
  
  if (architectExists) {
    const architect = allPersonalities.get('architect');
    console.log(`  Identity: ${architect.identity.name}`);
    console.log(`  Role: ${architect.identity.role}`);
    console.log(`  Cognitive Traits: ${Object.keys(architect.cognitiveTraits).length}`);
    console.log(`  Traits: [${Object.keys(architect.cognitiveTraits).join(', ')}]`);
  }
  console.log();
  
  // Test 2: Verify Trait Activation Triggers
  console.log('🎯 TEST 2: Activation Trigger Testing');
  console.log('-------------------------------------');
  
  const testTriggers = [
    'personality design',
    'improve personality', 
    'trait composition',
    'create personality',
    'enhance personality',
    'meta-cognitive analysis'
  ];
  
  const traitIndexer = nexus.getTraitIndexer();
  
  testTriggers.forEach(trigger => {
    const matchingTraits = traitIndexer.findTraitsByTrigger(trigger);
    const architectTraits = matchingTraits.filter(trait => trait.personalityId === 'architect');
    
    console.log(`  "${trigger}": ${architectTraits.length > 0 ? '✅' : '❌'} (${architectTraits.length} traits)`);
    if (architectTraits.length > 0) {
      architectTraits.forEach(trait => {
        console.log(`    → ${trait.name} (${trait.expertise}% expertise)`);
      });
    }
  });
  console.log();
  
  // Test 3: Task Analysis Integration
  console.log('🧩 TEST 3: Task Analysis Integration');
  console.log('-----------------------------------');
  
  const testTasks = [
    "Design a new personality for quantum computing optimization",
    "Improve the Hunter personality with better traits",
    "Create a personality architect that enhances other personalities",
    "Analyze trait synergies between different personalities"
  ];
  
  testTasks.forEach(task => {
    console.log(`  📋 Task: "${task}"`);
    
    const taskAnalyzer = nexus.getTaskAnalyzer();
    const requiredTraits = taskAnalyzer.extractRequiredTraits(task);
    const architectTraits = requiredTraits.filter(trait => 
      ['Personality Design', 'Trait Synergy Optimization', 'Meta-Cognitive Analysis', 
       'Personality Gap Analysis', 'Activation Trigger Optimization'].includes(trait)
    );
    
    console.log(`    Required Traits: [${requiredTraits.join(', ')}]`);
    console.log(`    Architect Traits: ${architectTraits.length > 0 ? '✅' : '❌'} [${architectTraits.join(', ')}]`);
    console.log();
  });
  
  // Test 4: Meta-Cognitive Capability Test
  console.log('🧠 TEST 4: Meta-Cognitive Capability');
  console.log('------------------------------------');
  
  if (architectExists) {
    const architect = allPersonalities.get('architect');
    const metaCognitiveTrait = architect.cognitiveTraits.metaCognitiveAnalysis;
    
    console.log(`  Meta-Cognitive Trait: ${metaCognitiveTrait ? '✅ Present' : '❌ Missing'}`);
    if (metaCognitiveTrait) {
      console.log(`    Name: ${metaCognitiveTrait.name}`);
      console.log(`    Description: ${metaCognitiveTrait.description}`);
      console.log(`    Expertise: ${metaCognitiveTrait.expertise}%`);
      console.log(`    Activation Triggers: [${metaCognitiveTrait.activationTriggers.join(', ')}]`);
      console.log(`    Knowledge Domains: [${metaCognitiveTrait.knowledgeDomains.join(', ')}]`);
    }
  }
  console.log();
  
  // Test 5: Integration Summary
  console.log('📊 TEST 5: Integration Summary');
  console.log('------------------------------');
  
  const integrationResults = {
    personalityRegistered: architectExists,
    traitsRegistered: architectExists ? Object.keys(allPersonalities.get('architect').cognitiveTraits).length : 0,
    activationTriggersWorking: testTriggers.some(trigger => {
      const matchingTraits = traitIndexer.findTraitsByTrigger(trigger);
      return matchingTraits.some(trait => trait.personalityId === 'architect');
    }),
    taskAnalysisIntegrated: testTasks.some(task => {
      const requiredTraits = nexus.getTaskAnalyzer().extractRequiredTraits(task);
      return requiredTraits.some(trait => 
        ['Personality Design', 'Trait Synergy Optimization', 'Meta-Cognitive Analysis'].includes(trait)
      );
    }),
    metaCognitiveCapable: architectExists && allPersonalities.get('architect').cognitiveTraits.metaCognitiveAnalysis
  };
  
  const successCount = Object.values(integrationResults).filter(result => 
    typeof result === 'boolean' ? result : result > 0
  ).length;
  const totalTests = Object.keys(integrationResults).length;
  const successRate = (successCount / totalTests * 100).toFixed(1);
  
  console.log(`  📈 Integration Success Rate: ${successRate}% (${successCount}/${totalTests})`);
  console.log();
  console.log('  ✅ Integration Results:');
  console.log(`    • Personality Registered: ${integrationResults.personalityRegistered ? '✅' : '❌'}`);
  console.log(`    • Traits Registered: ${integrationResults.traitsRegistered > 0 ? '✅' : '❌'} (${integrationResults.traitsRegistered})`);
  console.log(`    • Activation Triggers: ${integrationResults.activationTriggersWorking ? '✅' : '❌'}`);
  console.log(`    • Task Analysis Integration: ${integrationResults.taskAnalysisIntegrated ? '✅' : '❌'}`);
  console.log(`    • Meta-Cognitive Capability: ${integrationResults.metaCognitiveCapable ? '✅' : '❌'}`);
  console.log();
  
  // Final Assessment
  console.log('🎯 FINAL ASSESSMENT');
  console.log('-------------------');
  
  if (successRate >= 80) {
    console.log('  🎉 SUCCESS: Personality Architect successfully integrated!');
    console.log('  🚀 NEXUS now has recursive personality improvement capability');
    console.log('  📋 Ready for Phase 2: Strategic Intelligence Implementation');
  } else if (successRate >= 60) {
    console.log('  ⚠️ PARTIAL SUCCESS: Integration mostly working with minor issues');
    console.log('  🔧 Recommend debugging and completing integration');
  } else {
    console.log('  ❌ INTEGRATION FAILED: Major issues detected');
    console.log('  🛠️ Requires significant debugging and rework');
  }
  
  console.log();
  console.log('================================================');
  console.log('🧠 NEXUS PERSONALITY ARCHITECT: Integration Test Complete');
  console.log(`📊 Result: ${successRate}% success rate`);
  console.log('⚡ Next: Test recursive personality improvement capability');
}

// Execute the integration test
testPersonalityArchitectIntegration().catch(console.error);
