/**
 * CSS Engine Issue Analysis
 */

import { DesignSystemArchitect } from './specialists/DesignSystemArchitect.js';

console.log('🔍 CSS Engine Issue Analysis\n');

const architect = new DesignSystemArchitect();

// Issue 1: Check token output structure
console.log('Issue 1: Token Structure');
const result = await architect.run({ colors: ['#0ea5e9'] }, {});
console.log('  Token categories:', Object.keys(result.tokens));
console.log('  Color tokens:', Object.keys(result.tokens.color || {}));
console.log('  Issue: primary-500 =', result.tokens.color?.['primary-500']);
console.log('  ⚠️ Undefined tokens detected!\n');

// Issue 2: Check CSS output format
console.log('Issue 2: CSS Output');
console.log('  CSS length:', result.css.length, 'chars');
console.log('  First 200 chars:\n  ', result.css.substring(0, 200));
console.log('  Contains @theme:', result.css.includes('@theme'));
console.log('  Contains variables:', result.css.includes('--color-'));

// Issue 3: Performance variance
console.log('\nIssue 3: Performance Analysis');
const times: number[] = [];
for (let i = 0; i < 20; i++) {
  const t0 = performance.now();
  await architect.run({ colors: ['#ff0000'] }, {});
  times.push(performance.now() - t0);
}
const avg = times.reduce((a, b) => a + b) / times.length;
const stdDev = Math.sqrt(times.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / times.length);
console.log('  Average:', avg.toFixed(2), 'ms');
console.log('  Std Dev:', stdDev.toFixed(2), 'ms');
console.log('  Variance:', ((stdDev / avg) * 100).toFixed(1), '%');
console.log('  Issue:', stdDev / avg > 0.3 ? '⚠️ High variance!' : '✅ Stable');

// Issue 4: Memory usage
console.log('\nIssue 4: Memory Usage');
const mem1 = process.memoryUsage();
const systems: any[] = [];
for (let i = 0; i < 100; i++) {
  systems.push(await architect.run({ colors: [`#${i.toString(16)}0000`] }, {}));
}
const mem2 = process.memoryUsage();
const memDiff = (mem2.heapUsed - mem1.heapUsed) / 1024 / 1024;
console.log('  100 generations:', memDiff.toFixed(2), 'MB');
console.log('  Per generation:', (memDiff / 100).toFixed(3), 'MB');
console.log('  Issue:', memDiff > 50 ? '⚠️ High memory usage!' : '✅ Acceptable');

// Issue 5: Accessibility validation
console.log('\nIssue 5: Accessibility');
const accessResult = await architect.run({ colors: ['#ffff00'] }, { accessibilityTarget: 'AAA' });
const audits = (accessResult as any).diagnostics?.audits || [];
console.log('  Total audits:', audits.length);
const passedAudits = audits.filter((a: any) => a.status === 'pass').length;
console.log('  Passed:', passedAudits, '/', audits.length);
console.log('  Issue:', passedAudits < audits.length ? '⚠️ Some audits failed' : '✅ All passed');

console.log('\n✅ Analysis complete!');
