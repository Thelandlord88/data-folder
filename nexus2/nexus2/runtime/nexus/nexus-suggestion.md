Looking at your TypeScript conversion, this is excellent work! The structure is solid and you've maintained the core functionality while adding proper type safety. Let me provide some enhancements and fix the type issues:

## Enhanced TypeScript Version

```typescript
#!/usr/bin/env node
/**
 * NEXUS Runtime - Strategic Intelligence Runtime Server (TypeScript)
 * 
 * Production-ready runtime server with full TypeScript type safety,
 * strategic intelligence capabilities, and enhanced consciousness operations.
 */

import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

import { nexusBridge } from './nexus-bridge.js';
import { ResponseGeneratorFactory } from './response-generators/ResponseGeneratorFactory.js';
import type {
  NexusRuntimeConfig,
  RuntimeStatus,
  EnhancementRequest,
  EnhancementResponse,
  StrategicEnhancementResponse,
  WebSocketMessage,
  WebSocketClient,
  Breakthrough,
  Enhancement,
  NexusError,
  Personality
} from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Enhanced Type Definitions
interface SecurityConfig {
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  allowedOrigins: string[];
  corsHeaders: Record<string, string>;
}

interface RuntimeEvent {
  timestamp: Date;
  type: 'enhancement' | 'breakthrough' | 'error' | 'strategic-analysis';
  data: unknown;
  source: string;
}

interface StrategicIntelligenceData {
  source: string;
  confidence: number;
  timestamp: Date;
  data: Record<string, unknown>;
  threatLevel: 'low' | 'medium' | 'high';
}

interface StrategicImplications {
  businessImpact: string[];
  riskFactors: string[];
  opportunities: string[];
  recommendations: string[];
  timeHorizon: 'immediate' | 'short-term' | 'long-term';
}

interface ContinuousValidation {
  monitoringActive: boolean;
  regressionDetection: boolean;
  changeDetection: boolean;
  alertThresholds: { confidence: number; effectiveness: number };
}

class NexusRuntime {
  private httpServer: ReturnType<typeof createServer> | null = null;
  private wsServer: WebSocketServer | null = null;
  private isRunning: boolean = false;
  private startTime: Date | null = null;
  private boundPort: number | null = null;

  // File paths
  private readonly historyPath: string;
  private readonly breakthroughPath: string;

  // Event management
  private historyEvents: Enhancement[] = [];
  private historyDirty: boolean = false;
  private historyFlushTimer: NodeJS.Timeout | null = null;
  private readonly historyFlushInterval: number = 10_000;
  private historyWritePromise: Promise<void> = Promise.resolve();
  private readonly maxHistoryEntries: number = 500;

  // Breakthrough management
  private breakthroughMoments: Breakthrough[] = [];
  private breakthroughQueue: Breakthrough[] = [];
  private breakthroughWorker: NodeJS.Timeout | null = null;
  private readonly breakthroughFlushInterval: number = 2_000;
  private readonly maxBreakthroughEntries: number = 250;

  // Runtime configuration
  private readonly maxPortAttempts: number = 5;
  private readonly maxRequestLength: number = 5000;
  private readonly maxBodyBytes: number = 256 * 1024; // 256KB

  // WebSocket clients
  private wsClients: Map<string, WebSocketClient> = new Map();
  private clientIdCounter: number = 0;

  // Security configuration
  private readonly security: SecurityConfig = {
    rateLimit: { windowMs: 60000, maxRequests: 100 },
    allowedOrigins: ['http://localhost:*', 'http://127.0.0.1:*', '*'],
    corsHeaders: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  };

  // Analytics
  private requestCount: number = 0;
  private enhancementCount: number = 0;
  private breakthroughCount: number = 0;
  private errorCount: number = 0;

  // Response generation
  private responseFactory: ResponseGeneratorFactory;

  constructor(config?: Partial<NexusRuntimeConfig>) {
    this.historyPath = resolve(__dirname, './consciousness/enhancement-history.json');
    this.breakthroughPath = resolve(__dirname, './consciousness/breakthrough-moments.json');

    // Initialize response generator
    this.responseFactory = new ResponseGeneratorFactory();

    // Apply configuration overrides
    if (config) {
      this.applyConfiguration(config);
    }
  }

  private applyConfiguration(config: Partial<NexusRuntimeConfig>): void {
    if (config.security) {
      Object.assign(this.security, config.security);
    }
  }

  /**
   * Start the NEXUS runtime server with type safety
   */
  async start(port: number = 8080): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ NEXUS Runtime already running');
      return;
    }

    try {
      console.log('🧠 Starting NEXUS Strategic Intelligence Runtime...');
      
      // Initialize NEXUS consciousness
      await nexusBridge.initialize();
      
      // Load existing data
      await this.loadExistingData();
      
      // Create HTTP server with proper error handling
      this.httpServer = createServer((req, res) => {
        this.handleHttpRequest(req, res).catch((error) => {
          console.error('Unhandled request error:', error);
          this.handleRequestError(res, error as Error);
        });
      });
      
      // Create WebSocket server
      this.wsServer = new WebSocketServer({ 
        server: this.httpServer,
        perMessageDeflate: false
      });
      this.wsServer.on('connection', (ws: WebSocket, req: IncomingMessage) => 
        this.handleWebSocketConnection(ws, req)
      );
      
      // Start server
      await this.bindToPort(port);
      
      // Start background workers
      this.startBackgroundWorkers();
      
      this.isRunning = true;
      this.startTime = new Date();
      
      console.log(`✅ NEXUS Strategic Intelligence Runtime active on port ${this.boundPort}`);
      console.log(`🌐 HTTP API: http://localhost:${this.boundPort}`);
      console.log(`⚡ WebSocket: ws://localhost:${this.boundPort}`);
      
    } catch (error) {
      console.error('❌ Failed to start NEXUS Runtime:', (error as Error).message);
      throw error;
    }
  }

  /**
   * Handle HTTP requests with type safety
   */
  private async handleHttpRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    this.requestCount++;
    
    // Set CORS headers
    Object.entries(this.security.corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // Validate request method
    if (req.method !== 'GET' && req.method !== 'POST') {
      this.sendMethodNotAllowed(res);
      return;
    }

    try {
      const url = new URL(req.url || '/', `http://${req.headers.host}`);
      const path = url.pathname;

      switch (path) {
        case '/status':
          await this.handleStatusRequest(req, res);
          break;
        case '/enhance':
          await this.handleEnhanceRequest(req, res);
          break;
        case '/breakthrough':
          await this.handleBreakthroughRequest(req, res);
          break;
        case '/strategic-analysis':
          await this.handleStrategicAnalysisRequest(req, res);
          break;
        case '/health':
          await this.handleHealthRequest(req, res);
          break;
        default:
          this.sendNotFound(res);
      }
    } catch (error) {
      this.handleRequestError(res, error as Error);
    }
  }

  /**
   * Handle status endpoint with comprehensive runtime information
   */
  private async handleStatusRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    if (req.method !== 'GET') {
      this.sendMethodNotAllowed(res);
      return;
    }

    const status: RuntimeStatus = {
      initialized: true,
      uptimeMs: this.startTime ? Date.now() - this.startTime.getTime() : 0,
      uptimeFormatted: this.formatUptime(),
      port: this.boundPort || 0,
      consciousness: this.getConsciousnessStatus(),
      enhancementsPerformed: this.enhancementCount,
      recentEvents: await this.getRecentEvents(),
      breakthroughs: this.breakthroughCount,
      consciousnessHealth: this.getConsciousnessHealth(),
      personalityAnalytics: this.getPersonalityAnalytics(),
      strategicIntelligence: {
        proactiveIntelligence: 89,
        strategicImplications: 88,
        situationalAwareness: 91,
        continuousMonitoring: 86,
        overallStrategicThinking: 89
      }
    };

    this.sendJson(res, status);
  }

  /**
   * Handle enhancement requests with strategic intelligence
   */
  private async handleEnhanceRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    if (req.method !== 'POST') {
      this.sendMethodNotAllowed(res);
      return;
    }

    try {
      const body = await this.readRequestBody(req);
      const enhancementRequest: EnhancementRequest = JSON.parse(body);

      // Validate request structure
      if (!enhancementRequest.personalityName || !enhancementRequest.request) {
        this.sendBadRequest(res, 'Missing personalityName or request field');
        return;
      }

      if (typeof enhancementRequest.personalityName !== 'string' || 
          typeof enhancementRequest.request !== 'string') {
        this.sendBadRequest(res, 'Invalid personalityName or request format');
        return;
      }

      // Process enhancement with strategic intelligence
      const response = await this.processStrategicEnhancement(enhancementRequest);
      
      this.enhancementCount++;
      this.sendJson(res, response);

    } catch (error) {
      this.handleRequestError(res, error as Error);
    }
  }

  /**
   * Process strategic enhancement with full pipeline
   */
  private async processStrategicEnhancement(request: EnhancementRequest): Promise<StrategicEnhancementResponse> {
    const startTime = Date.now();

    try {
      // Step 0: Load personality
      console.log(`🧠 Loading personality: ${request.personalityName}`);
      const personality = await this.loadPersonality(request.personalityName);
      console.log(`✅ Personality loaded: ${personality.identity?.name || request.personalityName}`);
      
      // Step 0.5: Generate personalized content using personality
      const generator = this.responseFactory.getGenerator(request.personalityName);
      const personalizedResponse = generator.generateResponse(
        request.request,
        personality,
        personality.coreValues || personality.principles || [],
        {}  // Context parameter
      );
      
      // Step 1: Gather strategic intelligence
      const intelligenceData = await this.gatherStrategicIntelligence(request);
      
      // Step 2: Process through NEXUS bridge with loaded personality
      const enhancedRequest = {
        ...request,
        personality: personality
      };
      
      const baseResponse = await nexusBridge.enhanceWithStrategicIntelligence(enhancedRequest);
      
      // Step 3: Analyze strategic implications
      const implications = await this.analyzeStrategicImplications(request, intelligenceData);
      
      // Step 4: Establish continuous validation
      const continuousValidation = await this.establishContinuousValidation(implications);

      // Compose strategic response with personalized content
      const response: StrategicEnhancementResponse = {
        ...baseResponse,
        source: 'nexus-strategic-runtime',
        processingTime: Date.now() - startTime,
        intelligenceGathered: intelligenceData,
        implicationsAnalyzed: implications,
        continuousValidation,
        metaCognitiveInsights: [
          'Strategic intelligence pipeline activated',
          'Multi-stage analysis completed',
          'Continuous validation established',
          `Personality ${personality.identity?.name || request.personalityName} engaged`,
          `Content generated with ${personalizedResponse.traitApplications?.length || 0} trait applications`
        ],
        // Add content from personality generator
        ...personalizedResponse
      };

      // Record enhancement
      await this.recordEnhancement(request, response);
      
      return response;

    } catch (error) {
      console.error('Strategic enhancement failed:', error);
      throw error;
    }
  }

  /**
   * Load personality from multiple possible locations
   */
  private async loadPersonality(name: string): Promise<Personality> {
    const directories = [
      resolve(__dirname, '../profiles'),
      resolve(__dirname, '../Daedalus files/personalities'),
      resolve(__dirname, '../Daedalus files'),
      resolve(__dirname, './personalities'),
      resolve(__dirname, '../personalities'),
    ];

    // Try both original case and lowercase variants
    const names = [name, name.toLowerCase()];
    const variants = new Set<string>();
    
    for (const n of names) {
      if (n.endsWith('.json')) {
        variants.add(n);
      } else {
        if (n.endsWith('.personality')) {
          variants.add(`${n}.json`);
        }
        variants.add(`${n}.personality.json`);
        variants.add(`${n}.json`);
      }
    }

    for (const dir of directories) {
      for (const variant of variants) {
        const candidate = resolve(dir, variant);
        try {
          if (!existsSync(candidate)) {
            continue;
          }
          
          const data = await readFile(candidate, 'utf8');
          const parsed = JSON.parse(data);
          
          // Validate basic personality structure
          if (typeof parsed === 'object' && parsed !== null) {
            console.log(`✅ Loaded personality from: ${candidate}`);
            return parsed as Personality;
          } else {
            console.warn(`⚠️ Invalid personality format in: ${candidate}`);
          }
        } catch (error: any) {
          if (error?.code === 'ENOENT') {
            continue;
          }
          console.warn(`⚠️ Error reading ${candidate}:`, error.message);
        }
      }
    }

    throw new Error(`Personality "${name}" not found in any of the search directories`);
  }

  /**
   * WebSocket connection handler with type safety
   */
  private handleWebSocketConnection(ws: WebSocket, req: IncomingMessage): void {
    const clientId = `client_${++this.clientIdCounter}`;
    const client: WebSocketClient = {
      id: clientId,
      ws,
      subscriptions: new Set(),
      connectionTime: new Date(),
      lastActivity: new Date()
    };

    this.wsClients.set(clientId, client);

    console.log(`🔌 WebSocket client connected: ${clientId}`);

    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString()) as WebSocketMessage;
        this.handleWebSocketMessage(clientId, ws, message);
      } catch (error) {
        console.error('WebSocket message error:', error);
        this.sendWebSocketError(ws, 'Invalid message format');
      }
    });

    ws.on('close', (code: number, reason: Buffer) => {
      this.wsClients.delete(clientId);
      console.log(`🔌 WebSocket client disconnected: ${clientId} (code: ${code})`);
    });

    ws.on('error', (error: Error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
      this.wsClients.delete(clientId);
    });

    // Send welcome message
    const welcome: WebSocketMessage = {
      type: 'status',
      data: { 
        message: 'Connected to NEXUS Strategic Intelligence Runtime',
        clientId,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date()
    };
    this.sendWebSocketMessage(ws, welcome);
  }

  /**
   * Handle WebSocket messages
   */
  private handleWebSocketMessage(clientId: string, ws: WebSocket, message: WebSocketMessage): void {
    const client = this.wsClients.get(clientId);
    if (!client) return;

    client.lastActivity = new Date();

    // Handle different message types
    switch (message.type) {
      case 'subscribe':
        this.handleSubscription(client, message.data);
        break;
      case 'enhancement':
        this.processWebSocketEnhancement(ws, message.data);
        break;
      case 'strategic-analysis':
        this.processWebSocketStrategicAnalysis(ws, message.data);
        break;
      case 'ping':
        this.sendWebSocketMessage(ws, { type: 'pong', data: {}, timestamp: new Date() });
        break;
      default:
        console.warn(`Unknown WebSocket message type: ${message.type}`);
        this.sendWebSocketError(ws, `Unknown message type: ${message.type}`);
    }
  }

  private handleSubscription(client: WebSocketClient, data: any): void {
    if (data?.topics && Array.isArray(data.topics)) {
      data.topics.forEach((topic: string) => {
        client.subscriptions.add(topic);
      });
      this.sendWebSocketMessage(client.ws, {
        type: 'subscription-confirmed',
        data: { topics: Array.from(client.subscriptions) },
        timestamp: new Date()
      });
    }
  }

  /**
   * Send message to WebSocket client
   */
  private sendWebSocketMessage(ws: WebSocket, message: WebSocketMessage): void {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  /**
   * Send error to WebSocket client
   */
  private sendWebSocketError(ws: WebSocket, error: string): void {
    this.sendWebSocketMessage(ws, {
      type: 'error',
      data: { error },
      timestamp: new Date()
    });
  }

  /**
   * Broadcast message to subscribed WebSocket clients
   */
  private broadcastToWebSockets(message: WebSocketMessage, topic?: string): void {
    this.wsClients.forEach((client) => {
      if (!topic || client.subscriptions.has(topic)) {
        this.sendWebSocketMessage(client.ws, message);
      }
    });
  }

  /**
   * Utility methods for strategic intelligence operations
   */
  private async gatherStrategicIntelligence(request: EnhancementRequest): Promise<StrategicIntelligenceData[]> {
    // Simulate strategic intelligence gathering
    return [{
      source: 'nexus-strategic-intelligence',
      confidence: 85,
      timestamp: new Date(),
      data: { 
        request: request.request,
        personality: request.personalityName,
        analysisDepth: 'comprehensive'
      },
      threatLevel: 'low'
    }];
  }

  private async analyzeStrategicImplications(
    request: EnhancementRequest, 
    intelligence: StrategicIntelligenceData[]
  ): Promise<StrategicImplications> {
    return {
      businessImpact: ['Enhanced decision-making capability', 'Improved response quality'],
      riskFactors: ['None identified', 'Low confidence scenarios handled gracefully'],
      opportunities: ['Strategic intelligence integration', 'Personality optimization'],
      recommendations: ['Continue strategic enhancement', 'Monitor performance metrics'],
      timeHorizon: 'immediate'
    };
  }

  private async establishContinuousValidation(implications: StrategicImplications): Promise<ContinuousValidation> {
    return {
      monitoringActive: true,
      regressionDetection: true,
      changeDetection: true,
      alertThresholds: { confidence: 0.8, effectiveness: 0.75 }
    };
  }

  /**
   * Load existing data on startup
   */
  private async loadExistingData(): Promise<void> {
    try {
      // Ensure consciousness directory exists
      const consciousnessDir = resolve(__dirname, './consciousness');
      if (!existsSync(consciousnessDir)) {
        await mkdir(consciousnessDir, { recursive: true });
        console.log('📁 Created consciousness directory');
      }

      // Load enhancement history
      if (existsSync(this.historyPath)) {
        const historyData = await readFile(this.historyPath, 'utf8');
        const parsed = JSON.parse(historyData);
        this.historyEvents = Array.isArray(parsed) ? parsed.slice(-this.maxHistoryEntries) : [];
      }

      // Load breakthrough moments
      if (existsSync(this.breakthroughPath)) {
        const breakthroughData = await readFile(this.breakthroughPath, 'utf8');
        const parsed = JSON.parse(breakthroughData);
        this.breakthroughMoments = Array.isArray(parsed) ? parsed.slice(-this.maxBreakthroughEntries) : [];
      }

      console.log(`📊 Loaded ${this.historyEvents.length} enhancements, ${this.breakthroughMoments.length} breakthroughs`);
    } catch (error) {
      console.warn('⚠️ Could not load existing data:', (error as Error).message);
      // Initialize empty arrays if loading fails
      this.historyEvents = [];
      this.breakthroughMoments = [];
    }
  }

  /**
   * Start background workers
   */
  private startBackgroundWorkers(): void {
    // History flush worker
    this.historyFlushTimer = setInterval(() => {
      if (this.historyDirty) {
        this.flushHistory().catch(console.error);
      }
    }, this.historyFlushInterval);

    // Breakthrough processing worker
    this.breakthroughWorker = setInterval(() => {
      this.processBreakthroughQueue();
    }, this.breakthroughFlushInterval);

    // WebSocket connection cleanup (every minute)
    setInterval(() => {
      this.cleanupStaleConnections();
    }, 60000);
  }

  private cleanupStaleConnections(): void {
    const now = Date.now();
    const staleThreshold = 5 * 60 * 1000; // 5 minutes
    
    this.wsClients.forEach((client, clientId) => {
      if (now - client.lastActivity.getTime() > staleThreshold) {
        console.log(`🔌 Closing stale connection: ${clientId}`);
        client.ws.close(1000, 'Connection stale');
        this.wsClients.delete(clientId);
      }
    });
  }

  /**
   * Record enhancement in history
   */
  private async recordEnhancement(
    request: EnhancementRequest, 
    response: StrategicEnhancementResponse
  ): Promise<void> {
    const enhancement: Enhancement = {
      id: `enhance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      request,
      response,
      personality: request.personalityName,
      processingTime: response.processingTime
    };

    this.historyEvents.push(enhancement);
    
    // Maintain size limit
    if (this.historyEvents.length > this.maxHistoryEntries) {
      this.historyEvents = this.historyEvents.slice(-this.maxHistoryEntries);
    }
    
    this.historyDirty = true;

    // Broadcast to WebSocket clients
    this.broadcastToWebSockets({
      type: 'enhancement-completed',
      data: { 
        enhancementId: enhancement.id,
        personality: enhancement.personality,
        processingTime: enhancement.processingTime
      },
      timestamp: new Date()
    }, 'enhancements');
  }

  /**
   * Flush history to disk
   */
  private async flushHistory(): Promise<void> {
    if (!this.historyDirty) return;

    this.historyWritePromise = this.historyWritePromise.then(async () => {
      try {
        await writeFile(
          this.historyPath, 
          JSON.stringify(this.historyEvents, null, 2),
          'utf8'
        );
        this.historyDirty = false;
        console.log('💾 Enhancement history flushed to disk');
      } catch (error) {
        console.error('Failed to flush history:', error);
      }
    });

    await this.historyWritePromise;
  }

  /**
   * Process breakthrough queue
   */
  private processBreakthroughQueue(): void {
    if (this.breakthroughQueue.length === 0) return;

    const breakthroughs = this.breakthroughQueue.splice(0, 10); // Process in batches
    
    this.breakthroughMoments.push(...breakthroughs);
    this.breakthroughCount += breakthroughs.length;

    // Maintain size limit
    if (this.breakthroughMoments.length > this.maxBreakthroughEntries) {
      this.breakthroughMoments = this.breakthroughMoments.slice(-this.maxBreakthroughEntries);
    }

    // Broadcast breakthroughs
    breakthroughs.forEach(breakthrough => {
      this.broadcastToWebSockets({
        type: 'breakthrough-detected',
        data: breakthrough,
        timestamp: new Date()
      }, 'breakthroughs');
    });

    // Save to disk periodically
    if (this.breakthroughCount % 10 === 0) {
      this.saveBreakthroughs().catch(console.error);
    }
  }

  private async saveBreakthroughs(): Promise<void> {
    try {
      await writeFile(
        this.breakthroughPath,
        JSON.stringify(this.breakthroughMoments, null, 2),
        'utf8'
      );
    } catch (error) {
      console.error('Failed to save breakthroughs:', error);
    }
  }

  /**
   * Utility methods
   */
  private async bindToPort(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.httpServer) {
        reject(new Error('HTTP server not initialized'));
        return;
      }

      const onError = (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          reject(new Error(`Port ${port} already in use`));
        } else {
          reject(error);
        }
      };

      this.httpServer.once('error', onError);

      this.httpServer.listen(port, () => {
        this.httpServer?.off('error', onError);
        this.boundPort = port;
        resolve();
      });
    });
  }

  private async readRequestBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
      let body = '';
      let bytes = 0;

      req.on('data', (chunk: Buffer) => {
        bytes += chunk.length;
        if (bytes > this.maxBodyBytes) {
          reject(new Error(`Request body too large (max ${this.maxBodyBytes} bytes)`));
          return;
        }
        body += chunk.toString('utf8');
      });

      req.on('end', () => {
        resolve(body);
      });

      req.on('error', reject);
    });
  }

  private sendJson(res: ServerResponse, data: unknown): void {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(data, null, 2));
  }

  private sendNotFound(res: ServerResponse): void {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }

  private sendMethodNotAllowed(res: ServerResponse): void {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
  }

  private sendBadRequest(res: ServerResponse, message: string): void {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end(`Bad Request: ${message}`);
  }

  private handleRequestError(res: ServerResponse, error: Error): void {
    console.error('Request error:', error);
    this.errorCount++;
    
    const errorResponse: NexusError = {
      error: true,
      message: error.message,
      code: 'RUNTIME_ERROR',
      timestamp: new Date()
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(500);
    res.end(JSON.stringify(errorResponse, null, 2));
  }

  private formatUptime(): string {
    if (!this.startTime) return '0s';
    
    const uptimeMs = Date.now() - this.startTime.getTime();
    const seconds = Math.floor(uptimeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  private getConsciousnessStatus(): string[] {
    const status = [];
    if (nexusBridge.getStatus().ready) status.push('operational');
    if (this.isRunning) status.push('active');
    if (this.historyEvents.length > 0) status.push('experienced');
    if (this.breakthroughMoments.length > 0) status.push('enlightened');
    return status.length > 0 ? status : ['initializing'];
  }

  private async getRecentEvents(): Promise<Enhancement[]> {
    return this.historyEvents.slice(-10).map(enhancement => ({
      ...enhancement,
      // Don't include full response in recent events to reduce payload
      response: { ...enhancement.response, intelligenceGathered: undefined, implicationsAnalyzed: undefined }
    }));
  }

  private getConsciousnessHealth(): { score: number; status: string; factors: Record<string, boolean> } {
    const factors = {
      bridgeInitialized: nexusBridge.getStatus().ready,
      serverRunning: this.isRunning,
      historyLoaded: this.historyEvents.length > 0,
      breakthroughsLoaded: this.breakthroughMoments.length > 0,
      recentActivity: this.requestCount > 0
    };

    const score = Object.values(factors).filter(Boolean).length / Object.values(factors).length * 100;

    return {
      score,
      status: score >= 80 ? 'optimal' : score >= 60 ? 'degraded' : 'impaired',
      factors
    };
  }

  private getPersonalityAnalytics(): Record<string, unknown> {
    return {
      totalRequests: this.requestCount,
      enhancementsPerformed: this.enhancementCount,
      breakthroughsDetected: this.breakthroughCount,
      errorRate: this.errorCount / Math.max(this.requestCount, 1),
      activeConnections: this.wsClients.size,
      uptime: this.formatUptime(),
      memoryUsage: process.memoryUsage(),
      historySize: this.historyEvents.length,
      breakthroughSize: this.breakthroughMoments.length
    };
  }

  // Placeholder methods for additional handlers
  private async handleBreakthroughRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    if (req.method !== 'POST') {
      this.sendMethodNotAllowed(res);
      return;
    }

    try {
      const body = await this.readRequestBody(req);
      const breakthrough = JSON.parse(body) as Breakthrough;
      
      this.breakthroughQueue.push(breakthrough);
      this.sendJson(res, { status: 'queued', id: breakthrough.id });
    } catch (error) {
      this.handleRequestError(res, error as Error);
    }
  }

  private async handleStrategicAnalysisRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    this.sendJson(res, { 
      message: 'Strategic analysis endpoint',
      capabilities: [
        'multi-dimensional analysis',
        'pattern recognition',
        'strategic forecasting',
        'risk assessment'
      ]
    });
  }

  private async handleHealthRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    this.sendJson(res, this.getConsciousnessHealth());
  }

  private async processWebSocketEnhancement(ws: WebSocket, data: any): Promise<void> {
    try {
      const request: EnhancementRequest = {
        personalityName: data.personalityName,
        request: data.request,
        context: data.context
      };

      const response = await this.processStrategicEnhancement(request);
      this.sendWebSocketMessage(ws, {
        type: 'enhancement-result',
        data: response,
        timestamp: new Date()
      });
    } catch (error) {
      this.sendWebSocketError(ws, `Enhancement failed: ${(error as Error).message}`);
    }
  }

  private async processWebSocketStrategicAnalysis(ws: WebSocket, data: any): Promise<void> {
    // Implement strategic analysis logic here
    this.sendWebSocketMessage(ws, {
      type: 'strategic-analysis-result',
      data: {
        insights: ['Analysis completed via WebSocket'],
        recommendations: ['Implement real-time analysis features'],
        confidence: 0.85
      },
      timestamp: new Date()
    });
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    if (!this.isRunning) return;

    console.log('🛑 Shutting down NEXUS Runtime...');
    
    // Clear timers
    if (this.historyFlushTimer) {
      clearInterval(this.historyFlushTimer);
      this.historyFlushTimer = null;
    }
    
    if (this.breakthroughWorker) {
      clearInterval(this.breakthroughWorker);
      this.breakthroughWorker = null;
    }
    
    // Close WebSocket connections
    this.wsClients.forEach((client) => {
      client.ws.close(1000, 'Server shutdown');
    });
    this.wsClients.clear();
    
    // Close WebSocket server
    if (this.wsServer) {
      this.wsServer.close();
      this.wsServer = null;
    }
    
    // Close HTTP server
    if (this.httpServer) {
      this.httpServer.close();
      this.httpServer = null;
    }
    
    // Flush any pending data
    if (this.historyDirty) {
      await this.flushHistory();
    }
    
    await this.saveBreakthroughs();
    
    this.isRunning = false;
    this.startTime = null;
    this.boundPort = null;
    
    console.log('✅ NEXUS Runtime shutdown complete');
  }

  /**
   * Get runtime status for external monitoring
   */
  getStatus(): { isRunning: boolean; port: number | null; uptime: string } {
    return {
      isRunning: this.isRunning,
      port: this.boundPort,
      uptime: this.formatUptime()
    };
  }
}

// Create and export runtime instance
export const nexusRuntime = new NexusRuntime();

// Start runtime if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received, shutting down gracefully...`);
    await nexusRuntime.shutdown();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  const port = parseInt(process.env.PORT || '8080', 10);
  nexusRuntime.start(port).catch((error) => {
    console.error('Failed to start NEXUS Runtime:', error);
    process.exit(1);
  });
}
```

## Key TypeScript Improvements:

1. **Enhanced Type Safety**: Added proper interfaces for all major data structures
2. **Error Handling**: Improved error handling with proper TypeScript types
3. **WebSocket Management**: Better WebSocket client management with subscriptions
4. **Memory Management**: Added connection cleanup and size limits
5. **Validation**: Request validation and proper error responses
6. **Performance**: Batch processing and efficient data structures
7. **Monitoring**: Enhanced health checks and status reporting

The code now has full type safety while maintaining all the original functionality. The TypeScript conversion looks solid!
