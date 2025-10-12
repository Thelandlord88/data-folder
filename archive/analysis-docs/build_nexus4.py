#!/usr/bin/env python3
"""
NEXUS-4 Builder
Creates a clean, consolidated NEXUS-4 folder based on analysis
"""

import os
import json
import shutil
from pathlib import Path
from datetime import datetime
from collections import defaultdict

class Nexus4Builder:
    def __init__(self, source_root: str, analysis_file: str):
        self.source_root = Path(source_root)
        self.nexus4_path = self.source_root / "Nexus-4"
        
        # Load analysis
        with open(analysis_file, 'r') as f:
            self.analysis = json.load(f)
        
        self.decisions = {
            'kept': [],
            'skipped': [],
            'consolidated': []
        }
        
    def create_structure(self):
        """Create Nexus-4 folder structure."""
        print("📁 Creating Nexus-4 structure...")
        
        folders = [
            'src',           # TypeScript sources
            'dist',          # Compiled JavaScript
            'profiles',      # Personality profiles
            'docs',          # Documentation
            'tests',         # Test files
            'config',        # Configuration files
            'consciousness', # Runtime data
        ]
        
        for folder in folders:
            (self.nexus4_path / folder).mkdir(parents=True, exist_ok=True)
        
        print(f"✅ Created structure at: {self.nexus4_path}")
    
    def select_best_version(self):
        """Select best version of each file based on analysis."""
        print("\n🔍 Selecting best versions...")
        
        # Priority order for source folders
        folder_priority = [
            'nexus2/nexus2/runtime/nexus',  # Most recent working version
            'nexusv3/src',                   # V3 sources
            'nexus/src',                     # Original sources
        ]
        
        selected_files = {}
        
        # Process TypeScript sources
        for ts_file in self.analysis['files_by_type'].get('typescript-source', []):
            path = Path(ts_file['path'])
            filename = path.name
            
            # Determine priority
            priority = 999
            for i, folder in enumerate(folder_priority):
                if folder in str(path):
                    priority = i
                    break
            
            # Keep highest priority version
            if filename not in selected_files or priority < selected_files[filename]['priority']:
                selected_files[filename] = {
                    'path': str(path),
                    'priority': priority,
                    'lines': ts_file.get('lines', 0),
                    'type': 'typescript-source'
                }
        
        # Process JavaScript modules (.mjs)
        for js_file in self.analysis['files_by_type'].get('javascript-module', []):
            path = Path(js_file['path'])
            filename = path.name
            
            # Check if TypeScript version exists
            ts_name = filename.replace('.mjs', '.ts')
            if ts_name in selected_files:
                # Skip .mjs if .ts exists
                self.decisions['skipped'].append({
                    'file': str(path),
                    'reason': f'TypeScript version exists: {selected_files[ts_name]["path"]}'
                })
                continue
            
            # Keep .mjs if no .ts exists
            if filename not in selected_files:
                priority = 999
                for i, folder in enumerate(folder_priority):
                    if folder in str(path):
                        priority = i
                        break
                
                selected_files[filename] = {
                    'path': str(path),
                    'priority': priority,
                    'lines': js_file.get('lines', 0),
                    'type': 'javascript-module'
                }
        
        print(f"✅ Selected {len(selected_files)} unique files")
        return selected_files
    
    def copy_profiles(self):
        """Copy personality profiles (keep all, deduplicate)."""
        print("\n🎭 Copying personality profiles...")
        
        profile_hashes = {}
        copied_count = 0
        
        for data_file in self.analysis['files_by_type'].get('data', []):
            path = Path(data_file['path'])
            
            # Only copy from profiles directories
            if 'profiles' in path.parts and path.suffix == '.json':
                file_hash = data_file.get('hash')
                
                if file_hash and file_hash in profile_hashes:
                    # Skip duplicate
                    self.decisions['skipped'].append({
                        'file': str(path),
                        'reason': f'Duplicate of {profile_hashes[file_hash]}'
                    })
                    continue
                
                # Copy file
                dest = self.nexus4_path / 'profiles' / path.name
                source = self.source_root / path
                
                try:
                    shutil.copy2(source, dest)
                    if file_hash:
                        profile_hashes[file_hash] = str(path)
                    copied_count += 1
                except Exception as e:
                    print(f"⚠️  Error copying {path}: {e}")
        
        print(f"✅ Copied {copied_count} unique profiles")
    
    def copy_documentation(self):
        """Copy documentation files."""
        print("\n📄 Copying documentation...")
        
        doc_hashes = {}
        copied_count = 0
        
        important_docs = [
            'README.md',
            'INSTALL.md',
            'MANIFEST.md',
            'NEXUS_V3_MIGRATION_COMPLETE.md'
        ]
        
        for doc_file in self.analysis['files_by_type'].get('documentation', []):
            path = Path(doc_file['path'])
            
            # Copy important docs from top-level or first-level folders
            if path.name in important_docs and len(path.parts) <= 2:
                dest = self.nexus4_path / 'docs' / path.name
                source = self.source_root / path
                
                file_hash = doc_file.get('hash')
                if file_hash and file_hash in doc_hashes:
                    continue
                
                try:
                    shutil.copy2(source, dest)
                    if file_hash:
                        doc_hashes[file_hash] = str(path)
                    copied_count += 1
                except Exception as e:
                    print(f"⚠️  Error copying {path}: {e}")
        
        print(f"✅ Copied {copied_count} documentation files")
    
    def copy_config_files(self):
        """Copy configuration files."""
        print("\n⚙️  Copying configuration files...")
        
        config_copied = 0
        
        for config_file in self.analysis['files_by_type'].get('config', []):
            path = Path(config_file['path'])
            
            # Copy from most recent location
            if 'nexus2/nexus2/runtime/nexus' in str(path):
                dest = self.nexus4_path / 'config' / path.name
                source = self.source_root / path
                
                try:
                    shutil.copy2(source, dest)
                    config_copied += 1
                except Exception as e:
                    print(f"⚠️  Error copying {path}: {e}")
        
        print(f"✅ Copied {config_copied} configuration files")
    
    def copy_selected_sources(self, selected_files: dict):
        """Copy selected source files to Nexus-4."""
        print("\n📦 Copying source files...")
        
        copied_count = 0
        
        for filename, info in selected_files.items():
            source = self.source_root / info['path']
            
            # Determine destination based on file type
            if info['type'] == 'typescript-source':
                # Preserve directory structure for special directories
                source_path = Path(info['path'])
                
                if 'response-generators' in source_path.parts:
                    dest_dir = self.nexus4_path / 'src' / 'response-generators'
                    dest_dir.mkdir(parents=True, exist_ok=True)
                    dest = dest_dir / filename
                elif 'loaders' in source_path.parts:
                    dest_dir = self.nexus4_path / 'src' / 'loaders'
                    dest_dir.mkdir(parents=True, exist_ok=True)
                    dest = dest_dir / filename
                elif 'validation' in source_path.parts:
                    dest_dir = self.nexus4_path / 'src' / 'validation'
                    dest_dir.mkdir(parents=True, exist_ok=True)
                    dest = dest_dir / filename
                elif 'types' in source_path.parts:
                    dest_dir = self.nexus4_path / 'src' / 'types'
                    dest_dir.mkdir(parents=True, exist_ok=True)
                    dest = dest_dir / filename
                else:
                    dest = self.nexus4_path / 'src' / filename
            else:
                dest = self.nexus4_path / 'src' / filename
            
            try:
                if source.exists():
                    shutil.copy2(source, dest)
                    copied_count += 1
                    self.decisions['kept'].append({
                        'file': filename,
                        'source': info['path'],
                        'lines': info['lines']
                    })
            except Exception as e:
                print(f"⚠️  Error copying {filename}: {e}")
        
        print(f"✅ Copied {copied_count} source files")
    
    def create_manifest(self):
        """Create manifest file documenting what was included."""
        print("\n📝 Creating manifest...")
        
        manifest = {
            'created': datetime.now().isoformat(),
            'source_analysis': os.path.basename(self.analysis.get('scan_time', '')),
            'statistics': {
                'files_kept': len(self.decisions['kept']),
                'files_skipped': len(self.decisions['skipped']),
                'profiles': len(list((self.nexus4_path / 'profiles').glob('*.json'))),
                'docs': len(list((self.nexus4_path / 'docs').glob('*.md'))),
                'source_files': len(list((self.nexus4_path / 'src').rglob('*'))),
            },
            'decisions': self.decisions,
            'structure': {
                'src': 'TypeScript source files (best versions)',
                'dist': 'Compiled JavaScript outputs',
                'profiles': 'Personality profiles (deduplicated)',
                'docs': 'Key documentation files',
                'config': 'Configuration files',
                'consciousness': 'Runtime data storage',
                'tests': 'Test files'
            }
        }
        
        manifest_path = self.nexus4_path / 'NEXUS4_MANIFEST.json'
        with open(manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)
        
        # Also create human-readable README
        readme_content = f"""# NEXUS-4 - Consolidated NEXUS Runtime

Created: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Overview

This is a clean, consolidated version of NEXUS created by analyzing all previous versions
and selecting the best files based on:
- Code completeness (line count)
- Modification date (newer preferred)
- Source quality (TypeScript over JavaScript where available)
- Duplicate removal

## Statistics

- **Source Files**: {manifest['statistics']['source_files']}
- **Profiles**: {manifest['statistics']['profiles']}
- **Documentation**: {manifest['statistics']['docs']}
- **Files Kept**: {manifest['statistics']['files_kept']}
- **Duplicates Removed**: {manifest['statistics']['files_skipped']}

## Structure

```
Nexus-4/
├── src/              # TypeScript source files
│   ├── response-generators/
│   ├── loaders/
│   ├── validation/
│   └── types/
├── dist/             # Compiled JavaScript (to be generated)
├── profiles/         # Personality profiles
├── docs/             # Documentation
├── config/           # Configuration files
├── consciousness/    # Runtime data storage
└── tests/            # Test files
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Compile TypeScript:
   ```bash
   npm run build
   ```

3. Run runtime:
   ```bash
   node dist/nexus-runtime.js
   ```

## Version Selection

Files were selected from these sources in priority order:
1. `nexus2/nexus2/runtime/nexus/` - Most recent working version
2. `nexusv3/src/` - V3 sources
3. `nexus/src/` - Original sources

See `NEXUS4_MANIFEST.json` for complete file selection decisions.
"""
        
        readme_path = self.nexus4_path / 'README.md'
        with open(readme_path, 'w') as f:
            f.write(readme_content)
        
        print(f"✅ Created manifest and README")
    
    def build(self):
        """Execute the build process."""
        print("🚀 Building NEXUS-4...")
        print("="*60)
        
        # Create structure
        self.create_structure()
        
        # Select best versions
        selected_files = self.select_best_version()
        
        # Copy files
        self.copy_selected_sources(selected_files)
        self.copy_profiles()
        self.copy_documentation()
        self.copy_config_files()
        
        # Create manifest
        self.create_manifest()
        
        # Summary
        print("\n" + "="*60)
        print("✅ NEXUS-4 Build Complete!")
        print("="*60)
        print(f"📁 Location: {self.nexus4_path}")
        print(f"📦 Files kept: {len(self.decisions['kept'])}")
        print(f"🗑️  Files skipped: {len(self.decisions['skipped'])}")
        print(f"📄 See NEXUS4_MANIFEST.json for details")
        print("="*60)


def main():
    source_root = "/workspaces/data-folder"
    
    # Find latest analysis file
    analysis_files = list(Path(source_root).glob("NEXUS_REPO_ANALYSIS_*.json"))
    if not analysis_files:
        print("❌ No analysis file found! Run analyze_nexus_repo.py first.")
        return
    
    latest_analysis = max(analysis_files, key=lambda p: p.stat().st_mtime)
    print(f"📊 Using analysis: {latest_analysis.name}\n")
    
    # Build Nexus-4
    builder = Nexus4Builder(source_root, str(latest_analysis))
    builder.build()


if __name__ == "__main__":
    main()
