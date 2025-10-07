/**
 * Test path resolution
 */

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const profilesPath = resolve(__dirname, '../profiles');
const testFilePath = resolve(profilesPath, 'daedalus.json');

console.log('Path resolution test:');
console.log('  __dirname:', __dirname);
console.log('  profilesPath:', profilesPath);
console.log('  testFilePath:', testFilePath);
console.log('  startsWith check:', testFilePath.startsWith(profilesPath));

// Try normalized
const normalizedProfilesPath = profilesPath.replace(/\\/g, '/');
const normalizedFilePath = testFilePath.replace(/\\/g, '/');

console.log('\nNormalized paths:');
console.log('  profilesPath:', normalizedProfilesPath);
console.log('  filePath:', normalizedFilePath);
console.log('  startsWith check:', normalizedFilePath.startsWith(normalizedProfilesPath));

// Try reading
import { readFile } from 'fs/promises';

try {
  const content = await readFile(testFilePath, 'utf-8');
  const data = JSON.parse(content);
  console.log('\n✅ File read successful!');
  console.log(`  Personality: ${data.identity.name}`);
} catch (error) {
  console.error('\n❌ File read failed:', error.message);
}
