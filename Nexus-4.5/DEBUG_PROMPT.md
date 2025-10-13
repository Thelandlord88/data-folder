# Debug Request: WCAG Hunter Service Integration Issue

**Date:** 2025-10-12  
**Context:** Integrating Python WCAG hunters with TypeScript NEXUS runtime

---

## 🎯 What We're Trying to Do

We've built a complete WCAG accessibility compliance system that:

1. **Python Hunters** (`hunters/wcag_hunters.py`) - Scans HTML and generates JSON reports
2. **TypeScript Bridge** (`src/services/wcag-hunter.service.ts`) - Spawns Python, processes results
3. **HTTP Endpoints** (`src/endpoints/wcag-check.ts`) - Exposes `/wcag-check` and `/wcag-report`
4. **Type System** - Full type safety with `WcagMasterReport`, `WcagCheckResult`, etc.

**Goal:** Make NEXUS able to check any HTML for WCAG compliance and return results with personality AI analysis.

---

## ❌ The Problem

**NEXUS server won't start properly.** We're getting module resolution errors.

### Error Symptoms:

1. **When trying to start with ts-node:**
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'ts-node'
```

2. **When trying to run from dist/:**
```
node dist/nexus-runtime.v2.js
```
Server starts but we can't verify if it's working - `curl` hangs or returns nothing.

3. **TypeScript compilation has errors:**
```
src/endpoints/layout-tokens.ts(8,40): error TS2307: Cannot find module 'express'
src/personalities/index.ts(11,8): error TS2307: Cannot find module './types'
```

### What We've Tried:

1. ✅ Fixed ESM imports in `wcag-hunter.service.ts` (changed `require('fs')` to `import('fs')`)
2. ✅ Fixed relative import path in `src/personalities/index.ts` (changed `'./types'` to `'../types/index.js'`)
3. ✅ Added WCAG endpoints to `nexus-runtime.v2.ts`
4. ❌ Can't get NEXUS to start and respond

---

## 📁 Key Files

### 1. WCAG Hunter Service (TypeScript Bridge)
**File:** `src/services/wcag-hunter.service.ts`

**Issue:** Lines 52-53 and 63 still reference `fs` variable that doesn't exist:
```typescript
// Line 27 - We import fs
const { writeFileSync, unlinkSync, readFileSync } = await import('fs');

// Line 52-53 - BUG: Using 'fs' instead of destructured functions
try { fs.unlinkSync(tmpFile); } catch (e) {}

// Line 63 - BUG: Using 'fs' instead of destructured function
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
```

**Should be:**
```typescript
try { unlinkSync(tmpFile); } catch (e) {}
const report = JSON.parse(readFileSync(reportPath, 'utf8'));
```

### 2. Runtime Server
**File:** `nexus-runtime.v2.ts`

Routes added (lines ~340-350):
```typescript
// POST /wcag-check - Full WCAG analysis
if (req.method === 'POST' && req.url === '/wcag-check') {
  const { handleWcagCheck } = await import('./src/endpoints/wcag-check.js');
  await handleWcagCheck(req, res);
  return;
}
```

### 3. WCAG Endpoint Handler
**File:** `src/endpoints/wcag-check.ts`

Uses `readBody()` helper to parse POST body with HTML content, then calls `wcagHunterService.runFullCheck(html)`.

---

## 🧪 How to Test

Once server is running:

```bash
# 1. Get HTML from bond-cleaning demo
curl -s http://127.0.0.1:8080/demo/bond-cleaning > /tmp/test.html

# 2. Send to WCAG checker
curl -X POST http://127.0.0.1:8080/wcag-check \
  -H "Content-Type: application/json" \
  -d '{"html": "'"$(cat /tmp/test.html)"'"}'

# Expected: JSON with wcag_report, personality_analysis, intelligence_data, strategic_implications
```

---

## 🎯 Specific Questions

1. **How do we fix the `fs` reference bug in wcag-hunter.service.ts?**
   - Lines 52-53, 63 use `fs.unlinkSync` and `fs.readFileSync` but `fs` isn't defined
   - We destructured the functions but forgot to update usage

2. **How do we properly start NEXUS runtime?**
   - Should we use compiled `dist/` version?
   - Do we need to rebuild after fixes?
   - What's the correct command?

3. **Are there other module resolution issues?**
   - `express` module missing in layout-tokens.ts (can ignore for now)
   - Any other import path issues?

---

## 📊 System Info

- **Node.js:** v22.17.0
- **TypeScript:** Using tsconfig.json with ES modules
- **File Structure:**
  ```
  Nexus-4.5/
  ├── src/
  │   ├── types/
  │   │   ├── index.ts
  │   │   ├── nexus.types.ts
  │   │   └── wcag.types.ts
  │   ├── services/
  │   │   └── wcag-hunter.service.ts (BUGGY)
  │   ├── endpoints/
  │   │   └── wcag-check.ts
  │   └── personalities/
  │       └── index.ts
  ├── hunters/
  │   └── wcag_hunters.py (Python - WORKING)
  ├── dist/ (compiled JS)
  └── nexus-runtime.v2.ts (main server)
  ```

---

## ✅ What's Already Working

- ✅ Python WCAG hunters work perfectly (tested standalone)
- ✅ Type system is complete and correct
- ✅ Endpoints are wired into runtime
- ✅ Most imports are fixed

---

## 🆘 Please Help With

1. **Fix the `fs` variable references** in wcag-hunter.service.ts
2. **Get NEXUS server to start and respond** to curl requests
3. **Test the full flow** from HTML → Python hunters → JSON response
4. **Verify endpoint works** and returns proper WcagCheckResult

---

## 🎁 Bonus Context

This is the culmination of:
- ✅ Strategic Intelligence type system (508 lines)
- ✅ WCAG-specific types extending IntelligenceData
- ✅ 5 type-safe personalities (Architect, Pragmatist, Visionary, Guardian, WCAG Specialist)
- ✅ Python hunter-pack patterns (3 hunters + orchestrator)
- ✅ TypeScript bridge connecting everything

**We're SO CLOSE!** Just need to debug the runtime startup and fs references.

---

## 📝 Success Criteria

When working, you should be able to:

```bash
curl -X POST http://127.0.0.1:8080/wcag-check \
  -H "Content-Type: application/json" \
  -d '{"html": "<html>...</html>"}'
```

And get back:
```json
{
  "wcag_report": { "total_issues": 1, ... },
  "personality_analysis": {
    "guardian": "🛡️ Found 1 accessibility issue...",
    "pragmatist": "🔧 WCAG compliance impacts SEO...",
    "architect": "🏗️ 1 area needs attention...",
    "visionary": "🚀 Accessibility enhances design..."
  },
  "intelligence_data": { "threatLevel": "medium", ... },
  "strategic_implications": { "accessibilityImpact": [...], ... }
}
```

---

**Thank you for helping debug this!** ☕🚀
