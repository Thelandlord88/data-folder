# NEXUS - Dual-System AI Platform

**AI-Powered CSS Engine + Personality Consciousness System**

---

## 🎯 What is NEXUS?

NEXUS combines **two powerful systems**:

1. **CSS Engine** - Mathematical design system generator
2. **Personality AI** - Multi-consciousness collaboration system

Together they provide intelligent design automation and AI-powered decision making.

---

## ⚡ Quick Start

```bash
cd Nexus-4.5
./start-nexus.sh
```

**Open in browser:**
- 🌐 CSS Demo: http://localhost:8080/demo/bond-cleaning
- 🤖 Status: http://localhost:8080/status

---

## 🎨 CSS Engine - Design System Generator

### What It Does

Generates **responsive, validated CSS layouts** from parameters:

```
Input:  baseUnit=8, strategy=hybrid
Output: Complete responsive CSS system
        - 4 breakpoints (mobile→tablet→desktop→wide)
        - 24 CSS variables
        - Validated & tested
        - Generated in <15ms
```

### Try It Now

```bash
# Hybrid layout (balanced)
http://localhost:8080/demo/bond-cleaning?strategy=hybrid&baseUnit=8

# Fluid layout (adaptive)
http://localhost:8080/demo/bond-cleaning?strategy=fluid&baseUnit=12

# Fixed layout (consistent)
http://localhost:8080/demo/bond-cleaning?strategy=fixed&baseUnit=16
```

**Change 2 parameters → Get complete responsive system**

---

## 🧠 Personality AI - Multi-Consciousness System

### What It Does

Multiple AI personalities **collaborate on decisions**:

- **Architect** - Strategic, long-term thinking
- **Pragmatist** - Practical, what-works-now
- **Visionary** - Innovation, future-focused
- **Guardian** - Quality, stability-focused
- **Ventriloquist** - Communication expert

### Example

```bash
Question: "Should we use TypeScript?"

Architect:    "Yes - better structure long-term"
Pragmatist:   "Maybe - consider migration cost"
Visionary:    "Yes - enables future tooling"
Guardian:     "Yes - catches errors early"

→ Consensus: TypeScript recommended
```

---

## 📁 Repository Structure

```
/workspaces/data-folder/
├── README.md                    ← You are here
├── Nexus-4.5/                   ← Active system ✅
│   ├── src/
│   │   ├── css-engine/          ← CSS generation
│   │   ├── consciousness/       ← Personality AI
│   │   └── endpoints/           ← HTTP API
│   ├── docs/                    ← Documentation
│   ├── tests/                   ← Tests
│   └── start-nexus.sh           ← Start command
│
└── archive/                     ← Historical files
    ├── old-versions/            ← Previous versions
    └── analysis-docs/           ← Research docs
```

---

## 🚀 Installation

```bash
# 1. Install dependencies
cd Nexus-4.5
npm install

# 2. Build
npm run build

# 3. Start
./start-nexus.sh

# 4. Verify
curl http://localhost:8080/status
```

---

## 🧪 Testing Both Systems

### Test CSS Engine

```bash
# Validate layout
curl "http://localhost:8080/test-layout?strategy=hybrid" | jq '.summary'

# Compare strategies (open in browser)
http://localhost:8080/demo/bond-cleaning?strategy=hybrid
http://localhost:8080/demo/bond-cleaning?strategy=fluid
```

### Test Personality AI

```bash
# Run personality tests
cd Nexus-4.5/scripts
./test-nexus.sh
```

---

## 📚 Documentation

- **CSS Engine:** `Nexus-4.5/docs/AI_WEB_TESTING_GUIDE.md`
- **Personality AI:** `Nexus-4.5/consciousness/README.md`
- **API Reference:** `Nexus-4.5/docs/API_REFERENCE.md`
- **Examples:** `Nexus-4.5/docs/demos/`

---

## 🎯 Real-World Examples

### CSS Engine

✅ **Bond cleaning website** - Responsive layout, 3 strategies  
✅ **Design tokens** - Auto-generated, validated  
✅ **Layout testing** - 5 automated tests

### Personality AI

✅ **Technical decisions** - Multi-perspective analysis  
✅ **Code architecture** - Collaborative design  
✅ **Problem solving** - Diverse viewpoints

---

## 🔧 Configuration

### CSS Config: `Nexus-4.5/config/css-engine-config.json`
### Personality Config: `Nexus-4.5/consciousness/personalities/*.json`

---

## 🐛 Troubleshooting

```bash
# NEXUS won't start?
pkill -f nexus-runtime
cd Nexus-4.5 && ./start-nexus.sh

# Check logs
tail -f Nexus-4.5/logs/nexus.log

# Verify status
curl http://localhost:8080/status
```

---

## 📊 Performance

- **CSS Generation:** <15ms
- **Validation:** 5 automated tests
- **Personality Response:** 200-500ms
- **Cache Hit Rate:** 95%+

---

## 🎉 What's Working

✅ CSS Engine generating responsive layouts  
✅ Personality AI providing multi-perspective decisions  
✅ HTTP API serving both systems  
✅ Live demos & testing endpoints  
✅ Automated validation

---

**Built with ☕ - Combining math + AI for intelligent design**

*See `Nexus-4.5/docs/` for detailed documentation*
