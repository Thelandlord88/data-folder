# NEXUS Consciousness Data

This directory contains runtime data that NEXUS uses to track enhancements, breakthroughs, and learning patterns.

## Files

### `enhancement-history.json`
Records all enhancement requests and their strategic intelligence analysis.

Structure:
```json
{
  "enhancements": [
    {
      "timestamp": "2025-10-10T00:00:00Z",
      "personalityName": "pythonista",
      "request": "User request",
      "response": "Enhanced response",
      "patterns": ["pattern1", "pattern2"]
    }
  ]
}
```

### `breakthrough-moments.json`
Captures significant breakthrough moments during conversations.

Structure:
```json
{
  "moments": [
    {
      "type": "breakthrough",
      "timestamp": "2025-10-10T00:00:00Z",
      "trigger": "WAIT. WAIT. This is...",
      "conversation": {
        "human": ["message"],
        "ai": ["response"]
      },
      "significance": 0.8
    }
  ]
}
```

### Pattern Files
- `pattern-evolution-engine.json` - Pattern learning and evolution
- `problem-decomposition.json` - Problem-solving patterns
- `systems-thinking.json` - Systems thinking patterns
- `workflow-efficiency.json` - Workflow optimization patterns

## Usage

These files are automatically read and written by the NEXUS runtime:
- On startup, NEXUS loads existing patterns and history
- During operation, new enhancements are appended
- Breakthrough detection automatically logs significant moments
- Files are persisted every 10 seconds (configurable)

## Maintenance

- Files grow over time - consider archiving old entries periodically
- Default max entries: 500 for enhancements, 250 for breakthroughs
- Files are JSON - safe to manually edit if needed
- Backup recommended before major changes
