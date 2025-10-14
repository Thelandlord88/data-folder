# Quote Form Style System

**Last updated:** 2025-10-14  
**Maintainership:** Frontend Experience (NEXUS Styling Council)

---

## 1. Layered Architecture

| Order | Asset | Purpose | Notes |
|-------|-------|---------|-------|
| 1 | `src/styles/quote/design-tokens.css` | Single source of truth for colors, spacing, typography, shadows, radii, tokens exposed as `--q-*`. | Only add values needed by multiple components. Prefer extending tokens instead of hard-coded values. |
| 2 | `src/styles/quote/components.css` | Reusable primitives (cards, inputs, buttons, chips, badges, callouts, calendar). Scoped with `[data-quote]`. | **No form-specific layout rules.** Use tokens and existing class names. |
| 3 | `src/styles/quote/form-layout.css` | Quote-form-only layout & structural rules: stepper, progress bar, review grid, sticky mobile bar, step-specific accents. | Import after tokens and components. Keep selectors declarative and scoped. |
| 4 | `src/styles/quote/legacy-overrides.css` (temporary) | Chrome/Glass compact overrides still relied on by `QuoteFormneedsfixing.astro` and harnesses. | Treat as quarantine layer; migrate useful rules into layers 1–3 before writing new CSS here. |
| 5 | Tailwind utilities in markup | Spacing, grids, alignment, responsive adjustments where utilities exist. | Prefer utilities over bespoke CSS when 1:1 match is available. |

To include styles in a view/component:

```astro
<link rel="stylesheet" href="/src/styles/quote/design-tokens.css">
<link rel="stylesheet" href="/src/styles/quote/components.css">
<link rel="stylesheet" href="/src/styles/quote/form-layout.css">
```

---

## 2. Contribution Guidelines

- **No inline `<style>` blocks** inside Astro/HTML templates for the quote form. Use the layered stylesheets instead.
- **Legacy overrides are temporary.** When touching `legacy-overrides.css`, consider whether the rule belongs in tokens/components/layout or can be expressed with utilities.
- **Use tokens first.** Any hex/rgb literal in scoped CSS should be justified. If the value is reusable, add a token.
- **Keep primitives generic.** When writing CSS in `components.css`, ask “could another form feature reuse this?”. If the answer is no, move it to `form-layout.css`.
- **Label new selectors.** Prepend comments indicating the functional area (e.g., `/* PROGRESS */`) to keep files scannable.
- **Minimise overrides.** If markup can express the behaviour (Tailwind grid, flex, spacing), prefer that route.

---

## 3. Common Patterns

### Buttons
- Base styles live in `components.css` under `.q-btn` and variants.
- Form-specific spacing belongs in markup (`gap`, `justify-between`) or `form-layout.css` only if multiple buttons need the same adjustment.

### Stepper & Progress
- Definitions (`#q-progress`, `.q-stepper-item`, animations) reside in `form-layout.css`.
- All markup should use the provided HTML structure; JS manipulates classes only.

### Review Summary
- Grid columns, term/value styles exist in `form-layout.css`.
- Additional summary rows should reuse `.q-row`, `.q-term`, `.q-val` without new CSS.

### Mobile Sticky Bar
- Appearance and spacing handled in `form-layout.css`.
- Visibility toggled via JS utilities; no inline style mutations allowed.

---

## 4. Linting & Guardrails

| Guardrail | Status |
|-----------|--------|
| Inline `<style>` banned | _Pending_ (add stylelint rule `astro/no-inline-styles`). |
| CSS bundle delta check | _Pending_ (hook into CI). |
| Layout validation script | `./validate-form-layout.sh` checks markup + class usage. |

Future work: add automated screenshot diff in the test studio, integrate Lighthouse CSS blocking time delta.

---

## 5. Workflow Checklist

1. **Plan** – Confirm the change fits a layer (tokens / components / layout / markup).  
2. **Implement** – Modify the appropriate stylesheet only; keep diffs scoped.  
3. **Validate** – Run `./validate-form-layout.sh` and preview the quote form (desktop + mobile).  
4. **Document** – Update this guide or inline comments when introducing new primitives or layout behaviours.  
5. **Review** – Ensure tokens are the only source of truth for colours/spacing.

---

## 6. Open Tasks

- [ ] Extract bespoke rules from `QuoteFormneedsfixing.astro` into the shared layers.
- [x] Update `quote-form-preview.html` and `quote-form-test-studio.html` to import shared stylesheets.
- [ ] Audit `legacy-overrides.css` and migrate reusable rules into the primary layers.
- [ ] Add stylelint configuration to flag inline quote-form CSS.
- [ ] Wire CSS bundle size tracking into CI (compare to baseline ~30.6 KB).

---

**Questions?** Ping the Styling Council in the `#quote-form` channel or reference `CSS_ARCHITECTURE_BRIEF.md` for the strategic overview.
