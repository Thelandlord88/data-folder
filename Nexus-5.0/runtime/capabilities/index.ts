/**
 * NEXUS CAPABILITY SYSTEM v2.0 - UNIFIED ENTRY POINT
 * 
 * Enterprise-grade capability management system integration
 * 
 * Philosophy: "NEXUS persists. Agents are ephemeral. NEXUS must teach."
 * 
 * @version 2.0.0
 * @date October 15, 2025
 */

export { 
  EnhancedCapabilityRegistry,
  getEnhancedCapabilityRegistry
} from './EnhancedCapabilityRegistry.js';

export { CapabilityProvider } from './CapabilityProvider.js';

export type {
  Capability,
  EnhancedCapability,
  PerformanceMetrics,
  RateLimits,
  Environment,
  DataAccessLevel,
  SecurityContext,
  Recommendation,
  CapabilityBundle,
  BundleRecommendation,
  CapabilityStatus,
  SystemHealth,
  UsageRecord,
  CapabilityPattern,
  MaintenanceReport,
  ConversationalResponse,
  Intent,
  ProactiveRecommendation,
  SystemState
} from './EnhancedCapabilityRegistry.js';

// Re-export from types for backwards compatibility
export type { Capability as BasicCapability } from './types.js';

/**
 * Initialize NEXUS Capability System with default settings
 * 
 * This is the recommended way to initialize the capability system
 * for most use cases.
 */
export async function initializeNexusCapabilitySystem(options: {
  autoLoadProviders?: boolean;
  enableMonitoring?: boolean;
  enableLearning?: boolean;
  persistenceEnabled?: boolean;
  persistencePath?: string;
} = {}): Promise<{
  registry: import('./EnhancedCapabilityRegistry.js').EnhancedCapabilityRegistry;
  status: 'initialized' | 'partial' | 'error';
  providersLoaded: number;
  capabilitiesRegistered: number;
  errors: string[];
}> {
  const {
    autoLoadProviders = true,
    enableMonitoring = true,
    enableLearning = true,
    persistenceEnabled = true,
    persistencePath = './nexus-capabilities.json'
  } = options;

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║     🧠 NEXUS CAPABILITY SYSTEM v2.0                      ║');
  console.log('║                                                            ║');
  console.log('║     Enterprise Intelligence Management                    ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log();

  const errors: string[] = [];
  let providersLoaded = 0;
  let status: 'initialized' | 'partial' | 'error' = 'initialized';

  try {
    // Get singleton instance
    const { getEnhancedCapabilityRegistry } = await import('./EnhancedCapabilityRegistry.js');
    const registry = getEnhancedCapabilityRegistry();

    // Try to restore previous state if persistence enabled
    if (persistenceEnabled) {
      try {
        console.log('📂 Attempting to restore previous state...');
        await registry.loadFromFile(persistencePath);
        console.log('✅ Previous state restored\n');
      } catch (error) {
        console.log('📝 No previous state found, starting fresh\n');
      }
    }

    // Auto-load providers if enabled
    if (autoLoadProviders) {
      console.log('🔌 Loading capability providers...\n');
      
      const providers = [
        {
          name: 'Consciousness (Thinking)',
          path: './providers/ConsciousnessProvider.js',
          className: 'ConsciousnessCapabilityProvider',
          critical: false
        },
        {
          name: 'Hunter Knowledge',
          path: './providers/HunterKnowledgeProvider.js',
          className: 'HunterKnowledgeCapabilityProvider',
          critical: false
        }
      ];

      for (const provider of providers) {
        try {
          console.log(`   Loading ${provider.name}...`);
          const module = await import(provider.path);
          const ProviderClass = module[provider.className];
          
          if (ProviderClass) {
            const instance = new ProviderClass();
            const capabilities = await instance.getCapabilities();
            
            capabilities.forEach((cap: any) => {
              registry.register(cap);
            });
            
            providersLoaded++;
            console.log(`   ✅ ${capabilities.length} capabilities registered\n`);
          } else {
            throw new Error(`Class ${provider.className} not found`);
          }
        } catch (error) {
          const errorMsg = `Failed to load ${provider.name}: ${error}`;
          errors.push(errorMsg);
          console.warn(`   ⚠️  ${errorMsg}\n`);
          
          if (provider.critical) {
            status = 'error';
            throw error;
          } else {
            status = 'partial';
          }
        }
      }
    }

    const capabilitiesRegistered = registry.getAll().length;

    // Enable monitoring if requested
    if (enableMonitoring && capabilitiesRegistered > 0) {
      console.log('📊 Health monitoring: ENABLED');
      // Start monitoring for critical capabilities
      const capabilities = registry.getAll();
      for (const cap of capabilities.slice(0, 3)) {
        await registry.startMonitoring(cap.id, 60000).catch(() => {
          // Silent failure for monitoring
        });
      }
    }

    // Learning is enabled by default in v2.0
    if (enableLearning) {
      console.log('🧠 Learning system: ENABLED');
    }

    // Persistence info
    if (persistenceEnabled) {
      console.log(`💾 Persistence: ENABLED (${persistencePath})`);
    }

    console.log();
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ NEXUS CAPABILITY SYSTEM INITIALIZED');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`📊 Status: ${status.toUpperCase()}`);
    console.log(`🔌 Providers Loaded: ${providersLoaded}`);
    console.log(`🎯 Capabilities Registered: ${capabilitiesRegistered}`);
    
    if (errors.length > 0) {
      console.log(`⚠️  Errors: ${errors.length}`);
    }
    
    console.log();

    // Save state if persistence enabled and we loaded providers
    if (persistenceEnabled && autoLoadProviders && capabilitiesRegistered > 0) {
      await registry.saveToFile(persistencePath).catch(() => {
        console.warn('⚠️  Failed to save initial state');
      });
    }

    return {
      registry,
      status,
      providersLoaded,
      capabilitiesRegistered,
      errors
    };

  } catch (error) {
    console.error('❌ CAPABILITY SYSTEM INITIALIZATION FAILED');
    console.error(`   Error: ${error}`);
    
    throw error;
  }
}

/**
 * Quick initialization for development/testing
 * Minimal features, fast startup
 */
export async function initializeQuick() {
  return initializeNexusCapabilitySystem({
    autoLoadProviders: true,
    enableMonitoring: false,
    enableLearning: true,
    persistenceEnabled: false
  });
}

/**
 * Production initialization
 * All features enabled, persistence on
 */
export async function initializeProduction() {
  return initializeNexusCapabilitySystem({
    autoLoadProviders: true,
    enableMonitoring: true,
    enableLearning: true,
    persistenceEnabled: true,
    persistencePath: './nexus-capabilities-production.json'
  });
}

/**
 * Get registry instance (must be initialized first)
 */
export function getNexusCapabilityRegistry() {
  const { getEnhancedCapabilityRegistry } = require('./EnhancedCapabilityRegistry.js');
  return getEnhancedCapabilityRegistry();
}

// Version constant
export const NEXUS_CAPABILITY_SYSTEM_VERSION = '2.0.0';

// Default export
export default {
  initialize: initializeNexusCapabilitySystem,
  initializeQuick,
  initializeProduction,
  getRegistry: getNexusCapabilityRegistry,
  VERSION: NEXUS_CAPABILITY_SYSTEM_VERSION
};
