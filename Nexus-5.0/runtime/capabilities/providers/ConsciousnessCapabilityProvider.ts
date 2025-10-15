/**
 * CONSCIOUSNESS CAPABILITY PROVIDER
 * 
 * Registers thinking patterns from the consciousness system as capabilities.
 * Enables discovery and application of strategic thinking patterns through
 * the capability framework.
 * 
 * @version 1.0.0
 * @date October 15, 2025
 */

import { CapabilityProvider } from '../CapabilityProvider.js';
import type { Capability } from '../types.js';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ConsciousnessPattern {
  pattern_name: string;
  category: string;
  principle: string;
  description?: string;
  when_to_apply: string[];
  technique: any;
  success_indicators: string[];
  anti_patterns?: any[];
  evolution_history?: any[];
  meta?: any;
}

export class ConsciousnessCapabilityProvider extends CapabilityProvider {
  
  getProviderId(): string {
    return 'consciousness';
  }

  getProviderName(): string {
    return 'Thinking Consciousness';
  }

  /**
   * Load all thinking patterns as capabilities
   */
  async getCapabilities(): Promise<Capability[]> {
    const consciousnessDir = resolve(__dirname, '../../../consciousness');
    const capabilities: Capability[] = [];

    try {
      const files = await readdir(consciousnessDir);
      const patternFiles = files.filter(f => f.endsWith('.json') && !f.startsWith('_'));

      for (const file of patternFiles) {
        try {
          const patternPath = resolve(consciousnessDir, file);
          const content = await readFile(patternPath, 'utf8');
          const pattern = JSON.parse(content) as ConsciousnessPattern;
          const patternId = file.replace('.json', '');

          capabilities.push(
            this.createCapability(
              `thinking:${patternId}`,
              pattern.pattern_name,
              'pattern',
              'thinking',
              pattern.principle,
              {
                description: pattern.description || pattern.principle,
                tags: ['thinking', 'strategy', 'problem-solving', pattern.category],
                use_cases: pattern.when_to_apply || [],
                effectiveness: this.calculateEffectiveness(pattern),
                usage_count: pattern.meta?.times_applied || 0,
                related_capabilities: this.getRelatedPatterns(patternId),
                subcategory: pattern.category,
                
                // Additional consciousness-specific metadata
                success_indicators: pattern.success_indicators || [],
                anti_patterns: pattern.anti_patterns || [],
                evolution_history: pattern.evolution_history || [],
                
                // Technique details
                technique: pattern.technique,
                when_to_apply: pattern.when_to_apply
              }
            )
          );
        } catch (error: any) {
          console.warn(`Failed to load pattern ${file}:`, error.message);
        }
      }

      console.log(`✅ Loaded ${capabilities.length} thinking capabilities`);
      return capabilities;
      
    } catch (error: any) {
      console.warn('Failed to load consciousness patterns:', error.message);
      return capabilities;
    }
  }

  /**
   * Calculate effectiveness from pattern metadata
   */
  private calculateEffectiveness(pattern: ConsciousnessPattern): number {
    // If pattern has evolution history, use latest effectiveness
    if (pattern.evolution_history && pattern.evolution_history.length > 0) {
      const latest = pattern.evolution_history[pattern.evolution_history.length - 1];
      if (latest.effectiveness !== undefined) {
        return latest.effectiveness;
      }
    }

    // Default based on usage
    const usageCount = pattern.meta?.times_applied || 0;
    if (usageCount > 50) return 0.9;
    if (usageCount > 20) return 0.8;
    if (usageCount > 5) return 0.7;
    return 0.6; // New patterns start at 60%
  }

  /**
   * Map related thinking patterns
   */
  private getRelatedPatterns(patternId: string): string[] {
    const relationships: Record<string, string[]> = {
      'problem-decomposition': ['systems-thinking', 'pattern-recognition'],
      'systems-thinking': ['problem-decomposition', 'workflow-efficiency'],
      'workflow-efficiency': ['systems-thinking', 'problem-decomposition'],
      'pattern-recognition': ['problem-decomposition', 'systems-thinking']
    };

    return (relationships[patternId] || []).map(p => `thinking:${p}`);
  }

  /**
   * Get detailed information about a specific thinking pattern
   */
  async getCapabilityDetails(capabilityId: string): Promise<any> {
    const patternId = capabilityId.replace('thinking:', '');
    const patternPath = resolve(__dirname, `../../../consciousness/${patternId}.json`);
    
    try {
      const content = await readFile(patternPath, 'utf8');
      const pattern = JSON.parse(content) as ConsciousnessPattern;

      return {
        id: capabilityId,
        name: pattern.pattern_name,
        category: pattern.category,
        principle: pattern.principle,
        description: pattern.description,
        
        // Application guidance
        when_to_apply: pattern.when_to_apply,
        technique: pattern.technique,
        
        // Success metrics
        success_indicators: pattern.success_indicators,
        
        // Patterns to avoid
        anti_patterns: pattern.anti_patterns,
        
        // Evolution
        evolution_history: pattern.evolution_history,
        
        // Metadata
        meta: pattern.meta
      };
    } catch (error: any) {
      throw new Error(`Pattern not found: ${patternId}`);
    }
  }

  /**
   * Apply a thinking pattern
   */
  async applyPattern(
    patternId: string,
    context: { problem?: string; [key: string]: any }
  ): Promise<any> {
    const details = await this.getCapabilityDetails(`thinking:${patternId}`);
    
    console.log(`🧠 Applying thinking pattern: ${details.name}`);
    console.log(`   Principle: ${details.principle}`);

    // In a full implementation, this would guide the thinking process
    // For now, return pattern information and guidance
    return {
      pattern_id: patternId,
      pattern_name: details.name,
      applied_at: new Date().toISOString(),
      status: 'guidance',
      context,
      
      // Thinking guidance
      guidance: {
        principle: details.principle,
        when_to_apply: details.when_to_apply,
        technique: details.technique,
        success_indicators: details.success_indicators,
        anti_patterns: details.anti_patterns,
        
        message: `Thinking pattern "${details.name}" provides strategic guidance for this problem`
      }
    };
  }
}

export default ConsciousnessCapabilityProvider;
