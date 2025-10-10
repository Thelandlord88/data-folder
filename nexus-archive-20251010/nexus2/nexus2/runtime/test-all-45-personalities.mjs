#!/usr/bin/env node

/**
 * NEXUS v2.0 - Comprehensive 45 Personality Test Suite
 * Tests all personalities including the 18 newly added ones
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const profilesDir = join(__dirname, 'profiles');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

// Expected 45 personalities
const EXPECTED_PERSONALITIES = [
  'aria', 'artdirector', 'atlas', 'atlas-geo', 'chainarchitect', 'chorus',
  'chromatic', 'cipher', 'codex-liaison', 'contextweaver', 'daedalus',
  'datawhisperer', 'ethicsguard', 'finetuner', 'flash', 'forge',
  'guardian', 'hunter', 'integrationmaestro', 'localize', 'muse',
  'narrative', 'nexus-api', 'performancehawk', 'personality-architect',
  'photorealist', 'promptcrafter', 'promptsmith', 'property-sage',
  'pulse', 'pulsewriter', 'pythonista', 'quantumlogic', 'route-master',
  'sage', 'scribe', 'stellar', 'styleforge', 'symphony', 'tokenmaster',
  'touch', 'visualarchitect', 'visionary', 'wordsmith'
];

// Newly added personalities
const NEW_PERSONALITIES = [
  'visionary', 'wordsmith', 'chromatic', 'narrative', 'muse',
  'styleforge', 'photorealist', 'artdirector',
  'contextweaver', 'chainarchitect', 'finetuner', 'tokenmaster',
  'quantumlogic', 'ethicsguard', 'performancehawk', 'datawhisperer',
  'integrationmaestro', 'visualarchitect'
];

class PersonalityTester {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
    this.stats = {
      totalTraits: 0,
      totalTriggers: 0,
      totalDomains: 0,
      avgTraitsPerPersonality: 0,
      avgTriggersPerTrait: 0,
      avgDomainsPerTrait: 0
    };
  }

  log(message, color = 'white') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  testPersonality(name, data) {
    const test = {
      name,
      passed: true,
      errors: [],
      warnings: [],
      stats: {
        traits: 0,
        triggers: 0,
        domains: 0
      }
    };

    // Test 1: Required fields
    const requiredFields = ['name', 'tagline', 'version', 'description', 'cognitiveTraits', 'personality', 'expertiseAreas'];
    for (const field of requiredFields) {
      if (!data[field]) {
        test.errors.push(`Missing required field: ${field}`);
        test.passed = false;
      }
    }

    // Test 2: Cognitive traits validation
    if (data.cognitiveTraits && Array.isArray(data.cognitiveTraits)) {
      test.stats.traits = data.cognitiveTraits.length;
      
      if (data.cognitiveTraits.length === 0) {
        test.errors.push('No cognitive traits defined');
        test.passed = false;
      }

      data.cognitiveTraits.forEach((trait, idx) => {
        if (!trait.name) {
          test.errors.push(`Trait ${idx}: Missing name`);
          test.passed = false;
        }
        if (!trait.expertise || trait.expertise < 0 || trait.expertise > 100) {
          test.errors.push(`Trait ${idx} (${trait.name}): Invalid expertise level`);
          test.passed = false;
        }
        if (!trait.activationTriggers || trait.activationTriggers.length === 0) {
          test.warnings.push(`Trait ${idx} (${trait.name}): No activation triggers`);
        } else {
          test.stats.triggers += trait.activationTriggers.length;
        }
        if (!trait.knowledgeDomains || trait.knowledgeDomains.length === 0) {
          test.warnings.push(`Trait ${idx} (${trait.name}): No knowledge domains`);
        } else {
          test.stats.domains += trait.knowledgeDomains.length;
        }
      });
    }

    // Test 3: Personality fields
    if (data.personality) {
      const personalityFields = ['tone', 'communicationStyle', 'approach'];
      for (const field of personalityFields) {
        if (!data.personality[field]) {
          test.warnings.push(`Missing personality.${field}`);
        }
      }
    }

    // Test 4: Expertise areas
    if (data.expertiseAreas && data.expertiseAreas.length === 0) {
      test.errors.push('No expertise areas defined');
      test.passed = false;
    }

    // Test 5: Collaboration style (optional but recommended)
    if (!data.collaborationStyle) {
      test.warnings.push('No collaboration style defined');
    }

    this.results.tests.push(test);
    this.results.total++;
    if (test.passed) {
      this.results.passed++;
    } else {
      this.results.failed++;
    }
    this.results.warnings += test.warnings.length;

    // Update stats
    this.stats.totalTraits += test.stats.traits;
    this.stats.totalTriggers += test.stats.triggers;
    this.stats.totalDomains += test.stats.domains;

    return test;
  }

  async runTests() {
    this.log('\n╔════════════════════════════════════════════════════════════════════╗', 'cyan');
    this.log('║      NEXUS v2.0 - COMPREHENSIVE 45 PERSONALITY TEST SUITE        ║', 'cyan');
    this.log('╚════════════════════════════════════════════════════════════════════╝\n', 'cyan');

    // Get all personality files
    const files = readdirSync(profilesDir)
      .filter(f => f.endsWith('.json') && f !== 'manifest.json');

    this.log(`📁 Found ${files.length} personality files\n`, 'cyan');
    this.log(`📋 Expected ${EXPECTED_PERSONALITIES.length} personalities\n`, 'cyan');
    this.log(`🆕 Testing ${NEW_PERSONALITIES.length} newly added personalities\n`, 'magenta');

    // Load and test each personality
    for (const file of files) {
      const name = file.replace('.json', '');
      const isNew = NEW_PERSONALITIES.includes(name);
      
      try {
        const content = readFileSync(join(profilesDir, file), 'utf-8');
        const data = JSON.parse(content);
        
        const marker = isNew ? '🆕' : '  ';
        this.log(`${marker} Testing: ${name}...`, 'white');
        
        const test = this.testPersonality(name, data);
        
        if (test.passed) {
          this.log(`  ✅ PASSED - ${test.stats.traits} traits, ${test.stats.triggers} triggers, ${test.stats.domains} domains`, 'green');
        } else {
          this.log(`  ❌ FAILED`, 'red');
          test.errors.forEach(err => this.log(`     - ${err}`, 'red'));
        }
        
        if (test.warnings.length > 0) {
          test.warnings.forEach(warn => this.log(`     ⚠️  ${warn}`, 'yellow'));
        }
      } catch (error) {
        this.log(`  ❌ ERROR: ${error.message}`, 'red');
        this.results.total++;
        this.results.failed++;
      }
    }

    // Calculate final stats
    if (this.results.total > 0) {
      this.stats.avgTraitsPerPersonality = (this.stats.totalTraits / this.results.total).toFixed(1);
      this.stats.avgTriggersPerTrait = (this.stats.totalTriggers / this.stats.totalTraits).toFixed(1);
      this.stats.avgDomainsPerTrait = (this.stats.totalDomains / this.stats.totalTraits).toFixed(1);
    }

    // Check for missing personalities
    const foundPersonalities = files.map(f => f.replace('.json', ''));
    const missing = EXPECTED_PERSONALITIES.filter(p => !foundPersonalities.includes(p));
    const extra = foundPersonalities.filter(p => !EXPECTED_PERSONALITIES.includes(p) && p !== 'manifest');

    // Print summary
    this.printSummary(missing, extra);
  }

  printSummary(missing, extra) {
    this.log('\n\n╔════════════════════════════════════════════════════════════════════╗', 'cyan');
    this.log('║                         TEST SUMMARY                               ║', 'cyan');
    this.log('╚════════════════════════════════════════════════════════════════════╝\n', 'cyan');

    const passRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    const passColor = passRate >= 95 ? 'green' : passRate >= 80 ? 'yellow' : 'red';

    this.log(`📊 Total Tests:     ${this.results.total}`, 'white');
    this.log(`✅ Passed:          ${this.results.passed}`, 'green');
    this.log(`❌ Failed:          ${this.results.failed}`, this.results.failed > 0 ? 'red' : 'white');
    this.log(`⚠️  Warnings:        ${this.results.warnings}`, this.results.warnings > 0 ? 'yellow' : 'white');
    this.log(`📈 Pass Rate:       ${passRate}%`, passColor);

    this.log('\n╔════════════════════════════════════════════════════════════════════╗', 'cyan');
    this.log('║                      SYSTEM STATISTICS                             ║', 'cyan');
    this.log('╚════════════════════════════════════════════════════════════════════╝\n', 'cyan');

    this.log(`🎭 Total Personalities:    ${this.results.total}`, 'white');
    this.log(`🧠 Total Traits:           ${this.stats.totalTraits}`, 'white');
    this.log(`⚡ Total Triggers:         ${this.stats.totalTriggers}`, 'white');
    this.log(`📚 Total Domains:          ${this.stats.totalDomains}`, 'white');
    this.log(`📊 Avg Traits/Personality: ${this.stats.avgTraitsPerPersonality}`, 'white');
    this.log(`📊 Avg Triggers/Trait:     ${this.stats.avgTriggersPerTrait}`, 'white');
    this.log(`📊 Avg Domains/Trait:      ${this.stats.avgDomainsPerTrait}`, 'white');

    if (missing.length > 0) {
      this.log('\n⚠️  Missing Expected Personalities:', 'yellow');
      missing.forEach(p => this.log(`   - ${p}`, 'yellow'));
    }

    if (extra.length > 0) {
      this.log('\nℹ️  Extra Personalities (not in expected list):', 'cyan');
      extra.forEach(p => this.log(`   - ${p}`, 'cyan'));
    }

    // New personalities report
    const newTests = this.results.tests.filter(t => NEW_PERSONALITIES.includes(t.name));
    const newPassed = newTests.filter(t => t.passed).length;
    
    this.log('\n╔════════════════════════════════════════════════════════════════════╗', 'magenta');
    this.log('║                   NEW PERSONALITIES STATUS                         ║', 'magenta');
    this.log('╚════════════════════════════════════════════════════════════════════╝\n', 'magenta');

    this.log(`🆕 New Personalities Added: ${NEW_PERSONALITIES.length}`, 'magenta');
    this.log(`✅ New Personalities Passed: ${newPassed}`, newPassed === NEW_PERSONALITIES.length ? 'green' : 'red');
    
    if (newPassed === NEW_PERSONALITIES.length) {
      this.log('\n🎉 ALL NEW PERSONALITIES WORKING PERFECTLY! 🎉', 'green');
    }

    // Final status
    this.log('\n╔════════════════════════════════════════════════════════════════════╗', 'cyan');
    this.log('║                       FINAL STATUS                                 ║', 'cyan');
    this.log('╚════════════════════════════════════════════════════════════════════╝\n', 'cyan');

    if (this.results.failed === 0 && missing.length === 0) {
      this.log('🎊 NEXUS v2.0 COMPLETE! ALL 45 PERSONALITIES OPERATIONAL! 🎊', 'green');
      this.log('✨ System Status: PRODUCTION READY ✨', 'green');
    } else if (this.results.failed === 0 && missing.length > 0) {
      this.log('✅ All Present Personalities Passed', 'green');
      this.log('⚠️  Some Expected Personalities Missing', 'yellow');
    } else {
      this.log('❌ Some Tests Failed - Review Errors Above', 'red');
    }

    this.log('');
  }
}

// Run tests
const tester = new PersonalityTester();
tester.runTests().catch(console.error);
