#!/bin/bash
# Batch HTML WCAG Compliance Fixer
# Processes multiple HTML files and generates accessible versions

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${CYAN}🔄 BATCH HTML WCAG COMPLIANCE PROCESSOR${NC}"
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Find HTML files
if [ -z "$1" ]; then
    echo "Usage: $0 <directory>"
    echo ""
    echo "Processes all HTML files in the specified directory"
    exit 1
fi

TARGET_DIR="$1"
if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: Directory not found: $TARGET_DIR"
    exit 1
fi

# Find all HTML files
HTML_FILES=$(find "$TARGET_DIR" -name "*.html" -type f ! -name "*-accessible.html" ! -name "*-wcag-report.json")

if [ -z "$HTML_FILES" ]; then
    echo "No HTML files found in $TARGET_DIR"
    exit 0
fi

# Count files
FILE_COUNT=$(echo "$HTML_FILES" | wc -l)
echo "📁 Found $FILE_COUNT HTML files in $TARGET_DIR"
echo ""

# Process each file
PROCESSED=0
ALREADY_COMPLIANT=0
IMPROVED=0
FAILED=0

for HTML_FILE in $HTML_FILES; do
    PROCESSED=$((PROCESSED + 1))
    echo -e "${CYAN}[$PROCESSED/$FILE_COUNT]${NC} Processing: $(basename $HTML_FILE)"
    
    # Run recode script
    if ./recode-html.sh "$HTML_FILE" > /tmp/recode-output.txt 2>&1; then
        if grep -q "already WCAG compliant" /tmp/recode-output.txt; then
            echo -e "   ${GREEN}✅ Already compliant${NC}"
            ALREADY_COMPLIANT=$((ALREADY_COMPLIANT + 1))
        elif grep -q "fully WCAG compliant" /tmp/recode-output.txt; then
            echo -e "   ${GREEN}✅ Fixed - now fully compliant!${NC}"
            IMPROVED=$((IMPROVED + 1))
        elif grep -q "Improvement made" /tmp/recode-output.txt; then
            echo -e "   ${YELLOW}⚠️  Partially improved${NC}"
            IMPROVED=$((IMPROVED + 1))
        fi
    else
        echo -e "   ${YELLOW}⚠️  Processing error${NC}"
        FAILED=$((FAILED + 1))
    fi
    echo ""
done

# Summary
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${CYAN}📊 BATCH PROCESSING COMPLETE${NC}"
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "📈 Summary:"
echo "   Total Files: $FILE_COUNT"
echo -e "   ${GREEN}Already Compliant: $ALREADY_COMPLIANT${NC}"
echo -e "   ${GREEN}Improved: $IMPROVED${NC}"
echo -e "   ${YELLOW}Failed: $FAILED${NC}"
echo ""
echo "📁 Accessible versions saved with '-accessible.html' suffix"
echo "📊 Reports saved with '-wcag-report.json' suffix"
echo ""
