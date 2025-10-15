#!/usr/bin/env python3
"""
NEXUS UX Applier - Pattern Application Engine
Injects intelligent UX enhancements into HTML while maintaining AAA compliance
"""

import json
import sys
import re
from pathlib import Path
from typing import Dict, List, Any
from bs4 import BeautifulSoup

class UXPatternApplier:
    """Applies UX patterns to HTML with surgical precision"""
    
    def __init__(self, pattern_library: Dict, enhancements: Dict):
        self.patterns = pattern_library["patterns"]
        self.enhancements = enhancements
        self.motion_safety = pattern_library.get("motion_safety", {})
        self.applied_count = 0
        self.css_blocks = []
        
    def apply_enhancements(self, html_content: str) -> str:
        """Apply all selected enhancements to HTML"""
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Build CSS from selected patterns
        self._build_css()
        
        # Inject CSS into head
        self._inject_css(soup)
        
        # Apply element-specific enhancements
        self._apply_to_elements(soup)
        
        return str(soup)
    
    def _build_css(self):
        """Build CSS from all selected patterns"""
        css_parts = []
        
        # Add motion safety first
        if self.motion_safety.get("prefers_reduced_motion"):
            css_parts.append(f"\n/* AAA Motion Safety */\n{self.motion_safety['prefers_reduced_motion']}")
        
        css_parts.append("\n/* NEXUS UX Enhancements - Adaptive Intelligence */")
        
        selections = self.enhancements.get("selections", {})
        
        for opp_type, selection_data in selections.items():
            for sel in selection_data.get("selected_patterns", []):
                pattern = sel["pattern"]
                score = sel["score"]
                
                css = self._generate_pattern_css(pattern, opp_type)
                if css:
                    css_parts.append(f"\n/* {pattern['name']} (Score: {score:.1f}/100) */")
                    css_parts.append(css)
                    self.applied_count += 1
        
        self.css_blocks = css_parts
    
    def _generate_pattern_css(self, pattern: Dict, opp_type: str) -> str:
        """Generate CSS for a specific pattern"""
        css_rules = pattern.get("css", {})
        target = pattern.get("target", "")
        
        if not css_rules or not target:
            return ""
        
        css_lines = []
        
        # Base styles
        if "base" in css_rules:
            css_lines.append(f"{target} {{")
            css_lines.append(f"  {css_rules['base']}")
            css_lines.append("}")
        
        # Hover styles
        if "hover" in css_rules:
            css_lines.append(f"{target}:hover {{")
            css_lines.append(f"  {css_rules['hover']}")
            css_lines.append("}")
        
        # Active styles
        if "active" in css_rules:
            css_lines.append(f"{target}:active {{")
            css_lines.append(f"  {css_rules['active']}")
            css_lines.append("}")
        
        # Focus styles
        if "focus" in css_rules:
            css_lines.append(f"{target}:focus {{")
            css_lines.append(f"  {css_rules['focus']}")
            css_lines.append("}")
        
        # Pseudo-elements (::before, ::after)
        if "before" in css_rules:
            css_lines.append(f"{target}::before {{")
            css_lines.append(f"  {css_rules['before']}")
            css_lines.append("}")
        
        if "after" in css_rules:
            css_lines.append(f"{target}::after {{")
            css_lines.append(f"  {css_rules['after']}")
            css_lines.append("}")
        
        # Hover pseudo-elements
        if "hover_before" in css_rules:
            css_lines.append(f"{target}:hover::before {{")
            css_lines.append(f"  {css_rules['hover_before']}")
            css_lines.append("}")
        
        # Animation keyframes
        if "animation" in css_rules:
            css_lines.append(css_rules['animation'])
        
        # Special states
        if "visible" in css_rules:
            css_lines.append(f"{target}.visible {{")
            css_lines.append(f"  {css_rules['visible']}")
            css_lines.append("}")
        
        if "loaded" in css_rules:
            css_lines.append(f"{target}.loaded {{")
            css_lines.append(f"  {css_rules['loaded']}")
            css_lines.append("}")
        
        if "active" in css_rules and "active" not in css_rules.get("base", ""):
            # Active state for dropdowns/modals
            css_lines.append(f"{target}.active {{")
            css_lines.append(f"  {css_rules['active']}")
            css_lines.append("}")
        
        return "\n".join(css_lines)
    
    def _inject_css(self, soup: BeautifulSoup):
        """Inject generated CSS into HTML head"""
        head = soup.find('head')
        if not head:
            head = soup.new_tag('head')
            if soup.html:
                soup.html.insert(0, head)
            else:
                soup.insert(0, head)
        
        # Create style tag
        style_tag = soup.new_tag('style')
        style_tag['data-nexus-ux'] = 'adaptive'
        style_tag.string = "\n" + "\n".join(self.css_blocks) + "\n"
        
        head.append(style_tag)
    
    def _apply_to_elements(self, soup: BeautifulSoup):
        """Apply element-specific modifications (classes, attributes)"""
        selections = self.enhancements.get("selections", {})
        
        for opp_type, selection_data in selections.items():
            for sel in selection_data.get("selected_patterns", []):
                pattern = sel["pattern"]
                
                # Add classes for patterns that need them
                if pattern["id"] == "scroll_reveal":
                    # Add scroll-reveal class to sections
                    sections = soup.find_all('section')
                    for section in sections[:4]:  # Limit to first 4
                        section['data-scroll-reveal'] = 'true'
                
                elif pattern["id"] == "image_lazy_fade":
                    # Add lazy-load class to images
                    images = soup.find_all('img')
                    for img in images:
                        if 'class' in img.attrs:
                            img['class'].append('lazy-fade')
                        else:
                            img['class'] = ['lazy-fade']
                
                elif pattern["id"] == "stat_count_up":
                    # Add counter data attributes to stats
                    stats = soup.find_all(class_=re.compile(r'stat'))
                    for stat in stats:
                        number_elem = stat.find(class_=re.compile(r'number|count'))
                        if number_elem:
                            number_elem['data-count-up'] = 'true'


def main():
    if len(sys.argv) < 3:
        print("Usage: python3 nexus-ux-applier.py <input.html> <enhancements.json>")
        sys.exit(1)
    
    html_file = sys.argv[1]
    enhancements_file = sys.argv[2]
    output_file = html_file.replace(".html", "-enhanced.html")
    
    print("\n" + "="*70)
    print("🎨 NEXUS UX Applier - Pattern Application Engine")
    print("   Injecting Adaptive Intelligence")
    print("="*70 + "\n")
    
    # Load inputs
    print(f"📄 Loading HTML: {html_file}")
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    print(f"📊 Loading enhancements: {enhancements_file}")
    with open(enhancements_file, 'r') as f:
        enhancements = json.load(f)
    
    print(f"📚 Loading pattern library...")
    with open("ux-patterns-library.json", 'r') as f:
        pattern_library = json.load(f)
    
    # Apply enhancements
    print("\n🎨 Applying UX patterns...")
    applier = UXPatternApplier(pattern_library, enhancements)
    enhanced_html = applier.apply_enhancements(html_content)
    
    print(f"   ✅ Applied {applier.applied_count} unique patterns")
    print(f"   📝 Generated {len(applier.css_blocks)} CSS blocks")
    
    # Calculate size increase
    original_size = len(html_content)
    enhanced_size = len(enhanced_html)
    size_increase = enhanced_size - original_size
    size_increase_pct = (size_increase / original_size) * 100
    
    print(f"\n📊 Enhancement Stats:")
    print(f"   Original size: {original_size:,} bytes")
    print(f"   Enhanced size: {enhanced_size:,} bytes")
    print(f"   Increase: +{size_increase:,} bytes ({size_increase_pct:.1f}%)")
    
    # Save output
    print(f"\n💾 Saving enhanced HTML: {output_file}")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(enhanced_html)
    
    # Show pattern summary
    print("\n✨ Applied Patterns:")
    selections = enhancements.get("selections", {})
    for opp_type, selection_data in selections.items():
        count = selection_data.get("count", 0)
        for sel in selection_data.get("selected_patterns", []):
            pattern = sel["pattern"]
            score = sel["score"]
            print(f"   • {pattern['name']}")
            print(f"     → {count} elements | Score: {score:.1f}/100")
    
    print("\n" + "="*70)
    print("✅ Enhancement complete! UX patterns successfully applied.")
    print(f"📁 Output: {output_file}")
    print("="*70 + "\n")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
