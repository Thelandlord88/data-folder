# 🔍 NEXUS DEPENDENCY TRACER

**Systematic File Relationship Analysis Tool**

---

## 🎯 WHAT IS IT?

The **Dependency Tracer** is a specialized tool that performs **systematic dependency analysis** on any file in your codebase. It identifies, maps, and documents all file relationships.

### **Terminology:**

The process you asked about is called:
- **Dependency Tracing** 🔗
- **Import Chain Analysis** 📊
- **Dependency Graph Generation** 🗺️
- **Static Code Analysis** 🔍

---

## 📦 TWO VERSIONS AVAILABLE

### **1. Bash Version** (`dependency-tracer.sh`)

**Best for:** Quick analysis, CI/CD integration, simple reports

**Features:**
- ✅ Fast execution
- ✅ No dependencies required
- ✅ Lightweight
- ✅ Simple output

**Usage:**
```bash
./scripts/dependency-tracer.sh src/components/FactsCarousel.astro
```

---

### **2. Python Version** (`dependency-tracer.py`)

**Best for:** Deep analysis, circular dependency detection, JSON export

**Features:**
- ✅ Circular dependency detection
- ✅ Transitive dependency analysis
- ✅ JSON export for programmatic use
- ✅ Dependency graph data structures
- ✅ Advanced path resolution

**Usage:**
```bash
python scripts/dependency-tracer.py src/components/FactsCarousel.astro
```

---

## 🚀 QUICK START

### **Analyze a Component:**

```bash
# Bash version
./scripts/dependency-tracer.sh src/components/FactsCarousel.astro

# Python version
python scripts/dependency-tracer.py src/components/FactsCarousel.astro
```

### **Deep Analysis (includes dependencies of dependencies):**

```bash
python scripts/dependency-tracer.py src/lib/suburbProvider.ts --deep
```

### **Export as JSON:**

```bash
python scripts/dependency-tracer.py src/pages/index.astro --format json
```

### **Both Formats:**

```bash
python scripts/dependency-tracer.py src/components/Header.astro --format both
```

---

## 📊 WHAT IT ANALYZES

The tracer identifies **4 types of dependencies:**

### **1. Forward Dependencies** (What the file imports)
```typescript
import { something } from './other-file'
// → Identifies: ./other-file as a forward dependency
```

### **2. Reverse Dependencies** (What imports this file)
```typescript
// If ComponentA imports ComponentB
// → ComponentB has ComponentA as reverse dependency
```

### **3. Data Dependencies** (JSON, images, etc.)
```typescript
import data from './data.json'
// → Identifies: ./data.json as a data dependency
```

### **4. Type Dependencies** (Type imports)
```typescript
import type { User } from './types'
// → Identifies: ./types as a type dependency
```

---

## 📋 OUTPUT FILES

### **Generated Reports:**

```
__reports/dependency-traces/
├── DEPENDENCY_TRACE_FactsCarousel_astro_20251012_204530.md
├── NEXUS_PROMPT_20251012_204530.txt
└── DEPENDENCY_TRACE_FactsCarousel_astro_20251012_204530.json
```

### **1. Markdown Report** (`.md`)

Comprehensive human-readable report with:
- Executive summary
- Detailed dependency lists
- File metrics (lines, size)
- Dependency graph visualization
- Missing dependencies
- Circular dependencies (Python version)

### **2. NEXUS Prompt** (`.txt`)

Ready-to-use prompt for NEXUS team analysis:
```
🤖 NEXUS TEAM: DEPENDENCY ANALYSIS REQUEST

Target File: src/components/FactsCarousel.astro
Report Generated: 2025-10-12 20:45:30

MISSION: Comprehensive Dependency Analysis
...
```

### **3. JSON Export** (`.json`) - Python only

Structured data for programmatic use:
```json
{
  "workspace_root": "/workspaces/July22",
  "timestamp": "20251012_204530",
  "nodes": {
    "src/components/FactsCarousel.astro": {
      "forward_dependencies": [...],
      "reverse_dependencies": [...],
      "metrics": {...}
    }
  },
  "circular_dependencies": []
}
```

---

## 🎓 USAGE EXAMPLES

### **Example 1: Analyze a Component**

```bash
./scripts/dependency-tracer.sh src/components/FactsCarousel.astro
```

**Output:**
```
═══════════════════════════════════════════════════════════
  NEXUS DEPENDENCY TRACER v1.0.0
═══════════════════════════════════════════════════════════
✓ Target file found: src/components/FactsCarousel.astro
ℹ Workspace: /workspaces/July22
ℹ Output directory: __reports/dependency-traces

▶ Analyzing Forward Dependencies (Imports)
───────────────────────────────────────────────────────────
ℹ   → ../lib/intelligenceLoader
✓ Found 1 forward dependencies

▶ Analyzing Reverse Dependencies (Consumers)
───────────────────────────────────────────────────────────
ℹ   ← src/pages/services/[service]/[suburb]/index.astro
✓ Found 1 reverse dependencies

...
```

---

### **Example 2: Deep Analysis with JSON Export**

```bash
python scripts/dependency-tracer.py src/lib/suburbProvider.ts \
  --deep \
  --max-depth 3 \
  --format both
```

**What it does:**
- Analyzes `suburbProvider.ts`
- Traces dependencies 3 levels deep
- Detects circular dependencies
- Generates both Markdown and JSON reports

---

### **Example 3: Find Circular Dependencies**

```bash
python scripts/dependency-tracer.py src/lib/someFile.ts --circular-only
```

**Output:**
```
🔄 Detecting circular dependencies...
⚠️  Found 2 circular dependencies!

Cycle 1:
→ FileA.ts
→ FileB.ts
→ FileC.ts
→ FileA.ts
```

---

## 🔧 ADVANCED OPTIONS

### **Bash Version Options:**

```bash
./scripts/dependency-tracer.sh <target-file>
```

**No additional options** - designed for simplicity

---

### **Python Version Options:**

```bash
python scripts/dependency-tracer.py <target-file> [options]

Options:
  --deep                    Analyze transitive dependencies
  --max-depth N             Maximum depth (default: 3)
  --format FORMAT           Output format: markdown, json, both
  --output FILE             Custom output path
  --include-node-modules    Include node_modules
  --circular-only           Only report circular dependencies
```

---

## 📊 USE CASES

### **1. Code Review**
```bash
# Before reviewing a PR
./scripts/dependency-tracer.sh src/components/NewFeature.astro
```

### **2. Refactoring Planning**
```bash
# Understand impact before refactoring
python scripts/dependency-tracer.py src/lib/legacyCode.ts --deep
```

### **3. Circular Dependency Detection**
```bash
# Find problematic dependency cycles
python scripts/dependency-tracer.py src/lib/moduleA.ts --circular-only
```

### **4. Bundle Size Analysis**
```bash
# Analyze dependencies contributing to bundle
python scripts/dependency-tracer.py src/pages/index.astro --format json
```

### **5. Documentation Generation**
```bash
# Generate dependency docs for new developers
./scripts/dependency-tracer.sh src/components/CoreComponent.astro
```

---

## 🤖 NEXUS WORKFLOW

### **Complete Analysis Workflow:**

```bash
# Step 1: Run tracer
python scripts/dependency-tracer.py src/components/FactsCarousel.astro --format both

# Step 2: View markdown report
cat __reports/dependency-traces/DEPENDENCY_TRACE_*.md

# Step 3: Feed NEXUS prompt to AI
cat __reports/dependency-traces/NEXUS_PROMPT_*.txt

# Step 4: NEXUS team provides analysis
```

### **NEXUS Prompt Structure:**

The generated prompt asks NEXUS team to analyze:

1. **Architecture Review** (Chief Architect)
2. **Performance Impact** (Performance Engineer)
3. **Security Assessment** (Security Officer)
4. **Accessibility Implications** (Accessibility Lead)
5. **Design System Coherence** (Visual Design)
6. **Data Flow Analysis** (Data Intelligence)
7. **Testing Strategy** (QA Specialist)
8. **Deployment Considerations** (DevOps Engineer)

---

## 📈 INTERPRETING RESULTS

### **Dependency Counts:**

```
Forward Dependencies:  5   ← Files this imports
Reverse Dependencies:  12  ← Files that import this (high = widely used)
Data Dependencies:     3   ← JSON/static files used
Type Dependencies:     2   ← Type definition files
Missing Dependencies:  0   ← Unresolved imports (should be 0!)
```

### **What the Numbers Mean:**

| Count | Interpretation |
|-------|----------------|
| **Forward: 0-5** | ✅ Low coupling, good |
| **Forward: 6-15** | ⚠️ Medium coupling, acceptable |
| **Forward: 16+** | ❌ High coupling, consider refactoring |
| **Reverse: 0-3** | 🔵 Specialized component |
| **Reverse: 4-10** | 🟢 Commonly used |
| **Reverse: 11+** | ⭐ Core component (critical!) |

---

## 🐛 TROUBLESHOOTING

### **"Target file not found"**

```bash
# Use absolute path or relative from workspace root
./scripts/dependency-tracer.sh ./src/components/File.astro
```

### **"No dependencies found"**

**Possible causes:**
- File doesn't use imports
- File is standalone
- Import patterns not recognized

### **"Missing dependencies detected"**

**Common reasons:**
- Type import from non-existent file
- Alias path not resolved correctly
- External module (node_modules)

---

## 🔄 INTEGRATION

### **CI/CD Integration:**

```yaml
# GitHub Actions example
- name: Dependency Analysis
  run: |
    ./scripts/dependency-tracer.sh src/components/MyComponent.astro
    # Upload report as artifact
```

### **Pre-commit Hook:**

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Analyze changed files
git diff --cached --name-only | while read file; do
  if [[ $file == src/* ]]; then
    ./scripts/dependency-tracer.sh "$file"
  fi
done
```

---

## 📚 TERMINOLOGY REFERENCE

| Term | Definition |
|------|------------|
| **Dependency Tracing** | Process of following import chains |
| **Forward Dependency** | File that TARGET imports |
| **Reverse Dependency** | File that imports TARGET |
| **Transitive Dependency** | Dependency of a dependency |
| **Circular Dependency** | A imports B, B imports A |
| **Dependency Graph** | Visual/data representation of all relationships |
| **Import Chain** | Sequence of imports A→B→C→D |
| **Critical Path** | Most important dependency chain |

---

## 🎯 BEST PRACTICES

1. **Run before refactoring** - Understand impact
2. **Check reverse deps** - Know who uses your code
3. **Monitor circular deps** - They cause bundle issues
4. **Document core components** - High reverse dep count = critical
5. **Review missing deps** - Should always be zero
6. **Analyze bundle impact** - Use JSON export for tooling

---

## 🚀 FUTURE ENHANCEMENTS

**Planned Features:**

- [ ] Visual graph generation (Graphviz/Mermaid)
- [ ] Dependency diff between commits
- [ ] Bundle size estimation
- [ ] Dead code detection
- [ ] Dependency health score
- [ ] Automated refactoring suggestions
- [ ] VS Code extension integration

---

## 📞 USAGE IN YOUR REQUEST

### **What You Asked:**

> "I need to be able to implement that sort of 'hunting' into an adaptive script."

### **Solution Provided:**

✅ **Bash Script** - Simple, fast dependency tracing  
✅ **Python Script** - Advanced analysis with circular detection  
✅ **Structured Reports** - Markdown + JSON  
✅ **NEXUS Integration** - Auto-generated analysis prompts  
✅ **Adaptive** - Works with any file type  

### **How to Use:**

```bash
# Quick analysis
./scripts/dependency-tracer.sh <target-file>

# Deep analysis
python scripts/dependency-tracer.py <target-file> --deep

# Get NEXUS prompt
cat __reports/dependency-traces/NEXUS_PROMPT_*.txt
```

---

## ✅ SUMMARY

**You now have:**

1. ✅ **Bash tracer** - Fast, simple dependency analysis
2. ✅ **Python tracer** - Advanced features + circular detection
3. ✅ **Markdown reports** - Human-readable analysis
4. ✅ **JSON export** - Machine-readable data
5. ✅ **NEXUS prompts** - Ready for AI analysis
6. ✅ **Documentation** - Complete usage guide

**The systematic term for what I did:** **"Dependency Tracing"** or **"Dependency Graph Analysis"**

---

**Created by:** NEXUS System Architecture Team  
**Date:** October 12, 2025  
**Version:** 1.0.0  

🔍 Happy Tracing! ✅
