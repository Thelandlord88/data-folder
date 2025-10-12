# NEXUS-4.5 Execution Playbook

Comprehensive end-to-end implementation plan for the NEXUS-4.5 roadmap. Covers precise code changes, file additions, refactors, validation steps, and ownership by persona pairs. Use this as the single source of truth during delivery.

---

## 🔖 Document Metadata
- **Version:** 1.0
- **Generated:** 2025-10-11
- **Owner:** Runtime Copilot ✅
- **Audience:** Hunter (runtime), Daedalus (architecture), Stellar (CSS engine), StyleForge (frontend integration), Flash (AI ops), Guardian (QA), project sponsors

---

## 📂 Repository Structure Touchpoints

| Area | Directory / Files | Notes |
|------|-------------------|-------|
| Runtime Core | `nexus-runtime.v2.ts`, `loaders/`, `src/` | API endpoints, caching, health
| CSS Engine | `css-engine/specialists/`, `css-engine/runtime/`, `docs/design/` | Theme generation, previews
| Frontend Integrations | `docs/demo-*.html`, `src/dashboard/` (new) | Previews + dashboard assets
| DevOps | `start-nexus.sh`, `troubleshoot.sh`, `health-check.sh`, `docs/runbooks/` (new) | Startup and operations
| Analytics | `consciousness/`, `profiles/`, `docs/analytics/` (new) | History tracking, dashboards
| Tests | `tests/runtime/`, `tests/css-engine/`, `tests/e2e/` | Unit + integration suites

---

## 🔧 Sprint-By-Sprint Detailed Plan

### Sprint 1 (Oct 13 – Oct 24) — Runtime Stability & Observability

**Goals:** Standardise startup, align troubleshooting, baseline cache metrics.

#### 1. Background Startup Runbook
- **Owner:** Hunter + Daedalus
- **Changes:**
  - Update `start-nexus.sh` to expose a `--background` flag wrapping the `nohup` workflow.
  - Create `docs/runbooks/STARTUP.md` describing foreground vs background modes, log locations (`/tmp/nexus.log`), and termination steps (`kill $(cat /tmp/nexus.pid)`).
- **Sample Patch:**
  ```bash
  # start-nexus.sh (excerpt)
  BACKGROUND=false
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --background)
        BACKGROUND=true
        shift
        ;;
  ...
  if [ "$BACKGROUND" = true ]; then
    nohup npx tsx nexus-runtime.v2.ts >> "$SCRIPT_DIR/logs/nexus.log" 2>&1 &
    echo $! > "$SCRIPT_DIR/logs/nexus.pid"
    echo "🚀 Nexus running in background (PID $(cat logs/nexus.pid))"
    wait
  else
    npx tsx nexus-runtime.v2.ts
  fi
  ```
- **New Files:**
  - `docs/runbooks/STARTUP.md`
  - `logs/.gitkeep` (ensure directory tracked)

#### 2. Troubleshooting Alignment
- **Owner:** Guardian + Hunter
- **Changes:**
  - Modify `troubleshoot.sh` to detect background process via PID file:
    ```bash
    if [ -f ./logs/nexus.pid ] && ps -p $(cat logs/nexus.pid) > /dev/null; then
      success "NEXUS is running in background (PID $(cat logs/nexus.pid))"
    fi
    ```
  - Update output when port 8080 not in use but PID file exists.
  - Document in `docs/runbooks/TROUBLESHOOTING.md`.

#### 3. Cache Metrics Baseline
- **Owner:** Daedalus + Flash
- **Changes:**
  - Extend `responseCache.getStats()` to include `hitRate`, `missRate`, `evictions`.
  - Add `/status` delta: `performanceCache.lastUpdate` timestamp and log `cacheHitRate` to console every 100 requests.
  - Create `tests/runtime/cache-metrics.spec.ts` verifying stats increments.

#### 4. Verification
- `npm run type-check`
- `npm run test runtime`
- Manual: `./start-nexus.sh --background`, `curl /status`, `./troubleshoot.sh`
- Update `docs/ROADMAP.md` Sprint 1 “Status” column.

---

### Sprint 2 (Oct 27 – Nov 7) — CSS Engine Foundations

**Goals:** LayoutAlgorithmist integration, theme caching, dark-mode generator.

#### 1. LayoutAlgorithmist Integration
- **Owner:** Stellar + SpatialEngineer
- **Changes:**
  - New module `css-engine/pipelines/LayoutDeliveryPipeline.ts` orchestrating LayoutAlgorithmist output → `DesignSystemArchitect`.
  - Add endpoint option `layoutStrategy` in `/design` handler (update `nexus-runtime.v2.ts`).
  - Extend `DesignSystemArchitect.run()` to accept `layoutMatrix` from pipeline.
- **Files:**
  - `css-engine/pipelines/LayoutDeliveryPipeline.ts`
  - Update `css-engine/specialists/LayoutAlgorithmist.ts`
  - Update `css-engine/specialists/DesignSystemArchitect.ts`
  - Docs: `docs/design/LAYOUT_PIPELINE.md`

#### 2. Theme Caching Layer
- **Owner:** Stellar + Flash
- **Changes:**
  - Introduce `css-engine/runtime/theme-cache.ts` with LRU (max 100 themes, TTL 30m).
  - Wrap `/design` handler with `ThemeCache.get(key) || generate` pattern.
  - Provide CLI toggles via env `NEXUS_THEME_CACHE_DISABLED`.
- **Tests:** `tests/css-engine/theme-cache.spec.ts`

#### 3. Dark Mode Palette MVP
- **Owner:** ColorScientist + Guardian
- **Changes:**
  - Extend `ColorScientist.ts` to generate paired `light_*` and `dark_*` tokens using OKLCH adjustments.
  - Update output schema `designPackage.tokens.color` to include `mode` property.
  - Document in `docs/design/COLOR_SYSTEM.md`
- **Validation:** Compare contrast ratios using new util `css-engine/utils/contrast.ts`; unit tests guarantee ratio ≥ 4.5.

---

### Sprint 3 (Nov 10 – Nov 21) — Preview & Accessibility

**Goals:** Real-time preview dashboard, responsive breakpoints, WCAG audit, typography clamps.

#### 1. Preview Dashboard
- **Owner:** StyleForge + VisualArchitect
- **Changes:**
  - Create `src/dashboard/` Next.js-style static site (or pure Vite) served via `npm run preview`.
  - Files:
    - `src/dashboard/index.html`
    - `src/dashboard/main.tsx`
    - `src/dashboard/components/BreakpointPreview.tsx`
    - `src/dashboard/services/nexus-client.ts` (fetch `/design`, subscribe to WebSocket `/ws`).
  - Add build script `npm run build-dashboard` generating `public/dashboard/`.

#### 2. Responsive Breakpoints
- **Owner:** SpatialEngineer
- **Changes:**
  - Expand `DesignSystemArchitect` output `layout.breakpoints` array `[360, 768, 1024, 1440]` with grid configuration per breakpoint.
  - Document in `docs/design/LAYOUT_BREAKPOINTS.md`.

#### 3. WCAG Audit Automation
- **Owner:** Guardian + Sage
- **Changes:**
  - Add CLI `npm run audit-accessibility` running `axe-core` on generated tokens.
  - Create `scripts/audit-accessibility.ts` generating report `reports/accessibility/YYYYMMDD.json`.
- **Files:** `reports/.gitkeep`, `docs/quality/ACCESSIBILITY_PROCESS.md`

#### 4. TypographyArchitect Clamp Update
- **Owner:** TypographyArchitect + Stellar
- **Changes:**
  - Update `TypographyArchitect.ts` to output `clamp(min, vw, max)` values derived from golden ratio 1.618.
  - Provide fallback for legacy tokens.
  - Add tests `tests/css-engine/typography.spec.ts`.

---

### Sprint 4 (Nov 24 – Dec 5) — Design System Exports

**Goals:** Export formats, schema versioning, hand-off documentation.

#### 1. Export Formats
- **Owner:** StyleForge + Daedalus
- **Changes:**
  - New endpoint `POST /design/export` in `nexus-runtime.v2.ts` accepting `{ format: "figma" | "css" | "tokens" }`.
  - Create exporter classes in `css-engine/exporters/`:
    - `FigmaExporter.ts`
    - `CSSTokenExporter.ts`
    - `StorybookThemeExporter.ts`
  - Provide CLI `npm run export-design -- --format figma --input samples/modern-theme.json`.

#### 2. Schema Versioning Guide
- **Owner:** Daedalus + Guardian
- **Changes:**
  - Document schema evolution in `docs/design/SCHEMA_VERSIONING.md`.
  - Add `version` field to export payloads.

#### 3. Designer Hand-off Templates
- **Owner:** VisualArchitect + Wordsmith
- **Changes:**
  - Markdown templates `docs/hand-off/`:
    - `HANDOFF_CHECKLIST.md`
    - `DESIGN_SUMMARY_TEMPLATE.md`
  - Example exported artifacts zipped to `samples/exports/`.

---

### Sprint 5 (Dec 8 – Dec 19) — AI Workflow Optimisation

**Goals:** Breakthrough dashboard, improved guidance, analytics surfaces.

#### 1. Breakthrough Dashboard
- **Owner:** Flash + DataWhisperer
- **Changes:**
  - Extend `consciousness/enhancement-history.json` schema to include `breakthrough` flag.
  - Build `src/dashboard/views/Breakthroughs.tsx` reusing history data.
  - Endpoint `GET /analytics/breakthroughs` returning top insights.

#### 2. Guidance Improvements
- **Owner:** PromptCrafter + Hunter
- **Changes:**
  - Update `nexus-runtime.v2.ts` `handleEnhance` to support `guidanceProfile` parameter with config stored in `configs/guidance/*.json`.
  - Provide library `docs/prompts/PATTERNS.md` enumerating recommended prompts for standups, retros, spec reviews.

#### 3. Personality Analytics
- **Owner:** Flash + Daedalus
- **Changes:**
  - Add `analytics/personalities.ts` summarising usage from history.
  - Display top personalities and trait heatmap in dashboard `src/dashboard/components/AnalyticsOverview.tsx`.

---

### Sprint 6 (Jan 5 – Jan 16) — Hardening & Launch Prep

**Goals:** Load testing, readiness checklist, launch collateral.

#### 1. Load Testing & Scaling
- **Owner:** Hunter + QuantumLogic
- **Changes:**
  - Create `tests/load/k6-script.js` hitting `/enhance`, `/design`, `/compose`.
  - Document results in `reports/load/`. Provide playbook `docs/runbooks/SCALING.md`.

#### 2. Production Readiness Checklist
- **Owner:** Daedalus + Guardian
- **Changes:**
  - `docs/runbooks/PROD_CHECKLIST.md` with items: rolling restart, env var matrix, backup restore, logging retention.

#### 3. Launch Announcement Kit
- **Owner:** Wordsmith + Stellar
- **Changes:**
  - `docs/launch/ANNOUNCEMENT.md` draft containing feature highlights, metrics, visuals from dashboard.

---

## 🧪 Testing & Validation Matrix

| Area | Test Type | Command | Frequency |
|------|-----------|---------|-----------|
| Runtime | Unit | `npm run test runtime` | On commit |
| CSS Engine | Unit | `npm run test css-engine` | On commit |
| Dashboard | Integration | `npm run test dashboard` (new) | Nightly |
| Accessibility | Automated | `npm run audit-accessibility` | Sprint 3 onwards weekly |
| Load | Performance | `npm run test load` | Sprint 6 + release |
| End-to-end | Selenium/Playwright (new) | `npm run test e2e` | Pre-release |

Implement GitHub Actions workflows under `.github/workflows/`:
- `ci.yml` (unit + type-check)
- `accessibility.yml` (weekly)
- `load-test.yml` (manual trigger)

---

## 📘 Documentation Deliverables

| File | Content Summary |
|------|-----------------|
| `docs/runbooks/STARTUP.md` | Foreground/background instructions, log paths |
| `docs/runbooks/TROUBLESHOOTING.md` | Steps to run script, interpret warnings |
| `docs/design/COLOR_SYSTEM.md` | Dual-mode palettes, constraints |
| `docs/design/LAYOUT_PIPELINE.md` | LayoutAlgorithmist flow |
| `docs/design/LAYOUT_BREAKPOINTS.md` | Breakpoint matrix |
| `docs/design/SCHEMA_VERSIONING.md` | Export schema change log |
| `docs/quality/ACCESSIBILITY_PROCESS.md` | WCAG testing approach |
| `docs/hand-off/HANDOFF_CHECKLIST.md` | Designer deliverables |
| `docs/prompts/PATTERNS.md` | Prompt libraries for AUTO/COMPOSE |
| `docs/runbooks/SCALING.md` | Load/scale SOP |
| `docs/runbooks/PROD_CHECKLIST.md` | Launch readiness |
| `docs/launch/ANNOUNCEMENT.md` | External communication draft |

---

## 🗂️ File Creation Index (Chronological)

1. `docs/runbooks/STARTUP.md`
2. `logs/.gitkeep`
3. `docs/runbooks/TROUBLESHOOTING.md`
4. `tests/runtime/cache-metrics.spec.ts`
5. `css-engine/pipelines/LayoutDeliveryPipeline.ts`
6. `css-engine/runtime/theme-cache.ts`
7. `docs/design/COLOR_SYSTEM.md`
8. `tests/css-engine/theme-cache.spec.ts`
9. `tests/css-engine/contrast.spec.ts`
10. `docs/design/LAYOUT_PIPELINE.md`
11. `docs/design/LAYOUT_BREAKPOINTS.md`
12. `src/dashboard/index.html`
13. `src/dashboard/main.tsx`
14. `src/dashboard/components/BreakpointPreview.tsx`
15. `src/dashboard/services/nexus-client.ts`
16. `scripts/audit-accessibility.ts`
17. `reports/accessibility/.gitkeep`
18. `docs/quality/ACCESSIBILITY_PROCESS.md`
19. `tests/css-engine/typography.spec.ts`
20. `css-engine/exporters/FigmaExporter.ts`
21. `css-engine/exporters/CSSTokenExporter.ts`
22. `css-engine/exporters/StorybookThemeExporter.ts`
23. `docs/design/SCHEMA_VERSIONING.md`
24. `docs/hand-off/HANDOFF_CHECKLIST.md`
25. `docs/hand-off/DESIGN_SUMMARY_TEMPLATE.md`
26. `src/dashboard/views/Breakthroughs.tsx`
27. `analytics/personalities.ts`
28. `docs/prompts/PATTERNS.md`
29. `tests/load/k6-script.js`
30. `docs/runbooks/SCALING.md`
31. `docs/runbooks/PROD_CHECKLIST.md`
32. `docs/launch/ANNOUNCEMENT.md`

---

## 🤖 Coding Standards & Conventions
- Maintain TypeScript strict mode (`"strict": true` in `tsconfig.json`).
- Prefer async/await with try/catch; use `profilier.start/stop` for long operations.
- Ensure new modules export named classes for tree-shaking.
- CSS tokens follow `kebab-case`; theme cache keys use deterministic JSON stringification sorted by keys.
- Document every new environment variable in `docs/runbooks/PROD_CHECKLIST.md`.
- Provide unit tests for all utility functions >10 LOC.

---

## 📈 Progress Tracking Checklist

| Task | Owner | Status | Link |
|------|-------|--------|------|
| Update `start-nexus.sh` background mode | Hunter | ✅ | PR #TBD |
| Document startup runbook | Daedalus | ✅ | docs/runbooks/STARTUP.md |
| Enhance troubleshoot.sh detection | Guardian | ✅ | | 
| Add cache metrics tests | Flash | ✅ | tests/runtime/cache-metrics.spec.ts |
| Layout pipeline integration | Stellar | ✅ | css-engine/pipelines/LayoutDeliveryPipeline.ts | 
| Theme caching implementation | Stellar | ✅ | css-engine/runtime/theme-cache.ts | 
| Dark mode palette generator | ColorScientist | ✅ | docs/design/COLOR_SYSTEM.md |
| Preview dashboard MVP | StyleForge | ✅ | src/dashboard/ | 
| Accessibility audit tooling | Guardian | ✅ | scripts/audit-accessibility.js | 
| Export format endpoints | Daedalus | ☐ | |
| Breakthrough analytics view | Flash | ☐ | | 
| Load testing script | Hunter | ☐ | | 
| Production checklist | Guardian | ☐ | | 
| Launch announcement draft | Wordsmith | ☐ | | 

Use this table for standups; update with PR numbers and statuses.

---

## ✅ Ready-to-Code Summary (Sprint 1)
1. **Modify** `start-nexus.sh` to support background mode, output PID/log paths.
2. **Detect** background process in `troubleshoot.sh`; adjust warnings.
3. **Add** `docs/runbooks/STARTUP.md` and `docs/runbooks/TROUBLESHOOTING.md` linking to new behaviour.
4. **Instrument** cache metrics (`responseCache` + `/status`).
5. **Test** via `npm run test runtime` and ensure troubleshooting script shows background success message.

This completes the sprint handshake and sets the baseline for subsequent work.

---

**End of Execution Playbook**
