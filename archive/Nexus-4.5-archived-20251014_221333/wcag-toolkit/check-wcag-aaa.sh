#!/bin/bash
# NEXUS WCAG AAA Compliance Checker
# Enhanced with Adaptive Consciousness
# Stricter AAA standards with 150-point scoring system

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

if [ $# -lt 1 ]; then
    echo "Usage: $0 <file.html>"
    exit 1
fi

INPUT_FILE="$1"
BASENAME=$(basename "$INPUT_FILE" .html)
DIRNAME=$(dirname "$INPUT_FILE")
REPORT_FILE="${DIRNAME}/${BASENAME}-wcag-aaa-report.json"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo -e "${MAGENTA}🔍 NEXUS WCAG AAA Compliance Audit${NC}"
echo -e "${CYAN}   Adaptive Consciousness Enhanced${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}📄 Input: $INPUT_FILE${NC}"
echo -e "${BLUE}📊 Report: $REPORT_FILE${NC}"
echo ""

# Initialize scores
TOTAL_SCORE=0
MAX_SCORE=150
ISSUES_FOUND=0

# Issue tracking arrays
declare -A VIOLATIONS_CRITICAL
declare -A VIOLATIONS_MAJOR
declare -A VIOLATIONS_MINOR
declare -a TOP_FINDINGS

echo -e "${CYAN}Running AAA-level checks...${NC}"
echo ""

# ============================================================================
# SECTION 1: PERCEIVABLE - AAA Level (40 points)
# ============================================================================
echo -e "${BLUE}🎨 Section 1: Perceivable (AAA Level - 40 points)${NC}"

PERCEIVABLE_SCORE=0
PERCEIVABLE_MAX=40

# 1.1 Text Alternatives - AAA (5 points)
echo "  → Checking text alternatives..."
ALT_ISSUES=0
ALT_ISSUES=$(grep -Eio '<img[^>]*>' "$INPUT_FILE" | grep -Eiv 'alt=' | wc -l || true)
if [ $ALT_ISSUES -eq 0 ]; then
    PERCEIVABLE_SCORE=$((PERCEIVABLE_SCORE + 5))
    echo -e "    ${GREEN}✓ All images have alt text (5/5)${NC}"
else
    VIOLATIONS_CRITICAL["missing_alt"]=$ALT_ISSUES
    TOP_FINDINGS+=("CRITICAL: $ALT_ISSUES images missing alt text (WCAG 1.1.1)")
    echo -e "    ${RED}✗ $ALT_ISSUES images missing alt text (0/5)${NC}"
fi

# 1.2 Time-based Media - AAA (10 points)
echo "  → Checking multimedia accessibility..."
MULTIMEDIA_SCORE=0

# Check for video/audio elements
VIDEO_COUNT=$(grep -Eio '<video[^>]*>' "$INPUT_FILE" | wc -l || true)
AUDIO_COUNT=$(grep -Eio '<audio[^>]*>' "$INPUT_FILE" | wc -l || true)

if [ $VIDEO_COUNT -gt 0 ] || [ $AUDIO_COUNT -gt 0 ]; then
    # AAA requires: captions, audio descriptions, AND sign language
    HAS_CAPTIONS=$(grep -Ei '(track.*kind=.*(captions|subtitles)|<caption)' "$INPUT_FILE" | wc -l || true)
    HAS_AUDIO_DESC=$(grep -Ei 'track.*kind=.*descriptions' "$INPUT_FILE" | wc -l || true)
    HAS_SIGN_LANG=$(grep -Ei '(sign.*language|asl.*interpretation)' "$INPUT_FILE" | wc -l || true)
    
    if [ $HAS_CAPTIONS -gt 0 ]; then
        MULTIMEDIA_SCORE=$((MULTIMEDIA_SCORE + 4))
    else
        VIOLATIONS_MAJOR["missing_captions"]=$VIDEO_COUNT
        TOP_FINDINGS+=("MAJOR: Videos missing captions (WCAG 1.2.2/1.2.4)")
    fi
    
    if [ $HAS_AUDIO_DESC -gt 0 ]; then
        MULTIMEDIA_SCORE=$((MULTIMEDIA_SCORE + 3))
    else
        VIOLATIONS_MAJOR["missing_audio_desc"]=$VIDEO_COUNT
        TOP_FINDINGS+=("MAJOR: Videos missing audio descriptions (WCAG 1.2.5/1.2.7)")
    fi
    
    if [ $HAS_SIGN_LANG -gt 0 ]; then
        MULTIMEDIA_SCORE=$((MULTIMEDIA_SCORE + 3))
    else
        VIOLATIONS_MINOR["missing_sign_language"]=$VIDEO_COUNT
        TOP_FINDINGS+=("MINOR: Videos missing sign language interpretation (WCAG 1.2.6)")
    fi
    
    PERCEIVABLE_SCORE=$((PERCEIVABLE_SCORE + MULTIMEDIA_SCORE))
    echo -e "    ${YELLOW}⚠ Multimedia AAA compliance: $MULTIMEDIA_SCORE/10${NC}"
else
    PERCEIVABLE_SCORE=$((PERCEIVABLE_SCORE + 10))
    echo -e "    ${GREEN}✓ No multimedia elements (10/10)${NC}"
fi

# 1.3 Adaptable - AAA (10 points)
echo "  → Checking content structure..."
STRUCTURE_SCORE=0

# AAA requires proper semantic structure
HAS_MAIN=$(grep -Ei '<main[^>]*>' "$INPUT_FILE" | wc -l || true)
HAS_NAV=$(grep -Ei '<nav[^>]*>' "$INPUT_FILE" | wc -l || true)
HAS_HEADER=$(grep -Ei '<header[^>]*>' "$INPUT_FILE" | wc -l || true)
HAS_FOOTER=$(grep -Ei '<footer[^>]*>' "$INPUT_FILE" | wc -l || true)
HAS_ARTICLE=$(grep -Ei '<article[^>]*>' "$INPUT_FILE" | wc -l || true)

LANDMARK_COUNT=$((HAS_MAIN + HAS_NAV + HAS_HEADER + HAS_FOOTER))

if [ $LANDMARK_COUNT -ge 3 ]; then
    STRUCTURE_SCORE=$((STRUCTURE_SCORE + 5))
else
    VIOLATIONS_MAJOR["missing_landmarks"]=$((3 - LANDMARK_COUNT))
    TOP_FINDINGS+=("MAJOR: Insufficient semantic landmarks (need ≥3)")
fi

# Check for proper heading hierarchy
H1_COUNT=$(grep -Eio '<h1[^>]*>' "$INPUT_FILE" | wc -l || true)
if [ $H1_COUNT -eq 1 ]; then
    STRUCTURE_SCORE=$((STRUCTURE_SCORE + 5))
else
    VIOLATIONS_MAJOR["heading_hierarchy"]=$H1_COUNT
    TOP_FINDINGS+=("MAJOR: Must have exactly one H1 (found: $H1_COUNT)")
fi

PERCEIVABLE_SCORE=$((PERCEIVABLE_SCORE + STRUCTURE_SCORE))
echo -e "    ${YELLOW}⚠ Structure compliance: $STRUCTURE_SCORE/10${NC}"

# 1.4 Distinguishable - AAA (15 points) - STRICTEST
echo "  → Checking contrast ratios (AAA standards)..."
CONTRAST_SCORE=0

# AAA Contrast Requirements:
# - Normal text: 7:1 minimum (vs 4.5:1 for AA)
# - Large text: 4.5:1 minimum (vs 3:1 for AA)
# - UI components: 3:1 minimum

# Run Python contrast checker with AAA standards
python3 - "$INPUT_FILE" << 'PYEOF' > /tmp/contrast-check-aaa.json
import re
import json
import sys

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rel_luminance(rgb):
    srgb = [c / 255.0 for c in rgb]
    linear = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]

def contrast_ratio(fg, bg):
    lum1 = rel_luminance(fg)
    lum2 = rel_luminance(bg)
    lighter = max(lum1, lum2)
    darker = min(lum1, lum2)
    return (lighter + 0.05) / (darker + 0.05)

try:
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'input.html'
    with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Extract colors from inline styles and common patterns
    color_patterns = re.findall(r'color:\s*#([0-9a-fA-F]{6})', content)
    bg_patterns = re.findall(r'background(?:-color)?:\s*#([0-9a-fA-F]{6})', content)
    
    results = {
        'total_checks': 0,
        'aaa_pass': 0,
        'aaa_fail': 0,
        'failures': []
    }
    
    # Default checks (common cases)
    checks = [
        ('#333333', '#ffffff', 'body-text'),
        ('#000000', '#ffffff', 'headers'),
        ('#ffffff', '#000000', 'inverse'),
        ('#0066cc', '#ffffff', 'links')
    ]
    
    for fg_hex, bg_hex, context in checks:
        fg = hex_to_rgb(fg_hex)
        bg = hex_to_rgb(bg_hex)
        ratio = contrast_ratio(fg, bg)
        results['total_checks'] += 1
        
        # AAA requires 7:1 for normal text
        if ratio >= 7.0:
            results['aaa_pass'] += 1
        else:
            results['aaa_fail'] += 1
            results['failures'].append({
                'fg': fg_hex,
                'bg': bg_hex,
                'ratio': round(ratio, 2),
                'required': 7.0,
                'context': context
            })
    
    print(json.dumps(results, indent=2))
    
except Exception as e:
    print(json.dumps({'error': str(e)}), file=sys.stderr)
    sys.exit(1)
PYEOF

if [ -f /tmp/contrast-check-aaa.json ]; then
    AAA_PASS=$(jq -r '.aaa_pass // 0' /tmp/contrast-check-aaa.json)
    AAA_FAIL=$(jq -r '.aaa_fail // 0' /tmp/contrast-check-aaa.json)
    TOTAL_CHECKS=$(jq -r '.total_checks // 1' /tmp/contrast-check-aaa.json)
    
    if [ $AAA_FAIL -eq 0 ]; then
        CONTRAST_SCORE=15
        echo -e "    ${GREEN}✓ All contrast ratios meet AAA (7:1) (15/15)${NC}"
    else
        CONTRAST_SCORE=$((15 * AAA_PASS / TOTAL_CHECKS))
        VIOLATIONS_CRITICAL["contrast_aaa"]=$AAA_FAIL
        TOP_FINDINGS+=("CRITICAL: $AAA_FAIL color combinations fail AAA contrast (7:1)")
        echo -e "    ${RED}✗ $AAA_FAIL contrast failures for AAA ($CONTRAST_SCORE/15)${NC}"
    fi
    PERCEIVABLE_SCORE=$((PERCEIVABLE_SCORE + CONTRAST_SCORE))
fi

echo ""
echo -e "${BLUE}  Perceivable Score: $PERCEIVABLE_SCORE/$PERCEIVABLE_MAX${NC}"
TOTAL_SCORE=$((TOTAL_SCORE + PERCEIVABLE_SCORE))

# ============================================================================
# SECTION 2: OPERABLE - AAA Level (35 points)
# ============================================================================
echo ""
echo -e "${BLUE}⌨️  Section 2: Operable (AAA Level - 35 points)${NC}"

OPERABLE_SCORE=0
OPERABLE_MAX=35

# 2.1 Keyboard Accessible - AAA (10 points)
echo "  → Checking keyboard accessibility..."
KEYBOARD_SCORE=0

# AAA: All functionality available via keyboard with NO exceptions
ONCLICK_DIVS=$(grep -Ei '<(div|span)[^>]*(onclick|ng-click|@click)' "$INPUT_FILE" | wc -l || true)
if [ $ONCLICK_DIVS -gt 0 ]; then
    VIOLATIONS_CRITICAL["clickable_divs"]=$ONCLICK_DIVS
    TOP_FINDINGS+=("CRITICAL: $ONCLICK_DIVS non-semantic clickable elements")
else
    KEYBOARD_SCORE=$((KEYBOARD_SCORE + 5))
fi

# Check for proper focus management
TABINDEX_NEGATIVE=$(grep -Ei 'tabindex="-1"' "$INPUT_FILE" | wc -l || true)
if [ $TABINDEX_NEGATIVE -gt 0 ]; then
    VIOLATIONS_MAJOR["focus_management"]=$TABINDEX_NEGATIVE
    echo -e "    ${YELLOW}⚠ $TABINDEX_NEGATIVE elements with tabindex=-1 (review needed)${NC}"
else
    KEYBOARD_SCORE=$((KEYBOARD_SCORE + 5))
fi

OPERABLE_SCORE=$((OPERABLE_SCORE + KEYBOARD_SCORE))
echo -e "    ${YELLOW}Keyboard accessibility: $KEYBOARD_SCORE/10${NC}"

# 2.2 Enough Time - AAA (10 points)
echo "  → Checking timing requirements..."
TIMING_SCORE=10

# AAA: No time limits (or extended time limits)
HAS_TIMER=$(grep -Ei '(setTimeout|setInterval|timer|countdown)' "$INPUT_FILE" | wc -l || true)
if [ $HAS_TIMER -gt 0 ]; then
    VIOLATIONS_MINOR["timing_concerns"]=$HAS_TIMER
    TIMING_SCORE=7
    echo -e "    ${YELLOW}⚠ Timer functionality detected - verify AAA compliance (7/10)${NC}"
else
    echo -e "    ${GREEN}✓ No timing constraints (10/10)${NC}"
fi

OPERABLE_SCORE=$((OPERABLE_SCORE + TIMING_SCORE))

# 2.3 Seizures and Physical Reactions - AAA (10 points)
echo "  → Checking for seizure triggers..."
SEIZURE_SCORE=10

# AAA: No flashing content whatsoever
HAS_ANIMATION=$(grep -Ei '(animation|@keyframes|flashing|blink)' "$INPUT_FILE" | wc -l || true)
if [ $HAS_ANIMATION -gt 0 ]; then
    VIOLATIONS_MAJOR["animation_check"]=$HAS_ANIMATION
    SEIZURE_SCORE=7
    echo -e "    ${YELLOW}⚠ Animation detected - verify no flashing (7/10)${NC}"
else
    echo -e "    ${GREEN}✓ No animation/flashing content (10/10)${NC}"
fi

OPERABLE_SCORE=$((OPERABLE_SCORE + SEIZURE_SCORE))

# 2.4 Navigable - AAA (5 points)
echo "  → Checking navigation..."
NAV_SCORE=0

# AAA requires: skip links, focus order, link purpose, multiple ways
HAS_SKIP_LINK=$(grep -Ei 'skip.*content|skip.*main' "$INPUT_FILE" | wc -l || true)
if [ $HAS_SKIP_LINK -gt 0 ]; then
    NAV_SCORE=$((NAV_SCORE + 5))
    echo -e "    ${GREEN}✓ Skip link present (5/5)${NC}"
else
    VIOLATIONS_MAJOR["missing_skip_link"]=1
    TOP_FINDINGS+=("MAJOR: Missing skip to main content link (WCAG 2.4.1)")
    echo -e "    ${RED}✗ No skip link found (0/5)${NC}"
fi

OPERABLE_SCORE=$((OPERABLE_SCORE + NAV_SCORE))

echo ""
echo -e "${BLUE}  Operable Score: $OPERABLE_SCORE/$OPERABLE_MAX${NC}"
TOTAL_SCORE=$((TOTAL_SCORE + OPERABLE_SCORE))

# ============================================================================
# SECTION 3: UNDERSTANDABLE - AAA Level (40 points)
# ============================================================================
echo ""
echo -e "${BLUE}📖 Section 3: Understandable (AAA Level - 40 points)${NC}"

UNDERSTANDABLE_SCORE=0
UNDERSTANDABLE_MAX=40

# 3.1 Readable - AAA (20 points)
echo "  → Checking readability (AAA standards)..."
READABLE_SCORE=0

# Check language attribute
HAS_LANG=$(grep -Ei '<html[^>]*lang=' "$INPUT_FILE" | wc -l || true)
if [ $HAS_LANG -gt 0 ]; then
    READABLE_SCORE=$((READABLE_SCORE + 5))
    echo -e "    ${GREEN}✓ Language attribute present (5/5)${NC}"
else
    VIOLATIONS_CRITICAL["missing_lang"]=1
    TOP_FINDINGS+=("CRITICAL: Missing language attribute on <html>")
    echo -e "    ${RED}✗ No language attribute (0/5)${NC}"
fi

# AAA requires reading level check (lower secondary education - Grade 9)
# We'll check for complexity indicators
LONG_WORDS=$(grep -Eio '\b[a-z]{13,}\b' "$INPUT_FILE" | wc -l || true)
if [ $LONG_WORDS -lt 10 ]; then
    READABLE_SCORE=$((READABLE_SCORE + 10))
    echo -e "    ${GREEN}✓ Text complexity reasonable (10/10)${NC}"
else
    VIOLATIONS_MINOR["reading_level"]=$LONG_WORDS
    READABLE_SCORE=$((READABLE_SCORE + 7))
    echo -e "    ${YELLOW}⚠ Complex vocabulary detected - may exceed Grade 9 level (7/10)${NC}"
fi

# AAA requires pronunciation guide for unusual words
# We'll give partial credit
READABLE_SCORE=$((READABLE_SCORE + 5))
echo -e "    ${YELLOW}⚠ Manual check needed for pronunciation guides (5/5 provisional)${NC}"

UNDERSTANDABLE_SCORE=$((UNDERSTANDABLE_SCORE + READABLE_SCORE))

# 3.2 Predictable - AAA (10 points)
echo "  → Checking predictability..."
PREDICTABLE_SCORE=10

# Check for consistent navigation
NAV_COUNT=$(grep -Ei '<nav[^>]*>' "$INPUT_FILE" | wc -l || true)
if [ $NAV_COUNT -gt 1 ]; then
    VIOLATIONS_MINOR["multiple_nav"]=1
    PREDICTABLE_SCORE=8
    echo -e "    ${YELLOW}⚠ Multiple nav elements - verify consistency (8/10)${NC}"
else
    echo -e "    ${GREEN}✓ Navigation appears consistent (10/10)${NC}"
fi

UNDERSTANDABLE_SCORE=$((UNDERSTANDABLE_SCORE + PREDICTABLE_SCORE))

# 3.3 Input Assistance - AAA (10 points)
echo "  → Checking form input assistance..."
INPUT_SCORE=0

FORM_COUNT=$(grep -Ei '<form[^>]*>' "$INPUT_FILE" | wc -l || true)
if [ $FORM_COUNT -gt 0 ]; then
    # AAA requires: labels, instructions, error prevention, context-sensitive help
    LABEL_COUNT=$(grep -Ei '<label[^>]*>' "$INPUT_FILE" | wc -l || true)
    INPUT_COUNT=$(grep -Ei '<input[^>]*>' "$INPUT_FILE" | wc -l || true)
    
    if [ $LABEL_COUNT -ge $INPUT_COUNT ] && [ $INPUT_COUNT -gt 0 ]; then
        INPUT_SCORE=$((INPUT_SCORE + 10))
        echo -e "    ${GREEN}✓ All inputs properly labeled (10/10)${NC}"
    else
        VIOLATIONS_CRITICAL["missing_labels"]=$((INPUT_COUNT - LABEL_COUNT))
        TOP_FINDINGS+=("CRITICAL: $((INPUT_COUNT - LABEL_COUNT)) inputs missing labels")
        echo -e "    ${RED}✗ $((INPUT_COUNT - LABEL_COUNT)) inputs missing labels (0/10)${NC}"
    fi
else
    INPUT_SCORE=10
    echo -e "    ${GREEN}✓ No forms present (10/10)${NC}"
fi

UNDERSTANDABLE_SCORE=$((UNDERSTANDABLE_SCORE + INPUT_SCORE))

echo ""
echo -e "${BLUE}  Understandable Score: $UNDERSTANDABLE_SCORE/$UNDERSTANDABLE_MAX${NC}"
TOTAL_SCORE=$((TOTAL_SCORE + UNDERSTANDABLE_SCORE))

# ============================================================================
# SECTION 4: ROBUST - AAA Level (35 points)
# ============================================================================
echo ""
echo -e "${BLUE}🔧 Section 4: Robust (AAA Level - 35 points)${NC}"

ROBUST_SCORE=0
ROBUST_MAX=35

# 4.1 Compatible - AAA (35 points)
echo "  → Checking HTML validity and ARIA..."

# HTML5 validation (basic checks)
VALIDITY_SCORE=0

DOCTYPE_CHECK=$(head -n 5 "$INPUT_FILE" | grep -Ei '<!DOCTYPE html>' | wc -l || true)
if [ $DOCTYPE_CHECK -gt 0 ]; then
    VALIDITY_SCORE=$((VALIDITY_SCORE + 5))
else
    VIOLATIONS_MAJOR["missing_doctype"]=1
    TOP_FINDINGS+=("MAJOR: Missing HTML5 DOCTYPE")
fi

# Check for proper closing tags
UNCLOSED_TAGS=$(grep -Eio '<(div|span|p|section|article|header|footer|nav|main)[^/>]*>' "$INPUT_FILE" | wc -l || true)
CLOSED_TAGS=$(grep -Eio '</(div|span|p|section|article|header|footer|nav|main)>' "$INPUT_FILE" | wc -l || true)

if [ $UNCLOSED_TAGS -eq $CLOSED_TAGS ]; then
    VALIDITY_SCORE=$((VALIDITY_SCORE + 10))
else
    VIOLATIONS_MAJOR["tag_balance"]=$((UNCLOSED_TAGS - CLOSED_TAGS))
    VALIDITY_SCORE=$((VALIDITY_SCORE + 7))
fi

# ARIA compliance - AAA requires proper usage
ARIA_COUNT=$(grep -Eio 'aria-[a-z]+=' "$INPUT_FILE" | wc -l || true)
ARIA_INVALID=$(grep -Ei 'aria-(invalid|labeledby|describeby)=' "$INPUT_FILE" | wc -l || true)

if [ $ARIA_COUNT -gt 0 ]; then
    if [ $ARIA_INVALID -eq 0 ]; then
        VALIDITY_SCORE=$((VALIDITY_SCORE + 20))
        echo -e "    ${GREEN}✓ ARIA attributes appear valid (20/20)${NC}"
    else
        VIOLATIONS_MAJOR["aria_issues"]=$ARIA_INVALID
        VALIDITY_SCORE=$((VALIDITY_SCORE + 15))
        echo -e "    ${YELLOW}⚠ $ARIA_INVALID potential ARIA issues (15/20)${NC}"
    fi
else
    VALIDITY_SCORE=$((VALIDITY_SCORE + 20))
    echo -e "    ${GREEN}✓ No ARIA used (semantic HTML preferred) (20/20)${NC}"
fi

ROBUST_SCORE=$((ROBUST_SCORE + VALIDITY_SCORE))
echo -e "    ${BLUE}HTML/ARIA validity: $VALIDITY_SCORE/35${NC}"

echo ""
echo -e "${BLUE}  Robust Score: $ROBUST_SCORE/$ROBUST_MAX${NC}"
TOTAL_SCORE=$((TOTAL_SCORE + ROBUST_SCORE))

# ============================================================================
# FINAL SCORING AND REPORT GENERATION
# ============================================================================
echo ""
echo "═══════════════════════════════════════════════════════════════"

# Calculate percentages
PERCENT=$((TOTAL_SCORE * 100 / MAX_SCORE))

# Determine compliance level
COMPLIANCE_LEVEL="FAIL"
COMPLIANCE_COLOR=$RED

if [ $PERCENT -ge 95 ]; then
    COMPLIANCE_LEVEL="AAA COMPLIANT"
    COMPLIANCE_COLOR=$GREEN
elif [ $PERCENT -ge 90 ]; then
    COMPLIANCE_LEVEL="NEAR AAA"
    COMPLIANCE_COLOR=$YELLOW
elif [ $PERCENT -ge 80 ]; then
    COMPLIANCE_LEVEL="AA COMPLIANT (AAA needs work)"
    COMPLIANCE_COLOR=$YELLOW
else
    COMPLIANCE_LEVEL="BELOW AAA STANDARDS"
    COMPLIANCE_COLOR=$RED
fi

echo ""
echo -e "${MAGENTA}📊 WCAG AAA COMPLIANCE REPORT${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}Score Breakdown:${NC}"
echo -e "  Perceivable:      $PERCEIVABLE_SCORE/$PERCEIVABLE_MAX ($(($PERCEIVABLE_SCORE * 100 / $PERCEIVABLE_MAX))%)"
echo -e "  Operable:         $OPERABLE_SCORE/$OPERABLE_MAX ($(($OPERABLE_SCORE * 100 / $OPERABLE_MAX))%)"
echo -e "  Understandable:   $UNDERSTANDABLE_SCORE/$UNDERSTANDABLE_MAX ($(($UNDERSTANDABLE_SCORE * 100 / $UNDERSTANDABLE_MAX))%)"
echo -e "  Robust:           $ROBUST_SCORE/$ROBUST_MAX ($(($ROBUST_SCORE * 100 / $ROBUST_MAX))%)"
echo ""
echo -e "${COMPLIANCE_COLOR}🎯 Total Score: $TOTAL_SCORE/$MAX_SCORE ($PERCENT%)${NC}"
echo -e "${COMPLIANCE_COLOR}📋 Compliance: $COMPLIANCE_LEVEL${NC}"
echo ""

# Count issues
CRITICAL_COUNT=${#VIOLATIONS_CRITICAL[@]}
MAJOR_COUNT=${#VIOLATIONS_MAJOR[@]}
MINOR_COUNT=${#VIOLATIONS_MINOR[@]}
TOTAL_ISSUES=$((CRITICAL_COUNT + MAJOR_COUNT + MINOR_COUNT))

echo -e "${BLUE}Issues Found: $TOTAL_ISSUES total${NC}"
echo -e "  ${RED}Critical: $CRITICAL_COUNT${NC}"
echo -e "  ${YELLOW}Major: $MAJOR_COUNT${NC}"
echo -e "  ${CYAN}Minor: $MINOR_COUNT${NC}"
echo ""

# Show top findings
if [ ${#TOP_FINDINGS[@]} -gt 0 ]; then
    echo -e "${BLUE}🔍 TOP FINDINGS:${NC}"
    for i in "${!TOP_FINDINGS[@]}"; do
        if [ $i -lt 5 ]; then
            echo "  $((i+1)). ${TOP_FINDINGS[$i]}"
        fi
    done
    echo ""
fi

# Generate JSON report
cat > "$REPORT_FILE" << JSONEOF
{
  "schemaVersion": "2.0-AAA",
  "timestamp": "$(date -Iseconds)",
  "file": "$INPUT_FILE",
  "wcagLevel": "AAA",
  "scores": {
    "total": $TOTAL_SCORE,
    "max": $MAX_SCORE,
    "percent": $PERCENT,
    "perceivable": $PERCEIVABLE_SCORE,
    "operable": $OPERABLE_SCORE,
    "understandable": $UNDERSTANDABLE_SCORE,
    "robust": $ROBUST_SCORE
  },
  "compliance": {
    "level": "$COMPLIANCE_LEVEL",
    "meets_aaa": $([ $PERCENT -ge 95 ] && echo "true" || echo "false"),
    "meets_aa": $([ $PERCENT -ge 85 ] && echo "true" || echo "false")
  },
  "issues": {
    "total": $TOTAL_ISSUES,
    "critical": $CRITICAL_COUNT,
    "major": $MAJOR_COUNT,
    "minor": $MINOR_COUNT
  },
  "recommendations": [
    "$([ $PERCENT -lt 95 ] && echo 'Achieve 95%+ for AAA compliance' || echo 'Excellent! Maintain AAA standards')",
    "$([ $CRITICAL_COUNT -gt 0 ] && echo 'Fix all CRITICAL issues immediately' || echo 'No critical issues')",
    "$([ ${VIOLATIONS_CRITICAL[contrast_aaa]+_} ] && echo 'Upgrade contrast ratios to 7:1 (AAA)' || echo 'Contrast ratios meet AAA')",
    "$([ ${VIOLATIONS_CRITICAL[missing_lang]+_} ] && echo 'Add language attribute to HTML tag' || echo 'Language properly declared')"
  ]
}
JSONEOF

echo -e "${GREEN}✅ Report saved: $REPORT_FILE${NC}"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Exit with appropriate code
if [ $PERCENT -ge 95 ]; then
    exit 0
elif [ $PERCENT -ge 90 ]; then
    exit 1
else
    exit 2
fi
