# NEXUS-4.5 API Guide

Complete guide to using all NEXUS endpoints with examples.

## 🚀 Quick Start

### Starting Nexus

```bash
# Option 1: Use the startup script (recommended)
./start-nexus.sh

# Option 2: Run directly
npx tsx nexus-runtime.v2.ts

# Option 3: Use compiled version (if available)
npm run build
node dist/nexus-runtime.v2.js
```

### Running Tests

```bash
# Run all tests
./test-nexus.sh

# Test manually with curl
curl http://127.0.0.1:8080/status
```

---

## 📡 API Endpoints

### 1. GET `/status` - System Status

Check if Nexus is running and get system information.

**Request:**
```bash
curl http://127.0.0.1:8080/status
```

**Response:**
```json
{
  "status": "operational",
  "version": "2.0.0",
  "uptime": 12345,
  "personalities": 45,
  "traits": 211,
  "consciousness": {
    "patterns": 4,
    "enhancements": 100,
    "breakthroughs": 15
  }
}
```

---

### 2. GET `/personalities` - List All Personalities

Get a list of all available personalities.

**Request:**
```bash
curl http://127.0.0.1:8080/personalities
```

**Response:**
```json
{
  "personalities": [
    {
      "id": "pythonista",
      "name": "Pythonista",
      "tagline": "Python excellence, code elegance",
      "traitCount": 8,
      "principles": 4,
      "priority": "high"
    },
    // ... 44 more personalities
  ],
  "total": 45,
  "totalTraits": 211
}
```

---

### 3. POST `/enhance` - Personality Enhancement

The main endpoint for getting AI-enhanced responses. Supports three modes:

#### Mode 1: SINGLE (Specific Personality)

Use a specific personality for your request.

**Request:**
```bash
curl -X POST http://127.0.0.1:8080/enhance \
  -H "Content-Type: application/json" \
  -d '{
    "personalityName": "pythonista",
    "request": "Write a Python function to calculate fibonacci numbers"
  }'
```

**Request Body:**
```json
{
  "personalityName": "pythonista",
  "request": "Write a Python function to calculate fibonacci numbers"
}
```

**Response:**
```json
{
  "mode": "SINGLE",
  "personality": "pythonista",
  "request": "Write a Python function to calculate fibonacci numbers",
  "response": "Here's an elegant Python solution...",
  "traitsUsed": [
    {
      "name": "code-excellence",
      "source": "pythonista",
      "expertise": 0.95,
      "relevance": 0.98
    }
  ],
  "patternsApplied": [
    "problem-decomposition",
    "systems-thinking"
  ],
  "metadata": {
    "timestamp": "2025-10-10T12:00:00.000Z",
    "processingTime": 45
  }
}
```

**Available Personalities:**
- `pythonista` - Python development
- `hunter` - Code analysis and optimization
- `daedalus` - System architecture
- `visionary` - Creative solutions
- `sage` - Documentation and best practices
- `atlas` - Data structures and algorithms
- `guardian` - Security and validation
- `forge` - Build systems and tooling
- `aria` - API design
- `wordsmith` - Content creation
- ... and 35 more!

---

#### Mode 2: AUTO (Automatic Personality Selection)

Let Nexus automatically select the best personality based on your request.

**Request:**
```bash
curl -X POST http://127.0.0.1:8080/enhance \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "AUTO",
    "request": "Design a secure authentication system"
  }'
```

**Request Body:**
```json
{
  "mode": "AUTO",
  "request": "Design a secure authentication system"
}
```

**Response:**
```json
{
  "mode": "AUTO",
  "selectedPersonality": "guardian",
  "confidence": 0.94,
  "request": "Design a secure authentication system",
  "response": "Here's a comprehensive authentication design...",
  "traitsUsed": [
    {
      "name": "security-first",
      "source": "guardian",
      "expertise": 0.98,
      "relevance": 0.96
    }
  ],
  "reasoning": "Selected Guardian due to security-related keywords and authentication expertise",
  "alternatives": ["daedalus", "hunter"],
  "metadata": {
    "timestamp": "2025-10-10T12:00:00.000Z"
  }
}
```

---

#### Mode 3: COMPOSE (Multi-Personality Composition)

Combine traits from multiple personalities for complex tasks.

**Request:**
```bash
curl -X POST http://127.0.0.1:8080/enhance \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "COMPOSE",
    "request": "Build a full-stack web application with Python backend and React frontend",
    "maxTraits": 8
  }'
```

**Request Body:**
```json
{
  "mode": "COMPOSE",
  "request": "Build a full-stack web application with Python backend and React frontend",
  "maxTraits": 8
}
```

**Response:**
```json
{
  "mode": "COMPOSE",
  "request": "Build a full-stack web application...",
  "personalitiesUsed": ["pythonista", "aria", "daedalus", "styleforge"],
  "traitsUsed": [
    {
      "name": "code-excellence",
      "source": "pythonista",
      "expertise": 0.95,
      "relevance": 0.98
    },
    {
      "name": "api-design",
      "source": "aria",
      "expertise": 0.92,
      "relevance": 0.95
    },
    {
      "name": "system-architecture",
      "source": "daedalus",
      "expertise": 0.94,
      "relevance": 0.93
    }
    // ... up to 8 traits
  ],
  "synergy": 0.91,
  "response": "Here's a comprehensive full-stack solution...",
  "breakdown": {
    "backend": "Pythonista provides backend implementation",
    "api": "Aria handles API design",
    "architecture": "Daedalus structures the system",
    "frontend": "StyleForge enhances UI/UX"
  },
  "metadata": {
    "timestamp": "2025-10-10T12:00:00.000Z",
    "processingTime": 123
  }
}
```

**Parameters:**
- `maxTraits` (optional): Maximum number of traits to compose (default: 5, max: 15)
- `minConfidence` (optional): Minimum confidence threshold (default: 0.5)

---

### 4. POST `/design` - CSS Design System

Generate design systems and CSS using the CSS Engine.

**Request:**
```bash
curl -X POST http://127.0.0.1:8080/design \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "modern",
    "primaryColor": "#3B82F6",
    "components": ["button", "card", "navigation"]
  }'
```

**Response:**
```json
{
  "theme": "modern",
  "css": "/* Generated CSS */\n:root { --primary: #3B82F6; }...",
  "components": ["button", "card", "navigation"],
  "metadata": {
    "generator": "css-engine",
    "timestamp": "2025-10-10T12:00:00.000Z"
  }
}
```

---

### 5. POST `/breakthrough` - Report Breakthrough

Report a significant learning moment or breakthrough.

**Request:**
```bash
curl -X POST http://127.0.0.1:8080/breakthrough \
  -H "Content-Type: application/json" \
  -d '{
    "trigger": "Discovered new optimization pattern",
    "insight": "Caching personality traits reduces load time by 80%",
    "impact": "high"
  }'
```

**Response:**
```json
{
  "success": true,
  "breakthrough": {
    "id": "bt_1234567890",
    "timestamp": "2025-10-10T12:00:00.000Z",
    "trigger": "Discovered new optimization pattern",
    "insight": "Caching personality traits reduces load time by 80%",
    "impact": "high"
  },
  "message": "Breakthrough recorded and integrated into consciousness"
}
```

---

### 6. POST `/reload-consciousness` - Hot Reload Patterns

Reload consciousness patterns without restarting the server.

**Request:**
```bash
curl -X POST http://127.0.0.1:8080/reload-consciousness
```

**Response:**
```json
{
  "success": true,
  "patternsLoaded": 4,
  "patterns": [
    "problem-decomposition",
    "systems-thinking",
    "pattern-evolution-engine",
    "workflow-efficiency"
  ],
  "timestamp": "2025-10-10T12:00:00.000Z"
}
```

---

### 7. GET `/consciousness` - View Consciousness State

Get the current consciousness patterns and state.

**Request:**
```bash
curl http://127.0.0.1:8080/consciousness
```

**Response:**
```json
{
  "initialized": true,
  "patterns": {
    "problem-decomposition": { /* pattern data */ },
    "systems-thinking": { /* pattern data */ },
    "pattern-evolution-engine": { /* pattern data */ },
    "workflow-efficiency": { /* pattern data */ }
  },
  "breakthroughs": 15,
  "enhancements": 100,
  "evolutionScore": 0.87
}
```

---

### 8. GET `/history` - Enhancement History

Get the history of all enhancements.

**Request:**
```bash
# Get last 10 enhancements
curl http://127.0.0.1:8080/history?limit=10

# Get all history
curl http://127.0.0.1:8080/history
```

**Response:**
```json
{
  "history": [
    {
      "timestamp": "2025-10-10T12:00:00.000Z",
      "personality": "pythonista",
      "request": "Write a Python function...",
      "patternsApplied": ["problem-decomposition"],
      "summary": "Generated fibonacci function"
    }
    // ... more history
  ],
  "total": 100,
  "limit": 10
}
```

---

### 9. GET `/analytics` - Usage Analytics

Get usage statistics and analytics.

**Request:**
```bash
curl http://127.0.0.1:8080/analytics
```

**Response:**
```json
{
  "totalRequests": 1523,
  "totalEnhancements": 1200,
  "mostUsedPersonalities": [
    { "name": "pythonista", "count": 234 },
    { "name": "hunter", "count": 189 },
    { "name": "daedalus", "count": 156 }
  ],
  "averageResponseTime": 78,
  "uptime": 86400,
  "cacheHitRate": 0.65
}
```

---

### 10. GET `/traits` - Trait Information

Get information about available traits.

**Request:**
```bash
curl http://127.0.0.1:8080/traits
```

**Response:**
```json
{
  "totalTraits": 211,
  "traits": [
    {
      "name": "code-excellence",
      "description": "Writes clean, efficient code",
      "sources": ["pythonista"],
      "activationTriggers": ["code", "function", "implement"],
      "expertise": 0.95
    }
    // ... 210 more traits
  ]
}
```

---

### 11. WebSocket `/ws` - Real-time Updates

Connect via WebSocket for live updates on enhancements, breakthroughs, and system events.

**JavaScript Example:**
```javascript
const ws = new WebSocket('ws://127.0.0.1:8080/ws');

ws.onopen = () => {
  console.log('Connected to Nexus');
  
  // Subscribe to events
  ws.send(JSON.stringify({
    type: 'subscribe',
    events: ['enhancement', 'breakthrough', 'status']
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Event:', data);
};
```

**Events:**
- `enhancement` - New enhancement performed
- `breakthrough` - New breakthrough recorded
- `status` - System status changes
- `pattern-update` - Consciousness pattern updated

---

## 🎯 Common Use Cases

### Use Case 1: Code Generation

```bash
curl -X POST http://127.0.0.1:8080/enhance \
  -H "Content-Type: application/json" \
  -d '{
    "personalityName": "pythonista",
    "request": "Create a REST API with FastAPI"
  }'
```

### Use Case 2: System Design

```bash
curl -X POST http://127.0.0.1:8080/enhance \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "COMPOSE",
    "request": "Design a scalable microservices architecture",
    "maxTraits": 10
  }'
```

### Use Case 3: Code Review

```bash
curl -X POST http://127.0.0.1:8080/enhance \
  -H "Content-Type: application/json" \
  -d '{
    "personalityName": "hunter",
    "request": "Review this code for optimization: [code here]"
  }'
```

### Use Case 4: Documentation

```bash
curl -X POST http://127.0.0.1:8080/enhance \
  -H "Content-Type: application/json" \
  -d '{
    "personalityName": "sage",
    "request": "Write comprehensive API documentation"
  }'
```

---

## 🛠️ Error Handling

**Common Errors:**

### 404 - Personality Not Found
```json
{
  "error": "Personality not found",
  "personality": "unknown_name",
  "availablePersonalities": ["pythonista", "hunter", "..."]
}
```

### 400 - Invalid Request
```json
{
  "error": "Invalid request",
  "message": "Request field is required",
  "received": {}
}
```

### 500 - Server Error
```json
{
  "error": "Internal server error",
  "message": "Failed to process request",
  "timestamp": "2025-10-10T12:00:00.000Z"
}
```

---

## 💡 Tips & Best Practices

1. **Use AUTO mode** when unsure which personality to choose
2. **Use COMPOSE mode** for complex, multi-domain tasks
3. **Specify maxTraits** in COMPOSE mode for better control
4. **Monitor /analytics** to understand usage patterns
5. **Use WebSocket** for real-time monitoring
6. **Check /status** regularly for health monitoring
7. **Review /history** to learn from past enhancements

---

## 📚 Additional Resources

- See `SETUP_COMPLETE.md` for installation details
- See `README.md` for system overview
- See `test-nexus.sh` for automated testing
- See `start-nexus.sh` for startup options

---

**NEXUS-4.5 - Strategic Intelligence Runtime**  
*Ready for production use!* 🚀
