#!/usr/bin/env node
/**
 * NEXUS Trait Composition Bridge
 * 
 * Bridges the gap between NEXUS runtime and trait composition system
 */

// Simple module approach for better compatibility
let traitIndexer = null;
let NEXUSOrchestrator = null;

// Try to load trait composition system
try {
  const engine = await import('./NEXUS.engine.js');
  if (engine.TraitIndexer) {
    traitIndexer = new engine.TraitIndexer();
    NEXUSOrchestrator = engine.NEXUSOrchestrator;
    console.log('🧠 Trait composition system loaded');
  }
} catch (err) {
  console.log('⚠️ Trait composition system not available:', err.message);
}

/**
 * Enhance a personality with trait composition intelligence
 */
export async function enhancePersonalityWithTraits(personalityName, request, context = {}) {
  // If trait system is available, use intelligent selection
  if (traitIndexer && NEXUSOrchestrator) {
    try {
      const orchestrator = new NEXUSOrchestrator(traitIndexer);
      
      // Create optimized session for the request
      const session = await orchestrator.createOptimizedSession(request, {
        domain: context.domain || 'general',
        complexity: context.complexity || 'moderate',
        requiredCapabilities: context.requiredCapabilities || []
      });

      return {
        enhanced: true,
        traits: Array.from(session.traits.keys()),
        optimizationScore: session.optimizationScore,
        cognitiveInsights: generateCognitiveInsights(session),
        traitComposition: true
      };
    } catch (error) {
      console.warn('⚠️ Trait composition failed, falling back to basic personality:', error.message);
    }
  }

  // Fallback: basic personality loading
  return {
    enhanced: false,
    traits: [personalityName],
    optimizationScore: 50,
    cognitiveInsights: [],
    traitComposition: false
  };
}

/**
 * Generate cognitive insights from trait composition
 */
function generateCognitiveInsights(session) {
  const insights = [];
  
  if (session.traits.size > 1) {
    insights.push(`Multi-trait composition active: ${Array.from(session.traits.keys()).join(', ')}`);
  }
  
  if (session.optimizationScore > 80) {
    insights.push('High optimization score indicates excellent trait-task alignment');
  }
  
  if (session.traits.has('evidenceVerification')) {
    insights.push('Evidence verification patterns active - responses will include verification methods');
  }
  
  if (session.traits.has('performanceOptimization')) {
    insights.push('Performance optimization focus - recommendations will prioritize speed and efficiency');
  }

  return insights;
}

/**
 * Get available personalities from both trait system and JSON files
 */
export function getAvailablePersonalities() {
  const personalities = new Set();
  
  // Add trait system personalities
  if (traitIndexer) {
    personalities.add('bob');
    personalities.add('hunter');
    personalities.add('stellar');
    personalities.add('flash');
    personalities.add('aria');
    personalities.add('touch');
  }
  
  // Add JSON-based personalities
  personalities.add('daedalus');
  personalities.add('guardian');
  
  return Array.from(personalities);
}

/**
 * Check if a personality uses trait composition
 */
export function isTraitComposed(personalityName) {
  return traitIndexer && ['bob', 'hunter', 'stellar', 'flash', 'aria', 'touch'].includes(personalityName);
}

// CLI testing interface
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🧠 NEXUS Trait Bridge Test');
  console.log('==========================');
  
  console.log('Available personalities:', getAvailablePersonalities());
  
  // Test trait composition
  const testRequests = [
    { personality: 'hunter', request: 'audit system security' },
    { personality: 'stellar', request: 'optimize visual design' },
    { personality: 'flash', request: 'improve performance' }
  ];
  
  for (const test of testRequests) {
    console.log(`\nTesting ${test.personality}:`);
    const result = await enhancePersonalityWithTraits(test.personality, test.request);
    console.log(`  Trait composition: ${result.traitComposition}`);
    console.log(`  Optimization score: ${result.optimizationScore}`);
    console.log(`  Traits used: ${result.traits.join(', ')}`);
  }
}
