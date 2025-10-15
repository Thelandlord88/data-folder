#!/usr/bin/env python3
"""
NEXUS WCAG HTML Auto-Fixer
Applies automated fixes to HTML based on WCAG compliance report
"""

import json
import sys
import re

def load_report(report_file):
    """Load WCAG report"""
    with open(report_file, 'r') as f:
        return json.load(f)

def load_html(html_file):
    """Load original HTML"""
    with open(html_file, 'r') as f:
        return f.read()

def save_html(html_file, content):
    """Save fixed HTML"""
    with open(html_file, 'w') as f:
        f.write(content)

def fix_missing_lang(html):
    """Add missing lang attribute to html tag"""
    if '<html>' in html and 'lang=' not in html.split('<html>')[0:2][1].split('>')[0] if len(html.split('<html>')) > 1 else False:
        html = html.replace('<html>', '<html lang="en">')
        print("   ✓ Added lang='en' to <html> tag")
        return html, 1
    return html, 0

def fix_missing_alt_tags(html, findings):
    """Add missing alt attributes to images"""
    fixes = 0
    for finding in findings:
        if 'Missing alt attribute' in str(finding):
            element = finding.get('element', '')
            if '<img' in element and 'src=' in element:
                # Extract src value
                src_match = re.search(r'src=["\']([^"\']+)["\']', element)
                if src_match:
                    src = src_match.group(1)
                    # Generate descriptive alt text from filename
                    filename = src.split('/')[-1]
                    filename = re.sub(r'\.(jpg|jpeg|png|gif|svg|webp)$', '', filename, flags=re.IGNORECASE)
                    filename = filename.replace('-', ' ').replace('_', ' ')
                    alt_text = filename.title() if filename else 'Image'
                    
                    # Find this specific image without alt
                    pattern = re.compile(
                        r'<img([^>]*src=["\']([^"\']*' + re.escape(src.split('/')[-1]) + r')["\'][^>]*)(?<!alt=["\'][^"\']*")>',
                        re.IGNORECASE
                    )
                    
                    matches = pattern.findall(html)
                    if matches:
                        # Simple approach: find img tags without alt
                        old_tag = f'<img{matches[0][0]}>'
                        new_tag = f'<img{matches[0][0]} alt="{alt_text}">'
                        
                        if 'alt=' not in old_tag:
                            html = html.replace(old_tag, new_tag, 1)
                            print(f"   ✓ Added alt='{alt_text}' to image")
                            fixes += 1
    
    return html, fixes

def fix_semantic_landmarks(html, findings):
    """Add missing semantic HTML5 landmarks"""
    fixes = 0
    
    for finding in findings:
        issue = finding.get('issue', '')
        
        # Fix missing nav
        if 'Missing <nav> landmark' in issue and '<nav' not in html:
            # Look for navigation-like divs
            pattern = r'<div[^>]*(?:class|id)=["\'].*?(?:nav|menu|navigation)[^"\']*["\'][^>]*>'
            match = re.search(pattern, html, re.IGNORECASE)
            if match:
                old_div = match.group(0)
                new_nav = old_div.replace('<div', '<nav')
                html = html.replace(old_div, new_nav, 1)
                # Find corresponding closing tag (simplified)
                print(f"   ✓ Converted div to <nav> landmark")
                fixes += 1
        
        # Fix missing header
        elif 'Missing <header> landmark' in issue and '<header' not in html:
            pattern = r'<div[^>]*(?:class|id)=["\'].*?header[^"\']*["\'][^>]*>'
            match = re.search(pattern, html, re.IGNORECASE)
            if match:
                old_div = match.group(0)
                new_header = old_div.replace('<div', '<header')
                html = html.replace(old_div, new_header, 1)
                print(f"   ✓ Converted div to <header> landmark")
                fixes += 1
        
        # Fix missing footer
        elif 'Missing <footer> landmark' in issue and '<footer' not in html:
            pattern = r'<div[^>]*(?:class|id)=["\'].*?footer[^"\']*["\'][^>]*>'
            match = re.search(pattern, html, re.IGNORECASE)
            if match:
                old_div = match.group(0)
                new_footer = old_div.replace('<div', '<footer')
                html = html.replace(old_div, new_footer, 1)
                print(f"   ✓ Converted div to <footer> landmark")
                fixes += 1
        
        # Fix missing main
        elif 'Missing <main> landmark' in issue and '<main' not in html:
            print(f"   ℹ️  Note: Consider wrapping main content in <main> tag manually")
    
    return html, fixes

def main():
    if len(sys.argv) != 4:
        print("Usage: wcag-fixer.py <report.json> <input.html> <output.html>")
        sys.exit(1)
    
    report_file = sys.argv[1]
    input_file = sys.argv[2]
    output_file = sys.argv[3]
    
    print("   Applying fixes...")
    
    # Load files
    report = load_report(report_file)
    html = load_html(input_file)
    
    total_fixes = 0
    
    # Get findings
    findings = report.get('intelligence_data', {}).get('findings', [])
    
    # Apply fixes
    html, fixes = fix_missing_lang(html)
    total_fixes += fixes
    
    html, fixes = fix_missing_alt_tags(html, findings)
    total_fixes += fixes
    
    html, fixes = fix_semantic_landmarks(html, findings)
    total_fixes += fixes
    
    # Save fixed HTML
    save_html(output_file, html)
    
    print(f"\n   Total fixes applied: {total_fixes}")

if __name__ == '__main__':
    main()
