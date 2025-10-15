/**
 * HUNTER KNOWLEDGE CAPABILITY PROVIDER
 * 
 * Registers hunting techniques from the hunter knowledge system as capabilities.
 * Enables discovery and execution of validation patterns through the capability framework.
 * 
 * @version 1.0.0
 * @date October 15, 2025
 */

import { CapabilityProvider } from '../CapabilityProvider.js';
import type { Capability } from '../types.js';
import { getHunterKnowledgeBridge } from '../../hunter-knowledge-bridge.js';

export class HunterKnowledgeCapabilityProvider extends CapabilityProvider {
  
  getProviderId(): string {
    return 'hunter-knowledge';
  }

  getProviderName(): string {
    return 'Hunting Consciousness';
  }

  /**
   * Load all hunting techniques as capabilities
   */
  async getCapabilities(): Promise<Capability[]> {
    const bridge = getHunterKnowledgeBridge();
    
    // Ensure bridge is initialized
    if (!bridge.getStatus().initialized) {
      await bridge.initialize();
    }

    // Query all available techniques
    const techniques = bridge.queryTechniques({});
    const capabilities: Capability[] = [];

    for (const technique of techniques) {
      try {
        capabilities.push(
          this.createCapability(
            `hunting:${technique.id}`,
            technique.pattern_name,
            'technique',
            'validation',
            technique.principle,
            {
              description: technique.description || technique.principle,
              tags: [
                'hunting',
                'validation',
                technique.category,
                `safety-${technique.safety_level}`
              ],
              use_cases: technique.success_indicators || [],
              effectiveness: typeof technique.effectiveness === 'number' 
                ? technique.effectiveness 
                : technique.effectiveness.base_score || 0.7,
              usage_count: technique.meta?.times_applied || 0,
              related_capabilities: this.getRelatedTechniques(technique.id),
              subcategory: technique.category,
              
              // Additional hunting-specific metadata
              safety_level: technique.safety_level,
              estimated_time: technique.estimated_execution_time,
              platform_support: technique.cross_platform_support,
              dependencies: technique.extracted_dependencies,
              
              // Evolution tracking
              version: technique.version,
              evolution_history: technique.evolution_history,
              
              // Technique details
              steps: technique.steps.length,
              anti_patterns: technique.anti_patterns.length,
              adaptations: Object.keys(technique.adaptations || {}).length
            }
          )
        );
      } catch (error: any) {
        console.warn(`Failed to load technique ${technique.id}:`, error.message);
      }
    }

    console.log(`✅ Loaded ${capabilities.length} hunting capabilities`);
    return capabilities;
  }

  /**
   * Map related hunting techniques
   */
  private getRelatedTechniques(techniqueId: string): string[] {
    const relationships: Record<string, string[]> = {
      'security-audit': ['accessibility-scan', 'performance-check'],
      'accessibility-scan': ['security-audit', 'performance-check'],
      'performance-check': ['security-audit', 'accessibility-scan']
    };

    return (relationships[techniqueId] || []).map(t => `hunting:${t}`);
  }

  /**
   * Get detailed information about a specific hunting capability
   */
  async getCapabilityDetails(capabilityId: string): Promise<any> {
    const bridge = getHunterKnowledgeBridge();
    const techniqueId = capabilityId.replace('hunting:', '');
    
    const technique = bridge.getTechnique(techniqueId);
    if (!technique) {
      throw new Error(`Technique not found: ${techniqueId}`);
    }

    return {
      id: capabilityId,
      name: technique.pattern_name,
      principle: technique.principle,
      description: technique.description,
      why_it_works: technique.why_this_works,
      
      // Execution details
      steps: technique.steps,
      estimated_time: technique.estimated_execution_time,
      safety_level: technique.safety_level,
      
      // Effectiveness
      effectiveness: typeof technique.effectiveness === 'number'
        ? technique.effectiveness
        : technique.effectiveness,
      evolution_history: technique.evolution_history,
      
      // Patterns to avoid
      anti_patterns: technique.anti_patterns,
      
      // Success indicators
      success_indicators: technique.success_indicators,
      failure_patterns: technique.failure_patterns,
      
      // Context adaptations
      adaptations: technique.adaptations,
      application_contexts: technique.application_contexts,
      
      // Integration
      integration_points: technique.integration_points,
      dependencies: technique.dependencies,
      
      // Platform support
      platform_support: technique.cross_platform_support,
      resource_requirements: technique.resource_requirements,
      
      // Safety
      validation_checks: technique.validation_checks
    };
  }

  /**
   * Execute a hunting technique
   */
  async executeTechnique(
    techniqueId: string,
    context: { workspace?: string; [key: string]: any }
  ): Promise<any> {
    const bridge = getHunterKnowledgeBridge();
    const technique = bridge.getTechnique(techniqueId);
    
    if (!technique) {
      throw new Error(`Technique not found: ${techniqueId}`);
    }

    console.log(`🎯 Executing hunting technique: ${technique.pattern_name}`);
    console.log(`   Safety level: ${technique.safety_level}`);
    console.log(`   Estimated time: ${(technique.estimated_execution_time / 1000).toFixed(1)}s`);

    // In a full implementation, this would actually execute the technique
    // For now, return technique information and simulation
    return {
      technique_id: techniqueId,
      technique_name: technique.pattern_name,
      executed_at: new Date().toISOString(),
      status: 'simulated',
      context,
      
      // Would contain actual execution results
      results: {
        message: `Hunting technique "${technique.pattern_name}" would be executed here`,
        steps: technique.steps.map((step, idx) => ({
          order: step.order,
          action: step.action,
          purpose: step.purpose,
          status: 'pending'
        }))
      }
    };
  }
}

export default HunterKnowledgeCapabilityProvider;
