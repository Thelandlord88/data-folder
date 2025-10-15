# 🔍 WCAG Compliance Checker - Production Guide

**NEXUS 4.5 Accessibility Testing System**

---

## 🎯 Overview

NEXUS 4.5 includes a production-ready WCAG compliance checker that analyzes HTML for accessibility issues and provides AI-powered insights from multiple personality perspectives.

### Features

- ✅ **3 Specialized Hunters** - Color contrast, image accessibility, semantic HTML
- 🧠 **4 AI Personalities** - Guardian, Pragmatist, Architect, Visionary
- 📊 **Strategic Intelligence** - Threat assessment, compliance scoring, business impact
- ⚡ **Real-time Analysis** - Process HTML in milliseconds
- 🎯 **Actionable Reports** - Specific fixes with time estimates

---

## 🚀 Quick Start

### 1. Start NEXUS

```bash
cd /workspaces/data-folder/Nexus-4.5
./start-nexus.sh --background
```

### 2. Check Your HTML

```bash
# Check local file
./check-wcag.sh mypage.html

# Check URL
./check-wcag.sh --url https://example.com

# Check NEXUS demo
./check-wcag.sh --demo
```

---

## 📋 API Usage

### Endpoint

```
POST http://127.0.0.1:8080/wcag-check
Content-Type: application/json
```

### Request

```json
{
  "html": "<!DOCTYPE html><html lang=\"en\">...</html>"
}
```

### Response Structure

```json
{
  "wcag_report": {
    "total_issues": 3,
    "status": "warn",
    "hunters_run": 3,
    "critical_hunters": ["ImageAccessibilityHunter"],
    "hunter_reports": {
      "ColorContrastHunter": { /* ... */ },
      "ImageAccessibilityHunter": { /* ... */ },
      "SemanticHtmlHunter": { /* ... */ }
    },
    "summary": {
      "wcag_a_compliance": "mostly-compliant",
      "wcag_aa_compliance": "mostly-compliant",
      "estimated_fix_time_minutes": 100
    },
    "next_actions": [ /* prioritized fixes */ ]
  },
  "personality_analysis": {
    "guardian": "🛡️ Security perspective...",
    "pragmatist": "🔧 Practical advice...",
    "architect": "🏗️ Structural insights...",
    "visionary": "🚀 Future opportunities..."
  },
  "intelligence_data": {
    "source": "wcag_hunters",
    "confidence": 0.8,
    "threatLevel": "medium",
    "complianceScore": 70,
    "findings": [ /* detailed issues */ ]
  },
  "strategic_implications": {
    "accessibilityImpact": [],
    "legalRisks": [],
    "businessImpact": [],
    "userExperienceImpact": [],
    "recommendations": []
  },
  "compliance_summary": {
    "level_a": "mostly-compliant",
    "level_aa": "mostly-compliant",
    "estimated_fix_time_minutes": 100
  }
}
```

---

## 🔍 What Gets Checked

### 1. Color Contrast Hunter

- **Checks:**
  - Text-to-background contrast ratios
  - WCAG AA compliance (4.5:1 for normal text)
  - WCAG AAA compliance (7:1 for normal text)
  
- **Catches:**
  - Low contrast text
  - Insufficient AA compliance
  - AAA enhancement opportunities

### 2. Image Accessibility Hunter

- **Checks:**
  - Missing `alt` attributes
  - Empty decorative images
  - Suspicious alt text (filenames, placeholders)
  
- **Catches:**
  - `<img>` without alt
  - Alt text using filenames
  - Non-descriptive alt text

### 3. Semantic HTML Hunter

- **Checks:**
  - HTML5 landmarks (main, nav, header, footer)
  - Heading hierarchy (h1 → h2 → h3)
  - Document language attribute
  - Generic containers vs semantic elements
  
- **Catches:**
  - Missing landmarks
  - Broken heading order
  - Missing `lang` attribute
  - Overuse of `<div>` tags

---

## 📊 Compliance Levels

### Status Indicators

- **✅ fully-compliant** - No issues, passes WCAG AA
- **⚠️ mostly-compliant** - Minor issues, mostly compliant
- **❌ needs-work** - Major issues, significant fixes needed

### Threat Levels

- **🟢 low** - 0 issues
- **🟡 medium** - 1-5 issues  
- **🔴 high** - 6+ issues
- **⚫ critical** - Severe accessibility barriers

### Compliance Scores

- **90-100** - Excellent accessibility
- **70-89** - Good, minor improvements needed
- **50-69** - Fair, moderate issues
- **0-49** - Poor, major work required

---

## 🧠 AI Personality Insights

### 🛡️ Guardian

**Focus:** Security, compliance, user protection

Highlights critical issues that could exclude users or expose legal risks.

### 🔧 Pragmatist

**Focus:** Practical fixes, time estimates, ROI

Provides actionable advice with time estimates and business justification.

### 🏗️ Architect

**Focus:** Structural improvements, system design

Suggests architectural changes to prevent future issues.

### 🚀 Visionary

**Focus:** Future opportunities, innovation

Explores how accessibility can enhance overall user experience.

---

## 💻 CLI Usage Examples

### Basic File Check

```bash
./check-wcag.sh index.html
```

**Output:**
- Color-coded compliance status
- Issue count and severity
- Top findings
- Recommended actions
- Full JSON saved to `/tmp/wcag-report-latest.json`

### URL Check

```bash
./check-wcag.sh --url https://mysite.com/page
```

Downloads HTML and runs analysis.

### Demo Check

```bash
./check-wcag.sh --demo
```

Analyzes the NEXUS bond-cleaning demo page.

### Integration with CI/CD

```bash
# Exit codes:
# 0 = fully compliant
# 1 = mostly compliant (warning)
# 2 = needs work (error)

./check-wcag.sh production.html
if [ $? -gt 1 ]; then
    echo "WCAG compliance failed!"
    exit 1
fi
```

---

## 🔗 cURL Examples

### Simple Check

```bash
curl -X POST http://127.0.0.1:8080/wcag-check \
  -H "Content-Type: application/json" \
  -d '{"html":"<!DOCTYPE html><html lang=\"en\"><body><h1>Test</h1></body></html>"}'
```

### From File

```bash
HTML_CONTENT=$(cat page.html | jq -Rs .)
curl -X POST http://127.0.0.1:8080/wcag-check \
  -H "Content-Type: application/json" \
  -d "{\"html\":$HTML_CONTENT}"
```

### Pretty Print Results

```bash
curl -X POST http://127.0.0.1:8080/wcag-check \
  -H "Content-Type: application/json" \
  -d '{"html":"..."}' | jq .
```

---

## 📈 Production Integration Patterns

### 1. Pre-Deployment Check

```bash
#!/bin/bash
# pre-deploy.sh

echo "🔍 Running WCAG compliance check..."
./check-wcag.sh dist/index.html

if [ $? -eq 2 ]; then
    echo "❌ Deployment blocked: Critical accessibility issues"
    exit 1
fi

echo "✅ WCAG check passed"
```

### 2. Continuous Monitoring

```bash
#!/bin/bash
# monitor-wcag.sh

for page in pages/*.html; do
    echo "Checking $page..."
    ./check-wcag.sh "$page" >> wcag-audit.log
done
```

### 3. API Integration (Node.js)

```javascript
const axios = require('axios');
const fs = require('fs');

async function checkWCAG(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  
  const response = await axios.post('http://127.0.0.1:8080/wcag-check', {
    html: html
  });
  
  const { compliance_summary, intelligence_data } = response.data;
  
  console.log(`Compliance: ${compliance_summary.level_aa}`);
  console.log(`Score: ${intelligence_data.complianceScore}/100`);
  
  return response.data;
}

checkWCAG('index.html');
```

### 4. Python Integration

```python
import requests
import json

def check_wcag(html_content):
    response = requests.post(
        'http://127.0.0.1:8080/wcag-check',
        json={'html': html_content}
    )
    
    report = response.json()
    
    print(f"Issues: {report['wcag_report']['total_issues']}")
    print(f"Score: {report['intelligence_data']['complianceScore']}/100")
    
    return report

with open('index.html') as f:
    html = f.read()
    check_wcag(html)
```

---

## 🎯 Common Issues & Fixes

### Issue: Missing Alt Text

**Finding:**
```
• Missing alt attribute on <img src="logo.png">
```

**Fix:**
```html
<!-- Before -->
<img src="logo.png">

<!-- After -->
<img src="logo.png" alt="Company Logo">
```

### Issue: Low Contrast

**Finding:**
```
• Insufficient contrast: #eee on white (4.5:1, requires 4.5:1)
```

**Fix:**
```css
/* Before */
color: #eee;
background: white;

/* After */
color: #666;
background: white;
```

### Issue: Missing Landmarks

**Finding:**
```
• Missing <nav> landmark
• Missing <main> landmark
```

**Fix:**
```html
<!-- Before -->
<div id="navigation">...</div>
<div id="content">...</div>

<!-- After -->
<nav>...</nav>
<main>...</main>
```

### Issue: Missing Language

**Finding:**
```
• Missing lang attribute on <html> element
```

**Fix:**
```html
<!-- Before -->
<html>

<!-- After -->
<html lang="en">
```

---

## 🔧 Troubleshooting

### NEXUS Not Running

```bash
# Check status
curl http://127.0.0.1:8080/status

# Start NEXUS
./start-nexus.sh --background

# View logs
tail -f logs/nexus.log
```

### Python Hunters Not Found

```bash
# Check hunters exist
ls -la hunters/wcag_hunters.py

# Test hunters directly
python3 hunters/wcag_hunters.py test.html
```

### Port Already in Use

```bash
# Find process
lsof -ti:8080

# Kill process
kill $(lsof -ti:8080)

# Restart NEXUS
./start-nexus.sh --background
```

---

## 📊 Performance Metrics

**Typical Analysis Time:**
- Small page (<100 KB): ~500ms
- Medium page (100-500 KB): ~1-2s
- Large page (>500 KB): ~2-5s

**Throughput:**
- ~20-30 checks per minute
- Parallel processing supported
- No rate limiting

---

## 🎁 Advanced Features

### Custom Python Hunters

Add new hunters to `hunters/wcag_hunters.py`:

```python
class CustomHunter(HunterBase):
    def __init__(self):
        super().__init__(
            module="custom_check",
            name="CustomHunter",
            version="1.0.0"
        )
    
    def hunt(self, html: str) -> HunterReport:
        # Your logic here
        pass
```

### TypeScript Type Extensions

Extend types in `src/types/wcag.types.ts`:

```typescript
export interface CustomIntelligence extends WcagIntelligenceData {
  customMetric: number;
  customData: any;
}
```

---

## 📚 Resources

- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **Color Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Screen Reader Testing:** NVDA (free), JAWS (commercial)
- **Accessibility Standards:** Section 508, ADA Title III

---

## ✅ Success Criteria

A page is considered **production-ready** when:

- ✅ WCAG AA compliance: `fully-compliant` or `mostly-compliant`
- ✅ Compliance score: ≥70/100
- ✅ Threat level: `low` or `medium`
- ✅ No critical issues (missing alt, missing lang, contrast failures)
- ✅ All AI personalities provide positive feedback

---

## 🚀 Next Steps

1. **Integrate into your build pipeline**
2. **Set up automated monitoring**
3. **Train team on common fixes**
4. **Document accessibility standards**
5. **Regular audits of production pages**

---

**Happy Testing! ♿🎯**

*Last Updated: October 12, 2025*
*NEXUS Version: 4.5*
