/**
 * Personality Registry Loader Demo
 * Demonstrates production-grade personality loading with TypeScript
 */
import { PersonalityRegistryLoader } from './loaders/PersonalityRegistryLoader.js';
async function main() {
    console.log('🎭 NEXUS Personality Registry Loader Demo\n');
    console.log('═'.repeat(70));
    // Initialize with custom configuration
    const registryLoader = new PersonalityRegistryLoader({
        profilesPath: './profiles',
        cacheEnabled: true,
        validationStrict: true,
        batchSize: 5,
        cacheMax: 100,
        cacheTTL: 600000, // 10 minutes
    });
    // Step 1: Initialize the registry
    console.log('\n📋 Step 1: Initializing Registry...\n');
    const status = await registryLoader.initialize();
    console.log('\n✅ Registry Status:');
    console.log(`   • Initialized: ${status.initialized}`);
    console.log(`   • Total Personalities: ${status.totalPersonalities}`);
    console.log(`   • Cache Enabled: ${status.cacheEnabled}`);
    console.log(`   • Validation Mode: ${status.validationStrict ? 'Strict' : 'Lenient'}`);
    console.log(`   • Circuit Breaker: ${status.circuitBreakerState}`);
    // Step 2: Get a specific personality
    console.log('\n═'.repeat(70));
    console.log('\n🎯 Step 2: Loading Specific Personality (Daedalus)...\n');
    const daedalus = registryLoader.getPersonality('daedalus');
    if (daedalus) {
        console.log(`✅ Loaded: ${daedalus.identity.name}`);
        console.log(`   • Tagline: "${daedalus.identity.tagline}"`);
        console.log(`   • Principles: ${daedalus.ideology.principles.length}`);
        console.log(`   • Cognitive Traits: ${Object.keys(daedalus.cognitiveTraits).length}`);
        // Show cognitive traits
        console.log('\n   Cognitive Traits:');
        Object.entries(daedalus.cognitiveTraits).forEach(([key, trait]) => {
            console.log(`     • ${trait.name} (expertise: ${trait.expertise || 'N/A'})`);
        });
    }
    // Step 3: Analyze the registry
    console.log('\n═'.repeat(70));
    console.log('\n📊 Step 3: Registry Analysis...\n');
    const analysis = registryLoader.analyzeRegistry();
    console.log(`✅ Registry Analysis:`);
    console.log(`   • Total Personalities: ${analysis.totalPersonalities}`);
    console.log(`   • With Cognitive Traits: ${analysis.personalitiesWithTraits}`);
    console.log(`   • With Principles: ${analysis.personalitiesWithPrinciples}`);
    console.log(`   • Total Traits: ${analysis.totalTraits}`);
    console.log(`   • Validation Compliance: ${analysis.validationCompliance}%`);
    console.log(`   • Security Posture: ${analysis.securityPosture}`);
    // Show top traits
    const topTraits = Object.entries(analysis.traitDistribution)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);
    console.log('\n   Top 5 Traits Across Personalities:');
    topTraits.forEach(([trait, count]) => {
        console.log(`     • ${trait}: ${count} personalities`);
    });
    // Step 4: Auto-generation capabilities
    console.log('\n═'.repeat(70));
    console.log('\n🤖 Step 4: Auto-Generation Capabilities...\n');
    const capabilities = registryLoader.getAutoGenerationCapabilities();
    console.log(`✅ Top 5 Personalities by Expertise:\n`);
    capabilities.slice(0, 5).forEach((cap, index) => {
        console.log(`   ${index + 1}. ${cap.personality}`);
        console.log(`      • Expertise Level: ${Math.round(cap.expertise)}/100`);
        console.log(`      • Trait Count: ${cap.traitCount}`);
        console.log(`      • Principle Count: ${cap.principleCount}`);
        console.log(`      • Auto-Generation Ready: ${cap.canAutoGenerate ? '✅' : '❌'}`);
        if (cap.knowledgeDomains.length > 0) {
            console.log(`      • Knowledge Domains: ${cap.knowledgeDomains.slice(0, 3).join(', ')}`);
        }
        console.log('');
    });
    // Step 5: Health check
    console.log('═'.repeat(70));
    console.log('\n🏥 Step 5: System Health Check...\n');
    const health = await registryLoader.healthCheck();
    console.log(`✅ Health Status: ${health.status.toUpperCase()}\n`);
    console.log(`   System Details:`);
    console.log(`     • Personalities Loaded: ${health.details.personalitiesLoaded}`);
    console.log(`     • Registry Size: ${health.details.registrySizeMB} MB`);
    console.log(`     • Memory Usage: ${health.details.memoryUsageMB} MB`);
    console.log(`     • Circuit Breaker: ${health.details.circuitBreakerState}`);
    if (health.details.cacheStats) {
        console.log(`\n   Cache Performance:`);
        console.log(`     • Cache Size: ${health.details.cacheStats.size}/${health.details.cacheStats.maxSize}`);
        console.log(`     • Hit Rate: ${health.details.cacheStats.hitRate}%`);
    }
    console.log(`\n   Performance Metrics:`);
    console.log(`     • Avg Load Time: ${health.metrics.averageLoadTime}ms`);
    console.log(`     • Cache Hit Rate: ${health.metrics.cacheHitRate}%`);
    console.log(`     • Error Rate: ${health.metrics.errorRate}%`);
    console.log(`     • Total Errors: ${health.metrics.totalErrors}`);
    if (health.warnings.length > 0) {
        console.log(`\n   ⚠️  Warnings:`);
        health.warnings.forEach(warning => {
            console.log(`     • ${warning}`);
        });
    }
    else {
        console.log(`\n   ✅ No warnings - system is healthy!`);
    }
    // Step 6: Test specific personality traits
    console.log('\n═'.repeat(70));
    console.log('\n🧠 Step 6: Cognitive Traits Exploration...\n');
    const hunterTraits = registryLoader.getPersonalityTraits('hunter');
    console.log(`✅ Hunter's Cognitive Traits (${Object.keys(hunterTraits).length} total):\n`);
    Object.entries(hunterTraits).slice(0, 3).forEach(([key, trait]) => {
        console.log(`   • ${trait.name}`);
        console.log(`     Description: ${trait.description}`);
        if (trait.activationTriggers && trait.activationTriggers.length > 0) {
            console.log(`     Triggers: ${trait.activationTriggers.slice(0, 5).join(', ')}`);
        }
        console.log('');
    });
    // Final summary
    console.log('═'.repeat(70));
    console.log('\n✅ Demo Complete!\n');
    console.log(`   Registry is now ready for production use with:`);
    console.log(`     • ${status.totalPersonalities} personalities loaded`);
    console.log(`     • Circuit breaker protection`);
    console.log(`     • Performance caching`);
    console.log(`     • Comprehensive monitoring`);
    console.log(`     • Type-safe TypeScript API`);
    console.log('\n═'.repeat(70));
}
// Run the demo
main().catch((error) => {
    console.error('\n❌ Demo failed:', error.message);
    process.exit(1);
});
//# sourceMappingURL=demo-personality-loader.js.map