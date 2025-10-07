#!/usr/bin/env node
/**
 * NEXUS Personality Behavior Test
 * 
 * Tests how personalities are selected and activated:
 * - Are they hardcoded?
 * - Do they use trait composition?
 * - How does confidence scoring work?
 * - Do multiple personalities respond or just one?
 */

import fetch from 'node:http';

const NEXUS_API = 'http://localhost:8080';

// Test scenarios designed to trigger different personalities
const testScenarios = [
  {
    name: "Architecture Design (Should trigger Daedalus)",
    request: {
      personalityName: "daedalus",
      request: "Design a scalable microservices architecture for an e-commerce platform"
    }
  },
  {
    name: "Security Audit (Should trigger Hunter or Guardian)",
    request: {
      personalityName: "hunter",
      request: "Audit this authentication system for security vulnerabilities and gaps"
    }
  },
  {
    name: "Performance Optimization (Should trigger Flash)",
    request: {
      personalityName: "flash",
      request: "Optimize this React component for maximum rendering performance"
    }
  },
  {
    name: "Generic Request (Test default behavior)",
    request: {
      personalityName: "sage",
      request: "Explain the benefits of using TypeScript in a large codebase"
    }
  },
  {
    name: "Non-existent Personality (Test fallback)",
    request: {
      personalityName: "nonexistent-personality",
      request: "What happens when we request a personality that doesn't exist?"
    }
  },
  {
    name: "Strategic Intelligence Test (Multi-trait scenario)",
    request: {
      personalityName: "hunter",
      request: "Gather intelligence on our geo data architecture, analyze strategic implications, and establish continuous validation"
    }
  }
];

/**
 * Make request to NEXUS API
 */
async function makeNexusRequest(request) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(request);
    
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/enhance',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = fetch.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

/**
 * Check NEXUS status
 */
async function checkStatus() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/status',
      method: 'GET'
    };

    const req = fetch.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Analyze response to understand personality selection
 */
function analyzeResponse(scenario, response) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`TEST: ${scenario.name}`);
  console.log(`${'='.repeat(80)}`);
  console.log(`\n📝 Request:`);
  console.log(`   Personality: ${scenario.request.personalityName}`);
  console.log(`   Query: "${scenario.request.request.substring(0, 80)}..."`);
  
  if (response.statusCode !== 200) {
    console.log(`\n❌ ERROR: Status ${response.statusCode}`);
    console.log(`   ${JSON.stringify(response.data, null, 2)}`);
    return;
  }

  const data = response.data;
  
  console.log(`\n✅ Response Received:`);
  console.log(`   Status: ${response.statusCode}`);
  
  // Check which personality actually responded
  console.log(`\n🎭 Personality Selection:`);
  console.log(`   Requested: ${scenario.request.personalityName}`);
  console.log(`   Used: ${data.personalitySignature || data.source || 'unknown'}`);
  console.log(`   Confidence: ${data.confidence || 'N/A'}`);
  
  // Check for trait applications
  if (data.traitApplications && data.traitApplications.length > 0) {
    console.log(`\n🧬 Traits Applied: ${data.traitApplications.length}`);
    data.traitApplications.forEach((trait, i) => {
      console.log(`   ${i + 1}. ${trait.trait} (confidence: ${trait.confidence})`);
      console.log(`      → ${trait.application?.substring(0, 60)}...`);
    });
  } else {
    console.log(`\n⚠️  No trait applications recorded`);
  }
  
  // Check for strategic intelligence
  if (data.intelligenceGathered) {
    console.log(`\n🔍 Strategic Intelligence: YES`);
    console.log(`   Sources: ${data.intelligenceGathered.length}`);
  }
  
  if (data.implicationsAnalyzed) {
    console.log(`\n📊 Strategic Implications: YES`);
  }
  
  if (data.continuousValidation) {
    console.log(`\n🔄 Continuous Validation: YES`);
  }
  
  // Response preview
  console.log(`\n💬 Response Preview:`);
  const preview = data.response?.substring(0, 200) || 'No response text';
  console.log(`   "${preview}..."`);
  
  // Processing info
  console.log(`\n⏱️  Processing:`);
  console.log(`   Time: ${data.processingTime || 'N/A'}ms`);
  console.log(`   Source: ${data.source || 'unknown'}`);
  
  return {
    requested: scenario.request.personalityName,
    used: data.personalitySignature || data.source,
    confidence: data.confidence,
    traitsCount: data.traitApplications?.length || 0,
    hasStrategicIntel: !!data.intelligenceGathered,
    processingTime: data.processingTime
  };
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🧪 NEXUS PERSONALITY BEHAVIOR TEST');
  console.log('=' .repeat(80));
  console.log('\nObjective: Understand how NEXUS selects and activates personalities\n');
  
  // Check if NEXUS is running
  console.log('📡 Checking NEXUS status...');
  try {
    const status = await checkStatus();
    console.log(`✅ NEXUS is running on port ${status.port}`);
    console.log(`   Uptime: ${status.uptimeFormatted}`);
    console.log(`   Enhancements performed: ${status.enhancementsPerformed}`);
    console.log(`   Consciousness health: ${status.consciousnessHealth?.status || 'unknown'}\n`);
  } catch (error) {
    console.error('❌ NEXUS is not running! Start it with: node nexus/nexus-runtime.mjs');
    process.exit(1);
  }
  
  // Run all test scenarios
  const results = [];
  
  for (const scenario of testScenarios) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay between requests
      const response = await makeNexusRequest(scenario.request);
      const analysis = analyzeResponse(scenario, response);
      results.push(analysis);
    } catch (error) {
      console.error(`\n❌ Test failed: ${error.message}`);
    }
  }
  
  // Summary analysis
  console.log(`\n\n${'='.repeat(80)}`);
  console.log('📊 TEST SUMMARY & ANALYSIS');
  console.log(`${'='.repeat(80)}\n`);
  
  console.log('🎯 Key Findings:\n');
  
  // Check if personalities are hardcoded or adaptive
  const personalityMatches = results.filter(r => 
    r.requested === r.used || 
    (r.used && r.used.toLowerCase().includes(r.requested.toLowerCase()))
  );
  
  console.log(`1. Personality Selection:`);
  console.log(`   - Requests honored: ${personalityMatches.length}/${results.length}`);
  console.log(`   - System appears: ${personalityMatches.length === results.length ? 'HARDCODED' : 'ADAPTIVE'}`);
  
  // Check trait system usage
  const traitsUsed = results.filter(r => r.traitsCount > 0);
  console.log(`\n2. Trait System:`);
  console.log(`   - Responses with traits: ${traitsUsed.length}/${results.length}`);
  console.log(`   - Average traits per response: ${(results.reduce((sum, r) => sum + r.traitsCount, 0) / results.length).toFixed(1)}`);
  console.log(`   - Trait system: ${traitsUsed.length > 0 ? 'ACTIVE' : 'INACTIVE'}`);
  
  // Check strategic intelligence
  const withIntel = results.filter(r => r.hasStrategicIntel);
  console.log(`\n3. Strategic Intelligence:`);
  console.log(`   - Responses with strategic intel: ${withIntel.length}/${results.length}`);
  console.log(`   - Strategic pipeline: ${withIntel.length > 0 ? 'OPERATIONAL' : 'DISABLED'}`);
  
  // Confidence analysis
  const withConfidence = results.filter(r => r.confidence);
  console.log(`\n4. Confidence Scoring:`);
  console.log(`   - Responses with confidence: ${withConfidence.length}/${results.length}`);
  if (withConfidence.length > 0) {
    const avgConfidence = withConfidence.reduce((sum, r) => sum + r.confidence, 0) / withConfidence.length;
    console.log(`   - Average confidence: ${(avgConfidence * 100).toFixed(1)}%`);
  }
  
  // Performance
  const avgTime = results.reduce((sum, r) => sum + (r.processingTime || 0), 0) / results.length;
  console.log(`\n5. Performance:`);
  console.log(`   - Average processing time: ${avgTime.toFixed(0)}ms`);
  
  console.log(`\n${'='.repeat(80)}`);
  console.log('🎓 CONCLUSION:\n');
  
  if (personalityMatches.length === results.length) {
    console.log('✅ Personalities are HARDCODED - Exact personality requested is used');
  } else {
    console.log('✅ Personalities are ADAPTIVE - System selects based on task analysis');
  }
  
  if (traitsUsed.length > 0) {
    console.log('✅ Trait composition system is ACTIVE');
  } else {
    console.log('⚠️  Trait composition system may be INACTIVE or not recording applications');
  }
  
  if (withIntel.length > 0) {
    console.log('✅ Strategic intelligence pipeline is OPERATIONAL');
  } else {
    console.log('⚠️  Strategic intelligence pipeline may not be triggering');
  }
  
  console.log(`\n${'='.repeat(80)}\n`);
}

// Run tests
runTests().catch(console.error);
