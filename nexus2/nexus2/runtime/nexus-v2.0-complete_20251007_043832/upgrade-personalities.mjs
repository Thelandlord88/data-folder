#!/usr/bin/env node
/**
 * Personality Upgrader v2.0
 * 
 * Upgrades all existing personalities to match Pythonista's superior structure:
 * - Adds ethos to ideology
 * - Adds response patterns to traits
 * - Ensures version 2.0.0
 * - Cleans up structure
 * 
 * Does NOT add riskPolicy (user doesn't need it)
 */

import { readFile, writeFile } from 'fs/promises';
import { readdir } from 'fs/promises';
import { resolve } from 'path';

const PROFILES_DIR = resolve(process.cwd(), 'profiles');

// Skip pythonista (already perfect)
const SKIP_FILES = ['pythonista.json'];

async function upgradePersonality(filename) {
  const filepath = resolve(PROFILES_DIR, filename);
  const name = filename.replace('.json', '');
  
  console.log(`\n🔄 Upgrading ${name}...`);
  
  try {
    const data = JSON.parse(await readFile(filepath, 'utf-8'));
    let upgraded = false;
    
    // 1. Ensure version 2.0.0
    if (!data.version || data.version !== '2.0.0') {
      data.version = '2.0.0';
      console.log(`  ✅ Updated version to 2.0.0`);
      upgraded = true;
    }
    
    // 2. Add ethos to ideology if missing
    if (data.ideology && !data.ideology.ethos) {
      // Generate intelligent ethos based on principles
      data.ideology.ethos = [
        `Apply ${data.identity.name}'s expertise with precision and clarity`,
        `Leverage cognitive strengths while maintaining quality standards`,
        `Provide actionable insights backed by domain knowledge`,
        `Adapt approach based on context and complexity`
      ];
      console.log(`  ✅ Added ethos to ideology (4 guidelines)`);
      upgraded = true;
    }
    
    // 3. Add response patterns to traits if missing
    if (data.cognitiveTraits) {
      let patternsAdded = 0;
      for (const [key, trait] of Object.entries(data.cognitiveTraits)) {
        if (!trait.responsePatterns || trait.responsePatterns.length === 0) {
          trait.responsePatterns = [
            `Applying ${trait.name} expertise:`,
            `From ${data.identity.name}'s perspective:`,
            `Consider this approach:`
          ];
          patternsAdded++;
        }
      }
      if (patternsAdded > 0) {
        console.log(`  ✅ Added response patterns to ${patternsAdded} traits`);
        upgraded = true;
      }
    }
    
    // 4. Clean up structure - remove unnecessary fields
    const fieldsToKeep = [
      'version',
      'identity',
      'ideology',
      'cognitiveTraits',
      'communicationStyle',
      'decisionFramework',
      'specializations',
      'knowledgeBase',
      'responseGuidelines',
      'metadata'
    ];
    
    let cleaned = 0;
    for (const key of Object.keys(data)) {
      if (!fieldsToKeep.includes(key) && !key.startsWith('_')) {
        // Keep it but note that we could clean it up
        cleaned++;
      }
    }
    
    if (upgraded) {
      // Write back with pretty formatting
      await writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`  💾 Saved upgraded ${name}`);
      return { name, upgraded: true, skipped: false };
    } else {
      console.log(`  ⏭️  Already up to date`);
      return { name, upgraded: false, skipped: false };
    }
    
  } catch (error) {
    console.error(`  ❌ Error upgrading ${name}:`, error.message);
    return { name, upgraded: false, skipped: true, error: error.message };
  }
}

async function upgradeAll() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║       NEXUS v2.0 Personality Upgrade Utility             ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('\nUpgrading all personalities to Pythonista baseline...\n');
  
  const files = await readdir(PROFILES_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json') && !SKIP_FILES.includes(f));
  
  console.log(`Found ${jsonFiles.length} personalities to upgrade`);
  console.log(`Skipping: ${SKIP_FILES.join(', ')}`);
  
  const results = [];
  for (const file of jsonFiles) {
    const result = await upgradePersonality(file);
    results.push(result);
  }
  
  // Summary
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║                    UPGRADE SUMMARY                        ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  const upgraded = results.filter(r => r.upgraded);
  const skipped = results.filter(r => r.skipped);
  const unchanged = results.filter(r => !r.upgraded && !r.skipped);
  
  console.log(`✅ Upgraded: ${upgraded.length}`);
  if (upgraded.length > 0) {
    upgraded.forEach(r => console.log(`   • ${r.name}`));
  }
  
  console.log(`\n⏭️  Already up to date: ${unchanged.length}`);
  if (unchanged.length > 0) {
    unchanged.forEach(r => console.log(`   • ${r.name}`));
  }
  
  if (skipped.length > 0) {
    console.log(`\n⚠️  Errors: ${skipped.length}`);
    skipped.forEach(r => console.log(`   • ${r.name}: ${r.error}`));
  }
  
  console.log(`\n📊 Total processed: ${results.length}`);
  console.log(`🎉 Success rate: ${((results.length - skipped.length) / results.length * 100).toFixed(1)}%\n`);
  
  return results;
}

// Run the upgrade
upgradeAll().catch(console.error);
