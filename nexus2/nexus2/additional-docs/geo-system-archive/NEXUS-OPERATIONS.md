# NEXUS + CSS Operations

Operational model for how the NEXUS runtime collaborates with CSS architecture, audits, and dynamic class retention after Tailwind v4 migration.

## 1. Architectural Overview
| Layer | Responsibility | Tooling |
|-------|---------------|---------|
| Tailwind v4 Core | Utility generation & variant expansion | `@tailwindcss/vite` plugin + `@import "tailwindcss"` |
| Source Detection | Discover literal class tokens | `@source` directives in `src/styles/tailwind.css` |
| Dynamic Preservation | Surface non-literal classes | `tw:gen` → `src/tw-dynamic-registry.ts` |
| Style Layering | Cascade ordering & override semantics | `@layer base`, `@layer components`, `@layer utilities` |
| Audit Instrumentation | Evidence-driven metrics | `tools/css/*.mjs` outputs in `__ai/css-audit/` |
| NEXUS Reasoning | Multi-personality analysis & planning | `tools/nexus/ask.mjs` (compose/role-targeted) |

## 2. CSS Data Flow to NEXUS
1. Engineers run or CI triggers audit scripts (Wave 1 + Wave 2).
2. JSON artifacts land in `__ai/css-audit/` (specificity, dynamic patterns, variant usage, etc.).
3. When invoking `ask.mjs`, we can optionally summarize key metrics and include them in the question (planned enhancement: `--context=css`).
4. NEXUS personalities (e.g., daedalus, hunter) generate remediation guidance based on metrics (architecture + evidence synergy).

### Planned `--context=css` Flow (Proposed)
```
node tools/nexus/ask.mjs "Suggest refactors for high specificity selectors" --personality=compose --context=css
```
Would internally:
- Load `specificity.json`, `duplicate-rules.json`, `important-usage.json`.
- Create a compact summary block (e.g., `{"maxSpecificity":160,"important":7,...}`) and append it to the prompt.

## 3. The Ask Utility (`tools/nexus/ask.mjs`)
**Current Behavior:**
- Detects running NEXUS port via `detect-nexus-port.mjs`.
- Posts `{ personalityName, request }` to `/enhance` endpoint.
- Supports `--personality=compose` to engage multi-personality trait composition.
- `--json` returns unmodified response envelope.

**Extension Ideas:**
| Enhancement | Description | Benefit |
|-------------|-------------|---------|
| `--context=css` | Auto-attach summarized audit metrics | Low friction evidence-driven queries |
| `--format=concise` | Force numbered, short-form output | Improves scan speed for CI | 
| `--diff=<file>` | Include unified diff snippet (CSS refactor proposals) | Targeted review suggestions |
| Response Caching | Cache last N question/answer pairs in `__ai/ask-cache.json` | Reduces redundant calls |
| Personality Hints | `--traits=performance,architecture` nudges trait weighting | More focused answers |

## 4. Dynamic Class Registry Workflow
| Step | Command | Result |
|------|---------|--------|
| Generate registry manually | `npm run tw:gen` | Update `src/tw-dynamic-registry.ts` |
| Build / Dev | `npm run build` / `npm run dev` | Auto-regeneration (pre-step) |
| Add manual safelist entries | Edit `__ai/css-audit/tailwind-manual-safelist.txt` | Included next run |
| Inspect added dynamic tokens | `git diff src/tw-dynamic-registry.ts` | Review class growth |

**Guidelines:**
- Avoid putting experimental or one-off debugging classes in the registry—delete after use.
- Use short semantic names for custom classes; prefer utilities for 1–2 property tweaks.

## 5. Layering Governance
| Layer | Acceptable Content | Disallowed |
|-------|-------------------|------------|
| base | Resets, element defaults, global tokens | Component-level patterns, animations unrelated to global scope |
| components | Multi-property reusable patterns (cards, buttons) | Massive one-off page-specific selectors |
| utilities | Single-purpose or micro (≤2–3 declarations) | Full component styling |

**Refactoring Rule of Thumb:** If a selector sets >6–8 properties and is widely reused → components. If it sets one layout or visual tweak → utilities.

## 6. Audit Artifacts & NEXUS Usage
| Artifact | Used By | NEXUS Angle |
|----------|---------|-------------|
| `specificity.json` | Refactor gating | Suggest reorganizing selectors |
| `duplicate-rules.json` | Size optimization | Propose consolidation/utilities |
| `dynamic-class-patterns.json` | Registry generation | Detect missing safelist tokens |
| `important-usage.json` | Governance | Highlight policy drift |
| `variant-usage.json` | Performance/scoping | Recommend pruning unused variants |
| `color-token-map.json` | Design tokens | Suggest alias grouping |

## 7. Roadmap Hooks (CSS ↔ NEXUS)
| Milestone | Description | NEXUS Added Value |
|----------|-------------|-------------------|
| Baseline Gate | Freeze metrics and diff each PR | Auto risk annotations in PR comments |
| Selector Refactor Bot | Suggest lower specificity alternatives | Generate patch prototypes |
| Token Normalizer | Group similar colors & propose tokens | Automated token PR drafts |
| Unused Class Verifier | Distinguish false positives (scoped hash) | Adjust detection heuristics |

## 8. Operational Playbooks
### A. Introducing a New Dynamic Pattern
1. Implement feature with dynamic classes (e.g., `${tier}-badge`).
2. Run `npm run tw:gen` – verify new tokens appear.
3. If not captured, add literal fallback to manual safelist file.
4. Re-run build; confirm production styling.

### B. Reducing Specificity Inflation
1. Identify top offenders from `specificity.json`.
2. Move repeated attribute/ID patterns into a shared component class.
3. Replace in templates with semantic wrapper class.
4. Re-run specificity audit; ensure score reduction.

### C. NEXUS Query Templates
| Intent | Example |
|--------|---------|
| High specificity reduction | `node tools/nexus/ask.mjs "Given max specificity 160 and 7 !important, list 3 refactor strategies to reduce both." --personality=compose` |
| Dynamic class safety | `node tools/nexus/ask.mjs "Review registry gap: propose classes missing from dynamic usage for pricing module." --personality=hunter` |
| Token rationalization | `node tools/nexus/ask.mjs "Suggest grouping of closely related sky/blue hex colors for token consolidation." --personality=daedalus` |

## 9. Quality Gates (Planned)
| Gate | Condition | Status |
|------|-----------|--------|
| Specificity Budget | fail if max > baseline + 10 | Pending implementation |
| Important Budget | fail if count > baseline | Pending |
| Duplicate Reduction | warn if duplicate blocks unchanged after 3 PRs | Pending |
| Registry Drift | warn if dynamic registry grows > 15% in one PR | Pending |

## 10. FAQ
**Q:** Do we need to import the dynamic registry file?  
**A:** No. Tailwind v4 scans it via `@source` and the file lives under `src/`.

**Q:** Why not use an old safelist array in Tailwind config?  
**A:** v4 shifts to scanning; embedding large safelists in config can mask detection gaps and introduce config churn.

**Q:** Are `@source` directives permanent?  
**A:** We will narrow them once confidence in registry + layering is high (performance optimization phase).

---
**Keep this document updated as new NEXUS ↔ CSS automation features land.**
