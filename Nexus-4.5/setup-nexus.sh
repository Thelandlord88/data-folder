#!/bin/bash
###############################################################################
# NEXUS-4.5 Complete Setup Script
# 
# Purpose: One-time setup to prepare all scripts and environment
# Usage: ./setup-nexus.sh
#
# What it does:
# 1. Makes all .sh files executable
# 2. Verifies Python dependencies
# 3. Checks Node.js/TypeScript setup
# 4. Creates necessary directories
# 5. Validates file structure
# 6. Runs health checks
###############################################################################

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Symbols
CHECK="${GREEN}✅${NC}"
CROSS="${RED}❌${NC}"
WARN="${YELLOW}⚠️${NC}"
INFO="${CYAN}ℹ️${NC}"
ROCKET="${PURPLE}🚀${NC}"

###############################################################################
# Banner
###############################################################################
print_banner() {
    echo -e "${PURPLE}"
    cat << 'EOF'
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║      ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗               ║
║      ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝               ║
║      ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗               ║
║      ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║               ║
║      ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║               ║
║      ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝               ║
║                                                                  ║
║                    NEXUS-4.5 Setup Script                       ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}\n"
}

###############################################################################
# Step 1: Make all shell scripts executable
###############################################################################
setup_shell_scripts() {
    echo -e "${BOLD}${CYAN}Step 1: Setting up shell scripts...${NC}\n"
    
    # Find all .sh files
    SHELL_SCRIPTS=$(find . -maxdepth 1 -name "*.sh" -type f)
    SCRIPT_COUNT=0
    
    if [ -z "$SHELL_SCRIPTS" ]; then
        echo -e "  ${WARN} No .sh files found in current directory"
        return
    fi
    
    for script in $SHELL_SCRIPTS; do
        SCRIPT_NAME=$(basename "$script")
        
        # Check if already executable
        if [ -x "$script" ]; then
            echo -e "  ${CHECK} ${GREEN}${SCRIPT_NAME}${NC} - already executable"
        else
            chmod +x "$script"
            echo -e "  ${CHECK} ${GREEN}${SCRIPT_NAME}${NC} - made executable"
        fi
        
        SCRIPT_COUNT=$((SCRIPT_COUNT + 1))
    done
    
    echo -e "\n  ${INFO} Total scripts: ${CYAN}${SCRIPT_COUNT}${NC}\n"
}

###############################################################################
# Step 2: Check Python dependencies
###############################################################################
check_python() {
    echo -e "${BOLD}${CYAN}Step 2: Checking Python setup...${NC}\n"
    
    # Check Python version
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version 2>&1)
        echo -e "  ${CHECK} Python: ${GREEN}${PYTHON_VERSION}${NC}"
    else
        echo -e "  ${CROSS} Python3: ${RED}Not found${NC}"
        echo -e "  ${INFO} Install: ${CYAN}sudo apt-get install python3${NC}"
        return 1
    fi
    
    # Check pip
    if command -v pip3 &> /dev/null; then
        echo -e "  ${CHECK} pip3: ${GREEN}Available${NC}"
    else
        echo -e "  ${WARN} pip3: ${YELLOW}Not found${NC}"
        echo -e "  ${INFO} Install: ${CYAN}sudo apt-get install python3-pip${NC}"
    fi
    
    # Check for required Python packages
    echo -e "\n  ${INFO} Checking Python dependencies:\n"
    
    DEPENDENCIES=("beautifulsoup4" "lxml")
    MISSING_DEPS=()
    
    for dep in "${DEPENDENCIES[@]}"; do
        if python3 -c "import ${dep//-/_}" &> /dev/null; then
            echo -e "    ${CHECK} ${dep}: ${GREEN}Installed${NC}"
        else
            echo -e "    ${CROSS} ${dep}: ${RED}Missing${NC}"
            MISSING_DEPS+=("$dep")
        fi
    done
    
    if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
        echo -e "\n  ${WARN} ${YELLOW}Missing dependencies detected${NC}"
        echo -e "  ${INFO} Install with:"
        echo -e "    ${CYAN}pip3 install ${MISSING_DEPS[*]}${NC}\n"
    else
        echo -e "\n  ${CHECK} ${GREEN}All Python dependencies satisfied${NC}\n"
    fi
}

###############################################################################
# Step 3: Check Node.js and TypeScript
###############################################################################
check_nodejs() {
    echo -e "${BOLD}${CYAN}Step 3: Checking Node.js setup...${NC}\n"
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo -e "  ${CHECK} Node.js: ${GREEN}${NODE_VERSION}${NC}"
    else
        echo -e "  ${CROSS} Node.js: ${RED}Not found${NC}"
        echo -e "  ${INFO} Required for NEXUS runtime${NC}"
        return 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        echo -e "  ${CHECK} npm: ${GREEN}v${NPM_VERSION}${NC}"
    else
        echo -e "  ${CROSS} npm: ${RED}Not found${NC}"
    fi
    
    # Check for tsx (TypeScript executor)
    if command -v tsx &> /dev/null; then
        echo -e "  ${CHECK} tsx: ${GREEN}Available${NC}"
    else
        if command -v npx &> /dev/null; then
            echo -e "  ${INFO} tsx: Will use ${CYAN}npx tsx${NC}"
        else
            echo -e "  ${WARN} tsx: ${YELLOW}Not available${NC}"
        fi
    fi
    
    echo ""
}

###############################################################################
# Step 4: Create necessary directories
###############################################################################
setup_directories() {
    echo -e "${BOLD}${CYAN}Step 4: Setting up directories...${NC}\n"
    
    DIRS=("docs" "consciousness" "logs" "output")
    
    for dir in "${DIRS[@]}"; do
        if [ -d "$dir" ]; then
            echo -e "  ${CHECK} ${dir}/ - exists"
        else
            mkdir -p "$dir"
            echo -e "  ${CHECK} ${dir}/ - created"
        fi
    done
    
    echo ""
}

###############################################################################
# Step 5: Verify critical files
###############################################################################
verify_files() {
    echo -e "${BOLD}${CYAN}Step 5: Verifying critical files...${NC}\n"
    
    # Core NUXEE files
    CORE_FILES=(
        "ux-patterns-library.json:Pattern Library"
        "detect-ux-opportunities.sh:Opportunity Detector"
        "nexus-ux-analyzer.py:Intelligent Analyzer"
        "nexus-ux-applier.py:Pattern Applier"
        "enhance-ux.sh:UX Enhancement Pipeline"
    )
    
    MISSING_FILES=()
    
    for file_info in "${CORE_FILES[@]}"; do
        FILE=$(echo "$file_info" | cut -d: -f1)
        NAME=$(echo "$file_info" | cut -d: -f2)
        
        if [ -f "$FILE" ]; then
            SIZE=$(ls -lh "$FILE" | awk '{print $5}')
            echo -e "  ${CHECK} ${NAME}: ${GREEN}${SIZE}${NC}"
        else
            echo -e "  ${CROSS} ${NAME}: ${RED}Missing${NC}"
            MISSING_FILES+=("$FILE")
        fi
    done
    
    # NEXUS runtime files
    echo -e "\n  ${INFO} NEXUS Runtime Files:\n"
    
    RUNTIME_FILES=(
        "nexus-runtime.v2.ts:NEXUS Runtime"
        "NEXUS.engine.v2.ts:NEXUS Engine"
        "nexus-bridge.ts:NEXUS Bridge"
    )
    
    for file_info in "${RUNTIME_FILES[@]}"; do
        FILE=$(echo "$file_info" | cut -d: -f1)
        NAME=$(echo "$file_info" | cut -d: -f2)
        
        if [ -f "$FILE" ]; then
            SIZE=$(ls -lh "$FILE" | awk '{print $5}')
            echo -e "    ${CHECK} ${NAME}: ${GREEN}${SIZE}${NC}"
        else
            echo -e "    ${WARN} ${NAME}: ${YELLOW}Not found${NC}"
        fi
    done
    
    # Documentation files
    echo -e "\n  ${INFO} Documentation:\n"
    
    DOC_FILES=(
        "NEXUS_MEMORY.md:Memory/Handoff"
        "NEXUS_ADAPTIVE_UX_STRATEGY.md:UX Strategy"
        "README.md:README"
    )
    
    for file_info in "${DOC_FILES[@]}"; do
        FILE=$(echo "$file_info" | cut -d: -f1)
        NAME=$(echo "$file_info" | cut -d: -f2)
        
        if [ -f "$FILE" ]; then
            SIZE=$(ls -lh "$FILE" | awk '{print $5}')
            echo -e "    ${CHECK} ${NAME}: ${GREEN}${SIZE}${NC}"
        else
            echo -e "    ${WARN} ${NAME}: ${YELLOW}Not found${NC}"
        fi
    done
    
    if [ ${#MISSING_FILES[@]} -gt 0 ]; then
        echo -e "\n  ${WARN} ${YELLOW}Some core files are missing${NC}"
        echo -e "  ${INFO} Missing: ${MISSING_FILES[*]}\n"
    else
        echo -e "\n  ${CHECK} ${GREEN}All core files present${NC}\n"
    fi
}

###############################################################################
# Step 6: Test scripts
###############################################################################
test_scripts() {
    echo -e "${BOLD}${CYAN}Step 6: Testing scripts...${NC}\n"
    
    # Test NUXEE detection script
    if [ -x "detect-ux-opportunities.sh" ]; then
        echo -e "  ${INFO} Testing detect-ux-opportunities.sh..."
        if ./detect-ux-opportunities.sh --help &> /dev/null; then
            echo -e "  ${CHECK} ${GREEN}Works correctly${NC}"
        else
            echo -e "  ${WARN} ${YELLOW}May have issues${NC}"
        fi
    fi
    
    # Test Python scripts
    if [ -f "nexus-ux-analyzer.py" ]; then
        echo -e "  ${INFO} Testing nexus-ux-analyzer.py..."
        if python3 nexus-ux-analyzer.py --help &> /dev/null 2>&1; then
            echo -e "  ${CHECK} ${GREEN}Works correctly${NC}"
        else
            echo -e "  ${WARN} ${YELLOW}May need dependencies${NC}"
        fi
    fi
    
    echo ""
}

###############################################################################
# Summary
###############################################################################
print_summary() {
    echo -e "\n${BOLD}${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${PURPLE}Setup Complete!${NC}"
    echo -e "${BOLD}${PURPLE}═══════════════════════════════════════════════════════════════${NC}\n"
    
    echo -e "${BOLD}Quick Start Commands:${NC}\n"
    
    echo -e "  ${ROCKET} ${BOLD}Start NEXUS Runtime:${NC}"
    echo -e "    ${CYAN}./start-nexus-enhanced.sh${NC}\n"
    
    echo -e "  ${ROCKET} ${BOLD}Check NEXUS Status:${NC}"
    echo -e "    ${CYAN}./nexus-status.sh${NC} ${YELLOW}(if available)${NC}\n"
    
    echo -e "  ${ROCKET} ${BOLD}Enhance a page with NUXEE:${NC}"
    echo -e "    ${CYAN}./enhance-ux.sh your-page.html${NC}\n"
    
    echo -e "  ${ROCKET} ${BOLD}Check memory/handoff:${NC}"
    echo -e "    ${CYAN}./update-nexus-memory.sh${NC}\n"
    
    echo -e "  ${ROCKET} ${BOLD}Read full context:${NC}"
    echo -e "    ${CYAN}cat NEXUS_MEMORY.md${NC}\n"
    
    echo -e "${BOLD}Documentation:${NC}\n"
    echo -e "  ${INFO} Memory/Handoff: ${CYAN}NEXUS_MEMORY.md${NC}"
    echo -e "  ${INFO} UX Strategy: ${CYAN}NEXUS_ADAPTIVE_UX_STRATEGY.md${NC}"
    echo -e "  ${INFO} Package Info: ${CYAN}NUXEE-Package/README.md${NC}\n"
    
    echo -e "${BOLD}${GREEN}✨ Your NEXUS-4.5 environment is ready!${NC}\n"
}

###############################################################################
# Main execution
###############################################################################
main() {
    print_banner
    
    echo -e "${INFO} Starting NEXUS-4.5 setup...\n"
    echo -e "${BOLD}This will:${NC}"
    echo -e "  • Make all .sh scripts executable"
    echo -e "  • Check Python dependencies"
    echo -e "  • Verify Node.js setup"
    echo -e "  • Create necessary directories"
    echo -e "  • Verify critical files"
    echo -e "  • Test scripts\n"
    
    read -p "Continue? (y/n) " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "\n${WARN} Setup cancelled.\n"
        exit 0
    fi
    
    echo ""
    
    # Run setup steps
    setup_shell_scripts
    check_python
    check_nodejs
    setup_directories
    verify_files
    test_scripts
    
    # Print summary
    print_summary
}

# Run main
main
