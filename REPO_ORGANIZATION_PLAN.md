# Repository Organization Plan

**Date:** 2025-10-12  
**Current State:** Messy - lots of old analysis docs  
**Goal:** Clean, focused, working system

---

## 🎯 CURRENT PROBLEMS

1. **Too many analysis docs** (20+ markdown files at root)
2. **Multiple versions** (nexus/, Nexus-4/, Nexus-4.5/, nexusv3/)
3. **Unclear what's active** (which version is "production"?)
4. **Test files scattered** (test-*.json everywhere)
5. **No clear entry point** (what do I run?)

---

## ✅ WHAT'S ACTUALLY WORKING

### Active System: Nexus-4.5
- ✅ NEXUS runtime server (port 8080)
- ✅ CSS Engine with layout pipeline
- ✅ Demo endpoints working
- ✅ TypeScript compiled & running

### Working Endpoints:
- `/status` - Health check
- `/demo/bond-cleaning` - Live demo
- `/preview` - Preview with metadata
- `/test-layout` - Validation

---

## �� PROPOSED STRUCTURE

```
/workspaces/data-folder/
├── README.md                    # Main entry point
├── NEXUS-4.5/                   # Active production system
│   ├── README.md                # How to use NEXUS
│   ├── start-nexus.sh           # Start command
│   ├── package.json
│   ├── tsconfig.json
│   │
│   ├── src/                     # Source code
│   │   ├── endpoints/           # HTTP endpoints
│   │   ├── css-engine/          # CSS generation
│   │   └── consciousness/       # Personality system
│   │
│   ├── docs/                    # Documentation
│   │   ├── QUICK_START.md
│   │   ├── API_REFERENCE.md
│   │   └── demos/               # Demo HTML files
│   │
│   ├── tests/                   # Tests
│   ├── logs/                    # Runtime logs
│   └── output/                  # Generated files
│
├── archive/                     # Old versions
│   ├── nexus-v3/
│   ├── nexus-v4/
│   └── analysis-docs/           # Old markdown files
│
└── tools/                       # Utility scripts
    ├── install-nexus.sh
    └── cleanup.sh
```

---

## 🔧 CLEANUP ACTIONS

### 1. Archive Old Versions
```bash
mkdir -p archive/old-versions
mv nexus/ nexusv3/ nexusv3-deploy/ Nexus-4/ archive/old-versions/
```

### 2. Archive Analysis Docs
```bash
mkdir -p archive/analysis-docs
mv *_ANALYSIS.md *_SUMMARY.md *_REPORT.md archive/analysis-docs/
```

### 3. Consolidate Test Files
```bash
mkdir -p Nexus-4.5/tests/fixtures
mv Nexus-4.5/test-*.json Nexus-4.5/tests/fixtures/
mv Nexus-4.5/*-request.json Nexus-4.5/tests/fixtures/
```

### 4. Clean Up Scripts
```bash
mkdir -p Nexus-4.5/scripts
mv Nexus-4.5/*.sh Nexus-4.5/scripts/
ln -s Nexus-4.5/scripts/start-nexus.sh Nexus-4.5/start-nexus.sh
```

---

## 📋 NEW README.md (Root)

```markdown
# NEXUS CSS Engine

**AI-powered design system generator**

## Quick Start

\`\`\`bash
cd Nexus-4.5
./start-nexus.sh
\`\`\`

Open: http://localhost:8080/demo/bond-cleaning

## Features

- ✅ Responsive layout generation
- ✅ Mathematical precision (8px base unit)
- ✅ Multiple strategies (hybrid/fluid/fixed)
- ✅ AI-observable testing
- ✅ Real-time regeneration

## Documentation

See `Nexus-4.5/docs/` for full documentation.
```

---

## 🎯 PRIORITY ACTIONS (In Order)

1. **Keep NEXUS Running** ✅ (already done)
2. **Archive old versions** (safe, reversible)
3. **Move analysis docs** (declutter)
4. **Organize Nexus-4.5/** (working directory)
5. **Write clear README** (entry point)

---

## 🤔 QUESTIONS FOR YOU

1. **Are nexus/, Nexus-4/, nexusv3/ still needed?**
   → If not, archive them

2. **Do you want all the analysis .md files?**
   → If not, archive them

3. **What's your main use case?**
   → CSS generation? Personality system? Both?

4. **How do you want to work with NEXUS?**
   → Command line? Web interface? API?

---

## ✅ IMMEDIATE WINS

Without touching anything critical:

1. Create `archive/` folder
2. Move old analysis docs there
3. Create clear README.md at root
4. Document what NEXUS actually does

This makes the repo navigable without breaking anything.

---

**Status:** NEXUS is running, ready to organize.  
**Next:** Get your input, then execute cleanup.
