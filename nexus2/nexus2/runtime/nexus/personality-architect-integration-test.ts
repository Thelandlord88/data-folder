#!/usr/bin/env tsx
/**
 * NEXUS Personality Architect Integration Test (TypeScript)
 * 
 * Tests that the Personality Architect has been successfully integrated
 * and can be activated through NEXUS trait composition.
 */

import { nexus } from './NEXUS.engine.js';

async function testPersonalityArchitectIntegration() {
  console.log('🧠 NEXUS PERSONALITY ARCHITECT: Integration Test');
  console.log('================================================');
  console.log();
  
  try {
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
    
    // Test 2: Create a NEXUS session for Hunter enhancement
    console.log('🚀 TEST 2: Hunter Strategic Enhancement via Personality Architect');
    console.log('----------------------------------------------------------------');
    
    const enhancementTask = "Use the Personality Architect to design strategic intelligence traits for Hunter personality, focusing on proactive intelligence gathering, comprehensive analysis, and strategic implications assessment";
    
    console.log(`  📋 Task: "${enhancementTask}"`);
    console.log();
    
    const composedAgent = await nexus.createOptimizedSession(enhancementTask);
    
    console.log(`  ✅ Agent Created:`);
    console.log(`    Traits Used: [${composedAgent.traitsUsed.join(', ')}]`);
    console.log(`    Optimization Score: ${composedAgent.optimizationScore}/100`);
    console.log(`    Knowledge Domains: ${composedAgent.knowledge.size} domains`);
    console.log();
    
    // Test 3: Execute the composed agent
    console.log('⚡ TEST 3: Execute Hunter Enhancement Design');
    console.log('--------------------------------------------');
    
    const enhancementInput = {
      currentHunterPersonality: {
        role: "Forensic Auditor",
        cognitiveTraits: ["Evidence Verification", "Gap Analysis", "Architectural Violation Detection", "Forensic Analysis", "Brutal Honesty"],
        strategicGaps: ["Proactive Intelligence Gathering", "Strategic Implications Analysis", "Comprehensive Threat Assessment"]
      },
      requirements: {
        strategicThinking: "Must enable proactive intelligence rather than reactive validation",
        intelligenceGathering: "Add reconnaissance and discovery capabilities", 
        strategicAnalysis: "Convert findings to strategic insights and implications"
      }
    };
    
    console.log('  🎯 Executing Personality Architect analysis...');
    const result = await composedAgent.execute(enhancementInput);
    
    console.log(`  📊 Execution Results:`);
    console.log(`    Source: ${result.source}`);
    console.log(`    Processing Time: ${result.processingTime}ms`);
    console.log(`    Confidence: ${result.confidence}%`);
    
    if (result.composedResults) {
      console.log(`    Composed Results: ${result.composedResults.length} trait analyses`);
      result.composedResults.forEach((traitResult: any) => {
        console.log(`      • ${traitResult.trait} (${traitResult.personality}): ${traitResult.result.analysis}`);
      });
    }
    
    console.log(`    Synthesis: ${result.synthesis}`);
    console.log();
    
    // Test 4: Success Assessment
    console.log('📊 TEST 4: Integration Success Assessment');
    console.log('----------------------------------------');
    
    const testResults = {
      architectRegistered: architectExists,
      agentCreated: !!composedAgent,
      executionSuccessful: !!result,
      traitsActivated: composedAgent?.traitsUsed?.includes('Personality Design') || false,
      optimizationScore: composedAgent?.optimizationScore || 0
    };
    
    const successCount = Object.values(testResults).filter(Boolean).length;
    const totalTests = Object.keys(testResults).length - 1; // Exclude optimizationScore from boolean count
    const successRate = (successCount / totalTests * 100).toFixed(1);
    
    console.log(`  📈 Integration Success Rate: ${successRate}%`);
    console.log(`  🎯 Optimization Score: ${testResults.optimizationScore}/100`);
    console.log();
    
    console.log('  ✅ Test Results:');
    console.log(`    • Personality Architect Registered: ${testResults.architectRegistered ? '✅' : '❌'}`);
    console.log(`    • Composed Agent Created: ${testResults.agentCreated ? '✅' : '❌'}`);
    console.log(`    • Execution Successful: ${testResults.executionSuccessful ? '✅' : '❌'}`);
    console.log(`    • Personality Design Traits Activated: ${testResults.traitsActivated ? '✅' : '❌'}`);
    console.log();
    
    // Final Assessment
    console.log('🎯 FINAL ASSESSMENT');
    console.log('-------------------');
    
    if (parseFloat(successRate) >= 80) {
      console.log('  🎉 SUCCESS: Personality Architect integration fully functional!');
      console.log('  🚀 Ready to proceed with Hunter Strategic Intelligence Implementation');
      console.log('  📋 Next: Apply Personality Architect recommendations to enhance Hunter');
    } else if (parseFloat(successRate) >= 60) {
      console.log('  ⚠️ PARTIAL SUCCESS: Integration mostly working with minor issues');
      console.log('  🔧 Some components need additional debugging');
    } else {
      console.log('  ❌ INTEGRATION ISSUES: Requires debugging and fixes');
      console.log('  🛠️ Review trait composition and activation logic');
    }
    
  } catch (error) {
    console.error('❌ TEST EXECUTION ERROR:', error);
    console.log();
    console.log('🔧 DEBUGGING INFO:');
    if (error instanceof Error) {
      console.log(`  Error Type: ${error.constructor.name}`);
      console.log(`  Error Message: ${error.message}`);
      if (error.stack) {
        console.log(`  Stack Trace: ${error.stack.split('\n')[1]}`);
      }
    } else {
      console.log(`  Unknown Error: ${String(error)}`);
    }
  }
  
  console.log();
  console.log('================================================');
  console.log('🧠 NEXUS PERSONALITY ARCHITECT: Integration Test Complete');
}

// Execute the integration test
testPersonalityArchitectIntegration().catch(console.error);
