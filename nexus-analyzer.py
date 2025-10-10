#!/usr/bin/env python3
"""
NEXUS Repository Analyzer
=========================
Comprehensive analysis tool for all NEXUS-related files in the repository.

This script analyzes:
- All TypeScript (.ts) files
- All JavaScript (.js) files  
- All JSON (.json) files
- All Markdown (.md) documentation
- Imports and dependencies
- Function definitions and signatures
- File relationships and connections
- Duplicates across versions

Author: Pythonista (NEXUS AI Personality)
Date: October 9, 2025
"""

import os
import re
import json
import hashlib
from pathlib import Path
from typing import Dict, List, Set, Tuple
from collections import defaultdict
from datetime import datetime


class NexusAnalyzer:
    """Comprehensive analyzer for NEXUS repository files."""
    
    def __init__(self, root_path: str):
        self.root_path = Path(root_path)
        self.files_data = {}
        self.imports_graph = defaultdict(set)
        self.functions_map = defaultdict(list)
        self.duplicates = defaultdict(list)
        self.file_hashes = {}
        
    def analyze_repository(self):
        """Main analysis entry point."""
        print("╔═══════════════════════════════════════════════════════════════╗")
        print("║          NEXUS Repository Comprehensive Analysis             ║")
        print("╚═══════════════════════════════════════════════════════════════╝\n")
        
        print("🔍 Phase 1: Discovering NEXUS files...")
        self.discover_files()
        
        print(f"✅ Found {len(self.files_data)} files\n")
        
        print("🔍 Phase 2: Analyzing file contents...")
        self.analyze_files()
        
        print("✅ Analysis complete\n")
        
        print("🔍 Phase 3: Building dependency graph...")
        self.build_dependency_graph()
        
        print("✅ Dependency graph built\n")
        
        print("🔍 Phase 4: Detecting duplicates...")
        self.detect_duplicates()
        
        print("✅ Duplicate detection complete\n")
        
        print("📊 Phase 5: Generating reports...")
        self.generate_reports()
        
        print("✅ Reports generated\n")
        
    def discover_files(self):
        """Discover all NEXUS-related files in the repository."""
        extensions = {'.ts', '.js', '.json', '.md', '.mjs', '.sh'}
        nexus_keywords = {'nexus', 'personality', 'trait', 'consciousness'}
        
        for root, dirs, files in os.walk(self.root_path):
            # Skip node_modules and .git
            dirs[:] = [d for d in dirs if d not in {'node_modules', '.git', '__pycache__'}]
            
            for file in files:
                file_path = Path(root) / file
                ext = file_path.suffix.lower()
                
                # Check if file is NEXUS-related
                if ext in extensions:
                    rel_path = file_path.relative_to(self.root_path)
                    path_str = str(rel_path).lower()
                    
                    # Include if in nexus directories or has nexus-related name
                    if any(keyword in path_str for keyword in nexus_keywords):
                        self.files_data[str(rel_path)] = {
                            'path': str(rel_path),
                            'full_path': str(file_path),
                            'extension': ext,
                            'size': file_path.stat().st_size,
                            'name': file_path.name,
                            'directory': str(file_path.parent.relative_to(self.root_path)),
                            'imports': [],
                            'exports': [],
                            'functions': [],
                            'classes': [],
                            'interfaces': [],
                            'types': [],
                            'content_hash': None
                        }
    
    def analyze_files(self):
        """Analyze content of each discovered file."""
        total = len(self.files_data)
        for idx, (rel_path, data) in enumerate(self.files_data.items(), 1):
            print(f"  Analyzing ({idx}/{total}): {rel_path}", end='\r')
            
            try:
                full_path = data['full_path']
                ext = data['extension']
                
                with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # Calculate content hash
                data['content_hash'] = hashlib.md5(content.encode()).hexdigest()
                self.file_hashes[data['content_hash']] = rel_path
                
                # Analyze based on file type
                if ext in {'.ts', '.js', '.mjs'}:
                    self.analyze_typescript_javascript(content, data)
                elif ext == '.json':
                    self.analyze_json(content, data)
                elif ext == '.md':
                    self.analyze_markdown(content, data)
                    
            except Exception as e:
                data['error'] = str(e)
        
        print()  # New line after progress
    
    def analyze_typescript_javascript(self, content: str, data: dict):
        """Analyze TypeScript/JavaScript files."""
        # Extract imports
        import_patterns = [
            r'import\s+.*?\s+from\s+[\'"](.+?)[\'"]',
            r'import\s+[\'"](.+?)[\'"]',
            r'require\s*\([\'"](.+?)[\'"]\)',
        ]
        
        for pattern in import_patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                import_path = match.group(1)
                data['imports'].append(import_path)
        
        # Extract exports
        export_patterns = [
            r'export\s+(?:default\s+)?(?:class|function|const|let|var|interface|type)\s+(\w+)',
            r'export\s+\{\s*([^}]+)\s*\}',
        ]
        
        for pattern in export_patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                export_name = match.group(1).strip()
                if ',' in export_name:
                    data['exports'].extend([e.strip() for e in export_name.split(',')])
                else:
                    data['exports'].append(export_name)
        
        # Extract function definitions
        function_patterns = [
            r'(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)',
            r'(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*=>',
            r'(\w+)\s*\(([^)]*)\)\s*\{',  # Methods
        ]
        
        for pattern in function_patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                func_name = match.group(1)
                params = match.group(2) if len(match.groups()) > 1 else ''
                data['functions'].append({
                    'name': func_name,
                    'params': params.strip()
                })
        
        # Extract class definitions
        class_pattern = r'class\s+(\w+)(?:\s+extends\s+(\w+))?'
        matches = re.finditer(class_pattern, content)
        for match in matches:
            class_name = match.group(1)
            extends = match.group(2) if match.group(2) else None
            data['classes'].append({
                'name': class_name,
                'extends': extends
            })
        
        # Extract interface definitions (TypeScript)
        interface_pattern = r'interface\s+(\w+)(?:\s+extends\s+([^{]+))?'
        matches = re.finditer(interface_pattern, content)
        for match in matches:
            interface_name = match.group(1)
            data['interfaces'].append(interface_name)
        
        # Extract type definitions (TypeScript)
        type_pattern = r'type\s+(\w+)\s*='
        matches = re.finditer(type_pattern, content)
        for match in matches:
            type_name = match.group(1)
            data['types'].append(type_name)
    
    def analyze_json(self, content: str, data: dict):
        """Analyze JSON files (especially personality profiles)."""
        try:
            json_data = json.loads(content)
            data['json_keys'] = list(json_data.keys()) if isinstance(json_data, dict) else []
            
            # Check if it's a personality profile
            if 'identity' in json_data and 'cognitiveTraits' in json_data:
                data['file_type'] = 'personality_profile'
                data['personality_name'] = json_data.get('identity', {}).get('name', 'unknown')
                traits = json_data.get('cognitiveTraits', {})
                data['trait_count'] = len(traits)
                data['trait_names'] = list(traits.keys())
            elif 'version' in json_data:
                data['file_type'] = 'configuration'
            else:
                data['file_type'] = 'data'
                
        except json.JSONDecodeError as e:
            data['json_error'] = str(e)
    
    def analyze_markdown(self, content: str, data: dict):
        """Analyze Markdown documentation files."""
        # Count headers
        headers = re.findall(r'^#+\s+(.+)$', content, re.MULTILINE)
        data['header_count'] = len(headers)
        data['headers'] = headers[:10]  # First 10 headers
        
        # Count code blocks
        code_blocks = re.findall(r'```(\w+)?', content)
        data['code_blocks'] = len(code_blocks)
        
        # Extract links
        links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', content)
        data['links'] = [{'text': text, 'url': url} for text, url in links[:20]]
    
    def build_dependency_graph(self):
        """Build a graph of file dependencies."""
        for rel_path, data in self.files_data.items():
            for import_path in data.get('imports', []):
                # Try to resolve the import to an actual file
                resolved = self.resolve_import(import_path, rel_path)
                if resolved:
                    self.imports_graph[rel_path].add(resolved)
    
    def resolve_import(self, import_path: str, from_file: str) -> str:
        """Try to resolve an import path to an actual file."""
        # Handle relative imports
        if import_path.startswith('.'):
            from_dir = Path(from_file).parent
            resolved = (from_dir / import_path).resolve()
            
            # Try different extensions
            for ext in ['.ts', '.js', '.mjs', '.json']:
                test_path = str(resolved) + ext
                if test_path in [d['full_path'] for d in self.files_data.values()]:
                    return str(Path(test_path).relative_to(self.root_path))
        
        # Check if it's a direct match
        for file_path in self.files_data.keys():
            if import_path in file_path:
                return file_path
        
        return None
    
    def detect_duplicates(self):
        """Detect duplicate files by content hash."""
        hash_to_files = defaultdict(list)
        
        for rel_path, data in self.files_data.items():
            if data.get('content_hash'):
                hash_to_files[data['content_hash']].append(rel_path)
        
        # Find duplicates
        for file_hash, files in hash_to_files.items():
            if len(files) > 1:
                self.duplicates[file_hash] = files
    
    def generate_reports(self):
        """Generate comprehensive reports."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Generate JSON report
        json_report_path = self.root_path / f'nexus-analysis-{timestamp}.json'
        self.generate_json_report(json_report_path)
        
        # Generate Markdown report
        md_report_path = self.root_path / f'NEXUS_ANALYSIS_REPORT_{timestamp}.md'
        self.generate_markdown_report(md_report_path)
        
        print(f"📄 JSON Report: {json_report_path}")
        print(f"📄 Markdown Report: {md_report_path}")
    
    def generate_json_report(self, output_path: Path):
        """Generate detailed JSON report."""
        report = {
            'timestamp': datetime.now().isoformat(),
            'repository_path': str(self.root_path),
            'summary': {
                'total_files': len(self.files_data),
                'total_duplicates': len(self.duplicates),
                'total_dependencies': sum(len(deps) for deps in self.imports_graph.values())
            },
            'files': self.files_data,
            'imports_graph': {k: list(v) for k, v in self.imports_graph.items()},
            'duplicates': {k: v for k, v in self.duplicates.items()},
            'statistics': self.calculate_statistics()
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2)
    
    def generate_markdown_report(self, output_path: Path):
        """Generate human-readable Markdown report."""
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write("# NEXUS Repository Analysis Report\n\n")
            f.write(f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write("---\n\n")
            
            # Summary
            f.write("## 📊 Summary\n\n")
            stats = self.calculate_statistics()
            f.write(f"- **Total Files Analyzed**: {len(self.files_data)}\n")
            f.write(f"- **TypeScript Files**: {stats['ts_files']}\n")
            f.write(f"- **JavaScript Files**: {stats['js_files']}\n")
            f.write(f"- **JSON Files**: {stats['json_files']}\n")
            f.write(f"- **Markdown Files**: {stats['md_files']}\n")
            f.write(f"- **Personality Profiles**: {stats['personality_profiles']}\n")
            f.write(f"- **Total Functions**: {stats['total_functions']}\n")
            f.write(f"- **Total Classes**: {stats['total_classes']}\n")
            f.write(f"- **Duplicate Files**: {len(self.duplicates)}\n\n")
            
            # File Locations
            f.write("## 📁 File Locations\n\n")
            dirs = defaultdict(list)
            for rel_path, data in self.files_data.items():
                dirs[data['directory']].append(data['name'])
            
            for dir_path in sorted(dirs.keys()):
                f.write(f"### `{dir_path}/`\n\n")
                for filename in sorted(dirs[dir_path]):
                    f.write(f"- {filename}\n")
                f.write("\n")
            
            # Duplicates
            if self.duplicates:
                f.write("## 🔄 Duplicate Files\n\n")
                f.write("Files with identical content:\n\n")
                for idx, (file_hash, files) in enumerate(self.duplicates.items(), 1):
                    f.write(f"### Duplicate Set {idx}\n\n")
                    for file in files:
                        f.write(f"- `{file}`\n")
                    f.write("\n")
            
            # Key Files
            f.write("## 🔑 Key Files\n\n")
            
            # Personality profiles
            f.write("### Personality Profiles\n\n")
            for rel_path, data in sorted(self.files_data.items()):
                if data.get('file_type') == 'personality_profile':
                    name = data.get('personality_name', 'unknown')
                    traits = data.get('trait_count', 0)
                    f.write(f"- **{name}**: `{rel_path}` ({traits} traits)\n")
            f.write("\n")
            
            # Runtime files
            f.write("### Runtime Files\n\n")
            runtime_files = [
                (path, data) for path, data in self.files_data.items()
                if 'runtime' in path.lower() and data['extension'] in {'.ts', '.js'}
            ]
            for rel_path, data in sorted(runtime_files, key=lambda x: x[1]['size'], reverse=True)[:10]:
                size_kb = data['size'] / 1024
                func_count = len(data.get('functions', []))
                f.write(f"- `{rel_path}` ({size_kb:.1f} KB, {func_count} functions)\n")
            f.write("\n")
            
            # Dependency Graph
            f.write("## 🔗 Dependency Graph\n\n")
            f.write("Files with the most dependencies:\n\n")
            dep_counts = [(file, len(deps)) for file, deps in self.imports_graph.items()]
            for file, count in sorted(dep_counts, key=lambda x: x[1], reverse=True)[:15]:
                f.write(f"- `{file}`: {count} imports\n")
                deps = self.imports_graph[file]
                for dep in sorted(deps)[:5]:
                    f.write(f"  - imports from `{dep}`\n")
            f.write("\n")
            
            # Functions
            f.write("## 📋 Function Index\n\n")
            func_index = defaultdict(list)
            for rel_path, data in self.files_data.items():
                for func in data.get('functions', []):
                    func_index[func['name']].append(rel_path)
            
            f.write(f"Total unique function names: {len(func_index)}\n\n")
            f.write("Functions defined in multiple files:\n\n")
            for func_name, files in sorted(func_index.items()):
                if len(files) > 1:
                    f.write(f"### `{func_name}()`\n")
                    for file in files:
                        f.write(f"- {file}\n")
                    f.write("\n")
    
    def calculate_statistics(self) -> dict:
        """Calculate repository statistics."""
        stats = {
            'ts_files': 0,
            'js_files': 0,
            'json_files': 0,
            'md_files': 0,
            'personality_profiles': 0,
            'total_functions': 0,
            'total_classes': 0,
            'total_interfaces': 0,
            'total_types': 0,
        }
        
        for data in self.files_data.values():
            ext = data['extension']
            if ext == '.ts':
                stats['ts_files'] += 1
            elif ext in {'.js', '.mjs'}:
                stats['js_files'] += 1
            elif ext == '.json':
                stats['json_files'] += 1
            elif ext == '.md':
                stats['md_files'] += 1
            
            if data.get('file_type') == 'personality_profile':
                stats['personality_profiles'] += 1
            
            stats['total_functions'] += len(data.get('functions', []))
            stats['total_classes'] += len(data.get('classes', []))
            stats['total_interfaces'] += len(data.get('interfaces', []))
            stats['total_types'] += len(data.get('types', []))
        
        return stats


def main():
    """Main entry point."""
    # Analyze from the data-folder root
    analyzer = NexusAnalyzer('/workspaces/data-folder')
    analyzer.analyze_repository()
    
    print("\n╔═══════════════════════════════════════════════════════════════╗")
    print("║                  ✅ ANALYSIS COMPLETE!                        ║")
    print("╚═══════════════════════════════════════════════════════════════╝")
    print("\nCheck the generated reports for detailed information.")


if __name__ == '__main__':
    main()
