#!/usr/bin/env node
/**
 * NEXUS Trait Composition Bridge
 * 
 * This bridge connects the basic NEXUS runtime with the advanced trait composition system.
 * It enables intelligent trait selection instead of loading full personalities.
 */

import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the trait composition engine dynamically
let TraitIndexer = null;
let NEXUSOrchestrator = null;

async function loadTraitCompositionEngine() {
  try {
    // Use dynamic import with tsx to load TypeScript
    const { spawn } = await import('node:child_process');
    const { promisify } = await import('node:util');
    const execAsync = promisify(spawn);
    
    // For now, create a lightweight trait mapper until we can properly integrate
    return createTraitMapper();
  } catch (error) {
    console.warn('⚠️ Could not load trait composition engine:', error.message);
    return createTraitMapper();
  }
}

function createTraitMapper() {
  // Map personalities to their key traits for intelligent selection
  const personalityTraits = {
    bob: {
      coreTraits: ['systemicDebugging', 'empiricalValidation', 'brutalHonesty'],
      domains: ['debugging', 'testing', 'security', 'performance-analysis'],
      triggers: ['bug', 'debug', 'audit', 'verify', 'evidence', 'proof']
    },
    hunter: {
      coreTraits: ['evidenceGathering', 'riskAssessment', 'systematicHunting'],
      domains: ['failure-analysis', 'evidence', 'quality-assurance', 'prevention'],
      triggers: ['failure', 'hunt', 'evidence', 'risk', 'prevent', 'analyze']
    },
    stellar: {
      coreTraits: ['precisionAesthetics', 'spaceGradeReliability'],
      domains: ['visual-design', 'mathematical-spacing', 'accessibility', 'reliability'],
      triggers: ['glassmorphism', 'spacing', 'visual', 'precision', 'reliable']
    },
    flash: {
      coreTraits: ['performanceOptimization', 'speedExpertise'],
      domains: ['performance', 'optimization', 'speed', 'efficiency'],
      triggers: ['performance', 'speed', 'optimize', 'fast', 'slow', 'latency']
    },
    aria: {
      coreTraits: ['accessibilityChampion', 'inclusiveDesign'],
      domains: ['accessibility', 'inclusive-design', 'usability', 'wcag'],
      triggers: ['accessibility', 'a11y', 'wcag', 'inclusive', 'screen-reader']
    },
    touch: {
      coreTraits: ['mobileOptimization', 'gestureExpertise'],
      domains: ['mobile-ux', 'touch-interfaces', 'responsive-design'],
      triggers: ['mobile', 'touch', 'gesture', 'responsive', 'tablet']
    },
    daedalus: {
      coreTraits: ['architecturalThinking', 'systematicDesign'],
      domains: ['architecture', 'system-design', 'intelligence'],
      triggers: ['architecture', 'design', 'system', 'intelligence', 'systematic']
    },
    guardian: {
      coreTraits: ['qualityAssurance', 'systemicPrevention'],
      domains: ['quality-assurance', 'prevention', 'systemic-analysis'],
      triggers: ['quality', 'guardian', 'prevent', 'systemic', 'audit']
    }
  };

  return {
    selectOptimalTraits: (request, context = {}) => {
      const requestLower = request.toLowerCase();
      const relevantPersonalities = [];
      
      // Score personalities based on trigger word matches
      for (const [personalityId, traits] of Object.entries(personalityTraits)) {
        const score = traits.triggers.reduce((acc, trigger) => {
          return acc + (requestLower.includes(trigger) ? 1 : 0);
        }, 0);
        
        if (score > 0) {
          relevantPersonalities.push({ personalityId, score, traits });
        }
      }
      
      // Sort by relevance and take top 3 to prevent overload
      relevantPersonalities.sort((a, b) => b.score - a.score);
      return relevantPersonalities.slice(0, 3);
    },
    
    getPersonalityTraits: (personalityId) => {
      return personalityTraits[personalityId] || null;
    },
    
    getAllPersonalities: () => {
      return Object.keys(personalityTraits);
    }
  };
}

export class NEXUSTraitBridge {
  constructor() {
    this.traitMapper = null;
    this.initialized = false;
    this.compositionHistory = [];
  }

  async initialize() {
    if (this.initialized) return;
    
    console.log('🧬 Initializing NEXUS Trait Composition Bridge...');
    
    try {
      this.traitMapper = await loadTraitCompositionEngine();
      this.initialized = true;
      console.log('✅ Trait composition bridge initialized');
    } catch (error) {
      console.warn('⚠️ Trait bridge initialization failed:', error.message);
      this.traitMapper = createTraitMapper();
      this.initialized = true;
    }
  }

  /**
   * Enhanced personality selection using trait composition
   * Instead of loading full personalities, selects optimal traits
   */
  async selectOptimalPersonality(request, availablePersonalities = []) {
    if (!this.initialized) await this.initialize();
    
    if (!availablePersonalities.length) {
      availablePersonalities = this.traitMapper.getAllPersonalities();
    }
    
    // Get trait-based recommendations
    const recommendations = this.traitMapper.selectOptimalTraits(request);
    
    // Find the best available personality from recommendations
    for (const rec of recommendations) {
      if (availablePersonalities.includes(rec.personalityId)) {
        console.log(`🎯 Selected ${rec.personalityId} for request (relevance score: ${rec.score})`);
        return rec.personalityId;
      }
    }
    
    // Fallback to first available if no trait match
    const fallback = availablePersonalities[0];
    console.log(`🔄 Using fallback personality: ${fallback}`);
    return fallback;
  }

  /**
   * Get composition insights for a personality selection
   */
  getCompositionInsights(personalityId, request) {
    const traits = this.traitMapper.getPersonalityTraits(personalityId);
    if (!traits) return null;
    
    return {
      selectedPersonality: personalityId,
      relevantTraits: traits.coreTraits,
      knowledgeDomains: traits.domains,
      traitActivationReason: this.analyzeTraitActivation(request, traits),
      compositionStrategy: 'optimal-trait-selection'
    };
  }

  analyzeTraitActivation(request, traits) {
    const requestLower = request.toLowerCase();
    const matchedTriggers = traits.triggers.filter(trigger => 
      requestLower.includes(trigger)
    );
    
    return matchedTriggers.length > 0 
      ? `Activated by triggers: ${matchedTriggers.join(', ')}`
      : 'Fallback selection - no specific triggers matched';
  }

  /**
   * Record composition history for learning
   */
  recordComposition(personalityId, request, context, effectiveness = null) {
    this.compositionHistory.push({
      timestamp: Date.now(),
      personalityId,
      request: request.substring(0, 100), // Truncate for privacy
      context,
      effectiveness,
      insights: this.getCompositionInsights(personalityId, request)
    });
    
    // Keep only last 100 compositions
    if (this.compositionHistory.length > 100) {
      this.compositionHistory = this.compositionHistory.slice(-100);
    }
  }

  /**
   * Get composition analytics
   */
  getCompositionAnalytics() {
    const personalityUsage = {};
    const traitActivations = {};
    
    this.compositionHistory.forEach(comp => {
      personalityUsage[comp.personalityId] = (personalityUsage[comp.personalityId] || 0) + 1;
      
      if (comp.insights && comp.insights.relevantTraits) {
        comp.insights.relevantTraits.forEach(trait => {
          traitActivations[trait] = (traitActivations[trait] || 0) + 1;
        });
      }
    });
    
    return {
      totalCompositions: this.compositionHistory.length,
      personalityUsage,
      traitActivations,
      averageEffectiveness: this.calculateAverageEffectiveness()
    };
  }

  calculateAverageEffectiveness() {
    const withEffectiveness = this.compositionHistory.filter(c => c.effectiveness !== null);
    if (withEffectiveness.length === 0) return null;
    
    const sum = withEffectiveness.reduce((acc, c) => acc + c.effectiveness, 0);
    return sum / withEffectiveness.length;
  }

  getStatus() {
    return {
      initialized: this.initialized,
      traitCompositionEnabled: !!this.traitMapper,
      compositionsPerformed: this.compositionHistory.length,
      availablePersonalities: this.traitMapper ? this.traitMapper.getAllPersonalities().length : 0
    };
  }
}

// Export singleton instance
export const nexusTraitBridge = new NEXUSTraitBridge();
