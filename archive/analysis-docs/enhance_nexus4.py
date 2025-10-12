#!/usr/bin/env python3
"""
NEXUS-4 Enhancer
Adds missing consciousness files, dist files, and sensors to Nexus-4
"""

import os
import json
import shutil
from pathlib import Path
from datetime import datetime

class Nexus4Enhancer:
    def __init__(self, root_path: str):
        self.root_path = Path(root_path)
        self.nexus4_path = self.root_path / "Nexus-4"
        self.source_priority = [
            'nexus2/nexus2/runtime/nexus',
            'nexus2/nexus2/runtime/dist',
            'nexusv3',
            'nexus',
        ]
        self.added_files = {
            'consciousness': [],
            'dist': [],
            'sensors': []
        }
        
    def copy_consciousness_files(self):
        """Copy consciousness data files."""
        print("🧠 Adding consciousness files...")
        
        consciousness_files = [
            'enhancement-history.json',
            'breakthrough-moments.json',
            'pattern-evolution-engine.json',
            'problem-decomposition.json',
            'systems-thinking.json',
            'workflow-efficiency.json'
        ]
        
        dest_dir = self.nexus4_path / 'consciousness'
        copied = 0
        
        # Find and copy from priority source
        for filename in consciousness_files:
            found = False
            for source_folder in self.source_priority:
                source_path = self.root_path / source_folder / 'consciousness' / filename
                if source_path.exists():
                    dest = dest_dir / filename
                    try:
                        shutil.copy2(source_path, dest)
                        self.added_files['consciousness'].append({
                            'file': filename,
                            'source': str(source_path.relative_to(self.root_path)),
                            'size': source_path.stat().st_size
                        })
                        copied += 1
                        found = True
                        print(f"  ✅ {filename} from {source_folder}")
                        break
                    except Exception as e:
                        print(f"  ⚠️ Error copying {filename}: {e}")
            
            if not found:
                # Create empty template
                dest = dest_dir / filename
                if 'breakthrough' in filename:
                    template = {"moments": []}
                elif 'enhancement' in filename:
                    template = {"enhancements": [], "patterns": {}}
                else:
                    template = {}
                
                with open(dest, 'w') as f:
                    json.dump(template, f, indent=2)
                print(f"  📝 Created empty template: {filename}")
                copied += 1
        
        print(f"✅ Added {copied} consciousness files\n")
        
    def copy_dist_files(self):
        """Copy compiled dist files."""
        print("📦 Adding compiled dist files...")
        
        # Copy from most recent dist folder
        source_dist = self.root_path / 'nexus2/nexus2/runtime/dist'
        dest_dist = self.nexus4_path / 'dist'
        
        if not source_dist.exists():
            print("  ⚠️ Source dist not found, skipping...")
            return
        
        copied = 0
        skipped = 0
        
        # Copy all .js, .d.ts, .js.map files
        for file_path in source_dist.rglob('*'):
            if file_path.is_file():
                # Determine if we want this file
                if file_path.suffix in ['.js', '.map'] or file_path.name.endswith('.d.ts'):
                    # Preserve directory structure
                    rel_path = file_path.relative_to(source_dist)
                    dest_file = dest_dist / rel_path
                    
                    # Create parent directories
                    dest_file.parent.mkdir(parents=True, exist_ok=True)
                    
                    try:
                        shutil.copy2(file_path, dest_file)
                        self.added_files['dist'].append({
                            'file': str(rel_path),
                            'size': file_path.stat().st_size
                        })
                        copied += 1
                    except Exception as e:
                        skipped += 1
                        if skipped < 5:  # Only show first few errors
                            print(f"  ⚠️ Error copying {rel_path}: {e}")
        
        print(f"✅ Added {copied} compiled files to dist/")
        if skipped > 0:
            print(f"⚠️  Skipped {skipped} files due to errors\n")
        
    def copy_sensor_files(self):
        """Copy sensor files."""
        print("👂 Adding sensor files...")
        
        source_sensors = self.root_path / 'nexus2/nexus2/runtime/nexus/sensors'
        dest_sensors = self.nexus4_path / 'src' / 'sensors'
        
        if not source_sensors.exists():
            print("  ⚠️ No sensors found, creating directory...")
            dest_sensors.mkdir(parents=True, exist_ok=True)
            return
        
        dest_sensors.mkdir(parents=True, exist_ok=True)
        copied = 0
        
        for file_path in source_sensors.rglob('*'):
            if file_path.is_file():
                dest_file = dest_sensors / file_path.name
                try:
                    shutil.copy2(file_path, dest_file)
                    self.added_files['sensors'].append({
                        'file': file_path.name,
                        'source': str(file_path.relative_to(self.root_path)),
                        'size': file_path.stat().st_size
                    })
                    copied += 1
                    print(f"  ✅ {file_path.name}")
                except Exception as e:
                    print(f"  ⚠️ Error copying {file_path.name}: {e}")
        
        print(f"✅ Added {copied} sensor files\n")
        
    def create_readme_for_consciousness(self):
        """Create README explaining consciousness files."""
        readme_content = """# NEXUS Consciousness Data

This directory contains runtime data that NEXUS uses to track enhancements, breakthroughs, and learning patterns.

## Files

### `enhancement-history.json`
Records all enhancement requests and their strategic intelligence analysis.

Structure:
```json
{
  "enhancements": [
    {
      "timestamp": "2025-10-10T00:00:00Z",
      "personalityName": "pythonista",
      "request": "User request",
      "response": "Enhanced response",
      "patterns": ["pattern1", "pattern2"]
    }
  ]
}
```

### `breakthrough-moments.json`
Captures significant breakthrough moments during conversations.

Structure:
```json
{
  "moments": [
    {
      "type": "breakthrough",
      "timestamp": "2025-10-10T00:00:00Z",
      "trigger": "WAIT. WAIT. This is...",
      "conversation": {
        "human": ["message"],
        "ai": ["response"]
      },
      "significance": 0.8
    }
  ]
}
```

### Pattern Files
- `pattern-evolution-engine.json` - Pattern learning and evolution
- `problem-decomposition.json` - Problem-solving patterns
- `systems-thinking.json` - Systems thinking patterns
- `workflow-efficiency.json` - Workflow optimization patterns

## Usage

These files are automatically read and written by the NEXUS runtime:
- On startup, NEXUS loads existing patterns and history
- During operation, new enhancements are appended
- Breakthrough detection automatically logs significant moments
- Files are persisted every 10 seconds (configurable)

## Maintenance

- Files grow over time - consider archiving old entries periodically
- Default max entries: 500 for enhancements, 250 for breakthroughs
- Files are JSON - safe to manually edit if needed
- Backup recommended before major changes
"""
        
        readme_path = self.nexus4_path / 'consciousness' / 'README.md'
        with open(readme_path, 'w') as f:
            f.write(readme_content)
        print("📄 Created consciousness/README.md\n")
        
    def create_readme_for_sensors(self):
        """Create README explaining sensors."""
        readme_content = """# NEXUS Sensors

Sensors are modules that listen for and process external inputs to the NEXUS system.

## Current Sensors

### `conversation-hearing.mjs`
Listens to WebSocket conversations and detects breakthrough moments.

Features:
- Real-time conversation monitoring
- Breakthrough detection (triggers like "WAIT.", "This is incredible!")
- Automatic logging to consciousness/breakthrough-moments.json
- Background processing to avoid blocking main thread

## Creating New Sensors

Sensors should:
1. Export a class or function that can be initialized
2. Listen for specific events or data streams
3. Process inputs and trigger appropriate actions
4. Avoid blocking the main runtime thread
5. Handle errors gracefully

Example sensor structure:
```javascript
export class MySensor {
  constructor(runtime) {
    this.runtime = runtime;
  }
  
  async initialize() {
    // Setup listeners
  }
  
  async process(data) {
    // Handle incoming data
  }
}
```

## Integration

Sensors are loaded and initialized by the main runtime:
```javascript
import { ConversationHearing } from './sensors/conversation-hearing.mjs';

const sensor = new ConversationHearing(runtime);
await sensor.initialize();
```
"""
        
        sensors_dir = self.nexus4_path / 'src' / 'sensors'
        sensors_dir.mkdir(parents=True, exist_ok=True)
        readme_path = sensors_dir / 'README.md'
        with open(readme_path, 'w') as f:
            f.write(readme_content)
        print("📄 Created src/sensors/README.md\n")
        
    def update_manifest(self):
        """Update the main manifest with new additions."""
        print("📝 Updating manifest...")
        
        manifest_path = self.nexus4_path / 'NEXUS4_MANIFEST.json'
        
        try:
            with open(manifest_path, 'r') as f:
                manifest = json.load(f)
        except:
            manifest = {}
        
        # Add enhancement information
        manifest['enhancements'] = {
            'enhanced_at': datetime.now().isoformat(),
            'additions': {
                'consciousness_files': len(self.added_files['consciousness']),
                'dist_files': len(self.added_files['dist']),
                'sensor_files': len(self.added_files['sensors'])
            },
            'details': self.added_files
        }
        
        # Update statistics
        if 'statistics' not in manifest:
            manifest['statistics'] = {}
        
        manifest['statistics']['consciousness_files'] = len(self.added_files['consciousness'])
        manifest['statistics']['dist_files'] = len(self.added_files['dist'])
        manifest['statistics']['sensor_files'] = len(self.added_files['sensors'])
        
        with open(manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)
        
        print("✅ Manifest updated\n")
        
    def enhance(self):
        """Execute the enhancement process."""
        print("🚀 Enhancing NEXUS-4...")
        print("="*60)
        
        # Add missing components
        self.copy_consciousness_files()
        self.copy_dist_files()
        self.copy_sensor_files()
        
        # Create documentation
        self.create_readme_for_consciousness()
        self.create_readme_for_sensors()
        
        # Update manifest
        self.update_manifest()
        
        # Summary
        print("="*60)
        print("✅ NEXUS-4 Enhancement Complete!")
        print("="*60)
        print(f"🧠 Consciousness: {len(self.added_files['consciousness'])} files")
        print(f"📦 Dist: {len(self.added_files['dist'])} files")
        print(f"👂 Sensors: {len(self.added_files['sensors'])} files")
        print("="*60)
        

def main():
    root_path = "/workspaces/data-folder"
    
    enhancer = Nexus4Enhancer(root_path)
    enhancer.enhance()
    
    print("\n✨ Nexus-4 is now complete with:")
    print("  - Consciousness data files")
    print("  - Compiled dist/ output")
    print("  - Sensor modules")
    print("  - Complete documentation")


if __name__ == "__main__":
    main()
