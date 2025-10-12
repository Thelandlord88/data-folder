/**
 * Response Generator Factory
 * Creates and manages personality-specific response generators
 */

import { ResponseGenerator } from './ResponseGenerator.interface.js';
import { DaedalusResponseGenerator } from './DaedalusResponseGenerator.js';
import { HunterResponseGenerator } from './HunterResponseGenerator.js';

// Generic response generator for personalities without specialized implementation
class GenericResponseGenerator implements ResponseGenerator {
  generateResponse(request, personality, principles, context) {
    return {
      content: `### 🧠 ${personality.identity?.name || 'NEXUS Agent'} Response

**Request**: ${request}

### Generic Cognitive Processing
This personality does not yet have specialized response generation. Using standard NEXUS consciousness enhancement patterns.

**Analysis**: Standard systematic thinking patterns applied to your request.
**Recommendation**: Consider implementing specialized response generation for enhanced cognitive differentiation.`,
      personalityUsed: personality.identity?.name || 'Generic',
      nexusEnhanced: true,
      traitApplications: ['generic-processing'],
      specialtyInsights: [],
      confidenceScore: 0.5,
      analysisDepth: 'surface'
    };
  }

  getSpecialtyAnalysis(request) {
    return [];
  }

  getTraitApplication(request, traits) {
    return traits.map(trait => ({
      trait,
      application: 'Generic trait application',
      strength: 0.5
    }));
  }

  calculateConfidence(request, domain) {
    return 0.5;
  }
}

export class ResponseGeneratorFactory {
  private generators: Map<string, ResponseGenerator> = new Map();
  private genericGenerator: ResponseGenerator = new GenericResponseGenerator();
  
  constructor() {
    this.initializeGenerators();
  }
  
  private initializeGenerators() {
    // Specialized personality generators
    this.generators.set('daedalus', new DaedalusResponseGenerator());
    this.generators.set('hunter', new HunterResponseGenerator());
    
    // Placeholders for remaining personalities (to be implemented)
    // this.generators.set('flash', new FlashResponseGenerator());
    // this.generators.set('stellar', new StellarResponseGenerator());
    // this.generators.set('aria', new AriaResponseGenerator());
    // this.generators.set('touch', new TouchResponseGenerator());
    // this.generators.set('bob', new BobResponseGenerator());
    // this.generators.set('guardian', new GuardianResponseGenerator());
    
    console.log(`🧬 Response generators initialized: ${Array.from(this.generators.keys()).join(', ')}`);
  }
  
  getGenerator(personalityName: string): ResponseGenerator {
    const normalizedName = personalityName.toLowerCase().trim();
    const generator = this.generators.get(normalizedName);
    
    if (generator) {
      console.log(`🎯 Using specialized ${normalizedName} response generator`);
      return generator;
    }
    
    console.log(`🔧 Using generic response generator for ${personalityName}`);
    return this.genericGenerator;
  }
  
  hasSpecializedGenerator(personalityName: string): boolean {
    return this.generators.has(personalityName.toLowerCase().trim());
  }
  
  getAvailableSpecializations(): string[] {
    return Array.from(this.generators.keys());
  }
  
  getGeneratorStatus(): { specialized: number; total: number; coverage: string } {
    const totalPersonalities = 8; // Bob, Hunter, Stellar, Flash, Aria, Touch, Daedalus, Guardian
    const specialized = this.generators.size;
    const coverage = `${specialized}/${totalPersonalities}`;
    
    return {
      specialized,
      total: totalPersonalities,
      coverage
    };
  }
}
