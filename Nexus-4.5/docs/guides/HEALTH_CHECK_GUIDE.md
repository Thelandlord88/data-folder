# NEXUS Health Check Guide

Complete guide for the hardened health check script.

---

## 🎯 Quick Start

### Basic Usage

```bash
./health-check.sh
```

**Expected Output (Healthy):**
```
🏥 NEXUS Health Check
====================
✅ NEXUS is running
✅ Initialized: true
✅ Personalities: 45/45
✅ Circuit Breaker: CLOSED (healthy)
✅ Memory: 14.6 MB
✅ Error Rate: 0%
✅ Traits: 211
🎉 Health check complete! All systems healthy.
```

---

## 🔢 Exit Codes

The script returns specific exit codes for automation and monitoring:

| Exit Code | Meaning | Action Required |
|-----------|---------|-----------------|
| **0** | ✅ All healthy | None - system operating normally |
| **1** | ❌ NEXUS not running or HTTP error | Start NEXUS or check network |
| **2** | ❌ Circuit breaker not CLOSED | Check logs, restart NEXUS |
| **3** | ❌ Memory usage too high | Monitor or restart NEXUS |
| **4** | ❌ Error rate too high | Investigate errors in logs |
| **5** | ⚠️ Missing personalities/traits | Check personality files |

---

## ⚙️ Configuration

### Environment Variables

Override defaults with environment variables:

#### `NEXUS_URL`
**Default:** `http://127.0.0.1:8080`  
**Purpose:** NEXUS server URL

**Example:**
```bash
NEXUS_URL="http://192.168.1.100:8080" ./health-check.sh
```

#### `MEMORY_THRESHOLD_MB`
**Default:** `100` MB  
**Purpose:** Maximum acceptable memory usage

**Example:**
```bash
MEMORY_THRESHOLD_MB=50 ./health-check.sh
```

#### `ERROR_THRESHOLD_PCT`
**Default:** `5` %  
**Purpose:** Maximum acceptable error rate percentage

**Example:**
```bash
ERROR_THRESHOLD_PCT=1 ./health-check.sh
```

### Combined Example

```bash
NEXUS_URL="http://prod-nexus:8080" \
MEMORY_THRESHOLD_MB=200 \
ERROR_THRESHOLD_PCT=10 \
./health-check.sh
```

---

## 🔒 Hardening Features

### 1. Strict Error Handling

```bash
set -euo pipefail
```

- **`-e`**: Exit on any error
- **`-u`**: Exit on undefined variables
- **`-o pipefail`**: Exit if any command in pipeline fails

### 2. HTTP Error Detection

```bash
STATUS=$(curl -fsS --max-time 2 "$NEXUS_URL/status") || {
    echo "❌ HTTP error"
    exit 1
}
```

- **`-f`**: Fail on HTTP errors (4xx, 5xx)
- **`-s`**: Silent mode (no progress bar)
- **`-S`**: Show errors even in silent mode
- **`--max-time 2`**: Timeout after 2 seconds

### 3. Missing Field Detection

```bash
INIT=$(echo "$STATUS" | jq -r '.initialized // empty')
if [ -z "$INIT" ]; then
    echo "❌ Missing 'initialized' field"
    exit 1
fi
```

Uses `jq`'s `// empty` to detect missing fields.

### 4. Threshold-Based Exit Codes

```bash
if (( MEM_INT > MEMORY_THRESHOLD_MB )); then
    EXIT_CODE=3
fi
```

Different exit codes for different failure types enable targeted automation.

---

## 🤖 Automation Examples

### Cron Job (Check Every 15 Minutes)

```bash
# Add to crontab: crontab -e
*/15 * * * * /workspaces/data-folder/Nexus-4.5/health-check.sh >> /var/log/nexus-health.log 2>&1
```

### Auto-Restart on Failure

```bash
#!/bin/bash
# auto-restart.sh

if ! /workspaces/data-folder/Nexus-4.5/health-check.sh; then
    echo "Health check failed, restarting NEXUS..."
    pkill -f "tsx.*nexus-runtime"
    sleep 3
    cd /workspaces/data-folder/Nexus-4.5
    ./start-nexus.sh &
fi
```

**Add to cron:**
```bash
*/10 * * * * /path/to/auto-restart.sh >> /var/log/nexus-auto-restart.log 2>&1
```

### CI/CD Integration

```yaml
# .github/workflows/health-check.yml
name: NEXUS Health Check

on:
  schedule:
    - cron: '*/30 * * * *'  # Every 30 minutes

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: Run Health Check
        run: |
          NEXUS_URL="https://production-nexus.example.com" \
          ./health-check.sh
      
      - name: Send Alert on Failure
        if: failure()
        uses: actions/slack-notify@v1
        with:
          message: 'NEXUS health check failed!'
```

### Monitoring with Different Thresholds

```bash
#!/bin/bash
# staging-health-check.sh

# Staging can use more memory
MEMORY_THRESHOLD_MB=200 \
ERROR_THRESHOLD_PCT=10 \
NEXUS_URL="http://staging-nexus:8080" \
./health-check.sh
```

```bash
#!/bin/bash
# production-health-check.sh

# Production should be stricter
MEMORY_THRESHOLD_MB=50 \
ERROR_THRESHOLD_PCT=1 \
NEXUS_URL="http://prod-nexus:8080" \
./health-check.sh
```

---

## 📊 Exit Code Handling

### In Shell Scripts

```bash
#!/bin/bash

./health-check.sh
EXIT_CODE=$?

case $EXIT_CODE in
    0)
        echo "✅ System healthy"
        ;;
    1)
        echo "❌ NEXUS not running - starting..."
        ./start-nexus.sh
        ;;
    2)
        echo "❌ Circuit breaker open - restarting..."
        pkill -f "tsx.*nexus-runtime"
        ./start-nexus.sh
        ;;
    3)
        echo "⚠️  High memory usage - monitoring..."
        # Send alert but don't restart yet
        ;;
    4)
        echo "❌ High error rate - investigating..."
        tail -100 /tmp/nexus.log
        ;;
    5)
        echo "⚠️  Missing components - checking files..."
        ls -la profiles/ | wc -l
        ;;
    *)
        echo "❓ Unknown exit code: $EXIT_CODE"
        ;;
esac
```

### In Python

```python
import subprocess
import sys

result = subprocess.run(
    ['./health-check.sh'],
    capture_output=True,
    text=True
)

exit_codes = {
    0: "healthy",
    1: "not_running",
    2: "circuit_breaker_open",
    3: "high_memory",
    4: "high_error_rate",
    5: "missing_components"
}

status = exit_codes.get(result.returncode, "unknown")
print(f"NEXUS Status: {status}")

if result.returncode != 0:
    print(f"Output: {result.stdout}")
    print(f"Errors: {result.stderr}")
    # Send alert, log to database, etc.
```

---

## 🔍 Debugging

### Verbose Mode

Add debugging output:

```bash
#!/bin/bash
set -x  # Enable trace mode
./health-check.sh
```

### Test Individual Checks

```bash
# Test just the HTTP connection
curl -fsS --max-time 2 http://127.0.0.1:8080/status

# Test JSON parsing
curl -s http://127.0.0.1:8080/status | jq '.initialized'

# Test threshold logic
MEM=15.11
MEM_INT=${MEM%.*}
THRESHOLD=10
(( MEM_INT > THRESHOLD )) && echo "Over threshold" || echo "Under threshold"
```

### Common Issues

#### Issue: "jq: command not found"

**Solution:**
```bash
# Ubuntu/Debian
sudo apt-get install jq

# macOS
brew install jq
```

#### Issue: "curl: (7) Failed to connect"

**Causes:**
- NEXUS not running
- Wrong URL
- Firewall blocking

**Check:**
```bash
# Is NEXUS running?
ps aux | grep "tsx.*nexus-runtime"

# Can we reach the port?
nc -zv 127.0.0.1 8080
```

#### Issue: Exit code always 0

**Cause:** Not capturing exit code properly

**Fix:**
```bash
# Wrong
./health-check.sh
echo $?  # May show 0 for echo, not health-check

# Right
./health-check.sh
EXIT_CODE=$?
echo $EXIT_CODE
```

---

## 📈 Metrics Collection

### Log to InfluxDB

```bash
#!/bin/bash
# collect-metrics.sh

OUTPUT=$(./health-check.sh 2>&1)
EXIT_CODE=$?

# Extract metrics
MEMORY=$(echo "$OUTPUT" | grep "Memory:" | awk '{print $3}')
ERRORS=$(echo "$OUTPUT" | grep "Error Rate:" | awk '{print $4}' | tr -d '%')

# Send to InfluxDB
curl -XPOST 'http://influx:8086/write?db=nexus' --data-binary "
nexus_health,host=server1 exit_code=$EXIT_CODE
nexus_memory,host=server1 usage_mb=$MEMORY
nexus_errors,host=server1 rate_pct=$ERRORS
"
```

### Prometheus Exporter

```bash
#!/bin/bash
# nexus-exporter.sh

./health-check.sh > /dev/null 2>&1
EXIT_CODE=$?

cat > /var/lib/node_exporter/textfile/nexus.prom <<EOF
# HELP nexus_health_status NEXUS health check status (0=healthy, 1-5=problems)
# TYPE nexus_health_status gauge
nexus_health_status $EXIT_CODE

# HELP nexus_up NEXUS is running (1=up, 0=down)
# TYPE nexus_up gauge
nexus_up $( [ $EXIT_CODE -eq 1 ] && echo 0 || echo 1 )
EOF
```

---

## 🎯 Best Practices

### 1. Run Regularly

```bash
# Cron every 5 minutes
*/5 * * * * /path/to/health-check.sh
```

### 2. Set Appropriate Thresholds

- **Development:** Relaxed (200MB, 10% errors)
- **Staging:** Moderate (100MB, 5% errors)  
- **Production:** Strict (50MB, 1% errors)

### 3. Alert on Failures

```bash
./health-check.sh || mail -s "NEXUS Health Check Failed" admin@example.com
```

### 4. Keep Logs

```bash
./health-check.sh 2>&1 | tee -a /var/log/nexus-health.log
```

### 5. Test Thresholds

```bash
# Test with artificially low thresholds
MEMORY_THRESHOLD_MB=1 ./health-check.sh  # Should fail with exit 3
ERROR_THRESHOLD_PCT=0 ./health-check.sh   # Might fail with exit 4
```

---

## 📝 Example: Complete Monitoring Setup

```bash
#!/bin/bash
# /usr/local/bin/nexus-monitor.sh

LOG_FILE="/var/log/nexus-monitor.log"
ALERT_EMAIL="admin@example.com"
NEXUS_DIR="/workspaces/data-folder/Nexus-4.5"

cd "$NEXUS_DIR"

# Run health check
./health-check.sh 2>&1 | tee -a "$LOG_FILE"
EXIT_CODE=${PIPESTATUS[0]}

# Handle different exit codes
case $EXIT_CODE in
    0)
        # All good, do nothing
        ;;
    1)
        echo "NEXUS not running - attempting restart..." | tee -a "$LOG_FILE"
        ./start-nexus.sh &
        echo "NEXUS down, restarted" | mail -s "NEXUS Alert" "$ALERT_EMAIL"
        ;;
    2)
        echo "Circuit breaker open - restarting..." | tee -a "$LOG_FILE"
        pkill -f "tsx.*nexus-runtime"
        sleep 3
        ./start-nexus.sh &
        echo "Circuit breaker triggered restart" | mail -s "NEXUS Alert" "$ALERT_EMAIL"
        ;;
    3|4|5)
        echo "Warning condition (code $EXIT_CODE)" | tee -a "$LOG_FILE"
        echo "Health check exit $EXIT_CODE" | mail -s "NEXUS Warning" "$ALERT_EMAIL"
        ;;
esac

# Log timestamp
echo "Check completed at $(date)" >> "$LOG_FILE"
```

**Add to cron:**
```bash
*/10 * * * * /usr/local/bin/nexus-monitor.sh
```

---

## ✅ Summary

The hardened health check script provides:

- ✅ Strict error handling (`set -euo pipefail`)
- ✅ HTTP error detection (`curl -fsS`)
- ✅ Missing field validation (`jq // empty`)
- ✅ Configurable thresholds (env vars)
- ✅ Specific exit codes for automation
- ✅ Production-ready monitoring

**Use it for:**
- Daily health checks
- Automated monitoring
- CI/CD pipelines  
- Auto-restart scripts
- Metrics collection
- Alerting systems

---

**Created:** October 10, 2025  
**Script:** `health-check.sh`  
**Status:** Production Ready ✅
