# NEXUS v3 Function Signatures Reference

**Complete Function Signatures for Cross-Reference**

---

## NEXUS.engine.v2.ts

### TraitIndexer Class

```typescript
class TraitIndexer {
  private triggerIndex: Map<string, Set<PersonalityTrait>>;
  private domainIndex: Map<string, Set<PersonalityTrait>>;
  
  constructor();
  
  indexPersonality(
    personalityId: string, 
    personalityData: PersonalityData
  ): void;
  
  searchTraitsForRequest(
    requestText: string, 
    maxResults: number = 10
  ): TraitSearchResult[];
}
```

### ComposedAgentFactory Class

```typescript
class ComposedAgentFactory {
  private indexer: TraitIndexer;
  
  constructor(indexer: TraitIndexer);
  
  composeAgent(
    request: string, 
    maxTraits: number = 5
  ): ComposedAgent;
  
  private buildComposedAgent(
    task: string,
    traitResults: TraitSearchResult[],
    synergyScore: number
  ): ComposedAgent;
  
  calculateOverallSynergy(
    traits: PersonalityTrait[]
  ): number;
}
```

### TraitCompositionBridge Class

```typescript
class TraitCompositionBridge {
  private traitIndexer: TraitIndexer;
  private agentFactory: ComposedAgentFactory;
  public initialized: boolean;
  private responseCache: Map<string, { response: any; timestamp: number }>;
  private readonly CACHE_MAX_SIZE: number = 100;
  private readonly CACHE_TTL_MS: number = 300000; // 5 minutes
  
  constructor();
  
  initialize(
    personalityLoader: PersonalityRegistryLoader
  ): Promise<void>;
  
  selectOptimalPersonality(
    request: string
  ): Promise<string>;
  
  composeOptimalAgent(
    request: string, 
    maxTraits: number = 5
  ): Promise<ComposedAgent>;
  
  generateComposedResponse(
    request: string, 
    maxTraits: number = 5
  ): any;
  
  private getCachedResponse(
    key: string
  ): any | null;
  
  private cacheResponse(
    key: string, 
    response: any
  ): void;
  
  clearCache(): void;
}
```

### MultiPersonalityResponseGenerator Class

```typescript
class MultiPersonalityResponseGenerator {
  private composedAgent: ComposedAgent;
  private personalityRegistry: Map<string, PersonalityData>;
  
  constructor(
    composedAgent: ComposedAgent,
    personalityRegistry: Map<string, PersonalityData>
  );
  
  async generateResponse(
    request: string
  ): Promise<any>;
  
  private async synthesizeMultiPersonalityResponse(
    request: string
  ): Promise<string>;
  
  private generatePersonalityPerspective(
    personalityId: string,
    personality: PersonalityData,
    request: string,
    agent: ComposedAgent
  ): string;
  
  private generatePersonalityRecommendation(
    personalityId: string,
    personality: PersonalityData,
    agent: ComposedAgent
  ): string;
  
  private synthesizeIntegratedRecommendation(
    personalityResponses: Map<string, string>,
    personalities: Set<string>
  ): string;
}
```

---

## nexus-runtime.v2.ts

### NexusRuntime Class

```typescript
class NexusRuntime {
  private server: any;
  private wss: WebSocketServer | null;
  private personalityLoader: PersonalityRegistryLoader;
  private traitBridge: TraitCompositionBridge;
  private initialized: boolean;
  private startTime: number;
  private enhancementsPerformed: number;
  private historyEvents: HistoryEvent[];
  private breakthroughMoments: BreakthroughMoment[];
  private consciousness: Record<string, any>;
  private wsClients: Set<WebSocket>;
  private requestCounts: Map<string, { count: number; resetTime: number }>;
  private readonly RATE_LIMIT_WINDOW_MS: number = 60000;
  private readonly RATE_LIMIT_MAX_REQUESTS: number = 30;
  
  constructor();
  
  async initialize(): Promise<void>;
  
  start(port: number = 8080): void;
  
  stop(): void;
  
  private async handleRequest(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void>;
  
  private handleStatus(
    req: IncomingMessage,
    res: ServerResponse
  ): void;
  
  private async handleEnhance(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void>;
  
  private async handleBreakthrough(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void>;
  
  private async handleReloadConsciousness(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void>;
  
  private handleWebSocket(ws: WebSocket): void;
  
  private async readBody(
    req: IncomingMessage
  ): Promise<any>;
  
  private validateRequest(
    body: any,
    res: ServerResponse
  ): boolean;
  
  private checkRateLimit(
    clientIp: string,
    res: ServerResponse
  ): boolean;
  
  private validateContentType(
    req: IncomingMessage,
    res: ServerResponse
  ): boolean;
  
  private broadcast(message: any): void;
  
  private generatePersonalityResponse(
    personality: PersonalityData,
    request: string
  ): any;
  
  private getConsciousnessHealth(): any;
  
  private getAvailablePatterns(): string[];
}
```

---

## PersonalityRegistryLoader.ts

### PersonalityRegistryLoader Class

```typescript
class PersonalityRegistryLoader {
  private personalityRegistry: Map<string, PersonalityData>;
  private circuitBreaker: {
    state: CircuitBreakerState;
    failures: number;
    lastFailureTime: number;
    successCount: number;
  };
  private readonly FAILURE_THRESHOLD: number = 5;
  private readonly RESET_TIMEOUT: number = 60000;
  
  constructor();
  
  async initialize(): Promise<void>;
  
  getPersonality(personalityId: string): PersonalityData | null;
  
  getPersonalityRegistry(): Map<string, PersonalityData>;
  
  async reloadPersonality(
    personalityId: string
  ): Promise<boolean>;
  
  getCircuitBreakerState(): CircuitBreakerState;
  
  private async loadPersonalityFile(
    filePath: string
  ): Promise<PersonalityData | null>;
  
  private validatePersonalityData(
    data: any,
    personalityId: string
  ): boolean;
  
  private normalizePersonalityId(
    filename: string
  ): string;
  
  private getProfilesDirectory(): string;
  
  private recordSuccess(): void;
  
  private recordFailure(): void;
  
  private shouldAttemptLoad(): boolean;
}
```

---

## personality-schema.ts

### Validation Functions

```typescript
function validatePersonalitySchema(
  data: any
): { valid: boolean; errors: string[] };

function validateIdentity(
  identity: any
): { valid: boolean; errors: string[] };

function validateIdeology(
  ideology: any
): { valid: boolean; errors: string[] };

function validateTraits(
  traits: any
): { valid: boolean; errors: string[] };

function validateTrait(
  trait: any,
  index: number
): { valid: boolean; errors: string[] };

function validateMetadata(
  metadata: any
): { valid: boolean; errors: string[] };

export {
  validatePersonalitySchema,
  validateIdentity,
  validateIdeology,
  validateTraits,
  validateTrait,
  validateMetadata
};
```

---

## Type Definitions (personality.types.ts)

### Core Interfaces

```typescript
interface PersonalityData {
  identity: {
    name: string;
    role: string;
    description: string;
  };
  ideology: {
    principles: string[];
    beliefs?: string[];
    motto?: string;
  };
  traits: PersonalityTrait[];
  metadata?: {
    version?: string;
    author?: string;
    created?: string;
    tags?: string[];
  };
}

interface PersonalityTrait {
  name: string;
  description: string;
  expertise: number; // 0-100
  activationTriggers: string[];
  knowledgeDomains: string[];
  personalityId: string;
}

interface TraitSearchResult {
  trait: PersonalityTrait;
  relevanceScore: number;
  matchedTriggers: string[];
}

interface ComposedAgent {
  id: string;
  task: string;
  traits: Map<string, PersonalityTrait>;
  knowledge: Set<string>;
  personalities: Set<string>;
  traitsUsed: string[];
  synergyScore: number;
  optimizationScore: number;
}

interface HistoryEvent {
  timestamp: string;
  personality: string;
  patternsApplied: string[];
  request: string;
  summary: string;
  guidance: string;
}

interface BreakthroughMoment {
  timestamp: string;
  trigger: string;
  insight: string;
  context: string;
}

type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

type EnhancementMode = 'AUTO' | 'COMPOSE';
```

---

## HTTP API Signatures

### Request Types

```typescript
// POST /enhance
interface EnhanceRequest {
  request: string;           // Required, max 10KB
  mode?: 'AUTO' | 'COMPOSE'; // Optional, default 'AUTO'
  personalityName?: string;  // Optional for AUTO mode
}

// POST /breakthrough
interface BreakthroughRequest {
  trigger: string;
  insight: string;
  context: string;
}
```

### Response Types

```typescript
// GET /status
interface StatusResponse {
  initialized: boolean;
  uptime: string;
  enhancementsPerformed: number;
  personalitySystem: {
    totalPersonalities: number;
    availablePersonalities: string[];
  };
  traitComposition: {
    totalTraits: number;
    totalTriggers: number;
    totalDomains: number;
  };
  consciousnessHealth: {
    status: 'optimal' | 'good' | 'degraded';
    patternsLoaded: number;
  };
  loaderHealth: {
    circuitBreakerState: CircuitBreakerState;
  };
  wsConnections: number;
}

// POST /enhance
interface EnhanceResponse {
  success: boolean;
  response: {
    content: string;
    personalityUsed: string | string[];
    traitApplications?: string[];
    traits?: Array<{
      name: string;
      personality: string;
      relevance: number;
    }>;
    synergyScore?: number;
    confidenceScore: number;
    cached?: boolean;
    nexusEnhanced: boolean;
  };
}

// Error Response
interface ErrorResponse {
  error: string;
  message?: string;
  retryAfter?: number; // For rate limiting
}
```

---

## Constants Reference

```typescript
// Cache Configuration
const CACHE_MAX_SIZE = 100;
const CACHE_TTL_MS = 300000; // 5 minutes

// Rate Limiting
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30;

// Input Validation
const MAX_REQUEST_LENGTH = 10000; // 10KB

// Circuit Breaker
const FAILURE_THRESHOLD = 5;
const RESET_TIMEOUT = 60000; // 60 seconds

// Server
const DEFAULT_PORT = 8080;

// Synergy Calculation
const SAME_PERSONALITY_BONUS = 0.3;
const DOMAIN_OVERLAP_BONUS = 0.2;
```

---

## Usage Examples

### Initialize System

```typescript
const loader = new PersonalityRegistryLoader();
await loader.initialize();

const bridge = new TraitCompositionBridge();
await bridge.initialize(loader);

const runtime = new NexusRuntime();
await runtime.initialize();
runtime.start(8080);
```

### Compose Agent

```typescript
const agent = await bridge.composeOptimalAgent("secure API", 5);
const generator = new MultiPersonalityResponseGenerator(
  agent,
  loader.getPersonalityRegistry()
);
const response = await generator.generateResponse("secure API");
```

### Search Traits

```typescript
const indexer = new TraitIndexer();
indexer.indexPersonality("cipher", cipherData);
const results = indexer.searchTraitsForRequest("security", 10);
```

---

**Document Version**: 1.0  
**Date**: October 8, 2025  
**Purpose**: Complete function signature reference for NEXUS v3
