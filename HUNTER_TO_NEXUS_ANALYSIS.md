# Hunter Pack → NEXUS Translation

**Date:** 2025-10-12  
**Mission:** Reverse engineer hunter-pack brilliance for WCAG compliance hunting

---

## 🎯 WHAT MAKES HUNTER-PACK BRILLIANT

### Core Genius:

1. **Pattern Detection** - Finds issues by pattern matching
2. **Severity Levels** - Categorizes findings (critical, warning, info)
3. **Automated Reporting** - Generates structured JSON reports
4. **Modular Hunters** - Each hunter focuses on ONE thing
5. **Orchestration** - Master controller runs all hunters
6. **Actionable Results** - Not just "broken" but "here's why + fix"

---

## 🔍 HUNTER-PACK ARCHITECTURE (Original)

```
Language: Shell scripts
Target: Astro/Tailwind websites
Focus: Code quality, structure, best practices

hunters/
├── hunt-imports.sh       # Finds unused imports
├── hunt-components.sh    # Component issues
├── hunt-styles.sh        # CSS/Tailwind problems
├── hunt-images.sh        # Image optimization
├── hunt-a11y.sh          # Basic accessibility
└── ...

master-hunt.sh           # Orchestrator
```

### What Each Hunter Does:

```bash
# Example: hunt-images.sh
1. Find all image tags
2. Check for missing alt text
3. Check for proper formats (webp, etc)
4. Check for size optimization
5. Report findings with severity
```

---

## 🎨 NEXUS CURRENT CAPABILITIES

### What We Have:

1. ✅ **CSS Engine** - Generates design systems
2. ✅ **Personality AI** - Multi-perspective analysis
3. ✅ **Layout Validation** - Mathematical correctness
4. ✅ **HTTP API** - Serve results
5. ✅ **TypeScript/Node** - Runtime environment

### What We're Missing:

❌ **Code Analysis** - Can't inspect HTML/CSS yet
❌ **WCAG Testing** - No accessibility validation
❌ **Pattern Matching** - No hunter-style detection
❌ **Report Generation** - No structured findings

---

## 🚀 PROPOSED: NEXUS WCAG HUNTER SYSTEM

### Architecture:

```python
Language: Python (easier for HTML/CSS parsing)
Target: Generated NEXUS websites
Focus: WCAG 2.1 Level A, AA, AAA compliance

hunters/
├── wcag_color_contrast.py      # Color contrast ratios
├── wcag_semantic_html.py       # Proper HTML5 structure
├── wcag_keyboard_nav.py        # Tab order, focus states
├── wcag_aria_labels.py         # ARIA attributes
├── wcag_images.py              # Alt text, captions
├── wcag_forms.py               # Labels, error states
├── wcag_headings.py            # Heading hierarchy
└── wcag_links.py               # Link text, focus

orchestrator.py                 # Master controller
report_generator.py             # JSON/HTML reports
```

---

## 📋 WCAG COMPLIANCE LEVELS

### Level A (Basic)

- ✅ Text alternatives (alt text)
- ✅ Keyboard accessible
- ✅ Proper heading hierarchy
- ✅ Color not only indicator
- ✅ Form labels

### Level AA (Recommended)

- ✅ **Color contrast** - 4.5:1 for text, 3:1 for large text
- ✅ Resize text to 200%
- ✅ Focus visible
- ✅ Error identification
- ✅ Labels/instructions

### Level AAA (Enhanced)

- ✅ **Enhanced contrast** - 7:1 for text, 4.5:1 for large text
- ✅ No background audio
- ✅ Visual presentation controls
- ✅ Enhanced error suggestions

---

## 🔧 HUNTER PATTERN (Translated to Python)

### Original Shell Pattern:

```bash
#!/bin/bash
# hunt-images.sh

find_images() {
  grep -r "<img" src/ | while read line; do
    if ! echo "$line" | grep -q "alt="; then
      echo "WARNING: Missing alt text: $line"
    fi
  done
}
```

### New Python Pattern:

```python
#!/usr/bin/env python3
# wcag_images.py

from bs4 import BeautifulSoup
import re

class ImageWCAGHunter:
    def __init__(self, html_content):
        self.soup = BeautifulSoup(html_content, 'html.parser')
        self.findings = []
    
    def hunt(self):
        """Find WCAG image issues"""
        images = self.soup.find_all('img')
        
        for img in images:
            # Level A: Alt text required
            if not img.get('alt'):
                self.findings.append({
                    'level': 'A',
                    'severity': 'critical',
                    'rule': 'WCAG 1.1.1',
                    'element': str(img),
                    'issue': 'Missing alt attribute',
                    'fix': 'Add alt="" for decorative or alt="description" for meaningful images'
                })
            
            # Level AA: Decorative images should have empty alt
            elif img.get('alt') and self._is_decorative(img):
                self.findings.append({
                    'level': 'AA',
                    'severity': 'warning',
                    'rule': 'WCAG 1.1.1',
                    'element': str(img),
                    'issue': 'Decorative image should have empty alt',
                    'fix': 'Change alt to alt="" for decorative images'
                })
        
        return self.findings
```

---

## 🎯 INTEGRATION WITH NEXUS

### How Hunters Fit:

```
1. NEXUS generates HTML (CSS Engine)
   ↓
2. Python hunters analyze HTML
   ↓
3. Personality AI reviews findings
   ↓
4. Report generated with recommendations
   ↓
5. Serve via HTTP endpoint (/wcag-report)
```

### Example Workflow:

```bash
# User requests WCAG check
curl "http://localhost:8080/demo/bond-cleaning" \
  | python3 hunters/orchestrator.py \
  | curl -X POST http://localhost:8080/consciousness/analyze-wcag

# NEXUS responds with:
{
  "findings": 12,
  "critical": 2,
  "warnings": 7,
  "info": 3,
  "personalities": {
    "guardian": "Fix critical issues immediately",
    "pragmatist": "AA compliance is industry standard",
    "architect": "Build WCAG into generation pipeline"
  }
}
```

---

## 🛠️ IMPLEMENTATION PHASES

### Phase 1: Core Hunters (Python)

**Week 1:**
- ✅ Color contrast hunter
- ✅ Alt text hunter
- ✅ Heading hierarchy hunter
- ✅ Basic orchestrator

**Deliverable:** Working WCAG A/AA checker

### Phase 2: Advanced Hunters

**Week 2:**
- ✅ Keyboard navigation
- ✅ ARIA attributes
- ✅ Form validation
- ✅ Focus states

**Deliverable:** Full WCAG AA compliance

### Phase 3: NEXUS Integration

**Week 3:**
- ✅ HTTP endpoint: /wcag-check
- ✅ Personality AI analysis
- ✅ Auto-fix suggestions
- ✅ Real-time validation

**Deliverable:** Live WCAG checking in NEXUS

### Phase 4: AAA + Advanced

**Week 4:**
- ✅ WCAG AAA level
- ✅ Screen reader testing
- ✅ Performance insights
- ✅ Best practices

**Deliverable:** Production-ready hunter system

---

## 📊 HUNTER MODULES TO BUILD

### 1. Color Contrast Hunter
```python
# wcag_color_contrast.py
- Extract all text colors
- Extract all background colors
- Calculate contrast ratios
- Report violations (4.5:1 for AA, 7:1 for AAA)
```

### 2. Semantic HTML Hunter
```python
# wcag_semantic_html.py
- Check heading hierarchy (h1 → h2 → h3)
- Verify proper landmarks (<nav>, <main>, <footer>)
- Ensure lists use <ul>/<ol>
- Check form structure
```

### 3. Keyboard Navigation Hunter
```python
# wcag_keyboard_nav.py
- Verify tab order (tabindex)
- Check focus styles
- Ensure skip links
- Test interactive elements
```

### 4. ARIA Hunter
```python
# wcag_aria_labels.py
- Validate ARIA attributes
- Check role usage
- Verify aria-label/aria-labelledby
- Test live regions
```

---

## 🎨 REVERSE ENGINEERING HUNTER BRILLIANCE

### What Made Original Hunters Smart:

1. **Pattern Recognition**
   - Used regex to find patterns
   - Understood context (imports vs usage)
   - Knew what "good" looks like

2. **Severity Grading**
   - Critical: Breaks functionality
   - Warning: Best practice violation
   - Info: Optimization opportunity

3. **Actionable Feedback**
   - Not just "broken"
   - But "here's the issue + here's the fix"

4. **Modular Design**
   - Each hunter = one concern
   - Easy to add new hunters
   - Independent testing

### How We Apply to WCAG:

```python
class WCAGHunter:
    """Base class for all WCAG hunters"""
    
    def hunt(self):
        """Override in subclass"""
        raise NotImplementedError
    
    def report_finding(self, level, severity, rule, element, issue, fix):
        """Standardized finding format"""
        return {
            'wcag_level': level,      # A, AA, AAA
            'severity': severity,      # critical, warning, info
            'rule': rule,              # WCAG 1.1.1
            'element': element,        # HTML element
            'issue': issue,            # What's wrong
            'fix': fix,                # How to fix
            'hunter': self.__class__.__name__
        }
```

---

## 💡 HUNTER INSIGHTS FOR NEXUS

### Key Learnings:

1. **Automate Everything**
   - Hunters run automatically
   - No manual checking
   - Consistent results

2. **Structured Output**
   - JSON for machine reading
   - HTML for human reading
   - Severity for prioritization

3. **Fix Suggestions**
   - Don't just report problems
   - Suggest solutions
   - Show examples

4. **Integration Points**
   - Can run standalone
   - Can integrate with CI/CD
   - Can serve via API

---

## 🚀 FIRST HUNTER TO BUILD

Let's start with **Color Contrast Hunter** (most impactful):

```python
#!/usr/bin/env python3
# hunters/wcag_color_contrast.py

"""
WCAG Color Contrast Hunter
Checks text/background contrast ratios
Levels: AA (4.5:1), AAA (7:1)
"""

import re
from bs4 import BeautifulSoup
from colorsys import rgb_to_hls
import math

class ColorContrastHunter:
    # Implementation next...
```

---

## 🤔 QUESTIONS FOR THE TEAM

**Chief's Questions:**

1. **Priority order?** - Which hunters first?
2. **Integration timing?** - Build standalone or integrate immediately?
3. **Report format?** - JSON? HTML? Both?
4. **Auto-fix?** - Should hunters suggest OR fix?
5. **Personality involvement?** - How much AI analysis?

**Ready to start building?** ☕

---

**Next Steps:**
1. Get Chief's approval on approach
2. Build Color Contrast Hunter (proof of concept)
3. Test on NEXUS-generated HTML
4. Show results to consciousness team
5. Iterate and expand

