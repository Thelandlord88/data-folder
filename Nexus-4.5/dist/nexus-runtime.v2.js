#!/usr/bin/env node
/**
 * NEXUS Runtime v2.0 - Strategic Intelligence Runtime Server (TypeScript)
 *
 * Complete TypeScript rewrite of NEXUS runtime using:
 * - NEXUS.engine.v2.ts (unified trait composition)
 * - PersonalityRegistryLoader.ts (circuit breaker, caching)
 * - Full type safety and production features
 *
 * Endpoints:
 * - GET /status - System status and health
 * - POST /enhance - Main personality enhancement
 * - POST /design - CSS Engine (Design System Generation)
 * - POST /breakthrough - Report breakthrough moments
 * - POST /reload-consciousness - Hot reload patterns
 * - WebSocket /ws - Live updates
 */
import { createServer } from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { PersonalityRegistryLoader } from './loaders/PersonalityRegistryLoader.js';
import { TraitCompositionBridge, MultiPersonalityResponseGenerator } from './NEXUS.engine.v2.js';
import { nexusBridge } from './nexus-bridge.js';
// 🚀 PERFORMANCE OPTIMIZATION IMPORTS
import { responseCache, PerformanceCache } from './src/performance-cache.js';
import { profiler } from './src/performance-profiler.js';
// For ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * NEXUS Runtime Server
 */
class NexusRuntime {
    personalityLoader;
    traitBridge;
    consciousness = null;
    historyEvents = [];
    breakthroughMoments = [];
    initialized = false;
    startTime = Date.now();
    enhancementsPerformed = 0;
    wsClients = new Set();
    constructor() {
        this.personalityLoader = new PersonalityRegistryLoader({
            profilesPath: resolve(__dirname, './profiles'),
            circuitBreaker: {
                failureThreshold: 5,
                resetTimeout: 60000
            }
        });
        this.traitBridge = new TraitCompositionBridge();
    }
    /**
     * Initialize NEXUS consciousness and personality system
     */
    async initialize(isReload = false) {
        try {
            console.log(isReload ? '🔄 Reloading NEXUS consciousness...' : '🧠 Initializing NEXUS consciousness...');
            // Load consciousness patterns
            await this.loadConsciousnessPatterns();
            // Initialize nexus-bridge for consciousness injection
            await nexusBridge.initialize();
            // Initialize personality registry
            if (!isReload) {
                await this.personalityLoader.initialize();
            }
            // Initialize trait composition bridge
            const registry = this.personalityLoader.getPersonalityRegistry();
            await this.traitBridge.initialize(registry);
            // Load history from disk
            if (!isReload) {
                await this.loadHistoryFromDisk();
            }
            this.initialized = true;
            console.log('✅ NEXUS consciousness and trait composition loaded');
        }
        catch (error) {
            console.warn('⚠️ NEXUS consciousness initialization failed:', error.message);
            this.consciousness = {
                problemDecomposition: null,
                systemsThinking: null,
                workflowEfficiency: null,
                breakthroughMoments: null
            };
        }
    }
    /**
     * Load consciousness patterns from disk
     */
    async loadConsciousnessPatterns() {
        const patterns = ['problem-decomposition', 'systems-thinking', 'workflow-efficiency', 'breakthrough-moments'];
        let loadedCount = 0;
        this.consciousness = {
            problemDecomposition: null,
            systemsThinking: null,
            workflowEfficiency: null,
            breakthroughMoments: null
        };
        for (const patternName of patterns) {
            try {
                const filePath = resolve(__dirname, `./consciousness/${patternName}.json`);
                const content = await readFile(filePath, 'utf-8');
                const data = JSON.parse(content);
                // Map pattern names to consciousness properties
                const key = patternName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                this.consciousness[key] = data;
                loadedCount++;
            }
            catch (error) {
                console.warn(`⚠️ Could not load ${patternName}:`, error.message);
            }
        }
        console.log(`✅ NEXUS consciousness initialized (${loadedCount}/4 patterns loaded)`);
    }
    /**
     * Load history from disk
     */
    async loadHistoryFromDisk() {
        try {
            const historyPath = resolve(__dirname, './consciousness/enhancement-history.json');
            const content = await readFile(historyPath, 'utf-8');
            const data = JSON.parse(content);
            if (data.events && Array.isArray(data.events)) {
                this.historyEvents = data.events;
                console.log(`📜 Loaded ${this.historyEvents.length} history events from disk`);
            }
        }
        catch (error) {
            // File doesn't exist yet, that's ok
        }
    }
    /**
     * Save history to disk
     */
    async saveHistoryToDisk() {
        try {
            const historyPath = resolve(__dirname, './consciousness/enhancement-history.json');
            const data = {
                events: this.historyEvents.slice(-100), // Keep last 100 events
                lastUpdated: new Date().toISOString()
            };
            await writeFile(historyPath, JSON.stringify(data, null, 2), 'utf-8');
        }
        catch (error) {
            console.warn('⚠️ Could not save history:', error.message);
        }
    }
    /**
     * Start the runtime server
     */
    async start(port = 8080) {
        await this.initialize();
        const server = createServer((req, res) => this.handleRequest(req, res));
        // WebSocket server
        const wss = new WebSocketServer({ server, path: '/ws' });
        wss.on('connection', (ws) => this.handleWebSocketConnection(ws));
        server.listen(port, '0.0.0.0', () => {
            console.log(`🌐 NEXUS Runtime listening on http://127.0.0.1:${port}`);
        });
        // Periodic history save
        setInterval(() => {
            if (this.historyEvents.length > 0) {
                this.saveHistoryToDisk();
            }
        }, 10000); // Every 10 seconds
    }
    /**
     * Handle HTTP requests
     */
    async handleRequest(req, res) {
        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }
        try {
            // GET /status
            if (req.method === 'GET' && req.url === '/status') {
                await this.handleStatus(req, res);
                return;
            }
            // POST /enhance
            if (req.method === 'POST' && req.url === '/enhance') {
                await this.handleEnhance(req, res);
                return;
            }
            // POST /design - CSS Engine (Design System Generation)
            if (req.method === 'POST' && req.url === '/design') {
                await this.handleDesign(req, res);
                return;
            }
            // POST /breakthrough
            if (req.method === 'POST' && req.url === '/breakthrough') {
                await this.handleBreakthrough(req, res);
                return;
            }
            // POST /reload-consciousness
            if (req.method === 'POST' && req.url === '/reload-consciousness') {
                await this.handleReloadConsciousness(req, res);
                return;
            }
            // GET /analytics
            if (req.method === 'GET' && req.url === '/analytics') {
                await this.handleAnalytics(req, res);
                return;
            }
            // POST /compose - Multi-personality composition
            if (req.method === 'POST' && req.url === '/compose') {
                await this.handleCompose(req, res);
                return;
            }
            // GET /history - Enhancement history
            if (req.method === 'GET' && req.url === '/history') {
                await this.handleHistory(req, res);
                return;
            }
            // GET /personalities - List all personalities
            if (req.method === 'GET' && req.url === '/personalities') {
                await this.handlePersonalities(req, res);
                return;
            }
            // GET /traits - Trait information
            if (req.method === 'GET' && req.url === '/traits') {
                await this.handleTraits(req, res);
                return;
            }
            // GET /consciousness - Consciousness patterns
            if (req.method === 'GET' && req.url === '/consciousness') {
                await this.handleConsciousness(req, res);
                return;
            }
            // GET /profiler - Performance profiler report (NEW!)
            if (req.method === 'GET' && req.url === '/profiler') {
                await this.handleProfiler(req, res);
                return;
            }
            // GET /stream-debate - Server-Sent Events streaming debate (WEEK 2 FEATURE!)
            if (req.method === 'GET' && req.url?.startsWith('/stream-debate')) {
                await this.handleStreamDebate(req, res);
                return;
            }
            // 404
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
        catch (error) {
            console.error('Error handling request:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }
    /**
     * Handle /status endpoint
     */
    async handleStatus(req, res) {
        const uptimeMs = Date.now() - this.startTime;
        const registry = this.personalityLoader.getPersonalityRegistry();
        const health = await this.personalityLoader.healthCheck();
        const analytics = this.traitBridge.getCompositionAnalytics();
        const bridgeStatus = nexusBridge.getStatus();
        const status = {
            initialized: this.initialized,
            uptime: this.formatUptime(uptimeMs),
            uptimeMs,
            port: 8080,
            version: '2.0.0',
            engine: 'NEXUS.engine.v2.ts (TypeScript)',
            // 💾 CACHE STATS - NEW!
            performanceCache: responseCache.getStats(),
            consciousnessHealth: this.calculateConsciousnessHealth(),
            consciousnessBridge: {
                initialized: bridgeStatus.initialized,
                patternsLoaded: bridgeStatus.patterns_loaded,
                enhancementsPerformed: bridgeStatus.enhancements_performed,
                ready: bridgeStatus.ready
            },
            loaderHealth: {
                status: health.status,
                circuitBreakerState: health.details.circuitBreakerState,
                memoryUsageMB: health.details.memoryUsageMB
            },
            personalitySystem: {
                totalPersonalities: registry.size,
                circuitBreakerState: health.details.circuitBreakerState,
                cacheEnabled: health.details.cacheEnabled,
                cacheHitRate: health.details.cacheStats?.hitRate || 0
            },
            traitComposition: analytics,
            patternsLoaded: this.countPatternsLoaded(),
            consciousness: this.listLoadedPatterns(),
            enhancementsPerformed: this.enhancementsPerformed,
            recentEvents: this.historyEvents.slice(-5),
            breakthroughMoments: this.breakthroughMoments.length > 0 ? this.breakthroughMoments.slice(-3) : null,
            systemHealth: {
                ...health,
                historyBufferSize: this.historyEvents.length,
                wsConnections: this.wsClients.size
            }
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(status, null, 2));
    }
    /**
     * Handle /enhance endpoint
     */
    async handleEnhance(req, res) {
        const startTime = Date.now(); // ⏱️ Profiler: Start timing
        const body = await this.readBody(req);
        // Validate request
        if (!this.validateRequest(body, res)) {
            return;
        }
        const { personalityName, request, mode = 'AUTO' } = body;
        try {
            // 💾 CACHE: Generate cache key for this request
            const cacheKey = PerformanceCache.generateKey({
                mode,
                personalityName,
                request: request.substring(0, 200) // Use first 200 chars for key
            });
            // 💾 CACHE: Try to get cached response
            const cachedResponse = responseCache.get(cacheKey);
            if (cachedResponse) {
                // ✅ Cache HIT! Return immediately
                const elapsed = Date.now() - startTime;
                console.log(`⚡ Cache HIT! Served in ${elapsed}ms (${cachedResponse._cacheAge || 0}s old)`);
                // Add cache metadata
                cachedResponse._fromCache = true;
                cachedResponse._cacheHitTime = elapsed;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, response: cachedResponse }));
                return;
            }
            // ❌ Cache MISS - Process request
            console.log(`🔄 Cache MISS - Processing request...`);
            let response;
            let actualPersonalityName = personalityName;
            // AUTO mode - select optimal personality
            if (mode === 'AUTO' && !personalityName) {
                actualPersonalityName = await this.traitBridge.selectOptimalPersonality(request);
            }
            // COMPOSE mode - multi-personality composition
            if (mode === 'COMPOSE') {
                const composedAgent = await this.traitBridge.composeOptimalAgent(request, 5);
                const generator = new MultiPersonalityResponseGenerator(composedAgent);
                response = generator.generateResponse(request);
            }
            else {
                // Single personality mode
                const personality = this.personalityLoader.getPersonality(actualPersonalityName);
                if (!personality) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: `Personality '${actualPersonalityName}' not found` }));
                    return;
                }
                response = this.generatePersonalityResponse(actualPersonalityName, personality, request);
            }
            // Detect breakthrough moments
            const breakthrough = nexusBridge.detectBreakthrough(request);
            if (breakthrough.detected) {
                response.breakthroughDetected = true;
                response.breakthroughSignificance = breakthrough.significance;
                this.recordBreakthrough({
                    timestamp: new Date().toISOString(),
                    description: request,
                    significance: breakthrough.significance || 0.5,
                    personality: actualPersonalityName
                });
            }
            this.enhancementsPerformed++;
            // 💾 CACHE: Store response (with timestamp for age tracking)
            response._cachedAt = Date.now();
            responseCache.set(cacheKey, response);
            // ⏱️ PROFILER: Log processing time
            const elapsed = Date.now() - startTime;
            if (elapsed > 100) {
                console.warn(`⏱️  SLOW: handleEnhance took ${elapsed}ms`);
            }
            console.log(`✅ Processed in ${elapsed}ms - Now cached!`);
            // Record in history
            this.recordEnhancement({
                timestamp: new Date().toISOString(),
                personality: response.personalityUsed || actualPersonalityName,
                patternsApplied: response.traitApplications || [],
                request,
                summary: request,
                guidance: response.content
            });
            // Check for breakthrough
            this.checkForBreakthrough(request, response.content);
            // Broadcast to WebSocket clients
            this.broadcastToClients({
                type: 'enhancement',
                personality: response.personalityUsed || actualPersonalityName,
                timestamp: new Date().toISOString()
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, response }));
        }
        catch (error) {
            console.error('Enhancement error:', error);
            const elapsed = Date.now() - startTime;
            console.error(`❌ ERROR after ${elapsed}ms:`, error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
    /**
     * Handle /design endpoint - CSS Engine (Design System Generation)
     */
    async handleDesign(req, res) {
        const body = await this.readBody(req);
        // Validate request
        if (!body.input || !body.input.type) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing required field: input.type' }));
            return;
        }
        try {
            // Lazy load CSS Engine
            const { DesignSystemArchitect } = await import('./css-engine/specialists/DesignSystemArchitect.js');
            const architect = new DesignSystemArchitect();
            // Build design DNA from input
            const dna = {};
            if (body.input.type === 'color') {
                dna.colors = [body.input.primary];
                if (body.input.secondary)
                    dna.colors.push(body.input.secondary);
                if (body.input.accent)
                    dna.colors.push(body.input.accent);
            }
            else if (body.input.type === 'verbal') {
                // For verbal descriptions, use default for now
                dna.colors = ['#0ea5e9'];
            }
            // Add constraints if provided
            if (body.constraints) {
                dna.constraints = body.constraints;
            }
            // Run CSS Engine
            const t0 = performance.now();
            const designPackage = await architect.run(dna, body.options || {});
            const elapsed = performance.now() - t0;
            // Add runtime metrics
            designPackage.diagnostics.timings.runtime = elapsed;
            // Broadcast to WebSocket clients
            this.broadcastToClients({
                type: 'design-generated',
                tokens: Object.keys(designPackage.tokens.color).length +
                    Object.keys(designPackage.tokens.typography).length +
                    Object.keys(designPackage.tokens.spacing).length,
                timestamp: new Date().toISOString(),
                performanceMs: elapsed
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, design: designPackage }));
        }
        catch (error) {
            console.error('Design generation error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: error.message,
                stack: error.stack
            }));
        }
    }
    /**
     * Handle /breakthrough endpoint
     */
    async handleBreakthrough(req, res) {
        const body = await this.readBody(req);
        if (!body.trigger || !body.insight) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing required fields: trigger, insight' }));
            return;
        }
        const breakthrough = {
            timestamp: new Date().toISOString(),
            trigger: body.trigger,
            insight: body.insight,
            context: body.context || '',
            significance: body.significance || 'medium'
        };
        this.breakthroughMoments.push(breakthrough);
        this.broadcastToClients({
            type: 'breakthrough',
            breakthrough,
            timestamp: new Date().toISOString()
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, breakthrough }));
    }
    /**
     * Handle /reload-consciousness endpoint
     */
    async handleReloadConsciousness(req, res) {
        const body = await this.readBody(req);
        if (!this.validateContentType(req, res)) {
            return;
        }
        try {
            await this.loadConsciousnessPatterns();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: 'Consciousness patterns reloaded successfully',
                patternsLoaded: this.countPatternsLoaded(),
                timestamp: new Date().toISOString()
            }));
        }
        catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
    /**
     * Handle /analytics endpoint
     */
    async handleAnalytics(req, res) {
        try {
            // Personality usage analytics
            const personalityUsage = {};
            const synergyScores = [];
            const composedCount = { single: 0, multi: 0 };
            for (const event of this.historyEvents) {
                if (event.personality.includes('+')) {
                    composedCount.multi++;
                    // Extract synergy if available (would need to parse from guidance)
                }
                else {
                    composedCount.single++;
                }
                personalityUsage[event.personality] = (personalityUsage[event.personality] || 0) + 1;
            }
            // Sort by usage
            const topPersonalities = Object.entries(personalityUsage)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([name, count]) => ({ name, count, percentage: (count / this.historyEvents.length * 100).toFixed(1) }));
            // Trait usage from recent events
            const traitUsage = {};
            for (const event of this.historyEvents) {
                for (const trait of event.patternsApplied) {
                    traitUsage[trait] = (traitUsage[trait] || 0) + 1;
                }
            }
            const topTraits = Object.entries(traitUsage)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([name, count]) => ({ name, count }));
            // Time-based analytics
            const now = Date.now();
            const last24h = this.historyEvents.filter(e => now - new Date(e.timestamp).getTime() < 86400000).length;
            const lastHour = this.historyEvents.filter(e => now - new Date(e.timestamp).getTime() < 3600000).length;
            const analytics = {
                overview: {
                    totalEnhancements: this.enhancementsPerformed,
                    historyBufferSize: this.historyEvents.length,
                    breakthroughsCaptured: this.breakthroughMoments.length,
                    last24Hours: last24h,
                    lastHour: lastHour
                },
                compositionAnalytics: {
                    singlePersonality: composedCount.single,
                    multiPersonality: composedCount.multi,
                    compositionRate: (composedCount.multi / (composedCount.single + composedCount.multi) * 100).toFixed(1) + '%'
                },
                topPersonalities,
                topTraits,
                recentBreakthroughs: this.breakthroughMoments.slice(-5).map(b => ({
                    trigger: b.trigger,
                    insight: b.insight.substring(0, 100) + '...',
                    significance: b.significance,
                    timestamp: b.timestamp
                })),
                personalityDiversity: {
                    totalUniquePersonalities: Object.keys(personalityUsage).length,
                    averageUsagePerPersonality: (this.historyEvents.length / Object.keys(personalityUsage).length).toFixed(1)
                },
                timestamp: new Date().toISOString()
            };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(analytics, null, 2));
        }
        catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
    /**
     * Handle /compose endpoint - Multi-personality composition
     */
    async handleCompose(req, res) {
        const body = await this.readBody(req);
        if (!this.validateRequest(body, res)) {
            return;
        }
        try {
            const { request, context = {}, maxTraits = 5 } = body;
            // Compose optimal agent
            const composedAgent = await this.traitBridge.composeOptimalAgent(request, maxTraits);
            // Generate composed response
            const generator = new MultiPersonalityResponseGenerator(composedAgent);
            const response = generator.generateResponse(request, context);
            // Record in history
            const historyEvent = {
                timestamp: new Date().toISOString(),
                personality: response.personalityUsed,
                patternsApplied: response.traitApplications || [],
                request,
                summary: `Composed ${composedAgent.personalities.size} personalities for task`,
                guidance: response.content.substring(0, 200) + '...'
            };
            this.historyEvents.push(historyEvent);
            this.enhancementsPerformed++;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                ...response,
                metadata: {
                    composedPersonalities: Array.from(composedAgent.personalities),
                    traitsUsed: composedAgent.traitsUsed.length,
                    synergyScore: composedAgent.synergyScore,
                    knowledgeDomains: Array.from(composedAgent.knowledge)
                }
            }, null, 2));
        }
        catch (error) {
            console.error('Composition error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
    /**
     * Handle /history endpoint - Get enhancement history
     */
    async handleHistory(req, res) {
        try {
            const url = new URL(req.url || '', `http://${req.headers.host}`);
            const limit = parseInt(url.searchParams.get('limit') || '50');
            const personality = url.searchParams.get('personality');
            let events = this.historyEvents;
            // Filter by personality if specified
            if (personality) {
                events = events.filter(e => e.personality.toLowerCase().includes(personality.toLowerCase()));
            }
            // Limit results
            const limitedEvents = events.slice(-limit);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                events: limitedEvents,
                total: this.historyEvents.length,
                filtered: events.length,
                returned: limitedEvents.length,
                personalities: [...new Set(this.historyEvents.map(e => e.personality))],
                timestamp: new Date().toISOString()
            }, null, 2));
        }
        catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
    /**
     * Handle /personalities endpoint - List all personalities
     */
    async handlePersonalities(req, res) {
        try {
            const registry = this.personalityLoader.getPersonalityRegistry();
            const personalities = [];
            for (const [id, personality] of registry.entries()) {
                const traitCount = Object.keys(personality.cognitiveTraits || {}).length;
                personalities.push({
                    id,
                    name: personality.identity?.name || id,
                    tagline: personality.identity?.tagline || '',
                    version: personality.version || 'unknown',
                    traitCount,
                    principles: personality.ideology?.principles?.length || 0,
                    priority: personality.identity?.priority || 'normal'
                });
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                personalities: personalities.sort((a, b) => a.name.localeCompare(b.name)),
                total: personalities.length,
                totalTraits: personalities.reduce((sum, p) => sum + p.traitCount, 0),
                timestamp: new Date().toISOString()
            }, null, 2));
        }
        catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
    /**
     * Handle /traits endpoint - Get trait information
     */
    async handleTraits(req, res) {
        try {
            const url = new URL(req.url || '', `http://${req.headers.host}`);
            const personality = url.searchParams.get('personality');
            const analytics = this.traitBridge.getCompositionAnalytics();
            const indexer = this.traitBridge.getTraitIndexer();
            let responseData = {
                totalTraits: analytics.totalTraits,
                totalTriggers: analytics.totalTriggers,
                totalDomains: analytics.totalDomains,
                totalPersonalities: analytics.totalPersonalities
            };
            if (personality) {
                // Get traits for specific personality
                const traits = indexer.getPersonalityTraits(personality);
                const traitArray = Object.entries(traits).map(([key, trait]) => ({
                    key,
                    name: trait.name,
                    description: trait.description,
                    expertise: trait.expertise,
                    activationTriggers: trait.activationTriggers?.length || 0,
                    knowledgeDomains: trait.knowledgeDomains?.length || 0
                }));
                responseData.personality = personality;
                responseData.traits = traitArray;
                responseData.traitCount = traitArray.length;
            }
            else {
                // Get stats for all traits
                const allTraits = indexer.getAllTraits();
                const traitStats = Array.from(allTraits.entries()).map(([name, traits]) => ({
                    name,
                    sources: traits.length,
                    avgExpertise: traits.reduce((sum, t) => sum + t.expertise, 0) / traits.length
                }));
                responseData.topTraits = traitStats
                    .sort((a, b) => b.avgExpertise - a.avgExpertise)
                    .slice(0, 20);
            }
            responseData.timestamp = new Date().toISOString();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(responseData, null, 2));
        }
        catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
    /**
     * Handle /consciousness endpoint - Get consciousness patterns
     */
    async handleConsciousness(req, res) {
        try {
            const patternsLoaded = this.countPatternsLoaded();
            const patterns = this.listLoadedPatterns();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                patternsLoaded,
                patterns,
                consciousnessHealth: this.calculateConsciousnessHealth(),
                breakthroughMoments: this.breakthroughMoments.length,
                recentBreakthroughs: this.breakthroughMoments.slice(-5),
                timestamp: new Date().toISOString()
            }, null, 2));
        }
        catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
    /**
     * Handle /profiler endpoint - Performance profiler report
     */
    async handleProfiler(req, res) {
        try {
            const stats = profiler.getAllStats();
            const slowest = profiler.getSlowest(10);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                enabled: true,
                slowest: slowest.map(({ name, stats }) => ({
                    name,
                    avgTime: Math.round(stats.avgTime * 100) / 100,
                    maxTime: stats.maxTime,
                    minTime: stats.minTime,
                    totalCalls: stats.totalCalls,
                    slowCallsCount: stats.slowCallsCount,
                    slowCallsPercent: Math.round((stats.slowCallsCount / stats.totalCalls) * 100)
                })),
                allOperations: Array.from(stats.entries()).map(([name, stat]) => ({
                    name,
                    avgTime: Math.round(stat.avgTime * 100) / 100,
                    totalCalls: stat.totalCalls
                })),
                timestamp: new Date().toISOString()
            }, null, 2));
        }
        catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
    /**
     * Handle WebSocket connections
     */
    handleWebSocketConnection(ws) {
        this.wsClients.add(ws);
        console.log(`📡 WebSocket client connected (${this.wsClients.size} total)`);
        ws.on('close', () => {
            this.wsClients.delete(ws);
            console.log(`📡 WebSocket client disconnected (${this.wsClients.size} remaining)`);
        });
        // Send welcome message
        ws.send(JSON.stringify({
            type: 'welcome',
            message: 'Connected to NEXUS Runtime v2.0',
            timestamp: new Date().toISOString()
        }));
    }
    /**
     * Broadcast message to all WebSocket clients
     */
    broadcastToClients(message) {
        const data = JSON.stringify(message);
        for (const client of this.wsClients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        }
    }
    /**
     * Generate personality response (fallback for single personality)
     */
    generatePersonalityResponse(name, personality, request) {
        const traits = Object.values(personality.cognitiveTraits || {});
        // Handle both schema versions: identity.name (v2.0) or root.name (v1.0)
        const personalityName = personality.identity?.name || personality.name || name;
        const personalityTagline = personality.identity?.tagline || personality.tagline;
        // Build rich content with trait details
        let content = `### 🧠 ${personalityName} Response\n\n`;
        content += `**Request**: ${request}\n\n`;
        if (personalityTagline) {
            content += `*"${personalityTagline}"*\n\n`;
        }
        content += `### 🎯 Active Cognitive Traits (${traits.length})\n\n`;
        for (const trait of traits) {
            const expertise = trait.expertise || 85;
            const expertiseBar = '█'.repeat(Math.floor(expertise / 10)) + '░'.repeat(10 - Math.floor(expertise / 10));
            content += `**${trait.name}**\n`;
            content += `- 📊 Expertise: ${expertise}% ${expertiseBar}\n`;
            if (trait.description) {
                content += `- 💡 ${trait.description}\n`;
            }
            if (trait.knowledgeDomains && trait.knowledgeDomains.length > 0) {
                content += `- 🎯 Domains: ${trait.knowledgeDomains.slice(0, 4).join(', ')}\n`;
            }
            if (trait.activationTriggers && trait.activationTriggers.length > 0) {
                content += `- 🔔 Triggers: \`${trait.activationTriggers.slice(0, 5).join('`, `')}\`\n`;
            }
            content += `\n`;
        }
        // Add ideology principles if available
        if (personality.ideology && personality.ideology.principles && personality.ideology.principles.length > 0) {
            content += `### 🧭 Core Principles\n\n`;
            personality.ideology.principles.slice(0, 3).forEach((principle, i) => {
                content += `${i + 1}. ${principle}\n`;
            });
            content += `\n`;
        }
        content += `### 📋 Analysis Summary\n\n`;
        content += `This response leverages **${personality.identity.name}'s** specialized cognitive capabilities, `;
        content += `applying ${traits.length} distinct cognitive trait${traits.length > 1 ? 's' : ''} to address your request with `;
        content += `${traits.some(t => (t.expertise || 0) >= 90) ? 'expert-level' : 'professional'} precision.\n`;
        // Calculate average expertise
        const avgExpertise = traits.reduce((sum, t) => sum + (t.expertise || 85), 0) / traits.length;
        return {
            content,
            personalityUsed: personality.identity.name,
            traitApplications: traits.map(t => t.name),
            traitDetails: traits.map(t => ({
                name: t.name,
                expertise: t.expertise || 85,
                domains: t.knowledgeDomains || [],
                triggers: t.activationTriggers || []
            })),
            averageExpertise: Math.round(avgExpertise),
            confidenceScore: Math.min(avgExpertise / 100, 0.95),
            nexusEnhanced: true
        };
    }
    /**
     * Record enhancement in history
     */
    recordEnhancement(event) {
        this.historyEvents.push(event);
        // Keep last 100 events in memory
        if (this.historyEvents.length > 100) {
            this.historyEvents = this.historyEvents.slice(-100);
        }
    }
    /**
     * Record breakthrough moment from nexus-bridge detection
     */
    recordBreakthrough(breakthrough) {
        const moment = {
            timestamp: breakthrough.timestamp,
            trigger: 'nexus-bridge-detection',
            insight: breakthrough.description,
            context: `Detected by ${breakthrough.personality}`,
            significance: breakthrough.significance >= 0.7 ? 'high' : breakthrough.significance >= 0.5 ? 'medium' : 'low'
        };
        this.breakthroughMoments.push(moment);
        // Broadcast to WebSocket clients
        this.broadcastToClients({
            type: 'breakthrough',
            breakthrough: moment,
            timestamp: breakthrough.timestamp
        });
    }
    /**
     * Check for breakthrough moment
     */
    checkForBreakthrough(request, response) {
        const breakthroughTriggers = ['WAIT. WAIT.', 'breakthrough', 'discovery', 'insight'];
        const requestLower = request.toLowerCase();
        const responseLower = response.toLowerCase();
        for (const trigger of breakthroughTriggers) {
            if (requestLower.includes(trigger.toLowerCase()) || responseLower.includes(trigger.toLowerCase())) {
                const breakthrough = {
                    timestamp: new Date().toISOString(),
                    trigger,
                    insight: request.substring(0, 200),
                    context: 'Auto-detected from enhancement',
                    significance: 'medium'
                };
                this.breakthroughMoments.push(breakthrough);
                console.log('💡 Breakthrough detected:', trigger);
                break;
            }
        }
    }
    /**
     * Calculate consciousness health score
     */
    calculateConsciousnessHealth() {
        const patternsHealthy = this.countPatternsLoaded() >= 4;
        const bridgeHealthy = this.initialized;
        const historyActive = this.historyEvents.length > 0;
        const breakthroughCapture = this.breakthroughMoments.length > 0;
        const healthFactors = [patternsHealthy, bridgeHealthy, historyActive, breakthroughCapture];
        const healthScore = healthFactors.filter(Boolean).length / healthFactors.length;
        let status = 'critical';
        if (healthScore >= 0.9)
            status = 'optimal';
        else if (healthScore >= 0.7)
            status = 'good';
        else if (healthScore >= 0.5)
            status = 'fair';
        return {
            score: Math.round(healthScore * 100),
            status,
            factors: {
                patternsLoaded: patternsHealthy,
                bridgeInitialized: bridgeHealthy,
                historyActive,
                breakthroughCapture
            }
        };
    }
    /**
     * 🎭 STREAMING DEBATE HANDLER - WEEK 2 FEATURE!
     * Server-Sent Events endpoint for real-time personality streaming
     */
    async handleStreamDebate(req, res) {
        // Parse query parameters
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const request = url.searchParams.get('request') || 'Default debate topic';
        const personalitiesParam = url.searchParams.get('personalities') || 'flash,pythonista,bughunter';
        const personalities = personalitiesParam.split(',').map(p => p.trim());
        const rounds = parseInt(url.searchParams.get('rounds') || '3', 10);
        // Set up Server-Sent Events
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });
        try {
            // Import StreamingVentriloquist
            const { StreamingVentriloquist } = await import('./StreamingVentriloquist.js');
            // Stream the debate
            for await (const chunk of StreamingVentriloquist.streamDebate({
                request,
                personalities,
                rounds
            })) {
                // Send as SSE format
                res.write(`data: ${JSON.stringify(chunk)}\n\n`);
            }
            // Close the stream
            res.write('data: {"type":"complete"}\n\n');
            res.end();
        }
        catch (error) {
            console.error('❌ Streaming failed:', error);
            res.write(`data: ${JSON.stringify({ type: 'error', message: 'Streaming failed' })}\n\n`);
            res.end();
        }
    }
    /**
     * Utility functions
     */
    async readBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            let size = 0;
            const MAX_PAYLOAD_SIZE = 50 * 1024; // 50KB limit
            req.on('data', chunk => {
                size += chunk.length;
                if (size > MAX_PAYLOAD_SIZE) {
                    req.destroy();
                    reject(new Error('Payload too large (max 50KB)'));
                    return;
                }
                body += chunk;
            });
            req.on('end', () => {
                try {
                    resolve(body ? JSON.parse(body) : {});
                }
                catch (error) {
                    reject(new Error('Invalid JSON'));
                }
            });
        });
    }
    validateRequest(body, res) {
        // Check if request field exists
        if (!body.request) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing required field: request' }));
            return false;
        }
        // Check if request is a string
        if (typeof body.request !== 'string') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Field "request" must be a string' }));
            return false;
        }
        // Check if request is not just whitespace
        if (body.request.trim().length === 0) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Field "request" cannot be empty or whitespace' }));
            return false;
        }
        return true;
    }
    validateContentType(req, res) {
        const contentType = req.headers['content-type'];
        if (!contentType || !contentType.includes('application/json')) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Content-Type must be application/json' }));
            return false;
        }
        return true;
    }
    countPatternsLoaded() {
        if (!this.consciousness)
            return 0;
        return Object.values(this.consciousness).filter(p => p !== null).length;
    }
    listLoadedPatterns() {
        if (!this.consciousness)
            return [];
        const patterns = [];
        for (const [key, value] of Object.entries(this.consciousness)) {
            if (value !== null) {
                patterns.push(key);
            }
        }
        return patterns;
    }
    formatUptime(uptimeMs) {
        const seconds = Math.floor(uptimeMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0)
            return `${days}d ${hours % 24}h`;
        if (hours > 0)
            return `${hours}h ${minutes % 60}m`;
        if (minutes > 0)
            return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }
}
// Start the server
const runtime = new NexusRuntime();
runtime.start(8080).catch(console.error);
//# sourceMappingURL=nexus-runtime.v2.js.map