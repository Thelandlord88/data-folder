# Accessibility Process Guide

Comprehensive WCAG 2.1 testing and validation process for NEXUS-generated design systems.

---

## Overview

NEXUS includes **automated accessibility auditing** to ensure all generated design systems meet or exceed WCAG 2.1 Level AA standards. This guide covers:

- Automated testing with `npm run audit-accessibility`
- Manual testing procedures
- Remediation workflows
- Continuous monitoring

---

## Quick Start

### Run Accessibility Audit

```bash
cd /workspaces/data-folder/Nexus-4.5

# Run automated audit
npm run audit-accessibility

# View latest report
cat reports/accessibility/accessibility-$(date +%Y-%m-%d).json
```

### Expected Output

```
🔍 NEXUS Accessibility Audit
================================

📦 Fetching design system...
✅ Design system loaded

🎨 Testing color contrast...
   Passed: 8/10
   Failed: 2/10

📝 Testing typography...
   ✅ All font sizes meet minimum requirements

📏 Testing spacing scale...
   ✅ Spacing scale is consistent and accessible

📐 Testing layout accessibility...
   ✅ Responsive layout with 4 breakpoints

================================
📊 AUDIT SUMMARY
================================

Total Issues:   2
  Critical:     2
  Serious:      0
  Moderate:     0
  Minor:        0

Passed Tests:   8

📋 RECOMMENDATIONS:

1. 🔴 2 color pairs fail WCAG AA contrast requirements
   → Adjust lightness values to achieve minimum 4.5:1 ratio

================================
```

---

## Automated Tests

### 1. Color Contrast Testing

**What's Tested:**
- Text on background (normal 16px+)
- Text on background (large 24px+)
- UI components (buttons, borders)
- Interactive states (hover, focus, active)

**WCAG Levels:**
- **AA Normal Text:** 4.5:1 minimum
- **AA Large Text:** 3:1 minimum
- **AAA Normal Text:** 7:1 recommended
- **AAA Large Text:** 4.5:1 recommended

**Common Pairs Tested:**
- `text-default` on `bg-default`
- `text-muted` on `bg-default`
- `text-default` on `bg-surface`
- `primary-default` on `bg-default`

**Example Test:**
```json
{
  "foreground": "#1a1a1a",
  "background": "#fafafa",
  "ratio": 12.63,
  "minRequired": 4.5,
  "passed": true,
  "usage": "normal-text"
}
```

---

### 2. Typography Testing

**What's Tested:**
- Minimum font sizes (16px for body text)
- Line height (1.5+ for body text)
- Font weight readability
- Heading hierarchy

**Requirements:**
- Body text: ≥16px
- Small text: ≥14px (with higher contrast)
- Large text: ≥24px (reduced contrast requirements)

---

### 3. Spacing Testing

**What's Tested:**
- Touch target sizes (44×44px mobile, 48×48px desktop)
- Spacing consistency
- Visual grouping
- White space ratios

**Requirements:**
- Minimum 44×44px interactive elements (mobile)
- Minimum 48×48px interactive elements (desktop)
- Consistent spacing scale (8px base unit)

---

### 4. Layout Testing

**What's Tested:**
- Responsive breakpoints (mobile → wide)
- Content reflow without horizontal scroll
- Reading order preservation
- Focus management

**Requirements:**
- Minimum 3 responsive breakpoints
- Support 320px viewport minimum
- Logical reading order maintained

---

## Manual Testing Procedures

### Screen Reader Testing

**Recommended Tools:**
- **macOS:** VoiceOver
- **Windows:** NVDA, JAWS
- **Linux:** Orca
- **Mobile:** TalkBack (Android), VoiceOver (iOS)

**Test Checklist:**
- [ ] All interactive elements announced correctly
- [ ] Headings provide document structure
- [ ] Form inputs have labels
- [ ] Error messages are clear
- [ ] Skip links function properly
- [ ] ARIA labels accurate

### Keyboard Navigation Testing

**Test Checklist:**
- [ ] `Tab` advances through interactive elements
- [ ] `Shift+Tab` reverses navigation
- [ ] `Enter`/`Space` activate buttons
- [ ] `Esc` closes modals/dropdowns
- [ ] Focus indicators always visible
- [ ] No keyboard traps
- [ ] Skip to main content available

**Focus Indicator Requirements:**
- Minimum 3:1 contrast ratio
- Visible on all interactive elements
- Does not rely on color alone
- Clear offset from element edge

### Color Blindness Testing

**Tools:**
- **Browser Extensions:** Colorblind Web Page Filter
- **macOS:** Color filters (Accessibility settings)
- **Simulators:** Coblis, Color Oracle

**Simulations:**
- Protanopia (red-blind)
- Deuteranopia (green-blind)
- Tritanopia (blue-blind)
- Achromatopsia (total color blind)

**Requirements:**
- Information not conveyed by color alone
- Icons/text supplement color coding
- Pattern/texture alternatives provided

### Zoom and Text Resize Testing

**Test Scenarios:**
- **100% zoom:** Default view
- **200% zoom:** All content accessible
- **400% zoom:** No horizontal scroll

**Browser Settings:**
- Text size: Large
- Page zoom: 200%
- Both combined

**Requirements:**
- No content hidden at 200% zoom
- No horizontal scrolling
- Reading order preserved
- Interactive elements remain usable

---

## Remediation Workflows

### Failed Contrast Test

**Problem:** Color pair fails 4.5:1 contrast ratio

**Solution:**
```typescript
import { adjustForContrast } from './css-engine/utils/contrast.js';

// Adjust foreground color to meet WCAG AA
const adjustedForeground = adjustForContrast(
  '#666666',  // Original foreground
  '#fafafa',  // Background
  'AA'        // WCAG level
);

// Result: Darker foreground that meets 4.5:1 ratio
```

**Alternative:**
- Lighten background
- Darken foreground
- Increase font weight
- Use larger font size (3:1 for large text)

---

### Typography Below Minimum

**Problem:** Font size <16px for body text

**Solution:**
```typescript
// Update typography scale
const typography = {
  'body': '16px',       // Minimum for body text
  'small': '14px',      // Use sparingly, boost contrast
  'caption': '12px',    // Only for non-critical text
};
```

**Guidelines:**
- Body text: 16-18px
- Small text: 14px minimum (with 7:1 contrast)
- Captions: 12px maximum (for non-critical info)

---

### Touch Target Too Small

**Problem:** Interactive element <44×44px (mobile)

**Solution:**
```css
button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 16px;
}

@media (min-width: 768px) {
  button {
    min-width: 48px;
    min-height: 48px;
  }
}
```

---

## Continuous Monitoring

### CI/CD Integration

**GitHub Actions:**
```yaml
# .github/workflows/accessibility.yml
name: Accessibility Audit

on:
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 1'  # Weekly

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run audit-accessibility
      - uses: actions/upload-artifact@v3
        with:
          name: accessibility-report
          path: reports/accessibility/
```

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

npm run audit-accessibility

if [ $? -ne 0 ]; then
  echo "❌ Accessibility audit failed. Fix issues or use --no-verify to bypass."
  exit 1
fi
```

---

## Reporting & Documentation

### Report Structure

```json
{
  "timestamp": "2025-10-11T10:30:00.000Z",
  "summary": {
    "totalIssues": 2,
    "critical": 2,
    "serious": 0,
    "moderate": 0,
    "minor": 0,
    "passed": 8
  },
  "colorPairs": [
    {
      "pair": "text-default on bg-default",
      "foreground": "#1a1a1a",
      "background": "#fafafa",
      "ratio": 12.63,
      "minRequired": 4.5,
      "passed": true
    }
  ],
  "recommendations": [
    {
      "severity": "critical",
      "category": "contrast",
      "message": "2 color pairs fail WCAG AA contrast requirements",
      "action": "Adjust lightness values to achieve minimum 4.5:1 ratio"
    }
  ]
}
```

### Tracking Issues

**Issue Template:**
```markdown
## Accessibility Issue

**Severity:** Critical/Moderate/Minor
**Category:** Contrast/Typography/Layout/Interaction
**WCAG Criterion:** [Link to WCAG criterion]

### Description
[Clear description of the issue]

### Expected Behavior
[What should happen]

### Actual Behavior
[What currently happens]

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [etc.]

### Suggested Fix
[Proposed solution]

### Affected Users
- [ ] Screen reader users
- [ ] Keyboard-only users
- [ ] Color blind users
- [ ] Low vision users
- [ ] Motor impairment users
```

---

## Resources

### WCAG 2.1 Guidelines
- **Level A:** Essential (legal minimum)
- **Level AA:** Target standard (recommended)
- **Level AAA:** Enhanced (aspirational)

**Key Success Criteria:**
- **1.4.3:** Contrast (Minimum) - AA
- **1.4.6:** Contrast (Enhanced) - AAA
- **1.4.10:** Reflow - AA
- **1.4.12:** Text Spacing - AA
- **2.1.1:** Keyboard - A
- **2.4.7:** Focus Visible - AA
- **4.1.2:** Name, Role, Value - A

### Tools

**Automated Testing:**
- axe DevTools
- Lighthouse
- WAVE
- Pa11y

**Manual Testing:**
- Screen readers (NVDA, JAWS, VoiceOver)
- Color blindness simulators
- Keyboard navigation

**Reference:**
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Inclusive Components](https://inclusive-components.design/)

---

## Best Practices

1. **Design with accessibility from the start**
   - Don't retrofit accessibility
   - Include in design system foundation
   - Test early and often

2. **Automate where possible**
   - Run audits in CI/CD
   - Pre-commit hooks
   - Automated regression testing

3. **Manual testing is essential**
   - Automated tools catch ~30-40% of issues
   - Screen reader testing required
   - Real user testing invaluable

4. **Document decisions**
   - Track remediation efforts
   - Document color choices
   - Maintain accessibility statement

5. **Continuous improvement**
   - Regular audits
   - User feedback loops
   - Stay current with standards

---

**Last Updated:** 2025-10-11  
**Owner:** Guardian + Sage  
**Status:** ✅ Sprint 3 Deliverable
