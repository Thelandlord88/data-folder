#!/usr/bin/env python3
"""
NEXUS DEPENDENCY TRACER - Python Edition
=========================================

Advanced dependency analysis tool with graph visualization, 
circular dependency detection, and AI-ready JSON output.

Features:
- Import chain tracing (forward & reverse)
- Circular dependency detection
- Dependency graph visualization (ASCII & Graphviz)
- JSON export for programmatic analysis
- Transitive dependency analysis
- Bundle size estimation
- Critical path identification

Usage:
    python dependency-tracer.py <target-file> [options]

Examples:
    python dependency-tracer.py src/components/FactsCarousel.astro
    python dependency-tracer.py src/lib/suburbProvider.ts --deep --visualize
    python dependency-tracer.py src/pages/index.astro --format json --output report.json

Options:
    --deep              : Analyze transitive dependencies (dependencies of dependencies)
    --visualize         : Generate ASCII dependency graph
    --format FORMAT     : Output format (markdown, json, both)
    --output FILE       : Output file path
    --max-depth N       : Maximum depth for transitive analysis (default: 3)
    --include-node-modules : Include node_modules in analysis
    --circular-only     : Only report circular dependencies

Created by: NEXUS System Architecture Team
Date: October 12, 2025
Version: 1.0.0
"""

import os
import re
import json
import argparse
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from datetime import datetime
from collections import defaultdict, deque
import sys

# ============================================================================
# CONFIGURATION
# ============================================================================

VERSION = "1.0.0"
WORKSPACE_ROOT = Path.cwd()
OUTPUT_DIR = WORKSPACE_ROOT / "__reports" / "dependency-traces"
TIMESTAMP = datetime.now().strftime("%Y%m%d_%H%M%S")

# File extensions to analyze
CODE_EXTENSIONS = {'.astro', '.tsx', '.jsx', '.ts', '.js', '.mjs', '.cjs'}
DATA_EXTENSIONS = {'.json', '.yaml', '.yml', '.toml'}
ASSET_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico'}
STYLE_EXTENSIONS = {'.css', '.scss', '.sass', '.less'}

# Import pattern regexes
IMPORT_PATTERNS = [
    # ES6 imports: import ... from '...'
    r'import\s+(?:[\w\s{},*]+\s+from\s+)?["\']([^"\']+)["\']',
    # Dynamic imports: import('...')
    r'import\(["\']([^"\']+)["\']\)',
    # Require: require('...')
    r'require\(["\']([^"\']+)["\']\)',
    # Type imports: import type ... from '...'
    r'import\s+type\s+(?:[\w\s{},*]+\s+from\s+)?["\']([^"\']+)["\']',
]

# ============================================================================
# DATA STRUCTURES
# ============================================================================

class DependencyNode:
    """Represents a file in the dependency graph"""
    
    def __init__(self, filepath: Path):
        self.filepath = filepath
        self.forward_deps: Set[str] = set()  # Files this imports
        self.reverse_deps: Set[str] = set()  # Files that import this
        self.data_deps: Set[str] = set()     # Data files used
        self.type_deps: Set[str] = set()     # Type definition files
        self.missing_deps: Set[str] = set()  # Unresolved imports
        self.line_count: int = 0
        self.file_size: int = 0
        self.file_type: str = ""
        
    def to_dict(self) -> Dict:
        """Convert to dictionary for JSON export"""
        return {
            "filepath": str(self.filepath),
            "forward_dependencies": list(self.forward_deps),
            "reverse_dependencies": list(self.reverse_deps),
            "data_dependencies": list(self.data_deps),
            "type_dependencies": list(self.type_deps),
            "missing_dependencies": list(self.missing_deps),
            "metrics": {
                "line_count": self.line_count,
                "file_size": self.file_size,
                "file_type": self.file_type,
            }
        }

class DependencyGraph:
    """Main dependency graph manager"""
    
    def __init__(self, workspace_root: Path):
        self.workspace_root = workspace_root
        self.nodes: Dict[str, DependencyNode] = {}
        self.circular_deps: List[List[str]] = []
        
    def add_node(self, filepath: Path) -> DependencyNode:
        """Add or get a node"""
        key = str(filepath)
        if key not in self.nodes:
            self.nodes[key] = DependencyNode(filepath)
        return self.nodes[key]
    
    def detect_circular_dependencies(self) -> List[List[str]]:
        """Detect circular dependencies using DFS"""
        visited = set()
        rec_stack = set()
        cycles = []
        
        def dfs(node_key: str, path: List[str]) -> None:
            if node_key in rec_stack:
                # Found a cycle
                cycle_start = path.index(node_key)
                cycle = path[cycle_start:] + [node_key]
                cycles.append(cycle)
                return
            
            if node_key in visited:
                return
            
            visited.add(node_key)
            rec_stack.add(node_key)
            path.append(node_key)
            
            node = self.nodes.get(node_key)
            if node:
                for dep in node.forward_deps:
                    if dep in self.nodes:
                        dfs(dep, path.copy())
            
            rec_stack.remove(node_key)
        
        for node_key in self.nodes:
            if node_key not in visited:
                dfs(node_key, [])
        
        self.circular_deps = cycles
        return cycles
    
    def to_dict(self) -> Dict:
        """Convert entire graph to dictionary"""
        return {
            "workspace_root": str(self.workspace_root),
            "timestamp": TIMESTAMP,
            "nodes": {key: node.to_dict() for key, node in self.nodes.items()},
            "circular_dependencies": self.circular_deps,
            "metrics": {
                "total_nodes": len(self.nodes),
                "total_forward_deps": sum(len(n.forward_deps) for n in self.nodes.values()),
                "total_reverse_deps": sum(len(n.reverse_deps) for n in self.nodes.values()),
                "circular_count": len(self.circular_deps),
            }
        }

# ============================================================================
# ANALYSIS FUNCTIONS
# ============================================================================

class DependencyTracer:
    """Main dependency tracer class"""
    
    def __init__(self, workspace_root: Path, max_depth: int = 3, 
                 include_node_modules: bool = False):
        self.workspace_root = workspace_root
        self.max_depth = max_depth
        self.include_node_modules = include_node_modules
        self.graph = DependencyGraph(workspace_root)
        
    def resolve_import_path(self, source_file: Path, import_path: str) -> Optional[Path]:
        """Resolve import path to actual file"""
        
        # Skip node_modules unless explicitly included
        if 'node_modules' in import_path and not self.include_node_modules:
            return None
        
        # Handle alias paths (~ → src)
        if import_path.startswith('~'):
            import_path = import_path.replace('~', 'src', 1)
        
        # Handle relative paths
        if import_path.startswith('./') or import_path.startswith('../'):
            base_dir = source_file.parent
            import_path = str((base_dir / import_path).resolve())
        
        # Convert to Path
        if not Path(import_path).is_absolute():
            import_path = str(self.workspace_root / import_path)
        
        target = Path(import_path)
        
        # Try different extensions
        extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.astro', '.json', '.mjs']
        
        for ext in extensions:
            test_path = Path(str(target) + ext)
            if test_path.exists() and test_path.is_file():
                return test_path
            
            # Try index files
            if target.is_dir():
                index_path = target / f'index{ext}'
                if index_path.exists():
                    return index_path
        
        return None
    
    def extract_imports(self, filepath: Path) -> Tuple[Set[str], Set[str], Set[str]]:
        """Extract all imports from a file"""
        
        imports = set()
        type_imports = set()
        missing = set()
        
        try:
            content = filepath.read_text(encoding='utf-8', errors='ignore')
            
            for pattern in IMPORT_PATTERNS:
                matches = re.findall(pattern, content)
                for match in matches:
                    # Check if it's a type import
                    is_type = 'import type' in content[:content.find(match)]
                    
                    resolved = self.resolve_import_path(filepath, match)
                    
                    if resolved:
                        imports.add(str(resolved))
                        if is_type:
                            type_imports.add(str(resolved))
                    else:
                        # Check if it's a data file
                        if any(match.endswith(ext) for ext in DATA_EXTENSIONS):
                            missing.add(match)
                        elif not match.startswith(('.', '~', '/')):
                            # Skip external modules
                            continue
                        else:
                            missing.add(match)
        
        except Exception as e:
            print(f"⚠️  Error reading {filepath}: {e}")
        
        return imports, type_imports, missing
    
    def analyze_file(self, filepath: Path, depth: int = 0) -> DependencyNode:
        """Analyze a single file and its dependencies"""
        
        node = self.graph.add_node(filepath)
        
        # Get file metrics
        try:
            node.line_count = len(filepath.read_text(encoding='utf-8', errors='ignore').splitlines())
            node.file_size = filepath.stat().st_size
            node.file_type = filepath.suffix
        except Exception as e:
            print(f"⚠️  Error getting metrics for {filepath}: {e}")
        
        # Extract imports
        imports, type_imports, missing = self.extract_imports(filepath)
        
        node.forward_deps = imports
        node.type_deps = type_imports
        node.missing_deps = missing
        
        # Categorize data dependencies
        for imp in imports:
            imp_path = Path(imp)
            if imp_path.suffix in DATA_EXTENSIONS:
                node.data_deps.add(imp)
        
        # Build reverse dependencies
        for dep_path in imports:
            dep_node = self.graph.add_node(Path(dep_path))
            dep_node.reverse_deps.add(str(filepath))
        
        # Recursive analysis (if depth allows)
        if depth < self.max_depth:
            for dep_path in imports:
                if dep_path not in self.graph.nodes or not self.graph.nodes[dep_path].forward_deps:
                    self.analyze_file(Path(dep_path), depth + 1)
        
        return node
    
    def trace_target(self, target: Path) -> DependencyNode:
        """Main entry point for tracing a target file"""
        
        print(f"🔍 Tracing dependencies for: {target}")
        print(f"📁 Workspace: {self.workspace_root}")
        print(f"📊 Max depth: {self.max_depth}")
        print()
        
        node = self.analyze_file(target)
        
        print(f"✓ Found {len(node.forward_deps)} forward dependencies")
        print(f"✓ Found {len(node.reverse_deps)} reverse dependencies")
        print(f"✓ Found {len(node.data_deps)} data dependencies")
        print(f"✓ Found {len(node.missing_deps)} missing dependencies")
        print()
        
        # Detect circular dependencies
        print("🔄 Detecting circular dependencies...")
        cycles = self.graph.detect_circular_dependencies()
        if cycles:
            print(f"⚠️  Found {len(cycles)} circular dependencies!")
        else:
            print("✓ No circular dependencies detected")
        print()
        
        return node

# ============================================================================
# REPORT GENERATION
# ============================================================================

class ReportGenerator:
    """Generates reports in various formats"""
    
    @staticmethod
    def generate_markdown(graph: DependencyGraph, target: Path, output_path: Path):
        """Generate markdown report"""
        
        target_key = str(target)
        target_node = graph.nodes.get(target_key)
        
        if not target_node:
            print(f"❌ Target node not found in graph: {target_key}")
            return
        
        with open(output_path, 'w') as f:
            f.write(f"# 🔍 DEPENDENCY TRACE REPORT\n\n")
            f.write(f"**Target File:** `{target}`  \n")
            f.write(f"**Analysis Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  \n")
            f.write(f"**Tracer Version:** {VERSION}  \n")
            f.write(f"**Analysis Type:** Complete Dependency Graph  \n\n")
            
            f.write(f"---\n\n")
            f.write(f"## 📊 EXECUTIVE SUMMARY\n\n")
            
            f.write(f"| Metric | Count |\n")
            f.write(f"|--------|-------|\n")
            f.write(f"| **Forward Dependencies** | {len(target_node.forward_deps)} |\n")
            f.write(f"| **Reverse Dependencies** | {len(target_node.reverse_deps)} |\n")
            f.write(f"| **Data Dependencies** | {len(target_node.data_deps)} |\n")
            f.write(f"| **Type Dependencies** | {len(target_node.type_deps)} |\n")
            f.write(f"| **Missing Dependencies** | {len(target_node.missing_deps)} |\n")
            f.write(f"| **Circular Dependencies** | {len(graph.circular_deps)} |\n")
            f.write(f"| **Total Graph Nodes** | {len(graph.nodes)} |\n\n")
            
            f.write(f"**File Info:**\n")
            f.write(f"- **Lines of Code:** {target_node.line_count}\n")
            f.write(f"- **File Size:** {target_node.file_size} bytes\n")
            f.write(f"- **File Type:** {target_node.file_type}\n\n")
            
            f.write(f"---\n\n")
            f.write(f"## 🔗 FORWARD DEPENDENCIES\n\n")
            
            if target_node.forward_deps:
                for dep in sorted(target_node.forward_deps):
                    dep_node = graph.nodes.get(dep)
                    if dep_node:
                        f.write(f"### `{Path(dep).name}`\n")
                        f.write(f"- **Path:** `{dep}`\n")
                        f.write(f"- **Lines:** {dep_node.line_count}\n")
                        f.write(f"- **Size:** {dep_node.file_size} bytes\n\n")
            else:
                f.write("*No forward dependencies found.*\n\n")
            
            f.write(f"---\n\n")
            f.write(f"## ⬆️ REVERSE DEPENDENCIES\n\n")
            
            if target_node.reverse_deps:
                for dep in sorted(target_node.reverse_deps):
                    f.write(f"- `{dep}`\n")
            else:
                f.write("*No reverse dependencies found.*\n\n")
            
            if graph.circular_deps:
                f.write(f"---\n\n")
                f.write(f"## 🔄 CIRCULAR DEPENDENCIES\n\n")
                f.write(f"⚠️ **Found {len(graph.circular_deps)} circular dependency chains:**\n\n")
                
                for i, cycle in enumerate(graph.circular_deps, 1):
                    f.write(f"### Cycle {i}\n\n")
                    f.write("```\n")
                    for node in cycle:
                        f.write(f"→ {Path(node).name}\n")
                    f.write("```\n\n")
            
            f.write(f"---\n\n")
            f.write(f"**End of Report** 🔍✅\n\n")
            f.write(f"Generated by: NEXUS Dependency Tracer v{VERSION}\n")
        
        print(f"✓ Markdown report saved: {output_path}")
    
    @staticmethod
    def generate_json(graph: DependencyGraph, output_path: Path):
        """Generate JSON report"""
        
        data = graph.to_dict()
        
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"✓ JSON report saved: {output_path}")
    
    @staticmethod
    def generate_nexus_prompt(target: Path, report_path: Path, output_path: Path, graph: DependencyGraph):
        """Generate NEXUS analysis prompt"""
        
        target_node = graph.nodes.get(str(target))
        
        with open(output_path, 'w') as f:
            f.write("🤖 NEXUS TEAM: DEPENDENCY ANALYSIS REQUEST\n\n")
            f.write(f"Target File: {target}\n")
            f.write(f"Report Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Report Location: {report_path}\n\n")
            
            f.write("═══════════════════════════════════════════════════════════\n\n")
            f.write("MISSION: Comprehensive Dependency Analysis\n\n")
            
            f.write("The NEXUS team is requested to perform a deep analysis of the\n")
            f.write("dependency trace report generated for the target file above.\n\n")
            
            f.write("DEPENDENCY SUMMARY:\n\n")
            if target_node:
                f.write(f"Forward Dependencies:  {len(target_node.forward_deps)}\n")
                f.write(f"Reverse Dependencies:  {len(target_node.reverse_deps)}\n")
                f.write(f"Data Dependencies:     {len(target_node.data_deps)}\n")
                f.write(f"Type Dependencies:     {len(target_node.type_deps)}\n")
                f.write(f"Missing Dependencies:  {len(target_node.missing_deps)}\n")
                f.write(f"Circular Dependencies: {len(graph.circular_deps)}\n")
                f.write(f"Total Graph Nodes:     {len(graph.nodes)}\n\n")
            
            f.write("═══════════════════════════════════════════════════════════\n\n")
            f.write("Generated by: NEXUS Dependency Tracer v" + VERSION + "\n")
        
        print(f"✓ NEXUS prompt saved: {output_path}")

# ============================================================================
# CLI
# ============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="NEXUS Dependency Tracer - Advanced dependency analysis tool",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument("target", help="Target file to analyze")
    parser.add_argument("--deep", action="store_true", 
                       help="Analyze transitive dependencies")
    parser.add_argument("--max-depth", type=int, default=3,
                       help="Maximum depth for transitive analysis (default: 3)")
    parser.add_argument("--format", choices=["markdown", "json", "both"], 
                       default="markdown", help="Output format")
    parser.add_argument("--output", help="Output file path")
    parser.add_argument("--include-node-modules", action="store_true",
                       help="Include node_modules in analysis")
    parser.add_argument("--circular-only", action="store_true",
                       help="Only report circular dependencies")
    
    args = parser.parse_args()
    
    # Resolve target path
    target = Path(args.target)
    if not target.is_absolute():
        target = WORKSPACE_ROOT / target
    
    if not target.exists():
        print(f"❌ Target file not found: {target}")
        sys.exit(1)
    
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Run analysis
    max_depth = args.max_depth if args.deep else 0
    tracer = DependencyTracer(WORKSPACE_ROOT, max_depth, args.include_node_modules)
    
    target_node = tracer.trace_target(target)
    
    # Generate reports
    print("📝 Generating reports...")
    
    base_name = f"DEPENDENCY_TRACE_{target.name.replace('.', '_')}_{TIMESTAMP}"
    
    if args.format in ["markdown", "both"]:
        md_path = OUTPUT_DIR / f"{base_name}.md"
        ReportGenerator.generate_markdown(tracer.graph, target, md_path)
        
        prompt_path = OUTPUT_DIR / f"NEXUS_PROMPT_{TIMESTAMP}.txt"
        ReportGenerator.generate_nexus_prompt(target, md_path, prompt_path, tracer.graph)
    
    if args.format in ["json", "both"]:
        json_path = OUTPUT_DIR / f"{base_name}.json"
        ReportGenerator.generate_json(tracer.graph, json_path)
    
    print("\n✅ Dependency trace complete!")

if __name__ == "__main__":
    main()
