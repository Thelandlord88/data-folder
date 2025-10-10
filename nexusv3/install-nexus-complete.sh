#!/bin/bash
################################################################################
# NEXUS v3 Complete Installation Script
# 
# This script installs the complete NEXUS personality system including:
# - 45 personality profiles (JSON)
# - TypeScript source files
# - Compiled JavaScript runtime
# - All dependencies
# - Circuit breaker patterns
# - Trait composition engine
#
# Usage: bash install-nexus-complete.sh
#
# Date: October 7, 2025
# Version: 3.0.0
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Installation directory
INSTALL_DIR="$(pwd)/nexusv3"

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           NEXUS v3 Complete Installation Script              ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}This will install NEXUS v3 to: ${INSTALL_DIR}${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18+ required. Found: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm -v) detected${NC}"
echo ""

# Create installation directory
echo -e "${YELLOW}📁 Creating installation directory...${NC}"
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

# Create directory structure
echo -e "${YELLOW}📂 Creating directory structure...${NC}"
mkdir -p src/{loaders,types,validation}
mkdir -p profiles
mkdir -p consciousness
mkdir -p docs
mkdir -p dist

echo -e "${GREEN}✅ Directory structure created${NC}"
echo ""

# Create package.json
echo -e "${YELLOW}📦 Creating package.json...${NC}"
cat > package.json << 'PACKAGE_JSON_EOF'
{
  "name": "nexus-v3",
  "version": "3.0.0",
  "description": "NEXUS Multi-Personality AI System with Trait Composition Engine",
  "type": "module",
  "main": "dist/nexus-runtime.v2.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/nexus-runtime.v2.js",
    "dev": "tsc && node dist/nexus-runtime.v2.js",
    "verify": "node verify-circuit-breaker.mjs"
  },
  "keywords": ["ai", "personality", "trait-composition", "typescript"],
  "author": "NEXUS Team",
  "license": "MIT",
  "dependencies": {
    "ws": "^8.18.0"
  },
  "devDependencies": {
    "@types/node": "^22.7.5",
    "@types/ws": "^8.5.12",
    "typescript": "^5.6.3"
  }
}
PACKAGE_JSON_EOF

echo -e "${GREEN}✅ package.json created${NC}"

# Create tsconfig.json
echo -e "${YELLOW}⚙️  Creating tsconfig.json...${NC}"
cat > tsconfig.json << 'TSCONFIG_EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
TSCONFIG_EOF

echo -e "${GREEN}✅ tsconfig.json created${NC}"

# Install dependencies
echo -e "${YELLOW}📥 Installing dependencies...${NC}"
npm install --quiet
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ NEXUS v3 base installation complete!${NC}"
echo ""
echo -e "${YELLOW}⚠️  NOTE: This script created the directory structure and dependencies.${NC}"
echo -e "${YELLOW}⚠️  You still need to copy the following from your source repository:${NC}"
echo ""
echo -e "  1. ${BLUE}src/${NC} - All TypeScript source files"
echo -e "     • NEXUS.engine.v2.ts"
echo -e "     • nexus-runtime.v2.ts"
echo -e "     • loaders/PersonalityRegistryLoader.ts"
echo -e "     • types/personality.types.ts"
echo -e "     • validation/PersonalityValidator.ts"
echo ""
echo -e "  2. ${BLUE}profiles/${NC} - All 45 personality JSON files"
echo -e "     • aria.json, cipher.json, daedalus.json, etc."
echo ""
echo -e "  3. ${BLUE}consciousness/${NC} - Enhancement history"
echo -e "     • enhancement-history.json"
echo ""
echo -e "  4. ${BLUE}Optional:${NC} docs/, README.md, verify script"
echo ""
echo -e "${GREEN}After copying files, run:${NC}"
echo -e "  ${BLUE}cd $INSTALL_DIR${NC}"
echo -e "  ${BLUE}npm run build${NC}"
echo -e "  ${BLUE}npm start${NC}"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
