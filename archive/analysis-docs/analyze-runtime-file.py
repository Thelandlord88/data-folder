#!/usr/bin/env python3
"""
NEXUS Runtime File Analyzer
============================
Deep analysis tool for understanding the massive nexus-runtime.ts file.

This script provides:
- Visual structure breakdown
- Function catalog with descriptions
- Class and interface mapping
- Dependency analysis
- Complexity metrics
- Interactive documentation

Author: Pythonista (NEXUS AI Personality)
Date: October 10, 2025
"""

import re
import json
from typing import Dict, List, Tuple, Optional
from collections import defaultdict
from pathlib import Path


class RuntimeFileAnalyzer:
    """Analyzer for the complex nexus-runtime.ts file."""
    
    def __init__(self, file_path: str):
        self.file_path = file_path
        with open(file_path, 'r', encoding='utf-8') as f:
            self.content = f.read()
        self.lines = self.content.split('\n')
        
        # Analysis results
        self.imports = []
        self.exports = []
        self.interfaces = []
        self.types = []
        self.classes = []
        self.functions = []
        self.constants = []
        self.enums = []
        
    def analyze(self):
        """Perform complete analysis."""
        print("╔═══════════════════════════════════════════════════════════════╗")
        print("║        NEXUS Runtime File Deep Analysis                      ║")
        print("╚═══════════════════════════════════════════════════════════════╝\n")
        
        print(f"📄 File: {self.file_path}")
        print(f"📏 Lines: {len(self.lines):,}")
        print(f"📦 Size: {len(self.content) / 1024:.1f} KB\n")
        
        print("🔍 Analyzing structure...")
        self.analyze_imports()
        self.analyze_types_and_interfaces()
        self.analyze_classes()
        self.analyze_functions()
        self.analyze_constants()
        self.analyze_enums()
        
        print("✅ Analysis complete!\n")
        
    def analyze_imports(self):
        """Extract all import statements."""
        import_pattern = r'import\s+(?:\{([^}]+)\}|(\w+))\s+from\s+[\'"]([^\'"]+)[\'"]'
        matches = re.finditer(import_pattern, self.content)
        
        for match in matches:
            if match.group(1):  # Named imports
                imports = [i.strip() for i in match.group(1).split(',')]
                source = match.group(3)
                self.imports.append({
                    'type': 'named',
                    'items': imports,
                    'from': source
                })
            elif match.group(2):  # Default import
                self.imports.append({
                    'type': 'default',
                    'item': match.group(2),
                    'from': match.group(3)
                })
    
    def analyze_types_and_interfaces(self):
        """Extract type definitions and interfaces."""
        # Interfaces
        interface_pattern = r'(?:export\s+)?interface\s+(\w+)(?:\s+extends\s+([^{]+))?\s*\{'
        for match in re.finditer(interface_pattern, self.content):
            name = match.group(1)
            extends = match.group(2).strip() if match.group(2) else None
            
            # Find the closing brace and extract properties
            start = match.end()
            brace_count = 1
            end = start
            while brace_count > 0 and end < len(self.content):
                if self.content[end] == '{':
                    brace_count += 1
                elif self.content[end] == '}':
                    brace_count -= 1
                end += 1
            
            body = self.content[start:end-1]
            properties = self.extract_interface_properties(body)
            
            self.interfaces.append({
                'name': name,
                'extends': extends,
                'properties': properties,
                'line': self.content[:match.start()].count('\n') + 1
            })
        
        # Type aliases
        type_pattern = r'(?:export\s+)?type\s+(\w+)\s*=\s*([^;]+);'
        for match in re.finditer(type_pattern, self.content):
            self.types.append({
                'name': match.group(1),
                'definition': match.group(2).strip(),
                'line': self.content[:match.start()].count('\n') + 1
            })
    
    def extract_interface_properties(self, body: str) -> List[Dict]:
        """Extract properties from interface body."""
        properties = []
        prop_pattern = r'(\w+)(\?)?:\s*([^;]+);'
        for match in re.finditer(prop_pattern, body):
            properties.append({
                'name': match.group(1),
                'optional': bool(match.group(2)),
                'type': match.group(3).strip()
            })
        return properties
    
    def analyze_classes(self):
        """Extract class definitions."""
        class_pattern = r'(?:export\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([^{]+))?\s*\{'
        
        for match in re.finditer(class_pattern, self.content):
            name = match.group(1)
            extends = match.group(2)
            implements = match.group(3).strip() if match.group(3) else None
            line = self.content[:match.start()].count('\n') + 1
            
            # Find class body
            start = match.end()
            brace_count = 1
            end = start
            while brace_count > 0 and end < len(self.content):
                if self.content[end] == '{':
                    brace_count += 1
                elif self.content[end] == '}':
                    brace_count -= 1
                end += 1
            
            body = self.content[start:end-1]
            
            # Extract methods
            methods = self.extract_class_methods(body)
            
            # Extract properties
            properties = self.extract_class_properties(body)
            
            self.classes.append({
                'name': name,
                'extends': extends,
                'implements': implements,
                'line': line,
                'methods': methods,
                'properties': properties
            })
    
    def extract_class_methods(self, body: str) -> List[Dict]:
        """Extract methods from class body."""
        methods = []
        method_pattern = r'(?:private|public|protected)?\s*(?:async\s+)?(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?\s*\{'
        
        for match in re.finditer(method_pattern, body):
            name = match.group(1)
            params = match.group(2).strip()
            return_type = match.group(3).strip() if match.group(3) else 'void'
            
            methods.append({
                'name': name,
                'params': params,
                'return_type': return_type
            })
        
        return methods
    
    def extract_class_properties(self, body: str) -> List[Dict]:
        """Extract properties from class body."""
        properties = []
        prop_pattern = r'(?:private|public|protected)\s+(?:readonly\s+)?(\w+):\s*([^;=]+)'
        
        for match in re.finditer(prop_pattern, body):
            properties.append({
                'name': match.group(1),
                'type': match.group(2).strip()
            })
        
        return properties
    
    def analyze_functions(self):
        """Extract function definitions."""
        # Regular functions
        func_pattern = r'(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?\s*\{'
        
        for match in re.finditer(func_pattern, self.content):
            name = match.group(1)
            params = match.group(2).strip()
            return_type = match.group(3).strip() if match.group(3) else 'void'
            line = self.content[:match.start()].count('\n') + 1
            
            # Try to extract JSDoc comment
            doc = self.extract_jsdoc(match.start())
            
            self.functions.append({
                'name': name,
                'params': params,
                'return_type': return_type,
                'line': line,
                'doc': doc
            })
        
        # Arrow functions assigned to const
        arrow_pattern = r'(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)(?:\s*:\s*([^=]+))?\s*=>'
        
        for match in re.finditer(arrow_pattern, self.content):
            name = match.group(1)
            params = match.group(2).strip()
            return_type = match.group(3).strip() if match.group(3) else 'any'
            line = self.content[:match.start()].count('\n') + 1
            
            doc = self.extract_jsdoc(match.start())
            
            self.functions.append({
                'name': name,
                'params': params,
                'return_type': return_type,
                'line': line,
                'doc': doc,
                'style': 'arrow'
            })
    
    def analyze_constants(self):
        """Extract constant definitions."""
        const_pattern = r'(?:export\s+)?const\s+(\w+)(?::\s*([^=]+))?\s*=\s*([^;]+);'
        
        for match in re.finditer(const_pattern, self.content):
            name = match.group(1)
            type_hint = match.group(2).strip() if match.group(2) else None
            value = match.group(3).strip()
            line = self.content[:match.start()].count('\n') + 1
            
            # Skip if it's actually a function (already captured)
            if '=>' in value or 'function' in value:
                continue
            
            self.constants.append({
                'name': name,
                'type': type_hint,
                'value': value[:100] if len(value) > 100 else value,
                'line': line
            })
    
    def analyze_enums(self):
        """Extract enum definitions."""
        enum_pattern = r'(?:export\s+)?enum\s+(\w+)\s*\{([^}]+)\}'
        
        for match in re.finditer(enum_pattern, self.content):
            name = match.group(1)
            body = match.group(2)
            line = self.content[:match.start()].count('\n') + 1
            
            # Extract enum values
            values = [v.strip() for v in body.split(',') if v.strip()]
            
            self.enums.append({
                'name': name,
                'values': values,
                'line': line
            })
    
    def extract_jsdoc(self, pos: int) -> Optional[str]:
        """Extract JSDoc comment before a position."""
        # Look backwards for JSDoc
        before = self.content[:pos]
        jsdoc_pattern = r'/\*\*([^*]*\*+(?:[^/*][^*]*\*+)*)/\s*$'
        match = re.search(jsdoc_pattern, before)
        
        if match:
            doc = match.group(1)
            # Clean up the doc
            doc = re.sub(r'^\s*\*\s?', '', doc, flags=re.MULTILINE)
            return doc.strip()
        
        return None
    
    def generate_report(self, output_file: str):
        """Generate comprehensive report."""
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("# NEXUS Runtime File (nexus-runtime.ts) - Complete Analysis\n\n")
            f.write(f"**File**: `{self.file_path}`  \n")
            f.write(f"**Lines**: {len(self.lines):,}  \n")
            f.write(f"**Size**: {len(self.content) / 1024:.1f} KB  \n\n")
            
            f.write("---\n\n")
            
            # Table of Contents
            f.write("## 📑 Table of Contents\n\n")
            f.write("1. [Overview](#overview)\n")
            f.write("2. [Imports](#imports)\n")
            f.write("3. [Interfaces](#interfaces)\n")
            f.write("4. [Types](#types)\n")
            f.write("5. [Enums](#enums)\n")
            f.write("6. [Classes](#classes)\n")
            f.write("7. [Functions](#functions)\n")
            f.write("8. [Constants](#constants)\n")
            f.write("9. [Complexity Metrics](#complexity-metrics)\n\n")
            
            f.write("---\n\n")
            
            # Overview
            f.write("## 📊 Overview\n\n")
            f.write(f"- **Imports**: {len(self.imports)}\n")
            f.write(f"- **Interfaces**: {len(self.interfaces)}\n")
            f.write(f"- **Types**: {len(self.types)}\n")
            f.write(f"- **Enums**: {len(self.enums)}\n")
            f.write(f"- **Classes**: {len(self.classes)}\n")
            f.write(f"- **Functions**: {len(self.functions)}\n")
            f.write(f"- **Constants**: {len(self.constants)}\n\n")
            
            # Imports
            if self.imports:
                f.write("## 📦 Imports\n\n")
                f.write("External dependencies and internal modules:\n\n")
                for imp in self.imports:
                    if imp['type'] == 'named':
                        items = ', '.join(imp['items'])
                        f.write(f"- `{{{items}}}` from `{imp['from']}`\n")
                    else:
                        f.write(f"- `{imp['item']}` from `{imp['from']}`\n")
                f.write("\n")
            
            # Interfaces
            if self.interfaces:
                f.write("## 🔷 Interfaces\n\n")
                for iface in self.interfaces:
                    f.write(f"### `{iface['name']}`\n\n")
                    if iface['extends']:
                        f.write(f"**Extends**: `{iface['extends']}`\n\n")
                    f.write(f"**Line**: {iface['line']}\n\n")
                    
                    if iface['properties']:
                        f.write("**Properties**:\n\n")
                        f.write("| Property | Type | Optional |\n")
                        f.write("|----------|------|----------|\n")
                        for prop in iface['properties']:
                            optional = "✓" if prop['optional'] else ""
                            f.write(f"| `{prop['name']}` | `{prop['type']}` | {optional} |\n")
                        f.write("\n")
                    f.write("---\n\n")
            
            # Types
            if self.types:
                f.write("## 🏷️  Types\n\n")
                for typ in self.types:
                    f.write(f"### `{typ['name']}`\n\n")
                    f.write(f"**Line**: {typ['line']}\n\n")
                    f.write(f"```typescript\n")
                    f.write(f"type {typ['name']} = {typ['definition']}\n")
                    f.write(f"```\n\n")
                f.write("---\n\n")
            
            # Enums
            if self.enums:
                f.write("## 🔢 Enums\n\n")
                for enum in self.enums:
                    f.write(f"### `{enum['name']}`\n\n")
                    f.write(f"**Line**: {enum['line']}\n\n")
                    f.write("**Values**:\n")
                    for val in enum['values']:
                        f.write(f"- `{val}`\n")
                    f.write("\n---\n\n")
            
            # Classes
            if self.classes:
                f.write("## 🎯 Classes\n\n")
                for cls in self.classes:
                    f.write(f"### `{cls['name']}`\n\n")
                    if cls['extends']:
                        f.write(f"**Extends**: `{cls['extends']}`\n\n")
                    if cls['implements']:
                        f.write(f"**Implements**: `{cls['implements']}`\n\n")
                    f.write(f"**Line**: {cls['line']}\n\n")
                    
                    if cls['properties']:
                        f.write("**Properties**:\n\n")
                        for prop in cls['properties']:
                            f.write(f"- `{prop['name']}: {prop['type']}`\n")
                        f.write("\n")
                    
                    if cls['methods']:
                        f.write("**Methods**:\n\n")
                        for method in cls['methods']:
                            params = method['params'] if method['params'] else ''
                            f.write(f"- `{method['name']}({params}): {method['return_type']}`\n")
                        f.write("\n")
                    
                    f.write("---\n\n")
            
            # Functions
            if self.functions:
                f.write("## ⚙️  Functions\n\n")
                f.write(f"Total functions: {len(self.functions)}\n\n")
                
                for func in sorted(self.functions, key=lambda x: x['line']):
                    style = func.get('style', 'regular')
                    icon = "🔸" if style == 'arrow' else "🔹"
                    
                    f.write(f"{icon} **`{func['name']}`** (line {func['line']})\n\n")
                    
                    f.write(f"```typescript\n")
                    if style == 'arrow':
                        f.write(f"const {func['name']} = ({func['params']}): {func['return_type']} => ...\n")
                    else:
                        f.write(f"function {func['name']}({func['params']}): {func['return_type']}\n")
                    f.write(f"```\n\n")
                    
                    if func.get('doc'):
                        f.write(f"_{func['doc']}_\n\n")
                    
                    f.write("---\n\n")
            
            # Constants
            if self.constants:
                f.write("## 📌 Constants\n\n")
                for const in self.constants:
                    type_info = f": {const['type']}" if const['type'] else ""
                    f.write(f"- **`{const['name']}`**{type_info} (line {const['line']})\n")
                    if len(const['value']) < 80:
                        f.write(f"  - Value: `{const['value']}`\n")
                f.write("\n")
            
            # Complexity Metrics
            f.write("## 📈 Complexity Metrics\n\n")
            f.write(f"- **Lines of Code**: {len(self.lines):,}\n")
            f.write(f"- **Average Function Length**: {len(self.lines) // len(self.functions) if self.functions else 0} lines\n")
            f.write(f"- **Total Methods**: {sum(len(c['methods']) for c in self.classes)}\n")
            f.write(f"- **Total Properties**: {sum(len(c['properties']) for c in self.classes)}\n")
            f.write(f"- **Interface Properties**: {sum(len(i['properties']) for i in self.interfaces)}\n\n")
            
            # Recommendations
            f.write("## 💡 Recommendations\n\n")
            if len(self.lines) > 1000:
                f.write("- ⚠️  **Large file**: Consider splitting into smaller modules\n")
            if len(self.functions) > 30:
                f.write("- ⚠️  **Many functions**: Consider organizing into classes or separate files\n")
            if len(self.classes) > 10:
                f.write("- ⚠️  **Many classes**: Consider creating separate files per class\n")
            f.write("\n")
    
    def print_summary(self):
        """Print a quick summary to console."""
        print("=" * 65)
        print("📊 ANALYSIS SUMMARY")
        print("=" * 65)
        print(f"\n📦 Imports: {len(self.imports)}")
        if self.imports:
            print("\n  Top imports:")
            for imp in self.imports[:5]:
                if imp['type'] == 'named':
                    print(f"    • {', '.join(imp['items'][:3])}... from {imp['from']}")
                else:
                    print(f"    • {imp['item']} from {imp['from']}")
        
        print(f"\n🔷 Interfaces: {len(self.interfaces)}")
        if self.interfaces:
            for iface in self.interfaces[:5]:
                props = len(iface['properties'])
                print(f"    • {iface['name']} ({props} properties)")
        
        print(f"\n🎯 Classes: {len(self.classes)}")
        if self.classes:
            for cls in self.classes[:5]:
                methods = len(cls['methods'])
                print(f"    • {cls['name']} ({methods} methods)")
        
        print(f"\n⚙️  Functions: {len(self.functions)}")
        if self.functions:
            print("\n  Function list:")
            for func in self.functions[:10]:
                print(f"    • {func['name']}() - line {func['line']}")
            if len(self.functions) > 10:
                print(f"    ... and {len(self.functions) - 10} more")
        
        print(f"\n📌 Constants: {len(self.constants)}")
        
        print(f"\n🔢 Enums: {len(self.enums)}")
        
        print("\n" + "=" * 65)
        print()


def main():
    """Main entry point."""
    file_path = '/workspaces/data-folder/nexus2/nexus2/runtime/nexus/nexus-runtime.ts'
    
    print("\n🐍 Pythonista analyzing nexus-runtime.ts...\n")
    
    analyzer = RuntimeFileAnalyzer(file_path)
    analyzer.analyze()
    
    # Print summary
    analyzer.print_summary()
    
    # Generate report
    output_file = '/workspaces/data-folder/NEXUS_RUNTIME_ANALYSIS.md'
    print(f"📝 Generating detailed report...")
    analyzer.generate_report(output_file)
    
    print(f"✅ Report saved to: {output_file}\n")
    
    print("╔═══════════════════════════════════════════════════════════════╗")
    print("║              ✅ ANALYSIS COMPLETE!                            ║")
    print("╚═══════════════════════════════════════════════════════════════╝")
    print(f"\n📖 Read the full report:")
    print(f"   cat {output_file} | less\n")


if __name__ == '__main__':
    main()
