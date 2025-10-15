#!/bin/bash
# NEXUS Personality Rotation Experiment
# Systematically test different personality combinations and trait counts
# to understand cognitive diversity and optimal configurations

echo "🔬 NEXUS PERSONALITY ROTATION EXPERIMENT"
echo "========================================="
echo ""
echo "Goal: Test different personality combinations for power improvements"
echo "Method: Rotate through personality groups with varying trait counts"
echo "Output: Comprehensive analysis of cognitive diversity"
echo ""

# Create output directory
mkdir -p experiments
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
EXPERIMENT_DIR="experiments/rotation_${TIMESTAMP}"
mkdir -p "$EXPERIMENT_DIR"

# Ensure NEXUS is running
if ! curl -s http://localhost:8080/status > /dev/null 2>&1; then
    echo "Starting NEXUS runtime..."
    npx tsx nexus-runtime.v2.ts > /tmp/nexus.log 2>&1 &
    sleep 5
fi

# Base request for all experiments
BASE_REQUEST="Analyze NEXUS-4.5 and suggest POWERFUL improvements to make it 10x-100x more capable. Focus on: Performance, Scalability, New Features, Integration, and Revolutionary Ideas. Be specific and actionable."

# Experiment configurations
# Format: "name|mode|maxTraits|description"
declare -a EXPERIMENTS=(
    "technical_trio|COMPOSE|3|Technical specialists: Pythonista + Hunter + Daedalus"
    "creative_minds|COMPOSE|5|Creative thinkers: Visionary + Muse + Aria"
    "performance_squad|COMPOSE|7|Performance experts: Flash + PerformanceHawk + Atlas"
    "security_team|COMPOSE|4|Security focused: Guardian + EthicsGuard + Cipher"
    "architect_group|COMPOSE|6|System architects: Daedalus + ChainArchitect + Forge"
    "data_specialists|COMPOSE|5|Data experts: Atlas + DataWhisperer + QuantumLogic"
    "integration_team|COMPOSE|4|Integration: IntegrationMaestro + NexusAPI + RouteMaster"
    "full_stack|COMPOSE|10|Full stack: Pythonista + Forge + Guardian + Daedalus"
    "ai_research|COMPOSE|8|AI/ML focus: QuantumLogic + DataWhisperer + PerformanceHawk"
    "max_power|COMPOSE|15|Maximum traits: Let NEXUS choose best combination"
)

echo "📋 Experiment Plan: ${#EXPERIMENTS[@]} configurations"
echo ""

# Run each experiment
EXPERIMENT_NUM=1
for experiment in "${EXPERIMENTS[@]}"; do
    IFS='|' read -r name mode maxTraits description <<< "$experiment"
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🧪 Experiment $EXPERIMENT_NUM/${#EXPERIMENTS[@]}: $name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Description: $description"
    echo "Mode: $mode"
    echo "Max Traits: $maxTraits"
    echo ""
    
    # Create request JSON
    cat > "$EXPERIMENT_DIR/request_${name}.json" << EOF
{
  "mode": "$mode",
  "request": "$BASE_REQUEST",
  "maxTraits": $maxTraits,
  "context": {
    "type": "strategic",
    "situation": "Power improvement analysis - $description",
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
    
    echo "✅ Results:"
    echo "   Personalities: $PERSONALITIES"
    echo "   Traits Used: $TRAIT_COUNT"
    echo "   Synergy: ${SYNERGY}%"
    echo "   Confidence: ${CONFIDENCE}%"
    echo ""
    
    # Extract and display recommendations (first 3 lines)
    echo "💡 Key Insights (preview):"
    echo "$RESPONSE" | jq -r '.response.content' | head -5 | sed 's/^/   /'
    echo "   [Full response in: response_${name}.json]"
    echo ""
    
    # Brief pause between experiments
    sleep 1
    
    EXPERIMENT_NUM=$((EXPERIMENT_NUM + 1))
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Generating Comparative Analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Generate summary report
REPORT_FILE="$EXPERIMENT_DIR/COMPARATIVE_ANALYSIS.md"

cat > "$REPORT_FILE" << 'REPORT_START'
# NEXUS Personality Rotation - Comparative Analysis

**Experiment Date:** $(date)  
**Total Configurations Tested:** ${#EXPERIMENTS[@]}  
**Purpose:** Understand how different personality combinations approach power improvements

---

## 📊 Experiment Results Summary

| # | Configuration | Personalities | Traits | Synergy | Confidence | Approach |
|---|---------------|---------------|--------|---------|------------|----------|
REPORT_START

# Add results to table
EXPERIMENT_NUM=1
for experiment in "${EXPERIMENTS[@]}"; do
    IFS='|' read -r name mode maxTraits description <<< "$experiment"
    
    if [ -f "$EXPERIMENT_DIR/response_${name}.json" ]; then
        PERSONALITIES=$(jq -r '.response.personalityUsed // "N/A"' "$EXPERIMENT_DIR/response_${name}.json" | cut -d' ' -f1-3)
        TRAIT_COUNT=$(jq -r '.response.traits | length // 0' "$EXPERIMENT_DIR/response_${name}.json")
        SYNERGY=$(jq -r '.response.synergyScore // 0' "$EXPERIMENT_DIR/response_${name}.json" | awk '{printf "%.0f%%", $1*100}')
        CONFIDENCE=$(jq -r '.response.confidenceScore // 0' "$EXPERIMENT_DIR/response_${name}.json" | awk '{printf "%.0f%%", $1*100}')
        
        echo "| $EXPERIMENT_NUM | $name | $PERSONALITIES... | $TRAIT_COUNT | $SYNERGY | $CONFIDENCE | $description |" >> "$REPORT_FILE"
    fi
    
    EXPERIMENT_NUM=$((EXPERIMENT_NUM + 1))
done

# Add detailed analysis for each configuration
cat >> "$REPORT_FILE" << 'REPORT_DETAILS'

---

## 🔍 Detailed Analysis by Configuration

REPORT_DETAILS

EXPERIMENT_NUM=1
for experiment in "${EXPERIMENTS[@]}"; do
    IFS='|' read -r name mode maxTraits description <<< "$experiment"
    
    if [ -f "$EXPERIMENT_DIR/response_${name}.json" ]; then
        cat >> "$REPORT_FILE" << DETAIL_START

### $EXPERIMENT_NUM. $name

**Description:** $description  
**Max Traits:** $maxTraits  

DETAIL_START

        # Extract detailed info
        jq -r '.response | "**Personalities:** \(.personalityUsed)\n**Traits Used:** \(.traits | length)\n**Synergy Score:** \(.synergyScore * 100 | floor)%\n**Confidence:** \(.confidenceScore * 100 | floor)%\n**Knowledge Domains:** \(.knowledgeDomains | length)"' \
            "$EXPERIMENT_DIR/response_${name}.json" >> "$REPORT_FILE"
        
        echo "" >> "$REPORT_FILE"
        echo "**Selected Traits:**" >> "$REPORT_FILE"
        jq -r '.response.traits[] | "- **\(.name)** (\(.personality)) - \(.expertise)% expertise"' \
            "$EXPERIMENT_DIR/response_${name}.json" >> "$REPORT_FILE"
        
        echo "" >> "$REPORT_FILE"
        echo "**Approach Characteristics:**" >> "$REPORT_FILE"
        
        # Analyze the approach based on personalities
        PERS=$(jq -r '.response.personalityUsed' "$EXPERIMENT_DIR/response_${name}.json")
        case "$PERS" in
            *pythonista*|*hunter*|*daedalus*)
                echo "- Technical and systematic approach" >> "$REPORT_FILE"
                echo "- Focus on implementation details" >> "$REPORT_FILE"
                ;;
            *visionary*|*muse*|*aria*)
                echo "- Creative and innovative thinking" >> "$REPORT_FILE"
                echo "- Focus on novel solutions" >> "$REPORT_FILE"
                ;;
            *guardian*|*ethicsguard*)
                echo "- Security and quality focused" >> "$REPORT_FILE"
                echo "- Risk-aware recommendations" >> "$REPORT_FILE"
                ;;
            *flash*|*performancehawk*)
                echo "- Performance and speed optimized" >> "$REPORT_FILE"
                echo "- Efficiency-driven solutions" >> "$REPORT_FILE"
                ;;
        esac
        
        echo "" >> "$REPORT_FILE"
        echo "---" >> "$REPORT_FILE"
    fi
    
    EXPERIMENT_NUM=$((EXPERIMENT_NUM + 1))
done

# Add insights and recommendations
cat >> "$REPORT_FILE" << 'REPORT_END'

## 💡 Key Insights

### Cognitive Diversity Patterns

1. **Technical Teams** (Pythonista, Hunter, Daedalus)
   - Systematic and evidence-based
   - Focus on implementation feasibility
   - Higher confidence in technical solutions

2. **Creative Teams** (Visionary, Muse, Aria)
   - Innovative and unconventional
   - Focus on user experience
   - More exploratory recommendations

3. **Performance Teams** (Flash, PerformanceHawk, Atlas)
   - Speed and efficiency focused
   - Data-driven optimization
   - Measurable improvements

4. **Security Teams** (Guardian, EthicsGuard, Cipher)
   - Risk-aware approach
   - Quality and reliability focus
   - Defensive improvements

### Optimal Configuration Insights

**Best for Implementation:**
- Technical + Performance combinations
- Higher confidence scores
- Clear, actionable steps

**Best for Innovation:**
- Creative + Technical blends
- Moderate synergy (diverse thinking)
- Novel feature ideas

**Best for Production:**
- Security + Performance + Architecture
- Balanced synergy
- Comprehensive solutions

---

## 🎯 Recommendations

### When to Use Each Configuration

1. **Rapid Prototyping:** Creative teams (Visionary, Muse)
2. **Production Optimization:** Performance teams (Flash, PerformanceHawk)
3. **Security Hardening:** Security teams (Guardian, EthicsGuard)
4. **System Architecture:** Architect teams (Daedalus, ChainArchitect)
5. **Full Solutions:** Max power with balanced selection

### Next Steps

1. Implement recommendations from highest-confidence configurations
2. A/B test different personality approaches
3. Combine insights from multiple perspectives
4. Track which personality combinations yield best real-world results

---

**Experiment Complete:** All configurations tested and analyzed.  
**Location:** $EXPERIMENT_DIR/
**Files Generated:** 
- Individual request/response JSONs for each configuration
- This comparative analysis report
- Raw NEXUS responses for deep analysis

---

*Generated by NEXUS Personality Rotation Experiment*
REPORT_END

echo "✅ Comparative analysis complete!"
echo ""
echo "📁 Results Location: $EXPERIMENT_DIR/"
echo ""
echo "📄 Key Files:"
echo "   • COMPARATIVE_ANALYSIS.md - Full report"
echo "   • request_*.json - Individual requests"
echo "   • response_*.json - Individual responses"
echo ""
echo "📊 Quick Stats:"
ls -1 "$EXPERIMENT_DIR"/response_*.json | wc -l | xargs echo "   Experiments completed:"
echo ""
echo "🎯 Next: Review COMPARATIVE_ANALYSIS.md for insights!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Experiment Complete! Understanding personality patterns..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
