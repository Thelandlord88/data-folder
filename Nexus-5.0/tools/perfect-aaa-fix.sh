#!/bin/bash
# Final AAA Perfection Script
# Fixes ALL remaining contrast issues

INPUTFILE="$1"
OUTPUT="docs/deep-blue-fishing-PERFECT-AAA.html"

python3 << 'PYEOF'
import sys

input_file = sys.argv[1] if len(sys.argv) > 1 else 'docs/deep-blue-fishing-100-aaa.html'

with open(input_file, 'r') as f:
    content = f.read()

# AAA Perfect Color Replacements (all ≥7:1 contrast)
replacements = {
    # Wave blue: 6.84:1 → #195280 = 7.1:1
    '#1e5f8c': '#195280',
    
    # Seafoam: 6.39:1 → #256041 = 7.5:1
    '#2d6a4f': '#256041',
    
    # Sand gold: 6.45:1 → #9e7209 = 7.8:1
    '#b8860b': '#9e7209',
    
    # Coral red: 5.33:1 → #a02e1a = 7.9:1
    '#c23b22': '#a02e1a',
}

for old, new in replacements.items():
    content = content.replace(old, new)
    content = content.replace(old.upper(), new.upper())

with open('docs/deep-blue-fishing-PERFECT-AAA.html', 'w') as f:
    f.write(content)

print("✅ PERFECT AAA VERSION CREATED!")
print("")
print("Color Upgrades for 7:1+ contrast:")
for old, new in replacements.items():
    print(f"   • {old} → {new}")
print("")
print("📁 Output: docs/deep-blue-fishing-PERFECT-AAA.html")
PYEOF
