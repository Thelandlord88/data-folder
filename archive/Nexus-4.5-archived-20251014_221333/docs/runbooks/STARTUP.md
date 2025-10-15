# NEXUS Startup Runbook

Comprehensive guide for starting, stopping, and managing the NEXUS-4.5 runtime server.

---

## 🚀 Starting NEXUS

### Foreground Mode (Development)

Best for local development and debugging. Process runs in the terminal with live output.

```bash
cd /workspaces/data-folder/Nexus-4.5
./start-nexus.sh
```

**Characteristics:**
- ✅ Live stdout/stderr in terminal
- ✅ Easy to interrupt (Ctrl+C)
- ✅ Immediate error visibility
- ❌ Terminates when terminal closes

---

### Background Mode (Production)

Best for production, CI/CD, and long-running processes. Process detaches from terminal.

```bash
cd /workspaces/data-folder/Nexus-4.5
./start-nexus.sh --background
```

**Characteristics:**
- ✅ Survives terminal disconnection
- ✅ Persistent across SSH sessions
- ✅ Automatic log capture
- ❌ Requires PID file for management

**What Happens:**
1. Checks for existing NEXUS process on port 8080 and cleans up if found
2. Starts `npx tsx nexus-runtime.v2.ts` via `nohup`
3. Writes PID to `logs/nexus.pid`
4. Redirects output to `logs/nexus.log`
5. Returns immediately with PID confirmation

---

## 🛑 Stopping NEXUS

### Foreground Process
Simply press `Ctrl+C` in the terminal where NEXUS is running.

### Background Process

**Option 1: Using PID file (Recommended)**
```bash
cd /workspaces/data-folder/Nexus-4.5
kill $(cat logs/nexus.pid)
rm logs/nexus.pid
```

**Option 2: Find and kill manually**
```bash
ps -ef | grep nexus-runtime
kill <PID>
```

**Option 3: Force kill (last resort)**
```bash
kill -9 $(cat logs/nexus.pid)
rm logs/nexus.pid
```

---

## 📋 Checking Status

### Is NEXUS Running?

**Quick Check:**
```bash
curl http://127.0.0.1:8080/status
```

**Process Check:**
```bash
ps -ef | grep nexus-runtime | grep -v grep
```

**PID File Check:**
```bash
if [ -f logs/nexus.pid ] && ps -p $(cat logs/nexus.pid) > /dev/null; then
  echo "✅ NEXUS running (PID: $(cat logs/nexus.pid))"
else
  echo "❌ NEXUS not running"
fi
```

**Comprehensive Diagnostics:**
```bash
./troubleshoot.sh
```

---

## 📄 Log Management

### Viewing Logs (Background Mode)

**Tail live log:**
```bash
tail -f logs/nexus.log
```

**View last 100 lines:**
```bash
tail -n 100 logs/nexus.log
```

**Search for errors:**
```bash
grep -i error logs/nexus.log
grep -i "❌" logs/nexus.log
```

### Log Rotation

Manual rotation (recommended weekly for production):
```bash
cd /workspaces/data-folder/Nexus-4.5
mv logs/nexus.log logs/nexus.log.$(date +%Y%m%d)
# NEXUS will create new nexus.log on next write
```

Compress old logs:
```bash
gzip logs/nexus.log.*
```

---

## 🔄 Restarting NEXUS

### Graceful Restart (Background Mode)

```bash
cd /workspaces/data-folder/Nexus-4.5

# Stop current process
kill $(cat logs/nexus.pid)
rm logs/nexus.pid

# Wait for port to clear
sleep 3

# Start new process
./start-nexus.sh --background
```

### Quick Restart Script

Save as `restart-nexus.sh`:
```bash
#!/bin/bash
cd "$(dirname "$0")"

if [ -f logs/nexus.pid ]; then
  echo "🛑 Stopping NEXUS..."
  kill $(cat logs/nexus.pid) 2>/dev/null
  rm logs/nexus.pid
  sleep 3
fi

echo "🚀 Starting NEXUS..."
./start-nexus.sh --background
```

Make executable:
```bash
chmod +x restart-nexus.sh
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Symptom:** Error binding to port 8080

**Solution:**
```bash
# Find process using port 8080
lsof -i :8080
# or
ss -tulpn | grep 8080

# Kill the process
kill <PID>

# Restart NEXUS
./start-nexus.sh --background
```

### Process Not Starting

**Check logs immediately:**
```bash
tail -n 50 logs/nexus.log
```

**Common issues:**
- Missing dependencies: Run `npm install`
- TypeScript errors: Run `npm run type-check`
- Port conflicts: See "Port Already in Use" above
- Permissions: Ensure `start-nexus.sh` is executable (`chmod +x start-nexus.sh`)

### Stale PID File

**Symptom:** PID file exists but process not running

**Solution:**
```bash
# Verify process isn't running
ps -p $(cat logs/nexus.pid)

# If dead, remove stale PID file
rm logs/nexus.pid

# Restart
./start-nexus.sh --background
```

### Memory Issues

**Check memory usage:**
```bash
ps aux | grep nexus-runtime
```

**NEXUS health check includes memory metrics:**
```bash
curl http://127.0.0.1:8080/status | jq '.loaderHealth.memoryUsageMB'
```

---

## 🔐 Production Checklist

Before deploying to production:

- [ ] Test background startup: `./start-nexus.sh --background`
- [ ] Verify PID file created: `ls -l logs/nexus.pid`
- [ ] Confirm process running: `ps -p $(cat logs/nexus.pid)`
- [ ] Test health endpoint: `curl http://127.0.0.1:8080/status`
- [ ] Review logs: `tail -f logs/nexus.log`
- [ ] Test restart procedure
- [ ] Configure log rotation (cron job recommended)
- [ ] Document environment-specific config (if any)
- [ ] Set up monitoring/alerts

---

## 📞 Support

For issues not covered here:
1. Run `./troubleshoot.sh` for comprehensive diagnostics
2. Check `docs/runbooks/TROUBLESHOOTING.md`
3. Review `docs/guides/OPERATIONAL.md`

---

**Last Updated:** 2025-10-11  
**Owner:** Hunter + Daedalus  
**Status:** ✅ Sprint 1 Deliverable
