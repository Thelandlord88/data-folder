#!/bin/bash

# NEXUS Brain Investigation - Automated Test Runner
# Runs comprehensive tests across all modes and documents results

RESULTS_FILE="NEXUS_INVESTIGATION_RESULTS.md"
API_URL="http://localhost:8080/enhance"

echo "🧠 NEXUS BRAIN INVESTIGATION STARTING..."
echo "📝 Results will be saved to: $RESULTS_FILE"
echo ""

# Initialize results file
cat > "$RESULTS_FILE" << 'EOF'
# NEXUS Brain Investigation Results 🧠

**Date:** $(date)
**Test Runner:** Automated
**API Endpoint:** http://localhost:8080/enhance

---

## 📊 Test Results

EOF

# Function to run test and capture results
run_test() {
    local test_num="$1"
    local test_name="$2"
    local personality="$3"
    local request="$4"
    
    echo "🧪 Running Test $test_num: $test_name"
    
    # Start timing
    start_time=$(date +%s%N)
    
    # Make API call
    response=$(curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "{\"personalityName\":\"$personality\",\"request\":\"$request\"}")
    
    # End timing
    end_time=$(date +%s%N)
    elapsed=$((($end_time - $start_time) / 1000000)) # Convert to milliseconds
    
    # Extract data from response
    success=$(echo "$response" | jq -r '.success // false')
    mode=$(echo "$response" | jq -r '.mode // "single-personality"')
    personality_used=$(echo "$response" | jq -r '.response.personalityUsed // "unknown"')
    
    # For compose mode
    if [[ "$personality" == "compose" ]]; then
        trait_count=$(echo "$response" | jq -r '.response.traits | length // 0')
        synergy=$(echo "$response" | jq -r '.response.synergyScore // 0')
        synergy_pct=$(echo "$synergy * 100" | bc | cut -d. -f1)
        
        # Calculate average expertise
        avg_expertise=$(echo "$response" | jq -r '[.response.traits[].expertise] | add / length // 0' | cut -d. -f1)
    else
        trait_count=$(echo "$response" | jq -r '.response.traitApplications | length // 0')
        synergy_pct="N/A"
        avg_expertise="N/A"
    fi
    
    # Write to results file
    cat >> "$RESULTS_FILE" << RESULT

---

### Test $test_num: $test_name

**Request:** "$request"
**Mode:** $personality → $mode
**Personality Used:** $personality_used
**Response Time:** ${elapsed}ms
**Success:** $success

**Metrics:**
- Traits Activated: $trait_count
- Synergy Score: ${synergy_pct}%
- Average Expertise: ${avg_expertise}%

**Response Preview:**
\`\`\`
$(echo "$response" | jq -r '.response.content // "No content"' | head -20)
...
\`\`\`

**Status:** $([ "$success" = "true" ] && echo "✅ PASS" || echo "❌ FAIL")

RESULT

    echo "   ✓ Complete ($elapsed ms)"
    echo ""
}

# Series 1: Baseline Tests
echo "═══════════════════════════════════════"
echo "📋 SERIES 1: BASELINE SINGLE-PERSONALITY"
echo "═══════════════════════════════════════"
echo ""

run_test "1.1" "Daedalus Baseline" "daedalus" "What are your core architectural principles?"
sleep 1

run_test "1.2" "Hunter Baseline" "hunter" "How do you approach security audits?"
sleep 1

# Series 2: AUTO Mode Tests
echo "═══════════════════════════════════════"
echo "🤖 SERIES 2: AUTO MODE INTELLIGENCE"
echo "═══════════════════════════════════════"
echo ""

run_test "2.1" "Clear Architecture Signal" "auto" "Design a scalable microservices architecture"
sleep 1

run_test "2.2" "Clear Security Signal" "auto" "Find vulnerabilities in authentication system"
sleep 1

run_test "2.3" "Mixed Signals" "auto" "Design a secure, scalable API gateway"
sleep 1

run_test "2.4" "Weak Signals" "auto" "Make our system better"
sleep 1

# Series 3: COMPOSE Mode Tests
echo "═══════════════════════════════════════"
echo "🎨 SERIES 3: COMPOSE MODE SYNERGY"
echo "═══════════════════════════════════════"
echo ""

run_test "3.1" "Multi-Domain Request" "compose" "Build a high-performance, secure, beautiful dashboard with real-time updates"
sleep 1

run_test "3.2" "Deep Technical Request" "compose" "Implement a distributed CRDT-based collaboration system with conflict-free replication"
sleep 1

run_test "3.3" "Security + Architecture" "compose" "Audit our microservices architecture for security vulnerabilities and design flaws"
sleep 1

run_test "3.4" "Broad Ambiguous" "compose" "Improve our entire application stack"
sleep 1

# Series 4: Edge Cases
echo "═══════════════════════════════════════"
echo "⚠️  SERIES 4: EDGE CASES & STRESS TESTS"
echo "═══════════════════════════════════════"
echo ""

run_test "4.1" "Single Word" "auto" "security"
sleep 1

run_test "4.2" "Very Long Request" "compose" "We need to design a cloud-native microservices architecture with kubernetes orchestration, implement comprehensive security with zero-trust principles, ensure GDPR compliance, optimize database performance with caching and sharding, create beautiful responsive UI with accessibility standards, add real-time collaboration features, integrate CI/CD pipelines, implement monitoring and alerting, ensure 99.99% uptime, and do it all with clean maintainable code following SOLID principles"
sleep 1

run_test "4.3" "Unknown Domain" "compose" "Optimize quantum entanglement protocols for interstellar communication"
sleep 1

# Series 5: Meta-Analysis
echo "═══════════════════════════════════════"
echo "🧬 SERIES 5: META-ANALYSIS"
echo "═══════════════════════════════════════"
echo ""

run_test "5.1" "Self-Analysis" "personality-architect" "Analyze the NEXUS personality system. What are its strengths and weaknesses?"
sleep 1

run_test "5.2" "Trait Gap Analysis" "personality-architect" "What cognitive traits are missing from our personality ecosystem?"
sleep 1

run_test "5.3" "Synergy Optimization" "personality-architect" "Which personalities in our system have the highest synergy potential together and why?"
sleep 1

# Summary
echo "═══════════════════════════════════════"
echo "✅ INVESTIGATION COMPLETE!"
echo "═══════════════════════════════════════"
echo ""
echo "📊 Results saved to: $RESULTS_FILE"
echo "🔍 Review the file for detailed analysis"
echo ""

# Generate summary statistics
cat >> "$RESULTS_FILE" << 'EOF'

---

## 📈 Investigation Summary

**Tests Executed:** All series completed
**Duration:** Full suite
**Mode Coverage:** Single, AUTO, COMPOSE

### Quick Stats:
- Baseline tests: 2
- AUTO mode tests: 4
- COMPOSE mode tests: 4
- Edge case tests: 3
- Meta-analysis tests: 3
**Total: 16 tests**

---

## 🎯 Key Findings

*(To be filled in by human analysis)*

### Strengths:
- [ ] 

### Weaknesses:
- [ ] 

### Recommendations:
- [ ] 

---

**Investigation Status:** ✅ COMPLETE
**Next Steps:** Human analysis and system improvements

EOF

echo "🎉 All tests complete! Check $RESULTS_FILE for results."
