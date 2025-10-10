#!/usr/bin/env tsx
/**
 * Hyperdrive Stress Suite for the NEXUS CSS Engine
 * Pushes the DesignSystemArchitect through diverse scenarios and
 * enforces invariants beyond the standard specialist tests.
 */

import { performance } from 'node:perf_hooks';
import { DesignSystemArchitect } from '../specialists/DesignSystemArchitect.js';
import type { CompileOptions, DesignDNA } from '../contracts.js';

type Scenario = {
  name: string;
  dna: DesignDNA;
  options: CompileOptions;
  assertions: ((pkg: Awaited<ReturnType<DesignSystemArchitect['run']>>) => void)[];
};

const architect = new DesignSystemArchitect();

const scenarios: Scenario[] = [
  {
    name: 'Balanced brand system',
    dna: {
      colors: ['#1d4ed8', '#9333ea'],
      textSamples: ['Transform upstream experience', 'We multiply outcomes.'],
      constraints: {
        baseTypePx: 16,
        baseSpacePx: 8,
        typeRatio: 'perfectFourth',
        breakpoints: {
          xs: 320,
          sm: 640,
          md: 768,
          lg: 1024,
          xl: 1280,
          '2xl': 1536,
        },
      },
    },
    options: {
      accessibilityTarget: 'AA',
      budgetMs: 200,
    },
    assertions: [
      (pkg) => {
        if (Object.keys(pkg.tokens.color).length < 10) {
          throw new Error('Expected at least 10 color tokens for balanced system');
        }
      },
      (pkg) => {
        if (!pkg.diagnostics.notes.some((note) => note.includes('spacing'))) {
          throw new Error('Expected spacing diagnostics note');
        }
      },
    ],
  },
  {
    name: 'Motion-aware futuristic brand',
    dna: {
      colors: ['#00f5ff', '#ff00f5', '#061ef7'],
      features: {
        prefersReducedMotion: false,
        futuristic: true,
      },
      constraints: {
        baseTypePx: 18,
        baseSpacePx: 10,
        typeRatio: 'golden',
      },
    },
    options: {
      accessibilityTarget: 'AAA',
      reducedMotion: false,
      budgetMs: 200,
    },
    assertions: [
      (pkg) => {
        const animationCount = Object.keys(pkg.tokens.animation ?? {}).length;
        if (animationCount === 0) {
          throw new Error('Expected animation tokens for motion-aware brand');
        }
      },
      (pkg) => {
        const audits = pkg.diagnostics.audits;
        if (audits.length === 0) {
          throw new Error('Expected audit diagnostics for motion-aware brand');
        }
      },
    ],
  },
  {
    name: 'Ultra-compact enterprise dashboard',
    dna: {
      colors: ['#0f172a'],
      constraints: {
        baseTypePx: 12,
        baseSpacePx: 6,
        typeRatio: 'minorThird',
        breakpoints: {
          xs: 280,
          sm: 560,
          md: 768,
          lg: 1024,
          xl: 1280,
        },
      },
      layoutHints: [
        { type: 'density', value: 'high' },
        { type: 'environment', value: 'dashboard' },
      ],
    },
    options: {
      accessibilityTarget: 'AA',
      budgetMs: 200,
    },
    assertions: [
      (pkg) => {
        const typographySizes = Object.values(pkg.tokens.typography);
        if (!typographySizes.every((value) => Number(value) <= 80)) {
          throw new Error('Typography sizes exceeded compact expectations');
        }
      },
    ],
  },
];

async function runScenario(scenario: Scenario) {
  const { name, dna, options, assertions } = scenario;
  const start = performance.now();
  const pkg = await architect.run(dna, options);
  const duration = performance.now() - start;

  console.log(`
🧪 Scenario: ${name}`);
  console.log(`   Duration: ${duration.toFixed(2)}ms`);
  console.log(`   Tokens: color=${Object.keys(pkg.tokens.color).length}, typography=${Object.keys(pkg.tokens.typography).length}, spacing=${Object.keys(pkg.tokens.spacing).length}`);
  console.log(`   Cache Key: ${pkg.cacheKey.slice(0, 16)}…`);

  if (duration > (options.budgetMs ?? 200)) {
    throw new Error(`Scenario "${name}" exceeded budget (${duration.toFixed(2)}ms)`);
  }

  assertions.forEach((assert) => assert(pkg));
  return { name, duration, cacheKey: pkg.cacheKey };
}

async function determinismCheck() {
  const dna: DesignDNA = {
    colors: ['#4c1d95', '#7c3aed'],
    constraints: {
      baseTypePx: 16,
      baseSpacePx: 8,
      typeRatio: 'perfectFourth',
    },
  };

  const options: CompileOptions = { budgetMs: 200, accessibilityTarget: 'AA' };
  const first = await architect.run(dna, options);
  const second = await architect.run(dna, options);

  if (first.cacheKey !== second.cacheKey) {
    throw new Error('Determinism check failed: cache keys differ between identical runs');
  }

  console.log('\n♻️  Determinism check: PASS');
}

async function sustainedLoad(iterations: number) {
  const dna: DesignDNA = {
    colors: ['#0084ff'],
    constraints: {
      baseTypePx: 16,
      baseSpacePx: 8,
      typeRatio: 'majorThird',
    },
  };

  const options: CompileOptions = { budgetMs: 200 };
  const durations: number[] = [];

  for (let i = 0; i < iterations; i += 1) {
    const start = performance.now();
    await architect.run(dna, options);
    durations.push(performance.now() - start);
  }

  const avg = durations.reduce((sum, value) => sum + value, 0) / durations.length;
  const max = Math.max(...durations);
  const min = Math.min(...durations);

  console.log('\n🛰️  Sustained load summary');
  console.log(`   Iterations: ${iterations}`);
  console.log(`   Avg: ${avg.toFixed(2)}ms | Min: ${min.toFixed(2)}ms | Max: ${max.toFixed(2)}ms`);

  if (max > 15) {
    throw new Error(`Sustained load detected spike above 15ms (max ${max.toFixed(2)}ms)`);
  }
}

(async () => {
  console.log('🔁 NEXUS CSS Engine Hyperdrive Suite');
  const results = await Promise.all(scenarios.map((scenario) => runScenario(scenario)));

  await determinismCheck();
  await sustainedLoad(10);

  console.log('\n✅ Hyperdrive suite complete!');
  results.forEach((result) => {
    console.log(`   • ${result.name}: ${result.duration.toFixed(2)}ms, cache=${result.cacheKey.slice(0, 8)}…`);
  });
})().catch((error) => {
  console.error('\n❌ Hyperdrive suite failed:', error);
  process.exitCode = 1;
});
