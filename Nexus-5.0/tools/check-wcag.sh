#!/bin/bash
# WCAG Compliance Checker for NEXUS 4.5
# Production tool for checking HTML accessibility

set -e

NEXUS_URL="http://127.0.0.1:8080"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${CYAN}$1${NC}"
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_section() {
    echo ""
    echo -e "${BOLD}${BLUE}$1${NC}"
    echo -e "${BLUE}───────────────────────────────────────────────────────────────${NC}"
}

# Help message
show_help() {
    echo "WCAG Compliance Checker - NEXUS 4.5"
    echo ""
    echo "Usage:"
    echo "  $0 <html-file>           Check local HTML file"
    echo "  $0 --url <url>           Check URL (downloads HTML first)"
    echo "  $0 --demo                Check bond-cleaning demo"
    echo "  $0 --help                Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 index.html"
    echo "  $0 --url https://example.com"
    echo "  $0 --demo"
    echo ""
    echo "Output:"
    echo "  - Console report with color-coded results"
    echo "  - Full JSON saved to: /tmp/wcag-report-latest.json"
    echo ""
}

# Check if NEXUS is running
check_nexus() {
    if ! curl -sf "${NEXUS_URL}/status" > /dev/null 2>&1; then
        echo -e "${RED}❌ NEXUS is not running on ${NEXUS_URL}${NC}"
        echo ""
        echo "Start NEXUS with:"
        echo "  cd ${SCRIPT_DIR} && ./start-nexus.sh --background"
        exit 1
    fi
}

# Parse arguments
if [ $# -eq 0 ]; then
    show_help
    exit 0
fi

case "$1" in
    --help|-h)
        show_help
        exit 0
        ;;
    --demo)
        HTML_SOURCE="demo"
        ;;
    --url)
        if [ -z "$2" ]; then
            echo -e "${RED}Error: --url requires a URL argument${NC}"
            exit 1
        fi
        HTML_SOURCE="url"
        TARGET_URL="$2"
        ;;
    *)
        if [ ! -f "$1" ]; then
            echo -e "${RED}Error: File not found: $1${NC}"
            exit 1
        fi
        HTML_SOURCE="file"
        HTML_FILE="$1"
        ;;
esac

# Check NEXUS
check_nexus

print_header "🔍 WCAG COMPLIANCE CHECK - NEXUS 4.5"

# Get HTML content
case "$HTML_SOURCE" in
    demo)
        echo "📄 Source: Bond Cleaning Demo (${NEXUS_URL}/demo/bond-cleaning)"
        HTML_CONTENT=$(curl -sf "${NEXUS_URL}/demo/bond-cleaning")
        ;;
    url)
        echo "📄 Source: $TARGET_URL"
        HTML_CONTENT=$(curl -sf "$TARGET_URL")
        ;;
    file)
        echo "📄 Source: $HTML_FILE"
        HTML_CONTENT=$(cat "$HTML_FILE")
        ;;
esac

echo "📊 HTML Size: $(echo "$HTML_CONTENT" | wc -c) bytes"
echo "🚀 Running WCAG analysis..."
echo ""

# Create JSON payload
JSON_PAYLOAD=$(jq -n --arg html "$HTML_CONTENT" '{html: $html}')

# Call WCAG endpoint
REPORT=$(curl -sf -X POST "${NEXUS_URL}/wcag-check" \
    -H "Content-Type: application/json" \
    -d "$JSON_PAYLOAD")

# Save full report
echo "$REPORT" > /tmp/wcag-report-latest.json
echo -e "${GREEN}✅ Full report saved: /tmp/wcag-report-latest.json${NC}"
echo ""

# Parse and display results
TOTAL_ISSUES=$(echo "$REPORT" | jq -r '.wcag_report.total_issues')
COMPLIANCE_AA=$(echo "$REPORT" | jq -r '.compliance_summary.level_aa')
FIX_TIME=$(echo "$REPORT" | jq -r '.compliance_summary.estimated_fix_time_minutes')
THREAT_LEVEL=$(echo "$REPORT" | jq -r '.intelligence_data.threatLevel')
COMPLIANCE_SCORE=$(echo "$REPORT" | jq -r '.intelligence_data.complianceScore')

# Color code based on compliance
case "$COMPLIANCE_AA" in
    "fully-compliant")
        STATUS_COLOR=$GREEN
        STATUS_ICON="✅"
        ;;
    "mostly-compliant")
        STATUS_COLOR=$YELLOW
        STATUS_ICON="⚠️ "
        ;;
    *)
        STATUS_COLOR=$RED
        STATUS_ICON="❌"
        ;;
esac

print_section "📊 OVERALL RESULTS"
echo -e "   ${STATUS_COLOR}${STATUS_ICON} WCAG AA Status: ${COMPLIANCE_AA}${NC}"
echo -e "   🎯 Total Issues: ${TOTAL_ISSUES}"
echo -e "   📈 Compliance Score: ${COMPLIANCE_SCORE}/100"
echo -e "   ⚠️  Threat Level: ${THREAT_LEVEL}"
echo -e "   ⏱️  Estimated Fix Time: ${FIX_TIME} minutes"

print_section "🧠 AI PERSONALITY ANALYSIS"
echo "$REPORT" | jq -r '.personality_analysis | to_entries[] | "   \(.value)"'

print_section "🔎 HUNTER RESULTS"
echo "$REPORT" | jq -r '
.wcag_report.hunter_reports | to_entries[] | 
"   [\(.key)]
   Status: \(.value.status) | Issues: \(.value.issues) | Affected: \(.value.affected_elements)
   Fix Time: \(.value.eta_minutes)min"
'

# Show findings if any
if [ "$TOTAL_ISSUES" -gt 0 ]; then
    print_section "⚠️  TOP FINDINGS"
    echo "$REPORT" | jq -r '
    .intelligence_data.findings[0:5][] | 
    "   • \(.issue // .element)"
    '
    
    print_section "✅ RECOMMENDED ACTIONS"
    echo "$REPORT" | jq -r '
    .wcag_report.next_actions[0:5] | to_entries[] | 
    "   \(.key + 1). \(.value)"
    '
fi

print_section "🎯 STRATEGIC IMPLICATIONS"
echo -e "${BOLD}Accessibility Impact:${NC}"
echo "$REPORT" | jq -r '.strategic_implications.accessibilityImpact[] | "   • \(.)"'
echo ""
echo -e "${BOLD}Legal Risks:${NC}"
echo "$REPORT" | jq -r '.strategic_implications.legalRisks[] | "   • \(.)"'
echo ""
echo -e "${BOLD}Business Impact:${NC}"
echo "$REPORT" | jq -r '.strategic_implications.businessImpact[] | "   • \(.)"'

print_header "🎉 ANALYSIS COMPLETE"

echo "📋 Full JSON Report: /tmp/wcag-report-latest.json"
echo "📊 View with: jq . /tmp/wcag-report-latest.json"
echo ""

# Exit with appropriate code
if [ "$COMPLIANCE_AA" = "fully-compliant" ]; then
    exit 0
elif [ "$COMPLIANCE_AA" = "mostly-compliant" ]; then
    exit 1
else
    exit 2
fi
