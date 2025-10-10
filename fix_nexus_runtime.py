#!/usr/bin/env python3
"""
NEXUS TypeScript File Cleanup Utility
Created with Pythonista personality guidance

This script cleans up corrupted TypeScript files by:
1. Removing duplicate content and commentary
2. Identifying the valid TypeScript code structure
3. Creating a clean backup of the file
"""

import re
import sys
from pathlib import Path
from datetime import datetime


class TypeScriptCleaner:
    """Clean and repair corrupted TypeScript files."""
    
    def __init__(self, file_path: str):
        self.file_path = Path(file_path)
        self.backup_path = self.file_path.with_suffix('.ts.backup')
        self.content = ""
        self.cleaned_content = ""
        
    def read_file(self) -> None:
        """Read the corrupted TypeScript file."""
        try:
            with open(self.file_path, 'r', encoding='utf-8') as f:
                self.content = f.read()
            print(f"✅ Read {len(self.content)} characters from {self.file_path}")
        except Exception as e:
            print(f"❌ Error reading file: {e}")
            sys.exit(1)
            
    def create_backup(self) -> None:
        """Create a timestamped backup of the original file."""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_path = self.file_path.with_name(
            f"{self.file_path.stem}.backup_{timestamp}{self.file_path.suffix}"
        )
        try:
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(self.content)
            print(f"💾 Backup created: {backup_path}")
        except Exception as e:
            print(f"⚠️ Warning: Could not create backup: {e}")
            
    def find_valid_code_start(self) -> int:
        """Find where the valid TypeScript code actually starts."""
        lines = self.content.split('\n')
        
        # Look for the proper shebang + import pattern
        for i, line in enumerate(lines):
            # Find a line with proper import statement
            if line.strip().startswith('import {') and 'from' in line:
                # Check if there's a shebang nearby (within 20 lines)
                for j in range(max(0, i-20), i):
                    if lines[j].strip() == '#!/usr/bin/env node':
                        # Found valid start with shebang
                        return j
                # If no shebang found, start from here
                return i
        
        # Fallback: look for any import statement
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                return i
                
        return 0
    
    def remove_duplicates(self, text: str) -> str:
        """Remove obvious duplicate sections and inline duplicates."""
        lines = text.split('\n')
        result_lines = []
        seen_imports = set()
        
        for line in lines:
            stripped = line.strip()
            
            # Skip empty lines initially (we'll add them back later)
            if not stripped:
                result_lines.append(line)
                continue
            
            # Special handling for import statements - only keep first occurrence
            if stripped.startswith('import '):
                # Normalize the import statement
                import_key = ' '.join(stripped.split())
                if import_key in seen_imports:
                    continue  # Skip duplicate import
                seen_imports.add(import_key)
                result_lines.append(line)
                continue
            
            # Check if line has inline duplication (text appears twice on same line)
            # Look for patterns like "import X from 'y';import X from 'y';"
            if 'import' in stripped and stripped.count('import') > 1:
                # Split on 'import' and take only the first occurrence
                parts = stripped.split('import')
                if len(parts) > 2:
                    line = 'import' + parts[1]
            
            result_lines.append(line)
        
        return '\n'.join(result_lines)
    
    def remove_commentary_noise(self, text: str) -> str:
        """Remove non-code commentary that's mixed into the code."""
        lines = text.split('\n')
        cleaned_lines = []
        
        # Patterns that indicate noise/commentary
        noise_patterns = [
            r'^Looking at your TypeScript',
            r'^## Enhanced TypeScript Version',
            r'^```typescript',
            r'^```$',
        ]
        
        for line in lines:
            stripped = line.strip()
            
            # Check if line matches any noise pattern
            is_noise = any(re.match(pattern, stripped) for pattern in noise_patterns)
            
            if not is_noise:
                cleaned_lines.append(line)
        
        return '\n'.join(cleaned_lines)
    
    def clean_file(self) -> None:
        """Main cleaning process."""
        print("\n🔧 Starting cleanup process...")
        
        # Find where valid code starts
        valid_start = self.find_valid_code_start()
        print(f"📍 Valid code starts at line {valid_start}")
        
        # Extract from valid start point
        lines = self.content.split('\n')
        valid_content = '\n'.join(lines[valid_start:])
        
        print(f"✂️ Extracted {len(valid_content)} characters of valid content")
        
        # Remove duplicates
        deduplicated = self.remove_duplicates(valid_content)
        print(f"🗑️ After deduplication: {len(deduplicated)} characters")
        
        # Remove commentary noise
        cleaned = self.remove_commentary_noise(deduplicated)
        print(f"🧹 After noise removal: {len(cleaned)} characters")
        
        # Ensure it starts with shebang
        if not cleaned.strip().startswith('#!/usr/bin/env node'):
            cleaned = '#!/usr/bin/env node\n\n' + cleaned
            print("➕ Added shebang")
        
        self.cleaned_content = cleaned
        print(f"✅ Cleaning complete: {len(self.cleaned_content)} characters")
        
    def write_cleaned_file(self, output_path: str | None = None) -> str:
        """Write the cleaned content to a file."""
        output_file: Path
        if output_path is None:
            output_file = self.file_path.with_name(
                f"{self.file_path.stem}.cleaned{self.file_path.suffix}"
            )
        else:
            output_file = Path(output_path)
            
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(self.cleaned_content)
            print(f"💾 Cleaned file written to: {output_file}")
            print(f"📊 File size: {len(self.cleaned_content)} characters")
            return str(output_file)
        except Exception as e:
            print(f"❌ Error writing file: {e}")
            sys.exit(1)
    
    def analyze(self) -> dict:
        """Analyze the file and return statistics."""
        original_lines = len(self.content.split('\n'))
        cleaned_lines = len(self.cleaned_content.split('\n'))
        
        return {
            'original_size': len(self.content),
            'cleaned_size': len(self.cleaned_content),
            'original_lines': original_lines,
            'cleaned_lines': cleaned_lines,
            'reduction_percent': round((1 - len(self.cleaned_content)/len(self.content)) * 100, 2),
        }


def main():
    """Main entry point."""
    print("🐍 NEXUS TypeScript Cleanup Utility")
    print("=" * 50)
    
    # File path
    file_path = "/workspaces/data-folder/nexus2/nexus2/runtime/nexus/nexus-runtime.ts"
    
    # Create cleaner instance
    cleaner = TypeScriptCleaner(file_path)
    
    # Read original file
    cleaner.read_file()
    
    # Create backup
    cleaner.create_backup()
    
    # Clean the file
    cleaner.clean_file()
    
    # Write cleaned version
    output_path = cleaner.write_cleaned_file()
    
    # Show statistics
    stats = cleaner.analyze()
    print("\n📊 Cleanup Statistics:")
    print(f"   Original: {stats['original_size']:,} chars, {stats['original_lines']:,} lines")
    print(f"   Cleaned:  {stats['cleaned_size']:,} chars, {stats['cleaned_lines']:,} lines")
    print(f"   Reduction: {stats['reduction_percent']}%")
    
    print(f"\n✨ Success! Cleaned file available at:")
    print(f"   {output_path}")
    print(f"\n💡 To use the cleaned version:")
    print(f"   mv {output_path} {file_path}")
    

if __name__ == "__main__":
    main()
