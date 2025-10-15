# VS Code Tasks Guide

**Location:** `.vscode/tasks.json`  
**Total Tasks:** 16  
**Status:** ✅ Ready to use

---

## 🚀 Quick Start

### Run a Task

1. Press **Ctrl+Shift+P** (or **Cmd+Shift+P** on Mac)
2. Type `Tasks: Run Task`
3. Select a task from the list

### Default Build Task

Press **Ctrl+Shift+B** (or **Cmd+Shift+B** on Mac) to run the default build task: **🚀 Start NEXUS**

---

## 📋 Available Tasks

### 🏥 Health & Diagnostics

| Task | Shortcut | Description |
|------|----------|-------------|
| **🏥 Health Check** | Run Task → Health Check | Check NEXUS runtime health (personalities, circuit breaker, memory) |
| **🔧 Troubleshoot** | Run Task → Troubleshoot | Run 12 comprehensive system diagnostics |
| **📁 Check Files** | Run Task → Check Files | Verify file integrity (23 files checked) |
| **🔍 Full Diagnostic Suite** | Run Task → Full Diagnostic | Run all 3 diagnostic tools in sequence |

**When to use:**
- Daily health monitoring
- After updates or changes
- When troubleshooting issues
- Before deployment

---

### 🚀 Runtime & Testing

| Task | Shortcut | Description |
|------|----------|-------------|
| **🚀 Start NEXUS** | **Ctrl+Shift+B** | Start NEXUS runtime server (default build task) |
| **🧪 Test NEXUS** | Run Task → Test NEXUS | Run full NEXUS test suite |
| **⚡ Quick Test** | Run Task → Quick Test | Fast health check |
| **✅ Verify Installation** | Run Task → Verify Installation | Verify NEXUS is properly installed |
| **🎯 Proof Test** | Run Task → Proof Test | Run proof of concept tests |

**When to use:**
- Starting NEXUS for development
- Running tests after changes
- Verifying installation

---

### 🛠️ TypeScript Development

| Task | Shortcut | Description |
|------|----------|-------------|
| **🔨 TypeScript: Compile** | Run Task → TypeScript: Compile | Compile TypeScript to JavaScript |
| **🔍 TypeScript: Check Types** | Run Task → TypeScript: Check Types | Type check without compiling (fast) |
| **👁️ TypeScript: Watch** | Run Task → TypeScript: Watch | Auto-compile on file changes |
| **🧹 Clean Build** | Run Task → Clean Build | Delete dist/ and rebuild everything |

**When to use:**
- Before committing code
- Checking for TypeScript errors
- Development with auto-compile
- Fresh build from scratch

---

### 🚢 Deployment & Maintenance

| Task | Shortcut | Description |
|------|----------|-------------|
| **🚢 Deploy Health Check** | Run Task → Deploy Health Check | Deploy monitoring system (one-command) |
| **🗑️ Cleanup Old Versions** | Run Task → Cleanup Old Versions | Archive old NEXUS versions |
| **📦 Install Dependencies** | Run Task → Install Dependencies | Run `npm install` |

**When to use:**
- Deploying to production
- Setting up new environments
- Managing old versions
- Installing/updating packages

---

## 🎯 Common Workflows

### Starting Development

```
1. 📦 Install Dependencies
2. 🔍 TypeScript: Check Types
3. 🚀 Start NEXUS
4. 🏥 Health Check
```

**VS Code:**
1. Run Task → Install Dependencies
2. Run Task → TypeScript: Check Types
3. **Ctrl+Shift+B** (Start NEXUS)
4. Run Task → Health Check

---

### Daily Health Check

```
1. 🏥 Health Check
2. 📁 Check Files
3. 🔧 Troubleshoot (if issues)
```

**VS Code:**
1. Run Task → Health Check
2. Run Task → Check Files
3. Run Task → Troubleshoot (if needed)

---

### Before Deployment

```
1. 📁 Check Files
2. 🔍 TypeScript: Check Types
3. 🔍 Full Diagnostic Suite
4. 🚢 Deploy Health Check
```

**VS Code:**
1. Run Task → Check Files
2. Run Task → TypeScript: Check Types
3. Run Task → Full Diagnostic Suite
4. Run Task → Deploy Health Check

---

### After Code Changes

```
1. 🔍 TypeScript: Check Types
2. 🧪 Test NEXUS
3. 🏥 Health Check
```

**VS Code:**
1. Run Task → TypeScript: Check Types
2. Run Task → Test NEXUS
3. Run Task → Health Check

---

### Development with Auto-Compile

```
1. 👁️ TypeScript: Watch (keeps running)
2. 🚀 Start NEXUS (in separate terminal)
3. Make changes → auto-compiles
```

**VS Code:**
1. Run Task → TypeScript: Watch
2. **Ctrl+Shift+B** (Start NEXUS)
3. Edit files → see auto-compile

---

## 🔧 Task Configuration

### Problem Matchers

Tasks use VS Code problem matchers to highlight errors:

- **TypeScript tasks:** `$tsc` problem matcher
  - Errors appear in Problems panel
  - Click to jump to error location

- **Shell scripts:** No problem matcher
  - Output shown in terminal
  - Exit codes indicate success/failure

---

### Task Groups

| Group | Tasks | Default Key |
|-------|-------|-------------|
| **build** | Start NEXUS, Compile, Install | **Ctrl+Shift+B** |
| **test** | Health Check, Troubleshoot, Tests | **Ctrl+Shift+T** |

---

### Background Tasks

Some tasks run in the background:

- **🚀 Start NEXUS** - Server keeps running
- **👁️ TypeScript: Watch** - Continues watching files

Stop background tasks:
1. Click terminal
2. Press **Ctrl+C**

---

## 📊 Task Details

### Task Properties

Each task includes:

```json
{
  "label": "Task Name",           // Name shown in menu
  "type": "shell",                // Runs shell command
  "command": "./script.sh",       // Command to execute
  "group": "test|build",          // Task category
  "isBackground": true|false,     // Runs in background?
  "presentation": {
    "reveal": "always",           // Always show output
    "panel": "new",               // New terminal panel
    "clear": true                 // Clear before running
  },
  "detail": "Description"         // Shown under task name
}
```

---

## 🎨 Customization

### Add Your Own Task

Edit `.vscode/tasks.json`:

```json
{
  "label": "🎯 My Custom Task",
  "type": "shell",
  "command": "./my-script.sh",
  "problemMatcher": [],
  "group": "test",
  "presentation": {
    "reveal": "always",
    "panel": "new"
  },
  "detail": "My custom task description"
}
```

### Modify Existing Task

1. Open `.vscode/tasks.json`
2. Find task by `"label"`
3. Modify properties
4. Save file

---

## ⌨️ Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Run Task | **Ctrl+Shift+P** → Tasks: Run Task | **Cmd+Shift+P** → Tasks: Run Task |
| Build Task | **Ctrl+Shift+B** | **Cmd+Shift+B** |
| Run Test Task | **Ctrl+Shift+T** | **Cmd+Shift+T** |
| Command Palette | **Ctrl+Shift+P** | **Cmd+Shift+P** |

---

## 🎯 Task Categories

### By Frequency

**Daily:**
- 🏥 Health Check
- 🚀 Start NEXUS

**Weekly:**
- 📁 Check Files
- 🔧 Troubleshoot

**As Needed:**
- 🔍 TypeScript: Check Types (after code changes)
- 🧪 Test NEXUS (after changes)
- 🚢 Deploy Health Check (before deployment)

**Rarely:**
- 🗑️ Cleanup Old Versions (maintenance)
- 📦 Install Dependencies (after package.json changes)

---

## 📝 Tips & Tricks

### Quick Access

Create custom keyboard shortcuts:
1. File → Preferences → Keyboard Shortcuts
2. Search for "Tasks: Run Task"
3. Add your shortcut

### Terminal Management

- **New Terminal:** Tasks open in separate panels
- **Reuse Terminal:** Change `"panel": "shared"` in tasks.json
- **Clear Output:** Set `"clear": true` to clear before running

### Problem Detection

TypeScript tasks show errors in:
- **Problems Panel** (Ctrl+Shift+M)
- **Error squiggles** in editor
- **Terminal output**

---

## 🆘 Troubleshooting

### Task Not Found

**Issue:** "Task 'name' not found"

**Fix:**
1. Check tasks.json exists: `.vscode/tasks.json`
2. Verify JSON syntax (no trailing commas)
3. Reload VS Code: Ctrl+Shift+P → Reload Window

### Permission Denied

**Issue:** "Permission denied" when running .sh files

**Fix:**
```bash
chmod +x *.sh
```

### Task Won't Stop

**Issue:** Background task keeps running

**Fix:**
1. Click terminal with task
2. Press **Ctrl+C**
3. Or click trash icon in terminal

---

## ✅ Verification

### Test Tasks Work

```bash
# From VS Code:
1. Ctrl+Shift+P
2. Type "Tasks: Run Task"
3. Select "🏥 Health Check"
4. Should see health check output
```

### Check Configuration

```bash
# Verify tasks.json
cat .vscode/tasks.json | jq .

# List all tasks
cat .vscode/tasks.json | jq '.tasks[].label'
```

---

## 📚 Related Documentation

- [VS Code Tasks](https://code.visualstudio.com/docs/editor/tasks)
- [Health Check Guide](./docs/guides/HEALTH_CHECK_GUIDE.md)
- [Deployment Guide](./docs/deployment/DEPLOYMENT_GUIDE.md)
- [Troubleshooting](./docs/troubleshooting/TROUBLESHOOTING.md)

---

**All 16 tasks are ready to use in VS Code!** 🎯
