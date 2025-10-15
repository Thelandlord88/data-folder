#!/bin/bash
# NEXUS UX Opportunity Detector
# Fast HTML scanning to identify UX enhancement opportunities

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

if [ $# -lt 1 ]; then
    echo "Usage: $0 <input.html> [output.json]"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="${2:-${INPUT_FILE%.html}-ux-opportunities.json}"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo -e "${CYAN}🔍 NEXUS UX Opportunity Detector${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}📄 Input: $INPUT_FILE${NC}"
echo -e "${BLUE}📊 Output: $OUTPUT_FILE${NC}"
echo ""

# Initialize counters
BUTTON_COUNT=0
LINK_COUNT=0
INPUT_COUNT=0
CARD_COUNT=0
NAV_COUNT=0
FORM_COUNT=0
IMAGE_COUNT=0
MODAL_COUNT=0
SECTION_COUNT=0
STAT_COUNT=0

echo -e "${CYAN}Scanning for UX opportunities...${NC}"
echo ""

# Detect Buttons
echo "  → Detecting interactive buttons..."
BUTTON_COUNT=$(grep -Eio '<button[^>]*>' "$INPUT_FILE" | wc -l || true)
BTN_CLASS_COUNT=$(grep -Eio 'class="[^"]*btn[^"]*"' "$INPUT_FILE" | wc -l || true)
SUBMIT_COUNT=$(grep -Eio '<input[^>]*type="submit"' "$INPUT_FILE" | wc -l || true)
TOTAL_BUTTONS=$((BUTTON_COUNT + BTN_CLASS_COUNT + SUBMIT_COUNT))
echo -e "    ${GREEN}Found $TOTAL_BUTTONS button elements${NC}"

# Detect Links
echo "  → Detecting navigation links..."
LINK_COUNT=$(grep -Eio '<a[^>]*href' "$INPUT_FILE" | wc -l || true)
echo -e "    ${GREEN}Found $LINK_COUNT link elements${NC}"

# Detect Form Inputs
echo "  → Detecting form inputs..."
INPUT_TEXT=$(grep -Eio '<input[^>]*type="text"|<input[^>]*type="email"|<input[^>]*type="tel"' "$INPUT_FILE" | wc -l || true)
TEXTAREA_COUNT=$(grep -Eio '<textarea[^>]*>' "$INPUT_FILE" | wc -l || true)
SELECT_COUNT=$(grep -Eio '<select[^>]*>' "$INPUT_FILE" | wc -l || true)
TOTAL_INPUTS=$((INPUT_TEXT + TEXTAREA_COUNT + SELECT_COUNT))
echo -e "    ${GREEN}Found $TOTAL_INPUTS form input elements${NC}"

# Detect Cards
echo "  → Detecting card components..."
CARD_COUNT=$(grep -Eio 'class="[^"]*card[^"]*"' "$INPUT_FILE" | wc -l || true)
ARTICLE_COUNT=$(grep -Eio '<article[^>]*>' "$INPUT_FILE" | wc -l || true)
TOTAL_CARDS=$((CARD_COUNT + ARTICLE_COUNT))
echo -e "    ${GREEN}Found $TOTAL_CARDS card-like components${NC}"

# Detect Navigation
echo "  → Detecting navigation elements..."
NAV_COUNT=$(grep -Eio '<nav[^>]*>' "$INPUT_FILE" | wc -l || true)
NAV_LINKS=$(grep -Eio 'nav a' "$INPUT_FILE" | wc -l || true)
echo -e "    ${GREEN}Found $NAV_COUNT navigation areas, $NAV_LINKS nav links${NC}"

# Detect Forms
echo "  → Detecting forms..."
FORM_COUNT=$(grep -Eio '<form[^>]*>' "$INPUT_FILE" | wc -l || true)
echo -e "    ${GREEN}Found $FORM_COUNT form elements${NC}"

# Detect Images
echo "  → Detecting images..."
IMAGE_COUNT=$(grep -Eio '<img[^>]*>' "$INPUT_FILE" | wc -l || true)
echo -e "    ${GREEN}Found $IMAGE_COUNT image elements${NC}"

# Detect Modals/Dialogs
echo "  → Detecting modals and dialogs..."
MODAL_COUNT=$(grep -Eio 'class="[^"]*modal[^"]*"' "$INPUT_FILE" | wc -l || true)
echo -e "    ${GREEN}Found $MODAL_COUNT modal/dialog components${NC}"

# Detect Sections
echo "  → Detecting content sections..."
SECTION_COUNT=$(grep -Eio '<section[^>]*>' "$INPUT_FILE" | wc -l || true)
echo -e "    ${GREEN}Found $SECTION_COUNT section elements${NC}"

# Detect Statistics/Counters
echo "  → Detecting statistic counters..."
STAT_COUNT=$(grep -Eio 'class="[^"]*stat[^"]*"' "$INPUT_FILE" | wc -l || true)
echo -e "    ${GREEN}Found $STAT_COUNT statistic elements${NC}"

# Additional detections
echo "  → Detecting additional opportunities..."
DROPDOWN_COUNT=$(grep -Eio 'class="[^"]*dropdown[^"]*"' "$INPUT_FILE" | wc -l || true)
BADGE_COUNT=$(grep -Eio 'class="[^"]*badge[^"]*"' "$INPUT_FILE" | wc -l || true)
TOOLTIP_COUNT=$(grep -Eio 'data-tooltip' "$INPUT_FILE" | wc -l || true)
PROGRESS_COUNT=$(grep -Eio '<progress[^>]*>' "$INPUT_FILE" | wc -l || true)
TESTIMONIAL_COUNT=$(grep -Eio 'class="[^"]*testimonial[^"]*"' "$INPUT_FILE" | wc -l || true)
PRICE_COUNT=$(grep -Eio 'class="[^"]*price[^"]*"' "$INPUT_FILE" | wc -l || true)

echo -e "    ${GREEN}Found $DROPDOWN_COUNT dropdowns, $BADGE_COUNT badges${NC}"
echo -e "    ${GREEN}Found $TOOLTIP_COUNT tooltips, $PROGRESS_COUNT progress bars${NC}"
echo -e "    ${GREEN}Found $TESTIMONIAL_COUNT testimonials, $PRICE_COUNT prices${NC}"

echo ""

# Calculate totals
TOTAL_OPPORTUNITIES=$((TOTAL_BUTTONS + LINK_COUNT + TOTAL_INPUTS + TOTAL_CARDS + NAV_LINKS + IMAGE_COUNT + MODAL_COUNT + SECTION_COUNT + STAT_COUNT + DROPDOWN_COUNT + BADGE_COUNT + TOOLTIP_COUNT + PROGRESS_COUNT + TESTIMONIAL_COUNT + PRICE_COUNT))

echo -e "${YELLOW}📊 Total UX Opportunities: $TOTAL_OPPORTUNITIES${NC}"
echo ""

# Generate JSON output
cat > "$OUTPUT_FILE" << JSONEOF
{
  "file": "$INPUT_FILE",
  "timestamp": "$(date -Iseconds)",
  "total_opportunities": $TOTAL_OPPORTUNITIES,
  "opportunities": {
    "buttons": {
      "count": $TOTAL_BUTTONS,
      "patterns": ["button_smooth_hover"],
      "priority": "high"
    },
    "links": {
      "count": $LINK_COUNT,
      "patterns": ["link_underline_slide"],
      "priority": "medium"
    },
    "form_inputs": {
      "count": $TOTAL_INPUTS,
      "patterns": ["input_focus_glow", "form_validation_shake"],
      "priority": "high"
    },
    "cards": {
      "count": $TOTAL_CARDS,
      "patterns": ["card_elevation"],
      "priority": "medium"
    },
    "navigation": {
      "count": $NAV_LINKS,
      "nav_areas": $NAV_COUNT,
      "patterns": ["nav_item_highlight", "dropdown_smooth_open"],
      "priority": "medium"
    },
    "forms": {
      "count": $FORM_COUNT,
      "patterns": ["input_focus_glow", "form_validation_shake"],
      "priority": "high"
    },
    "images": {
      "count": $IMAGE_COUNT,
      "patterns": ["image_lazy_fade"],
      "priority": "low"
    },
    "modals": {
      "count": $MODAL_COUNT,
      "patterns": ["modal_scale_fade"],
      "priority": "high"
    },
    "sections": {
      "count": $SECTION_COUNT,
      "patterns": ["scroll_reveal"],
      "priority": "medium"
    },
    "statistics": {
      "count": $STAT_COUNT,
      "patterns": ["stat_count_up"],
      "priority": "high"
    },
    "dropdowns": {
      "count": $DROPDOWN_COUNT,
      "patterns": ["dropdown_smooth_open"],
      "priority": "medium"
    },
    "badges": {
      "count": $BADGE_COUNT,
      "patterns": ["badge_pulse"],
      "priority": "low"
    },
    "tooltips": {
      "count": $TOOLTIP_COUNT,
      "patterns": ["tooltip_fade"],
      "priority": "low"
    },
    "progress_bars": {
      "count": $PROGRESS_COUNT,
      "patterns": ["progress_bar_animate"],
      "priority": "medium"
    },
    "testimonials": {
      "count": $TESTIMONIAL_COUNT,
      "patterns": ["testimonial_fade_slide"],
      "priority": "medium"
    },
    "prices": {
      "count": $PRICE_COUNT,
      "patterns": ["price_highlight"],
      "priority": "medium"
    }
  },
  "recommendations": {
    "high_priority": [
      $([ $TOTAL_BUTTONS -gt 0 ] && echo '"Apply button hover effects"' || echo ''),
      $([ $TOTAL_INPUTS -gt 0 ] && echo '"Add form input focus glow"' || echo ''),
      $([ $STAT_COUNT -gt 0 ] && echo '"Implement counter animations"' || echo ''),
      $([ $MODAL_COUNT -gt 0 ] && echo '"Add modal scale fade"' || echo '')
    ],
    "estimated_impact": "$([ $TOTAL_OPPORTUNITIES -gt 50 ] && echo 'Very High' || ([ $TOTAL_OPPORTUNITIES -gt 25 ] && echo 'High' || echo 'Medium'))",
    "processing_time_estimate": "3-5 seconds"
  }
}
JSONEOF

# Clean up the JSON (remove empty entries)
jq 'del(.recommendations.high_priority[] | select(. == ""))' "$OUTPUT_FILE" > "${OUTPUT_FILE}.tmp" && mv "${OUTPUT_FILE}.tmp" "$OUTPUT_FILE"

echo -e "${GREEN}✅ Opportunity map saved: $OUTPUT_FILE${NC}"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Summary
echo -e "${CYAN}🎯 Top Opportunities:${NC}"
[ $TOTAL_BUTTONS -gt 0 ] && echo -e "  ${YELLOW}• $TOTAL_BUTTONS buttons ready for hover effects${NC}"
[ $TOTAL_INPUTS -gt 0 ] && echo -e "  ${YELLOW}• $TOTAL_INPUTS form inputs ready for focus glow${NC}"
[ $TOTAL_CARDS -gt 0 ] && echo -e "  ${YELLOW}• $TOTAL_CARDS cards ready for elevation effects${NC}"
[ $STAT_COUNT -gt 0 ] && echo -e "  ${YELLOW}• $STAT_COUNT statistics ready for counter animation${NC}"
[ $IMAGE_COUNT -gt 0 ] && echo -e "  ${YELLOW}• $IMAGE_COUNT images ready for lazy-load fade${NC}"

echo ""
echo -e "${GREEN}✨ Ready for enhancement! Run nexus-ux-analyzer.py next.${NC}"
echo ""

exit 0
