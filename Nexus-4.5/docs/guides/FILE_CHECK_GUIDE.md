# NEXUS File Integrity Check Guide

Complete guide to checking NEXUS file integrity and recovering from file issues.

---

## 🚀 Quick Start

### Run File Integrity Check

```bash
cd /workspaces/data-folder/Nexus-4.5
./check-files.sh
```

This will verify:
- ✅ All core runtime files exist
- ✅ Configuration files are valid
- ✅ Personality files are present (45+)
- ✅ Consciousness patterns exist (4+)
- ✅ Source files are intact
- ✅ Scripts are executable
- ✅ Documentation is present
- ✅ Dependencies are installed

---

## 📋 What Gets Checked

### 1. Core Runtime Files ✅
- `nexus-runtime.v2.ts` - Main runtime (CRITICAL)
- `NEXUS.engine.v2.ts` - Core engine (CRITICAL)
- `nexus-bridge.ts` - Consciousness bridge (CRITICAL)
- `nexus-bridge.types.ts` - Type definitions (CRITICAL)

### 2. Configuration Files ✅
- `package.json` - Node.js configuration + JSON validation
- `tsconfig.json` - TypeScript configuration + JSON validation

### 3. Personality Files ✅
- `profiles/` directory existence
- Count of personality JSON files (expects ≥45)
- JSON syntax validation for all personalities
- Key personalities: pythonista, hunter, daedalus, guardian

### 4. Consciousness Patterns ✅
- `consciousness/` directory existence
- Pattern count (expects ≥4)
- Key patterns: problem-decomposition, systems-thinking, etc.

### 5. Source Files ✅
- `src/` directory existence
- TypeScript/JavaScript/MJS file counts
- Source file integrity

### 6. Validation & Loaders ✅
- `validation/` directory (optional)
- `loaders/` directory (optional)
- File counts in each

### 7. CSS Engine ✅
- `css-engine/` directory (optional)
- CSS engine file count

### 8. Type Definitions ✅
- `types/` directory (optional)
- `.ts` and `.d.ts` file count

### 9. Executable Scripts ✅
- `health-check.sh` - Must be executable
- `troubleshoot.sh` - Must be executable
- `deploy-health-check.sh` - Must be executable
- `start-nexus.sh` - Optional but should be executable

### 10. Documentation ✅
- `README.md` (CRITICAL)
- All other `.md` files
- Documentation file count

### 11. Logs Directory ✅
- `logs/` directory existence
- Log file count (created at runtime)

### 12. Dependencies ✅
- `node_modules/` existence
- Package count
- Critical deps: tsx, typescript

### 13. File Permissions ✅
- All `.sh` scripts executable
- Permission summary

### 14. Package Lock Files ✅
- `package-lock.json` (npm)
- `yarn.lock` (yarn)
- `pnpm-lock.yaml` (pnpm)

---

## 🔍 Exit Codes

| Exit Code | Meaning |
|-----------|---------|
| **0** | All files OK, no issues |
| **1** | Critical files missing/corrupted |
| **2** | Warnings only (optional files missing) |

**Usage in scripts:**
```bash
if ./check-files.sh; then
    echo "Files OK"
else
    CODE=$?
    if [ $CODE -eq 1 ]; then
        echo "Critical issues!"
    elif [ $CODE -eq 2 ]; then
        echo "Warnings only"
    fi
fi
```

---

## 🔧 Common Issues & Fixes

### Issue: Core Runtime File Missing

**Symptoms:**
```
❌ nexus-runtime.v2.ts is MISSING
```

**Fixes:**
```bash
# Restore from git
git checkout nexus-runtime.v2.ts

# Or restore from backup
cp backup/nexus-runtime.v2.ts .

# Or re-clone repository
git clone <repo-url> Nexus-4.5-new
```

---

### Issue: File is Empty

**Symptoms:**
```
❌ package.json exists but is EMPTY
```

**Fixes:**
```bash
# Restore from git
git checkout package.json

# Or restore from backup
cp backup/package.json .
```

---

### Issue: Invalid JSON

**Symptoms:**
```
❌ personality.json has INVALID JSON syntax
```

**Fixes:**
```bash
# Check syntax manually
jq empty profiles/personality.json

# Restore from git
git checkout profiles/personality.json

# Or fix manually
# Common issues: trailing commas, missing quotes, unescaped characters
```

---

### Issue: Script Not Executable

**Symptoms:**
```
❌ health-check.sh is NOT executable
  Fix: chmod +x /path/to/health-check.sh
```

**Fix:**
```bash
chmod +x health-check.sh
# Or fix all scripts
chmod +x *.sh
```

---

### Issue: Missing Personalities

**Symptoms:**
```
⚠️  Found only 30 personality files (expected 45)
```

**Fixes:**
```bash
# Check what's missing
ls profiles/*.json | wc -l

# Restore from git
git checkout profiles/

# Or restore specific personalities
git checkout profiles/pythonista.json
```

---

### Issue: Dependencies Missing

**Symptoms:**
```
⚠️  node_modules/ not found
  Run: npm install
```

**Fix:**
```bash
npm install
# Or
yarn install
# Or
pnpm install
```

---

### Issue: TypeScript Errors

**Symptoms:**
```
⚠️  nexus-runtime.v2.ts may have TypeScript errors
```

**Check:**
```bash
npx tsc --noEmit nexus-runtime.v2.ts
```

**Fixes:**
```bash
# Restore from git
git checkout nexus-runtime.v2.ts

# Or fix TypeScript errors manually
# Check error output from: npx tsc --noEmit
```

---

## 🛠️ Recovery Procedures

### Complete File Recovery

```bash
# 1. Check current status
./check-files.sh > /tmp/file-check.log

# 2. Review issues
cat /tmp/file-check.log | grep "❌"

# 3. Restore all files from git
git checkout .

# 4. Verify
./check-files.sh
```

### Partial Recovery (Specific Files)

```bash
# Restore core files
git checkout nexus-runtime.v2.ts NEXUS.engine.v2.ts

# Restore personalities
git checkout profiles/

# Restore documentation
git checkout *.md

# Verify
./check-files.sh
```

### Fresh Install

```bash
# 1. Backup current state
mkdir backup-$(date +%Y%m%d)
cp -r * backup-$(date +%Y%m%d)/

# 2. Clone fresh copy
cd ..
git clone <repo-url> Nexus-4.5-fresh

# 3. Copy custom files if any
cp Nexus-4.5/logs/* Nexus-4.5-fresh/logs/

# 4. Install dependencies
cd Nexus-4.5-fresh
npm install

# 5. Verify
./check-files.sh
```

---

## 🔄 Automation

### Pre-Start Check

```bash
#!/bin/bash
# pre-start.sh

if ! ./check-files.sh; then
    echo "File integrity issues detected!"
    exit 1
fi

./start-nexus.sh
```

### Scheduled Integrity Check

```cron
# Check files daily at 3 AM
0 3 * * * cd /workspaces/data-folder/Nexus-4.5 && ./check-files.sh >> /var/log/nexus-file-check.log 2>&1
```

### CI/CD Integration

```yaml
- name: File Integrity Check
  run: |
    cd Nexus-4.5
    ./check-files.sh
```

---

## 📊 Integration with Other Tools

### With Health Check

```bash
#!/bin/bash
# combined-check.sh

echo "1. Checking files..."
./check-files.sh || exit 1

echo "2. Checking health..."
./health-check.sh || exit 2

echo "✅ All checks passed!"
```

### With Troubleshoot

```bash
#!/bin/bash
# full-diagnostic.sh

echo "=== File Integrity ==="
./check-files.sh

echo ""
echo "=== System Health ==="
./health-check.sh

echo ""
echo "=== Troubleshooting ==="
./troubleshoot.sh
```

---

## 💡 Best Practices

1. **Run before starting NEXUS**
   ```bash
   ./check-files.sh && ./start-nexus.sh
   ```

2. **Run after git pull**
   ```bash
   git pull && ./check-files.sh
   ```

3. **Run before deployment**
   ```bash
   ./check-files.sh && ./deploy-health-check.sh
   ```

4. **Include in startup scripts**
   ```bash
   #!/bin/bash
   # start-nexus.sh
   ./check-files.sh || exit 1
   npx tsx nexus-runtime.v2.ts
   ```

5. **Monitor file changes**
   ```bash
   # Watch for file changes
   watch -n 60 './check-files.sh | grep "❌"'
   ```

---

## 🎯 Quick Reference

### Check Everything
```bash
./check-files.sh
```

### Check Specific Category
```bash
./check-files.sh 2>&1 | grep -A 20 "Core Runtime Files"
./check-files.sh 2>&1 | grep -A 20 "Personality Files"
./check-files.sh 2>&1 | grep -A 20 "Dependencies"
```

### Save Report
```bash
./check-files.sh > file-integrity-report.txt 2>&1
```

### Check and Fix Permissions
```bash
./check-files.sh | grep "not executable"
chmod +x *.sh
```

### Count Issues
```bash
./check-files.sh 2>&1 | grep "❌" | wc -l
```

---

## 🆘 Emergency Procedures

### Critical Files Missing

1. **Don't panic** - Files can be restored
2. **Check git status**: `git status`
3. **View changes**: `git diff`
4. **Restore from git**: `git checkout .`
5. **Verify**: `./check-files.sh`

### Repository Corrupted

1. **Backup current state**: `cp -r . ../nexus-backup`
2. **Re-clone**: `git clone <url> ../nexus-fresh`
3. **Copy configs**: `cp .env ../nexus-fresh/` (if you have custom configs)
4. **Switch**: `mv Nexus-4.5 Nexus-4.5-old && mv ../nexus-fresh Nexus-4.5`
5. **Verify**: `./check-files.sh`

---

## 📚 Related Tools

| Tool | Purpose |
|------|---------|
| `health-check.sh` | Check NEXUS runtime health |
| `troubleshoot.sh` | Diagnose system issues |
| `check-files.sh` | Verify file integrity (this tool) |
| `deploy-health-check.sh` | Deploy monitoring |

**Recommended check order:**
1. `./check-files.sh` - Files OK?
2. `./troubleshoot.sh` - System OK?
3. `./health-check.sh` - NEXUS healthy?

---

**Use `./check-files.sh` before every deployment to ensure file integrity!** 🔍
