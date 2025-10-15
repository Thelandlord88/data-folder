#!/usr/bin/env node
/**
 * Hunter Script Audit Tool
 * 
 * Audits all hunter shell scripts and categorizes them into:
 * - Category A: Keep & Integrate
 * - Category B: Combine & Consolidate
 * - Category C: Modernize to TypeScript
 * - Category D: Reverse Engineer (extract patterns)
 * - Category E: Retire (obsolete)
 * 
 * @date October 13, 2025
 */

import { readdir, stat, readFile } from 'fs/promises';
import { join, basename } from 'path';
import { writeFile } from 'fs/promises';

// ============================================================================
// TYPES
// ============================================================================

interface ScriptInfo {
  name: string;
  path: string;
  size: number;
  lastModified: Date;
  age: string;
  lines: number;
  category?: 'A' | 'B' | 'C' | 'D' | 'E';
  reason?: string;
  priority?: number;
  notes?: string;
}

interface AuditReport {
  totalScripts: number;
  audited: Date;
  categories: {
    A: ScriptInfo[];
    B: ScriptInfo[];
    C: ScriptInfo[];
    D: ScriptInfo[];
    E: ScriptInfo[];
  };
  recommendations: string[];
}

// ============================================================================
// AUDIT LOGIC
// ============================================================================

async function auditHunterScripts(): Promise<AuditReport> {
  const huntersDir = join(process.cwd(), 'hunters');
  const files = await readdir(huntersDir);
  const scripts: ScriptInfo[] = [];

  console.log('🔍 Auditing hunter scripts...\n');

  // Gather info for all .sh files
  for (const file of files) {
    if (!file.endsWith('.sh')) continue;

    const filePath = join(huntersDir, file);
    const stats = await stat(filePath);
    const content = await readFile(filePath, 'utf-8');
    const lines = content.split('\n').length;

    const ageMs = Date.now() - stats.mtime.getTime();
    const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
    const ageStr = ageDays > 365 
      ? `${Math.floor(ageDays / 365)}y ${ageDays % 365}d`
      : `${ageDays}d`;

    scripts.push({
      name: file,
      path: filePath,
      size: stats.size,
      lastModified: stats.mtime,
      age: ageStr,
      lines
    });
  }

  console.log(`📊 Found ${scripts.length} hunter scripts\n`);

  // Categorize scripts
  const report: AuditReport = {
    totalScripts: scripts.length,
    audited: new Date(),
    categories: {
      A: [],
      B: [],
      C: [],
      D: [],
      E: []
    },
    recommendations: []
  };

  for (const script of scripts) {
    const categorization = categorizeScript(script);
    script.category = categorization.category;
    script.reason = categorization.reason;
    script.priority = categorization.priority;
    script.notes = categorization.notes;

    report.categories[categorization.category].push(script);

    console.log(`${getCategoryIcon(categorization.category)} ${script.name.padEnd(40)} [${categorization.category}] ${categorization.reason}`);
  }

  // Generate recommendations
  report.recommendations = generateRecommendations(report);

  return report;
}

// ============================================================================
// CATEGORIZATION LOGIC
// ============================================================================

function categorizeScript(script: ScriptInfo): {
  category: 'A' | 'B' | 'C' | 'D' | 'E';
  reason: string;
  priority?: number;
  notes?: string;
} {
  const name = script.name;

  // HIGH VALUE - Category A: Keep & Integrate
  if (name === 'security.sh') {
    return { category: 'A', reason: 'High-value security audit', priority: 1 };
  }
  if (name === 'performance.sh') {
    return { category: 'A', reason: 'High-value performance analysis', priority: 2 };
  }
  if (name === 'pattern_analysis.sh') {
    return { category: 'A', reason: 'Core pattern detection', priority: 3 };
  }
  if (name === 'invariant_gate.sh') {
    return { category: 'A', reason: 'Quality gate enforcement', priority: 4 };
  }
  if (name === 'geo_consistency.sh') {
    return { category: 'A', reason: 'Geo system validation', priority: 5 };
  }
  if (name === '_common.sh') {
    return { category: 'A', reason: 'Shared utilities (required)', priority: 0 };
  }

  // REDUNDANCY - Category B: Combine
  if (name.includes('css_optimization')) {
    return { 
      category: 'B', 
      reason: 'Multiple CSS optimization scripts - combine',
      notes: 'Merge css_optimization_hunter.sh + css_optimization_hunter_working.sh'
    };
  }
  if (name.includes('ts_') && script.lines < 100) {
    return {
      category: 'B',
      reason: 'Small TypeScript check - consolidate',
      notes: 'Combine ts_health.sh + ts_diagnostics.sh'
    };
  }
  if (name.includes('geo_') && name !== 'geo_consistency.sh') {
    return {
      category: 'B',
      reason: 'Geo script - consolidate with geo_consistency',
      notes: 'Merge geo_fitness.sh + link_integrity.sh → geo_comprehensive.sh'
    };
  }

  // MODERNIZE - Category C: TypeScript rewrite
  if (name === 'thinker.sh' || name === 'hunt.sh') {
    return {
      category: 'C',
      reason: 'Complex logic - better as TypeScript',
      notes: 'Rewrite as ThinkingEngine.ts or HunterCore.ts'
    };
  }
  if (name.includes('_boot') || name.includes('adapter')) {
    return {
      category: 'C',
      reason: 'Boot/adapter logic - TypeScript module',
      notes: 'Integration with v3 runtime better in TS'
    };
  }
  if (script.lines > 200) {
    return {
      category: 'C',
      reason: `Large script (${script.lines} lines) - modernize`,
      notes: 'Complex logic benefits from type safety'
    };
  }

  // REVERSE ENGINEER - Category D: Extract patterns
  if (name.includes('build') || name.includes('generated')) {
    return {
      category: 'D',
      reason: 'Build/artifact logic - extract patterns',
      notes: 'Generalize for any build system'
    };
  }
  if (name.includes('optimization') && !name.includes('css')) {
    return {
      category: 'D',
      reason: 'Optimization algorithm - extract',
      notes: 'Create reusable OptimizationPatterns.ts'
    };
  }
  if (name.includes('runtime')) {
    return {
      category: 'D',
      reason: 'Runtime checks - extract patterns',
      notes: 'Create RuntimeValidator.ts module'
    };
  }

  // RETIRE - Category E: Obsolete
  if (script.age.includes('y') && script.lines < 50) {
    return {
      category: 'E',
      reason: `Old (${script.age}) and small - likely obsolete`,
      notes: 'Verify no dependencies before retiring'
    };
  }

  // DEFAULT - Categorize as C (modernize) for unknown scripts
  return {
    category: 'C',
    reason: 'General script - evaluate for modernization',
    notes: 'Review and assign final category'
  };
}

// ============================================================================
// RECOMMENDATIONS
// ============================================================================

function generateRecommendations(report: AuditReport): string[] {
  const recommendations: string[] = [];

  // Category A recommendations
  if (report.categories.A.length > 0) {
    recommendations.push(
      `✅ Integrate ${report.categories.A.length} high-value scripts directly (Week 1, Day 4-5)`
    );
    const topScripts = report.categories.A
      .filter(s => s.priority && s.priority > 0)
      .sort((a, b) => (a.priority || 99) - (b.priority || 99))
      .slice(0, 5)
      .map(s => s.name);
    recommendations.push(`   Priority order: ${topScripts.join(', ')}`);
  }

  // Category B recommendations
  if (report.categories.B.length > 0) {
    recommendations.push(
      `🔄 Consolidate ${report.categories.B.length} redundant scripts into ~${Math.ceil(report.categories.B.length / 3)} combined versions (Week 1, Day 6-7)`
    );
    
    // Group by theme
    const cssScripts = report.categories.B.filter(s => s.name.includes('css')).length;
    const tsScripts = report.categories.B.filter(s => s.name.includes('ts_')).length;
    const geoScripts = report.categories.B.filter(s => s.name.includes('geo_')).length;
    
    if (cssScripts > 1) recommendations.push(`   - Merge ${cssScripts} CSS scripts → css_optimization_comprehensive.sh`);
    if (tsScripts > 1) recommendations.push(`   - Merge ${tsScripts} TS scripts → typescript_health_comprehensive.sh`);
    if (geoScripts > 1) recommendations.push(`   - Merge ${geoScripts} geo scripts → geo_comprehensive.sh`);
  }

  // Category C recommendations
  if (report.categories.C.length > 0) {
    recommendations.push(
      `🔧 Modernize ${report.categories.C.length} scripts to TypeScript modules (Week 2, Day 1-2)`
    );
    const largeScripts = report.categories.C
      .filter(s => s.lines > 200)
      .sort((a, b) => b.lines - a.lines)
      .slice(0, 3)
      .map(s => `${s.name} (${s.lines} lines)`);
    if (largeScripts.length > 0) {
      recommendations.push(`   Focus on large scripts first: ${largeScripts.join(', ')}`);
    }
  }

  // Category D recommendations
  if (report.categories.D.length > 0) {
    recommendations.push(
      `🧠 Reverse engineer ${report.categories.D.length} scripts to extract patterns (Week 2, Day 3-4)`
    );
    recommendations.push(`   Create generalized TypeScript modules for reuse`);
  }

  // Category E recommendations
  if (report.categories.E.length > 0) {
    recommendations.push(
      `🗑️  Retire ${report.categories.E.length} obsolete scripts (Week 2, Day 7)`
    );
    recommendations.push(`   Archive to hunters/__archive__/ with documentation`);
  }

  // Overall recommendation
  const reduction = Math.round((1 - (report.categories.A.length + Math.ceil(report.categories.B.length / 3) + report.categories.C.length) / report.totalScripts) * 100);
  recommendations.push('');
  recommendations.push(`📊 Expected reduction: ${report.totalScripts} scripts → ${report.categories.A.length + Math.ceil(report.categories.B.length / 3) + report.categories.C.length} modern components (${reduction}% fewer)`);

  return recommendations;
}

// ============================================================================
// HELPERS
// ============================================================================

function getCategoryIcon(category: 'A' | 'B' | 'C' | 'D' | 'E'): string {
  const icons = {
    A: '✅',
    B: '🔄',
    C: '🔧',
    D: '🧠',
    E: '🗑️'
  };
  return icons[category];
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

async function generateMarkdownReport(report: AuditReport): Promise<void> {
  const lines: string[] = [];

  lines.push('# 🎯 Hunter Scripts Audit Report');
  lines.push('');
  lines.push(`**Date:** ${report.audited.toISOString().split('T')[0]}`);
  lines.push(`**Total Scripts:** ${report.totalScripts}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Summary
  lines.push('## 📊 Summary');
  lines.push('');
  lines.push('| Category | Count | Description |');
  lines.push('|----------|-------|-------------|');
  lines.push(`| ✅ A | ${report.categories.A.length} | Keep & Integrate (high-value) |`);
  lines.push(`| 🔄 B | ${report.categories.B.length} | Combine & Consolidate (redundant) |`);
  lines.push(`| 🔧 C | ${report.categories.C.length} | Modernize to TypeScript |`);
  lines.push(`| 🧠 D | ${report.categories.D.length} | Reverse Engineer (extract patterns) |`);
  lines.push(`| 🗑️  E | ${report.categories.E.length} | Retire (obsolete) |`);
  lines.push('');

  // Each category
  for (const [cat, scripts] of Object.entries(report.categories) as [keyof typeof report.categories, ScriptInfo[]][]) {
    if (scripts.length === 0) continue;

    const categoryNames = {
      A: 'Category A: Keep & Integrate',
      B: 'Category B: Combine & Consolidate',
      C: 'Category C: Modernize to TypeScript',
      D: 'Category D: Reverse Engineer',
      E: 'Category E: Retire'
    };

    lines.push(`## ${getCategoryIcon(cat)} ${categoryNames[cat]}`);
    lines.push('');

    for (const script of scripts.sort((a, b) => (a.priority || 99) - (b.priority || 99))) {
      lines.push(`### ${script.name}`);
      lines.push(`- **Reason:** ${script.reason}`);
      lines.push(`- **Size:** ${script.lines} lines (${(script.size / 1024).toFixed(1)} KB)`);
      lines.push(`- **Age:** ${script.age}`);
      if (script.priority) lines.push(`- **Priority:** ${script.priority}`);
      if (script.notes) lines.push(`- **Notes:** ${script.notes}`);
      lines.push('');
    }
  }

  // Recommendations
  lines.push('## 🎯 Recommendations');
  lines.push('');
  for (const rec of report.recommendations) {
    lines.push(rec);
  }
  lines.push('');

  // Write report
  const reportPath = join(process.cwd(), 'HUNTER_AUDIT_REPORT.md');
  await writeFile(reportPath, lines.join('\n'), 'utf-8');
  console.log(`\n✅ Report saved to: ${reportPath}`);
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  try {
    const report = await auditHunterScripts();
    
    console.log('\n' + '='.repeat(70));
    console.log('📋 AUDIT COMPLETE');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 Results:');
    console.log(`   ✅ Category A (Keep):      ${report.categories.A.length} scripts`);
    console.log(`   🔄 Category B (Combine):   ${report.categories.B.length} scripts`);
    console.log(`   🔧 Category C (Modernize): ${report.categories.C.length} scripts`);
    console.log(`   🧠 Category D (Extract):   ${report.categories.D.length} scripts`);
    console.log(`   🗑️  Category E (Retire):    ${report.categories.E.length} scripts`);
    console.log('');
    console.log('💡 Recommendations:');
    for (const rec of report.recommendations) {
      console.log(`   ${rec}`);
    }
    console.log('');

    await generateMarkdownReport(report);

  } catch (error) {
    console.error('❌ Error during audit:', error);
    process.exit(1);
  }
}

main();
