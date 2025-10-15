#!/usr/bin/env python3
"""
🚀 NEXUS ENTERPRISE COLOR CONTRAST FIXER
Advanced WCAG AAA compliance automation with AI-powered color adjustment
"""

import re
import json
import sys
from pathlib import Path
from typing import Tuple, Optional, List, Dict, Any
from dataclasses import dataclass
import logging
import hashlib
import time

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class ColorFix:
    original_color: str
    adjusted_color: str
    contrast_ratio: float
    element: str
    property_type: str
    strategy_used: str
    confidence: float

@dataclass
class FixReport:
    total_elements: int
    fixes_applied: int
    fixes_skipped: int
    wcag_compliance: float
    color_changes: List[ColorFix]
    processing_time: float
    file_hash: str

class AdvancedColorContrastFixer:
    def __init__(self, target_ratio: float = 7.0, strategy: str = "perceptual"):
        self.target_ratio = target_ratio
        self.strategy = strategy
        self.fixes_applied = 0
        self.color_cache = {}
        
        self.named_colors = {
            'white': (255, 255, 255), 'black': (0, 0, 0),
            'red': (255, 0, 0), 'green': (0, 128, 0), 'blue': (0, 0, 255),
            'yellow': (255, 255, 0), 'cyan': (0, 255, 255), 'magenta': (255, 0, 255),
            'gray': (128, 128, 128), 'grey': (128, 128, 128),
        }

    def hex_to_rgb(self, hex_color: str) -> Tuple[int, int, int]:
        hex_color = hex_color.strip().lstrip('#')
        if len(hex_color) == 3:
            hex_color = ''.join([c*2 for c in hex_color])
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

    def rgb_to_hex(self, r: int, g: int, b: int) -> str:
        return f'#{r:02x}{g:02x}{b:02x}'

    def relative_luminance(self, r: int, g: int, b: int) -> float:
        def adjust_channel(c):
            c = c / 255.0
            return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
        return 0.2126 * adjust_channel(r) + 0.7152 * adjust_channel(g) + 0.0722 * adjust_channel(b)

    def contrast_ratio(self, color1: Tuple[int, int, int], color2: Tuple[int, int, int]) -> float:
        l1 = self.relative_luminance(*color1)
        l2 = self.relative_luminance(*color2)
        lighter = max(l1, l2)
        darker = min(l1, l2)
        return (lighter + 0.05) / (darker + 0.05)

    def rgb_to_hsl(self, r: int, g: int, b: int) -> Tuple[float, float, float]:
        r_norm, g_norm, b_norm = r / 255.0, g / 255.0, b / 255.0
        max_val = max(r_norm, g_norm, b_norm)
        min_val = min(r_norm, g_norm, b_norm)
        lightness = (max_val + min_val) / 2.0
        
        if max_val == min_val:
            return 0.0, 0.0, lightness
        
        diff = max_val - min_val
        saturation = diff / (2.0 - max_val - min_val) if lightness > 0.5 else diff / (max_val + min_val)
        
        if max_val == r_norm:
            hue = (g_norm - b_norm) / diff + (6.0 if g_norm < b_norm else 0.0)
        elif max_val == g_norm:
            hue = (b_norm - r_norm) / diff + 2.0
        else:
            hue = (r_norm - g_norm) / diff + 4.0
        
        return hue / 6.0, saturation, lightness

    def hsl_to_rgb(self, h: float, s: float, l: float) -> Tuple[int, int, int]:
        def hue_to_rgb(p: float, q: float, t: float) -> float:
            t = t % 1.0
            if t < 1/6: return p + (q - p) * 6 * t
            if t < 1/2: return q
            if t < 2/3: return p + (q - p) * (2/3 - t) * 6
            return p
        
        if s == 0:
            r = g = b = l
        else:
            q = l * (1 + s) if l < 0.5 else l + s - l * s
            p = 2 * l - q
            r = hue_to_rgb(p, q, h + 1/3)
            g = hue_to_rgb(p, q, h)
            b = hue_to_rgb(p, q, h - 1/3)
        
        return int(r * 255), int(g * 255), int(b * 255)

    def adjust_color_hsl(self, color: Tuple[int, int, int], bg_color: Tuple[int, int, int], 
                        adjust_foreground: bool = True) -> Tuple[int, int, int]:
        h, s, l = self.rgb_to_hsl(*color)
        bg_luminance = self.relative_luminance(*bg_color)
        color_luminance = self.relative_luminance(*color)
        
        target_lighter = (color_luminance > bg_luminance) if adjust_foreground else (bg_luminance > color_luminance)
        
        step = 0.05
        for i in range(50):
            l = min(1.0, l + step) if target_lighter else max(0.0, l - step)
            adjusted = self.hsl_to_rgb(h, s, l)
            if self.contrast_ratio(adjusted, bg_color) >= self.target_ratio:
                return adjusted
            if i > 10:
                step *= 0.9
        return adjusted

    def adjust_color_perceptual(self, color: Tuple[int, int, int], bg_color: Tuple[int, int, int]) -> Tuple[int, int, int]:
        r, g, b = color
        color_lum = self.relative_luminance(r, g, b)
        bg_lum = self.relative_luminance(*bg_color)
        needs_lightening = color_lum < bg_lum
        adjustment_factor = 1.2
        
        for _ in range(20):
            if needs_lightening:
                r, g, b = min(255, int(r * adjustment_factor)), min(255, int(g * adjustment_factor)), min(255, int(b * adjustment_factor))
            else:
                r, g, b = max(0, int(r / adjustment_factor)), max(0, int(g / adjustment_factor)), max(0, int(b / adjustment_factor))
            
            if self.contrast_ratio((r, g, b), bg_color) >= self.target_ratio:
                return (r, g, b)
            adjustment_factor = 1.0 + (adjustment_factor - 1.0) * 0.8
        return (r, g, b)

    def adjust_color_for_contrast(self, fg_color: Tuple[int, int, int], bg_color: Tuple[int, int, int], 
                                 adjust_foreground: bool = True) -> Tuple[int, int, int]:
        if self.contrast_ratio(fg_color, bg_color) >= self.target_ratio:
            return fg_color if adjust_foreground else bg_color
        
        if self.strategy == "hsl":
            return self.adjust_color_hsl(fg_color, bg_color, adjust_foreground)
        elif self.strategy == "perceptual":
            return self.adjust_color_perceptual(fg_color, bg_color)
        else:
            hsl_result = self.adjust_color_hsl(fg_color, bg_color, adjust_foreground)
            return hsl_result if self.contrast_ratio(hsl_result, bg_color) >= self.target_ratio else self.adjust_color_perceptual(fg_color, bg_color)

    def parse_css_color(self, color_str: str) -> Optional[Tuple[int, int, int]]:
        if not color_str:
            return None
        color_str = color_str.strip().lower()
        
        if color_str.startswith('#'):
            try:
                return self.hex_to_rgb(color_str)
            except:
                return None
        
        rgb_match = re.match(r'rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+)?\s*\)', color_str)
        if rgb_match:
            return tuple(int(x) for x in rgb_match.groups()[:3])
        
        if color_str.startswith('var(') or color_str.startswith('--'):
            return None
        
        return self.named_colors.get(color_str)

    def fix_contrast_in_html(self, html: str) -> Tuple[str, List[ColorFix]]:
        fixes = []
        style_pattern = re.compile(r'style=["\']([^"\']+)["\']', re.IGNORECASE)
        
        def fix_style(match):
            style = match.group(1)
            original_style = style
            
            color_match = re.search(r'color:\s*([^;]+)', style, re.IGNORECASE)
            bg_match = re.search(r'background(?:-color)?:\s*([^;]+)', style, re.IGNORECASE)
            
            if color_match and bg_match:
                fg_str = color_match.group(1).strip()
                bg_str = bg_match.group(1).strip()
                
                if 'var(' in fg_str or 'var(' in bg_str or 'gradient' in fg_str or 'gradient' in bg_str:
                    return match.group(0)
                
                fg_color = self.parse_css_color(fg_str)
                bg_color = self.parse_css_color(bg_str)
                
                if fg_color and bg_color:
                    current_ratio = self.contrast_ratio(fg_color, bg_color)
                    if current_ratio < self.target_ratio:
                        new_fg = self.adjust_color_for_contrast(fg_color, bg_color)
                        new_fg_hex = self.rgb_to_hex(*new_fg)
                        new_ratio = self.contrast_ratio(new_fg, bg_color)
                        
                        style = re.sub(r'color:\s*' + re.escape(fg_str), f'color: {new_fg_hex}', style, flags=re.IGNORECASE)
                        
                        fixes.append(ColorFix(
                            original_color=fg_str,
                            adjusted_color=new_fg_hex,
                            contrast_ratio=new_ratio,
                            element="inline-style",
                            property_type="color",
                            strategy_used=self.strategy,
                            confidence=min(1.0, new_ratio / self.target_ratio)
                        ))
                        self.fixes_applied += 1
            
            return f'style="{style}"' if style != original_style else match.group(0)
        
        return style_pattern.sub(fix_style, html), fixes

def main():
    if len(sys.argv) < 3:
        print("Usage: contrast-fixer.py <input.html> <output.html> [--ratio 7.0] [--strategy perceptual]")
        sys.exit(1)
    
    input_file = Path(sys.argv[1])
    output_file = Path(sys.argv[2])
    
    ratio = 7.0
    strategy = "perceptual"
    
    if '--ratio' in sys.argv:
        ratio = float(sys.argv[sys.argv.index('--ratio') + 1])
    if '--strategy' in sys.argv:
        strategy = sys.argv[sys.argv.index('--strategy') + 1]
    
    fixer = AdvancedColorContrastFixer(target_ratio=ratio, strategy=strategy)
    
    with open(input_file, 'r', encoding='utf-8') as f:
        html = f.read()
    
    start = time.time()
    fixed_html, fixes = fixer.fix_contrast_in_html(html)
    elapsed = time.time() - start
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(fixed_html)
    
    logger.info(f"✅ Fixed {len(fixes)} contrast issues in {elapsed:.2f}s")
    logger.info(f"📊 Output: {output_file}")

if __name__ == '__main__':
    main()
