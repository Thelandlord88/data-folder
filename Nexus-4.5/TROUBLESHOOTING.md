# NEXUS Troubleshooting Guide

Complete troubleshooting reference for NEXUS health check system.

---

## 🚀 Quick Troubleshooting

### Run the Troubleshoot Script

```bash
cd /workspaces/data-folder/Nexus-4.5
./troubleshoot.sh
```

This will automatically check for all common issues and provide recommendations.

---

## 📋 What Gets Checked

The troubleshoot script performs 12 comprehensive checks:

1. ✅ **Shell Compatibility** - Bash version and features
2. ✅ **Dependencies** - curl, jq, and optional tools
3. ✅ **Network Connectivity** - localhost, DNS, remote hosts
4. ✅ **Port Availability** - port usage and accessibility
5. ✅ **NEXUS Service Status** - process and HTTP endpoint
6. ✅ **Health Check Script** - exists, executable, valid
7. ✅ **System Resources** - disk, memory, CPU load
8. ✅ **File Permissions** - ownership and access rights
9. ✅ **Environment Variables** - configuration
10. ✅ **Common Issues** - port conflicts, firewall, SELinux
11. ✅ **Health Check Test** - actual execution
12. ✅ **Summary** - recommendations and action items

---

## 🔧 Common Issues & Fixes

### Issue: Dependencies Not Installed

**Symptoms:**
```
❌ curl is NOT installed (REQUIRED)
❌ jq is NOT installed (REQUIRED)
```

**Fix:**
```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install curl jq

# RHEL/CentOS
sudo yum install curl jq

# macOS
brew install curl jq
```

---

### Issue: NEXUS Not Running

**Symptoms:**
```
❌ Cannot reach NEXUS /status endpoint
⚠️  Port 8080 is NOT in use
```

**Fix:**
```bash
cd /workspaces/data-folder/Nexus-4.5
./start-nexus.sh
sleep 5
./troubleshoot.sh  # Verify
```

---

### Issue: Port Conflict

**Symptoms:**
```
⚠️  Multiple processes listening on port 8080
```

**Fix:**
```bash
# See what's using the port
lsof -i :8080

# Kill conflicting process
kill <PID>

# Restart NEXUS
./start-nexus.sh
```

---

### Issue: Permission Denied

**Symptoms:**
```
❌ Health check script is NOT executable
```

**Fix:**
```bash
chmod +x health-check.sh
```

---

## 📚 Full Documentation

See **TROUBLESHOOTING_DETAILED.md** for:
- Complete issue list
- Advanced diagnostics
- Custom checks
- Emergency procedures

---

**Run `./troubleshoot.sh` to diagnose all issues automatically!** 🔧
