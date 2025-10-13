#!/usr/bin/env python3
"""
NEXUS Enhanced Contrast Fixer
Fixes color contrast in inline styles AND CSS custom properties
"""

import re
import colorsys
from typing import Tuple, Optional, Dict
import sys

def hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
    """Convert hex color to RGB"""
    hex_color = hex_color.lstrip('#')
    if len(hex_color) == 3:
        hex_color = ''.join([c*2 for c in hex_color])
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(r: int, g: int, b: int) -> str:
    """Convert RGB to hex"""
    return f'#{r:02x}{g:02x}{b:02x}'

def relative_luminance(r: int, g: int, b: int) -> float:
    """Calculate relative luminance (WCAG formula)"""
    def adjust(c):
        c = c / 255.0
        if c <= 0.03928:
            return c / 12.92
        return ((c + 0.055) / 1.055) ** 2.4
    
    return 0.2126 * adjust(r) + 0.7152 * adjust(g) + 0.0722 * adjust(b)

def contrast_ratio(color1: Tuple[int, int, int], color2: Tuple[int, int, int]) -> float:
    """Calculate contrast ratio between two colors"""
    l1 = relative_luminance(*color1)
    l2 = relative_luminance(*color2)
    
    lighter = max(l1, l2)
    darker = min(l1, l2)
    
    return (lighter + 0.05) / (darker + 0.05)

def adjust_color_for_contrast(
    color: Tuple[int, int, int],
    bg_color: Tuple[int, int, int],
    target_ratio: float = 7.0
) -> Tuple[int, int, int]:
    """Adjust a color to meet target contrast ratio"""
    current_ratio = contrast_ratio(color, bg_color)
    
    if current_ratio >= target_ratio:
        return color
    
    # Convert to HSL
    h, l, s = colorsys.rgb_to_hls(*[c/255.0 for c in color])
    
    # Determine direction (darken or lighten)
    bg_luminance = relative_luminance(*bg_color)
    color_luminance = relative_luminance(*color)
    
    if color_luminance > bg_luminance:
        direction = 1  # Lighten
    else:
        direction = -1  # Darken
    
    # Binary search for right lightness
    step = 0.05
    best = color
    best_ratio = current_ratio
    
    for _ in range(30):
        l += direction * step
        l = max(0.0, min(1.0, l))
        
        r, g, b = colorsys.hls_to_rgb(h, l, s)
        adjusted = (int(r*255), int(g*255), int(b*255))
        
        ratio = contrast_ratio(adjusted, bg_color)
        
        if ratio > best_ratio:
            best = adjusted
            best_ratio = ratio
        
        if ratio >= target_ratio:
            return adjusted
        
        step *= 0.9
    
    return best

def parse_css_color(color_str: str) -> Optional[Tuple[int, int, int]]:
    """Parse CSS color string to RGB"""
    color_str = color_str.strip().lower()
    
    if color_str.startswith('#'):
        try:
            return hex_to_rgb(color_str)
        except:
            return None
    
    rgb_match = re.match(r'rgba?\((\d+),\s*(\d+),\s*(\d+)', color_str)
    if rgb_match:
        return tuple(int(x) for x in rgb_match.groups())
    
    named_colors = {
        'white': (255, 255, 255), 'black': (0, 0, 0),
        'red': (255, 0, 0), 'green': (0, 128, 0), 'blue': (0, 0, 255),
    }
    
    return named_colors.get(color_str)

def fix_css_custom_properties(html: str, target_ratio: float = 7.0) -> Tuple[str, int]:
    """Fix color contrast in CSS custom properties"""
    fixes = 0
    
    # Find <style> tags
    style_pattern = re.compile(r'<style[^>]*>(.*?)</style>', re.DOTALL | re.IGNORECASE)
    
    def fix_style_block(match):
        nonlocal fixes
        css = match.group(1)
        original_css = css
        
        # Find :root or other selectors with custom properties
        # Look for patterns like: --text-color: #fff;
        prop_pattern = re.compile(
            r'(--[\w-]+):\s*(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)|[a-z]+);',
            re.IGNORECASE
        )
        
        # Extract all color custom properties
        color_props = {}
        for prop_match in prop_pattern.finditer(css):
            prop_name = prop_match.group(1)
            prop_value = prop_match.group(2)
            color = parse_css_color(prop_value)
            if color:
                color_props[prop_name] = (color, prop_value)
        
        # Try to identify text/background pairs
        # Common patterns: --text-* with --bg-*, --fg-* with --bg-*, etc.
        for text_prop, (text_color, text_value) in list(color_props.items()):
            # Look for corresponding background
            bg_candidates = []
            
            # Pattern 1: --text-* with --bg-* or --background-*
            if '--text' in text_prop or '--fg' in text_prop or '--color' in text_prop:
                for bg_prop, (bg_color, bg_value) in color_props.items():
                    if '--bg' in bg_prop or '--background' in bg_prop:
                        bg_candidates.append((bg_prop, bg_color, bg_value))
            
            # If we found a background, check contrast
            for bg_prop, bg_color, bg_value in bg_candidates:
                current_ratio = contrast_ratio(text_color, bg_color)
                
                if current_ratio < target_ratio:
                    # Adjust text color
                    new_color = adjust_color_for_contrast(text_color, bg_color, target_ratio)
                    new_hex = rgb_to_hex(*new_color)
                    
                    # Replace in CSS
                    css = re.sub(
                        f'({re.escape(text_prop)}):\s*{re.escape(text_value)};',
                        f'\\1: {new_hex};',
                        css
                    )
                    
                    if css != original_css:
                        print(f"   ✓ Fixed {text_prop} for AAA contrast with {bg_prop}")
                        fixes += 1
                        original_css = css
        
        if css != match.group(1):
            return f'<style>{css}</style>'
        return match.group(0)
    
    fixed_html = style_pattern.sub(fix_style_block, html)
    
    return fixed_html, fixes

def main():
    if len(sys.argv) != 3:
        print("Usage: contrast-fixer-enhanced.py <input.html> <output.html>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    print("   🎨 Analyzing color contrast (including CSS variables)...")
    
    with open(input_file, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Fix CSS custom properties
    fixed_html, css_fixes = fix_css_custom_properties(html, target_ratio=7.0)
    
    total_fixes = css_fixes
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(fixed_html)
    
    if total_fixes > 0:
        print(f"   ✓ Fixed {total_fixes} CSS custom property contrast issues for AAA compliance")
    else:
        print("   ℹ️  No fixable contrast issues found in CSS custom properties")
    
    return total_fixes

if __name__ == '__main__':
    main()
