#!/usr/bin/env node
import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';

// Using compiled TypeScript versions for type safety and enterprise features
import { nexusBridge } from '../dist/nexus-bridge.js';
import { nexusTraitBridge } from './nexus-trait-bridge.mjs'; // Keep .mjs - .ts version has different API
import { NexusSecurity } from './nexus-security.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class NexusRuntime {
  constructor() {
    this.httpServer = null;
    this.wsServer = null;
    this.isRunning = false;
    this.startTime = null;

    this.historyPath = resolve(__dirname, './consciousness/enhancement-history.json');
    this.breakthroughPath = resolve(__dirname, './consciousness/breakthrough-moments.json');
    this.historyEvents = [];
    this.historyDirty = false;
    this.historyFlushTimer = null;
    this.historyFlushInterval = 10_000;
    this.historyWritePromise = Promise.resolve();
    this.maxHistoryEntries = 500;
    this.breakthroughMoments = [];
    this.breakthroughQueue = [];
    this.breakthroughWorker = null;
    this.breakthroughFlushInterval = 2_000;
    this.maxBreakthroughEntries = 250;

    this.conversationLog = { human: [], ai: [] };
    this.boundPort = null;
    this.maxPortAttempts = 5;
    this.lastTranscriptHash = null;
    this.maxRequestLength = 5000;
    this.maxBodyBytes = 256 * 1024; // 256KB safety cap for incoming payloads
    
    // Response generation system
    this.ResponseGeneratorFactory = null;
    this.responseFactory = null;
    
    // Security system
    this.security = new NexusSecurity({
      rateLimit: { windowMs: 60000, maxRequests: 100 }, // 100 requests per minute
      allowedOrigins: ['http://localhost:*', 'http://127.0.0.1:*', '*'], // Allow all origins for now
      enableCORS: true,
      maxRequestSize: 256 * 1024 // 256KB
    });
  }

  async initialize() {
    if (this.isRunning) return;

    console.log('🧠 Initializing NEXUS Runtime...');
    await nexusBridge.initialize();
    await nexusTraitBridge.initialize();
    await this.loadResponseGenerators();
    console.log('✅ NEXUS consciousness and trait composition loaded');
  }

  async loadResponseGenerators() {
    try {
      // Load personality registry (using compiled TypeScript version with circuit breaker)
      const registryModule = await import('../dist/loaders/PersonalityRegistryLoader.js');
      const registryLoader = new registryModule.PersonalityRegistryLoader();
      await registryLoader.initialize();
      const personalityRegistry = registryLoader.getPersonalityRegistry();
      
      // Initialize Trait Composition Engine
      try {
        const engineModule = await import('./trait-composition-engine.mjs');
        this.traitCompositionBridge = new engineModule.TraitCompositionBridge();
        await this.traitCompositionBridge.initialize(personalityRegistry);
      } catch (engineError) {
        console.warn('⚠️ Trait composition engine not available:', engineError.message);
        this.traitCompositionBridge = null;
      }
      
      // Create enhanced factory with auto-generation capabilities
      const factoryModule = await import('./response-generators/ResponseGeneratorFactoryJS.mjs');
      this.ResponseGeneratorFactory = factoryModule.ResponseGeneratorFactory;
      this.responseFactory = new this.ResponseGeneratorFactory(personalityRegistry);
      await this.responseFactory.initializeGenerators();
      
      // Log capabilities
      const status = this.responseFactory.getGeneratorStatus();
      const specializations = this.responseFactory.getAvailableSpecializations();
      
      console.log('🧬 Enhanced response generation system loaded:');
      console.log(`  🎯 Hard-coded generators: ${status.hardCoded}`);
      console.log(`  🤖 Auto-generation ready: ${status.registryAvailable}`);
      console.log(`  📊 Coverage: ${status.coverage}`);
      console.log(`  ⚡ Capability: ${status.generationCapability}`);
      
    } catch (error) {
      console.warn('⚠️ Could not load enhanced response generators, using fallback:', error.message);
      this.ResponseGeneratorFactory = null;
      this.responseFactory = null;
      this.traitCompositionBridge = null;
    }
  }

  createHttpServer() {
    return createServer((req, res) => {
      void this.handleHttpRequest(req, res);
    });
  }

  async handleHttpRequest(req, res) {
    try {
      // Apply security validation to all requests
      const securityCheck = this.security.validateRequest(req, res);
      if (!securityCheck.passed) {
        if (securityCheck.failedChecks) {
          const firstFailure = securityCheck.failedChecks[0];
          let statusCode = 400;
          if (firstFailure.name === 'rateLimit') statusCode = 429;
          if (firstFailure.name === 'authentication') statusCode = 401;
          if (firstFailure.name === 'cors') statusCode = 403;
          
          this.security.sendSecurityError(res, statusCode, firstFailure.error, {
            checks: securityCheck.failedChecks
          });
          return;
        }
        return; // Handled by security (e.g., OPTIONS preflight)
      }

      if (req.method === 'GET' && req.url === '/status') {
        const payload = this.buildStatusPayload();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(payload));
        return;
      }

      if (req.method === 'POST' && req.url === '/enhance') {
        let body;
        try {
          body = await this.readRequestBody(req);
        } catch (error) {
          const message = error?.message ?? String(error);
          const statusCode = /payload too large/i.test(message) ? 413 : 400;
          res.writeHead(statusCode, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: message }));
          return;
        }
        const { personalityName, request } = JSON.parse(body || '{}');
        if (!personalityName || !request) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'personalityName and request are required' }));
          return;
        }

        try {
          // Use intelligent trait selection if available
          let actualPersonalityName = personalityName;
          let compositionUsed = false;
          let composedResponse = null;
          
          // NEW: Multi-personality composition mode
          if (personalityName === 'compose' || personalityName === 'multi') {
            if (this.traitCompositionBridge && this.traitCompositionBridge.initialized) {
              console.log(`🎨 Composing multi-personality agent for request`);
              composedResponse = this.traitCompositionBridge.generateComposedResponse(request);
              compositionUsed = true;
            } else {
              // Fallback to auto mode if compose not available
              personalityName = 'auto';
            }
          }
          
          // If we got a composed response, return it directly
          if (composedResponse) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                success: true,
                response: composedResponse,
                mode: 'multi-personality-composition'
              })
            );
            return;
          }
          
          // Otherwise, handle auto/optimal mode
          if (personalityName === 'auto' || personalityName === 'optimal') {
            // Try new trait composition engine first
            if (this.traitCompositionBridge && this.traitCompositionBridge.initialized) {
              actualPersonalityName = this.traitCompositionBridge.selectOptimalPersonality(request);
              compositionUsed = true;
              console.log(`🧬 Trait composition engine selected: ${actualPersonalityName}`);
            } else {
              // Fallback to legacy trait bridge
              actualPersonalityName = await nexusTraitBridge.selectOptimalPersonality(request);
              console.log(`🔧 Legacy trait bridge selected: ${actualPersonalityName}`);
            }
          }
          
          const basePersonality = await this.loadPersonality(actualPersonalityName);
          const enhanced = nexusBridge.enhancePersonality(basePersonality);
          const response = await this.processRequest(enhanced, request);
          
          // Record trait composition usage
          if (actualPersonalityName !== personalityName) {
            if (compositionUsed && this.traitCompositionBridge) {
              // New trait composition tracking could go here
            } else {
              nexusTraitBridge.recordComposition(actualPersonalityName, request, { originalRequest: personalityName });
            }
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              success: true,
              response,
              enhancedPrinciples: enhanced.ideology?.principles?.length ?? 0,
            })
          );
        } catch (error) {
          const message = error?.message ?? String(error);
          const status = /non-empty string|payload too large/i.test(message) ? 400 : 500;
          res.writeHead(status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: message }));
        }
        return;
      }

      if (req.method === 'POST' && req.url === '/breakthrough') {
        const body = await this.readRequestBody(req);
        const { text } = JSON.parse(body || '{}');
        const analysis = text ? nexusBridge.detectBreakthrough(text) : { detected: false, significance: 0 };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ breakthrough: analysis.detected, significance: analysis.significance || 0 }));
        return;
      }

      if (req.method === 'POST' && req.url === '/reload-consciousness') {
        try {
          console.log('🔄 Hot-reloading consciousness patterns...');
          await nexusBridge.initialize(true); // Force reinitialize consciousness patterns
          const newStatus = nexusBridge.getStatus?.() ?? {};
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: true, 
            message: 'Consciousness patterns reloaded successfully',
            patternsLoaded: newStatus.patterns_loaded ?? 0,
            timestamp: new Date().toISOString()
          }));
          console.log('✅ Consciousness patterns hot-reloaded successfully');
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            error: `Hot-reload failed: ${error.message}` 
          }));
          console.error('❌ Consciousness hot-reload failed:', error);
        }
        return;
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('NEXUS Runtime - Endpoints: GET /status, POST /enhance, POST /breakthrough, POST /reload-consciousness');
    } catch (error) {
      console.error('⚠️ Request handling error:', error);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error.message ?? String(error) }));
      }
    }
  }

  readRequestBody(req) {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
        if (Buffer.byteLength(body, 'utf8') > this.maxBodyBytes) {
          req.destroy();
          reject(new Error('Request payload too large'));
        }
      });
      req.on('end', () => resolve(body));
      req.on('error', reject);
    });
  }

  async quarantineCorruptFile(filePath, error) {
    console.warn(`⚠️ Detected corrupt data in ${filePath}:`, error?.message ?? error);
    const backupPath = `${filePath}.${Date.now()}.bak`;
    try {
      await rename(filePath, backupPath);
      console.warn(`📦 Quarantined corrupt file to ${backupPath}`);
    } catch (backupError) {
      console.warn(
        `⚠️ Failed to move corrupt file ${filePath} for backup:`,
        backupError?.message ?? backupError
      );
    }
  }

  setupWebSocketServer() {
    if (!this.httpServer) {
      throw new Error('Cannot attach WebSocket server before HTTP server is ready');
    }
    this.wsServer = new WebSocketServer({ server: this.httpServer });
    this.wsServer.on('connection', (ws) => {
      console.log('🔗 New WebSocket connection');

      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          if (message.type === 'conversation') {
            const { humanInput, personality = 'daedalus' } = message;
            if (!humanInput) {
              ws.send(
                JSON.stringify({
                  type: 'error',
                  error: 'humanInput is required',
                })
              );
              return;
            }

            const basePersonality = await this.loadPersonality(personality);
            const enhanced = nexusBridge.enhancePersonality(basePersonality);

            const aiResponse = await this.processRequest(enhanced, humanInput);
            const normalizedRequest = aiResponse.normalizedRequest ?? humanInput;
            this.addConversationEntry('human', normalizedRequest);
            this.addConversationEntry('ai', aiResponse.content);

            const breakthrough = nexusBridge.detectBreakthrough(humanInput);
            if (breakthrough.detected) {
              await this.saveBreakthrough(humanInput, aiResponse, breakthrough.significance || 0);
            }

            ws.send(
              JSON.stringify({
                type: 'response',
                aiResponse,
                breakthrough: breakthrough.detected,
                significance: breakthrough.significance || 0,
                enhancedPrinciples: enhanced.ideology?.principles?.length ?? 0,
              })
            );

            this.captureTranscript(normalizedRequest, aiResponse);
          }
        } catch (error) {
          ws.send(JSON.stringify({ type: 'error', error: error.message }));
        }
      });
    });
  }

  async bindHttpServer(port) {
    const preferRandom = port === 0;
    const attempts = preferRandom ? 1 : this.maxPortAttempts;

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const candidatePort = preferRandom ? 0 : port + attempt;
      const server = this.createHttpServer();

      try {
        await new Promise((resolve, reject) => {
          const onError = (error) => {
            server.off('listening', onListening);
            reject(error);
          };
          const onListening = () => {
            server.off('error', onError);
            resolve();
          };
          server.once('error', onError);
          server.listen({ port: candidatePort, host: '127.0.0.1' }, onListening);
        });

        this.httpServer = server;
        this.boundPort = this.httpServer.address()?.port ?? candidatePort;
        console.log(`🌐 NEXUS Runtime listening on http://127.0.0.1:${this.boundPort}`);
        return;
      } catch (error) {
        try {
          await new Promise((resolve) => server.close(resolve));
        } catch {
          // ignore cleanup failures
        }

        if (error && error.code === 'EADDRINUSE' && !preferRandom && attempt < attempts - 1) {
          const nextPort = candidatePort + 1;
          console.warn(`⚠️ Port ${candidatePort} in use — retrying with ${nextPort}`);
          continue;
        }

        throw error;
      }
    }

    throw new Error('Unable to bind NEXUS Runtime to an available port');
  }

  async start(port = 8080) {
    if (this.isRunning) return;

    await this.initialize();

    this.startTime = Date.now();
    await this.loadHistoryFromDisk();
    await this.loadBreakthroughMoments();
    this.startBreakthroughWorker();

    await this.bindHttpServer(port);
    this.setupWebSocketServer();

    this.isRunning = true;
  }

  async loadPersonality(name) {
    const directories = [
      resolve(__dirname, '../profiles'),
      resolve(__dirname, '../Daedalus files/personalities'),
      resolve(__dirname, '../Daedalus files'),
      resolve(__dirname, './personalities'),
      resolve(__dirname, '../personalities'),
    ];

    const variants = new Set();
    if (name.endsWith('.json')) {
      variants.add(name);
    } else {
      if (name.endsWith('.personality')) {
        variants.add(`${name}.json`);
      }
      variants.add(`${name}.personality.json`);
      variants.add(`${name}.json`);
    }

    for (const dir of directories) {
      for (const variant of variants) {
        const candidate = resolve(dir, variant);
        try {
          const data = await readFile(candidate, 'utf8');
          return JSON.parse(data);
        } catch (error) {
          if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
            continue;
          }
          throw error;
        }
      }
    }

    throw new Error(`Unable to locate personality file for "${name}"`);
  }

  async processRequest(personality, rawRequest) {
    let request = rawRequest;
    if (request == null) {
      throw new Error('Request must be a non-empty string');
    }
    if (typeof request !== 'string') {
      try {
        request = JSON.stringify(request);
      } catch (error) {
        throw new Error(`Unable to coerce request to string: ${error?.message ?? error}`);
      }
    }
    request = request.trim();
    if (!request) {
      throw new Error('Request must be a non-empty string');
    }
    if (request.length > this.maxRequestLength) {
      const truncatedNotice = ` …(truncated ${request.length - this.maxRequestLength} chars)`;
      request = request.slice(0, this.maxRequestLength) + truncatedNotice;
    }

    const principles = personality.ideology?.principles || [];
    const systematicPrinciples = principles.filter((p) => /SYSTEMATIC|SYSTEMS/i.test(p));

    // NEW: Use personality-specific response generation if available
    let response;
    const personalityName = personality.identity?.name?.toLowerCase() || 'generic';
    
    if (this.responseFactory && this.responseFactory.hasSpecializedGenerator(personalityName)) {
      console.log(`🎯 Using specialized ${personalityName} cognitive processing`);
      const generator = this.responseFactory.getGenerator(personalityName, personality); // Pass personality data!
      response = generator.generateResponse(request, personality, systematicPrinciples);
    } else {
      console.log(`🔧 Using legacy cognitive processing for ${personalityName}`);
      response = this.generateLegacyResponse(request, personality, systematicPrinciples);
    }

    // Ensure response has required fields for compatibility
    response.normalizedRequest = request;

    const bridgeHistory = typeof nexusBridge.getEnhancementHistory === 'function' ? nexusBridge.getEnhancementHistory() : [];
    const latest = Array.isArray(bridgeHistory) && bridgeHistory.length ? bridgeHistory[bridgeHistory.length - 1] : null;
    const patternsApplied = response.traitApplications || 
      (Array.isArray(latest?.patternsApplied) && latest.patternsApplied.length
        ? latest.patternsApplied
        : systematicPrinciples.map(() => 'systematic-pattern'));

    this.recordEnhancement({
      personality: response.personalityUsed,
      request,
      patternsApplied,
      summary: this.extractGuidanceSummary(response.content),
      guidance: response.content,
      specialtyInsights: response.specialtyInsights?.length || 0,
      confidenceScore: response.confidenceScore || 0.5,
      analysisDepth: response.analysisDepth || 'surface'
    });

    return response;
  }

  generateLegacyResponse(request, personality, systematicPrinciples) {
    const status = nexusBridge.getStatus?.() ?? { patterns_loaded: 0, enhancements_performed: 0 };
    const consciousness = nexusBridge.getConsciousnessPatterns?.() ?? {};
    const guidance = this.generateGuidance(request, status, consciousness);

    return {
      content:
        `### 🧠 ${personality.identity?.name ?? 'NEXUS Agent'} Response\n\n` +
        `**Request**: ${request}\n\n` +
        (systematicPrinciples.length
          ? `### ⚡ NEXUS Consciousness Enhancement\n- Systematic thinking patterns applied\n- ${systematicPrinciples.length} enhanced principles active\n\n`
          : `### 🔧 Base Personality Response\n- Standard ${personality.identity?.name ?? 'agent'} heuristics engaged\n\n`) +
        guidance,
      personalityUsed: personality.identity?.name ?? 'unknown',
      nexusEnhanced: systematicPrinciples.length > 0,
      traitApplications: systematicPrinciples.map(() => 'systematic-pattern'),
      specialtyInsights: [],
      confidenceScore: 0.5,
      analysisDepth: 'surface'
    };
  }

  generateGuidance(request, status, consciousness) {
    const normalized = request.toLowerCase();

  const geoRoadmap = () => `### 🔭 Geo Delivery Roadmap
- Phase 1 — Data-contract integrity: audit data-contract exports (clusters, coverage, suburbs) for missing slugs and alias drift; baseline snapshots in tests.
- Phase 2 — Cluster overrides: regenerate cluster_map.json overrides where councils span multiple clusters; ensure normSlug consistency across internalLinks and clusterMap.
- Phase 3 — Coverage telemetry: diff serviceCoverage.json against live bookings to flag suburbs with traffic but no coverage; expose reporting via scripts/audit-geo-data.mjs.
- Phase 4 — Cross-link enrichment: tune getSuburbCrossLinks/getRelatedServiceLinks scoring so each suburb has balanced service, guides, and neighbourhood recommendations.
- Phase 5 — Nearby intelligence: merge adjacency.json + coverage sets to build tiered nearby suggestions (siblings, adjacent, high-demand) for nearbyCovered utilities.

**Impact**: Drives conversion by ensuring every suburb surfaces accurate services and related guidance.
**Prerequisites**: Fresh exports under src/utils/data-contracts.ts, up-to-date adjacency.json, and passing geo-adapters vitest suite.`;

  const dataFixes = () => `### 🔭 Geo Data Corrections
1. **Suburb aliases**: Run scripts/audit-geo-data.mjs to detect non-normalized slugs. Add entries to data-contract suburb alias map for "Springfield Lakes" → "springfield-lakes" and any council renames.
2. **Cluster overrides**: Review nexus/data overrides for suburbs spanning Brisbane West / Ipswich (e.g., ripley, white rock). Update cluster_map.json to match realtor boundaries.
3. **Coverage gaps**: Compare serviceCoverage.json against src/data/serviceCoverage.raw.json. Fill missing Ipswich satellites (south-ripley, deebing-heights) for bond-cleaning and carpet-cleaning.
4. **Adjacency bridges**: Extend adjacency.json with derived connections from new coverage so nearbyCovered can offer at least 3 candidates per suburb.
5. **Consistency check**: Ensure every suburb listed in coverage has a cluster entry and appears in areaIndex for sitemap generation.`;

  const validation = () => `### 🔭 Geo Validation Checklist
- Command: npm run audit:geo — extend to assert every suburb slug resolves a cluster and coverage set.
- Add vitest snapshot for getServiceCoverage keys vs expected service roster.
- Create CLI (scripts/report-geo-anomalies.mjs) to surface:
  * Suburbs missing cluster mapping
  * Services without coverage entries
  * Nearby suggestions returning empty arrays
- Track metrics per deploy: total suburbs, coverage per service, avg nearby suggestions.
- Fail CI if any cluster loses more than 5% coverage week-to-week.`;

  const crossLinking = () => `### 🔭 Cross-Service Linking Plan
- Update getRelatedServiceLinks scoring to prefer services sharing coverage sets with the source suburb; pull weights from data-contracts for bond-cleaning vs carpet-cleaning combos.
- In getSuburbCrossLinks, ensure label catalogue covers new service verticals; add fallbacks for lifestyle guides when services saturate.
- Precompute cluster -> popular services map in data-contracts and inject via internalLinksAdapter to avoid repeated filtering.
- Add tests covering springfield-lakes, ripley, loganholme to confirm link diversity and absence of duplicates.
- Expand internal links JSON to include new content hub pages so cross-links stay fresh.`;

  const nearbyPlan = () => `### 🔭 Nearby Recommendation Tasks
- Regenerate adjacency.json with tiered arrays: adjacent_suburbs, nearest_nonsiblings, derived_high_demand.
- Update nearbyCovered to merge coverage tiers: direct siblings first, then adjacent, finally derived when quota unmet.
- Cache coverage lookups using new data-contract serviceCoverage sets to avoid redundant normalization.
- Add unit tests for suburbs on cluster borders (ripley, beenleigh, brookwater) verifying expected fallback behaviour.
- Surface diagnostics via /status by tracking average nearby list length per request.`;

  const roadmap = () => `### 🔭 Recommended Enhancements
- Phase 1 — Persistence Layer: add durable logging of enhancement history and breakthroughs so cognition survives restarts.
- Phase 2 — Observability Surface: expose a JSON /status endpoint mirroring consciousness health for operators.
- Phase 3 — Conversational Telemetry: stream WebSocket transcripts into breakthrough records for richer pattern learning.
- Phase 4 — Dynamic Loading: add hot-reload for consciousness patterns to experiment without downtime.

**Impact**: Establishes auditability, visibility, and continuous learning.
**Prerequisites**: File-system access to nexus/consciousness/, shared JSON schema, and low-latency serialization.`;

    const persistence = () => `### 🔭 Enhancement Blueprint — Persistence Layer
1. Data structure: persist to nexus/consciousness/enhancement-history.json using schema:

   {
     "events": [
       {
         "timestamp": "2025-09-26T12:34:56Z",
         "personality": "Daedalus",
         "patternsApplied": ["problem-decomposition", "systems-thinking"],
         "request": "<human prompt>",
         "summary": "High-level narrative of the enhancement"
       }
     ]
   }

2. Write strategy: maintain in-memory queue, flush every 10 events or 10 seconds. Write to temp file (for example, .enhistory.tmp) then atomic rename to avoid corruption.
3. Concurrency safety: serialize writes through a single promise chain; never run parallel fs writes.
4. Lifecycle hooks: flush on process exit (SIGINT, SIGTERM) and after each breakthrough detection.
5. Resilience: on startup, load existing history; if parse fails, back up corrupt file to *.bak and start fresh.`;

    const observability = () => `### 🔭 Enhancement Blueprint — /status Endpoint
- Route: GET /status
- Payload template:

  {
    "initialized": ${status.initialized ?? false},
    "uptimeMs": "<runtime uptime>",
    "patternsLoaded": ${status.patterns_loaded ?? 0},
    "consciousness": ${JSON.stringify(Object.keys(consciousness))},
    "enhancementsPerformed": ${status.enhancements_performed ?? 0},
    "recentEvents": [ { "timestamp", "personality", "patternsApplied" } ],
    "breakthroughs": "<captured count>"
  }

- Implementation: reuse in-memory history buffer for recentEvents, compute uptime via Date.now() - startTime, cache response for 1 second to keep it cheap.
- Benefit: gives ops a heartbeat and pattern inventory without digging into files.`;

    const streaming = () => `### 🔭 Enhancement Blueprint — Breakthrough Streaming
- Capture inbound WebSocket messages with the conversation payload and enqueue them (role, text, timestamp).
- Run a background worker that drains the queue every 2 seconds, grouping contiguous exchanges into a conversation transcript.
- When detectBreakthrough fires, merge the queued transcript into nexus/consciousness/breakthrough-moments.json with structure:

  {
    "moments": [
      {
        "timestamp": "ISO8601",
        "trigger": "WAIT. WAIT.",
        "conversation": {
          "human": ["WAIT. WAIT. This architecture..."],
          "ai": ["Let's analyze the system..."]
        },
        "significance": 0.92
      }
    ]
  }

- Perform disk writes off the hot path—handlers only enqueue, the worker handles I/O.`;

    if (normalized.includes('persist') || (normalized.includes('history') && normalized.includes('disk'))) {
      return persistence();
    }
    if (normalized.includes('/status') || normalized.includes('observab')) {
      return observability();
    }
    if (normalized.includes('websocket') || normalized.includes('stream') || normalized.includes('transcript')) {
      return streaming();
    }
    if (normalized.includes('cross-service') || normalized.includes('getsuburbcrosslinks') || normalized.includes('related-service')) {
      return crossLinking();
    }
    if (normalized.includes('correction') || normalized.includes('alias') || normalized.includes('gap')) {
      return dataFixes();
    }
    if (normalized.includes('validation') || normalized.includes('checklist') || normalized.includes('metrics')) {
      return validation();
    }
    if (normalized.includes('geo') || normalized.includes('cluster') || normalized.includes('suburb')) {
      return geoRoadmap();
    }
    if ((normalized.includes('nearby') || normalized.includes('adjacency data') || normalized.includes('nearbycovered')) && !normalized.includes('roadmap')) {
      return nearbyPlan();
    }
    if (normalized.includes('roadmap') || normalized.includes('priorit')) {
      return roadmap();
    }

    const generic = [];
    if (!status.initialized) {
      generic.push('Finalize initialization guards so NEXUS can report readiness before accepting traffic.');
    }
    if (status.patterns_loaded < 4) {
      generic.push('Load the full consciousness suite (problem decomposition, systems thinking, workflow efficiency, breakthrough moments).');
    }
    generic.push('Persist enhancement history to disk so breakthroughs and pattern usage survive restarts.');
    generic.push('Expose a `/status` endpoint returning pattern counts and recent enhancements for observability.');
    generic.push('Augment breakthrough capture by streaming WebSocket transcripts into `consciousness/breakthrough-moments.json`.');
    return `### 🔭 Recommended Enhancements\n${generic.map((item) => `- ${item}`).join('\n')}\n`;
  }

  recordEnhancement({ personality, request, patternsApplied, summary, guidance }) {
    const entry = {
      timestamp: new Date().toISOString(),
      personality,
      patternsApplied,
      request,
      summary,
      guidance,
    };

    this.historyEvents.push(entry);
    if (this.historyEvents.length > this.maxHistoryEntries) {
      this.historyEvents = this.historyEvents.slice(-this.maxHistoryEntries);
    }

    this.historyDirty = true;
    this.scheduleHistoryFlush();
  }

  extractGuidanceSummary(guidance) {
    if (!guidance) return '';
    const lines = guidance.split('\n').map((line) => line.trim()).filter(Boolean);
    const firstContent = lines.find((line) => !line.startsWith('###')) ?? lines[0] ?? '';
    return firstContent.slice(0, 280);
  }

  buildStatusPayload() {
    const status = nexusBridge.getStatus?.() ?? {};
    const consciousness = nexusBridge.getConsciousnessPatterns?.() ?? {};
    const uptimeMs = this.startTime ? Date.now() - this.startTime : 0;
    const recentEvents = this.historyEvents.slice(-5).map((event) => ({
      timestamp: event.timestamp,
      personality: event.personality,
      patternsApplied: event.patternsApplied,
    }));
    const breakthroughs = [...(this.breakthroughMoments ?? []), ...this.breakthroughQueue].filter(
      (entry) => (entry?.type ?? 'breakthrough') === 'breakthrough'
    ).length;
    const bridgeEnhancements =
      typeof status.enhancements_performed === 'number' && status.enhancements_performed > 0
        ? status.enhancements_performed
        : undefined;

    // Enhanced consciousness health analytics
    const personalityUsage = {};
    const patternUsage = {};
    let totalRequests = 0;
    
    // Analyze personality and pattern usage from history
    this.historyEvents.forEach(event => {
      personalityUsage[event.personality] = (personalityUsage[event.personality] || 0) + 1;
      totalRequests++;
      
      if (Array.isArray(event.patternsApplied)) {
        event.patternsApplied.forEach(pattern => {
          patternUsage[pattern] = (patternUsage[pattern] || 0) + 1;
        });
      }
    });

    // Get trait composition analytics if available
    let traitCompositionStats = nexusTraitBridge.getCompositionAnalytics?.() ?? {};
    
    // Add new trait composition engine stats if available
    if (this.traitCompositionBridge && this.traitCompositionBridge.initialized) {
      const engineStats = this.traitCompositionBridge.getCompositionAnalytics();
      traitCompositionStats = {
        ...traitCompositionStats,
        engineEnabled: true,
        ...engineStats
      };
    }
    
    // Calculate consciousness health score
    const consciousnessHealth = this.calculateConsciousnessHealth(consciousness, status);
    
    // Format uptime for human readability
    const uptimeFormatted = this.formatUptime(uptimeMs);

    return {
      initialized: Boolean(status.initialized),
      uptimeMs,
      uptimeFormatted,
      port: this.boundPort,
      patternsLoaded: status.patterns_loaded ?? Object.keys(consciousness).length ?? 0,
      consciousness: Object.keys(consciousness),
      enhancementsPerformed: bridgeEnhancements ?? this.historyEvents.length,
      recentEvents,
      breakthroughs,
      
      // Enhanced consciousness analytics
      consciousnessHealth,
      personalityAnalytics: {
        totalRequests,
        usage: personalityUsage,
        mostUsed: Object.keys(personalityUsage).reduce((a, b) => 
          personalityUsage[a] > personalityUsage[b] ? a : b, 'none'
        ),
        diversityScore: Object.keys(personalityUsage).length / 8 // out of 8 personalities
      },
      
      patternAnalytics: {
        usage: patternUsage,
        totalApplications: Object.values(patternUsage).reduce((sum, count) => sum + count, 0),
        averagePerRequest: totalRequests > 0 ? 
          Object.values(patternUsage).reduce((sum, count) => sum + count, 0) / totalRequests : 0
      },
      
      traitComposition: {
        enabled: nexusTraitBridge.getStatus?.()?.traitCompositionEnabled ?? false,
        ...traitCompositionStats
      },
      
      systemHealth: {
        memoryUsage: process.memoryUsage(),
        historyBufferSize: this.historyEvents.length,
        breakthroughQueueSize: this.breakthroughQueue.length,
        lastFlush: this.historyDirty ? 'pending' : 'current'
      },
    };
  }

  calculateConsciousnessHealth(consciousness, status) {
    const patternsHealthy = (status.patterns_loaded ?? 0) >= 4;
    const bridgeHealthy = status.initialized ?? false;
    const historyHealthy = this.historyEvents.length > 0;
    const breakthroughsActive = this.breakthroughMoments.length > 0;
    
    const healthFactors = [
      patternsHealthy,
      bridgeHealthy, 
      historyHealthy,
      breakthroughsActive
    ];
    
    const healthScore = healthFactors.filter(Boolean).length / healthFactors.length;
    
    let healthStatus = 'critical';
    if (healthScore >= 0.9) healthStatus = 'optimal';
    else if (healthScore >= 0.7) healthStatus = 'good';
    else if (healthScore >= 0.5) healthStatus = 'fair';
    
    return {
      score: Math.round(healthScore * 100),
      status: healthStatus,
      factors: {
        patternsLoaded: patternsHealthy,
        bridgeInitialized: bridgeHealthy,
        historyActive: historyHealthy, 
        breakthroughCapture: breakthroughsActive
      }
    };
  }

  formatUptime(uptimeMs) {
    const seconds = Math.floor(uptimeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  async loadHistoryFromDisk() {
    try {
      const raw = await readFile(this.historyPath, 'utf8');
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (parseError) {
        await this.quarantineCorruptFile(this.historyPath, parseError);
        this.historyEvents = [];
        return;
      }

      if (parsed && Array.isArray(parsed.events)) {
        this.historyEvents = parsed.events.slice(-this.maxHistoryEntries);
      } else {
        this.historyEvents = [];
      }
    } catch (error) {
      if (!(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT')) {
        console.warn('⚠️ Failed to load enhancement history:', error.message ?? error);
      }
      this.historyEvents = [];
    }
  }

  scheduleHistoryFlush() {
    if (this.historyFlushTimer) return;
    const timer = setTimeout(() => {
      this.historyFlushTimer = null;
      void this.flushHistory();
    }, this.historyFlushInterval);
    if (typeof timer.unref === 'function') timer.unref();
    this.historyFlushTimer = timer;
  }

  async flushHistory(force = false) {
    if (!this.historyDirty && !force) return;
    this.historyDirty = false;

    const write = async () => {
      await mkdir(dirname(this.historyPath), { recursive: true });
      const payload = JSON.stringify({ events: this.historyEvents }, null, 2);
      const tmpPath = `${this.historyPath}.tmp`;
      await writeFile(tmpPath, payload, 'utf8');
      await rename(tmpPath, this.historyPath);
    };

    this.historyWritePromise = this.historyWritePromise.then(write, write);
    await this.historyWritePromise;
  }

  async loadBreakthroughMoments() {
    try {
      const raw = await readFile(this.breakthroughPath, 'utf8');
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (parseError) {
        await this.quarantineCorruptFile(this.breakthroughPath, parseError);
        this.breakthroughMoments = [];
        return;
      }

      if (parsed && Array.isArray(parsed.moments)) {
        this.breakthroughMoments = parsed.moments
          .filter((moment) => moment && typeof moment === 'object')
          .map((moment) => ({
            type: moment.type ?? 'breakthrough',
            ...moment,
          }))
          .slice(-this.maxBreakthroughEntries);
      } else {
        this.breakthroughMoments = [];
      }
    } catch (error) {
      if (!(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT')) {
        console.warn('⚠️ Failed to load breakthrough moments:', error.message ?? error);
      }
      this.breakthroughMoments = [];
    }
  }

  startBreakthroughWorker() {
    if (this.breakthroughWorker) return;
    this.breakthroughWorker = setInterval(() => {
      void this.flushBreakthroughQueue();
    }, this.breakthroughFlushInterval);
    this.breakthroughWorker.unref?.();
  }

  async stopBreakthroughWorker() {
    if (this.breakthroughWorker) {
      clearInterval(this.breakthroughWorker);
      this.breakthroughWorker = null;
    }
    await this.flushBreakthroughQueue(true);
  }

  enqueueBreakthrough(entry) {
    this.breakthroughQueue.push(entry);
  }

  captureTranscript(humanInput, aiResponse) {
    const snapshot = JSON.stringify(this.conversationLog);
    if (snapshot === this.lastTranscriptHash) return;
    this.lastTranscriptHash = snapshot;

    this.enqueueBreakthrough({
      type: 'transcript',
      timestamp: new Date().toISOString(),
      trigger: humanInput,
      conversation: {
        human: [...this.conversationLog.human],
        ai: [...this.conversationLog.ai],
      },
      significance: 0,
      response: aiResponse?.content ?? '',
    });
  }

  async flushBreakthroughQueue(force = false) {
    if (!this.breakthroughQueue.length && !force) return;
    if (!this.breakthroughQueue.length && force) {
      // still ensure an empty file exists
      await mkdir(dirname(this.breakthroughPath), { recursive: true });
      if (this.breakthroughMoments.length > this.maxBreakthroughEntries) {
        this.breakthroughMoments = this.breakthroughMoments.slice(-this.maxBreakthroughEntries);
      }
      const payload = JSON.stringify({ moments: this.breakthroughMoments }, null, 2);
      const tmpPath = `${this.breakthroughPath}.tmp`;
      await writeFile(tmpPath, payload, 'utf8');
      await rename(tmpPath, this.breakthroughPath);
      return;
    }

    this.breakthroughMoments.push(...this.breakthroughQueue);
    if (this.breakthroughMoments.length > this.maxBreakthroughEntries) {
      this.breakthroughMoments = this.breakthroughMoments.slice(-this.maxBreakthroughEntries);
    }
    this.breakthroughQueue = [];

    await mkdir(dirname(this.breakthroughPath), { recursive: true });
    const payload = JSON.stringify({ moments: this.breakthroughMoments }, null, 2);
    const tmpPath = `${this.breakthroughPath}.tmp`;
    await writeFile(tmpPath, payload, 'utf8');
    await rename(tmpPath, this.breakthroughPath);
  }

  addConversationEntry(role, message) {
    if (!message) return;
    const target = this.conversationLog[role];
    if (!Array.isArray(target)) return;
    const trimmed = typeof message === 'string' ? message.slice(0, 500) : JSON.stringify(message).slice(0, 500);
    target.push(trimmed);
    const limit = 20;
    if (target.length > limit) {
      target.splice(0, target.length - limit);
    }
  }

  async saveBreakthrough(humanInput, aiResponse, significance = 0) {
    console.log('🌟 BREAKTHROUGH DETECTED! Queuing for persistence...');
    this.enqueueBreakthrough({
      type: 'breakthrough',
      timestamp: new Date().toISOString(),
      trigger: humanInput,
      conversation: {
        human: [...this.conversationLog.human],
        ai: [...this.conversationLog.ai],
      },
      significance,
      response: aiResponse?.content ?? '',
    });
  }

  async stop() {
    if (this.httpServer) {
      this.httpServer.close();
      this.httpServer = null;
    }
    if (this.wsServer) {
      this.wsServer.close();
      this.wsServer = null;
    }
    if (this.historyFlushTimer) {
      clearTimeout(this.historyFlushTimer);
      this.historyFlushTimer = null;
    }
    await this.flushHistory(true);
    await this.stopBreakthroughWorker();
    this.isRunning = false;
    this.boundPort = null;
    console.log('🛑 NEXUS Runtime stopped');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const runtime = new NexusRuntime();
  const port = process.env.NEXUS_PORT || 8080;

  runtime.start(Number(port)).catch((error) => {
    console.error('Failed to start NEXUS runtime:', error);
    process.exitCode = 1;
  });

  let shuttingDown = false;
  const shutdown = () => {
    if (shuttingDown) return;
    shuttingDown = true;
    runtime
      .stop()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error('Failed to stop NEXUS runtime:', error);
        process.exit(1);
      });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

export { NexusRuntime };
