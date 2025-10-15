# NEXUS 5.0 - Functional Reorganization Plan

**Date:** 2025-10-14  
**Architect:** Council Collaboration  
**Goal:** Create clean, maintainable structure for NEXUS Intelligence System

---

## 📁 **Directory Structure**

```
Nexus-5.0/
├── runtime/           # Core execution engine
│   ├── nexus-runtime.v2.ts
│   ├── NEXUS.engine.v2.ts
│   ├── nexus-bridge.ts
│   └── nexus-bridge.types.ts
│
├── personalities/     # Personality system
│   ├── registry/     # Personality JSON files
│   ├── loader/       # Loading & caching logic
│   └── ventriloquist/  # Personality ventriloquist system
│
├── consciousness/     # Consciousness patterns & learning
│   ├── patterns/     # JSON pattern files
│   ├── bridge/       # Consciousness bridge implementation
│   └── evolution/    # Pattern evolution engine
│
├── docs/             # All documentation
│   ├── api/          # API documentation
│   ├── guides/       # User guides
│   ├── architecture/ # System architecture docs
│   └── sessions/     # Session summaries & meeting notes
│
├── tools/            # Utility scripts
│   ├── start-nexus-enhanced.sh
│   ├── nexus-status.sh
│   └── diagnostics/
│
├── config/           # Configuration files
│   ├── project-patterns.json
│   ├── pattern-effectiveness.json
│   └── nexus-config.json
│
├── logs/             # Runtime logs (generated)
│
├── analytics/        # Analytics & history tracking
│   ├── history.json
│   └── metrics/
│
├── tests/            # Test files
│   └── integration/
│
└── lib/              # Shared libraries & utilities
    └── common/

```

---

## 🎯 **Migration Strategy**

### Phase 1: Core Runtime (IN PROGRESS)
- [x] Create directory structure
- [ ] Copy runtime files
- [ ] Copy personality system
- [ ] Copy consciousness system

### Phase 2: Documentation
- [ ] Organize all .md files
- [ ] Create index/README structure

### Phase 3: Tools & Config
- [ ] Copy utility scripts
- [ ] Copy configuration files

### Phase 4: Cleanup & Testing
- [ ] Create README.md
- [ ] Test runtime startup
- [ ] Archive Nexus-4.5

---

**Status:** Phase 1 in progress
