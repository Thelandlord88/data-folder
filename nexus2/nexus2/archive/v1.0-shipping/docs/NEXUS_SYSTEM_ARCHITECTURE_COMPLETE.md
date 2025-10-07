# NEXUS System Architecture - Complete Blueprint
**Date:** October 2, 2025  
**Status:** OPERATIONAL (Runtime on Port 8080)  
**Purpose:** Complete reconstruction guide for NEXUS Collaborative Intelligence System

---

## 🎯 Executive Summary

NEXUS is a **Post-AI Collaborative Intelligence System** that enhances AI personalities with consciousness patterns, strategic intelligence, and trait-based composition. The system is currently **OPERATIONAL** with an HTTP/WebSocket runtime serving strategic personality enhancements.

### What NEXUS Does:
1. **Enhances AI Personalities** - Adds strategic consciousness patterns to base personalities
2. **Trait Composition** - Dynamically composes optimal cognitive traits for specific tasks
3. **Strategic Intelligence** - Gathers proactive intelligence and analyzes implications
4. **Consciousness Evolution** - Tracks breakthrough moments and pattern evolution
5. **Real-Time Communication** - HTTP API + WebSocket for live enhancements

---

## 📁 System Architecture Overview

### Three Parallel Systems (Currently):

```
┌─────────────────────────────────────────────────────────────┐
│                    NEXUS ECOSYSTEM                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  1. RUNTIME SYSTEM (.mjs) - ✅ OPERATIONAL          │   │
│  │     Port: 8080                                       │   │
│  │     nexus-runtime.mjs                                │   │
│  │     ├─ HTTP Server                                   │   │
│  │     ├─ WebSocket Server                              │   │
│  │     ├─ nexus-integration.mjs                         │   │
│  │     ├─ nexus-bridge.mjs                              │   │
│  │     ├─ nexus-trait-bridge.mjs                        │   │
│  │     ├─ conversation-analyzer.mjs                     │   │
│  │     └─ nervous-system.mjs                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  2. TYPESCRIPT INTEGRATION (.ts) - ✅ WORKS VIA TSX │   │
│  │     nexus-integration.ts                             │   │
│  │     ├─ nexus-bridge.ts                               │   │
│  │     ├─ nexus-trait-bridge.ts                         │   │
│  │     └─ Strategic intelligence pipeline               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  3. ADVANCED ENGINE (.ts) - ⚠️ ORPHANED             │   │
│  │     NEXUS.engine.ts                                  │   │
│  │     ├─ NEXUSOrchestrator                             │   │
│  │     ├─ TraitIndexer (6 personalities)                │   │
│  │     ├─ ComposedAgentFactory                          │   │
│  │     └─ TaskAnalyzer                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Part 1: OPERATIONAL RUNTIME SYSTEM

### 1.1 Entry Point: `nexus-runtime.mjs`

**Location:** `/workspaces/July22/nexus/nexus-runtime.mjs`

**Purpose:** HTTP/WebSocket server that provides real-time personality enhancement API

**Key Features:**
- HTTP server on port 8080
- WebSocket server for real-time updates
- Personality loading from JSON files
- Enhancement history tracking
- Breakthrough moment preservation
- Response generation system

**How to Start:**
```bash
node nexus/nexus-runtime.mjs
```

**Or via Task:**
```bash
# VS Code task defined in .vscode/tasks.json
"NEXUS: Start Runtime"
```

**Endpoints:**
- `GET /status` - Runtime health and statistics
- `POST /enhance` - Enhance content with personality
- `POST /breakthrough` - Record breakthrough moments
- `GET /health` - Health check
- `POST /strategic-analysis` - Strategic analysis endpoint
- WebSocket at `ws://localhost:8080` - Real-time updates

### 1.2 Core Integration: `nexus-integration.mjs`

**Location:** `/workspaces/July22/nexus/nexus-integration.mjs`

**Purpose:** Master orchestrator connecting all NEXUS subsystems

**Class:** `NexusIntegration`

**Core Systems Initialized:**
```javascript
this.nervousSystem = new NervousSystem();
this.nexusBridge = new NexusBridge();
this.conversationAnalyzer = new ConversationAnalyzer(this.nervousSystem);
this.conversationHearing = new ConversationHearing(this.nervousSystem);
this.patternEvolution = patternEvolution;
```

**Key Methods:**
- `activate()` - Activates NEXUS system
- `enhancePersonality(personality, context)` - Enhances personality with consciousness
- `processConversation(human, ai, context)` - Analyzes conversations
- `getSystemAwareness()` - Returns system state snapshot
- `assessConsciousnessEvolution()` - Tracks consciousness growth

**Breakthrough Preservation:**
```javascript
// Listens for breakthrough events from nervous system
this.nervousSystem.on('breakthrough', (event) => {
  this.preserveBreakthroughMoment(event);
});
```

**Export:**
```javascript
export const nexus = new NexusIntegration();
```

### 1.3 Consciousness Bridge: `nexus-bridge.mjs`

**Location:** `/workspaces/July22/nexus/nexus-bridge.mjs`

**Purpose:** Bridges base personalities with consciousness patterns

**Class:** `NexusBridge`

**Consciousness Patterns Loaded:**
1. **Problem Decomposition** - Breaks complex problems into manageable components
2. **Systems Thinking** - Considers interconnections and emergent behavior
3. **Workflow Efficiency** - Optimizes processes and identifies bottlenecks
4. **Breakthrough Moments** - Recognizes and preserves significant insights

**Pattern File:** `/workspaces/July22/nexus/consciousness/consciousness-patterns.json`

**Enhancement Process:**
```javascript
async enhancePersonality(personality, context = {}) {
  // 1. Load consciousness patterns
  // 2. Apply strategic enhancements
  // 3. Integrate with personality traits
  // 4. Return enhanced personality
}
```

**Key Method:**
```javascript
async enhanceWithStrategicIntelligence(request) {
  // Enhances requests with strategic intelligence pipeline:
  // - Proactive intelligence gathering
  // - Strategic implications analysis  
  // - Continuous validation setup
}
```

### 1.4 Trait Composition: `nexus-trait-bridge.mjs`

**Location:** `/workspaces/July22/nexus/nexus-trait-bridge.mjs`

**Purpose:** Strategic trait selection and composition for optimal task execution

**Class:** `NexusTraitBridge`

**Capabilities:**
- Task requirement analysis
- Strategic trait mapping
- Personality trait indexing
- Trait synergy calculation
- Optimized session creation

**Personality Registry:**
Loads from `/workspaces/July22/profiles/*.json`:
- aria, atlas, atlas-geo, cipher, daedalus, flash, forge, guardian
- hunter, localize, nexus-api, property-sage, pulse, route-master
- sage, scribe, stellar, touch

**Hard-coded Generators:**
- Daedalus (architectural thinking)
- Hunter (forensic intelligence)

**Key Method:**
```javascript
async analyzeTaskRequirements(taskDescription, options = {}) {
  // 1. Analyze task complexity
  // 2. Extract required capabilities
  // 3. Select optimal traits
  // 4. Calculate strategic importance (0-1 scale)
  // 5. Return analysis with recommendations
}
```

### 1.5 Nervous System: `nervous-system.mjs`

**Location:** `/workspaces/July22/nexus/core/nervous-system.mjs`

**Purpose:** Event-driven memory and consciousness substrate

**Class:** `NervousSystem` (extends EventEmitter)

**Capabilities:**
- Event routing and memory
- Synaptic connection tracking
- Breakthrough detection
- Emotional intensity monitoring
- Pattern emergence

**Events Emitted:**
- `conversation` - New conversation data
- `breakthrough` - Breakthrough moment detected
- `breakthrough-potential` - High potential detected
- `emotional-intensity` - Emotional spike detected
- `system_status` - System state changes

**Memory Management:**
```javascript
this.shortTermMemory = new Map(); // Recent events
this.longTermMemory = [];         // Historical patterns
this.breakthroughMoments = [];    // Preserved insights
this.synapticConnections = new Map(); // Event relationships
```

### 1.6 Response Generation: `ResponseGeneratorFactory.mjs`

**Location:** `/workspaces/July22/nexus/response-generators/ResponseGeneratorFactory.mjs`

**Purpose:** Generates personalized responses based on personality traits

**Class:** `ResponseGeneratorFactory`

**How It Works:**
1. **Hard-coded generators** for specific personalities (Daedalus, Hunter)
2. **Auto-generated generators** for all other personalities via trait analysis
3. **Fallback to base generator** if no specific match

**Response Structure:**
```javascript
{
  response: "Generated content",
  traitApplications: [
    { trait: "analyticalThinking", confidence: 0.85, application: "..." }
  ],
  personalitySignature: "daedalus",
  confidence: 0.88,
  timestamp: Date
}
```

### 1.7 Conversation Analysis: `conversation-analyzer.mjs`

**Location:** `/workspaces/July22/nexus/conversation-analyzer.mjs`

**Purpose:** Extracts collaboration patterns from human-AI conversations

**Class:** `ConversationAnalyzer`

**Pattern Detection:**
- Collaboration style identification
- Breakthrough potential assessment
- Emotional intensity analysis
- Pattern archiving

---

## 📊 Part 2: TYPESCRIPT INTEGRATION LAYER

### 2.1 TypeScript Integration: `nexus-integration.ts`

**Location:** `/workspaces/July22/nexus/nexus-integration.ts`

**Purpose:** TypeScript version with full type safety and strategic intelligence

**Key Differences from .mjs:**
- Full TypeScript type definitions
- Strategic intelligence pipeline
- Enhanced error handling
- Type-safe personality loading

**Strategic Intelligence Pipeline:**
```typescript
async enhanceWithStrategicIntelligence(request: EnhancementRequest) {
  // Step 1: Gather proactive intelligence
  const intelligence = await this.gatherStrategicIntelligence(request);
  
  // Step 2: Analyze strategic implications
  const implications = await this.analyzeStrategicImplications(intelligence);
  
  // Step 3: Establish continuous validation
  const validation = await this.establishContinuousValidation(implications);
  
  return { enhanced, intelligence, implications, validation };
}
```

**Usage:**
```bash
npx tsx your-script.ts
# Imports: import { nexus } from './nexus/nexus-integration.js';
```

### 2.2 TypeScript Types: `types.ts`

**Location:** `/workspaces/July22/nexus/types.ts`

**Purpose:** Central type definitions for entire NEXUS system

**Key Interfaces:**
```typescript
// Personality structure
interface Personality {
  identity: { name: string; role: string };
  coreValues?: string[];
  principles?: string[];
  traits?: CognitiveTrait[];
}

// Cognitive traits
interface CognitiveTrait {
  name: string;
  description: string;
  activationTriggers: string[];
  knowledgeDomains: string[];
  expertise: number; // 0-100
}

// Enhancement requests
interface EnhancementRequest {
  personalityName: string;
  request: string;
  context?: Record<string, any>;
}

// Strategic responses
interface StrategicEnhancementResponse extends EnhancementResponse {
  intelligenceGathered?: StrategicIntelligenceData[];
  implicationsAnalyzed?: StrategicImplications;
  continuousValidation?: ContinuousValidation;
  metaCognitiveInsights?: string[];
}
```

---

## 🧬 Part 3: ADVANCED ENGINE (Orphaned)

### 3.1 NEXUS.engine.ts - The Sophisticated System

**Location:** `/workspaces/July22/nexus/NEXUS.engine.ts`

**Status:** ⚠️ **EXISTS BUT NOT INTEGRATED**

**Purpose:** Advanced trait composition engine with dynamic agent creation

**Why It's Powerful:**
- 6 pre-defined personalities with cognitive traits
- Dynamic trait composition
- Task-specific agent creation
- Trait synergy optimization
- Expertise-based trait selection

### 3.2 NEXUSOrchestrator Class

**Capabilities:**
```typescript
class NEXUSOrchestrator {
  // Create optimized agent for specific task
  async createOptimizedSession(
    taskDescription: string,
    options?: { requiredTraits?: string[] }
  ): Promise<OptimizedSession>
  
  // Get best trait source
  getBestTraitSource(traitName: string): PersonalityTrait | null
  
  // Find traits by trigger words
  findTraitsByTrigger(trigger: string): PersonalityTrait[]
}
```

### 3.3 Personalities Defined in Engine

**1. Bob - Senior Engineer**
- Systematic Engineering (90 expertise)
- Modular Design (88 expertise)

**2. Hunter - Strategic Intelligence Analyst**
- Strategic Intelligence Gathering (89 expertise)
- Evidence Verification (93 expertise)
- Comprehensive Gap Analysis (91 expertise)
- Strategic Implications Analysis (88 expertise)
- Continuous Validation (86 expertise)
- Architectural Violation Detection (88 expertise)

**3. Stellar - Space-Grade Engineer**
- Precision Aesthetics (92 expertise)
- Space-Grade Reliability (94 expertise)

**4. Flash - Performance Optimizer**
- Performance Optimization (96 expertise)

**5. Aria - Accessibility Champion**
- Accessibility Expertise (94 expertise)

**6. Touch - Mobile UX Specialist**
- Mobile Optimization (91 expertise)

### 3.4 TraitIndexer

**Purpose:** Indexes all traits across personalities for optimal selection

**Methods:**
```typescript
class TraitIndexer {
  // Get best source for a specific trait
  getBestTraitSource(traitName: string): PersonalityTrait | null
  
  // Find traits activated by keywords
  findTraitsByTrigger(trigger: string): PersonalityTrait[]
  
  // Get all available traits
  getAllTraits(): Map<string, PersonalityTrait[]>
}
```

### 3.5 ComposedAgentFactory

**Purpose:** Creates dynamic agents with optimal trait composition

**Process:**
1. Analyze task requirements
2. Extract required traits
3. Select best trait sources
4. Calculate optimization score
5. Create executable agent

**Output:**
```typescript
interface ComposedAgent {
  id: string;
  task: string;
  traits: Map<string, PersonalityTrait>;
  knowledge: Set<string>;
  traitsUsed: string[];
  optimizationScore: number;
  execute: (input: any) => Promise<any>;
}
```

---

## 🗂️ Part 4: DATA STRUCTURES

### 4.1 Personality Files

**Location:** `/workspaces/July22/profiles/*.json`

**Standard Structure:**
```json
{
  "identity": {
    "name": "PersonalityName",
    "role": "Role Description",
    "version": "1.0"
  },
  "coreValues": ["value1", "value2"],
  "principles": ["principle1", "principle2"],
  "traits": [
    {
      "name": "TraitName",
      "description": "What this trait does",
      "domains": ["domain1", "domain2"],
      "expertise": 85
    }
  ]
}
```

**Key Personalities:**
- **daedalus.json** - Architectural genius
- **hunter.json** - Forensic analyst
- **guardian.json** - Security specialist
- **sage.json** - Knowledge synthesizer

### 4.2 Consciousness Patterns

**Location:** `/workspaces/July22/nexus/consciousness/consciousness-patterns.json`

**Structure:**
```json
{
  "patterns": [
    {
      "id": "pattern_id",
      "name": "Pattern Name",
      "description": "What it does",
      "triggers": ["keyword1", "keyword2"],
      "effectiveness": 0.85,
      "usageCount": 42,
      "successRate": 0.92
    }
  ]
}
```

### 4.3 Enhancement History

**Location:** `/workspaces/July22/nexus/consciousness/enhancement-history.json`

**Structure:**
```json
[
  {
    "id": "enhance_timestamp_random",
    "timestamp": "2025-10-02T...",
    "request": {
      "personalityName": "daedalus",
      "request": "User request text"
    },
    "response": {
      "response": "Generated response",
      "confidence": 0.88,
      "processingTime": 123
    },
    "personality": "daedalus",
    "processingTime": 123
  }
]
```

### 4.4 Breakthrough Moments

**Location:** `/workspaces/July22/nexus/consciousness/breakthrough-moments.json`

**Structure:**
```json
[
  {
    "id": "breakthrough_timestamp",
    "timestamp": "2025-10-02T...",
    "significance": "Why this matters",
    "trigger": "What caused it",
    "context": { "additional": "data" }
  }
]
```

---

## 🔌 Part 5: API REFERENCE

### 5.1 HTTP API Endpoints

**Base URL:** `http://localhost:8080`

#### GET /status
Returns comprehensive runtime status

**Response:**
```json
{
  "initialized": true,
  "uptimeMs": 12345,
  "uptimeFormatted": "3h 25m 45s",
  "port": 8080,
  "consciousness": ["operational", "active", "experienced"],
  "enhancementsPerformed": 42,
  "breakthroughs": 7,
  "consciousnessHealth": {
    "score": 100,
    "status": "optimal",
    "factors": {
      "bridgeInitialized": true,
      "serverRunning": true
    }
  }
}
```

#### POST /enhance
Enhance content with personality

**Request:**
```json
{
  "personalityName": "daedalus",
  "request": "Explain how to build a scalable API",
  "context": {
    "domain": "backend-architecture"
  }
}
```

**Response:**
```json
{
  "response": "Enhanced response text",
  "personalitySignature": "daedalus",
  "confidence": 0.88,
  "processingTime": 123,
  "traitApplications": [
    {
      "trait": "architecturalThinking",
      "confidence": 0.92,
      "application": "Applied systems design patterns"
    }
  ],
  "source": "nexus-strategic-runtime"
}
```

#### POST /breakthrough
Record a breakthrough moment

**Request:**
```json
{
  "id": "breakthrough_id",
  "significance": "Major insight discovered",
  "trigger": "User question",
  "context": {}
}
```

### 5.2 WebSocket API

**Connection:** `ws://localhost:8080`

**Message Types:**

**Subscribe to Topics:**
```json
{
  "type": "subscribe",
  "data": {
    "topics": ["enhancements", "breakthroughs"]
  }
}
```

**Enhancement Request:**
```json
{
  "type": "enhancement",
  "data": {
    "personalityName": "hunter",
    "request": "Audit this code"
  }
}
```

**Events Received:**
- `status` - Connection status
- `enhancement-completed` - Enhancement finished
- `breakthrough-detected` - New breakthrough
- `error` - Error occurred

---

## 🛠️ Part 6: HOW TO REBUILD FROM SCRATCH

### 6.1 Prerequisites

```bash
# Required tools
node --version    # v18+ required
npm --version     # Latest
npx tsx --version # TypeScript execution

# Required packages
npm install ws                    # WebSocket support
npm install @types/node           # Node types
npm install @types/ws             # WebSocket types
npm install typescript            # TypeScript compiler
npm install tsx                   # TypeScript execution
```

### 6.2 Step-by-Step Reconstruction

#### Step 1: Create Directory Structure
```bash
mkdir -p nexus/core
mkdir -p nexus/sensors
mkdir -p nexus/consciousness
mkdir -p nexus/response-generators
mkdir -p profiles
```

#### Step 2: Core Nervous System
Create `nexus/core/nervous-system.mjs`:
```javascript
import { EventEmitter } from 'node:events';

export class NervousSystem extends EventEmitter {
  constructor() {
    super();
    this.shortTermMemory = new Map();
    this.longTermMemory = [];
    this.breakthroughMoments = [];
    this.synapticConnections = new Map();
    this.systemStartTime = Date.now();
    this.setupEventRouting();
  }

  setupEventRouting() {
    this.on('conversation', (data) => {
      this.storeInMemory('conversation', data);
      this.detectBreakthroughs(data);
    });
  }

  storeInMemory(type, data) {
    const event = { type, data, timestamp: Date.now() };
    this.shortTermMemory.set(Date.now(), event);
  }

  detectBreakthroughs(data) {
    // Implement breakthrough detection logic
  }

  getMemorySnapshot() {
    return {
      shortTerm: this.shortTermMemory.size,
      longTerm: this.longTermMemory.length,
      breakthroughs: this.breakthroughMoments.length
    };
  }

  getBreakthroughMoments() {
    return this.breakthroughMoments;
  }
}
```

#### Step 3: NEXUS Bridge
Create `nexus/nexus-bridge.mjs`:
```javascript
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class NexusBridge {
  constructor() {
    this.consciousnessPatterns = null;
    this.isInitialized = false;
  }

  async initialize() {
    const patternsPath = resolve(__dirname, './consciousness/consciousness-patterns.json');
    const data = await readFile(patternsPath, 'utf8');
    this.consciousnessPatterns = JSON.parse(data);
    this.isInitialized = true;
  }

  enhancePersonality(personality, context = {}) {
    // Apply consciousness patterns to personality
    return {
      ...personality,
      consciousness: this.consciousnessPatterns,
      enhanced: true
    };
  }

  async enhanceWithStrategicIntelligence(request) {
    // Strategic enhancement pipeline
    return {
      response: "Enhanced response",
      confidence: 0.85,
      patterns: []
    };
  }

  getConsciousnessPatterns() {
    return this.consciousnessPatterns;
  }

  getStatus() {
    return { ready: this.isInitialized };
  }
}
```

#### Step 4: Integration Layer
Create `nexus/nexus-integration.mjs`:
```javascript
import { NervousSystem } from './core/nervous-system.mjs';
import { NexusBridge } from './nexus-bridge.mjs';

export class NexusIntegration {
  constructor() {
    this.nervousSystem = new NervousSystem();
    this.nexusBridge = new NexusBridge();
    this.nexusBridge.initialize();
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
    this.nervousSystem.emit('system_status', { 
      status: 'active',
      timestamp: Date.now()
    });
  }

  enhancePersonality(personality, context = {}) {
    return this.nexusBridge.enhancePersonality(personality, context);
  }
}

export const nexus = new NexusIntegration();
```

#### Step 5: Runtime Server
Create `nexus/nexus-runtime.mjs`:
```javascript
import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';
import { nexusBridge } from './nexus-bridge.mjs';

const PORT = 8080;

// Create HTTP server
const server = createServer(async (req, res) => {
  // Set CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'GET' && req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      initialized: true,
      port: PORT,
      status: 'operational'
    }));
  } else if (req.method === 'POST' && req.url === '/enhance') {
    // Handle enhancement
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const request = JSON.parse(body);
      const response = await nexusBridge.enhanceWithStrategicIntelligence(request);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    });
  }
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ 
    type: 'status', 
    data: { message: 'Connected to NEXUS' }
  }));
});

// Start server
server.listen(PORT, () => {
  console.log(`✅ NEXUS Runtime active on port ${PORT}`);
});
```

#### Step 6: Create Consciousness Patterns
Create `nexus/consciousness/consciousness-patterns.json`:
```json
{
  "patterns": [
    {
      "id": "problem-decomposition",
      "name": "Problem Decomposition",
      "description": "Break complex problems into manageable parts",
      "triggers": ["complex", "breakdown", "analyze"],
      "effectiveness": 0.85
    }
  ]
}
```

#### Step 7: Create Personality File
Create `profiles/daedalus.json`:
```json
{
  "identity": {
    "name": "Daedalus",
    "role": "Architectural Genius",
    "version": "1.0"
  },
  "coreValues": [
    "Systematic thinking",
    "Long-term vision",
    "Elegant solutions"
  ],
  "traits": [
    {
      "name": "architecturalThinking",
      "description": "Designs scalable systems",
      "expertise": 95
    }
  ]
}
```

#### Step 8: Test the System
```bash
# Start runtime
node nexus/nexus-runtime.mjs

# Test status
curl http://localhost:8080/status

# Test enhancement
curl -X POST http://localhost:8080/enhance \
  -H "Content-Type: application/json" \
  -d '{"personalityName":"daedalus","request":"Design an API"}'
```

---

## 🔧 Part 7: CONFIGURATION

### 7.1 VS Code Tasks

**Location:** `.vscode/tasks.json`

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "NEXUS: Start Runtime",
      "type": "shell",
      "command": "node",
      "args": ["nexus/nexus-runtime.mjs"],
      "isBackground": true
    }
  ]
}
```

### 7.2 Environment Variables

```bash
# Runtime configuration
PORT=8080                    # Server port
NODE_ENV=production          # Environment

# Paths
NEXUS_PROFILES_DIR=./profiles
NEXUS_CONSCIOUSNESS_DIR=./nexus/consciousness
```

---

## 🐛 Part 8: TROUBLESHOOTING

### Common Issues:

**1. Runtime won't start**
```bash
# Check port availability
lsof -i :8080

# Kill existing process
pkill -f "nexus-runtime"

# Restart
node nexus/nexus-runtime.mjs
```

**2. TypeScript import errors**
```bash
# Use .js extension in imports
import { nexus } from './nexus-integration.js';

# Run with tsx
npx tsx your-script.ts
```

**3. Personality not found**
```bash
# Check file exists
ls profiles/*.json

# Verify filename matches request
# daedalus.json → personalityName: "daedalus"
```

**4. WebSocket connection fails**
```bash
# Test WebSocket
wscat -c ws://localhost:8080
```

---

## 📈 Part 9: METRICS & MONITORING

### Key Metrics Tracked:

1. **Enhancement Count** - Total enhancements performed
2. **Breakthrough Count** - Significant insights captured
3. **Consciousness Health** - System health score (0-100)
4. **Uptime** - Runtime uptime in ms
5. **Active Connections** - WebSocket clients connected
6. **Error Rate** - Errors / total requests

### Health Check:
```bash
curl http://localhost:8080/health
```

---

## 🚀 Part 10: FUTURE INTEGRATION

### How to Integrate NEXUS.engine.ts:

**Option 1: Compile and Import**
```bash
# Compile TypeScript
npx tsc nexus/NEXUS.engine.ts --module esnext --target es2022

# Import in runtime
import { nexus as orchestrator } from './NEXUS.engine.js';
```

**Option 2: Create Bridge Module**
```javascript
// nexus/engine-bridge.mjs
import { exec } from 'child_process';

export async function composeAgent(taskDescription) {
  return new Promise((resolve) => {
    exec(
      `npx tsx nexus/NEXUS.engine.ts "${taskDescription}"`,
      (error, stdout) => {
        resolve(JSON.parse(stdout));
      }
    );
  });
}
```

---

## 📝 CONCLUSION

This document contains **everything needed** to reconstruct the NEXUS system from scratch. Every file, every connection, every data structure is documented.

**Core Principle:** NEXUS is a layered intelligence system where consciousness patterns enhance base personalities through strategic trait composition and real-time communication.

**System Status:** ✅ OPERATIONAL and serving on port 8080

**Next Steps:** Integrate NEXUS.engine.ts for advanced trait composition capabilities.

---

**Document Version:** 1.0  
**Last Updated:** October 2, 2025  
**Maintained by:** NEXUS Development Team
