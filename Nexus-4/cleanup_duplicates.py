#!/usr/bin/env python3
"""
NEXUS-4 Cleanup Script
Remove duplicate .d.ts files from src/ and organize structure properly
"""

import os
from pathlib import Path
import shutil
from datetime import datetime

def cleanup_nexus4():
    """Remove .d.ts files from src/ (they belong in dist/)"""
    nexus4_path = Path("/workspaces/data-folder/Nexus-4")
    src_path = nexus4_path / "src"
    
    if not src_path.exists():
        print("❌ Nexus-4/src not found!")
        return
    
    print("🧹 NEXUS-4 Cleanup - Removing duplicate .d.ts files from src/")
    print("="*60)
    
    # Find all .d.ts files in src/
    dts_files = list(src_path.rglob("*.d.ts"))
    
    if not dts_files:
        print("✅ No .d.ts files found in src/ - already clean!")
        return
    
    print(f"Found {len(dts_files)} .d.ts files in src/")
    print("\nThese are TypeScript definition files that belong in dist/, not src/")
    print("They are auto-generated during compilation.\n")
    
    # Create backup directory
    backup_dir = nexus4_path / "cleanup_backup" / datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_dir.mkdir(parents=True, exist_ok=True)
    
    removed = 0
    for dts_file in dts_files:
        try:
            # Backup first
            rel_path = dts_file.relative_to(src_path)
            backup_file = backup_dir / rel_path
            backup_file.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(dts_file, backup_file)
            
            # Remove from src
            dts_file.unlink()
            print(f"  ✅ Removed: {rel_path}")
            removed += 1
        except Exception as e:
            print(f"  ❌ Error removing {dts_file.name}: {e}")
    
    print(f"\n✅ Cleanup complete!")
    print(f"  Removed: {removed} .d.ts files")
    print(f"  Backup: {backup_dir}")
    print("\nThe .d.ts files will be regenerated in dist/ when you run: tsc")

if __name__ == "__main__":
    cleanup_nexus4()
