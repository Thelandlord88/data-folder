const profilesPath = "/workspaces/09sep/nexus/runtime/profiles";
const filePath = "/workspaces/09sep/nexus/runtime/profiles/daedalus.json";

console.log('Test 1 - with trailing slash:');
console.log(`  "${filePath}".startsWith("${profilesPath}/")`);
console.log(`  Result: ${filePath.startsWith(profilesPath + '/')}`);

console.log('\nTest 2 - without trailing slash:');
console.log(`  "${filePath}".startsWith("${profilesPath}")`);
console.log(`  Result: ${filePath.startsWith(profilesPath)}`);

console.log('\nTest 3 - check directory boundary:');
const safeCheck = filePath.startsWith(profilesPath) && 
                  (filePath.length === profilesPath.length || 
                   filePath[profilesPath.length] === '/');
console.log(`  Result: ${safeCheck}`);
