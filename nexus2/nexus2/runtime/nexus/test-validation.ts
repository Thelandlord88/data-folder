/**
 * Simple test to debug personality loading
 */

import { readFile } from 'fs/promises';
import { PersonalitySchema, safeValidatePersonality } from './validation/personality-schema.js';

async function testValidation() {
  try {
    console.log('Reading daedalus.json...');
    const content = await readFile('./profiles/daedalus.json', 'utf-8');
    const data = JSON.parse(content);
    
    console.log('\nPersonality structure:');
    console.log(`- version: ${data.version}`);
    console.log(`- identity.name: ${data.identity?.name}`);
    console.log(`- ideology.principles: ${data.ideology?.principles?.length} items`);
    console.log(`- cognitiveTraits: ${Object.keys(data.cognitiveTraits || {}).length} traits`);
    console.log(`- principles: ${data.principles ? 'present' : 'missing'}`);
    
    console.log('\nTrying validation...');
    const result = safeValidatePersonality(data);
    
    if (result.success) {
      console.log('✅ Validation SUCCESS!');
    } else {
      console.log('❌ Validation FAILED:');
      console.log(JSON.stringify(result.error?.issues, null, 2));
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testValidation();
