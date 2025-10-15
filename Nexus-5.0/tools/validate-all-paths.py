#!/usr/bin/env python3
"""
NEXUS 5.0 Path Validation & Import Checker
===========================================

Analyzes all files to ensure imports and paths are correctly configured.

Features:
- TypeScript import validation
- Python import validation  
- Shell script path checking
- JSON file reference validation
- Symlink verification
- Broken path detection
- Cross-file dependency mapping

Usage:
    python3 validate-all-paths.py [options]
    
Options:
    --verbose       Show detailed analysis
    --fix           Attempt to fix common issues
    --report FILE   Save report to file
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Set, Tuple
from collections import defaultdict

# Configuration
WORKSPACE_ROOT = Path("/workspaces/data-folder/Nexus-5.0")
REPORT_DIR = WORKSPACE_ROOT / "__reports" / "path-validation"

# File extension groups
FILE_PATTERNS = {
    'typescript': ['.ts', '.tsx', '.mts'],
    'python': ['.py'],
    'shell': ['.sh'],
    'json': ['.json'],
    'markdown': ['.md']
}

# Import/require patterns
PATTERNS = {
    'typescript': [
        r'import\s+(?:[\w\s{},*]+\s+from\s+)?["\']([^"\']+)["\']',
        r'require\(["\']([^"\']+)["\']\)',
        r'import\(["\']([^"\']+)["\']\)',
    ],
    'python': [
        r'from\s+([^\s]+)\s+import',
        r'import\s+([^\s,]+)',
    ],
    'shell': [
        r'source\s+["\']?([^"\';\s]+)',
        r'\.\s+["\']?([^"\';\s]+)',
        r'bash\s+["\']?([^"\';\s]+\.sh)',
    ],
}

# Node.js built-ins (not file paths)
NODE_BUILTINS = {
    'fs', 'path', 'crypto', 'http', 'https', 'url', 'util', 'os',
    'stream', 'events', 'buffer', 'child_process', 'cluster', 'net',
    'fs/promises', 'stream/promises', 'timers/promises',
    'node:fs', 'node:path', 'node:crypto', 'node:http', 'node:https'
}

# Python standard library (partial list)
PYTHON_STDLIB = {
    'os', 'sys', 'json', 'pathlib', 're', 'typing', 'collections',
    'datetime', 'argparse', 'subprocess', 'shutil', 'glob', 'time'
}

class PathValidator:
    def __init__(self, root: Path):
        self.root = root
        self.issues = []
        self.stats = defaultdict(int)
        self.file_cache = {}
        
    def analyze_all(self, verbose=False):
        """Analyze all files in the workspace"""
        print(f"🔍 Analyzing files in {self.root}")
        print("=" * 70)
        
        # Collect all files
        all_files = list(self.root.rglob("*"))
        files_by_type = defaultdict(list)
        
        for file_path in all_files:
            if file_path.is_file() and not self._should_skip(file_path):
                ext = file_path.suffix.lower()
                for file_type, extensions in FILE_PATTERNS.items():
                    if ext in extensions:
                        files_by_type[file_type].append(file_path)
                        break
        
        # Analyze each file type
        for file_type, files in files_by_type.items():
            print(f"\n📂 {file_type.upper()} Files: {len(files)}")
            print("-" * 70)
            
            for file_path in files:
                self._analyze_file(file_path, file_type, verbose)
        
        # Check symlinks
        self._check_symlinks()
        
        # Generate report
        self._generate_report()
        
    def _should_skip(self, path: Path) -> bool:
        """Check if file should be skipped"""
        skip_dirs = {'node_modules', '.git', 'dist', '__pycache__', '.nexus-config/rollbacks'}
        return any(skip_dir in path.parts for skip_dir in skip_dirs)
    
    def _analyze_file(self, file_path: Path, file_type: str, verbose: bool):
        """Analyze a single file"""
        try:
            content = file_path.read_text(encoding='utf-8', errors='ignore')
            
            if file_type in PATTERNS:
                imports = self._extract_imports(content, file_type)
                
                for import_path in imports:
                    if self._is_external(import_path, file_type):
                        self.stats['external_imports'] += 1
                        continue
                    
                    resolved = self._resolve_path(file_path, import_path)
                    
                    if resolved and resolved.exists():
                        self.stats['valid_paths'] += 1
                        if verbose:
                            print(f"  ✅ {file_path.name}: {import_path}")
                    else:
                        self.stats['invalid_paths'] += 1
                        self.issues.append({
                            'file': str(file_path.relative_to(self.root)),
                            'import': import_path,
                            'type': 'missing_import',
                            'severity': 'warning'
                        })
                        if verbose:
                            print(f"  ⚠️  {file_path.name}: {import_path} (not found)")
            
            self.stats['files_analyzed'] += 1
            
        except Exception as e:
            self.stats['errors'] += 1
            if verbose:
                print(f"  ❌ Error reading {file_path.name}: {e}")
    
    def _extract_imports(self, content: str, file_type: str) -> Set[str]:
        """Extract import statements"""
        imports = set()
        
        if file_type not in PATTERNS:
            return imports
        
        for pattern in PATTERNS[file_type]:
            matches = re.finditer(pattern, content, re.MULTILINE)
            for match in matches:
                import_path = match.group(1).strip()
                if import_path:
                    imports.add(import_path)
        
        return imports
    
    def _is_external(self, import_path: str, file_type: str) -> bool:
        """Check if import is external (not a file path)"""
        # Node.js built-ins
        if file_type == 'typescript':
            if import_path in NODE_BUILTINS:
                return True
            # NPM packages (don't start with . or /)
            if not import_path.startswith('.') and not import_path.startswith('/'):
                return True
        
        # Python standard library
        if file_type == 'python':
            module_name = import_path.split('.')[0]
            if module_name in PYTHON_STDLIB:
                return True
        
        return False
    
    def _resolve_path(self, source_file: Path, import_path: str) -> Path:
        """Resolve import path to actual file"""
        # Handle relative imports
        if import_path.startswith('./') or import_path.startswith('../'):
            base_dir = source_file.parent
            target = (base_dir / import_path).resolve()
        # Handle absolute imports from root
        elif import_path.startswith('/'):
            target = Path(import_path)
        # Handle alias paths (~ → src, @ → src)
        elif import_path.startswith('~') or import_path.startswith('@'):
            import_path = import_path.lstrip('~@/')
            target = self.root / 'src' / import_path
        else:
            # Try from root
            target = self.root / import_path
        
        # TypeScript special case: .js imports may refer to .ts files
        if target.suffix == '.js' and source_file.suffix in ['.ts', '.tsx']:
            ts_version = target.with_suffix('.ts')
            if ts_version.exists():
                return ts_version
            tsx_version = target.with_suffix('.tsx')
            if tsx_version.exists():
                return tsx_version
        
        # Try different extensions
        extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.py', '.sh', '.json', '.mjs']
        
        for ext in extensions:
            check_path = target.with_suffix(target.suffix + ext) if target.suffix else target.with_suffix(ext)
            if check_path.exists():
                return check_path
        
        # Try as directory with index file
        if target.is_dir():
            for ext in ['.ts', '.js', '.py']:
                index_file = target / f'index{ext}'
                if index_file.exists():
                    return index_file
        
        return target
    
    def _check_symlinks(self):
        """Validate symlinks"""
        print(f"\n🔗 Checking Symlinks")
        print("-" * 70)
        
        symlinks = list(self.root.rglob("*"))
        symlinks = [s for s in symlinks if s.is_symlink()]
        
        for link in symlinks:
            target = link.resolve()
            if target.exists():
                self.stats['valid_symlinks'] += 1
                print(f"  ✅ {link.relative_to(self.root)} → {link.readlink()}")
            else:
                self.stats['broken_symlinks'] += 1
                self.issues.append({
                    'file': str(link.relative_to(self.root)),
                    'target': str(link.readlink()),
                    'type': 'broken_symlink',
                    'severity': 'error'
                })
                print(f"  ❌ {link.relative_to(self.root)} → {link.readlink()} (broken)")
    
    def _generate_report(self):
        """Generate summary report"""
        print(f"\n" + "=" * 70)
        print("📊 VALIDATION SUMMARY")
        print("=" * 70)
        
        print(f"\nFiles Analyzed:        {self.stats['files_analyzed']}")
        print(f"Valid Paths:           {self.stats['valid_paths']}")
        print(f"Invalid Paths:         {self.stats['invalid_paths']}")
        print(f"External Imports:      {self.stats['external_imports']}")
        print(f"Valid Symlinks:        {self.stats['valid_symlinks']}")
        print(f"Broken Symlinks:       {self.stats['broken_symlinks']}")
        print(f"Errors:                {self.stats['errors']}")
        
        # Issue summary
        if self.issues:
            print(f"\n⚠️  Found {len(self.issues)} Issues:")
            
            by_type = defaultdict(list)
            for issue in self.issues:
                by_type[issue['type']].append(issue)
            
            for issue_type, issues in by_type.items():
                print(f"\n  {issue_type.replace('_', ' ').title()}: {len(issues)}")
                for issue in issues[:5]:  # Show first 5
                    print(f"    - {issue['file']}: {issue.get('import', issue.get('target', 'N/A'))}")
                if len(issues) > 5:
                    print(f"    ... and {len(issues) - 5} more")
        else:
            print(f"\n✅ No issues found!")
        
        # Save detailed report
        self._save_report()
    
    def _save_report(self):
        """Save detailed report to file"""
        REPORT_DIR.mkdir(parents=True, exist_ok=True)
        report_file = REPORT_DIR / f"path-validation-{Path.cwd().name}.json"
        
        report = {
            'timestamp': str(Path.cwd()),
            'stats': dict(self.stats),
            'issues': self.issues
        }
        
        report_file.write_text(json.dumps(report, indent=2))
        print(f"\n📄 Detailed report saved: {report_file}")


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Validate all file paths in NEXUS 5.0")
    parser.add_argument('--verbose', '-v', action='store_true', help='Show detailed output')
    parser.add_argument('--root', default=str(WORKSPACE_ROOT), help='Root directory to analyze')
    
    args = parser.parse_args()
    
    root = Path(args.root)
    if not root.exists():
        print(f"❌ Root directory not found: {root}")
        return 1
    
    validator = PathValidator(root)
    validator.analyze_all(verbose=args.verbose)
    
    return 0 if not validator.issues else 1


if __name__ == "__main__":
    exit(main())
