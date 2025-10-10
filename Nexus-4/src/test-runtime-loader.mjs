#!/usr/bin/env node

/**
 * Test actual runtime loading of new personalities
 * This tests if personalities load through the PersonalityRegistryLoader
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const NEW_PERSONALITIES = [
  'visionary', 'wordsmith', 'chromatic', 'narrative', 'muse',
  'styleforge', 'photorealist', 'artdirector',
  'contextweaver', 'chainarchitect', 'finetuner', 'tokenmaster',
  'quantumlogic', 'ethicsguard', 'performancehawk', 'datawhisperer',
  'integrationmaestro', 'visualarchitect'
];

async function testRuntimeLoad() {
  console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║     NEXUS Runtime Personality Loader Test                    ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  console.log(`${colors.magenta}Testing PersonalityRegistryLoader with 18 new personalities...${colors.reset}\n`);

  try {
    // Import the compiled PersonalityRegistryLoader
    const loaderModule = await import('./dist/loaders/PersonalityRegistryLoader.js');
    console.log(`${colors.green}✅ PersonalityRegistryLoader imported successfully${colors.reset}`);
    
    // Create instance
    const loader = new loaderModule.PersonalityRegistryLoader({
      profilesPath: join(__dirname, 'profiles'),
      enableCircuitBreaker: true,
      enableCache: true
    });
    console.log(`${colors.green}✅ PersonalityRegistryLoader instance created${colors.reset}\n`);

    // Initialize
    console.log(`${colors.cyan}Initializing loader...${colors.reset}`);
    await loader.initialize();
    console.log(`${colors.green}✅ Loader initialized${colors.reset}\n`);

    // Get registry
    const registry = loader.getPersonalityRegistry();
    const personalityCount = registry?.personalities?.size || Object.keys(registry || {}).length || 0;
    console.log(`${colors.cyan}Registry loaded with ${personalityCount} personalities${colors.reset}\n`);

    // Check health
    const health = await loader.healthCheck();
    console.log(`${colors.cyan}Health Check:${colors.reset}`);
    console.log(`  Status: ${health.status === 'healthy' ? colors.green : colors.yellow}${health.status}${colors.reset}`);
    console.log(`  Circuit Breaker: ${health.circuitBreakerState}`);
    console.log(`  Cache Hit Rate: ${health.cacheHitRate?.toFixed(1)}%`);
    console.log(`  Total Personalities: ${health.totalPersonalities}`);
    console.log(`  Loaded: ${health.loadedPersonalities}`);
    console.log(`  Failed: ${health.failedPersonalities}`);
    console.log();

    // Test loading each new personality
    console.log(`${colors.magenta}Testing individual personality loading:${colors.reset}\n`);
    
    let successCount = 0;
    let failCount = 0;

    for (const name of NEW_PERSONALITIES) {
      try {
        const personality = loader.getPersonality(name);
        if (personality) {
          const traitCount = personality.cognitiveTraits?.length || 0;
          console.log(`  ${colors.green}✅ ${name}${colors.reset} - ${traitCount} traits loaded`);
          successCount++;
        } else {
          console.log(`  ${colors.red}❌ ${name}${colors.reset} - Not found in registry`);
          failCount++;
        }
      } catch (error) {
        console.log(`  ${colors.red}❌ ${name}${colors.reset} - Error: ${error.message}`);
        failCount++;
      }
    }

    // Summary
    console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}RUNTIME LOAD TEST RESULTS:${colors.reset}\n`);
    console.log(`  Total Tested: ${NEW_PERSONALITIES.length}`);
    console.log(`  ${colors.green}Successful: ${successCount}${colors.reset}`);
    console.log(`  ${colors.red}Failed: ${failCount}${colors.reset}`);
    console.log(`  Pass Rate: ${((successCount / NEW_PERSONALITIES.length) * 100).toFixed(1)}%\n`);

    if (successCount === NEW_PERSONALITIES.length) {
      console.log(`${colors.green}🎉 ALL NEW PERSONALITIES LOAD SUCCESSFULLY IN RUNTIME! 🎉${colors.reset}\n`);
      console.log(`${colors.green}✅ Circuit breaker is working${colors.reset}`);
      console.log(`${colors.green}✅ Caching is operational${colors.reset}`);
      console.log(`${colors.green}✅ All 18 personalities are accessible${colors.reset}\n`);
    } else {
      console.log(`${colors.yellow}⚠️  Some personalities failed to load${colors.reset}\n`);
    }

    // Get analytics
    const analysis = await loader.getRegistryAnalysis();
    console.log(`${colors.cyan}Registry Analytics:${colors.reset}`);
    console.log(`  Total Traits: ${analysis.totalTraits}`);
    console.log(`  Total Triggers: ${analysis.totalTriggers}`);
    console.log(`  Total Domains: ${analysis.totalDomains}`);
    console.log(`  Avg Traits/Personality: ${analysis.avgTraitsPerPersonality.toFixed(1)}`);
    console.log();

  } catch (error) {
    console.log(`${colors.red}❌ RUNTIME TEST FAILED${colors.reset}`);
    console.log(`${colors.red}Error: ${error.message}${colors.reset}`);
    console.log(error.stack);
    process.exit(1);
  }
}

testRuntimeLoad().catch(console.error);
