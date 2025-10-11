#!/bin/bash
# Install Critical VS Code Extensions for NEXUS Enhancement

echo "🚀 NEXUS Extension Enhancement Installation"
echo "============================================"
echo ""
echo "Installing critical extensions to supercharge NEXUS development..."
echo ""

# Function to install extension with feedback
install_ext() {
    local ext_id="$1"
    local ext_name="$2"
    local priority="$3"
    
    echo "[$priority] Installing: $ext_name"
    if code --install-extension "$ext_id" 2>/dev/null; then
        echo "    ✅ $ext_name installed successfully"
    else
        echo "    ⚠️  $ext_name may already be installed or unavailable"
    fi
    echo ""
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 1: Immediate Impact Extensions"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Critical for experimentation
install_ext "ms-toolsai.jupyter" "Jupyter Notebooks" "⭐⭐⭐⭐⭐"
install_ext "ms-python.python" "Python (Pylance)" "⭐⭐⭐⭐⭐"

# API testing
install_ext "humao.rest-client" "REST Client" "⭐⭐⭐⭐⭐"
install_ext "rangav.vscode-thunder-client" "Thunder Client" "⭐⭐⭐⭐"

# Performance profiling
install_ext "ms-python.vscode-pylance" "Pylance (Advanced)" "⭐⭐⭐⭐⭐"

# Code intelligence
install_ext "visualstudioexptteam.vscodeintellicode" "IntelliCode" "⭐⭐⭐⭐"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 2: Data Analysis & Visualization"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Data analysis
install_ext "ms-toolsai.datawrangler" "Data Wrangler" "⭐⭐⭐⭐"
install_ext "donjayamanne.python-environment-manager" "Python Environment Manager" "⭐⭐⭐⭐"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 3: Testing & Quality"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Testing
install_ext "littlefoxteam.vscode-python-test-adapter" "Python Test Explorer" "⭐⭐⭐⭐"
install_ext "ryanluker.vscode-coverage-gutters" "Coverage Gutters" "⭐⭐⭐⭐"

# Linting
install_ext "ms-python.pylint" "Pylint" "⭐⭐⭐"
install_ext "ms-python.black-formatter" "Black Formatter" "⭐⭐⭐"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 4: Database & Infrastructure"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Database
install_ext "ckolkman.vscode-postgres" "PostgreSQL" "⭐⭐⭐⭐⭐"
install_ext "mongodb.mongodb-vscode" "MongoDB" "⭐⭐⭐⭐"

# Redis (if available)
install_ext "davidsekar.redis-xplorer" "Redis Explorer" "⭐⭐⭐⭐"

# Docker
install_ext "ms-azuretools.vscode-docker" "Docker" "⭐⭐⭐⭐⭐"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 5: Productivity & Collaboration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Git
install_ext "eamodio.gitlens" "GitLens" "⭐⭐⭐⭐"

# Code quality
install_ext "streetsidesoftware.code-spell-checker" "Code Spell Checker" "⭐⭐⭐"
install_ext "gruntfuggly.todo-tree" "Todo Tree" "⭐⭐⭐⭐"

# Documentation
install_ext "yzhang.markdown-all-in-one" "Markdown All in One" "⭐⭐⭐"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 6: Advanced Development"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Remote development
install_ext "ms-vscode-remote.remote-ssh" "Remote - SSH" "⭐⭐⭐⭐⭐"
install_ext "ms-vscode-remote.remote-containers" "Remote - Containers" "⭐⭐⭐⭐⭐"

# GitHub
install_ext "github.vscode-pull-request-github" "GitHub Pull Requests" "⭐⭐⭐⭐"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Installation Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Extensions Installed:"
code --list-extensions | wc -l | xargs echo "   Total:"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Reload VS Code: Press Ctrl+Shift+P → 'Reload Window'"
echo "2. Configure Python: Select interpreter for NEXUS"
echo "3. Create Jupyter notebook: test-nexus.ipynb"
echo "4. Set up REST Client: Create nexus-api.http"
echo "5. Configure settings: See settings.json recommendations"
echo ""
echo "📖 Full Guide: EXTENSION_ENHANCEMENT_ANALYSIS.md"
echo ""
echo "🚀 NEXUS is now supercharged with advanced tooling!"
