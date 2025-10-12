#!/usr/bin/env python3
"""
NEXUS-4 Enhancer v2.0
Robust enhancement with validation, backups, and smart file handling
"""

import os
import json
import shutil
import argparse
import hashlib
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional
import logging

class Nexus4Enhancer:
    def __init__(self, root_path: str, backup: bool = True, dry_run: bool = False):
        self.root_path = Path(root_path).resolve()
        self.backup = backup
        self.dry_run = dry_run
        
        # Validate root path exists
        if not self.root_path.exists():
            raise ValueError(f"Root path does not exist: {self.root_path}")
            
        self.nexus4_path = self.root_path / "Nexus-4"
        if not self.nexus4_path.exists():
            raise ValueError(f"Nexus-4 directory not found: {self.nexus4_path}")
        
        self.added_files = {
            'consciousness': [],
            'dist': [], 
            'sensors': [],
            'backups': []
        }
        
        # Setup logging FIRST
        self._setup_logging()
        
        # Now discover source folders (needs logging)
        self.source_priority = self._discover_source_folders()
        
    def _setup_logging(self):
        """Setup structured logging"""
        log_dir = self.nexus4_path / "logs"
        log_dir.mkdir(exist_ok=True)
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_dir / f"enhancement_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"),
                logging.StreamHandler()
            ]
        )
        self.log = logging.getLogger(__name__)
        
    def _discover_source_folders(self) -> List[Path]:
        """Dynamically discover available source folders"""
        potential_sources = [
            self.root_path / 'nexus2' / 'nexus2' / 'runtime' / 'nexus',
            self.root_path / 'nexus2' / 'nexus2' / 'runtime' / 'dist', 
            self.root_path / 'nexusv3',
            self.root_path / 'nexus',
            self.root_path / 'Nexus-3',
            self.root_path / 'nexus-core'
        ]
        
        discovered = [p for p in potential_sources if p.exists()]
        self.log.info(f"Discovered {len(discovered)} source folders")
        return discovered
    
    def _calculate_file_hash(self, file_path: Path) -> str:
        """Calculate MD5 hash of file for comparison"""
        if not file_path.exists():
            return ""
        hasher = hashlib.md5()
        with open(file_path, 'rb') as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hasher.update(chunk)
        return hasher.hexdigest()
    
    def _backup_file(self, file_path: Path) -> bool:
        """Backup existing file before overwriting"""
        if not file_path.exists() or not self.backup:
            return True
            
        backup_path = file_path.with_suffix(file_path.suffix + f".backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}")
        try:
            if not self.dry_run:
                shutil.copy2(file_path, backup_path)
            self.added_files['backups'].append({
                'original': str(file_path.relative_to(self.nexus4_path)),
                'backup': str(backup_path.name),
                'timestamp': datetime.now().isoformat()
            })
            self.log.info(f"  💾 Backed up {file_path.name} -> {backup_path.name}")
            return True
        except Exception as e:
            self.log.error(f"  ❌ Backup failed for {file_path}: {e}")
            return False
    
    def _smart_copy_file(self, source: Path, dest: Path, description: str = "file") -> bool:
        """Copy file with smart comparison and backup"""
        if not source.exists():
            self.log.error(f"  ❌ Source {description} not found: {source}")
            return False
            
        # Check if destination exists and is identical
        if dest.exists():
            source_hash = self._calculate_file_hash(source)
            dest_hash = self._calculate_file_hash(dest)
            
            if source_hash == dest_hash:
                self.log.info(f"  ⏭️  Skipped {dest.name} (identical)")
                return True
                
            # Backup existing file
            if not self._backup_file(dest):
                return False
        
        # Create parent directories
        dest.parent.mkdir(parents=True, exist_ok=True)
        
        try:
            if not self.dry_run:
                shutil.copy2(source, dest)
            
            self.log.info(f"  ✅ Copied {description}: {dest.name}")
            return True
        except Exception as e:
            self.log.error(f"  ❌ Failed to copy {description} {source.name}: {e}")
            return False
    
    def _find_best_source_file(self, filename: str, subfolder: str = "") -> Optional[Path]:
        """Find the best source file across priority folders"""
        for source_folder in self.source_priority:
            if subfolder:
                source_path = source_folder / subfolder / filename
            else:
                source_path = source_folder / filename
                
            if source_path.exists():
                return source_path
        return None
    
    def copy_consciousness_files(self):
        """Copy consciousness data files with validation"""
        self.log.info("🧠 Adding consciousness files...")
        
        consciousness_files = [
            'enhancement-history.json',
            'breakthrough-moments.json', 
            'pattern-evolution-engine.json',
            'problem-decomposition.json',
            'systems-thinking.json',
            'workflow-efficiency.json'
        ]
        
        dest_dir = self.nexus4_path / 'consciousness'
        dest_dir.mkdir(exist_ok=True)
        
        copied = 0
        for filename in consciousness_files:
            source_path = self._find_best_source_file(filename, 'consciousness')
            
            if source_path:
                dest_path = dest_dir / filename
                if self._smart_copy_file(source_path, dest_path, "consciousness"):
                    self.added_files['consciousness'].append({
                        'file': filename,
                        'source': str(source_path.relative_to(self.root_path)),
                        'size': source_path.stat().st_size,
                        'hash': self._calculate_file_hash(source_path)
                    })
                    copied += 1
            else:
                # Create intelligent template based on file type
                self._create_consciousness_template(dest_dir / filename, filename)
                copied += 1
        
        self.log.info(f"✅ Added {copied} consciousness files\n")
        
    def _create_consciousness_template(self, dest_path: Path, filename: str):
        """Create intelligent consciousness file templates"""
        templates = {
            'enhancement-history.json': {
                "metadata": {
                    "created": datetime.now().isoformat(),
                    "version": "2.0",
                    "description": "NEXUS enhancement history and pattern evolution"
                },
                "enhancements": [],
                "patterns": {},
                "statistics": {
                    "total_enhancements": 0,
                    "last_enhancement": None,
                    "personality_usage": {}
                }
            },
            'breakthrough-moments.json': {
                "metadata": {
                    "created": datetime.now().isoformat(), 
                    "version": "2.0",
                    "description": "Breakthrough moments and cognitive leaps"
                },
                "moments": [],
                "triggers": ["WAIT. WAIT.", "breakthrough", "insight", "discovery"],
                "statistics": {
                    "total_breakthroughs": 0,
                    "last_breakthrough": None,
                    "average_significance": 0
                }
            },
            'pattern-evolution-engine.json': {
                "metadata": {
                    "created": datetime.now().isoformat(),
                    "version": "2.0", 
                    "description": "Pattern learning and cognitive evolution"
                },
                "learned_patterns": {},
                "evolution_timeline": [],
                "performance_metrics": {
                    "pattern_accuracy": 0,
                    "learning_rate": 0,
                    "adaptation_speed": 0
                }
            }
        }
        
        template = templates.get(filename, {
            "metadata": {
                "created": datetime.now().isoformat(),
                "version": "2.0",
                "description": f"NEXUS consciousness data: {filename}"
            },
            "data": []
        })
        
        if not self.dry_run:
            with open(dest_path, 'w') as f:
                json.dump(template, f, indent=2, ensure_ascii=False)
        
        self.log.info(f"  📝 Created template: {filename}")
        self.added_files['consciousness'].append({
            'file': filename,
            'source': 'template',
            'size': len(json.dumps(template)),
            'template': True
        })
    
    def copy_dist_files(self):
        """Copy compiled dist files with structure preservation"""
        self.log.info("📦 Adding compiled dist files...")
        
        # Find best dist source
        dist_sources = [
            self.root_path / 'nexus2' / 'nexus2' / 'runtime' / 'dist',
            self.root_path / 'nexusv3' / 'dist',
            self.root_path / 'nexus' / 'dist'
        ]
        
        source_dist = None
        for dist_source in dist_sources:
            if dist_source.exists():
                source_dist = dist_source
                self.log.info(f"  📁 Using dist source: {dist_source.relative_to(self.root_path)}")
                break
        
        if not source_dist:
            self.log.warning("⚠️  No dist source found, skipping...\n")
            return
        
        dest_dist = self.nexus4_path / 'dist'
        dest_dist.mkdir(exist_ok=True)
        
        copied = 0
        skipped = 0
        identical = 0
        
        for file_path in source_dist.rglob('*'):
            if file_path.is_file() and file_path.suffix in ['.js', '.map', '.ts'] or file_path.name.endswith('.d.ts'):
                rel_path = file_path.relative_to(source_dist)
                dest_file = dest_dist / rel_path
                
                # Check if already exists and identical
                if dest_file.exists():
                    if self._calculate_file_hash(file_path) == self._calculate_file_hash(dest_file):
                        identical += 1
                        continue
                
                if self._smart_copy_file(file_path, dest_file, "dist file"):
                    self.added_files['dist'].append({
                        'file': str(rel_path),
                        'size': file_path.stat().st_size,
                        'type': file_path.suffix
                    })
                    copied += 1
                else:
                    skipped += 1
        
        self.log.info(f"✅ Added {copied} dist files (identical: {identical}, skipped: {skipped})\n")
    
    def copy_sensor_files(self):
        """Copy sensor files with module validation"""
        self.log.info("👂 Adding sensor files...")
        
        dest_sensors = self.nexus4_path / 'src' / 'sensors'
        dest_sensors.mkdir(parents=True, exist_ok=True)
        
        # Look for sensors in various locations
        sensor_sources = []
        for source_folder in self.source_priority:
            sensor_path = source_folder / 'sensors'
            if sensor_path.exists():
                sensor_sources.append(sensor_path)
                self.log.info(f"  📁 Found sensors in: {sensor_path.relative_to(self.root_path)}")
        
        if not sensor_sources:
            self.log.warning("⚠️  No sensor sources found\n")
            return
        
        copied = 0
        for sensor_source in sensor_sources:
            for file_path in sensor_source.rglob('*'):
                if file_path.is_file() and file_path.suffix in ['.mjs', '.js', '.ts']:
                    dest_file = dest_sensors / file_path.name
                    
                    if self._smart_copy_file(file_path, dest_file, "sensor"):
                        self.added_files['sensors'].append({
                            'file': file_path.name,
                            'source': str(file_path.relative_to(self.root_path)),
                            'size': file_path.stat().st_size,
                            'type': file_path.suffix
                        })
                        copied += 1
        
        self.log.info(f"✅ Added {copied} sensor files\n")
    
    def create_config_file(self):
        """Create enhancement configuration file"""
        config = {
            "enhancement": {
                "timestamp": datetime.now().isoformat(),
                "version": "2.0",
                "backup_enabled": self.backup,
                "dry_run": self.dry_run
            },
            "sources": [str(p.relative_to(self.root_path)) for p in self.source_priority],
            "settings": {
                "backup": True,
                "validate_json": True,
                "create_templates": True,
                "preserve_structure": True
            }
        }
        
        config_path = self.nexus4_path / "enhancement_config.json"
        if not self.dry_run:
            with open(config_path, 'w') as f:
                json.dump(config, f, indent=2)
        
        self.log.info("⚙️  Created enhancement configuration\n")
    
    def enhance(self):
        """Execute the complete enhancement process"""
        self.log.info("🚀 Starting NEXUS-4 Enhancement v2.0")
        self.log.info("=" * 60)
        
        if self.dry_run:
            self.log.info("🔍 DRY RUN MODE - No changes will be made\n")
        
        # Create configuration
        self.create_config_file()
        
        # Execute enhancements
        self.copy_consciousness_files()
        self.copy_dist_files() 
        self.copy_sensor_files()
        
        # Update manifest
        self.update_manifest()
        
        # Final summary
        self._print_summary()
    
    def update_manifest(self):
        """Update the main manifest with enhancement details"""
        self.log.info("📝 Updating manifest...")
        manifest_path = self.nexus4_path / 'NEXUS4_MANIFEST.json'
        
        try:
            with open(manifest_path, 'r') as f:
                manifest = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            manifest = {}
        
        # Add enhancement section
        enhancement_data = {
            'enhanced_at': datetime.now().isoformat(),
            'enhancement_version': '2.0',
            'backup_created': self.backup and len(self.added_files['backups']) > 0,
            'dry_run': self.dry_run,
            'additions': {
                'consciousness_files': len(self.added_files['consciousness']),
                'dist_files': len(self.added_files['dist']),
                'sensor_files': len(self.added_files['sensors']),
                'backups_created': len(self.added_files['backups'])
            },
            'file_details': self.added_files,
            'source_folders': [str(p.relative_to(self.root_path)) for p in self.source_priority]
        }
        
        manifest['enhancements'] = enhancement_data
        
        # Update statistics
        if 'statistics' not in manifest:
            manifest['statistics'] = {}
        
        manifest['statistics'].update({
            'consciousness_files': len(self.added_files['consciousness']),
            'dist_files': len(self.added_files['dist']),
            'sensor_files': len(self.added_files['sensors']),
            'last_enhancement': datetime.now().isoformat()
        })
        
        if not self.dry_run:
            with open(manifest_path, 'w') as f:
                json.dump(manifest, f, indent=2)
        
        self.log.info("✅ Manifest updated\n")
    
    def _print_summary(self):
        """Print enhancement summary"""
        self.log.info("=" * 60)
        self.log.info("✅ NEXUS-4 Enhancement Complete!")
        self.log.info("=" * 60)
        
        total_files = (len(self.added_files['consciousness']) + 
                      len(self.added_files['dist']) + 
                      len(self.added_files['sensors']))
        
        self.log.info(f"📊 Enhancement Summary:")
        self.log.info(f"  🧠 Consciousness: {len(self.added_files['consciousness'])} files")
        self.log.info(f"  📦 Dist: {len(self.added_files['dist'])} files") 
        self.log.info(f"  👂 Sensors: {len(self.added_files['sensors'])} files")
        self.log.info(f"  💾 Backups: {len(self.added_files['backups'])} files")
        self.log.info(f"  📁 Total: {total_files} files processed")
        
        if self.dry_run:
            self.log.info("  🔍 DRY RUN - No actual changes made")
        
        self.log.info("=" * 60)

def main():
    parser = argparse.ArgumentParser(
        description="Enhance Nexus-4 with missing components",
        epilog="Example: python enhance_nexus4_v2.py --root-path /path/to/data --dry-run"
    )
    parser.add_argument("--root-path", default="/workspaces/data-folder", 
                       help="Root directory containing Nexus projects (default: /workspaces/data-folder)")
    parser.add_argument("--no-backup", action="store_true", 
                       help="Disable backup of existing files before overwriting")
    parser.add_argument("--dry-run", action="store_true",
                       help="Show what would be done without making any actual changes")
    parser.add_argument("--log-level", choices=['DEBUG', 'INFO', 'WARNING', 'ERROR'],
                       default='INFO', help="Set logging verbosity level (default: INFO)")
    
    args = parser.parse_args()
    
    # Set logging level
    logging.getLogger().setLevel(getattr(logging, args.log_level))
    
    try:
        enhancer = Nexus4Enhancer(
            root_path=args.root_path,
            backup=not args.no_backup,
            dry_run=args.dry_run
        )
        enhancer.enhance()
        
        return 0
        
    except Exception as e:
        logging.error(f"❌ Enhancement failed: {e}", exc_info=True)
        return 1

if __name__ == "__main__":
    exit(main())
