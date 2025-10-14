# Visual Regression Baseline Capture Instructions

**Date:** 2025-10-14  
**Purpose:** Establish visual baseline before CSS migration begins

---

## 🎯 Test Subjects

1. **quote-form-test-studio.html** (Primary harness with customization panel)
2. **quote-form-preview.html** (Clean preview without test UI)

---

## 📸 Required Screenshots

### Desktop (1920×1080)
- [ ] Step 1: Property details
- [ ] Step 2: Add-ons selection
- [ ] Step 3: Contact information
- [ ] Step 4: Review & submit
- [ ] Success view (after submission simulation)

### Mobile (375×667)
- [ ] Step 1: Property details
- [ ] Step 2: Add-ons selection
- [ ] Step 3: Contact information
- [ ] Step 4: Review & submit
- [ ] Success view
- [ ] Mobile sticky bar (visible during steps)

---

## 🛠️ Capture Method

### Option A: Manual Browser Screenshots
1. Open `quote-form-test-studio.html` in browser
2. Open DevTools → Toggle device toolbar
3. Set viewport to 1920×1080 (desktop) or 375×667 (mobile)
4. Navigate through all steps
5. Take full-page screenshots
6. Save to `__reports/css-refactor/baseline-screenshots/` with naming pattern:
   - `desktop-step-1-property.png`
   - `desktop-step-2-addons.png`
   - `mobile-step-1-property.png`
   - etc.

### Option B: Automated (Playwright/Puppeteer)
```javascript
// Future enhancement: automated screenshot capture script
// Would iterate through steps and capture at each viewport
```

---

## 📦 Storage Convention

```
__reports/css-refactor/baseline-screenshots/
├── desktop-step-1-property.png
├── desktop-step-2-addons.png
├── desktop-step-3-contact.png
├── desktop-step-4-review.png
├── desktop-success.png
├── mobile-step-1-property.png
├── mobile-step-2-addons.png
├── mobile-step-3-contact.png
├── mobile-step-4-review.png
├── mobile-success.png
└── mobile-sticky-bar.png
```

---

## ✅ Validation Checklist

After capturing baselines:
- [ ] All 11 screenshots present
- [ ] Images are crisp and full-viewport
- [ ] Chrome/Glass styling visible (glassmorphism effects)
- [ ] Mobile sticky bar captured
- [ ] Test studio customization panel captured (desktop)
- [ ] No console errors visible in screenshots

---

## 🔄 Regression Comparison Workflow

1. **Before migration:** Capture baselines (this phase)
2. **After migration:** Recapture using same method
3. **Visual diff:** Use image diff tool or manual side-by-side comparison
4. **Approve:** If identical → migration successful
5. **Investigate:** If differences → determine if intentional or regression

---

**Status:** Waiting for screenshot capture before proceeding with Batch 1 migration.

**Hunter's Note:** Screenshots are the safety net—capture them before touching ANY CSS in legacy-overrides.css.
