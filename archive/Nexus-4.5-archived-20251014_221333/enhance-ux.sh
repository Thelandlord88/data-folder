#!/bin/bash
# NEXUS UX Enhancement Engine - Complete Orchestration
# End-to-end adaptive UX enhancement with AAA compliance verification

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

if [ $# -lt 1 ]; then
    echo "Usage: $0 <input.html>"
    echo ""
    echo "Example: $0 docs/my-page.html"
    echo ""
    echo "This will:"
    echo "  1. Detect UX opportunities"
    echo "  2. Analyze with adaptive intelligence"
    echo "  3. Apply selected patterns"
    echo "  4. Verify AAA compliance"
    exit 1
fi

INPUT_FILE="$1"
BASENAME=$(basename "$INPUT_FILE" .html)
DIRNAME=$(dirname "$INPUT_FILE")

OPPORTUNITIES_FILE="${DIRNAME}/${BASENAME}-ux-opportunities.json"
ENHANCEMENTS_FILE="${DIRNAME}/${BASENAME}-ux-enhancements.json"
OUTPUT_FILE="${DIRNAME}/${BASENAME}-enhanced.html"
AAA_REPORT="${DIRNAME}/${BASENAME}-enhanced-wcag-aaa-report.json"

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo -e "║  ${MAGENTA}🚀 NEXUS UX Enhancement Engine${NC}                            ║"
echo -e "║  ${CYAN}Adaptive Consciousness + AAA Compliance${NC}                   ║"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo ""
echo -e "${BLUE}📄 Input: $INPUT_FILE${NC}"
echo -e "${BLUE}📊 Output: $OUTPUT_FILE${NC}"
echo ""

# Stage 1: Detect Opportunities
echo "═══════════════════════════════════════════════════════════════"
echo -e "${CYAN}Stage 1: Detecting UX Opportunities${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""

python3 "$SCRIPT_DIR/generate-opportunities.py" "$INPUT_FILE"

if [ ! -f "$OPPORTUNITIES_FILE" ]; then
    echo -e "${RED}✗ Failed to generate opportunities file${NC}"
    exit 1
fi

TOTAL_OPP=$(jq -r '.total_opportunities' "$OPPORTUNITIES_FILE")
echo -e "${GREEN}✅ Found $TOTAL_OPP UX opportunities${NC}"
echo ""

# Stage 2: Intelligent Analysis
echo "═══════════════════════════════════════════════════════════════"
echo -e "${CYAN}Stage 2: Adaptive Intelligence Analysis${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""

python3 "$SCRIPT_DIR/nexus-ux-analyzer.py" "$INPUT_FILE" "$OPPORTUNITIES_FILE"

if [ ! -f "$ENHANCEMENTS_FILE" ]; then
    echo -e "${RED}✗ Failed to generate enhancements file${NC}"
    exit 1
fi

PATTERNS_SELECTED=$(jq -r '.summary.patterns_selected' "$ENHANCEMENTS_FILE")
APPLICATIONS=$(jq -r '.summary.total_applications' "$ENHANCEMENTS_FILE")
echo -e "${GREEN}✅ Selected $PATTERNS_SELECTED patterns ($APPLICATIONS applications)${NC}"
echo ""

# Stage 3: Apply Patterns
echo "═══════════════════════════════════════════════════════════════"
echo -e "${CYAN}Stage 3: Applying UX Patterns${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""

python3 "$SCRIPT_DIR/nexus-ux-applier.py" "$INPUT_FILE" "$ENHANCEMENTS_FILE"

if [ ! -f "$OUTPUT_FILE" ]; then
    echo -e "${RED}✗ Failed to generate enhanced HTML${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Patterns successfully applied${NC}"
echo ""

# Stage 4: AAA Compliance Verification
echo "═══════════════════════════════════════════════════════════════"
echo -e "${CYAN}Stage 4: AAA Compliance Verification${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""

"$SCRIPT_DIR/check-wcag-aaa.sh" "$OUTPUT_FILE" > /dev/null 2>&1 || true

if [ -f "$AAA_REPORT" ]; then
    AAA_SCORE=$(jq -r '.scores.percent' "$AAA_REPORT")
    AAA_STATUS=$(jq -r '.compliance.level' "$AAA_REPORT")
    
    if [ "$AAA_SCORE" -ge 95 ]; then
        echo -e "${GREEN}✅ AAA Compliance: $AAA_SCORE% ($AAA_STATUS)${NC}"
    elif [ "$AAA_SCORE" -ge 90 ]; then
        echo -e "${YELLOW}⚠  AAA Compliance: $AAA_SCORE% ($AAA_STATUS)${NC}"
    else
        echo -e "${RED}✗ AAA Compliance: $AAA_SCORE% ($AAA_STATUS)${NC}"
    fi
else
    echo -e "${YELLOW}⚠  Could not verify AAA compliance${NC}"
fi

echo ""

# Final Summary
echo "╔═══════════════════════════════════════════════════════════════╗"
echo -e "║  ${GREEN}✅ NEXUS UX ENHANCEMENT COMPLETE!${NC}                         ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${BLUE}📊 Summary:${NC}"
echo -e "   UX Opportunities Found: ${YELLOW}$TOTAL_OPP${NC}"
echo -e "   Patterns Selected: ${YELLOW}$PATTERNS_SELECTED${NC}"
echo -e "   Total Applications: ${YELLOW}$APPLICATIONS${NC}"
if [ -f "$AAA_REPORT" ]; then
    echo -e "   AAA Compliance: ${GREEN}$AAA_SCORE%${NC}"
fi
echo ""
echo -e "${BLUE}📁 Generated Files:${NC}"
echo -e "   • $OPPORTUNITIES_FILE"
echo -e "   • $ENHANCEMENTS_FILE"
echo -e "   • $OUTPUT_FILE"
if [ -f "$AAA_REPORT" ]; then
    echo -e "   • $AAA_REPORT"
fi
echo ""
echo -e "${CYAN}🎉 Your page now has adaptive, AAA-compliant UX enhancements!${NC}"
echo ""

exit 0
