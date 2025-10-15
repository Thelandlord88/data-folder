/**
 * CAPABILITY PROVIDER BASE CLASS
 * 
 * Abstract base for capability providers that integrate different
 * systems (thinking, hunting, external tools) into the unified capability framework.
 */

import type { Capability } from './types.js';

export abstract class CapabilityProvider {
  /**
   * Get unique identifier for this provider
   */
  abstract getProviderId(): string;

  /**
   * Get human-readable name for this provider
   */
  abstract getProviderName(): string;

  /**
   * Get all capabilities from this provider
   */
  abstract getCapabilities(): Promise<Capability[]>;

  /**
   * Helper to create a capability with standard structure
   */
  protected createCapability(
    id: string,
    name: string,
    type: string,
    category: string,
    summary: string,
    metadata: Record<string, any> = {}
  ): Capability {
    return {
      id,
      name,
      type,
      category,
      summary_one_line: summary,
      metadata: {
        provider: this.getProviderId(),
        provider_name: this.getProviderName(),
        ...metadata
      }
    };
  }
}

export default CapabilityProvider;
