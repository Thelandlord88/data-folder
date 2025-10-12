#!/usr/bin/env python3
"""
NEXUS Repository Analyzer
Comprehensive analysis of all NEXUS files to make informed decisions about consolidation
"""

import os
import json
import hashlib
from pathlib import Path
from datetime import datetime
from collections import defaultdict
import re

class NexusRepoAnalyzer:
    def __init__(self, root_path: str):
        self.root_path = Path(root_path)
        self.analysis = {
            'scan_time': datetime.now().isoformat(),
            'folders': {},
            'files_by_type': defaultdict(list),
            'duplicates': [],
            'typescript_files': [],
            'javascript_files': [],
            'conflicts': [],
            'recommendations': []
        }
        
    def analyze_file(self, file_path: Path) -> dict:
        """Analyze a single file and return metadata."""
        try:
            stat = file_path.stat()
            
            info = {
                'path': str(file_path.relative_to(self.root_path)),
                'name': file_path.name,
                'size': stat.st_size,
                'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                'extension': file_path.suffix,
                'lines': 0,
                'hash': None,
                'type': self.classify_file(file_path)
            }
            
            # Read file for analysis
            if file_path.suffix in ['.ts', '.js', '.mjs', '.json', '.md']:
                try:
                    content = file_path.read_text(encoding='utf-8', errors='ignore')
                    info['lines'] = len(content.splitlines())
                    info['hash'] = hashlib.md5(content.encode()).hexdigest()
                    
                    # Extract imports/dependencies
                    if file_path.suffix in ['.ts', '.js', '.mjs']:
                        info['imports'] = self.extract_imports(content)
                        info['exports'] = self.extract_exports(content)
                        
                except Exception as e:
                    info['error'] = str(e)
                    
            return info
            
        except Exception as e:
            return {'path': str(file_path), 'error': str(e)}
    
    def classify_file(self, file_path: Path) -> str:
        """Classify file by type and purpose."""
        name = file_path.name.lower()
        suffix = file_path.suffix
        
        # TypeScript/JavaScript files
        if suffix == '.ts' and 'test' not in name:
            return 'typescript-source'
        elif suffix == '.mjs':
            return 'javascript-module'
        elif suffix == '.js':
            return 'javascript-compiled'
        elif suffix == '.d.ts':
            return 'typescript-definition'
            
        # Config files
        elif name in ['package.json', 'tsconfig.json']:
            return 'config'
            
        # Documentation
        elif suffix == '.md':
            return 'documentation'
            
        # Tests
        elif 'test' in name or 'spec' in name:
            return 'test'
            
        # Data
        elif suffix == '.json' and name not in ['package.json', 'tsconfig.json']:
            return 'data'
            
        else:
            return 'other'
    
    def extract_imports(self, content: str) -> list:
        """Extract import statements from code."""
        imports = []
        
        # ES6 imports
        import_pattern = r"import\s+(?:{[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+['\"]([^'\"]+)['\"]"
        imports.extend(re.findall(import_pattern, content))
        
        # Require statements
        require_pattern = r"require\(['\"]([^'\"]+)['\"]\)"
        imports.extend(re.findall(require_pattern, content))
        
        return list(set(imports))
    
    def extract_exports(self, content: str) -> list:
        """Extract exported symbols from code."""
        exports = []
        
        # Named exports
        export_pattern = r"export\s+(?:class|function|const|let|var|interface|type)\s+(\w+)"
        exports.extend(re.findall(export_pattern, content))
        
        # Default export
        if 'export default' in content:
            exports.append('default')
            
        return list(set(exports))
    
    def find_duplicates(self):
        """Find duplicate files based on content hash."""
        hash_to_files = defaultdict(list)
        
        for file_type, files in self.analysis['files_by_type'].items():
            for file_info in files:
                if file_info.get('hash'):
                    hash_to_files[file_info['hash']].append(file_info)
        
        # Find groups with more than one file
        for file_hash, files in hash_to_files.items():
            if len(files) > 1:
                self.analysis['duplicates'].append({
                    'hash': file_hash,
                    'count': len(files),
                    'files': [f['path'] for f in files],
                    'size': files[0]['size']
                })
    
    def find_typescript_javascript_pairs(self):
        """Find .ts files that have corresponding .js or .mjs files."""
        ts_files = {}
        js_files = {}
        
        for file_info in self.analysis['files_by_type']['typescript-source']:
            base_name = Path(file_info['path']).stem
            ts_files[base_name] = file_info
        
        for file_type in ['javascript-module', 'javascript-compiled']:
            for file_info in self.analysis['files_by_type'][file_type]:
                base_name = Path(file_info['path']).stem
                js_files[base_name] = file_info
        
        # Find conflicts (both .ts and .js exist)
        for base_name in set(ts_files.keys()) & set(js_files.keys()):
            self.analysis['conflicts'].append({
                'name': base_name,
                'typescript': ts_files[base_name]['path'],
                'javascript': js_files[base_name]['path'],
                'ts_lines': ts_files[base_name]['lines'],
                'js_lines': js_files[base_name]['lines'],
                'recommendation': self.recommend_version(ts_files[base_name], js_files[base_name])
            })
    
    def recommend_version(self, ts_file: dict, js_file: dict) -> str:
        """Recommend which version to keep based on analysis."""
        reasons = []
        
        # Check if TypeScript is much larger (might have types + implementation)
        if ts_file['lines'] > js_file['lines'] * 1.5:
            reasons.append("TypeScript version has more code (types + implementation)")
            
        # Check modification times
        ts_time = datetime.fromisoformat(ts_file['modified'])
        js_time = datetime.fromisoformat(js_file['modified'])
        
        if ts_time > js_time:
            reasons.append("TypeScript version is newer")
        elif js_time > ts_time:
            reasons.append("JavaScript version is newer")
        
        # Check if in dist/ (compiled)
        if 'dist/' in js_file['path']:
            return "Use TypeScript source, keep JavaScript as compiled output"
        
        # Check file size
        if js_file['lines'] > 0 and ts_file['lines'] == 0:
            return "Use JavaScript (TypeScript appears empty)"
        
        if reasons:
            return "Use TypeScript source: " + "; ".join(reasons)
        
        return "Use TypeScript source (default for type safety)"
    
    def scan_directory(self, directory: Path | None = None):
        """Recursively scan directory and analyze all files."""
        if directory is None:
            directory = self.root_path
        
        print(f"📂 Scanning: {directory.relative_to(self.root_path) if directory != self.root_path else '.'}")
        
        # Skip certain directories
        skip_dirs = {'node_modules', '.git', '__pycache__', '.vscode', 'backup'}
        
        try:
            for item in directory.iterdir():
                # Skip hidden files and specific directories
                if item.name.startswith('.') or item.name in skip_dirs:
                    continue
                
                if item.is_dir():
                    self.scan_directory(item)
                elif item.is_file():
                    file_info = self.analyze_file(item)
                    file_type = file_info.get('type', 'other')
                    self.analysis['files_by_type'][file_type].append(file_info)
                    
        except PermissionError:
            print(f"⚠️  Permission denied: {directory}")
    
    def generate_recommendations(self):
        """Generate recommendations for file consolidation."""
        recommendations = []
        
        # Recommend keeping TypeScript sources
        ts_count = len(self.analysis['files_by_type']['typescript-source'])
        js_count = len(self.analysis['files_by_type']['javascript-module'])
        recommendations.append(f"TypeScript sources: {ts_count} files (keep for development)")
        recommendations.append(f"JavaScript modules: {js_count} files (evaluate for consolidation)")
        
        # Duplicates
        if self.analysis['duplicates']:
            dup_count = len(self.analysis['duplicates'])
            recommendations.append(f"Found {dup_count} duplicate file groups - consolidate to save space")
        
        # Conflicts
        if self.analysis['conflicts']:
            conflict_count = len(self.analysis['conflicts'])
            recommendations.append(f"Found {conflict_count} TypeScript/JavaScript conflicts - resolve versions")
        
        self.analysis['recommendations'] = recommendations
    
    def save_report(self, output_file: str):
        """Save analysis report to JSON file."""
        output_path = Path(output_file)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.analysis, f, indent=2, default=str)
        print(f"✅ Report saved to: {output_path}")
    
    def print_summary(self):
        """Print analysis summary."""
        print("\n" + "="*60)
        print("📊 NEXUS Repository Analysis Summary")
        print("="*60)
        
        # File counts by type
        print("\n📁 Files by Type:")
        for file_type, files in sorted(self.analysis['files_by_type'].items()):
            if files:
                total_size = sum(f.get('size', 0) for f in files)
                total_lines = sum(f.get('lines', 0) for f in files)
                print(f"  {file_type:30s}: {len(files):4d} files, {total_lines:7d} lines, {total_size:10,d} bytes")
        
        # Duplicates
        if self.analysis['duplicates']:
            print(f"\n🔄 Duplicate Files: {len(self.analysis['duplicates'])} groups")
            for dup in self.analysis['duplicates'][:5]:  # Show first 5
                print(f"  {dup['count']} copies of {dup['files'][0]}")
        
        # Conflicts
        if self.analysis['conflicts']:
            print(f"\n⚔️  TypeScript/JavaScript Conflicts: {len(self.analysis['conflicts'])}")
            for conflict in self.analysis['conflicts'][:5]:  # Show first 5
                print(f"  {conflict['name']}:")
                print(f"    TS: {conflict['typescript']} ({conflict['ts_lines']} lines)")
                print(f"    JS: {conflict['javascript']} ({conflict['js_lines']} lines)")
                print(f"    → {conflict['recommendation']}")
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        for rec in self.analysis['recommendations']:
            print(f"  • {rec}")
        
        print("\n" + "="*60)


def main():
    """Main execution function."""
    repo_path = "/workspaces/data-folder"
    
    print("🔍 NEXUS Repository Comprehensive Analysis")
    print(f"📂 Root: {repo_path}")
    print("="*60)
    
    # Create analyzer
    analyzer = NexusRepoAnalyzer(repo_path)
    
    # Scan repository
    analyzer.scan_directory()
    
    # Find issues
    print("\n🔎 Analyzing for duplicates and conflicts...")
    analyzer.find_duplicates()
    analyzer.find_typescript_javascript_pairs()
    
    # Generate recommendations
    analyzer.generate_recommendations()
    
    # Print summary
    analyzer.print_summary()
    
    # Save detailed report
    report_file = f"{repo_path}/NEXUS_REPO_ANALYSIS_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    analyzer.save_report(report_file)
    
    print(f"\n✅ Analysis complete!")
    print(f"📄 Detailed report: {report_file}")


if __name__ == "__main__":
    main()
