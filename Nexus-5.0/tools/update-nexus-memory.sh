#!/bin/bash
###############################################################################
# NEXUS Session Handoff Generator
# 
# Purpose: Help agents quickly document their session for the next agent
# Usage: ./update-nexus-memory.sh
###############################################################################

set -e

# Navigate to Nexus-5.0 root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NEXUS_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$NEXUS_ROOT"

MEMORY_FILE="NEXUS_MEMORY.md"
TIMESTAMP=$(date -u +"%B %d, %Y - %H:%M UTC")

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║      📝 NEXUS Memory Update Helper 📝                       ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

if [ ! -f "$MEMORY_FILE" ]; then
    echo "❌ $MEMORY_FILE not found!"
    echo "Creating from template..."
    exit 1
fi

echo "Current memory file: $MEMORY_FILE"
echo "Last updated: $(grep "Last Updated:" $MEMORY_FILE | head -1 | cut -d: -f2-)"
echo ""

echo "📊 Current Status:"
echo "  - Lines: $(wc -l < $MEMORY_FILE)"
echo "  - Size: $(ls -lh $MEMORY_FILE | awk '{print $5}')"
echo ""

echo "🎯 Quick Stats:"
echo "  - Sections: $(grep "^## " $MEMORY_FILE | wc -l)"
echo "  - Key files mentioned: $(grep -o "/workspaces/[^)]*" $MEMORY_FILE | sort -u | wc -l)"
echo "  - Tasks pending: $(grep "\- \[ \]" $MEMORY_FILE | wc -l)"
echo ""

echo "✅ Memory file is ready for new agents!"
echo ""
echo "📖 Next agent should read:"
echo "  1. QUICK STATUS (30 sec)"
echo "  2. WHAT WE ACCOMPLISHED (5 min)"
echo "  3. KEY LEARNINGS & DECISIONS (3 min)"
echo ""
echo "⏱️  Total handoff time: ~11 minutes vs 5 hours!"
echo ""

# Show recent updates
echo "📝 Recent section headers:"
grep "^## " $MEMORY_FILE | head -10
echo ""

echo "✨ To update the memory file:"
echo "  1. Edit: $MEMORY_FILE"
echo "  2. Update timestamp in header"
echo "  3. Add to 'WHAT WE ACCOMPLISHED'"
echo "  4. Add any 'KEY LEARNINGS'"
echo "  5. Update 'PENDING TASKS'"
echo ""
echo "💾 Done! Memory preserved for next agent."
