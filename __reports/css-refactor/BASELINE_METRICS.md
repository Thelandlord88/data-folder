# CSS Refactor Baseline Metrics

**Date:** 2025-10-14  
**Phase:** Pre-migration (legacy-overrides quarantine layer established)

---

## 📊 Current Bundle Composition

| File | Lines | Size | Purpose |
|------|-------|------|---------|
| `design-tokens.css` | 280 | 8.6 KB | Design system variables (colors, spacing, effects) |
| `components.css` | 686 | 17 KB | Reusable UI primitives (buttons, cards, chips) |
| `form-layout.css` | 204 | 5.2 KB | Quote form layout & structural rules |
| `legacy-overrides.css` | 585 | 14 KB | ⚠️ **QUARANTINE LAYER** – Chrome/Glass rules extracted from inline blocks |
| **TOTAL** | **1,755** | **44.8 KB** | Raw CSS before compression |

---

## 🎯 Migration Goals

1. **Eliminate Duplication**: Identify color/spacing/effect variables in `legacy-overrides.css` that duplicate `design-tokens.css`.
2. **Extract Reusable Patterns**: Move component primitives (buttons, cards) from legacy layer → `components.css`.
3. **Consolidate Layout Rules**: Migrate form-specific structural rules → `form-layout.css`.
4. **Delete Obsolete Overrides**: Remove rules that are exact duplicates or no longer needed.
5. **Shrink Bundle**: Target ≤35 KB total (20% reduction) by migration completion.

---

## 📈 Success Metrics

- **Bundle Size**: Reduce from 44.8 KB → ≤35 KB
- **Legacy Layer**: Shrink from 585 lines → <50 lines (or delete entirely)
- **Token Drift**: Zero hard-coded colors/spacing in production CSS
- **Visual Integrity**: No regressions detected in baseline screenshot comparisons

---

## 🔍 Known Duplication Hot Spots

### Colors (Design Tokens Layer)
Both `design-tokens.css` and `legacy-overrides.css` define:
- `--brand-navy`, `--brand-sky`, `--brand-sky-400`, `--brand-sky-600`
- `--silver-50` through `--silver-500`
- `--brand-error`, `--brand-green`, `--brand-green-light`

### Shadows & Effects
- `--shadow-1`, `--shadow-2` duplicated
- `--glass-bg`, `--chrome-border` gradient definitions duplicated
- `--focus-ring` duplicated

### Animations
- `qfade` keyframe animation (step transitions) duplicated
- `progress-sheen` keyframe animation duplicated

---

## 📝 Migration Log Reference

Detailed rule-by-rule migration decisions tracked in:
- `LEGACY_OVERRIDE_MIGRATION.md` (to be created in next step)

---

## 🚨 Pre-Migration Checklist

- [x] CSS bundle metrics documented
- [ ] Visual regression baselines captured
- [ ] Migration tracking log initialized
- [ ] First batch candidates identified
