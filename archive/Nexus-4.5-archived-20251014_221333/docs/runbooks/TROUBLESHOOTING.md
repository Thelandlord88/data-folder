# NEXUS Troubleshooting Runbook

Comprehensive troubleshooting guide for diagnosing and resolving NEXUS-4.5 runtime issues.

---

## 🔧 Quick Diagnostic Script

Run the automated troubleshooting script first:

```bash
cd /workspaces/data-folder/Nexus-4.5
./troubleshoot.sh
```

This script checks:
- Shell compatibility
- Required dependencies (curl, jq)
- Network connectivity
- Port availability
- NEXUS service status (foreground & background)
- Health check script
- System resources
- File permissions
- Environment variables
- Common issues

---

## 🚨 Common Issues & Solutions

### 1. NEXUS Won't Start

**Symptoms:**
- Process exits immediately
- Error in logs
- Port binding fails

**Diagnostic Steps:**

```bash
# Check if dependencies are installed
npm install

# Verify TypeScript compilation
npm run type-check

# Check for port conflicts
lsof -i :8080
ss -tulpn | grep 8080

# Review startup logs
tail -n 50 logs/nexus.log
```

**Solutions:**

**Missing Dependencies:**
```bash
npm install
```

**Port Already in Use:**
```bash
# Find and kill conflicting process
kill $(lsof -ti :8080)

# Or use specific PID
lsof -i :8080  # Note the PID
kill <PID>

# Restart NEXUS
./start-nexus.sh --background
```

**Permission Issues:**
```bash
chmod +x start-nexus.sh
chmod +x troubleshoot.sh
chmod +x health-check.sh
```

---

### 2. Background Process Not Detected

**Symptoms:**
- `troubleshoot.sh` reports "NEXUS not found"
- But you started it with `--background`
- Port 8080 responds to curl

**Diagnostic Steps:**

```bash
# Check PID file exists
ls -l logs/nexus.pid

# Verify process is running
ps -p $(cat logs/nexus.pid)

# Check port is responding
curl http://127.0.0.1:8080/status
```

**Solutions:**

**Stale PID File:**
```bash
# Remove stale PID
rm logs/nexus.pid

# Restart
./start-nexus.sh --background
```

**PID File Missing:**
- Process may have crashed
- Check logs: `tail -n 100 logs/nexus.log`
- Restart with background flag

---

### 3. Performance Degradation

**Symptoms:**
- Slow API responses
- High memory usage
- CPU spikes

**Diagnostic Steps:**

```bash
# Check memory usage
curl http://127.0.0.1:8080/status | jq '.loaderHealth.memoryUsageMB'

# Check cache hit rate
curl http://127.0.0.1:8080/status | jq '.performanceCache.hitRate'

# Review profiler data
curl http://127.0.0.1:8080/profiler | jq
```

**Solutions:**

**Low Cache Hit Rate:**
- Cache is cold (< 70% hit rate)
- Let it warm up with traffic
- Consider increasing cache size in `src/performance-cache.ts`

**High Memory:**
```bash
# Check if within threshold (100MB default)
curl http://127.0.0.1:8080/status | jq '.systemHealth.thresholds.maxMemoryMB'

# If excessive, restart
kill $(cat logs/nexus.pid)
rm logs/nexus.pid
./start-nexus.sh --background
```

**Slow Endpoints:**
- Review profiler: `curl http://127.0.0.1:8080/profiler`
- Check for slow operations (>100ms threshold)
- Consider rate limiting if under load

---

### 4. WebSocket Connection Issues

**Symptoms:**
- Dashboard not receiving live updates
- WebSocket connection fails

**Diagnostic Steps:**

```bash
# Check WebSocket connections
curl http://127.0.0.1:8080/status | jq '.systemHealth.wsConnections'

# Test WebSocket manually (requires wscat)
wscat -c ws://127.0.0.1:8080/ws
```

**Solutions:**

**Firewall Blocking:**
- Ensure port 8080 allows WebSocket upgrades
- Check reverse proxy configuration (if any)

**Too Many Connections:**
- Monitor active connections
- Implement connection limits if needed

---

### 5. Personality Loading Failures

**Symptoms:**
- `/status` shows fewer than 45 personalities
- Circuit breaker in OPEN state
- Errors in logs about profile loading

**Diagnostic Steps:**

```bash
# Check personality count
curl http://127.0.0.1:8080/status | jq '.personalitySystem.totalPersonalities'

# Check circuit breaker state
curl http://127.0.0.1:8080/status | jq '.personalitySystem.circuitBreakerState'

# Review loader health
curl http://127.0.0.1:8080/status | jq '.loaderHealth'
```

**Solutions:**

**Circuit Breaker Open:**
```bash
# Wait for reset timeout (60 seconds default)
# Or restart to force reload
kill $(cat logs/nexus.pid)
rm logs/nexus.pid
./start-nexus.sh --background
```

**Corrupted Profile Files:**
```bash
# Validate JSON syntax of profiles
for file in profiles/*.json; do
  echo "Checking $file..."
  jq empty "$file" || echo "❌ Invalid JSON in $file"
done
```

**Missing Files:**
```bash
# Ensure all 45 personalities exist
ls -1 profiles/*.json | wc -l
# Should output: 45
```

---

### 6. API Endpoint Errors

**Symptoms:**
- 404 Not Found
- 500 Internal Server Error
- Timeout

**Diagnostic Steps:**

```bash
# Test /status endpoint
curl -v http://127.0.0.1:8080/status

# Test /enhance endpoint
curl -X POST http://127.0.0.1:8080/enhance \
  -H "Content-Type: application/json" \
  -d '{"personalityName":"daedalus","request":"test"}'

# Check logs for errors
tail -f logs/nexus.log | grep -i error
```

**Solutions:**

**404 Errors:**
- Verify endpoint path is correct
- Review API documentation: `docs/guides/API_GUIDE.md`

**500 Errors:**
- Check logs immediately: `tail -n 50 logs/nexus.log`
- Look for stack traces
- Validate request payload matches schema

**Timeouts:**
- Increase client timeout (default 30s may be too short for COMPOSE mode)
- Check for blocking operations in logs
- Review profiler for slow operations

---

## 📊 Monitoring & Health Checks

### Regular Health Checks

**Basic Health:**
```bash
curl http://127.0.0.1:8080/status
```

**Detailed Analytics:**
```bash
curl http://127.0.0.1:8080/analytics | jq
```

**Performance Profiler:**
```bash
curl http://127.0.0.1:8080/profiler | jq
```

### Key Metrics to Monitor

| Metric | Endpoint | Threshold | Action |
|--------|----------|-----------|--------|
| Memory Usage | `/status` → `loaderHealth.memoryUsageMB` | < 100 MB | Restart if exceeded |
| Cache Hit Rate | `/status` → `performanceCache.hitRate` | > 70% | Investigate if lower |
| Circuit Breaker | `/status` → `personalitySystem.circuitBreakerState` | CLOSED | Restart if OPEN persists |
| Personality Count | `/status` → `personalitySystem.totalPersonalities` | 45 | Investigate if lower |
| WebSocket Connections | `/status` → `systemHealth.wsConnections` | < 100 | Monitor for leaks |

---

## 🔄 Recovery Procedures

### Graceful Restart

```bash
cd /workspaces/data-folder/Nexus-4.5

# Stop current process
if [ -f logs/nexus.pid ]; then
  kill $(cat logs/nexus.pid)
  rm logs/nexus.pid
fi

# Wait for clean shutdown
sleep 3

# Verify port is free
lsof -i :8080

# Restart
./start-nexus.sh --background

# Verify startup
sleep 2
curl http://127.0.0.1:8080/status
```

### Force Restart (Last Resort)

```bash
# Kill all NEXUS processes
pkill -9 -f nexus-runtime

# Clean up PID file
rm -f logs/nexus.pid

# Wait for port to clear
sleep 5

# Restart
./start-nexus.sh --background
```

### Reset Consciousness (Reload Patterns)

```bash
curl -X POST http://127.0.0.1:8080/reload-consciousness \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## 📝 Log Analysis

### Finding Errors

```bash
# Recent errors
tail -n 500 logs/nexus.log | grep -i error

# Error patterns
grep "❌" logs/nexus.log

# Stack traces
grep -A 10 "Error:" logs/nexus.log
```

### Performance Analysis

```bash
# Slow operations
grep "SLOW:" logs/nexus.log

# Cache statistics
grep "Cache" logs/nexus.log

# Profiler warnings
grep "⏱️" logs/nexus.log
```

### Startup Issues

```bash
# View last startup sequence
tail -n 200 logs/nexus.log | grep -E "🧠|✅|❌|⚠️"
```

---

## 🐛 Debug Mode

Enable verbose logging by setting environment variable:

```bash
export DEBUG=nexus:*
./start-nexus.sh --background
```

Or modify runtime directly (temporary):
```typescript
// In nexus-runtime.v2.ts, add at top:
const DEBUG = true;
```

---

## 📞 Escalation Path

If troubleshooting steps don't resolve the issue:

1. ✅ Run `./troubleshoot.sh` and save output
2. ✅ Collect last 500 lines of logs: `tail -n 500 logs/nexus.log > debug.log`
3. ✅ Export system status: `curl http://127.0.0.1:8080/status > status.json`
4. ✅ Note exact steps to reproduce
5. ✅ Document environment (OS, Node version, etc.)

**Include in report:**
- Troubleshoot script output
- Log excerpt
- Status JSON
- Steps to reproduce
- Environment details

---

## 🔐 Security Checklist

Before exposing NEXUS externally:

- [ ] Change default port if needed
- [ ] Configure firewall rules
- [ ] Enable authentication (if implementing)
- [ ] Use HTTPS/WSS in production
- [ ] Restrict CORS origins
- [ ] Review log verbosity (don't log sensitive data)
- [ ] Set appropriate file permissions
- [ ] Configure rate limiting
- [ ] Monitor for unusual traffic patterns

---

**Last Updated:** 2025-10-11  
**Owner:** Guardian + Hunter  
**Status:** ✅ Sprint 1 Deliverable
