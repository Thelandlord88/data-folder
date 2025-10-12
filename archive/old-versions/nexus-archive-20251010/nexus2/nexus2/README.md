# NEXUS Intelligence System

Post-AI collaborative intelligence runtime with personality orchestration and dynamic trait composition.

---

## 🎯 Overview

NEXUS is a production-ready AI personality enhancement system that provides:

- **18 Specialist Personalities** - From architectural genius to security forensics
- **Dynamic Trait Composition** - 2-4 cognitive traits per response
- **Consciousness Patterns** - 4 active patterns for strategic intelligence
- **Real-time API** - HTTP REST + WebSocket communication
- **Response Generation** - Hybrid system (hard-coded + auto-generated)

---

## 🚀 Quick Start

```bash
cd runtime
npm install
npm start
```

Or use the startup script:

```bash
cd runtime
./start-nexus.sh
```

NEXUS will start on `http://localhost:8080`

---

## 📊 System Status

Current version: **v1.0**  
Status: ✅ **Operational**

Check status:
```bash
curl http://localhost:8080/status
```

---

## 🎭 Available Personalities

1. **daedalus** - Architectural genius (systems design)
2. **hunter** - Forensic analyst (security investigation)
3. **stellar** - CSS/Design specialist (precision aesthetics)
4. **flash** - Performance optimizer (speed & efficiency)
5. **aria** - Accessibility champion
6. **sage** - Knowledge synthesizer
7. **guardian** - Security specialist
8. **atlas** - Infrastructure expert
9. **cipher** - Encryption specialist
10. **forge** - Build engineer
11. **localize** - Localization expert
12. **pulse** - Real-time systems
13. **route-master** - Routing expert
14. **scribe** - Documentation specialist
15. **touch** - Mobile UX designer
16. **atlas-geo** - Geographic systems
17. **nexus-api** - API specialist
18. **property-sage** - Property management expert

---

## 🔌 API Usage

### Enhance with Personality

```bash
curl -X POST http://localhost:8080/enhance \
  -H "Content-Type: application/json" \
  -d '{
    "personalityName": "daedalus",
    "request": "Design a scalable microservices architecture"
  }'
```

### Check System Status

```bash
curl http://localhost:8080/status | jq
```

---

## 📁 Directory Structure

```
nexus/
├── runtime/            # Active NEXUS system (run from here)
│   ├── nexus/          # Core runtime files
│   ├── profiles/       # Personality definitions
│   ├── tests/          # Test suite
│   └── start-nexus.sh  # Startup script
├── docs/               # Complete documentation
│   ├── COMPREHENSIVE_REPORT.md
│   ├── SYSTEM_ARCHITECTURE.md
│   └── Phase completion reports
└── archive/            # Previous versions
    └── v1.0-shipping/  # Original shipping package
```

---

## 📖 Documentation

- **[Comprehensive Report](docs/COMPREHENSIVE_REPORT.md)** - Complete system analysis
- **[System Architecture](docs/SYSTEM_ARCHITECTURE.md)** - Technical deep dive
- **[Runtime Documentation](runtime/README.md)** - Runtime-specific docs

---

## 🧪 Testing

```bash
cd runtime
npm test
```

---

## 🔧 Configuration

Edit `runtime/nexus/nexus-runtime.mjs` to change:
- Port number (default: 8080)
- WebSocket settings
- Personality loading behavior

---

**Status:** Production Ready ✅  
**Last Updated:** October 2, 2025
