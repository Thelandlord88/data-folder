#!/usr/bin/env node
/**
 * Systems Fixer - Repository Diagnostic
 * 
 * Uses The Systems Fixer personality to analyze toolchain issues
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import http from 'http';
import { readFileSync, existsSync } from 'fs';

const execAsync = promisify(exec);
const NEXUS_PORT = 8080;

console.log('\n🔧 SYSTEMS FIXER - Repository Diagnostic\n');
console.log('═'.repeat(80));

// Collect diagnostic data
async function collectDiagnostics() {
  const diagnostics = {
    node: process.version,
    errors: [],
    configs: {},
    issues: []
  };

  console.log('\n📊 Collecting diagnostic data...\n');

  // Check TypeScript
  try {
    console.log('  Checking TypeScript...');
    const { stdout, stderr } = await execAsync('npx tsc --noEmit 2>&1');
    if (stderr || stdout.includes('error TS')) {
      diagnostics.errors.push({
        tool: 'TypeScript',
        output: stdout + stderr
      });
      console.log('    ❌ TypeScript errors found');
    } else {
      console.log('    ✅ TypeScript clean');
    }
  } catch (error) {
    diagnostics.errors.push({
      tool: 'TypeScript',
      output: error.stdout + error.stderr
    });
    console.log('    ❌ TypeScript check failed');
  }

  // Check ESLint
  try {
    console.log('  Checking ESLint...');
    const { stdout } = await execAsync('npx eslint . --ext .ts,.tsx,.astro --max-warnings=0 2>&1');
    console.log('    ✅ ESLint clean');
  } catch (error) {
    diagnostics.errors.push({
      tool: 'ESLint',
      output: error.stdout
    });
    console.log('    ❌ ESLint errors/warnings found');
  }

  // Check for config files
  console.log('  Checking configuration files...');
  const configFiles = [
    'tsconfig.json',
    'tsconfig.eslint.json',
    'eslint.config.js',
    'astro.config.ts',
    'astro.config.mjs',
    'package.json'
  ];

  for (const file of configFiles) {
    if (existsSync(file)) {
      try {
        if (file.endsWith('.json')) {
          diagnostics.configs[file] = JSON.parse(readFileSync(file, 'utf8'));
        }
        console.log(`    ✅ ${file} exists`);
      } catch (error) {
        console.log(`    ⚠️  ${file} exists but couldn't parse`);
      }
    } else {
      console.log(`    ❌ ${file} missing`);
      if (file === 'tsconfig.eslint.json') {
        diagnostics.issues.push('Missing tsconfig.eslint.json for ESLint type-aware linting');
      }
    }
  }

  // Check for resolver configuration
  if (diagnostics.configs['tsconfig.json']) {
    const paths = diagnostics.configs['tsconfig.json'].compilerOptions?.paths;
    if (paths) {
      console.log(`    📍 Path aliases found: ${Object.keys(paths).join(', ')}`);
    }
  }

  // Check package.json
  if (diagnostics.configs['package.json']) {
    const pkg = diagnostics.configs['package.json'];
    console.log(`    📦 Package type: ${pkg.type || 'commonjs'}`);
    
    // Check for resolver packages
    const hasResolver = pkg.devDependencies?.['eslint-import-resolver-typescript'] ||
                       pkg.dependencies?.['eslint-import-resolver-typescript'];
    if (!hasResolver) {
      diagnostics.issues.push('Missing eslint-import-resolver-typescript');
      console.log('    ❌ ESLint TypeScript resolver not installed');
    } else {
      console.log('    ✅ ESLint TypeScript resolver installed');
    }
  }

  return diagnostics;
}

// Request NEXUS analysis from Systems Fixer
async function requestSystemsFixerAnalysis(diagnostics) {
  return new Promise((resolve) => {
    const summary = {
      nodeVersion: diagnostics.node,
      errorCount: diagnostics.errors.length,
      issueCount: diagnostics.issues.length,
      errors: diagnostics.errors.map(e => ({
        tool: e.tool,
        preview: e.output.substring(0, 500)
      })),
      issues: diagnostics.issues,
      hasPathAliases: !!diagnostics.configs['tsconfig.json']?.compilerOptions?.paths,
      hasTsconfigEslint: existsSync('tsconfig.eslint.json'),
      hasResolver: diagnostics.configs['package.json']?.devDependencies?.['eslint-import-resolver-typescript'] !== undefined
    };

    const requestData = JSON.stringify({
      prompt: `Analyze this repository's toolchain issues and provide systematic fixes:\n\n${JSON.stringify(summary, null, 2)}`,
      personalityName: 'systems-fixer',
      context: {
        timestamp: new Date().toISOString(),
        analysisType: 'toolchain-diagnostic',
        requiredSections: [
          'Diagnosis',
          'Root Cause Analysis',
          'Systematic Fix',
          'Verification Checklist',
          'Exact Commands'
        ]
      }
    });

    const req = http.request({
      hostname: 'localhost',
      port: NEXUS_PORT,
      path: '/enhance',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          console.error('❌ Error parsing NEXUS response:', error.message);
          resolve(null);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Error contacting NEXUS:', error.message);
      resolve(null);
    });

    req.setTimeout(20000, () => {
      req.destroy();
      console.error('❌ NEXUS request timeout');
      resolve(null);
    });

    req.write(requestData);
    req.end();
  });
}

// Main execution
async function main() {
  const diagnostics = await collectDiagnostics();

  console.log('\n═'.repeat(80));
  console.log('\n🔬 Requesting Systems Fixer analysis from NEXUS...\n');

  const analysis = await requestSystemsFixerAnalysis(diagnostics);

  if (analysis) {
    console.log('═'.repeat(80));
    console.log('🔧 SYSTEMS FIXER ANALYSIS');
    console.log('═'.repeat(80));
    console.log();
    console.log(analysis.content || analysis.response || 'Analysis unavailable');
    console.log();
    console.log('═'.repeat(80));
    
    if (analysis.confidenceScore) {
      console.log(`\n🎯 Analysis Confidence: ${(analysis.confidenceScore * 100).toFixed(1)}%`);
    }

    console.log('\n✅ Systems Fixer analysis complete!\n');
    console.log('💡 Follow the "Exact Commands" section above to fix issues systematically.\n');
  } else {
    console.log('\n❌ Could not get Systems Fixer analysis');
    console.log('💡 Make sure NEXUS is running: NEXUS_PORT=8080 node nexus/nexus-runtime.mjs &\n');
  }
}

main().catch(error => {
  console.error('❌ Diagnostic failed:', error.message);
  process.exit(1);
});
