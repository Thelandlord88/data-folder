/**
 * Cognitive Testing Suite for NEXUS Personalities
 * Tests personality traits, expertise, and auto-generation capabilities
 */

import { PersonalityRegistryLoader } from './loaders/PersonalityRegistryLoader.js';

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function header(text: string) {
  console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(70)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${text}${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);
}

function subheader(text: string) {
  console.log(`\n${colors.bright}${colors.blue}${text}${colors.reset}`);
  console.log(`${colors.blue}${'-'.repeat(text.length)}${colors.reset}`);
}

function success(text: string) {
  console.log(`${colors.green}✓${colors.reset} ${text}`);
}

function info(text: string) {
  console.log(`${colors.cyan}ℹ${colors.reset} ${text}`);
}

function warning(text: string) {
  console.log(`${colors.yellow}⚠${colors.reset} ${text}`);
}

function error(text: string) {
  console.log(`${colors.red}✗${colors.reset} ${text}`);
}

async function runCognitiveTests() {
  header('🧠 NEXUS COGNITIVE TESTING SUITE');

  // Initialize loader
  info('Initializing personality registry...');
  const loader = new PersonalityRegistryLoader({
    cacheEnabled: true,
    validationStrict: true,
  });

  await loader.initialize();
  const status = loader.getRegistryStatus();
  success(`Loaded ${status.totalPersonalities} personalities`);

  // Test 1: Expertise Distribution Analysis
  await testExpertiseDistribution(loader);

  // Test 2: Cognitive Trait Coverage
  await testCognitiveTraitCoverage(loader);

  // Test 3: Knowledge Domain Mapping
  await testKnowledgeDomainMapping(loader);

  // Test 4: Personality Collaboration Potential
  await testCollaborationPotential(loader);

  // Test 5: Auto-Generation Readiness
  await testAutoGenerationReadiness(loader);

  // Test 6: Trait Activation Patterns
  await testTraitActivationPatterns(loader);

  // Test 7: Personality Specialization
  await testPersonalitySpecialization(loader);

  // Test 8: System Health & Performance
  await testSystemHealth(loader);

  header('🎉 COGNITIVE TESTING COMPLETE');
}

// Test 1: Expertise Distribution
async function testExpertiseDistribution(loader: PersonalityRegistryLoader) {
  subheader('Test 1: Expertise Distribution Analysis');

  const capabilities = loader.getAutoGenerationCapabilities();
  
  // Calculate expertise statistics
  const expertiseValues = capabilities.map(c => c.expertise);
  const average = expertiseValues.reduce((sum, val) => sum + val, 0) / expertiseValues.length;
  const max = Math.max(...expertiseValues);
  const min = Math.min(...expertiseValues);
  
  // Categorize by expertise level
  const experts = capabilities.filter(c => c.expertise >= 90).length;
  const advanced = capabilities.filter(c => c.expertise >= 80 && c.expertise < 90).length;
  const intermediate = capabilities.filter(c => c.expertise >= 70 && c.expertise < 80).length;
  const developing = capabilities.filter(c => c.expertise < 70).length;

  console.log(`\n📊 Expertise Statistics:`);
  console.log(`   Average Expertise: ${colors.bright}${average.toFixed(1)}/100${colors.reset}`);
  console.log(`   Highest: ${colors.green}${max}/100${colors.reset}`);
  console.log(`   Lowest: ${colors.yellow}${min}/100${colors.reset}`);
  console.log(`   Range: ${(max - min).toFixed(1)} points`);

  console.log(`\n🎯 Distribution by Level:`);
  console.log(`   ${colors.green}Expert (≥90):${colors.reset} ${experts} personalities (${((experts/capabilities.length)*100).toFixed(0)}%)`);
  console.log(`   ${colors.cyan}Advanced (80-89):${colors.reset} ${advanced} personalities (${((advanced/capabilities.length)*100).toFixed(0)}%)`);
  console.log(`   ${colors.blue}Intermediate (70-79):${colors.reset} ${intermediate} personalities (${((intermediate/capabilities.length)*100).toFixed(0)}%)`);
  console.log(`   ${colors.yellow}Developing (<70):${colors.reset} ${developing} personalities (${((developing/capabilities.length)*100).toFixed(0)}%)`);

  // Top 5 experts
  console.log(`\n🏆 Top 5 Experts:`);
  capabilities.slice(0, 5).forEach((cap, idx) => {
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '  ';
    console.log(`   ${medal} ${cap.personality.padEnd(20)} - ${colors.bright}${Math.round(cap.expertise)}/100${colors.reset}`);
  });

  if (average >= 85) {
    success(`Excellent: High overall expertise (${average.toFixed(1)}/100)`);
  } else if (average >= 75) {
    info(`Good: Solid expertise level (${average.toFixed(1)}/100)`);
  } else {
    warning(`Consider: Below target expertise (${average.toFixed(1)}/100 target: 75+)`);
  }
}

// Test 2: Cognitive Trait Coverage
async function testCognitiveTraitCoverage(loader: PersonalityRegistryLoader) {
  subheader('Test 2: Cognitive Trait Coverage Analysis');

  const analysis = loader.analyzeRegistry();
  const capabilities = loader.getAutoGenerationCapabilities();

  // Total unique traits
  const uniqueTraits = Object.keys(analysis.traitDistribution).length;
  const totalTraits = analysis.totalTraits;
  const avgTraitsPerPersonality = totalTraits / analysis.totalPersonalities;

  console.log(`\n🧩 Trait Statistics:`);
  console.log(`   Total Unique Traits: ${colors.bright}${uniqueTraits}${colors.reset}`);
  console.log(`   Total Trait Instances: ${totalTraits}`);
  console.log(`   Avg per Personality: ${colors.cyan}${avgTraitsPerPersonality.toFixed(1)}${colors.reset}`);
  console.log(`   Personalities with Traits: ${analysis.personalitiesWithTraits}/${analysis.totalPersonalities}`);

  // Find personalities with most traits
  console.log(`\n🎨 Most Versatile Personalities:`);
  const byTraitCount = [...capabilities].sort((a, b) => b.traitCount - a.traitCount);
  byTraitCount.slice(0, 5).forEach((cap, idx) => {
    console.log(`   ${idx + 1}. ${cap.personality.padEnd(20)} - ${colors.bright}${cap.traitCount}${colors.reset} traits`);
  });

  // Most common traits
  console.log(`\n🔥 Most Common Traits:`);
  const topTraits = Object.entries(analysis.traitDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  
  topTraits.forEach(([trait, count], idx) => {
    const percentage = ((count / analysis.totalPersonalities) * 100).toFixed(0);
    console.log(`   ${idx + 1}. ${trait.padEnd(30)} - ${count} personalities (${percentage}%)`);
  });

  if (avgTraitsPerPersonality >= 4) {
    success(`Excellent: High trait diversity (${avgTraitsPerPersonality.toFixed(1)} avg)`);
  } else if (avgTraitsPerPersonality >= 3) {
    info(`Good: Adequate trait coverage (${avgTraitsPerPersonality.toFixed(1)} avg)`);
  } else {
    warning(`Consider: Low trait diversity (${avgTraitsPerPersonality.toFixed(1)} avg, target: 4+)`);
  }
}

// Test 3: Knowledge Domain Mapping
async function testKnowledgeDomainMapping(loader: PersonalityRegistryLoader) {
  subheader('Test 3: Knowledge Domain Mapping');

  const capabilities = loader.getAutoGenerationCapabilities();
  
  // Collect all knowledge domains
  const domainMap = new Map<string, string[]>();
  capabilities.forEach(cap => {
    cap.knowledgeDomains.forEach(domain => {
      if (!domainMap.has(domain)) {
        domainMap.set(domain, []);
      }
      domainMap.get(domain)!.push(cap.personality);
    });
  });

  const totalDomains = domainMap.size;
  const avgDomainsPerPersonality = capabilities.reduce((sum, c) => sum + c.knowledgeDomains.length, 0) / capabilities.length;

  console.log(`\n🌐 Domain Statistics:`);
  console.log(`   Total Unique Domains: ${colors.bright}${totalDomains}${colors.reset}`);
  console.log(`   Avg Domains per Personality: ${colors.cyan}${avgDomainsPerPersonality.toFixed(1)}${colors.reset}`);

  // Most covered domains
  console.log(`\n🎯 Most Covered Knowledge Domains:`);
  const topDomains = Array.from(domainMap.entries())
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 8);

  topDomains.forEach(([domain, personalities], idx) => {
    console.log(`   ${idx + 1}. ${domain.padEnd(40)} - ${colors.bright}${personalities.length}${colors.reset} personalities`);
    if (personalities.length >= 3) {
      console.log(`      ${colors.cyan}Strong coverage:${colors.reset} ${personalities.slice(0, 3).join(', ')}`);
    }
  });

  // Find domain gaps (single personality coverage)
  const gaps = Array.from(domainMap.entries())
    .filter(([, personalities]) => personalities.length === 1);

  if (gaps.length > 0) {
    console.log(`\n⚠️  Single-Point-of-Failure Domains (${gaps.length}):`);
    gaps.slice(0, 5).forEach(([domain, personalities]) => {
      warning(`${domain.padEnd(40)} - Only ${personalities[0]}`);
    });
    if (gaps.length > 5) {
      info(`... and ${gaps.length - 5} more`);
    }
  }

  if (avgDomainsPerPersonality >= 8) {
    success(`Excellent: Broad knowledge coverage (${avgDomainsPerPersonality.toFixed(1)} avg domains)`);
  } else if (avgDomainsPerPersonality >= 5) {
    info(`Good: Solid knowledge breadth (${avgDomainsPerPersonality.toFixed(1)} avg domains)`);
  } else {
    warning(`Consider: Narrow specialization (${avgDomainsPerPersonality.toFixed(1)} avg domains, target: 8+)`);
  }
}

// Test 4: Collaboration Potential
async function testCollaborationPotential(loader: PersonalityRegistryLoader) {
  subheader('Test 4: Personality Collaboration Potential');

  const capabilities = loader.getAutoGenerationCapabilities();
  
  // Find complementary pairs
  const collaborations: Array<{
    pair: [string, string];
    sharedDomains: string[];
    uniqueDomains: number;
    synergy: number;
  }> = [];

  for (let i = 0; i < capabilities.length; i++) {
    for (let j = i + 1; j < capabilities.length; j++) {
      const p1 = capabilities[i];
      const p2 = capabilities[j];
      
      const domains1 = new Set(p1.knowledgeDomains);
      const domains2 = new Set(p2.knowledgeDomains);
      
      const shared = [...domains1].filter(d => domains2.has(d));
      const unique = domains1.size + domains2.size - shared.length;
      const synergy = shared.length * 2 + unique; // Shared domains count double
      
      if (shared.length >= 2) {
        collaborations.push({
          pair: [p1.personality, p2.personality],
          sharedDomains: shared,
          uniqueDomains: unique,
          synergy,
        });
      }
    }
  }

  collaborations.sort((a, b) => b.synergy - a.synergy);

  console.log(`\n🤝 Top Collaboration Pairs:`);
  collaborations.slice(0, 5).forEach((collab, idx) => {
    const [p1, p2] = collab.pair;
    console.log(`\n   ${idx + 1}. ${colors.bright}${p1}${colors.reset} + ${colors.bright}${p2}${colors.reset}`);
    console.log(`      Synergy Score: ${colors.cyan}${collab.synergy}${colors.reset}`);
    console.log(`      Shared Domains: ${collab.sharedDomains.slice(0, 3).join(', ')}`);
    if (collab.sharedDomains.length > 3) {
      console.log(`      ... and ${collab.sharedDomains.length - 3} more`);
    }
  });

  // Identify isolated personalities (few shared domains)
  const connectionCounts = new Map<string, number>();
  capabilities.forEach(c => connectionCounts.set(c.personality, 0));
  
  collaborations.forEach(collab => {
    connectionCounts.set(collab.pair[0], (connectionCounts.get(collab.pair[0]) || 0) + 1);
    connectionCounts.set(collab.pair[1], (connectionCounts.get(collab.pair[1]) || 0) + 1);
  });

  const isolated = Array.from(connectionCounts.entries())
    .filter(([, count]) => count < 3)
    .sort(([, a], [, b]) => a - b);

  if (isolated.length > 0) {
    console.log(`\n🏝️  Less Connected Personalities:`);
    isolated.slice(0, 3).forEach(([name, count]) => {
      info(`${name.padEnd(20)} - ${count} collaboration opportunities`);
    });
  }

  success(`Found ${collaborations.length} potential collaboration pairs`);
}

// Test 5: Auto-Generation Readiness
async function testAutoGenerationReadiness(loader: PersonalityRegistryLoader) {
  subheader('Test 5: Auto-Generation Readiness Assessment');

  const analysis = loader.analyzeRegistry();
  const capabilities = loader.getAutoGenerationCapabilities();

  const ready = capabilities.filter(c => c.canAutoGenerate);
  const notReady = capabilities.filter(c => !c.canAutoGenerate);

  console.log(`\n🤖 Readiness Statistics:`);
  console.log(`   Ready for Auto-Generation: ${colors.green}${ready.length}/${capabilities.length}${colors.reset} (${((ready.length/capabilities.length)*100).toFixed(0)}%)`);
  console.log(`   Not Ready: ${colors.yellow}${notReady.length}${colors.reset}`);

  // Analyze what makes them ready
  const withPrinciples = capabilities.filter(c => c.principleCount > 0);
  const withTraits = capabilities.filter(c => c.traitCount > 0);
  const withBoth = capabilities.filter(c => c.principleCount > 0 && c.traitCount > 0);

  console.log(`\n📋 Readiness Factors:`);
  console.log(`   With Principles: ${withPrinciples.length}/${capabilities.length} (${((withPrinciples.length/capabilities.length)*100).toFixed(0)}%)`);
  console.log(`   With Traits: ${withTraits.length}/${capabilities.length} (${((withTraits.length/capabilities.length)*100).toFixed(0)}%)`);
  console.log(`   With Both: ${colors.bright}${withBoth.length}/${capabilities.length}${colors.reset} (${((withBoth.length/capabilities.length)*100).toFixed(0)}%)`);

  // Most ready personalities
  console.log(`\n⭐ Most Ready for Auto-Generation:`);
  const byReadiness = [...capabilities].sort((a, b) => {
    const scoreA = a.traitCount * 2 + a.principleCount + a.expertise;
    const scoreB = b.traitCount * 2 + b.principleCount + b.expertise;
    return scoreB - scoreA;
  });

  byReadiness.slice(0, 5).forEach((cap, idx) => {
    const score = cap.traitCount * 2 + cap.principleCount + cap.expertise;
    console.log(`   ${idx + 1}. ${cap.personality.padEnd(20)} - Score: ${colors.cyan}${score.toFixed(0)}${colors.reset}`);
    console.log(`      (${cap.traitCount} traits, ${cap.principleCount} principles, ${Math.round(cap.expertise)} expertise)`);
  });

  if (notReady.length > 0) {
    console.log(`\n⚠️  Needs Enhancement:`);
    notReady.forEach(cap => {
      warning(`${cap.personality.padEnd(20)} - Missing traits or principles`);
    });
  }

  if ((ready.length / capabilities.length) >= 0.9) {
    success('Excellent: 90%+ ready for auto-generation');
  } else if ((ready.length / capabilities.length) >= 0.75) {
    info('Good: 75%+ ready for auto-generation');
  } else {
    warning('Consider: Less than 75% ready for auto-generation');
  }
}

// Test 6: Trait Activation Patterns
async function testTraitActivationPatterns(loader: PersonalityRegistryLoader) {
  subheader('Test 6: Trait Activation Pattern Analysis');

  const registry = loader.getPersonalityRegistry();
  
  // Collect all activation triggers
  const triggerMap = new Map<string, Array<{ personality: string; trait: string }>>();
  
  for (const [name, data] of registry) {
    Object.entries(data.cognitiveTraits).forEach(([traitKey, trait]) => {
      if (trait.activationTriggers) {
        trait.activationTriggers.forEach(trigger => {
          const normalizedTrigger = trigger.toLowerCase().trim();
          if (!triggerMap.has(normalizedTrigger)) {
            triggerMap.set(normalizedTrigger, []);
          }
          triggerMap.get(normalizedTrigger)!.push({
            personality: name,
            trait: trait.name,
          });
        });
      }
    });
  }

  const totalTriggers = triggerMap.size;
  const avgTriggersPerPersonality = Array.from(registry.values())
    .reduce((sum, p) => {
      const triggers = Object.values(p.cognitiveTraits)
        .flatMap(t => t.activationTriggers || []);
      return sum + triggers.length;
    }, 0) / registry.size;

  console.log(`\n🎯 Activation Trigger Statistics:`);
  console.log(`   Total Unique Triggers: ${colors.bright}${totalTriggers}${colors.reset}`);
  console.log(`   Avg Triggers per Personality: ${colors.cyan}${avgTriggersPerPersonality.toFixed(1)}${colors.reset}`);

  // Most common triggers (multi-personality activation)
  const multiPersonalityTriggers = Array.from(triggerMap.entries())
    .filter(([, uses]) => uses.length > 1)
    .sort(([, a], [, b]) => b.length - a.length);

  console.log(`\n🔥 Most Common Activation Triggers:`);
  multiPersonalityTriggers.slice(0, 8).forEach(([trigger, uses], idx) => {
    console.log(`   ${idx + 1}. "${trigger.padEnd(20)}" - ${colors.bright}${uses.length}${colors.reset} personalities`);
    const personalities = [...new Set(uses.map(u => u.personality))];
    console.log(`      ${colors.cyan}Activates:${colors.reset} ${personalities.slice(0, 3).join(', ')}`);
  });

  // Example scenario testing
  console.log(`\n🧪 Scenario Testing:`);
  
  const testScenarios = [
    'architecture',
    'performance',
    'security',
    'testing',
    'documentation',
  ];

  testScenarios.forEach(scenario => {
    const matches = triggerMap.get(scenario);
    if (matches) {
      const personalities = [...new Set(matches.map(m => m.personality))];
      console.log(`\n   Scenario: "${colors.bright}${scenario}${colors.reset}"`);
      console.log(`   Activates: ${colors.green}${personalities.length}${colors.reset} personalities`);
      console.log(`   ${personalities.slice(0, 4).join(', ')}`);
    }
  });

  if (multiPersonalityTriggers.length >= 20) {
    success(`Excellent: ${multiPersonalityTriggers.length} shared triggers enable collaboration`);
  } else {
    info(`Consider adding more shared triggers (current: ${multiPersonalityTriggers.length})`);
  }
}

// Test 7: Personality Specialization
async function testPersonalitySpecialization(loader: PersonalityRegistryLoader) {
  subheader('Test 7: Personality Specialization Analysis');

  const capabilities = loader.getAutoGenerationCapabilities();
  
  // Calculate specialization score (fewer domains = more specialized)
  const specialized = capabilities.map(cap => ({
    personality: cap.personality,
    domainCount: cap.knowledgeDomains.length,
    expertise: cap.expertise,
    specializationScore: cap.expertise / (cap.knowledgeDomains.length || 1),
  })).sort((a, b) => b.specializationScore - a.specializationScore);

  console.log(`\n🎯 Most Specialized (Deep Expertise):`);
  specialized.slice(0, 5).forEach((s, idx) => {
    console.log(`   ${idx + 1}. ${s.personality.padEnd(20)} - Score: ${colors.cyan}${s.specializationScore.toFixed(1)}${colors.reset}`);
    console.log(`      (${Math.round(s.expertise)} expertise / ${s.domainCount} domains)`);
  });

  // Find generalists (many domains)
  const generalists = [...capabilities]
    .sort((a, b) => b.knowledgeDomains.length - a.knowledgeDomains.length);

  console.log(`\n🌐 Most Generalist (Broad Coverage):`);
  generalists.slice(0, 5).forEach((cap, idx) => {
    console.log(`   ${idx + 1}. ${cap.personality.padEnd(20)} - ${colors.cyan}${cap.knowledgeDomains.length}${colors.reset} domains`);
    console.log(`      (${Math.round(cap.expertise)} expertise)`);
  });

  // Balance analysis
  const avgDomains = capabilities.reduce((sum, c) => sum + c.knowledgeDomains.length, 0) / capabilities.length;
  const specialists = capabilities.filter(c => c.knowledgeDomains.length < avgDomains).length;
  const generalList = capabilities.filter(c => c.knowledgeDomains.length >= avgDomains).length;

  console.log(`\n⚖️  Specialization Balance:`);
  console.log(`   Specialists: ${specialists} personalities (${((specialists/capabilities.length)*100).toFixed(0)}%)`);
  console.log(`   Generalists: ${generalList} personalities (${((generalList/capabilities.length)*100).toFixed(0)}%)`);

  if (Math.abs(specialists - generalList) <= 3) {
    success('Excellent: Well-balanced between specialists and generalists');
  } else if (specialists > generalList) {
    info('Specialist-heavy: Strong deep expertise');
  } else {
    info('Generalist-heavy: Broad knowledge coverage');
  }
}

// Test 8: System Health & Performance
async function testSystemHealth(loader: PersonalityRegistryLoader) {
  subheader('Test 8: System Health & Performance Validation');

  const health = await loader.healthCheck();
  const analysis = loader.analyzeRegistry();

  console.log(`\n🏥 Health Status: ${health.status === 'healthy' ? colors.green : colors.yellow}${health.status.toUpperCase()}${colors.reset}`);
  
  console.log(`\n📊 System Metrics:`);
  console.log(`   Personalities Loaded: ${colors.bright}${health.details.personalitiesLoaded}${colors.reset}`);
  console.log(`   Registry Size: ${health.details.registrySizeMB} MB`);
  console.log(`   Memory Usage: ${health.details.memoryUsageMB} MB`);
  console.log(`   Circuit Breaker: ${health.details.circuitBreakerState === 'CLOSED' ? colors.green : colors.yellow}${health.details.circuitBreakerState}${colors.reset}`);

  console.log(`\n⚡ Performance Metrics:`);
  console.log(`   Avg Load Time: ${colors.cyan}${health.metrics.averageLoadTime}ms${colors.reset}`);
  console.log(`   Cache Hit Rate: ${health.metrics.cacheHitRate}%`);
  console.log(`   Error Rate: ${health.metrics.errorRate}%`);
  console.log(`   Total Errors: ${health.metrics.totalErrors}`);

  if (health.details.cacheStats) {
    console.log(`\n💾 Cache Performance:`);
    console.log(`   Cache Size: ${health.details.cacheStats.size}/${health.details.cacheStats.maxSize}`);
    console.log(`   Hit Rate: ${colors.bright}${health.details.cacheStats.hitRate}%${colors.reset}`);
  }

  if (health.warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${health.warnings.length}):`);
    health.warnings.forEach(warning => {
      console.log(`   ${colors.yellow}•${colors.reset} ${warning}`);
    });
  } else {
    success('No warnings - system is healthy!');
  }

  console.log(`\n🔐 Security Posture: ${analysis.securityPosture === 'compliant' ? colors.green : colors.yellow}${analysis.securityPosture.toUpperCase()}${colors.reset}`);
  console.log(`   Validation Compliance: ${analysis.validationCompliance}%`);

  // Overall assessment
  console.log(`\n✅ Overall Assessment:`);
  
  const scores = {
    health: health.status === 'healthy' ? 100 : 50,
    performance: health.metrics.averageLoadTime < 10 ? 100 : 70,
    errors: health.metrics.errorRate < 10 ? 100 : 80,
    cache: health.details.cacheStats ? health.details.cacheStats.hitRate : 0,
    circuit: health.details.circuitBreakerState === 'CLOSED' ? 100 : 0,
  };

  const overallScore = Object.values(scores).reduce((sum, s) => sum + s, 0) / Object.keys(scores).length;

  console.log(`   Overall Score: ${colors.bright}${overallScore.toFixed(0)}/100${colors.reset}`);
  
  if (overallScore >= 90) {
    success('🌟 Excellent: System performing optimally');
  } else if (overallScore >= 75) {
    info('✓ Good: System performing well');
  } else {
    warning('⚠ Needs Attention: System requires optimization');
  }
}

// Run all tests
runCognitiveTests().catch(error => {
  error(`Test suite failed: ${error.message}`);
  process.exit(1);
});
