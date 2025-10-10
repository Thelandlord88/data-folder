/**
 * Edge Case Testing for CSS Engine
 */

import { ColorScientist } from './specialists/ColorScientist.js';
import { TypographyArchitect } from './specialists/TypographyArchitect.js';
import { SpatialEngineer } from './specialists/SpatialEngineer.js';
import { DesignSystemArchitect } from './specialists/DesignSystemArchitect.js';

console.log('🔬 CSS Engine Edge Case Testing\n');

// Test 1: Invalid colors
console.log('Test 1: Invalid color input');
try {
  const colorScientist = new ColorScientist();
  const result = await colorScientist.run({ colors: ['invalid'] }, {});
  console.log('  ⚠️ Should have failed but got:', result.primary);
} catch (e) {
  console.log('  ✅ Correctly threw error:', (e as Error).message);
}

// Test 2: Empty input
console.log('\nTest 2: Empty DNA input');
try {
  const architect = new DesignSystemArchitect();
  const result = await architect.run({}, {});
  console.log('  ✅ Handled empty input, got', Object.keys(result.tokens).length, 'token categories');
} catch (e) {
  console.log('  ❌ Failed on empty input:', (e as Error).message);
}

// Test 3: Extreme values
console.log('\nTest 3: Extreme typography values');
try {
  const typo = new TypographyArchitect();
  const tiny = await typo.run({ constraints: { baseTypePx: 4 } }, {});
  console.log('  ✅ Tiny base (4px):', tiny.steps.base, 'px');
  
  const huge = await typo.run({ constraints: { baseTypePx: 100 } }, {});
  console.log('  ✅ Huge base (100px):', huge.steps.base, 'px');
} catch (e) {
  console.log('  ❌ Failed:', (e as Error).message);
}

// Test 4: Very dark/light colors
console.log('\nTest 4: Extreme color lightness');
try {
  const colorScientist = new ColorScientist();
  const black = await colorScientist.run({ colors: ['#000000'] }, {});
  console.log('  ✅ Black handled:', black.primary);
  
  const white = await colorScientist.run({ colors: ['#ffffff'] }, {});
  console.log('  ✅ White handled:', white.primary);
} catch (e) {
  console.log('  ❌ Failed:', (e as Error).message);
}

// Test 5: Performance with multiple runs
console.log('\nTest 5: Performance consistency');
const times: number[] = [];
const architect = new DesignSystemArchitect();
for (let i = 0; i < 10; i++) {
  const t0 = performance.now();
  await architect.run({ colors: ['#' + Math.floor(Math.random()*16777215).toString(16)] }, {});
  times.push(performance.now() - t0);
}
const avg = times.reduce((a, b) => a + b) / times.length;
const min = Math.min(...times);
const max = Math.max(...times);
console.log(`  ✅ Average: ${avg.toFixed(2)}ms, Min: ${min.toFixed(2)}ms, Max: ${max.toFixed(2)}ms`);
console.log(`  ${max / min < 2 ? '✅' : '⚠️'} Performance variance: ${((max / min - 1) * 100).toFixed(1)}%`);

// Test 6: Accessibility targets
console.log('\nTest 6: WCAG accessibility levels');
const aaResult = await architect.run({ colors: ['#0ea5e9'] }, { accessibilityTarget: 'AA' });
console.log('  ✅ AA level:', aaResult.tokens.color['primary-500']);

const aaaResult = await architect.run({ colors: ['#0ea5e9'] }, { accessibilityTarget: 'AAA' });
console.log('  ✅ AAA level:', aaaResult.tokens.color['primary-500']);

console.log('\n✅ Edge case testing complete!');
