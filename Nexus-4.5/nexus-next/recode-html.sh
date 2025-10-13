#!/bin/bash
# NEXUS HTML Accessibility Auto-Fixer
# Analyzes HTML for WCAG issues and generates fixed versions

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NEXUS_URL="http://127.0.0.1:8080"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

print_header() {
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${CYAN}$1${NC}"
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Check if NEXUS is running
if ! curl -sf "${NEXUS_URL}/status" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  NEXUS is not running. Starting...${NC}"
    ./start-nexus.sh --background
    sleep 5
fi

# Input HTML file
if [ -z "$1" ]; then
    echo "Usage: $0 <html-file>"
    echo ""
    echo "This script will:"
    echo "  1. Run WCAG compliance check"
    echo "  2. Analyze all issues"
    echo "  3. Generate a fixed version"
    echo "  4. Save to <filename>-accessible.html"
    exit 1
fi

INPUT_FILE="$1"
if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: File not found: $INPUT_FILE"
    exit 1
fi

BASENAME=$(basename "$INPUT_FILE" .html)
OUTPUT_FILE="${INPUT_FILE%.html}-accessible.html"
REPORT_FILE="${INPUT_FILE%.html}-wcag-report.json"

print_header "🔍 WCAG Analysis & Auto-Fix: $INPUT_FILE"

echo "📄 Input: $INPUT_FILE"
echo "📝 Output: $OUTPUT_FILE"
echo "📊 Report: $REPORT_FILE"
echo ""

# Step 1: Run WCAG check
echo "🔍 Step 1: Running WCAG compliance check..."
HTML_CONTENT=$(cat "$INPUT_FILE")
JSON_PAYLOAD=$(jq -n --arg html "$HTML_CONTENT" '{html: $html}')

WCAG_REPORT=$(curl -sf -X POST "${NEXUS_URL}/wcag-check" \
    -H "Content-Type: application/json" \
    -d "$JSON_PAYLOAD")

echo "$WCAG_REPORT" > "$REPORT_FILE"

TOTAL_ISSUES=$(echo "$WCAG_REPORT" | jq -r '.wcag_report.total_issues')
COMPLIANCE=$(echo "$WCAG_REPORT" | jq -r '.compliance_summary.level_aa')

echo "   Issues Found: $TOTAL_ISSUES"
echo "   Compliance: $COMPLIANCE"
echo ""

if [ "$TOTAL_ISSUES" -eq 0 ]; then
    echo -e "${GREEN}✅ No issues found! File is already WCAG compliant.${NC}"
    exit 0
fi

# Step 2: Analyze issues
echo "🔎 Step 2: Analyzing issues..."
echo "$WCAG_REPORT" | jq -r '.intelligence_data.findings[] | "   • \(.issue // .element)"' | head -10
echo ""

# Step 3: Generate fixed version
echo "🛠️  Step 3: Generating accessible version..."

# Start with original HTML
cp "$INPUT_FILE" "$OUTPUT_FILE"

# Apply fixes based on WCAG report (using advanced fixer)
python3 "${SCRIPT_DIR}/wcag-fixer-advanced.py" "$REPORT_FILE" "$INPUT_FILE" "$OUTPUT_FILE"

echo ""

# Step 4: Re-check the fixed version
echo "🔄 Step 4: Re-checking fixed version..."
FIXED_HTML=$(cat "$OUTPUT_FILE")
FIXED_JSON=$(jq -n --arg html "$FIXED_HTML" '{html: $html}')

FIXED_REPORT=$(curl -sf -X POST "${NEXUS_URL}/wcag-check" \
    -H "Content-Type: application/json" \
    -d "$FIXED_JSON")

NEW_ISSUES=$(echo "$FIXED_REPORT" | jq -r '.wcag_report.total_issues')
NEW_COMPLIANCE=$(echo "$FIXED_REPORT" | jq -r '.compliance_summary.level_aa')
NEW_SCORE=$(echo "$FIXED_REPORT" | jq -r '.intelligence_data.complianceScore')

echo "   Issues Remaining: $NEW_ISSUES"
echo "   New Compliance: $NEW_COMPLIANCE"
echo "   Score: $NEW_SCORE/100"
echo ""

# Summary
print_header "✅ COMPLETION SUMMARY"

echo "📊 Before & After:"
echo "   Original Issues: $TOTAL_ISSUES"
echo "   Fixed Issues: $((TOTAL_ISSUES - NEW_ISSUES))"
echo "   Remaining Issues: $NEW_ISSUES"
echo "   Improvement: $((100 - (NEW_ISSUES * 100 / (TOTAL_ISSUES + 1))))%"
echo ""
echo "📁 Generated Files:"
echo "   ✅ Accessible HTML: $OUTPUT_FILE"
echo "   📊 WCAG Report: $REPORT_FILE"
echo ""

if [ "$NEW_ISSUES" -eq 0 ]; then
    echo -e "${GREEN}🎉 Perfect! File is now fully WCAG compliant!${NC}"
elif [ "$NEW_ISSUES" -lt "$TOTAL_ISSUES" ]; then
    echo -e "${YELLOW}⚠️  Improvement made! $NEW_ISSUES issues remaining.${NC}"
    echo ""
    echo "Remaining issues:"
    echo "$FIXED_REPORT" | jq -r '.intelligence_data.findings[] | "   • \(.issue // .element)"' | head -5
else
    echo -e "${YELLOW}⚠️  Some issues may require manual fixes.${NC}"
fi

echo ""
echo "🔍 View full report: jq . $REPORT_FILE"
echo "👀 Open fixed file: $OUTPUT_FILE"
echo ""
