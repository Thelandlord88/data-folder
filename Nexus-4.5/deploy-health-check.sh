#!/bin/bash
# NEXUS Health Check - Production Deployment Script
# 
# This script installs the health check to /usr/local/bin and sets up monitoring

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_PATH="/usr/local/bin/nexus-health"
LOG_DIR="/var/log"
LOGROTATE_DIR="/etc/logrotate.d"

echo "🚀 NEXUS Health Check - Production Deployment"
echo "=============================================="
echo ""

# Check if running as root for system-wide install
if [ "$EUID" -ne 0 ]; then
    echo "⚠️  Not running as root. Will use sudo for system installs."
    SUDO="sudo"
else
    SUDO=""
fi

# 1. Install the script
echo "📦 Step 1: Installing health check script..."
$SUDO install -m 0755 "$SCRIPT_DIR/health-check.sh" "$INSTALL_PATH"
echo "✅ Installed to: $INSTALL_PATH"
echo ""

# 2. Check dependencies
echo "🔍 Step 2: Checking dependencies..."
MISSING_DEPS=()

if ! command -v curl &> /dev/null; then
    MISSING_DEPS+=("curl")
fi

if ! command -v jq &> /dev/null; then
    MISSING_DEPS+=("jq")
fi

if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
    echo "⚠️  Missing dependencies: ${MISSING_DEPS[*]}"
    echo ""
    echo "To install:"
    echo "  Ubuntu/Debian: sudo apt-get install ${MISSING_DEPS[*]}"
    echo "  RHEL/CentOS:   sudo yum install ${MISSING_DEPS[*]}"
    echo "  macOS:         brew install ${MISSING_DEPS[*]}"
    echo ""
    read -p "Install now? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if command -v apt-get &> /dev/null; then
            $SUDO apt-get update && $SUDO apt-get install -y "${MISSING_DEPS[@]}"
        elif command -v yum &> /dev/null; then
            $SUDO yum install -y "${MISSING_DEPS[@]}"
        elif command -v brew &> /dev/null; then
            brew install "${MISSING_DEPS[@]}"
        fi
    fi
else
    echo "✅ All dependencies installed (curl, jq)"
fi
echo ""

# 3. Test the installation
echo "🧪 Step 3: Testing installation..."
if "$INSTALL_PATH" > /dev/null 2>&1; then
    echo "✅ Health check working"
else
    EXIT_CODE=$?
    if [ $EXIT_CODE -eq 1 ]; then
        echo "⚠️  NEXUS not running (exit code 1) - this is expected if NEXUS is stopped"
    else
        echo "✅ Health check executable (exit code: $EXIT_CODE)"
    fi
fi
echo ""

# 4. Set up log rotation (optional)
echo "📝 Step 4: Setting up log rotation (optional)..."
read -p "Set up log rotation for /var/log/nexus-health.log? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cat | $SUDO tee "$LOGROTATE_DIR/nexus-health" > /dev/null <<'EOF'
/var/log/nexus-health.log {
  weekly
  rotate 8
  compress
  missingok
  notifempty
  create 0640 root adm
}
EOF
    echo "✅ Log rotation configured"
    $SUDO touch "$LOG_DIR/nexus-health.log"
    $SUDO chmod 0640 "$LOG_DIR/nexus-health.log"
fi
echo ""

# 5. Show cron setup instructions
echo "⏰ Step 5: Cron Setup Instructions"
echo "===================================="
echo ""
echo "To run health checks every 5 minutes, add to your crontab:"
echo ""
echo "  crontab -e"
echo ""
echo "Then add:"
echo ""
cat <<'EOF'
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
MAILTO=you@example.com

# Check every 5 minutes
*/5 * * * * NEXUS_URL=http://127.0.0.1:8080 /usr/local/bin/nexus-health || echo "NEXUS health check failed (exit $?)"

# Or with logging:
# */5 * * * * /usr/local/bin/nexus-health >> /var/log/nexus-health.log 2>&1
EOF
echo ""

# 6. Show monitoring setup options
echo "📊 Step 6: Monitoring Options"
echo "=============================="
echo ""
echo "Choose your monitoring setup:"
echo ""
echo "A. Prometheus (Node Exporter textfile)"
echo "   - Create metrics file in /var/lib/node_exporter/textfile/"
echo "   - See: monitoring-prometheus.sh"
echo ""
echo "B. Slack/Discord Webhooks"
echo "   - Get notified immediately on failures"
echo "   - See: monitoring-webhook.sh"
echo ""
echo "C. Email Alerts"
echo "   - Uses system mail (requires MTA)"
echo "   - See: monitoring-email.sh"
echo ""
echo "D. Healthchecks.io"
echo "   - Dead man's switch monitoring"
echo "   - See: monitoring-healthchecks.sh"
echo ""
echo "E. Systemd Timer (instead of cron)"
echo "   - Native systemd integration"
echo "   - See: setup-systemd.sh"
echo ""

# 7. Create helper scripts
echo "📁 Step 7: Creating helper scripts..."

# Create monitoring helper scripts directory
HELPERS_DIR="$SCRIPT_DIR/monitoring-helpers"
mkdir -p "$HELPERS_DIR"

cat > "$HELPERS_DIR/cron-wrapper.sh" <<'EOF'
#!/bin/bash
# Cron wrapper for NEXUS health check with error handling

HEALTH_CHECK="/usr/local/bin/nexus-health"
LOG_FILE="/var/log/nexus-health.log"

# Run health check and capture exit code
if ! "$HEALTH_CHECK" >> "$LOG_FILE" 2>&1; then
    EXIT_CODE=$?
    echo "$(date): Health check failed with exit code $EXIT_CODE" >> "$LOG_FILE"
    exit $EXIT_CODE
fi
EOF

chmod +x "$HELPERS_DIR/cron-wrapper.sh"
echo "✅ Created: $HELPERS_DIR/cron-wrapper.sh"

cat > "$HELPERS_DIR/monitoring-prometheus.sh" <<'EOF'
#!/bin/bash
# Prometheus metrics exporter for NEXUS health check

set -euo pipefail

METRIC_DIR="${METRIC_DIR:-/var/lib/node_exporter/textfile}"
NEXUS_URL="${NEXUS_URL:-http://127.0.0.1:8080}"

# Get status
STATUS=$(curl -fsS --max-time 2 "$NEXUS_URL/status" 2>/dev/null) || exit 1

# Parse fields
INIT=$(echo "$STATUS" | jq -r '.initialized // false')
PERS=$(echo "$STATUS" | jq -r '.personalitySystem.totalPersonalities // 0')
CB=$(echo "$STATUS" | jq -r '.loaderHealth.circuitBreakerState // ""')
MEM=$(echo "$STATUS" | jq -r '.loaderHealth.memoryUsageMB // 0')
ERRORS=$(echo "$STATUS" | jq -r '.systemHealth.metrics.errorRate // 0')
TRAITS=$(echo "$STATUS" | jq -r '.traitComposition.totalTraits // 0')

# Write metrics to temp file
TMP_FILE="$(mktemp)"
cat > "$TMP_FILE" <<METRICS
# HELP nexus_initialized Whether NEXUS is initialized (1/0)
# TYPE nexus_initialized gauge
nexus_initialized $([ "$INIT" = "true" ] && echo 1 || echo 0)

# HELP nexus_personalities Total personalities loaded
# TYPE nexus_personalities gauge
nexus_personalities ${PERS}

# HELP nexus_circuit_breaker Circuit breaker state (1=CLOSED, 0=other)
# TYPE nexus_circuit_breaker gauge
nexus_circuit_breaker $([ "$CB" = "CLOSED" ] && echo 1 || echo 0)

# HELP nexus_memory_mb Memory usage in MB
# TYPE nexus_memory_mb gauge
nexus_memory_mb ${MEM}

# HELP nexus_error_rate_percent Error rate in percent
# TYPE nexus_error_rate_percent gauge
nexus_error_rate_percent ${ERRORS}

# HELP nexus_traits_total Total traits indexed
# TYPE nexus_traits_total gauge
nexus_traits_total ${TRAITS}

# HELP nexus_last_check_timestamp_seconds Last check timestamp
# TYPE nexus_last_check_timestamp_seconds gauge
nexus_last_check_timestamp_seconds $(date +%s)
METRICS

# Atomic move
mkdir -p "$METRIC_DIR"
mv "$TMP_FILE" "$METRIC_DIR/nexus.prom"

echo "✅ Metrics written to $METRIC_DIR/nexus.prom"
EOF

chmod +x "$HELPERS_DIR/monitoring-prometheus.sh"
echo "✅ Created: $HELPERS_DIR/monitoring-prometheus.sh"

cat > "$HELPERS_DIR/monitoring-webhook.sh" <<'EOF'
#!/bin/bash
# Slack/Discord webhook notifier for NEXUS health check

set -euo pipefail

WEBHOOK_URL="${SLACK_WEBHOOK_URL:-${DISCORD_WEBHOOK_URL:-}}"

if [ -z "$WEBHOOK_URL" ]; then
    echo "Error: Set SLACK_WEBHOOK_URL or DISCORD_WEBHOOK_URL"
    exit 1
fi

notify_webhook() {
    local text="$1"
    curl -s -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"$text\"}" \
        "$WEBHOOK_URL" > /dev/null
}

# Run health check
if ! /usr/local/bin/nexus-health; then
    EXIT_CODE=$?
    HOSTNAME=$(hostname)
    notify_webhook "🚨 NEXUS Alert on $HOSTNAME - Health check failed (exit code: $EXIT_CODE)"
    exit $EXIT_CODE
fi
EOF

chmod +x "$HELPERS_DIR/monitoring-webhook.sh"
echo "✅ Created: $HELPERS_DIR/monitoring-webhook.sh"

cat > "$HELPERS_DIR/monitoring-email.sh" <<'EOF'
#!/bin/bash
# Email notifier for NEXUS health check failures

set -euo pipefail

EMAIL_TO="${EMAIL_TO:-root@localhost}"
HOSTNAME=$(hostname)

# Run health check
if ! /usr/local/bin/nexus-health; then
    EXIT_CODE=$?
    printf "NEXUS health check failed on %s\n\nExit code: %s\n\n" \
        "$HOSTNAME" "$EXIT_CODE" | \
        mail -s "NEXUS ALERT: Health Check Failed" "$EMAIL_TO"
    exit $EXIT_CODE
fi
EOF

chmod +x "$HELPERS_DIR/monitoring-email.sh"
echo "✅ Created: $HELPERS_DIR/monitoring-email.sh"

cat > "$HELPERS_DIR/monitoring-healthchecks.sh" <<'EOF'
#!/bin/bash
# Healthchecks.io integration for NEXUS health check

set -euo pipefail

HC_UUID="${HC_UUID:-}"

if [ -z "$HC_UUID" ]; then
    echo "Error: Set HC_UUID to your healthchecks.io check UUID"
    exit 1
fi

HC_START="https://hc-ping.com/${HC_UUID}/start"
HC_SUCCESS="https://hc-ping.com/${HC_UUID}"
HC_FAIL="https://hc-ping.com/${HC_UUID}/fail"

# Signal start
curl -fsS "$HC_START" >/dev/null 2>&1 || true

# Run health check
if /usr/local/bin/nexus-health; then
    # Success
    curl -fsS "$HC_SUCCESS" >/dev/null 2>&1 || true
else
    # Failure
    EXIT_CODE=$?
    curl -fsS --data-raw "exit_code=$EXIT_CODE" "$HC_FAIL" >/dev/null 2>&1 || true
    exit $EXIT_CODE
fi
EOF

chmod +x "$HELPERS_DIR/monitoring-healthchecks.sh"
echo "✅ Created: $HELPERS_DIR/monitoring-healthchecks.sh"

cat > "$HELPERS_DIR/setup-systemd.sh" <<'EOF'
#!/bin/bash
# Set up systemd timer for NEXUS health checks

set -euo pipefail

if [ "$EUID" -ne 0 ]; then
    echo "Please run as root or with sudo"
    exit 1
fi

SYSTEMD_DIR="/etc/systemd/system"

# Create service file
cat > "$SYSTEMD_DIR/nexus-health.service" <<'SERVICE'
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
SERVICE

# Create timer file
cat > "$SYSTEMD_DIR/nexus-health.timer" <<'TIMER'
[Unit]
Description=Run NEXUS health probe every 5 minutes
After=network.target

[Timer]
OnBootSec=2m
OnUnitActiveSec=5m
Unit=nexus-health.service

[Install]
WantedBy=timers.target
TIMER

# Reload and enable
systemctl daemon-reload
systemctl enable nexus-health.timer
systemctl start nexus-health.timer

echo "✅ Systemd timer installed and started"
echo ""
echo "Check status:"
echo "  systemctl status nexus-health.timer"
echo "  systemctl list-timers nexus-health.timer"
echo ""
echo "View logs:"
echo "  journalctl -u nexus-health.service -f"
EOF

chmod +x "$HELPERS_DIR/setup-systemd.sh"
echo "✅ Created: $HELPERS_DIR/setup-systemd.sh"

echo ""
echo "✅ All helper scripts created in: $HELPERS_DIR/"
echo ""

# 8. Summary
echo "🎉 Deployment Complete!"
echo "======================="
echo ""
echo "✅ Installed: $INSTALL_PATH"
echo "✅ Helper scripts: $HELPERS_DIR/"
echo ""
echo "Next steps:"
echo ""
echo "1. Set up cron (see instructions above)"
echo "2. Choose monitoring option:"
echo "   - Prometheus: $HELPERS_DIR/monitoring-prometheus.sh"
echo "   - Webhooks:   $HELPERS_DIR/monitoring-webhook.sh"
echo "   - Email:      $HELPERS_DIR/monitoring-email.sh"
echo "   - Healthcheck: $HELPERS_DIR/monitoring-healthchecks.sh"
echo "   - Systemd:    $HELPERS_DIR/setup-systemd.sh"
echo ""
echo "3. Test manually:"
echo "   $INSTALL_PATH"
echo ""
echo "4. View comprehensive guide:"
echo "   cat DEPLOYMENT_GUIDE.md"
echo ""
