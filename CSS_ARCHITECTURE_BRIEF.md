# Quote Form CSS Architecture Brief

**Date:** 2025-10-14  
**Prepared by:** NEXUS Styling Council (Architect · StyleForge · Resource Weaver · PerformanceHawk · Scribe)  
**Scope:** Quote form experience served by `src/components/quote/QuoteForm.astro` and related assets.

---

## 🎯 Purpose

Establish a clear inventory, baseline metrics, and target architecture for refactoring the quote form CSS. The objective is to eliminate the "scattered custom CSS" failure class and enable resourceful reuse of existing styling assets without introducing new frameworks or redundant layers.

---

## 🧾 Current Inventory (2025-10-14)

| Layer | File(s) | Role | Notes |
|-------|---------|------|-------|
| **Design Tokens** | `src/styles/quote/design-tokens.css` (280 lines, 8.6 KB) | Single source for colors, typography, spacing, effects. | Well-commented, but several hard-coded values still appear elsewhere. |
| **Component Primitives** | `src/styles/quote/components.css` (877 lines, 22 KB) | Reusable patterns scoped with `[data-quote]` (cards, labels, buttons, chips, etc.). | Form-specific rules have been extracted to `form-layout.css`; continue auditing for stray overrides. |
| **Form Orchestrator** | `src/components/quote/QuoteForm.astro` (829 lines) | Imports token + component styles and `form-layout.css`; extensive JS logic. | Inline `<style>` removed; form-only styles now live in `form-layout.css`. |
| **Legacy Working Copy** | `QuoteFormneedsfixing.astro` (459 lines) | Reference version used for manual iteration. | ✅ Inline CSS removed; now imports shared layers + legacy-overrides. |
| **Preview/Test Harness** | `quote-form-preview.html`, `quote-form-test-studio.html` | Standalone preview with harness UI. | ✅ Now import shared layers + legacy-overrides; panel styles remain inline. |
| **Legacy Overrides Layer** | `src/styles/quote/legacy-overrides.css` (566 lines, 13 KB) | Chrome/Glass compact styling extracted from inline blocks. | 🟡 Batches 1-2 complete (tokens migrated); Batch 3+ awaiting visual baselines. |

---

## ⚠️ Pain Points / Failure Classes

1. **Mixed Concerns in `components.css`** – Form layout overrides and one-off selectors live alongside reusable primitives, making it hard to know where new rules belong.
2. **Inline Styling Hooks** – Preview/test harnesses and the legacy working copy rely on inline CSS that bypasses token governance.
3. **Token Drift** – Several color/spacing values in `components.css` and markup do not reference the token variables, risking inconsistency if the palette changes.
4. **Discoverability Gaps** – No concise documentation that tells contributors where to place new CSS, leading to ad-hoc additions.
5. **Regression Risk** – No automated guardrails (lint/checks) to prevent inline CSS or detect bundle bloat.

---

## 📏 Baseline Metrics (Pre-Refactor)

| Metric | Value | Capture Method |
|--------|-------|----------------|
| Design tokens size | 280 lines / 8.6 KB | `wc -l`, `ls -lh` |
| Component styles size | 877 lines / 22 KB | `wc -l`, `ls -lh` |
| Quote form component | 829 lines | `wc -l` |
| Inline `<style>` occurrences | `QuoteForm.astro`, `quote-form-preview.html`, `quote-form-test-studio.html` | `grep -R "<style"` |
| Total bundle (tokens + components) | ~30.6 KB raw | Sum of file sizes (pre-compression) |
| Visual baseline | Quote form test studio (desktop & mobile) screenshots – _to be captured during Phase 3_ | Pending |

> **Note:** The line count disparity between `QuoteFormneedsfixing.astro` and `src/components/quote/QuoteForm.astro` indicates divergence that must be reconciled before final rollout.

---

## 🏛️ Target Architecture

1. **Layered Stylesheet Hierarchy**
   - `design-tokens.css` – remains single source of truth. Expand only with cross-component variables.
   - `components.css` – retain reusable primitives (buttons, cards, chips, calendar) only. Remove form-specific layout tweaks.
   - `form-layout.css` (new) – house quote-form-only layout rules (step spacing, responsive grids, card accents). Scoped with `[data-quote]`.
2. **Markup Discipline**
   - Remove inline `<style>` from Astro component.
   - Ensure markup uses Tailwind utility classes for simple spacing/alignment before adding new CSS.
   - Decommission `QuoteFormneedsfixing.astro` once parity is verified or convert into scripted regression fixture.
3. **Governance**
   - Document rules in repository (`QUOTE_FORM_STYLE_SYSTEM.md`).
   - Add lint rule that blocks inline `<style>` inside Astro components.
   - Add CI check for CSS bundle size regression and Lighthouse snapshot.

---

## ✅ Success Criteria

- **Structural:** A dedicated `form-layout.css` exists; `components.css` contains primitives only; inline `<style>` blocks eliminated from production Astro components.
- **Consistency:** All colors, spacing, and effects reference tokens; no raw hex values remain in scoped CSS.
- **Automation:** Stylelint (or equivalent) fails builds when inline CSS appears; CI reports CSS bundle delta per PR.
- **Documentation:** Updated README / architecture docs describe where new styles belong and how to extend them.
- **Visual Integrity:** Regression testing via quote form studio shows no layout or styling regressions across desktop/mobile states.

---

## 🔜 Next Steps (Phase Alignment)

### ✅ **Completed Phases**

**Phase 1-2 Complete (2025-10-14)**
- ✅ Design tokens established in `design-tokens.css` (280 lines)
- ✅ Component primitives extracted to `components.css` (686 lines)
- ✅ Form layout extracted to `form-layout.css` (204 lines)
- ✅ Inline `<style>` blocks removed from production components
- ✅ Legacy styles quarantined in `legacy-overrides.css` for staged migration

**Phase 3a Complete (2025-10-14)**
- ✅ Baseline metrics documented (44.8 KB → 43.8 KB current)
- ✅ Migration tracking system established
- ✅ **Batch 1:** 23 duplicate color token declarations eliminated
- ✅ **Batch 2:** Border radii & focus-ring tokens standardized
- ✅ Visual regression baseline capture guide created

### 🟡 **In Progress**

**Phase 3b – Legacy Override Migration**
- **Status:** Batches 1-2 complete, Batch 3 blocked
- **Remaining:** Animation keyframes, component pattern cleanup
- **Blocker:** Visual regression baselines needed before Batch 3
- **Progress:** 19 lines / 1 KB eliminated (2% reduction achieved)

### 🔴 **Next Actions**

1. **Capture Visual Baselines** (blocking Batch 3)
   - Screenshot test studio: 11 captures (desktop + mobile, all steps)
   - Store in `__reports/css-refactor/baseline-screenshots/`
2. **Complete Batch 3** (after screenshots)
   - Extract animation keyframes to `form-layout.css`
   - Estimated: 15 min, -15 lines
3. **Execute Batches 4-5** (component pattern audit)
   - Compare legacy patterns vs `components.css`
   - Eliminate duplicates, consolidate overrides
   - Estimated: 60+ min, -150+ lines, -5+ KB

### 📋 **Phase 4 – Documentation & Guardrails** (Deferred)
- Publish `QUOTE_FORM_STYLE_SYSTEM.md` ✅ (already complete)
- Integrate stylelint/CI checks
- Add bundle size regression protection

---

## 📎 Attachments & References

- `COMPACT_LAYOUT_UPDATE.md` – Prior layout compaction work (space-saving baseline).
- `LAYOUT_VALIDATION_REPORT.md` – Recently validated Tailwind class corrections.
- `validate-form-layout.sh` – Script for structure checks (aligned with new layers).
- `QUOTE_FORM_STYLE_SYSTEM.md` – Contributor guide for day-to-day styling work.

---

**Ready for Phase 1 execution.** The brief will be updated if requirements or assets change.
