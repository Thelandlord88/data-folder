# NEXUS v1.0 - Installation Guide

## Quick Install (3 commands)

```bash
# 1. Install dependencies
npm install

# 2. Start NEXUS
npm start

# 3. Test it's working
curl http://localhost:8080/status
```

That's it! 🎉

---

## Detailed Installation

### Prerequisites

- **Node.js v18+** - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Port 8080** available

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- `ws` - WebSocket support

### Step 2: Start NEXUS

**Option A: Using npm script**
```bash
npm start
```

**Option B: Using startup script**
```bash
./start-nexus.sh
```

**Option C: Direct command**
```bash
node nexus/nexus-runtime.mjs
```

### Step 3: Verify Installation

```bash
# Check status
curl http://localhost:8080/status

# Expected output:
# {
#   "initialized": true,
#   "port": 8080,
#   "consciousness": ["operational", "active"],
#   ...
# }
```

### Step 4: Test a Personality

```bash
curl -X POST http://localhost:8080/enhance \
  -H "Content-Type: application/json" \
  -d '{
    "personalityName": "daedalus",
    "request": "Test request"
  }'
```

---

## Platform-Specific Notes

### Windows
```cmd
npm install
npm start
```

### macOS/Linux
```bash
npm install
./start-nexus.sh
```

### Docker
```bash
docker build -t nexus:1.0 .
docker run -p 8080:8080 nexus:1.0
```

---

## Troubleshooting

### Port 8080 already in use
```bash
# Find what's using it
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Kill the process or change NEXUS port in nexus-runtime.mjs
```

### Module not found errors
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Permission denied on start-nexus.sh
```bash
chmod +x start-nexus.sh
```

---

## Next Steps

1. ✅ Read [README.md](./README.md) for full documentation
2. ✅ Check [docs/](./docs/) for architecture details
3. ✅ Run tests: `npm test`
4. ✅ Try different personalities (see README for list)

---

**Installation complete!** 🚀
