/**
 * Type definitions for NEXUS Trait Composition System
 */

export interface PersonalityTrait {
  name: string;
  description: string;
  activationTriggers: string[];
  knowledgeDomains: string[];
  expertise: number;
  personalityId: string;
  traitKey?: string;
  verificationMethods?: string[];
}

export interface TaskRequirements {
  domain: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  requiredCapabilities: string[];
  contextTriggers: string[];
}

export interface TraitSearchResult {
  trait: PersonalityTrait;
  relevanceScore: number;
  matchedTriggers: string[];
}

export interface ComposedAgent {
  id: string;
  task: string;
  traits: PersonalityTrait[];
  knowledgeDomains: Set<string>;
  traitsByName: Map<string, PersonalityTrait>;
  synergyScore: number;
  personalitiesUsed: string[];
}

export interface CompositionHistory {
  timestamp: string;
  request: string;
  traitsUsed: number;
  personalitiesUsed: number;
  synergyScore: number;
}

export interface IndexStats {
  totalPersonalities: number;
  totalTraits: number;
  totalTriggers: number;
  totalDomains: number;
  traitsPerPersonality?: number;
  triggersPerTrait?: number;
  domainsPerTrait?: number;
}

export interface CompositionAnalytics {
  initialized: boolean;
  totalPersonalities: number;
  totalTraits: number;
  totalTriggers: number;
  totalDomains: number;
  indexHealth: 'healthy' | 'empty' | 'uninitialized';
  composedAgentFactoryReady: boolean;
  totalCompositions: number;
  avgTraitsPerComposition: number;
  avgPersonalitiesPerComposition: number;
  avgSynergyScore: number;
  traitsPerPersonality?: number;
  triggersPerTrait?: number;
  domainsPerTrait?: number;
}

export interface MultiPersonalityResponse {
  content: string;
  personalityUsed: string;
  composedAgent: boolean;
  nexusEnhanced: boolean;
  traits: Array<{
    name: string;
    personality: string;
    expertise: number;
  }>;
  traitApplications: string[];
  synergyScore: number;
  knowledgeDomains: string[];
  specialtyInsights: string[];
  confidenceScore: number;
  analysisDepth: 'surface' | 'moderate' | 'deep';
}
