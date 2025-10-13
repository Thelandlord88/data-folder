#!/usr/bin/env node
/**
 * Test Enhanced Pattern Evolution and Breakthrough Analysis
 * 
 * This test demonstrates:
 * 1. Pattern effectiveness evolution
 * 2. Pattern relationship learning (synergy detection)
 * 3. Emergent pattern discovery
 * 4. Multi-dimensional breakthrough analysis
 * 5. Context-aware pattern recommendations
 */

import { getPatternEvolutionEngine } from './PatternEvolutionEngine.js';
import { getBreakthroughAnalyzer } from './BreakthroughAnalyzer.js';

console.log('🧪 Testing Enhanced Pattern Evolution System\n');
console.log('=' .repeat(70));

async function testPatternEvolution() {
  console.log('\n📊 TEST 1: Pattern Effectiveness Evolution');
  console.log('-'.repeat(70));
  
  const engine = getPatternEvolutionEngine();
  await engine.load();
  
  console.log('\n Initial effectiveness:');
  const initialPatterns = engine.getAllPatterns();
  for (const [name, effectiveness] of Object.entries(initialPatterns)) {
    console.log(`   ${name}: ${(effectiveness * 100).toFixed(1)}%`);
  }
  
  // Simulate successful outcome
  console.log('\n📈 Recording successful outcome for problem-decomposition...');
  await engine.recordOutcome(
    'problem-decomposition',
    true,
    {
      task_completion: 0.95,
      accuracy: 0.92,
      efficiency_gain: 1.8
    },
    'security audit task'
  );
  
  // Simulate failed outcome
  console.log('\n📉 Recording failed outcome for workflow-efficiency...');
  await engine.recordOutcome(
    'workflow-efficiency',
    false,
    {
      task_completion: 0.6,
      accuracy: 0.7,
      efficiency_gain: 0.9
    },
    'optimization attempt'
  );
  
  console.log('\n Updated effectiveness:');
  const updatedPatterns = engine.getAllPatterns();
  for (const [name, effectiveness] of Object.entries(updatedPatterns)) {
    console.log(`   ${name}: ${(effectiveness * 100).toFixed(1)}%`);
  }
}

async function testPatternRelationships() {
  console.log('\n\n🔗 TEST 2: Pattern Relationship Learning (Synergy Detection)');
  console.log('-'.repeat(70));
  
  const engine = getPatternEvolutionEngine();
  
  // Record outcomes with multiple patterns
  console.log('\n✅ Recording successful multi-pattern usage...');
  await engine.recordEnhancedOutcome(
    ['systems-thinking', 'problem-decomposition'],
    true,
    {
      task_completion: 0.98,
      accuracy: 0.96,
      efficiency_gain: 2.5  // High gain indicates synergy!
    },
    'complex architecture analysis'
  );
  
  // Check relationship
  const relationship = engine.getRelationshipStrength('systems-thinking', 'problem-decomposition');
  if (relationship) {
    console.log('\n🔗 Relationship detected:');
    console.log(`   Strength: ${relationship.strength.toFixed(2)}`);
    console.log(`   Synergy Multiplier: ${relationship.synergy_multiplier.toFixed(2)}x`);
    console.log(`   Co-activations: ${relationship.co_activation_count}`);
  }
}

async function testEmergentPatterns() {
  console.log('\n\n✨ TEST 3: Emergent Pattern Discovery');
  console.log('-'.repeat(70));
  
  const engine = getPatternEvolutionEngine();
  
  console.log('\n🎯 Recording exceptional outcome with pattern combination...');
  await engine.recordEnhancedOutcome(
    ['systems-thinking', 'problem-decomposition', 'workflow-efficiency'],
    true,
    {
      task_completion: 1.0,
      accuracy: 0.98,
      efficiency_gain: 3.2  // Very high gain - possible emergent capability!
    },
    'comprehensive system optimization'
  );
  
  const emergentPatterns = engine.getEmergentPatterns();
  if (emergentPatterns.size > 0) {
    console.log('\n✨ Emergent patterns discovered:');
    for (const [key, pattern] of emergentPatterns.entries()) {
      console.log(`\n   Pattern: ${key}`);
      console.log(`   Effectiveness: ${pattern.effectiveness.toFixed(2)}x`);
      console.log(`   Activations: ${pattern.activation_frequency}`);
      console.log(`   Discovered: ${pattern.discovered_at}`);
    }
  } else {
    console.log('\n   No emergent patterns discovered yet');
  }
}

async function testBreakthroughAnalysis() {
  console.log('\n\n🎯 TEST 4: Multi-Dimensional Breakthrough Analysis');
  console.log('-'.repeat(70));
  
  const analyzer = getBreakthroughAnalyzer();
  
  const testCases = [
    {
      context: 'WAIT. WAIT. This is unprecedented! We discovered a revolutionary optimization that gives us 10x performance improvement!',
      metrics: {
        task_completion: 1.0,
        accuracy: 0.95,
        efficiency_gain: 10.0
      },
      patterns: ['systems-thinking', 'problem-decomposition']
    },
    {
      context: 'Made a small improvement to the caching system',
      metrics: {
        task_completion: 0.8,
        accuracy: 0.85,
        efficiency_gain: 1.2
      },
      patterns: ['workflow-efficiency']
    }
  ];
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n📝 Test Case ${i + 1}:`);
    console.log(`   Context: "${testCase.context.slice(0, 60)}..."`);
    
    const analysis = analyzer.analyzeBreakthrough(
      testCase.metrics,
      testCase.context,
      testCase.patterns
    );
    
    console.log(`\n   ${analyzer.isBreakthrough(analysis) ? '🎯 BREAKTHROUGH' : '💡 Regular Insight'}`);
    console.log(`   Composite Score: ${(analysis.composite_score * 100).toFixed(1)}%`);
    console.log(`   Classification: ${analyzer.classifyBreakthrough(analysis)}`);
    console.log(`   Breakdown:`);
    console.log(`      Significance:     ${(analysis.significance * 100).toFixed(1)}%`);
    console.log(`      Novelty:         ${(analysis.novelty * 100).toFixed(1)}%`);
    console.log(`      Impact:          ${(analysis.impact * 100).toFixed(1)}%`);
    console.log(`      Reproducibility: ${(analysis.reproducibility * 100).toFixed(1)}%`);
  }
}

async function testContextAwareRecommendations() {
  console.log('\n\n🎯 TEST 5: Context-Aware Pattern Recommendations');
  console.log('-'.repeat(70));
  
  const engine = getPatternEvolutionEngine();
  
  const contexts = [
    { keywords: ['security', 'audit'], description: 'Security audit task' },
    { keywords: ['optimize', 'performance'], description: 'Performance optimization' },
    { keywords: ['architecture', 'design'], description: 'System architecture design' }
  ];
  
  for (const context of contexts) {
    console.log(`\n📋 Context: ${context.description}`);
    console.log(`   Keywords: [${context.keywords.join(', ')}]`);
    
    const recommended = engine.getOptimalPatternCombination(context.keywords);
    console.log(`   🎯 Recommended patterns:`);
    for (const pattern of recommended) {
      const effectiveness = engine.getEffectiveness(pattern);
      console.log(`      • ${pattern} (${(effectiveness * 100).toFixed(1)}%)`);
    }
  }
}

async function showEvolutionStats() {
  console.log('\n\n📊 EVOLUTION ENGINE STATISTICS');
  console.log('-'.repeat(70));
  
  const engine = getPatternEvolutionEngine();
  const stats = engine.getStats();
  
  console.log(`\n   Total Patterns: ${stats.totalPatterns}`);
  console.log(`   Average Effectiveness: ${(stats.averageEffectiveness * 100).toFixed(1)}%`);
  console.log(`   Total Adaptations: ${stats.totalAdaptations}`);
  console.log(`   Last Update: ${stats.lastUpdate || 'Never'}`);
  
  // Save evolved state
  await engine.save();
  console.log('\n💾 Pattern evolution state saved!');
}

// Run all tests
async function runAllTests() {
  try {
    await testPatternEvolution();
    await testPatternRelationships();
    await testEmergentPatterns();
    await testBreakthroughAnalysis();
    await testContextAwareRecommendations();
    await showEvolutionStats();
    
    console.log('\n\n✅ All tests completed successfully!');
    console.log('=' .repeat(70));
    console.log('\n🎉 Enhanced Pattern Evolution System is fully operational!\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

runAllTests();
