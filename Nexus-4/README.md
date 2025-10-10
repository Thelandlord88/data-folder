# NEXUS-4 - Consolidated NEXUS Runtime

Created: 2025-10-10 00:52:42

## Overview

This is a clean, consolidated version of NEXUS created by analyzing all previous versions
and selecting the best files based on:
- Code completeness (line count)
- Modification date (newer preferred)
- Source quality (TypeScript over JavaScript where available)
- Duplicate removal

## Statistics

- **Source Files**: 100
- **Profiles**: 45
- **Documentation**: 4
- **Files Kept**: 96
- **Duplicates Removed**: 167

## Structure

```
Nexus-4/
├── src/              # TypeScript source files
│   ├── response-generators/
│   ├── loaders/
│   ├── validation/
│   └── types/
├── dist/             # Compiled JavaScript (to be generated)
├── profiles/         # Personality profiles
├── docs/             # Documentation
├── config/           # Configuration files
├── consciousness/    # Runtime data storage
└── tests/            # Test files
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Compile TypeScript:
   ```bash
   npm run build
   ```

3. Run runtime:
   ```bash
   node dist/nexus-runtime.js
   ```

## Version Selection

Files were selected from these sources in priority order:
1. `nexus2/nexus2/runtime/nexus/` - Most recent working version
2. `nexusv3/src/` - V3 sources
3. `nexus/src/` - Original sources

See `NEXUS4_MANIFEST.json` for complete file selection decisions.
