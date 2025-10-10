/**
 * Test the fixes we made
 */

import { DesignSystemArchitect } from './specialists/DesignSystemArchitect.js';

console.log('🧪 Testing CSS Engine Fixes\n');

const architect = new DesignSystemArchitect();

// Test 1: Check token structure
console.log('Test 1: Token Structure Fix');
const result = await architect.run({ colors: ['#0ea5e9'] }, {});
console.log('  ✅ Token categories:', Object.keys(result.tokens));
console.log('  ✅ Sample color tokens:', Object.keys(result.tokens.color).slice(0, 8));
console.log('  Check primary-500:', result.tokens.color['primary-500'] ? '✅ EXISTS!' : '❌ Missing');
console.log('  Check 500:', result.tokens.color['500'] ? '✅ EXISTS!' : '❌ Missing');

// Test 2: Check CSS output
console.log('\nTest 2: CSS Output Fix');
console.log('  CSS property exists:', result.css ? '✅ YES' : '❌ NO');
console.log('  CSS length:', result.css?.length || 0, 'chars');
console.log('  Contains @theme:', result.css?.includes('@theme') ? '✅ YES' : '❌ NO');
console.log('  Contains primary-500:', result.css?.includes('primary-500') ? '✅ YES' : '❌ NO');

// Test 3: Show sample CSS
console.log('\nTest 3: Sample CSS Output');
if (result.css) {
  const lines = result.css.split('\n').slice(0, 15);
  lines.forEach(line => console.log('  ', line));
}

// Test 4: Token counts
console.log('\nTest 4: Token Statistics');
console.log('  Color tokens:', Object.keys(result.tokens.color).length);
console.log('  Typography tokens:', Object.keys(result.tokens.typography).length);
console.log('  Spacing tokens:', Object.keys(result.tokens.spacing).length);
console.log('  Breakpoints:', Object.keys(result.tokens.breakpoints).length);

// Test 5: Accessibility with different levels
console.log('\nTest 5: Accessibility Levels');
const aaResult = await architect.run({ colors: ['#ff0000'] }, { accessibilityTarget: 'AA' });
const aaaResult = await architect.run({ colors: ['#ff0000'] }, { accessibilityTarget: 'AAA' });
console.log('  AA audits:', aaResult.diagnostics.audits.length);
console.log('  AAA audits:', aaaResult.diagnostics.audits.length);

console.log('\n✅ All fixes tested!');
