#!/bin/bash
###############################################################################
# Quote Form Layout Validation Script
# Checks for CSS/HTML issues and validates responsive behavior
###############################################################################

echo "╔════════════════════════════════════════════════════╗"
echo "║  🔍 QUOTE FORM LAYOUT VALIDATION                  ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

FORM_FILE="src/components/quote/QuoteForm.astro"
LAYOUT_CSS="src/styles/quote/form-layout.css"

if [ ! -f "$FORM_FILE" ]; then
    echo "❌ Form component not found at $FORM_FILE"
    exit 1
fi

if [ ! -f "$LAYOUT_CSS" ]; then
    echo "❌ Layout stylesheet not found at $LAYOUT_CSS"
    exit 1
fi

echo "📋 CHECKING HTML STRUCTURE..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check add-ons grid
if grep -q 'id="addons".*class="grid' "$FORM_FILE"; then
    echo "✅ Add-ons grid container found"
    ADDONS_CLASS=$(grep 'id="addons"' "$FORM_FILE" | grep -o 'class="[^"]*"')
    echo "   Classes: $ADDONS_CLASS"
else
    echo "❌ Add-ons grid container NOT found"
fi
echo ""

# Check add-on cards
ADDON_COUNT=$(grep -c 'class="q-addon"' "$FORM_FILE")
echo "✅ Found $ADDON_COUNT add-on cards"
echo ""

echo "🎨 CHECKING CSS RULES..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check responsive class usage
if grep -q 'class="[^"]*md:grid-cols-2' "$FORM_FILE"; then
    echo "✅ Responsive class md:grid-cols-2 present"
else
    echo "❌ md:grid-cols-2 not found on add-ons grid"
fi
echo ""

echo "📱 CHECKING RESPONSIVE SETUP..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check mobile-first approach
if grep -q 'grid-cols-1' "$FORM_FILE"; then
    echo "✅ Mobile-first: grid-cols-1 (single column)"
fi

# Check form layout stylesheet for stepper definitions
if grep -q '#q-progress' "$LAYOUT_CSS" && grep -q '.q-stepper-item' "$LAYOUT_CSS"; then
    echo "✅ Form layout stylesheet defines progress + stepper styles"
else
    echo "⚠️  Review form-layout.css for missing stepper styles"
fi
echo ""

echo "🔧 CHECKING TAILWIND CLASSES..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check for proper gap classes
if grep -q 'gap-3.*md:gap-4' "$FORM_FILE"; then
    echo "✅ Responsive gap classes: gap-3 (mobile) → gap-4 (desktop)"
else
    if grep -q 'gap-3' "$FORM_FILE"; then
        echo "⚠️  Found gap-3 but no desktop override"
    else
        echo "⚠️  Gap classes might need adjustment"
    fi
fi
echo ""

echo "⚡ POTENTIAL ISSUES TO CHECK:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check for conflicting classes (raw grid-cols-2 without breakpoint prefix)
if grep -q 'grid-cols-2' "$FORM_FILE" && ! grep -q 'md:grid-cols-2' "$FORM_FILE"; then
    echo "⚠️  Warning: grid-cols-2 found outside media query"
    echo "   This might conflict with mobile layout"
else
    echo "✅ No conflicting grid column classes"
fi
echo ""

# Check for inline styles that might override
INLINE_GRID=$(grep -c 'style=".*grid' "$FORM_FILE")
if [ "$INLINE_GRID" -gt 0 ]; then
    echo "⚠️  Found $INLINE_GRID inline grid styles"
    echo "   These might override CSS rules"
else
    echo "✅ No inline grid styles found"
fi
echo ""

echo "✅ VALIDATION COMPLETE!"
echo ""
echo "📊 SUMMARY:"
echo "   • Add-ons: $ADDON_COUNT cards"
echo "   • Responsive class: md:grid-cols-2 $(grep -q 'md:grid-cols-2' "$FORM_FILE" && echo '✔' || echo '✖')"
echo "   • Mobile: Single column (grid-cols-1)"
echo "   • Layout CSS: $(basename "$LAYOUT_CSS") present"
echo ""
echo "🎯 RECOMMENDATION:"
echo "   Preview the form to verify 2-column layout works on desktop!"
echo ""
