# 🎯 WCAG Toolkit - Complete Accessibility Suite

**Version:** 1.0.0  
**Date:** October 13, 2025  
**Purpose:** Detect and fix WCAG compliance issues automatically

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Detection Tools](#detection-tools)
4. [Fixing Tools](#fixing-tools)
5. [Automation Tools](#automation-tools)
6. [TypeScript Integration](#typescript-integration)
7. [Quick Start](#quick-start)
8. [Usage Examples](#usage-examples)

---

## 🎯 OVERVIEW

This toolkit provides **complete WCAG compliance detection and automated fixing** for HTML files.

**Capabilities:**
- ✅ Detect WCAG AA/AAA issues
- ✅ Automatically fix common problems
- ✅ Batch process multiple files
- ✅ Integrate with NEXUS runtime
- ✅ Learning from outcomes
- ✅ Generate detailed reports

**Compliance Levels:**
- **WCAG AA:** Standard web accessibility
- **WCAG AAA:** Enhanced accessibility (highest level)

---

## 📁 FILE STRUCTURE

```
wcag-toolkit/
├── README.md                          # This file
│
├── DETECTION SCRIPTS (Bash)
│   ├── check-wcag.sh                  # Standard WCAG AA/AAA checker
│   ├── check-wcag-aaa.sh              # Comprehensive AAA audit
│   └── wcag-summary.sh                # Summary report for multiple files
│
├── FIXING SCRIPTS (Python)
│   ├── wcag-fixer.py                  # Basic auto-fixer
│   ├── wcag-fixer-advanced.py         # Advanced fixer (semantic landmarks)
│   ├── contrast-fixer.py              # Color contrast fixer
│   └── contrast-fixer-enhanced.py     # Enhanced contrast fixer
│
├── AUTOMATION SCRIPTS (Bash + Python)
│   ├── recode-html.sh                 # Simple auto-fix workflow
│   ├── recode-html-learning.sh        # With learning integration
│   ├── recode-html-adaptive.sh        # Adaptive learning + evolution
│   ├── recode-aaa.sh                  # Upgrade to AAA compliance
│   ├── upgrade-to-aaa.sh              # Full AAA transformation
│   └── batch-recode.sh                # Batch process multiple files
│
├── INTEGRATION FILES (Python)
│   ├── wcag_hunters.py                # WCAG detection hunters
│   ├── test-wcag-integration.py       # Integration test suite
│   └── nexus-evolution-bridge.py      # Connect to pattern evolution
│
└── TYPESCRIPT SERVICES (src/)
    ├── wcag-check.ts                  # HTTP endpoint handlers
    ├── wcag-hunter.service.ts         # WCAG service implementation
    └── wcag.types.ts                  # TypeScript type definitions
```

---

## 🔍 DETECTION TOOLS

### **1. check-wcag.sh** - Standard Checker

**Purpose:** Quick WCAG compliance check via NEXUS API

**Usage:**
```bash
./check-wcag.sh your-page.html
```

**Output:**
- Total issues count
- WCAG AA/AAA compliance status
- Hunter-specific findings
- Top 5 recommended actions
- Full JSON report saved

**Best for:** Quick audits, CI/CD integration

---

### **2. check-wcag-aaa.sh** - Comprehensive AAA Audit

**Purpose:** Deep AAA compliance audit with detailed analysis

**Usage:**
```bash
./check-wcag-aaa.sh your-page.html
```

**Checks:**
- ✅ Image alt text (WCAG 1.1.1)
- ✅ Video captions (WCAG 1.2.2/1.2.4)
- ✅ Audio descriptions (WCAG 1.2.5/1.2.7)
- ✅ Color contrast AA/AAA (WCAG 1.4.3/1.4.6)
- ✅ Text resize (WCAG 1.4.4)
- ✅ Text spacing (WCAG 1.4.12)
- ✅ Reflow (WCAG 1.4.10)
- ✅ Keyboard accessibility (WCAG 2.1.1)
- ✅ Focus indicators (WCAG 2.4.7)
- ✅ Heading structure (WCAG 2.4.6)
- ✅ Skip links (WCAG 2.4.1)
- ✅ Form labels (WCAG 3.3.2)
- ✅ ARIA attributes (WCAG 4.1.2)
- ✅ Language declarations (WCAG 3.1.1)

**Output:**
- Detailed AAA compliance score
- Issue breakdown by severity
- Category-wise analysis
- JSON report with all findings

**Best for:** Full accessibility audits, AAA certification prep

---

### **3. wcag-summary.sh** - Multi-File Summary

**Purpose:** Generate summary report for all HTML files in directory

**Usage:**
```bash
./wcag-summary.sh
```

**Output:**
- Summary of all files
- Compliance status per file
- Total issues across project
- Prioritized recommendations

**Best for:** Project-wide accessibility assessment

---

## 🔧 FIXING TOOLS

### **1. wcag-fixer.py** - Basic Auto-Fixer

**Purpose:** Apply automated fixes based on WCAG report

**Usage:**
```bash
python3 wcag-fixer.py report.json input.html output.html
```

**Fixes:**
- Missing alt attributes
- Missing form labels
- Missing ARIA labels
- Basic semantic issues

**Best for:** Quick fixes, simple pages

---

### **2. wcag-fixer-advanced.py** - Advanced Fixer

**Purpose:** Intelligent semantic landmark addition + contrast fixes

**Usage:**
```bash
python3 wcag-fixer-advanced.py report.json input.html output.html
```

**Fixes:**
- All basic fixes PLUS:
- Semantic landmarks (header, nav, main, footer)
- Section organization
- Heading hierarchy
- Color contrast adjustments
- ARIA roles and labels

**Best for:** Complex pages, AAA compliance

---

### **3. contrast-fixer.py** - Color Contrast Fixer

**Purpose:** Fix color contrast issues to meet AA/AAA standards

**Usage:**
```bash
python3 contrast-fixer.py input.html output.html [--level AAA]
```

**Features:**
- Analyzes all text/background combinations
- Calculates contrast ratios
- Adjusts colors to meet standards
- Preserves brand colors where possible

**Best for:** Design-heavy pages, branding requirements

---

### **4. contrast-fixer-enhanced.py** - Enhanced Contrast Fixer

**Purpose:** AI-powered contrast fixing with intelligent color adjustment

**Features:**
- Smart color selection
- Brand color preservation
- Perceptual color matching
- AAA compliance optimization

**Best for:** High-fidelity design requirements

---

## 🤖 AUTOMATION TOOLS

### **1. recode-html.sh** - Simple Workflow

**Purpose:** One-command fix workflow

**Usage:**
```bash
./recode-html.sh input.html [output.html]
```

**Workflow:**
1. Run WCAG check
2. Apply advanced fixer
3. Verify fixes
4. Generate report

**Output:** Fixed HTML + JSON report

**Best for:** Single file fixes

---

### **2. recode-html-learning.sh** - With Learning

**Purpose:** Auto-fix with pattern effectiveness tracking

**Usage:**
```bash
./recode-html-learning.sh input.html [output.html]
```

**Features:**
- All basic workflow PLUS:
- Tracks fix success rates
- Records to evolution engine
- Learns from outcomes

**Best for:** Improving fix accuracy over time

---

### **3. recode-html-adaptive.sh** - Adaptive Learning

**Purpose:** Full adaptive learning with pattern evolution

**Usage:**
```bash
./recode-html-adaptive.sh input.html [output.html]
```

**Features:**
- All learning features PLUS:
- Adaptive pattern selection
- Context-aware fixes
- Breakthrough detection
- Evolution momentum tracking

**Best for:** Production systems, continuous improvement

---

### **4. recode-aaa.sh** - Upgrade to AAA

**Purpose:** Transform AA-compliant pages to AAA

**Usage:**
```bash
./recode-aaa.sh input.html [output.html]
```

**Focus:**
- Enhanced color contrast (7:1 for text, 4.5:1 for large text)
- Additional semantic landmarks
- Enhanced ARIA attributes
- AAA-specific requirements

**Best for:** Government sites, accessibility-focused projects

---

### **5. upgrade-to-aaa.sh** - Full AAA Transformation

**Purpose:** Complete AAA upgrade with all enhancements

**Usage:**
```bash
./upgrade-to-aaa.sh input.html [output.html]
```

**Features:**
- All AAA fixes
- Comprehensive metadata
- Enhanced semantics
- Full AAA compliance

**Best for:** Maximum accessibility compliance

---

### **6. batch-recode.sh** - Batch Processing

**Purpose:** Process multiple HTML files at once

**Usage:**
```bash
./batch-recode.sh [directory]
```

**Features:**
- Finds all HTML files
- Processes each file
- Generates individual reports
- Creates summary report

**Best for:** Entire websites, large projects

---

## 🔌 TYPESCRIPT INTEGRATION

### **NEXUS Runtime Integration**

The WCAG toolkit integrates with NEXUS runtime via HTTP endpoints:

**Endpoints:**
- `POST /wcag-check` - Full WCAG analysis with personality insights
- `POST /wcag-report` - Quick compliance report

**Files:**
- `src/wcag-check.ts` - HTTP endpoint handlers
- `src/wcag-hunter.service.ts` - WCAG service implementation
- `src/wcag.types.ts` - TypeScript type definitions

**Usage in NEXUS:**
```typescript
import { wcagHunterService } from './services/wcag-hunter.service';

// Run full check
const result = await wcagHunterService.runFullCheck(html);

// Quick report
const report = await wcagHunterService.checkHtml(html);
```

---

## 🚀 QUICK START

### **Installation:**

```bash
# 1. Navigate to toolkit
cd wcag-toolkit

# 2. Make scripts executable
chmod +x *.sh

# 3. Install Python dependencies
pip3 install beautifulsoup4 lxml

# 4. Verify installation
./check-wcag.sh --help
```

### **Quick Check:**

```bash
# Check a file
./check-wcag.sh your-page.html
```

### **Quick Fix:**

```bash
# Fix a file
./recode-html.sh your-page.html fixed-page.html
```

### **Batch Fix:**

```bash
# Fix all HTML in directory
./batch-recode.sh ./my-website
```

---

## 📖 USAGE EXAMPLES

### **Example 1: Simple Check**

```bash
# Check accessibility
./check-wcag.sh index.html

# Output:
# 🔍 WCAG COMPLIANCE CHECK
#   Total Issues: 12
#   WCAG AA: PASS (with warnings)
#   WCAG AAA: FAIL
```

### **Example 2: Fix and Verify**

```bash
# Fix the file
./recode-html.sh index.html index-fixed.html

# Verify the fix
./check-wcag.sh index-fixed.html

# Output:
# 🔍 WCAG COMPLIANCE CHECK
#   Total Issues: 0
#   WCAG AA: PASS ✅
#   WCAG AAA: PASS ✅
```

### **Example 3: Upgrade to AAA**

```bash
# Current: AA compliant
./check-wcag.sh product-page.html
# Output: WCAG AA: PASS, AAA: FAIL (7 contrast issues)

# Upgrade to AAA
./upgrade-to-aaa.sh product-page.html product-page-aaa.html

# Verify AAA
./check-wcag-aaa.sh product-page-aaa.html
# Output: AAA Compliance: 95% ✅
```

### **Example 4: Batch Process Website**

```bash
# Process entire site
./batch-recode.sh ./website

# Output:
# Processing: 25 files
# ✅ Compliant: 10
# 🔧 Fixed: 12
# ❌ Failed: 3

# Generate summary
./wcag-summary.sh
```

### **Example 5: With NEXUS Runtime**

```bash
# Start NEXUS (in another terminal)
cd /workspaces/data-folder/Nexus-4.5
./start-nexus-enhanced.sh

# Use NEXUS API
curl -X POST http://localhost:8080/wcag-check \
  -H "Content-Type: application/json" \
  -d '{"html": "<html>...</html>"}'
```

---

## 🔧 INTEGRATION WITH OTHER TOOLS

### **With NUXEE (UX Enhancement):**

```bash
# 1. Fix accessibility
./recode-html.sh input.html accessible.html

# 2. Enhance UX
cd ..
./enhance-ux.sh accessible.html final.html

# Result: Accessible + Beautiful! ✨
```

### **With CI/CD:**

```bash
# In your CI pipeline
./check-wcag.sh dist/index.html
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "❌ Accessibility check failed!"
  exit 1
fi
```

### **With Git Hooks:**

```bash
# .git/hooks/pre-commit
#!/bin/bash
for file in $(git diff --cached --name-only | grep '\.html$'); do
  ./wcag-toolkit/check-wcag.sh "$file"
done
```

---

## 📊 OUTPUT FORMATS

### **Terminal Output:**
- Color-coded status
- Issue summaries
- Recommended actions
- Progress indicators

### **JSON Reports:**
- Complete issue details
- Hunter-specific findings
- Compliance metrics
- Strategic implications
- Next actions

### **Log Files:**
- Timestamped operations
- Success/failure records
- Performance metrics

---

## 🎯 BEST PRACTICES

1. **Always check before fixing:**
   ```bash
   ./check-wcag.sh file.html  # Know what needs fixing
   ./recode-html.sh file.html # Then fix it
   ```

2. **Verify after fixing:**
   ```bash
   ./recode-html.sh input.html output.html
   ./check-wcag.sh output.html  # Verify success
   ```

3. **Use batch processing for projects:**
   ```bash
   ./batch-recode.sh ./website  # Process all at once
   ```

4. **Keep reports for compliance:**
   ```bash
   # Reports are auto-saved as:
   # filename-wcag-report.json
   # filename-wcag-aaa-report.json
   ```

5. **Integrate with NEXUS for intelligence:**
   ```bash
   # Start NEXUS first, then use scripts
   # They'll leverage NEXUS personalities for smarter fixes
   ```

---

## 🐛 TROUBLESHOOTING

### **"Command not found"**
```bash
chmod +x *.sh  # Make scripts executable
```

### **"NEXUS not running"**
```bash
cd ..
./start-nexus-enhanced.sh  # Start NEXUS
```

### **"Module not found" (Python)**
```bash
pip3 install beautifulsoup4 lxml  # Install dependencies
```

### **"No issues found but page has problems"**
```bash
# Use comprehensive checker:
./check-wcag-aaa.sh your-page.html
```

---

## 📚 ADDITIONAL RESOURCES

- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **NEXUS Documentation:** `../NEXUS_MEMORY.md`
- **UX Enhancement:** `../NEXUS_ADAPTIVE_UX_STRATEGY.md`

---

## ✨ SUMMARY

**This toolkit provides:**
- ✅ Complete WCAG detection (AA/AAA)
- ✅ Automated fixing with intelligence
- ✅ Batch processing capabilities
- ✅ NEXUS runtime integration
- ✅ Learning and evolution
- ✅ Production-ready tools

**All scripts are tested, documented, and ready to use!**

---

*Created: October 13, 2025*  
*Version: 1.0.0*  
*Part of NEXUS-4.5 Accessibility Suite*
