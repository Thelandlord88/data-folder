# 📦 NEXUS v3.0 - Single-File Installer

**Self-extracting shell script containing complete NEXUS deployment**

---

## 📥 Download

**File**: `install-nexus.sh`  
**Size**: 390 KB (compressed)  
**Contains**: Complete NEXUS v3.0 system (1.8 MB uncompressed)

---

## 🚀 Quick Install

### One-Line Installation

```bash
bash install-nexus.sh
```

This will:
1. ✅ Check Node.js version (requires v18+)
2. ✅ Create `nexus/` directory
3. ✅ Extract all NEXUS files
4. ✅ Run `npm install` 
5. ✅ Verify installation
6. ✅ Display quick start guide

### Custom Installation Directory

```bash
bash install-nexus.sh my-nexus-folder
```

---

## 📋 What Gets Installed

The installer extracts:

- **45 AI Personalities** (profiles/)
- **Compiled JavaScript** (dist/)
- **Enhancement History** (consciousness/)
- **Documentation** (docs/)
- **Verification Script** (verify-circuit-breaker.mjs)
- **Package Files** (package.json, README.md, etc.)

Then automatically runs `npm install` to add dependencies.

**Total Size After Install**: ~3 MB

---

## ✅ Requirements

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Disk Space**: ~5 MB
- **OS**: Linux, macOS, or Windows (with bash)

The installer checks these automatically and warns if requirements aren't met.

---

## 🔍 What the Installer Does

1. **Checks System Requirements**
   - Verifies Node.js v18+
   - Verifies npm is installed

2. **Creates Installation Directory**
   - Default: `./nexus/`
   - Custom: Whatever you specify

3. **Extracts NEXUS Package**
   - Decodes embedded base64 archive
   - Extracts tar.gz to installation directory

4. **Installs Dependencies**
   - Runs `npm install`
   - Installs: zod, lru-cache, ws

5. **Verifies Installation**
   - Runs circuit breaker verification
   - Confirms all 45 personalities load

6. **Shows Success Message**
   - Installation location
   - Quick start commands
   - Documentation references

---

## 📖 After Installation

### Verify System

```bash
cd nexus
node verify-circuit-breaker.mjs
```

### Use NEXUS

```javascript
import { PersonalityRegistryLoader } from './dist/loaders/PersonalityRegistryLoader.js';

const loader = new PersonalityRegistryLoader({
  profilesPath: './profiles'
});

await loader.initialize();
const personality = loader.getPersonality('visionary');
```

### Read Documentation

- `README.md` - System overview
- `INSTALL.md` - Installation guide
- `DEPLOY.md` - Deployment instructions
- `docs/` - Comprehensive documentation

---

## 🎯 Features

### Single-File Distribution
- ✅ Entire NEXUS in one .sh file
- ✅ No need to download multiple files
- ✅ No need to clone repositories
- ✅ Works on any system with bash

### Automated Setup
- ✅ Checks requirements
- ✅ Extracts files
- ✅ Installs dependencies
- ✅ Verifies installation
- ✅ No manual configuration

### Production Ready
- ✅ All 45 personalities
- ✅ Circuit breaker protection
- ✅ LRU caching
- ✅ Type-safe TypeScript
- ✅ Complete documentation

---

## 🛠️ Troubleshooting

### "Node.js is not installed"
Install Node.js from: https://nodejs.org (v18+)

### "Node.js version is too old"
Upgrade Node.js to v18+

### "npm is not installed"
npm comes with Node.js, reinstall Node.js

### "Permission denied"
Run with: `bash install-nexus.sh` (not `./install-nexus.sh`)

### Installation fails
Check you have:
- Write permissions in current directory
- ~5 MB free disk space
- Internet connection (for npm install)

---

## 📊 Installer Details

**Technology**: Self-extracting bash script  
**Archive Format**: tar.gz (base64 encoded)  
**Compression**: gzip  
**Size**: 390 KB compressed → 1.8 MB extracted → 3 MB with node_modules  

---

## 🎊 What's Included in NEXUS v3.0

### 45 AI Personalities

**Core (26)**: Full-featured personalities for general tasks  
**Creative (5)**: Visionary, Wordsmith, Chromatic, Narrative, Muse  
**Visual (4)**: StyleForge, PhotoRealist, ArtDirector, VisualArchitect  
**LLM Engineering (4)**: ContextWeaver, ChainArchitect, FineTuner, TokenMaster  
**Advanced (5)**: QuantumLogic, EthicsGuard, PerformanceHawk, DataWhisperer, IntegrationMaestro

### Enterprise Features

- Circuit Breaker Protection
- LRU Caching System  
- Dual Schema Support (V1 & V2)
- TypeScript Type Safety
- Enhancement History Tracking
- Comprehensive Documentation

---

## 🚀 Ready to Install!

Download `install-nexus.sh` and run:

```bash
bash install-nexus.sh
```

That's it! NEXUS will be installed and ready to use in seconds.

---

**NEXUS v3.0** - 45 AI Personalities | Self-Extracting Installer  
*October 2025*
