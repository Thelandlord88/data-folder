# Legacy Override Migration Log

**Date:** 2025-10-14  
**Phase:** Surgical extraction from quarantine layer  
**Strategy:** Identify duplicates → update references → delete from legacy layer

---

## 🎯 Migration Batches

### **Batch 1: Design Token Duplicates (PRIORITY)**

#### Color Variables (Lines 10-19)
| Legacy Token | Existing Token | Action | Status |
|--------------|----------------|--------|--------|
| `--brand-navy` | `--q-navy` | Update refs, delete | ⏳ Pending |
| `--brand-sky` | `--q-sky-600` | Update refs, delete | ⏳ Pending |
| `--brand-sky-600` | `--q-sky-600` | Direct duplicate, delete | ⏳ Pending |
| `--brand-sky-400` | `--q-sky-400` | Direct duplicate, delete | ⏳ Pending |
| `--brand-sky-light` | `--q-sky-50` | Update refs, delete | ⏳ Pending |
| `--brand-gray-light` | `--q-silver-50` | Update refs, delete | ⏳ Pending |
| `--brand-error` | `--q-error` | Update refs, delete | ⏳ Pending |
| `--brand-green` | `--q-green` | Update refs, delete | ⏳ Pending |
| `--brand-green-light` | `--q-green-light` | Update refs, delete | ⏳ Pending |

#### Silver Scale (Lines 20-24)
| Legacy Token | Existing Token | Action | Status |
|--------------|----------------|--------|--------|
| `--silver-50` | `--q-silver-50` | Direct duplicate, delete | ⏳ Pending |
| `--silver-100` | `--q-silver-100` | Update refs, delete | ⏳ Pending |
| `--silver-200` | `--q-silver-200` | Update refs, delete | ⏳ Pending |
| `--silver-300` | `--q-silver-300` | Update refs, delete | ⏳ Pending |
| `--silver-400` | `--q-silver-400` | Update refs, delete | ⏳ Pending |
| `--silver-500` | `--q-silver-500` | Update refs, delete | ⏳ Pending |

#### Effects & Shadows (Lines 26-30)
| Legacy Token | Existing Token | Action | Status |
|--------------|----------------|--------|--------|
| `--shadow-1` | `--q-shadow-1` | Direct duplicate, delete | ⏳ Pending |
| `--shadow-2` | `--q-shadow-2` | Direct duplicate, delete | ⏳ Pending |
| `--glass-bg` | `--q-glass-bg` | Direct duplicate, delete | ⏳ Pending |
| `--chrome-border` | `--q-chrome-border` | Direct duplicate, delete | ⏳ Pending |
| `--focus-ring` | `--q-focus-ring` | Direct duplicate, delete | ⏳ Pending |

#### Border Radii (Lines 31-32)
| Legacy Token | Existing Token | Action | Status |
|--------------|----------------|--------|--------|
| `--r-card` | `--q-radius-card` | Update refs, delete | ⏳ Pending |
| `--r-el` | `--q-radius-el` | Update refs, delete | ⏳ Pending |

**Estimated Savings:** ~30 lines, ~1 KB

---

### **Batch 2: Animation Keyframes**

#### Step Fade Animation (Lines 41-50)
```css
@keyframes qfade {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
```
**Decision:** Migrate to `form-layout.css` (form-specific animation)  
**Status:** ⏳ Pending

#### Progress Bar Sheen (Referenced later in file)
```css
@keyframes progress-sheen {
  to { transform: translateX(100%); }
}
```
**Decision:** Migrate to `form-layout.css` (form-specific animation)  
**Status:** ⏳ Pending

**Estimated Savings:** ~15 lines

---

### **Batch 3: Component Patterns**

#### Card Styling (Lines 52-70)
`.q-card` rules including glass background, chrome border, backdrop-filter.
**Decision:** Check if `components.css` has equivalent; if not, migrate pattern.  
**Status:** ⏳ Pending (requires audit)

#### Shell Container (Lines 72-79)
`.q-shell` outer chrome panel styling.
**Decision:** Likely form-specific; migrate to `form-layout.css`.  
**Status:** ⏳ Pending

#### Typography Overrides (Lines 81-101)
`.q-h3`, `.q-accent`, `.q-spot` heading styles.
**Decision:** Check `components.css` for coverage; update or migrate.  
**Status:** ⏳ Pending

**Estimated Savings:** ~50 lines if duplicates found

---

### **Batch 4: Stepper, Inputs, Buttons, Chips**

Lines 103-300+ contain stepper, form control, button, and chip styling.

**Audit Strategy:**
1. Compare each selector against `components.css` definitions.
2. If identical → delete from legacy.
3. If minor variation → decide: keep override or unify in components.
4. If form-specific → migrate to `form-layout.css`.

**Status:** ⏳ Not started (Phase 2)

---

### **Batch 5: Add-on Cards, Actions, Mobile Overrides**

Lines 300-500 contain add-on tiles, action button groups, mobile responsive adjustments.

**Status:** ⏳ Not started (Phase 3)

---

## 📊 Migration Impact Tracker

| Batch | Lines Removed | KB Saved | Regressions Detected | Notes |
|-------|---------------|----------|----------------------|-------|
| 1 (Tokens) | — | — | — | First priority |
| 2 (Animations) | — | — | — | — |
| 3 (Components) | — | — | — | — |
| 4 (Stepper/Inputs) | — | — | — | — |
| 5 (Add-ons/Mobile) | — | — | — | — |
| **TOTAL** | **0 / 585** | **0 / 14 KB** | **0** | Target: ≤50 lines remaining |

---

## 🚨 Risk Register

| Risk | Mitigation | Status |
|------|-----------|--------|
| Visual regression in preview harness | Baseline screenshots captured before migration | ✅ Ready |
| Token name mismatch breaks production | Search/replace with exact token mapping | ⏳ Planned |
| Cascade order issues | Test after each batch migration | ⏳ Planned |
| Performance regression | Bundle size check after each PR | ⏳ Planned |

---

## 📝 Workflow

1. **Identify batch** (e.g., Batch 1: Tokens)
2. **Search legacy-overrides.css** for token usage (e.g., `var(--brand-navy)`)
3. **Replace with canonical token** (e.g., `var(--q-navy)`)
4. **Remove duplicate declarations** from legacy file
5. **Run visual regression check** (compare screenshots)
6. **Update migration log** with lines saved
7. **Commit with descriptive message**

---

**Next Step:** Execute Batch 1 (Design Token Duplicates)
