/**
 * Personality Registry Loader
 * Loads personality definitions and creates registry for auto-generation
 */

import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class PersonalityRegistryLoader {
  constructor() {
    this.profilesPath = resolve(__dirname, '../../profiles');
    this.personalityRegistry = new Map();
  }

  async loadAllPersonalities() {
    const personalities = [
      'aria', 'atlas', 'atlas-geo', 'cipher', 'daedalus', 'flash', 'forge', 'guardian', 
      'hunter', 'localize', 'nexus-api', 'personality-architect', 'property-sage', 'pulse', 'route-master', 
      'sage', 'scribe', 'stellar', 'touch'
    ];

    console.log('📋 Loading personality registry...');
    
    for (const personalityName of personalities) {
      try {
        await this.loadPersonality(personalityName);
      } catch (error) {
        console.warn(`⚠️ Could not load ${personalityName}: ${error.message}`);
      }
    }

    console.log(`✅ Personality registry loaded: ${Array.from(this.personalityRegistry.keys()).join(', ')}`);
    return this.personalityRegistry;
  }

  async loadPersonality(personalityName) {
    const filePath = resolve(this.profilesPath, `${personalityName}.json`);
    
    try {
      const fileContent = await readFile(filePath, 'utf-8');
      const personalityData = JSON.parse(fileContent);
      
      // Validate personality data
      if (this.validatePersonalityData(personalityData)) {
        this.personalityRegistry.set(personalityName.toLowerCase(), personalityData);
        console.log(`  ✅ Loaded ${personalityName} (${Object.keys(personalityData.cognitiveTraits || {}).length} traits)`);
      } else {
        console.warn(`  ⚠️ Invalid personality data for ${personalityName}`);
      }
    } catch (error) {
      throw new Error(`Failed to load ${personalityName}: ${error.message}`);
    }
  }

  validatePersonalityData(data) {
    return data && 
           data.identity && 
           data.identity.name && 
           (data.cognitiveTraits || data.ideology?.principles);
  }

  getPersonalityRegistry() {
    return this.personalityRegistry;
  }

  getPersonality(name) {
    return this.personalityRegistry.get(name.toLowerCase());
  }

  getPersonalityTraits(name) {
    const personality = this.getPersonality(name);
    return personality?.cognitiveTraits || {};
  }

  getPersonalityPrinciples(name) {
    const personality = this.getPersonality(name);
    return personality?.ideology?.principles || [];
  }

  analyzeRegistry() {
    const analysis = {
      totalPersonalities: this.personalityRegistry.size,
      personalitiesWithTraits: 0,
      personalitiesWithPrinciples: 0,
      totalTraits: 0,
      traitDistribution: {},
      personalityBreakdown: []
    };

    for (const [name, data] of this.personalityRegistry) {
      const traits = Object.keys(data.cognitiveTraits || {});
      const principles = data.ideology?.principles || [];
      
      if (traits.length > 0) analysis.personalitiesWithTraits++;
      if (principles.length > 0) analysis.personalitiesWithPrinciples++;
      
      analysis.totalTraits += traits.length;
      
      // Count trait types
      traits.forEach(trait => {
        analysis.traitDistribution[trait] = (analysis.traitDistribution[trait] || 0) + 1;
      });

      analysis.personalityBreakdown.push({
        name,
        traits: traits.length,
        principles: principles.length,
        autoGenerationReady: traits.length > 0 || principles.length > 0
      });
    }

    return analysis;
  }

  getAutoGenerationCapabilities() {
    const capabilities = [];
    
    for (const [name, data] of this.personalityRegistry) {
      const traits = data.cognitiveTraits || {};
      const principles = data.ideology?.principles || [];
      
      const capability = {
        personality: name,
        canAutoGenerate: Object.keys(traits).length > 0 || principles.length > 0,
        traitCount: Object.keys(traits).length,
        principleCount: principles.length,
        expertise: this.calculateAverageExpertise(traits),
        knowledgeDomains: this.extractKnowledgeDomains(traits)
      };
      
      capabilities.push(capability);
    }
    
    return capabilities.sort((a, b) => b.expertise - a.expertise);
  }

  calculateAverageExpertise(traits) {
    const expertiseValues = Object.values(traits)
      .map(trait => trait.expertise || 50)
      .filter(val => val > 0);
    
    return expertiseValues.length > 0 
      ? expertiseValues.reduce((sum, val) => sum + val, 0) / expertiseValues.length
      : 50;
  }

  extractKnowledgeDomains(traits) {
    const domains = [];
    Object.values(traits).forEach(trait => {
      if (trait.knowledgeDomains) {
        domains.push(...trait.knowledgeDomains);
      }
    });
    return [...new Set(domains)];
  }
}
