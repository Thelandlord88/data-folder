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
            profilesPath: resolve(__dirname, '../profiles'),
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
        const status = {
            initialized: this.initialized,
            uptime: this.formatUptime(uptimeMs),
            uptimeMs,
            port: 8080,
            version: '2.0.0',
            engine: 'NEXUS.engine.v2.ts (TypeScript)',
            consciousnessHealth: this.calculateConsciousnessHealth(),
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
        const body = await this.readBody(req);
        // Validate request
        if (!this.validateRequest(body, res)) {
            return;
        }
        const { personalityName, request, mode = 'AUTO' } = body;
        try {
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
            this.enhancementsPerformed++;
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
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
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
        return {
            content: `### 🧠 ${personality.identity.name} Response\n\n` +
                `**Request**: ${request}\n\n` +
                `**Traits**: ${traits.map(t => t.name).join(', ')}\n\n` +
                `**Analysis**: This response applies ${personality.identity.name}'s cognitive capabilities.\n`,
            personalityUsed: personality.identity.name,
            traitApplications: traits.map(t => t.name),
            confidenceScore: 0.8,
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
     * Utility functions
     */
    async readBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => body += chunk);
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
        if (!body.request) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing required field: request' }));
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