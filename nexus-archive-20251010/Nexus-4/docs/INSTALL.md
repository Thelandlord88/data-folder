# NEXUS v3 Installation Guide

## Prerequisites

- **Node.js**: v18+ recommended
- **npm**: v9+ recommended  
- **TypeScript**: v5+ (installed as dependency)

---

## Installation Steps

### 1. Install Dependencies

```bash
cd nexusv3
npm install
```

This will install:
- `zod` - Schema validation
- `lru-cache` - Performance caching
- `typescript` - Type safety
- All type definitions

### 2. Verify Installation

```bash
node verify-circuit-breaker.mjs
```

Expected output:
```
✅ PersonalityRegistryLoader: OPERATIONAL
✅ Circuit Breaker: ENABLED  
✅ Caching: ENABLED
✅ New Personalities Loaded: 18/18
✅ Success Rate: 100.0%
```

### 3. (Optional) Recompile TypeScript

If you make changes to `src/` files:

```bash
npx tsc
```

---

## Dependencies

### Required

```json
{
  "zod": "^3.22.0",
  "lru-cache": "^10.0.0"
}
```

### Development

```json
{
  "typescript": "^5.2.0",
  "@types/node": "^20.8.0"
}
```

---

## Troubleshooting

### Issue: Module not found

**Solution**: Run `npm install`

### Issue: TypeScript errors

**Solution**: Run `npx tsc` to recompile

### Issue: Personalities not loading

**Solution**: Run `node verify-circuit-breaker.mjs` to diagnose

---

## System Requirements

- **Disk Space**: ~2MB (without node_modules)
- **RAM**: Minimal (personalities are lazy-loaded)
- **Network**: None required (all local)

---

## Quick Test

```javascript
import { PersonalityRegistryLoader } from './dist/loaders/PersonalityRegistryLoader.js';

const loader = new PersonalityRegistryLoader({
  profilesPath: './profiles'
});

await loader.initialize();
console.log('✅ NEXUS ready!');
```

---

**Ready to use NEXUS v3!** 🚀
