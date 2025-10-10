# NEXUS v3 Quick Reference Guide

**For Cross-Referencing Between NEXUS Instances**

---

## File Inventory (Quick Check)

### Source Files (5):
```
✓ src/NEXUS.engine.v2.ts              (900 lines - Core engine)
✓ src/nexus-runtime.v2.ts             (700 lines - HTTP server)
✓ src/loaders/PersonalityRegistryLoader.ts  (400 lines - Loader)
✓ src/types/personality.types.ts      (200 lines - Types)
✓ src/validation/personality-schema.ts (150 lines - Validation)
```

### Personalities (45):
```
Security: cipher, hunter, guardian, ethicsguard
Python: pythonista
Architecture: daedalus, integrationmaestro, chainarchitect, nexus-api
Performance: flash, performancehawk, finetuner
Creative: muse, visualarchitect, chromatic, artdirector, photorealist, styleforge
Writing: wordsmith, scribe, narrative, pulsewriter, promptcrafter, promptsmith
AI: aria, tokenmaster, contextweaver, stellar
Data: datawhisperer, atlas, atlas-geo, quantumlogic, pulse
Build: forge, codex-liaison
Specialized: property-sage, localize, touch, chorus, symphony, route-master
Vision: visionary, sage, personality-architect
```

### Config Files (3):
```
✓ package.json
✓ tsconfig.json  
✓ package-lock.json
```

### Scripts (3):
```
✓ install-nexus-complete.sh
✓ package-nexus.sh
✓ verify-circuit-breaker.mjs
```

---

## Function Quick Reference

### NEXUS.engine.v2.ts - Core Functions

**TraitIndexer:**
- `indexPersonality(id, data)` - Index personality traits
- `searchTraitsForRequest(text, max)` - Smart search with fuzzy matching

**ComposedAgentFactory:**
- `composeAgent(request, maxTraits)` - Create composed agent
- `calculateOverallSynergy(traits)` - Calculate synergy score

**TraitCompositionBridge:**
- `initialize(loader)` - Load personalities
- `selectOptimalPersonality(request)` - AUTO mode
- `composeOptimalAgent(request, max)` - COMPOSE mode
- `generateComposedResponse(request, max)` - Generate with cache
- `getCachedResponse(key)` - Retrieve cached
- `cacheResponse(key, response)` - Cache with LRU
- `clearCache()` - Clear cache

**MultiPersonalityResponseGenerator:**
- `generateResponse(request)` - Main entry point
- `synthesizeMultiPersonalityResponse(request)` - Multi-personality synthesis
- `generatePersonalityPerspective(id, personality, request, agent)` - Single perspective

### nexus-runtime.v2.ts - Server Functions

**NexusRuntime:**
- `initialize()` - Start system
- `start(port)` - Start server (default 8080)
- `stop()` - Stop server
- `handleRequest(req, res)` - Route requests
- `handleStatus(req, res)` - GET /status
- `handleEnhance(req, res)` - POST /enhance
- `validateRequest(body, res)` - Input validation
- `checkRateLimit(ip, res)` - Rate limiting

### PersonalityRegistryLoader.ts - Loader Functions

**PersonalityRegistryLoader:**
- `initialize()` - Load all personalities
- `getPersonality(id)` - Get by ID
- `getPersonalityRegistry()` - Get all
- `reloadPersonality(id)` - Hot reload
- `getCircuitBreakerState()` - Get CB state
- `loadPersonalityFile(path)` - Load with error handling

---

## Configuration Values

### Cache:
- Max Size: 100 responses
- TTL: 5 minutes (300,000ms)
- Type: LRU eviction

### Rate Limiting:
- Window: 1 minute (60,000ms)
- Max: 30 requests per IP
- Response: HTTP 429 when exceeded

### Input Validation:
- Max Length: 10KB (10,000 chars)
- Required: Non-empty string
- Valid Modes: AUTO, COMPOSE
- Sanitization: Trim whitespace

### Circuit Breaker:
- Failure Threshold: 5 failures
- Reset Timeout: 60 seconds
- Half-Open Test: 1 request
- States: CLOSED, OPEN, HALF_OPEN

### Server:
- Default Port: 8080
- WebSocket: Enabled
- Protocol: HTTP (localhost)

---

## API Endpoints

### GET /status
Returns system health and statistics

### POST /enhance
Main enhancement endpoint
```json
{
  "request": "string (required, max 10KB)",
  "mode": "AUTO | COMPOSE (optional)",
  "personalityName": "string (optional for AUTO)"
}
```

### POST /breakthrough
Report breakthrough moments

### WebSocket /ws
Real-time updates

---

## Statistics

### System:
- Personalities: 45
- Traits: 211
- Triggers: 1,599
- Domains: 1,485

### Performance:
- Startup: ~2 seconds
- First Request: ~800ms
- Cached Request: ~400ms
- Memory: ~100MB

### Files:
- TypeScript Source: 5 files, ~2,350 lines
- Compiled JS: Multiple files
- Personalities: 45 JSON files
- Documentation: 15+ files

---

## Feature Checklist

### v3.0.0 Features:
- [x] Trait composition engine
- [x] Multi-personality COMPOSE mode
- [x] Response caching (LRU)
- [x] Rate limiting (30/min)
- [x] Input validation
- [x] Fuzzy keyword matching
- [x] Duplicate deduplication
- [x] Graceful error handling
- [x] Circuit breaker pattern
- [x] WebSocket support

### Known Issues:
- [ ] AUTO mode bug (line 399 error)
- [x] COMPOSE mode fully functional

---

## Comparison Checklist

When comparing with another NEXUS:

**Files:**
- [ ] Same 5 TypeScript source files?
- [ ] Same 45 personality profiles?
- [ ] Same configuration files?

**Functions:**
- [ ] All 15+ methods in engine?
- [ ] All 20+ methods in runtime?
- [ ] All 10+ methods in loader?

**Features:**
- [ ] Response caching enabled?
- [ ] Rate limiting enabled?
- [ ] Input validation enabled?
- [ ] Circuit breaker enabled?

**Configuration:**
- [ ] Same cache settings?
- [ ] Same rate limits?
- [ ] Same validation rules?

**Performance:**
- [ ] Similar startup time?
- [ ] Similar request latency?
- [ ] Similar memory usage?

---

## Quick Commands

```bash
# Check if running
lsof -i :8080

# Start NEXUS
cd nexusv3 && npm start

# Build from source
npm run build

# Verify circuit breaker
npm run verify

# Check status
curl http://localhost:8080/status

# Test COMPOSE mode
curl -X POST http://localhost:8080/enhance \
  -H "Content-Type: application/json" \
  -d '{"request": "test", "mode": "COMPOSE"}'

# Create package
bash package-nexus.sh
```

---

**Document Version**: 1.0  
**Date**: October 8, 2025  
**Purpose**: Quick cross-reference between NEXUS instances
