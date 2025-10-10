#!/usr/bin/env node
/**
 * NEXUS Trait Composition Bridge
 * 
 * Bridges the gap between NEXUS runtime (which loads JSON personalities)
 * and the trait composition system (which intelligently selects optimal traits).
 * 
 * This allows the runtime to benefit from intelligent trait selection
 * without requiring a complete rewrite of the existing system.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Import trait composition system (when compiled or using tsx)
let TraitIndexer, NEXUSOrchestrator;
try {
  const engine = require('./NEXUS.engine.js');
  TraitIndexer = engine.TraitIndexer;
  NEXUSOrchestrator = engine.NEXUSOrchestrator;
} catch (err) {
  console.log('⚠️ Trait composition system not compiled. Using basic personality loading.');
}

export class TraitBridge {
    if (TraitIndexer) {
      this.traitIndexer = new TraitIndexer();
      console.log('🧠 Trait composition system loaded');
    }
  }

  /**
   * Enhance a basic personality with trait composition intelligence
   */
  async enhancePersonality(personalityName, request, context = {}) {
    // If trait system is available, use intelligent selection
    if (this.traitIndexer && NEXUSOrchestrator) {
      try {
        const orchestrator = new NEXUSOrchestrator(this.traitIndexer);
        
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
          cognitiveInsights: this.generateCognitiveInsights(session),
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
  generateCognitiveInsights(session) {
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
  getAvailablePersonalities() {
    const personalities = new Set();
    
    // Add trait system personalities
    if (this.traitIndexer) {
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
  isTraitComposed(personalityName) {
    return this.traitIndexer && ['bob', 'hunter', 'stellar', 'flash', 'aria', 'touch'].includes(personalityName);
  }
}

// Export singleton instance
export const traitBridge = new TraitBridge();

// CLI testing interface
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🧠 NEXUS Trait Bridge Test');
  console.log('==========================');
  
  const bridge = new TraitBridge();
  
  console.log('Available personalities:', bridge.getAvailablePersonalities());
  
  // Test trait composition
  const testRequests = [
    { personality: 'hunter', request: 'audit system security' },
    { personality: 'stellar', request: 'optimize visual design' },
    { personality: 'flash', request: 'improve performance' }
  ];
  
  for (const test of testRequests) {
    console.log(`\nTesting ${test.personality}:`);
    bridge.enhancePersonality(test.personality, test.request).then(result => {
      console.log(`  Trait composition: ${result.traitComposition}`);
      console.log(`  Optimization score: ${result.optimizationScore}`);
      console.log(`  Traits used: ${result.traits.join(', ')}`);
    });
  }
}
