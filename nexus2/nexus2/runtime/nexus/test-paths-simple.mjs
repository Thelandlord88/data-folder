import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const profilesPath = resolve(__dirname, '../profiles');
const testFilePath = resolve(profilesPath, 'daedalus.json');

console.log('Path resolution test:');
console.log('  __dirname:', __dirname);
console.log('  profilesPath:', profilesPath);
console.log('  testFilePath:', testFilePath);

const normalizedProfilesPath = profilesPath.replace(/\\/g, '/');
const normalizedFilePath = testFilePath.replace(/\\/g, '/');

console.log('\nNormalized:');
console.log('  profilesPath:', normalizedProfilesPath);
console.log('  filePath:', normalizedFilePath);
console.log('  startsWith:', normalizedFilePath.startsWith(normalizedProfilesPath));

try {
  const content = await readFile(testFilePath, 'utf-8');
  const data = JSON.parse(content);
  console.log('\n✅ File read successful!');
  console.log(`  Personality: ${data.identity.name}`);
} catch (error) {
  console.error('\n❌ File read failed:', error.message);
}
