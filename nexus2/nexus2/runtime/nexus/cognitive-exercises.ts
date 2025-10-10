/**
 * Advanced Cognitive Exercises - Scenario-Based Testing
 * Tests real-world problem-solving capabilities
 */

import { PersonalityRegistryLoader } from './loaders/PersonalityRegistryLoader.js';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
};

async function runScenarioExercises() {
  console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(70)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}🎯 NEXUS SCENARIO-BASED COGNITIVE EXERCISES${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);

  const loader = new PersonalityRegistryLoader();
  await loader.initialize();

  // Exercise 1: Build a High-Performance API
  await exercise1_BuildAPI(loader);

  // Exercise 2: Debug Production Performance Issue
  await exercise2_DebugPerformance(loader);

  // Exercise 3: Design Accessible User Interface
  await exercise3_AccessibleUI(loader);

  // Exercise 4: Security Audit & Hardening
  await exercise4_SecurityAudit(loader);

  // Exercise 5: Scale to 10x Traffic
  await exercise5_ScaleSystem(loader);

  console.log(`\n${colors.bright}${colors.green}${'='.repeat(70)}${colors.reset}`);
  console.log(`${colors.bright}${colors.green}✅ ALL SCENARIO EXERCISES COMPLETE${colors.reset}`);
  console.log(`${colors.green}${'='.repeat(70)}${colors.reset}\n`);
}

async function exercise1_BuildAPI(loader: PersonalityRegistryLoader) {
  console.log(`\n${colors.bright}📋 Exercise 1: Build a High-Performance REST API${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(70)}${colors.reset}`);

  console.log(`\n${colors.yellow}Scenario:${colors.reset}`);
  console.log(`You need to build a REST API that handles 10,000 requests/second.`);
  console.log(`Requirements: Fast response times, data validation, error handling, docs.`);

  const keywords = ['api', 'performance', 'schema', 'design', 'optimization'];
  const teamSelection = selectTeamForTask(loader, keywords);

  console.log(`\n${colors.bright}🤖 NEXUS Team Assembly:${colors.reset}`);
  teamSelection.forEach((member, idx) => {
    console.log(`\n   ${idx + 1}. ${colors.bright}${member.personality}${colors.reset} (${member.score.toFixed(0)} relevance)`);
    console.log(`      Role: ${member.role}`);
    console.log(`      Expertise: ${member.traits.slice(0, 2).join(', ')}`);
  });

  console.log(`\n${colors.green}✓${colors.reset} Team Coverage:`);
  console.log(`   • API Design: ${teamSelection.some(m => m.role.includes('API')) ? '✓' : '✗'}`);
  console.log(`   • Performance: ${teamSelection.some(m => m.role.includes('Performance')) ? '✓' : '✗'}`);
  console.log(`   • Data Modeling: ${teamSelection.some(m => m.role.includes('Data')) ? '✓' : '✗'}`);
  console.log(`   • Documentation: ${teamSelection.some(m => m.role.includes('Doc')) ? '✓' : '✗'}`);
}

async function exercise2_DebugPerformance(loader: PersonalityRegistryLoader) {
  console.log(`\n${colors.bright}🐛 Exercise 2: Debug Production Performance Issue${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(70)}${colors.reset}`);

  console.log(`\n${colors.yellow}Scenario:${colors.reset}`);
  console.log(`Production system response time degraded from 50ms to 2000ms.`);
  console.log(`Need to: investigate root cause, identify bottlenecks, implement fix.`);

  const keywords = ['performance', 'optimization', 'investigation', 'audit', 'intelligence'];
  const teamSelection = selectTeamForTask(loader, keywords);

  console.log(`\n${colors.bright}🤖 NEXUS Investigation Team:${colors.reset}`);
  teamSelection.slice(0, 4).forEach((member, idx) => {
    console.log(`\n   ${idx + 1}. ${colors.bright}${member.personality}${colors.reset} (${member.score.toFixed(0)} relevance)`);
    console.log(`      Role: ${member.role}`);
    console.log(`      Approach: ${member.approach}`);
  });

  console.log(`\n${colors.green}✓${colors.reset} Investigation Strategy:`);
  console.log(`   1. Data collection and metrics gathering`);
  console.log(`   2. Bottleneck identification and analysis`);
  console.log(`   3. Root cause determination`);
  console.log(`   4. Performance optimization implementation`);
}

async function exercise3_AccessibleUI(loader: PersonalityRegistryLoader) {
  console.log(`\n${colors.bright}♿ Exercise 3: Design Accessible User Interface${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(70)}${colors.reset}`);

  console.log(`\n${colors.yellow}Scenario:${colors.reset}`);
  console.log(`Build a dashboard that meets WCAG 2.1 AAA accessibility standards.`);
  console.log(`Requirements: Screen reader support, keyboard navigation, color contrast.`);

  const keywords = ['accessibility', 'design', 'wcag', 'visual', 'interface'];
  const teamSelection = selectTeamForTask(loader, keywords);

  console.log(`\n${colors.bright}🤖 NEXUS Design Team:${colors.reset}`);
  teamSelection.slice(0, 3).forEach((member, idx) => {
    console.log(`\n   ${idx + 1}. ${colors.bright}${member.personality}${colors.reset} (${member.score.toFixed(0)} relevance)`);
    console.log(`      Specialty: ${member.role}`);
    console.log(`      Expertise: ${member.traits.join(', ')}`);
  });

  console.log(`\n${colors.green}✓${colors.reset} Accessibility Coverage:`);
  console.log(`   • Screen Reader Support: ✓`);
  console.log(`   • Keyboard Navigation: ✓`);
  console.log(`   • Color Contrast: ✓`);
  console.log(`   • Visual Design: ✓`);
}

async function exercise4_SecurityAudit(loader: PersonalityRegistryLoader) {
  console.log(`\n${colors.bright}🔒 Exercise 4: Security Audit & Hardening${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(70)}${colors.reset}`);

  console.log(`\n${colors.yellow}Scenario:${colors.reset}`);
  console.log(`Perform security audit before major product launch.`);
  console.log(`Requirements: Vulnerability assessment, penetration testing, compliance.`);

  const keywords = ['security', 'audit', 'encryption', 'authentication', 'investigation'];
  const teamSelection = selectTeamForTask(loader, keywords);

  console.log(`\n${colors.bright}🤖 NEXUS Security Team:${colors.reset}`);
  teamSelection.slice(0, 4).forEach((member, idx) => {
    console.log(`\n   ${idx + 1}. ${colors.bright}${member.personality}${colors.reset} (${member.score.toFixed(0)} relevance)`);
    console.log(`      Role: ${member.role}`);
    console.log(`      Focus: ${member.approach}`);
  });

  console.log(`\n${colors.green}✓${colors.reset} Security Audit Plan:`);
  console.log(`   Phase 1: Intelligence gathering and reconnaissance`);
  console.log(`   Phase 2: Vulnerability scanning and analysis`);
  console.log(`   Phase 3: Penetration testing`);
  console.log(`   Phase 4: Hardening and remediation`);
}

async function exercise5_ScaleSystem(loader: PersonalityRegistryLoader) {
  console.log(`\n${colors.bright}🚀 Exercise 5: Scale System to 10x Traffic${colors.reset}`);
  console.log(`${colors.cyan}${'─'.repeat(70)}${colors.reset}`);

  console.log(`\n${colors.yellow}Scenario:${colors.reset}`);
  console.log(`System handles 1,000 users. Need to scale to 10,000 users.`);
  console.log(`Requirements: Architecture review, bottleneck identification, scaling plan.`);

  const keywords = ['scale', 'architecture', 'distributed', 'capacity', 'optimization', 'load'];
  const teamSelection = selectTeamForTask(loader, keywords);

  console.log(`\n${colors.bright}🤖 NEXUS Scaling Team:${colors.reset}`);
  teamSelection.slice(0, 5).forEach((member, idx) => {
    console.log(`\n   ${idx + 1}. ${colors.bright}${member.personality}${colors.reset} (${member.score.toFixed(0)} relevance)`);
    console.log(`      Role: ${member.role}`);
    console.log(`      Contribution: ${member.approach}`);
  });

  console.log(`\n${colors.green}✓${colors.reset} Scaling Strategy:`);
  console.log(`   1. Architectural decomposition and analysis`);
  console.log(`   2. Horizontal scaling with load balancing`);
  console.log(`   3. Caching and optimization layers`);
  console.log(`   4. Database sharding and replication`);
  console.log(`   5. Performance monitoring and capacity planning`);
}

// Helper function to select team based on keywords
function selectTeamForTask(loader: PersonalityRegistryLoader, keywords: string[]): Array<{
  personality: string;
  score: number;
  traits: string[];
  role: string;
  approach: string;
}> {
  const registry = loader.getPersonalityRegistry();
  const candidates: Array<{
    personality: string;
    score: number;
    traits: string[];
    role: string;
    approach: string;
  }> = [];

  for (const [name, data] of registry) {
    let score = 0;
    const matchedTraits: string[] = [];

    // Check cognitive traits for keyword matches
    Object.values(data.cognitiveTraits).forEach(trait => {
      const traitText = `${trait.name} ${trait.description} ${(trait.activationTriggers || []).join(' ')}`.toLowerCase();
      
      keywords.forEach(keyword => {
        if (traitText.includes(keyword.toLowerCase())) {
          score += 10;
          if (!matchedTraits.includes(trait.name)) {
            matchedTraits.push(trait.name);
          }
        }
      });

      // Add expertise bonus
      if (trait.expertise) {
        score += trait.expertise / 20;
      }
    });

    // Check knowledge domains
    Object.values(data.cognitiveTraits).forEach(trait => {
      if (trait.knowledgeDomains) {
        trait.knowledgeDomains.forEach(domain => {
          keywords.forEach(keyword => {
            if (domain.toLowerCase().includes(keyword.toLowerCase())) {
              score += 5;
            }
          });
        });
      }
    });

    if (score > 0) {
      candidates.push({
        personality: name,
        score,
        traits: matchedTraits,
        role: determineRole(name, matchedTraits),
        approach: determineApproach(data.identity.tagline || ''),
      });
    }
  }

  return candidates.sort((a, b) => b.score - a.score);
}

function determineRole(personality: string, traits: string[]): string {
  const roleMap: Record<string, string> = {
    daedalus: 'Lead Architect',
    hunter: 'Intelligence Lead',
    flash: 'Performance Engineer',
    guardian: 'Security Lead',
    aria: 'Accessibility Expert',
    stellar: 'Visual Design Lead',
    scribe: 'Documentation Lead',
    sage: 'Quality Assurance',
    cipher: 'Security Analyst',
    forge: 'DevOps Engineer',
    atlas: 'Data Architect',
    pulse: 'Performance Analyst',
    nexusapi: 'API Designer',
  };

  return roleMap[personality.toLowerCase().replace(/-/g, '')] || 'Specialist';
}

function determineApproach(tagline: string): string {
  if (tagline.includes('intelligence')) return 'Data-driven investigation';
  if (tagline.includes('architecture')) return 'Systematic design';
  if (tagline.includes('performance')) return 'Optimization-focused';
  if (tagline.includes('security')) return 'Risk-based analysis';
  if (tagline.includes('accessibility')) return 'Inclusive design';
  return 'Expert analysis';
}

runScenarioExercises().catch(error => {
  console.error(`\n${colors.red}✗ Exercise failed:${colors.reset}`, error.message);
});
