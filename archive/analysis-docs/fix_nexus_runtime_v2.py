#!/usr/bin/env python3
"""
NEXUS TypeScript File Cleanup Utility V2
Handles inline duplicates where code is concatenated on the same line
"""

import re
from pathlib import Path
from datetime import datetime


def clean_typescript_file(file_path: str) -> None:
    """Clean up the TypeScript file with inline duplicates."""
    
    path = Path(file_path)
    
    # Read the file
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"📖 Read {len(content)} characters")
    
    # Create backup
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = path.with_name(f"{path.stem}.backup_{timestamp}{path.suffix}")
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"💾 Backup: {backup_path}")
    
    lines = content.split('\n')
    cleaned_lines = []
    
    for line in lines:
        # Handle lines with inline code duplication
        # Pattern: code + comment/code fragment + same code repeated
        
        # For import statements specifically
        if 'import' in line:
            # Check if import appears multiple times on the line
            import_count = line.count('import ')
            
            if import_count > 1:
                # Split and take only the first complete import statement
                # Look for the first semicolon as end of import
                first_semicolon = line.find(';')
                if first_semicolon > 0:
                    line = line[:first_semicolon + 1]
                else:
                    # No semicolon, look for 'from' pattern
                    match = re.match(r"^(import\s+.*?from\s+['\"].*?['\"])\s*[;]?", line)
                    if match:
                        line = match.group(1) + ';'
        
        # Remove trailing garbage after semicolon (like "import X from 'Y';import Z")
        if ';' in line and not line.strip().startswith('//'):
            # Find first semicolon
            semi_pos = line.find(';')
            rest = line[semi_pos+1:].strip()
            
            # If rest starts with 'import' or other code keywords, it's duplicate
            if rest and any(rest.startswith(kw) for kw in ['import', 'const', 'let', 'var', 'function', 'class', 'export', '*']):
                line = line[:semi_pos+1]
        
        cleaned_lines.append(line)
    
    # Now remove fully duplicate lines
    final_lines = []
    seen = set()
    
    for line in cleaned_lines:
        stripped = line.strip()
        
        # Keep empty lines
        if not stripped:
            final_lines.append(line)
            continue
        
        # For import statements, check if we've seen this exact import
        if stripped.startswith('import '):
            if stripped in seen:
                continue  # Skip duplicate import
            seen.add(stripped)
        
        final_lines.append(line)
    
    # Write cleaned version
    cleaned_content = '\n'.join(final_lines)
    output_path = path.with_name(f"{path.stem}.cleaned{path.suffix}")
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(cleaned_content)
    
    print(f"✅ Cleaned file: {output_path}")
    print(f"📊 Original: {len(content)} chars, Cleaned: {len(cleaned_content)} chars")
    print(f"🔄 Reduction: {((len(content) - len(cleaned_content)) / len(content) * 100):.1f}%")
    print(f"\n💡 To replace: mv {output_path} {path}")


if __name__ == "__main__":
    file_path = "/workspaces/data-folder/nexus2/nexus2/runtime/nexus/nexus-runtime.ts"
    clean_typescript_file(file_path)
