#!/usr/bin/env python3
import json
import re
import sys
from datetime import datetime

html_file = sys.argv[1] if len(sys.argv) > 1 else "docs/deep-blue-fishing.html"
output_file = html_file.replace(".html", "-ux-opportunities.json")

with open(html_file, 'r') as f:
    html = f.read()

html_lower = html.lower()

# Count opportunities
buttons = len(re.findall(r'<button', html, re.IGNORECASE)) + len(re.findall(r'type="submit"', html, re.IGNORECASE))
links = len(re.findall(r'<a[^>]*href', html, re.IGNORECASE))
inputs = len(re.findall(r'<input[^>]*type="(text|email|tel|password)"', html, re.IGNORECASE))
textareas = len(re.findall(r'<textarea', html, re.IGNORECASE))
selects = len(re.findall(r'<select', html, re.IGNORECASE))
total_inputs = inputs + textareas + selects
cards = len(re.findall(r'class="[^"]*card[^"]*"', html, re.IGNORECASE))
articles = len(re.findall(r'<article', html, re.IGNORECASE))
total_cards = cards + articles
nav_areas = len(re.findall(r'<nav', html, re.IGNORECASE))
nav_links = len(re.findall(r'nav.*?<a', html, re.IGNORECASE | re.DOTALL))
forms = len(re.findall(r'<form', html, re.IGNORECASE))
images = len(re.findall(r'<img', html, re.IGNORECASE))
sections = len(re.findall(r'<section', html, re.IGNORECASE))
stats = len(re.findall(r'class="[^"]*stat', html, re.IGNORECASE))
testimonials = len(re.findall(r'class="[^"]*testimonial', html, re.IGNORECASE))
prices = len(re.findall(r'class="[^"]*price', html, re.IGNORECASE))

total = buttons + links + total_inputs + total_cards + nav_links + images + sections + stats + testimonials + prices

data = {
    "file": html_file,
    "timestamp": datetime.now().isoformat(),
    "total_opportunities": total,
    "opportunities": {
        "buttons": {
            "count": buttons,
            "patterns": ["button_smooth_hover"],
            "priority": "high"
        },
        "links": {
            "count": links,
            "patterns": ["link_underline_slide"],
            "priority": "medium"
        },
        "form_inputs": {
            "count": total_inputs,
            "patterns": ["input_focus_glow"],
            "priority": "high"
        },
        "cards": {
            "count": total_cards,
            "patterns": ["card_elevation"],
            "priority": "medium"
        },
        "navigation": {
            "count": nav_links,
            "patterns": ["nav_item_highlight"],
            "priority": "medium"
        },
        "sections": {
            "count": sections,
            "patterns": ["scroll_reveal"],
            "priority": "medium"
        },
        "statistics": {
            "count": stats,
            "patterns": ["stat_count_up"],
            "priority": "high"
        },
        "testimonials": {
            "count": testimonials,
            "patterns": ["testimonial_fade_slide"],
            "priority": "medium"
        },
        "prices": {
            "count": prices,
            "patterns": ["price_highlight"],
            "priority": "medium"
        }
    }
}

with open(output_file, 'w') as f:
    json.dump(data, f, indent=2)

print(f"✅ Generated: {output_file}")
print(f"📊 Total opportunities: {total}")
