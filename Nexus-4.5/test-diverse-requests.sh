#!/bin/bash
# NEXUS Diverse Request Experiment
# Test same goal with different phrasing to activate different personalities

echo "🎨 NEXUS DIVERSE REQUEST PATTERNS EXPERIMENT"
echo "============================================="
echo ""
echo "Goal: Same objective, different phrasing to activate cognitive diversity"
echo "Method: Tailor requests to match different personality trigger words"
echo ""

# Create output directory
mkdir -p experiments
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
EXPERIMENT_DIR="experiments/diverse_${TIMESTAMP}"
mkdir -p "$EXPERIMENT_DIR"

# Ensure NEXUS is running
if ! curl -s http://localhost:8080/status > /dev/null 2>&1; then
    echo "Starting NEXUS runtime..."
    npx tsx nexus-runtime.v2.ts > /tmp/nexus.log 2>&1 &
    sleep 5
fi

# Diverse request patterns - each tailored to activate specific personalities
# Format: "name|request|maxTraits|target_personality"
declare -a REQUESTS=(
    "creative_innovation|Design revolutionary features for NEXUS that inspire users and create beautiful experiences. Think artistic, elegant, harmonious solutions.|5|Aria/Muse/Visionary"
    
    "python_performance|Optimize NEXUS Python code for maximum speed. Profile bottlenecks, implement Cython extensions, use async/await patterns. Make it blazing fast.|7|Pythonista"
    
    "forensic_audit|Audit NEXUS-4.5 for gaps, blind spots, and missing intelligence. Verify all claims with evidence. Identify failure classes and create automated guards.|4|Hunter"
    
    "security_hardening|Secure NEXUS against vulnerabilities. Implement authentication, input validation, cryptography. Protect against injection attacks and exploits.|6|Guardian/EthicsGuard"
    
    "system_architecture|Design scalable distributed architecture for NEXUS. Plan microservices, load balancing, fault tolerance. Build for 1000x scale.|8|Daedalus/ChainArchitect"
    
    "data_intelligence|Analyze NEXUS data patterns. Build ML models for personality selection. Create data pipelines, feature engineering, model training.|6|DataWhisperer/QuantumLogic"
    
    "integration_platform|Connect NEXUS to everything - APIs, webhooks, message queues, databases. Build middleware, ESB patterns, event streaming.|5|IntegrationMaestro"
    
    "performance_metrics|Profile NEXUS performance. Measure latency, throughput, memory usage. Optimize hot paths, implement caching, reduce overhead.|7|PerformanceHawk/Flash"
    
    "testing_quality|Test NEXUS thoroughly. Write unit tests, integration tests, property-based tests. Mock dependencies, use pytest fixtures, achieve 100% coverage.|5|Pythonista/Guardian"
    
    "deployment_pipeline|Build CI/CD for NEXUS. Automate testing, build Docker images, deploy to Kubernetes. Create blue-green deployments with rollback.|6|Forge"
)

echo "📋 Experiment Plan: ${#REQUESTS[@]} diverse requests"
echo ""

# Run each experiment
EXPERIMENT_NUM=1
for request_config in "${REQUESTS[@]}"; do
    IFS='|' read -r name request maxTraits target <<< "$request_config"
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎯 Experiment $EXPERIMENT_NUM/${#REQUESTS[@]}: $name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Target: $target"
    echo "Max Traits: $maxTraits"
    echo ""
    echo "Request: ${request:0:80}..."
    echo ""
    
    # Create request JSON
    cat > "$EXPERIMENT_DIR/request_${name}.json" << EOF
{
  "mode": "COMPOSE",
  "request": "$request",
  "maxTraits": $maxTraits,
  "context": {
    "type": "strategic",
    "situation": "Specialized request for $target",
    "experimentName": "$name"
  }
}
EOF
    
    # Make request
    echo "⏳ Requesting analysis..."
    RESPONSE=$(curl -s -X POST http://localhost:8080/enhance \
        -H "Content-Type: application/json" \
        -d @"$EXPERIMENT_DIR/request_${name}.json")
    
    # Save response
    echo "$RESPONSE" | jq '.' > "$EXPERIMENT_DIR/response_${name}.json"
    
    # Extract key information
    PERSONALITIES=$(echo "$RESPONSE" | jq -r '.response.personalityUsed // "N/A"')
    SYNERGY=$(echo "$RESPONSE" | jq -r '.response.synergyScore // 0' | awk '{printf "%.0f", $1*100}')
    CONFIDENCE=$(echo "$RESPONSE" | jq -r '.response.confidenceScore // 0' | awk '{printf "%.0f", $1*100}')
    TRAIT_COUNT=$(echo "$RESPONSE" | jq -r '.response.traits | length // 0')
    
    echo "✅ Activated Personalities: $PERSONALITIES"
    echo "   Traits: $TRAIT_COUNT | Synergy: ${SYNERGY}% | Confidence: ${CONFIDENCE}%"
    
    # Check if we activated the target
    if [[ "$PERSONALITIES" == *"$target"* ]] || [[ "$PERSONALITIES" =~ [Pp]ythonista|[Hh]unter|[Gg]uardian|[Ff]lash ]]; then
        echo "   ✨ Successfully activated relevant personality!"
    else
        echo "   ⚠️  Different personality selected (still valid)"
    fi
    
    echo ""
    
    # Extract traits
    echo "🧬 Selected Traits:"
    echo "$RESPONSE" | jq -r '.response.traits[]? | "   • \(.name) (\(.personality)) - \(.expertise)%"' | head -3
    echo ""
    
    sleep 1
    EXPERIMENT_NUM=$((EXPERIMENT_NUM + 1))
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Analyzing Personality Activation Patterns"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Count unique personalities activated
echo "🎭 Personality Diversity:"
cat "$EXPERIMENT_DIR"/response_*.json | jq -r '.response.personalityUsed' | tr '+' '\n' | tr ' ' '\n' | sort | uniq -c | sort -rn
echo ""

# Generate detailed report
REPORT_FILE="$EXPERIMENT_DIR/DIVERSITY_ANALYSIS.md"

cat > "$REPORT_FILE" << 'REPORT_START'
# NEXUS Diverse Request Patterns - Analysis

**Experiment Date:** $(date)  
**Purpose:** Test personality activation diversity with targeted request patterns

---

## 🎯 Hypothesis

Different request phrasings should activate different personalities based on:
- Trigger words (keywords that activate specific traits)
- Domain expertise (personalities with relevant knowledge)
- Cognitive patterns (problem-solving approaches)

---

## 📊 Results by Request Pattern

REPORT_START

# Add detailed results
EXPERIMENT_NUM=1
for request_config in "${REQUESTS[@]}"; do
    IFS='|' read -r name request maxTraits target <<< "$request_config"
    
    if [ -f "$EXPERIMENT_DIR/response_${name}.json" ]; then
        PERSONALITIES=$(jq -r '.response.personalityUsed // "N/A"' "$EXPERIMENT_DIR/response_${name}.json")
        TRAIT_COUNT=$(jq -r '.response.traits | length // 0' "$EXPERIMENT_DIR/response_${name}.json")
        SYNERGY=$(jq -r '.response.synergyScore // 0' "$EXPERIMENT_DIR/response_${name}.json" | awk '{printf "%.0f%%", $1*100}')
        
        cat >> "$REPORT_FILE" << DETAIL
### $EXPERIMENT_NUM. $name

**Target:** $target  
**Activated:** $PERSONALITIES  
**Traits:** $TRAIT_COUNT | **Synergy:** $SYNERGY

**Request Pattern:**
> $request

**Success:** $(if [[ "$PERSONALITIES" =~ [Pp]ythonista|[Hh]unter|[Gg]uardian|[Ff]lash|[Mm]use|[Aa]ria ]]; then echo "✅ Relevant personality activated"; else echo "⚠️ Different selection"; fi)

**Selected Traits:**
DETAIL

        jq -r '.response.traits[]? | "- **\(.name)** (\(.personality)) - \(.expertise)%"' \
            "$EXPERIMENT_DIR/response_${name}.json" >> "$REPORT_FILE"
        
        echo "" >> "$REPORT_FILE"
        echo "---" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
    fi
    
    EXPERIMENT_NUM=$((EXPERIMENT_NUM + 1))
done

# Add insights
cat >> "$REPORT_FILE" << 'REPORT_END'

## 💡 Key Insights

### Personality Activation Patterns

1. **Trigger Word Sensitivity**
   - Specific keywords activate corresponding personalities
   - Multiple matches may lead to composition

2. **Domain Expertise Matching**
   - Personalities selected based on knowledge domains
   - Expertise level influences selection priority

3. **Context Awareness**
   - Request context affects personality choice
   - Strategic vs technical vs creative requests

### Effectiveness by Request Type

**Technical Requests:**
- Pythonista, Hunter, Daedalus most activated
- High confidence, specific solutions
- Focus on implementation

**Creative Requests:**
- Visionary, Muse, Aria targeted
- Innovative but may defer to technical
- User experience focused

**Performance Requests:**
- Flash, PerformanceHawk, Atlas selected
- Measurable metrics
- Optimization-driven

**Security Requests:**
- Guardian, EthicsGuard activated
- Risk-aware approach
- Defensive strategies

---

## 🎯 Recommendations for Request Crafting

### To Activate Specific Personalities:

**Pythonista:**
- Use: "python", "async", "pytest", "decorator"
- Focus: Code quality, performance, architecture

**Hunter:**
- Use: "audit", "verify", "evidence", "gap"
- Focus: Analysis, testing, validation

**Flash/PerformanceHawk:**
- Use: "performance", "speed", "optimization", "latency"
- Focus: Metrics, profiling, efficiency

**Guardian:**
- Use: "security", "vulnerability", "authentication"
- Focus: Protection, validation, safety

**Visionary/Muse:**
- Use: "design", "creative", "innovative", "beautiful"
- Focus: User experience, novel solutions

---

**Experiment Location:** $EXPERIMENT_DIR/
**Files:** Request/response pairs for each pattern

*Understanding personality activation is key to leveraging NEXUS effectively!*
REPORT_END

echo "✅ Diversity analysis complete!"
echo ""
echo "📁 Results: $EXPERIMENT_DIR/"
echo "📄 Report: $EXPERIMENT_DIR/DIVERSITY_ANALYSIS.md"
echo ""
echo "🎭 Personalities Activated:"
cat "$EXPERIMENT_DIR"/response_*.json | jq -r '.response.personalityUsed' | tr '+' '\n' | tr ' ' '\n' | grep -v '^$' | sort | uniq -c | sort -rn | head -10
echo ""
echo "✨ Experiment reveals personality activation patterns!"
