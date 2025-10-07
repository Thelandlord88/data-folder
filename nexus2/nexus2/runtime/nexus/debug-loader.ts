/**
 * Debug version of personality loader demo
 */

import { PersonalityRegistryLoader } from './loaders/PersonalityRegistryLoader.js';

async function debugDemo() {
  console.log('🔍 Debug Demo - Personality Loader\n');

  const registryLoader = new PersonalityRegistryLoader({
    profilesPath: './profiles',
    cacheEnabled: true,
    validationStrict: false, // Try lenient first
    batchSize: 3,
  });

  console.log('Initializing...\n');
  
  try {
    const status = await registryLoader.initialize();
    
    console.log('✅ Initialization complete');
    console.log(`   Loaded: ${status.totalPersonalities} personalities`);
    console.log(`   Circuit Breaker: ${status.circuitBreakerState}\n`);
    
    if (status.totalPersonalities > 0) {
      // Test getting one
      const daedalus = registryLoader.getPersonality('daedalus');
      if (daedalus) {
        console.log(`✅ Successfully retrieved Daedalus`);
        console.log(`   Name: ${daedalus.identity.name}`);
        console.log(`   Traits: ${Object.keys(daedalus.cognitiveTraits).length}`);
      }
      
      // Show all loaded
      const registry = registryLoader.getPersonalityRegistry();
      console.log(`\n📋 Loaded personalities:`);
      for (const [name, data] of registry) {
        console.log(`   • ${name} (${data.identity.name})`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugDemo();
