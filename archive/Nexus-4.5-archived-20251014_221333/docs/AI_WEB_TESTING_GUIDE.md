# AI-Observable Web Testing Guide

**Purpose:** Enable AI to verify NEXUS web functionality without visual rendering

---

## 🎯 Why This Matters

AI assistants can read code but cannot see rendered web pages. This guide shows how NEXUS makes web output **observable and verifiable** through structured data.

---

## 📊 Available Endpoints for AI Observation

### 1. `/test-layout` - Structured JSON Test Results

**Purpose:** Automated validation with pass/fail status

**Usage:**
```bash
curl "http://127.0.0.1:8080/test-layout?strategy=hybrid&baseUnit=8"
```

**What AI Can Read:**
```json
{
  "timestamp": "2025-10-12T...",
  "strategy": "hybrid",
  "baseUnit": 8,
  "generationTime": "12ms",
  "validation": {
    "valid": true,
    "errors": []
  },
  "tests": [
    {
      "name": "Column widths are multiples of base unit",
      "passed": true,
      "status": "✅ PASS"
    }
  ],
  "summary": {
    "totalTests": 5,
    "passed": 5,
    "failed": 0,
    "allPassed": true,
    "overallStatus": "✅ ALL TESTS PASSED"
  },
  "breakpoints": [...],
  "recommendations": [...]
}
```

**AI Validation Checklist:**
- ✅ Check `summary.allPassed === true`
- ✅ Verify `validation.valid === true`
- ✅ Confirm all `tests[].passed === true`
- ✅ Review `recommendations` for warnings
- ✅ Validate breakpoint computations are reasonable

---

### 2. `/preview` - HTML with Embedded Metadata

**Purpose:** Visual preview with AI-readable metadata comments

**Usage:**
```bash
curl "http://127.0.0.1:8080/preview?strategy=fluid&baseUnit=8"
```

**What AI Can Read:**

#### A. HTML Metadata Comments
```html
<!--
============================================================
AI-READABLE METADATA: Layout Configuration
============================================================
Strategy: fluid
Base Unit: 8px
Validation: PASS

Breakpoints Generated:
- mobile: 360px (4 cols, 12px gutter, 16px margin)
  Container: 328px
  Column Width: 72px
============================================================
-->
```

#### B. Test Instructions Comment
```html
<!--
============================================================
AI-READABLE TEST INSTRUCTIONS:
============================================================
To verify this page works correctly:

1. Check HTML source for metadata comments (above)
2. Verify CSS variables are defined in <style> tag
3. Check console logs for NEXUS_METRICS output
4. Call window.NEXUS_METRICS() in browser console
5. Use /test-layout endpoint for automated validation
============================================================
-->
```

#### C. Embedded CSS Variables
```css
:root {
  --grid-base-unit: 8px;
  --grid-columns: 4;
  --grid-gutter: 12px;
  --grid-margin: 16px;
  --grid-container: 328px;
  --grid-column-width: 72px;
}

@media (min-width: 768px) {
  :root {
    --grid-columns: 8;
    /* ... */
  }
}
```

**AI can verify:**
- CSS variables are present in `<style>` tag
- Values match metadata comments
- Media queries match breakpoint widths

---

### 3. `/layout-tokens.css` - Pure CSS Variables

**Purpose:** Production CSS tokens for integration

**Usage:**
```bash
curl "http://127.0.0.1:8080/layout-tokens.css?strategy=hybrid&baseUnit=8"
```

**What AI Can Read:**
```css
:root {
  --grid-base-unit: 8px;
  --grid-columns: 12;
  --grid-gutter: 12px;
  --grid-margin: 16px;
  --grid-container: 328px;
  --grid-column-width: 16px;
}

@media (min-width: 768px) {
  :root {
    --grid-columns: 12;
    --grid-gutter: 19px;
    --grid-margin: 27px;
    --grid-container: 714px;
    --grid-column-width: 40px;
  }
}
```

**AI Validation:**
- ✅ All CSS variables use correct naming (`--grid-*`)
- ✅ Values are valid CSS units (px)
- ✅ Media queries are properly structured
- ✅ No syntax errors

---

### 4. `/api/layout/matrix` - Complete Layout Data

**Purpose:** Full layout matrix with Tailwind config

**Usage:**
```bash
curl -X POST http://127.0.0.1:8080/api/layout/matrix \
  -H "Content-Type: application/json" \
  -d '{
    "dna": {
      "constraints": {
        "baseSpacePx": 8,
        "breakpoints": {"mobile": 360, "tablet": 768}
      }
    },
    "config": {
      "layoutStrategy": "hybrid",
      "baseUnit": 8
    }
  }'
```

**What AI Can Read:**
```json
{
  "matrix": {
    "strategy": "hybrid",
    "breakpoints": [...],
    "computed": {...}
  },
  "validation": {
    "valid": true,
    "errors": []
  },
  "css": ":root { ... }",
  "tailwind": {
    "screens": {
      "mobile": "360px",
      "tablet": "768px"
    },
    "container": {
      "center": true,
      "padding": {...}
    }
  }
}
```

---

## 🧪 AI Testing Workflow

### Step 1: Check System Health
```bash
curl http://127.0.0.1:8080/status | jq '{initialized, circuitBreaker: .loaderHealth.circuitBreakerState}'
```

**Expected:** `initialized: true`, `circuitBreaker: "CLOSED"`

---

### Step 2: Run Automated Tests
```bash
curl "http://127.0.0.1:8080/test-layout?strategy=hybrid&baseUnit=8" | jq '.summary'
```

**Expected:** `allPassed: true`, `overallStatus: "✅ ALL TESTS PASSED"`

---

### Step 3: Validate Different Strategies

**Test Fluid:**
```bash
curl "http://127.0.0.1:8080/test-layout?strategy=fluid&baseUnit=8" | jq '.summary.overallStatus'
```

**Test Fixed:**
```bash
curl "http://127.0.0.1:8080/test-layout?strategy=fixed&baseUnit=8" | jq '.summary.overallStatus'
```

**Test Hybrid:**
```bash
curl "http://127.0.0.1:8080/test-layout?strategy=hybrid&baseUnit=8" | jq '.summary.overallStatus'
```

**Expected:** All return `"✅ ALL TESTS PASSED"`

---

### Step 4: Extract and Verify Metadata

```bash
# Extract metadata from preview page
curl -s "http://127.0.0.1:8080/preview?strategy=hybrid" | \
  grep -A 15 "AI-READABLE METADATA"

# Verify CSS is generated
curl -s "http://127.0.0.1:8080/layout-tokens.css" | head -20
```

---

### Step 5: Check for Warnings

```bash
curl -s "http://127.0.0.1:8080/test-layout" | jq '.recommendations'
```

**Review:** Any warnings about narrow columns, wide columns, or clamping

---

## 📈 Success Criteria for AI

A NEXUS web page is **verified working** when:

1. ✅ `/test-layout` returns `allPassed: true`
2. ✅ `/test-layout` returns `validation.valid: true`
3. ✅ All individual tests show `status: "✅ PASS"`
4. ✅ `/preview` contains valid HTML metadata comments
5. ✅ `/layout-tokens.css` generates valid CSS
6. ✅ CSS variables match computed breakpoint values
7. ✅ No critical recommendations
8. ✅ Generation time < 100ms

---

## 🔍 AI Debugging Checklist

If tests fail, AI should check:

1. **Validation Errors:**
   ```bash
   curl -s "http://127.0.0.1:8080/test-layout" | jq '.validation.errors'
   ```

2. **Failed Tests:**
   ```bash
   curl -s "http://127.0.0.1:8080/test-layout" | jq '.tests[] | select(.passed == false)'
   ```

3. **Recommendations:**
   ```bash
   curl -s "http://127.0.0.1:8080/test-layout" | jq '.recommendations'
   ```

4. **Breakpoint Details:**
   ```bash
   curl -s "http://127.0.0.1:8080/test-layout" | jq '.breakpoints[]'
   ```

5. **Generation Time:**
   ```bash
   curl -s "http://127.0.0.1:8080/test-layout" | jq '.generationTime'
   ```

---

## 🎨 Visual Verification (When Available)

If AI has access to browser automation (Playwright/Puppeteer):

```javascript
// Open preview page
await page.goto('http://127.0.0.1:8080/preview?strategy=hybrid');

// Extract metrics via JavaScript
const metrics = await page.evaluate(() => window.NEXUS_METRICS());
console.log('Computed metrics:', metrics);

// Check console logs
page.on('console', msg => {
  if (msg.text().includes('NEXUS_METRICS:')) {
    console.log('Live metrics:', msg.text());
  }
});
```

---

## 🚀 Integration Examples

### Example 1: CI/CD Pipeline

```bash
#!/bin/bash
# test-nexus-layout.sh

# Start NEXUS
./start-nexus.sh --background
sleep 2

# Run tests for all strategies
for strategy in fluid fixed hybrid; do
  echo "Testing $strategy strategy..."
  result=$(curl -s "http://127.0.0.1:8080/test-layout?strategy=$strategy" | jq -r '.summary.overallStatus')
  
  if [[ "$result" != *"PASSED"* ]]; then
    echo "❌ $strategy failed"
    exit 1
  fi
  echo "✅ $strategy passed"
done

echo "✅ All layout tests passed!"
```

### Example 2: AI Verification Script

```javascript
// verify-nexus.js
async function verifyNexus() {
  const strategies = ['fluid', 'fixed', 'hybrid'];
  
  for (const strategy of strategies) {
    const res = await fetch(
      `http://127.0.0.1:8080/test-layout?strategy=${strategy}`
    );
    const data = await res.json();
    
    console.log(`${strategy}: ${data.summary.overallStatus}`);
    
    if (!data.summary.allPassed) {
      console.error(`Failed tests:`, data.tests.filter(t => !t.passed));
      return false;
    }
  }
  
  return true;
}
```

---

## 📝 Metadata Format Specification

### HTML Comment Metadata Format

```
<!--
============================================================
AI-READABLE METADATA: [Section Name]
============================================================
Key: Value
Key: Value

Nested Section:
- item: details
- item: details
============================================================
-->
```

### JSON Test Result Format

```json
{
  "timestamp": "ISO 8601 string",
  "strategy": "fluid | fixed | hybrid | auto",
  "baseUnit": number,
  "generationTime": "Xms",
  "validation": {
    "valid": boolean,
    "errors": string[]
  },
  "tests": [
    {
      "name": string,
      "passed": boolean,
      "status": "✅ PASS | ❌ FAIL"
    }
  ],
  "summary": {
    "totalTests": number,
    "passed": number,
    "failed": number,
    "allPassed": boolean,
    "overallStatus": string
  },
  "breakpoints": [...],
  "recommendations": string[]
}
```

---

## 🎯 Quick Reference

| Endpoint | Purpose | AI Can Read |
|----------|---------|-------------|
| `/test-layout` | Automated tests | JSON with pass/fail |
| `/preview` | Visual preview | HTML metadata comments |
| `/layout-tokens.css` | CSS variables | Pure CSS |
| `/api/layout/matrix` | Full data | JSON matrix + Tailwind |

**Key Commands:**
```bash
# Health check
curl http://127.0.0.1:8080/status | jq '.initialized'

# Run tests
curl "http://127.0.0.1:8080/test-layout" | jq '.summary.overallStatus'

# Get metadata
curl -s "http://127.0.0.1:8080/preview" | grep -A 20 "AI-READABLE"

# Get CSS
curl "http://127.0.0.1:8080/layout-tokens.css"
```

---

**Last Updated:** 2025-10-12  
**NEXUS Version:** 4.5  
**Sprint:** 4 (Export & Testing)
