#!/bin/bash
# NEXUS HTML AAA Compliance Auto-Fixer
# Analyzes HTML for WCAG issues and generates AAA-compliant versions

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
    echo "  2. Apply automated fixes (AA + AAA)"
    echo "  3. Fix color contrast for AAA (7:1)"
    echo "  4. Generate AAA-compliant version"
    echo "  5. Save to <filename>-aaa.html"
    exit 1
fi

INPUT_FILE="$1"
if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: File not found: $INPUT_FILE"
    exit 1
fi

BASENAME=$(basename "$INPUT_FILE" .html)
OUTPUT_FILE="${INPUT_FILE%.html}-aaa.html"
REPORT_FILE="${INPUT_FILE%.html}-aaa-report.json"

print_header "🎨 WCAG AAA Analysis & Auto-Fix: $INPUT_FILE"

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
AAA_ISSUES=$(echo "$WCAG_REPORT" | jq -r '.wcag_report.hunter_reports.ColorContrastHunter.counts.insufficient_aaa // 0')

echo "   AA Issues Found: $TOTAL_ISSUES"
echo "   AAA Contrast Issues: $AAA_ISSUES"
echo "   Current Compliance: $COMPLIANCE"
echo ""

# Step 2: Apply structural fixes (landmarks, alt text, etc.)
echo "🛠️  Step 2: Applying structural fixes..."
python3 "${SCRIPT_DIR}/wcag-fixer-advanced.py" "$REPORT_FILE" "$INPUT_FILE" "$OUTPUT_FILE"
echo ""

# Step 3: Fix color contrast for AAA
if [ "$AAA_ISSUES" -gt 0 ]; then
    echo "🎨 Step 3: Fixing color contrast for AAA compliance (7:1 ratio)..."
    TEMP_FILE="${OUTPUT_FILE}.temp"
    cp "$OUTPUT_FILE" "$TEMP_FILE"
    
    # Try enhanced fixer first (handles CSS variables)
    python3 "${SCRIPT_DIR}/contrast-fixer-enhanced.py" "$TEMP_FILE" "$OUTPUT_FILE" 2>/dev/null || \
    python3 "${SCRIPT_DIR}/contrast-fixer.py" "$TEMP_FILE" "$OUTPUT_FILE"
    
    rm "$TEMP_FILE"
    echo ""
else
    echo "✅ Step 3: No AAA contrast issues to fix"
    echo ""
fi

# Step 4: Re-check the fixed version
echo "🔄 Step 4: Re-checking AAA compliance..."
FIXED_HTML=$(cat "$OUTPUT_FILE")
FIXED_JSON=$(jq -n --arg html "$FIXED_HTML" '{html: $html}')

FIXED_REPORT=$(curl -sf -X POST "${NEXUS_URL}/wcag-check" \
    -H "Content-Type: application/json" \
    -d "$FIXED_JSON")

NEW_ISSUES=$(echo "$FIXED_REPORT" | jq -r '.wcag_report.total_issues')
NEW_AAA_ISSUES=$(echo "$FIXED_REPORT" | jq -r '.wcag_report.hunter_reports.ColorContrastHunter.counts.insufficient_aaa // 0')
NEW_COMPLIANCE=$(echo "$FIXED_REPORT" | jq -r '.compliance_summary.level_aa')
NEW_SCORE=$(echo "$FIXED_REPORT" | jq -r '.intelligence_data.complianceScore')

echo "   AA Issues Remaining: $NEW_ISSUES"
echo "   AAA Contrast Issues Remaining: $NEW_AAA_ISSUES"
echo "   New Compliance: $NEW_COMPLIANCE"
echo "   Score: $NEW_SCORE/100"
echo ""

# Summary
print_header "✅ COMPLETION SUMMARY"

echo "📊 Before & After:"
echo "   Original AA Issues: $TOTAL_ISSUES → $NEW_ISSUES"
echo "   Original AAA Issues: $AAA_ISSUES → $NEW_AAA_ISSUES"
echo "   Improvement: $((100 - (NEW_ISSUES * 100 / (TOTAL_ISSUES + 1))))%"
echo ""
echo "📁 Generated Files:"
echo "   ✅ AAA-Compliant HTML: $OUTPUT_FILE"
echo "   📊 WCAG Report: $REPORT_FILE"
echo ""

if [ "$NEW_ISSUES" -eq 0 ] && [ "$NEW_AAA_ISSUES" -eq 0 ]; then
    echo -e "${GREEN}🎉 Perfect! File is now fully WCAG AAA compliant!${NC}"
elif [ "$NEW_ISSUES" -eq 0 ]; then
    echo -e "${GREEN}✅ WCAG AA compliant! ${NC}"
    echo -e "${YELLOW}⚠️  $NEW_AAA_ISSUES AAA contrast issues remaining${NC}"
    echo ""
    echo "Note: AAA (7:1 contrast) is optional. Your file meets industry standard AA compliance."
else
    echo -e "${YELLOW}⚠️  $NEW_ISSUES AA issues and $NEW_AAA_ISSUES AAA issues remaining${NC}"
    echo ""
    echo "Remaining issues may require manual fixes or design adjustments."
fi

echo ""
echo "🔍 View full report: jq . $REPORT_FILE"
echo "👀 Open AAA file: $OUTPUT_FILE"
echo ""

# Exit with appropriate code
if [ "$NEW_ISSUES" -eq 0 ] && [ "$NEW_AAA_ISSUES" -eq 0 ]; then
    exit 0
elif [ "$NEW_ISSUES" -eq 0 ]; then
    exit 1  # AA compliant but not AAA
else
    exit 2  # Not even AA compliant
fi
