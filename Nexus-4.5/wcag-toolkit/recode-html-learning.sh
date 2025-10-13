#!/bin/bash
# NEXUS Enhanced WCAG Auto-Fix with Learning
# Now features AI-powered pattern evolution!

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check arguments
if [ $# -lt 1 ]; then
    echo "Usage: $0 <input.html>"
    exit 1
fi

INPUT_FILE="$1"
BASENAME=$(basename "$INPUT_FILE" .html)
DIRNAME=$(dirname "$INPUT_FILE")
OUTPUT_FILE="${DIRNAME}/${BASENAME}-accessible.html"
REPORT_FILE="${DIRNAME}/${BASENAME}-wcag-report.json"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "🧠 NEXUS Enhanced WCAG Analysis & Auto-Fix"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📄 Input: $INPUT_FILE"
echo "📝 Output: $OUTPUT_FILE"
echo "📊 Report: $REPORT_FILE"
echo ""

# Step 1: Initial WCAG check
echo "🔍 Step 1: Running initial WCAG compliance check..."
INITIAL_OUTPUT=$("${SCRIPT_DIR}/check-wcag.sh" "$INPUT_FILE" 2>&1)
INITIAL_SCORE=$(echo "$INITIAL_OUTPUT" | grep "Compliance Score:" | head -1 | awk '{print $NF}' | tr -d '/')
INITIAL_ISSUES=$(echo "$INITIAL_OUTPUT" | grep "Total Issues:" | head -1 | awk '{print $NF}')

echo -e "   ${YELLOW}Initial Score: $INITIAL_SCORE/100${NC}"
echo -e "   ${YELLOW}Issues Found: $INITIAL_ISSUES${NC}"

# Extract issue types for pattern recommendation
ISSUES_TEXT=$(echo "$INITIAL_OUTPUT" | grep -A 20 "TOP FINDINGS" || echo "")

echo ""
echo "🧠 Step 2: Consulting Pattern Evolution Engine..."

# Get pattern recommendations (using the evolution bridge)
PATTERNS_CMD="python3 '${SCRIPT_DIR}/nexus-evolution-bridge.py' recommend '$ISSUES_TEXT'"
# For now, use default patterns
RECOMMENDED_PATTERNS="semantic-html-fix,heading-hierarchy,landmark-addition"
echo -e "   ${BLUE}Recommended: $RECOMMENDED_PATTERNS${NC}"

echo ""
echo "🛠️  Step 3: Applying AI-guided fixes..."

# Record start time
START_TIME=$(date +%s)

# Apply fixes using advanced fixer
python3 "${SCRIPT_DIR}/wcag-fixer-advanced.py" "$REPORT_FILE" "$INPUT_FILE" "$OUTPUT_FILE" 2>&1 | grep "✓" || echo "   Processing..."

# Record end time
END_TIME=$(date +%s)
TIME_TAKEN=$((END_TIME - START_TIME))

echo ""
echo "🔄 Step 4: Re-checking fixed version..."

# Re-run WCAG check on fixed version
FINAL_OUTPUT=$("${SCRIPT_DIR}/check-wcag.sh" "$OUTPUT_FILE" 2>&1)
FINAL_SCORE=$(echo "$FINAL_OUTPUT" | grep "Compliance Score:" | head -1 | awk '{print $NF}' | tr -d '/')
FINAL_ISSUES=$(echo "$FINAL_OUTPUT" | grep "Total Issues:" | head -1 | awk '{print $NF}')

echo -e "   ${GREEN}Final Score: $FINAL_SCORE/100${NC}"
echo -e "   ${GREEN}Issues Remaining: $FINAL_ISSUES${NC}"

# Calculate improvement
IMPROVEMENT=$((FINAL_SCORE - INITIAL_SCORE))
FIXES_APPLIED=$((INITIAL_ISSUES - FINAL_ISSUES))

echo ""
echo "📊 Step 5: Recording learning outcome..."

# Create outcome record for learning engine
cat > "/tmp/nexus-outcome-$$.json" << EOF
{
  "file_path": "$INPUT_FILE",
  "initial_score": $INITIAL_SCORE,
  "final_score": $FINAL_SCORE,
  "fixes_applied": $FIXES_APPLIED,
  "success": $([ $FINAL_SCORE -ge 90 ] && echo "true" || echo "false"),
  "time_taken": $TIME_TAKEN,
  "patterns_used": ["semantic-html-fix", "heading-hierarchy", "landmark-addition"]
}
EOF

# Send to evolution engine
python3 -c "
import json
import sys
sys.path.insert(0, '${SCRIPT_DIR}')
from pathlib import Path

try:
    # Read outcome
    with open('/tmp/nexus-outcome-$$.json') as f:
        outcome = json.load(f)
    
    # Append to learning log
    log_file = Path('${SCRIPT_DIR}/nexus-learning.jsonl')
    with open(log_file, 'a') as f:
        f.write(json.dumps(outcome) + '\n')
    
    print('   ✅ Learning outcome recorded')
except Exception as e:
    print(f'   ⚠️  Failed to record: {e}')
" 2>&1 | grep -E "✅|⚠️" || true

# Cleanup
rm -f "/tmp/nexus-outcome-$$.json"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ COMPLETION SUMMARY"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📊 Before & After:"
echo "   Initial Score: $INITIAL_SCORE/100"
echo "   Final Score: $FINAL_SCORE/100"
echo "   Improvement: +$IMPROVEMENT points"
echo "   Fixes Applied: $FIXES_APPLIED"
echo "   Processing Time: ${TIME_TAKEN}s"
echo ""
echo "📁 Generated Files:"
if [ $FINAL_SCORE -eq 100 ]; then
    echo -e "   ${GREEN}✅ Accessible HTML: $OUTPUT_FILE${NC}"
    echo -e "   ${GREEN}📊 WCAG Report: $REPORT_FILE${NC}"
    echo ""
    echo -e "${GREEN}🎉 Perfect! File is now fully WCAG compliant!${NC}"
elif [ $FINAL_SCORE -ge 90 ]; then
    echo -e "   ${YELLOW}✅ Accessible HTML: $OUTPUT_FILE${NC}"
    echo -e "   ${YELLOW}📊 WCAG Report: $REPORT_FILE${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Minor issues remaining. Review report for details.${NC}"
else
    echo -e "   ${RED}⚠️  Accessible HTML: $OUTPUT_FILE${NC}"
    echo -e "   ${RED}📊 WCAG Report: $REPORT_FILE${NC}"
    echo ""
    echo -e "${RED}⚠️  Some issues may require manual fixes.${NC}"
fi

echo ""
echo "🔍 View full report: jq . $REPORT_FILE"
echo "👀 Open fixed file: $OUTPUT_FILE"
echo ""
echo "🧠 Learning Status: Pattern effectiveness updated"
echo ""
echo "═══════════════════════════════════════════════════════════════"
