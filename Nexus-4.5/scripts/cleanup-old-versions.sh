#!/bin/bash
# Cleanup Script for Old NEXUS Versions
# Safely archives old Nexus folders to free up space

set -euo pipefail

ARCHIVE_DIR="/workspaces/data-folder/nexus-archive-$(date +%Y%m%d)"
OLD_VERSIONS=("nexus" "nexusv3" "Nexus-4" "nexus2")

echo "🗂️  NEXUS Cleanup Script"
echo "======================"
echo ""
echo "This will archive old NEXUS versions:"
for version in "${OLD_VERSIONS[@]}"; do
    if [ -d "/workspaces/data-folder/$version" ]; then
        SIZE=$(du -sh "/workspaces/data-folder/$version" | cut -f1)
        echo "  - $version ($SIZE)"
    fi
done
echo ""
echo "Archive location: $ARCHIVE_DIR"
echo ""
read -p "Continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Cancelled"
    exit 0
fi

echo ""
echo "Creating archive directory..."
mkdir -p "$ARCHIVE_DIR"

echo ""
for version in "${OLD_VERSIONS[@]}"; do
    if [ -d "/workspaces/data-folder/$version" ]; then
        echo "📦 Archiving $version..."
        mv "/workspaces/data-folder/$version" "$ARCHIVE_DIR/"
        echo "✅ $version archived"
    fi
done

echo ""
echo "🎉 Cleanup complete!"
echo ""
echo "Old versions archived to: $ARCHIVE_DIR"
echo ""
echo "To restore:"
echo "  mv $ARCHIVE_DIR/* /workspaces/data-folder/"
echo ""
echo "To delete archives permanently:"
echo "  rm -rf $ARCHIVE_DIR"
echo ""
echo "Space saved: $(du -sh $ARCHIVE_DIR | cut -f1)"
