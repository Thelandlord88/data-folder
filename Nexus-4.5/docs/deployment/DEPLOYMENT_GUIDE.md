# NEXUS Health Check - Complete Deployment Guide

Production-ready monitoring and alerting setup for NEXUS.

---

## 🚀 Quick Start

### One-Command Deployment

```bash
cd /workspaces/data-folder/Nexus-4.5
./deploy-health-check.sh
```

This will:
- ✅ Install health check to `/usr/local/bin/nexus-health`
- ✅ Check dependencies (curl, jq)
- ✅ Create helper scripts for monitoring
- ✅ Set up log rotation (optional)
- ✅ Provide cron setup instructions

---

## 📦 Manual Installation

### Step 1: Install the Script

```bash
sudo install -m 0755 health-check.sh /usr/local/bin/nexus-health
```

### Step 2: Verify Dependencies

```bash
# Check if installed
command -v curl && command -v jq

# Install if missing (Ubuntu/Debian)
sudo apt-get install curl jq

# Install if missing (RHEL/CentOS)
sudo yum install curl jq

# Install if missing (macOS)
brew install curl jq
```

### Step 3: Test

```bash
nexus-health
# or with custom URL
NEXUS_URL=http://localhost:8080 nexus-health
```

---

## ⏰ Scheduling Options

### Option 1: Cron (Recommended for most cases)

#### Basic Setup

```bash
crontab -e
```

Add:

```cron
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
MAILTO=you@example.com

# Check every 5 minutes
*/5 * * * * NEXUS_URL=http://127.0.0.1:8080 /usr/local/bin/nexus-health || echo "NEXUS health check failed (exit $?)"
```

#### With Logging

```cron
# Log to file
*/5 * * * * /usr/local/bin/nexus-health >> /var/log/nexus-health.log 2>&1

# Log to syslog
*/5 * * * * /usr/local/bin/nexus-health 2>&1 | logger -t nexus-health
```

#### Log Rotation

Create `/etc/logrotate.d/nexus-health`:

```logrotate
/var/log/nexus-health.log {
  weekly
  rotate 8
  compress
  missingok
  notifempty
  create 0640 root adm
}
```

### Option 2: Systemd Timer (Recommended for systemd systems)

#### Create Service File

`/etc/systemd/system/nexus-health.service`:

```ini
[Unit]
Description=NEXUS health probe
After=network.target

[Service]
Type=oneshot
Environment="NEXUS_URL=http://127.0.0.1:8080"
Environment="MEMORY_THRESHOLD_MB=100"
Environment="ERROR_THRESHOLD_PCT=5"
ExecStart=/usr/local/bin/nexus-health
StandardOutput=journal
StandardError=journal
```

#### Create Timer File

`/etc/systemd/system/nexus-health.timer`:

```ini
[Unit]
Description=Run NEXUS health probe every 5 minutes
After=network.target

[Timer]
OnBootSec=2m
OnUnitActiveSec=5m
Unit=nexus-health.service

[Install]
WantedBy=timers.target
```

#### Enable and Start

```bash
sudo systemctl daemon-reload
sudo systemctl enable nexus-health.timer
sudo systemctl start nexus-health.timer

# Check status
systemctl status nexus-health.timer
systemctl list-timers nexus-health.timer

# View logs
journalctl -u nexus-health.service -f
```

#### Or Use Helper Script

```bash
sudo ./monitoring-helpers/setup-systemd.sh
```

---

## 🚨 Alerting Options

### Option 1: Email Alerts

#### Setup

Requires an MTA (Mail Transfer Agent) like `postfix` or `msmtp`.

**Wrapper script:**

```bash
#!/bin/bash
# monitoring-helpers/monitoring-email.sh

EMAIL_TO="you@example.com"

if ! /usr/local/bin/nexus-health; then
    printf "NEXUS health check failed on %s\n" "$(hostname)" | \
        mail -s "NEXUS ALERT" "$EMAIL_TO"
fi
```

**Cron:**

```cron
*/5 * * * * EMAIL_TO=admin@example.com /path/to/monitoring-email.sh
```

### Option 2: Slack/Discord Webhooks

#### Get Webhook URL

- **Slack:** https://api.slack.com/messaging/webhooks
- **Discord:** Server Settings → Integrations → Webhooks

#### Setup

```bash
#!/bin/bash
# monitoring-helpers/monitoring-webhook.sh

SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

if ! /usr/local/bin/nexus-health; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚨 NEXUS Alert on $(hostname) - Health check failed\"}" \
        "$SLACK_WEBHOOK_URL"
fi
```

**Cron:**

```cron
*/5 * * * * SLACK_WEBHOOK_URL=https://hooks.slack.com/... /path/to/monitoring-webhook.sh
```

### Option 3: PagerDuty

#### Setup

Get your routing key from PagerDuty.

```bash
#!/bin/bash

PD_ROUTING_KEY="your-routing-key-here"

if ! /usr/local/bin/nexus-health; then
    curl -X POST -H 'Content-Type: application/json' \
        -d "{
          \"routing_key\": \"$PD_ROUTING_KEY\",
          \"event_action\": \"trigger\",
          \"payload\": {
            \"summary\": \"NEXUS health check failed on $(hostname)\",
            \"severity\": \"error\",
            \"source\": \"$(hostname)\"
          }
        }" https://events.pagerduty.com/v2/enqueue
fi
```

### Option 4: Healthchecks.io (Dead Man's Switch)

#### Setup

Create a check at https://healthchecks.io and get your check UUID.

```bash
#!/bin/bash
# monitoring-helpers/monitoring-healthchecks.sh

HC_UUID="your-uuid-here"
HC_START="https://hc-ping.com/${HC_UUID}/start"
HC_SUCCESS="https://hc-ping.com/${HC_UUID}"
HC_FAIL="https://hc-ping.com/${HC_UUID}/fail"

# Signal start
curl -fsS "$HC_START" >/dev/null 2>&1 || true

# Run check
if /usr/local/bin/nexus-health; then
    curl -fsS "$HC_SUCCESS" >/dev/null 2>&1 || true
else
    EXIT_CODE=$?
    curl -fsS --data-raw "exit_code=$EXIT_CODE" "$HC_FAIL" >/dev/null 2>&1 || true
    exit $EXIT_CODE
fi
```

**Cron:**

```cron
*/5 * * * * HC_UUID=your-uuid /path/to/monitoring-healthchecks.sh
```

---

## 📊 Monitoring Integration

### Option 1: Prometheus (Node Exporter Textfile Collector)

#### Setup Node Exporter

```bash
# Start with textfile collector
node_exporter --collector.textfile.directory=/var/lib/node_exporter/textfile
```

#### Metrics Exporter Script

```bash
#!/bin/bash
# monitoring-helpers/monitoring-prometheus.sh

METRIC_DIR="/var/lib/node_exporter/textfile"
STATUS=$(curl -fsS http://127.0.0.1:8080/status)

# Parse metrics
INIT=$(echo "$STATUS" | jq -r '.initialized')
PERS=$(echo "$STATUS" | jq -r '.personalitySystem.totalPersonalities')
CB=$(echo "$STATUS" | jq -r '.loaderHealth.circuitBreakerState')
MEM=$(echo "$STATUS" | jq -r '.loaderHealth.memoryUsageMB')
ERRORS=$(echo "$STATUS" | jq -r '.systemHealth.metrics.errorRate')
TRAITS=$(echo "$STATUS" | jq -r '.traitComposition.totalTraits')

# Write metrics
cat > "${METRIC_DIR}/nexus.prom" <<EOF
# HELP nexus_initialized Whether NEXUS is initialized
# TYPE nexus_initialized gauge
nexus_initialized $([ "$INIT" = "true" ] && echo 1 || echo 0)

# HELP nexus_personalities Total personalities
# TYPE nexus_personalities gauge
nexus_personalities ${PERS}

# HELP nexus_circuit_breaker Circuit breaker state (1=CLOSED)
# TYPE nexus_circuit_breaker gauge
nexus_circuit_breaker $([ "$CB" = "CLOSED" ] && echo 1 || echo 0)

# HELP nexus_memory_mb Memory usage in MB
# TYPE nexus_memory_mb gauge
nexus_memory_mb ${MEM}

# HELP nexus_error_rate_percent Error rate percent
# TYPE nexus_error_rate_percent gauge
nexus_error_rate_percent ${ERRORS}

# HELP nexus_traits_total Total traits
# TYPE nexus_traits_total gauge
nexus_traits_total ${TRAITS}

# HELP nexus_last_check_timestamp_seconds Last check time
# TYPE nexus_last_check_timestamp_seconds gauge
nexus_last_check_timestamp_seconds $(date +%s)
EOF
```

**Cron:**

```cron
*/5 * * * * /path/to/monitoring-prometheus.sh
```

#### Prometheus Alerts

`/etc/prometheus/alerts.yml`:

```yaml
groups:
  - name: nexus
    rules:
      - alert: NexusDown
        expr: nexus_initialized == 0
        for: 5m
        annotations:
          summary: "NEXUS is down"
          
      - alert: NexusCircuitBreakerOpen
        expr: nexus_circuit_breaker == 0
        for: 2m
        annotations:
          summary: "NEXUS circuit breaker is open"
          
      - alert: NexusHighMemory
        expr: nexus_memory_mb > 100
        for: 10m
        annotations:
          summary: "NEXUS memory usage high: {{ $value }}MB"
          
      - alert: NexusHighErrorRate
        expr: avg_over_time(nexus_error_rate_percent[5m]) > 5
        for: 10m
        annotations:
          summary: "NEXUS error rate high: {{ $value }}%"
```

### Option 2: Prometheus Pushgateway

```bash
#!/bin/bash

STATUS=$(curl -fsS http://127.0.0.1:8080/status)
MEM=$(echo "$STATUS" | jq -r '.loaderHealth.memoryUsageMB')
ERRORS=$(echo "$STATUS" | jq -r '.systemHealth.metrics.errorRate')

cat <<EOF | curl --data-binary @- http://pushgateway:9091/metrics/job/nexus/instance/$(hostname)
nexus_memory_mb ${MEM}
nexus_error_rate_percent ${ERRORS}
EOF
```

### Option 3: AWS CloudWatch

```bash
#!/bin/bash

STATUS=$(curl -fsS http://127.0.0.1:8080/status)
MEM=$(echo "$STATUS" | jq -r '.loaderHealth.memoryUsageMB')
ERRORS=$(echo "$STATUS" | jq -r '.systemHealth.metrics.errorRate')

aws cloudwatch put-metric-data \
    --namespace "NEXUS" \
    --metric-data \
    "MetricName=MemoryMB,Value=${MEM},Unit=Megabytes" \
    "MetricName=ErrorRate,Value=${ERRORS},Unit=Percent"
```

---

## 🐳 Container Environments

### Docker

#### Option 1: Cron on Host

Monitor Docker container from host:

```cron
*/5 * * * * NEXUS_URL=http://localhost:8080 /usr/local/bin/nexus-health
```

#### Option 2: Sidecar Container

Add to `docker-compose.yml`:

```yaml
services:
  nexus:
    image: nexus:latest
    ports:
      - "8080:8080"
      
  health-checker:
    image: alpine:latest
    command: >
      sh -c "apk add --no-cache curl jq bash &&
             while true; do
               curl -fsS http://nexus:8080/status | jq . || echo 'Health check failed';
               sleep 300;
             done"
    depends_on:
      - nexus
```

### Kubernetes

#### CronJob

`nexus-health-cronjob.yaml`:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: nexus-health-check
spec:
  schedule: "*/5 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: health-check
            image: curlimages/curl:latest
            command:
            - sh
            - -c
            - |
              apk add --no-cache jq
              curl -fsS http://nexus-service:8080/status | jq .
          restartPolicy: OnFailure
```

Apply:

```bash
kubectl apply -f nexus-health-cronjob.yaml
```

### GitHub Codespaces

⚠️ **Important:** Cron won't run when the codespace sleeps!

#### Option 1: GitHub Actions (Recommended)

`.github/workflows/health-check.yml`:

```yaml
name: NEXUS Health Check

on:
  schedule:
    - cron: '*/30 * * * *'  # Every 30 minutes
  workflow_dispatch:  # Manual trigger

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: Check NEXUS Health
        run: |
          STATUS=$(curl -fsS ${{ secrets.NEXUS_URL }}/status)
          echo "Status: $STATUS"
          
          # Check if initialized
          INIT=$(echo "$STATUS" | jq -r '.initialized')
          if [ "$INIT" != "true" ]; then
            echo "::error::NEXUS not initialized"
            exit 1
          fi
```

#### Option 2: External Scheduler

Use services like:
- UptimeRobot (https://uptimerobot.com)
- Pingdom (https://www.pingdom.com)
- StatusCake (https://www.statuscake.com)

These will ping your codespace URL and alert on failures.

---

## 🔧 Configuration

### Environment Variables

All configurable via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXUS_URL` | `http://127.0.0.1:8080` | NEXUS API URL |
| `MEMORY_THRESHOLD_MB` | `100` | Memory threshold in MB |
| `ERROR_THRESHOLD_PCT` | `5` | Error rate threshold % |

### Examples

```bash
# Development
MEMORY_THRESHOLD_MB=200 ERROR_THRESHOLD_PCT=10 nexus-health

# Staging
NEXUS_URL=http://staging:8080 MEMORY_THRESHOLD_MB=150 nexus-health

# Production
NEXUS_URL=https://prod.example.com MEMORY_THRESHOLD_MB=50 ERROR_THRESHOLD_PCT=1 nexus-health
```

---

## 📈 Exit Codes

The script returns specific exit codes for automation:

| Exit Code | Meaning | Action |
|-----------|---------|--------|
| **0** | ✅ All healthy | None |
| **1** | ❌ NEXUS not running or HTTP error | Start NEXUS |
| **2** | ❌ Circuit breaker not CLOSED | Restart NEXUS |
| **3** | ⚠️  Memory usage too high | Monitor/restart |
| **4** | ⚠️  Error rate too high | Investigate |
| **5** | ⚠️  Missing components | Check files |

### Handle Exit Codes in Scripts

```bash
#!/bin/bash

nexus-health
EXIT_CODE=$?

case $EXIT_CODE in
    0) echo "✅ Healthy" ;;
    1) echo "❌ Down"; systemctl restart nexus ;;
    2) echo "❌ Circuit breaker"; systemctl restart nexus ;;
    3) echo "⚠️  High memory" ;;
    4) echo "⚠️  High errors"; tail /var/log/nexus.log ;;
    5) echo "⚠️  Missing components" ;;
esac
```

---

## ✅ Production Checklist

- [ ] Script installed to `/usr/local/bin/nexus-health`
- [ ] Dependencies installed (curl, jq)
- [ ] Cron or systemd timer configured
- [ ] Log rotation set up
- [ ] Alerting configured (email/webhook/PagerDuty)
- [ ] Monitoring integrated (Prometheus/CloudWatch)
- [ ] Tested manually: `nexus-health`
- [ ] Verified exit codes work correctly
- [ ] Documentation shared with team
- [ ] Alerts tested (trigger failure, verify notification)

---

## 🔍 Troubleshooting

### Script not found

```bash
# Check installation
which nexus-health
ls -la /usr/local/bin/nexus-health

# Reinstall
sudo install -m 0755 health-check.sh /usr/local/bin/nexus-health
```

### Cron not running

```bash
# Check cron service
systemctl status cron  # or crond

# Check cron logs
grep CRON /var/log/syslog

# Test cron syntax
crontab -l
```

### Systemd timer not running

```bash
# Check timer status
systemctl status nexus-health.timer
systemctl list-timers

# Check service logs
journalctl -u nexus-health.service -f

# Restart timer
sudo systemctl restart nexus-health.timer
```

### Metrics not appearing in Prometheus

```bash
# Check metrics file exists
ls -la /var/lib/node_exporter/textfile/nexus.prom

# Check file permissions
sudo chmod 644 /var/lib/node_exporter/textfile/nexus.prom

# Check node_exporter config
ps aux | grep node_exporter
```

---

## 📚 Additional Resources

- **Health Check Script:** `health-check.sh`
- **Deployment Script:** `deploy-health-check.sh`
- **Helper Scripts:** `monitoring-helpers/`
- **Usage Guide:** `HEALTH_CHECK_GUIDE.md`
- **Hardening Details:** `HARDENING_COMPLETE.md`

---

## 🎯 Summary

**You now have:**
1. ✅ Production-ready health check script
2. ✅ Multiple scheduling options (cron/systemd)
3. ✅ Multiple alerting options (email/Slack/PagerDuty)
4. ✅ Multiple monitoring options (Prometheus/CloudWatch)
5. ✅ Container support (Docker/Kubernetes)
6. ✅ Complete documentation

**Ready for production!** 🚀

---

**Quick Start:**
```bash
./deploy-health-check.sh
```

**Next:** Choose your scheduling and alerting methods from above.
