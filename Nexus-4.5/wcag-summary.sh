#!/bin/bash
# Generate comprehensive WCAG compliance report for all HTML files

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "═══════════════════════════════════════════════════════════════"
echo "📊 WCAG COMPLIANCE SUMMARY REPORT"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Generated: $(date)"
echo "Directory: $SCRIPT_DIR"
echo ""
echo "───────────────────────────────────────────────────────────────"
echo "📁 PROCESSED HTML FILES"
echo "───────────────────────────────────────────────────────────────"
echo ""

# Find all WCAG report JSON files
REPORTS=$(find . -name "*-wcag-report.json" -type f | sort)

if [ -z "$REPORTS" ]; then
    echo "No WCAG reports found"
    exit 0
fi

TOTAL=0
COMPLIANT=0
MOSTLY_COMPLIANT=0
NEEDS_WORK=0

for REPORT in $REPORTS; do
    TOTAL=$((TOTAL + 1))
    
    FILENAME=$(basename "$REPORT" -wcag-report.json)
    ISSUES=$(jq -r '.wcag_report.total_issues' "$REPORT")
    COMPLIANCE=$(jq -r '.compliance_summary.level_aa' "$REPORT")
    SCORE=$(jq -r '.intelligence_data.complianceScore' "$REPORT")
    
    case "$COMPLIANCE" in
        "fully-compliant")
            STATUS="✅"
            COMPLIANT=$((COMPLIANT + 1))
            ;;
        "mostly-compliant")
            STATUS="⚠️ "
            MOSTLY_COMPLIANT=$((MOSTLY_COMPLIANT + 1))
            ;;
        *)
            STATUS="❌"
            NEEDS_WORK=$((NEEDS_WORK + 1))
            ;;
    esac
    
    printf "$STATUS %-50s | Score: %3d/100 | Issues: %2d | %s\n" \
        "$FILENAME" "$SCORE" "$ISSUES" "$COMPLIANCE"
done

echo ""
echo "───────────────────────────────────────────────────────────────"
echo "📈 OVERALL STATISTICS"
echo "───────────────────────────────────────────────────────────────"
echo ""
printf "Total Files Analyzed:     %d\n" $TOTAL
printf "✅ Fully Compliant:        %d (%.0f%%)\n" $COMPLIANT $((COMPLIANT * 100 / TOTAL))
printf "⚠️  Mostly Compliant:      %d (%.0f%%)\n" $MOSTLY_COMPLIANT $((MOSTLY_COMPLIANT * 100 / TOTAL))
printf "❌ Needs Work:            %d (%.0f%%)\n" $NEEDS_WORK $((NEEDS_WORK * 100 / TOTAL))
echo ""

echo "───────────────────────────────────────────────────────────────"
echo "🔍 TOP ISSUES ACROSS ALL FILES"
echo "───────────────────────────────────────────────────────────────"
echo ""

# Aggregate all issues
TEMP_ISSUES="/tmp/all-issues.txt"
> "$TEMP_ISSUES"

for REPORT in $REPORTS; do
    jq -r '.intelligence_data.findings[]?.issue // .intelligence_data.findings[]?.element' "$REPORT" 2>/dev/null >> "$TEMP_ISSUES" || true
done

if [ -s "$TEMP_ISSUES" ]; then
    sort "$TEMP_ISSUES" | uniq -c | sort -rn | head -10 | while read count issue; do
        printf "   %2dx %s\n" "$count" "$issue"
    done
else
    echo "   No issues found! 🎉"
fi

echo ""
echo "───────────────────────────────────────────────────────────────"
echo "📁 GENERATED FILES"
echo "───────────────────────────────────────────────────────────────"
echo ""

ACCESSIBLE_COUNT=$(find . -name "*-accessible.html" -type f | wc -l)
echo "Accessible HTML files: $ACCESSIBLE_COUNT"
echo ""

echo "Files:"
find . -name "*-accessible.html" -type f | while read file; do
    size=$(du -h "$file" | cut -f1)
    echo "   • $file ($size)"
done

echo ""
echo "───────────────────────────────────────────────────────────────"
echo "✅ RECOMMENDATIONS"
echo "───────────────────────────────────────────────────────────────"
echo ""

if [ $NEEDS_WORK -gt 0 ]; then
    echo "⚠️  $NEEDS_WORK files need additional work"
    echo "   • Review WCAG reports for specific issues"
    echo "   • Use recode-html.sh for automated fixes"
    echo "   • Manual review may be required for complex issues"
    echo ""
fi

if [ $MOSTLY_COMPLIANT -gt 0 ]; then
    echo "ℹ️  $MOSTLY_COMPLIANT files are mostly compliant"
    echo "   • Minor improvements needed"
    echo "   • Already usable in production"
    echo ""
fi

if [ $COMPLIANT -eq $TOTAL ]; then
    echo "🎉 All files are fully WCAG compliant!"
    echo "   • Ready for production deployment"
    echo "   • No accessibility barriers detected"
    echo ""
fi

echo "═══════════════════════════════════════════════════════════════"
