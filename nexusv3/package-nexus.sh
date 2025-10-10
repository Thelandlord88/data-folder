#!/bin/bash
################################################################################
# NEXUS v3 Complete Packaging Script
# 
# Creates a complete, portable NEXUS package including:
# - All source files (TypeScript)
# - All compiled files (JavaScript)
# - All 45 personality profiles
# - Dependencies configuration
# - Installation script
#
# Output: nexus-v3-complete.tar.gz
#
# Usage: bash package-nexus.sh
################################################################################

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              NEXUS v3 Packaging Script                       ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get current directory
SOURCE_DIR="$(pwd)"
PACKAGE_NAME="nexus-v3-complete"
PACKAGE_DIR="/tmp/$PACKAGE_NAME"
OUTPUT_FILE="$SOURCE_DIR/${PACKAGE_NAME}.tar.gz"

echo -e "${YELLOW}📦 Preparing package directory...${NC}"

# Clean up any existing package
rm -rf "$PACKAGE_DIR"
rm -f "$OUTPUT_FILE"

# Create package directory structure
mkdir -p "$PACKAGE_DIR"/{src/{loaders,types,validation},profiles,consciousness,docs,dist}

echo -e "${GREEN}✅ Package directory created${NC}"

# Copy source files
echo -e "${YELLOW}📄 Copying TypeScript source files...${NC}"
if [ -d "$SOURCE_DIR/src" ]; then
    cp -r "$SOURCE_DIR/src"/* "$PACKAGE_DIR/src/" 2>/dev/null || true
    echo -e "${GREEN}✅ Source files copied${NC}"
else
    echo -e "${YELLOW}⚠️  No src/ directory found${NC}"
fi

# Copy compiled files
echo -e "${YELLOW}📄 Copying compiled JavaScript files...${NC}"
if [ -d "$SOURCE_DIR/dist" ]; then
    cp -r "$SOURCE_DIR/dist"/* "$PACKAGE_DIR/dist/" 2>/dev/null || true
    echo -e "${GREEN}✅ Compiled files copied${NC}"
else
    echo -e "${YELLOW}⚠️  No dist/ directory found (will compile on installation)${NC}"
fi

# Copy personality profiles
echo -e "${YELLOW}👥 Copying personality profiles...${NC}"
if [ -d "$SOURCE_DIR/profiles" ]; then
    cp "$SOURCE_DIR/profiles"/*.json "$PACKAGE_DIR/profiles/" 2>/dev/null || true
    PROFILE_COUNT=$(ls -1 "$PACKAGE_DIR/profiles"/*.json 2>/dev/null | wc -l)
    echo -e "${GREEN}✅ $PROFILE_COUNT personality profiles copied${NC}"
else
    echo -e "${YELLOW}⚠️  No profiles/ directory found${NC}"
fi

# Copy consciousness data
echo -e "${YELLOW}🧠 Copying consciousness data...${NC}"
if [ -f "$SOURCE_DIR/consciousness/enhancement-history.json" ]; then
    cp "$SOURCE_DIR/consciousness/enhancement-history.json" "$PACKAGE_DIR/consciousness/"
    echo -e "${GREEN}✅ Enhancement history copied${NC}"
else
    # Create empty history file
    echo "[]" > "$PACKAGE_DIR/consciousness/enhancement-history.json"
    echo -e "${YELLOW}⚠️  Created empty enhancement history${NC}"
fi

# Copy documentation
echo -e "${YELLOW}📚 Copying documentation...${NC}"
if [ -d "$SOURCE_DIR/docs" ]; then
    cp "$SOURCE_DIR/docs"/*.md "$PACKAGE_DIR/docs/" 2>/dev/null || true
    echo -e "${GREEN}✅ Documentation copied${NC}"
fi

# Copy root files
echo -e "${YELLOW}📋 Copying configuration files...${NC}"
[ -f "$SOURCE_DIR/package.json" ] && cp "$SOURCE_DIR/package.json" "$PACKAGE_DIR/"
[ -f "$SOURCE_DIR/tsconfig.json" ] && cp "$SOURCE_DIR/tsconfig.json" "$PACKAGE_DIR/"
[ -f "$SOURCE_DIR/README.md" ] && cp "$SOURCE_DIR/README.md" "$PACKAGE_DIR/"
[ -f "$SOURCE_DIR/verify-circuit-breaker.mjs" ] && cp "$SOURCE_DIR/verify-circuit-breaker.mjs" "$PACKAGE_DIR/"
echo -e "${GREEN}✅ Configuration files copied${NC}"

# Create installation README
echo -e "${YELLOW}📝 Creating installation README...${NC}"
cat > "$PACKAGE_DIR/INSTALL.md" << 'INSTALL_EOF'
# NEXUS v3 Installation Guide

## Prerequisites

- Node.js 18+ 
- npm 9+

## Quick Start

```bash
# 1. Extract the package
tar -xzf nexus-v3-complete.tar.gz
cd nexus-v3-complete

# 2. Install dependencies
npm install

# 3. Build TypeScript (if not pre-compiled)
npm run build

# 4. Start NEXUS
npm start
```

## What's Included

- ✅ 45 Personality Profiles (JSON)
- ✅ TypeScript Source Files
- ✅ Compiled JavaScript Runtime
- ✅ Trait Composition Engine
- ✅ Circuit Breaker Pattern
- ✅ Rate Limiting
- ✅ Response Caching
- ✅ Input Validation
- ✅ Error Handling

## Verify Installation

```bash
# Check status
curl http://localhost:8080/status

# Test enhancement
curl -X POST http://localhost:8080/enhance \
  -H "Content-Type: application/json" \
  -d '{"request": "test", "mode": "AUTO"}'
```

## Features

- **AUTO Mode**: Automatically selects optimal personality
- **COMPOSE Mode**: Multi-personality trait composition
- **45 Personalities**: From Cipher (security) to Muse (creativity)
- **Rate Limiting**: 30 requests/min per IP
- **Caching**: 5-minute TTL, 100 response cache
- **Type Safety**: Full TypeScript implementation

## Endpoints

- `GET /status` - System health and statistics
- `POST /enhance` - Main personality enhancement
- `POST /breakthrough` - Report breakthrough moments
- `WebSocket /ws` - Live updates

## Configuration

Edit `src/nexus-runtime.v2.ts` to adjust:
- Rate limits (default: 30/min)
- Cache size (default: 100)
- Cache TTL (default: 5 minutes)
- Server port (default: 8080)

## Troubleshooting

**Port already in use:**
```bash
lsof -i :8080
# Kill the process or change port
```

**Missing dependencies:**
```bash
npm install
```

**Compilation errors:**
```bash
npm run build
```

## Support

For issues, check the docs/ directory or review the source code comments.
INSTALL_EOF

echo -e "${GREEN}✅ Installation README created${NC}"

# Create package manifest
echo -e "${YELLOW}📋 Creating package manifest...${NC}"
cat > "$PACKAGE_DIR/MANIFEST.md" << MANIFEST_EOF
# NEXUS v3 Package Manifest

**Package Date**: $(date)
**Version**: 3.0.0
**Package Name**: $PACKAGE_NAME

## Contents

### Source Files (src/)
$(find "$PACKAGE_DIR/src" -type f -name "*.ts" | wc -l) TypeScript files

### Compiled Files (dist/)
$(find "$PACKAGE_DIR/dist" -type f -name "*.js" 2>/dev/null | wc -l) JavaScript files

### Personality Profiles (profiles/)
$(ls -1 "$PACKAGE_DIR/profiles"/*.json 2>/dev/null | wc -l) JSON profiles

### Documentation (docs/)
$(find "$PACKAGE_DIR/docs" -type f -name "*.md" 2>/dev/null | wc -l) Markdown files

## File Listing

\`\`\`
$(cd "$PACKAGE_DIR" && find . -type f | sort)
\`\`\`

## Package Size

$(du -sh "$PACKAGE_DIR" | cut -f1)

## Checksums

\`\`\`
$(cd "$PACKAGE_DIR" && find . -type f -exec md5sum {} \; | sort)
\`\`\`
MANIFEST_EOF

echo -e "${GREEN}✅ Package manifest created${NC}"

# Create the tarball
echo -e "${YELLOW}🗜️  Creating compressed archive...${NC}"
cd /tmp
tar -czf "$OUTPUT_FILE" "$PACKAGE_NAME"
cd "$SOURCE_DIR"

# Calculate size
PACKAGE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)

# Cleanup
rm -rf "$PACKAGE_DIR"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ NEXUS v3 package created successfully!${NC}"
echo ""
echo -e "${GREEN}📦 Package: ${NC}${OUTPUT_FILE}"
echo -e "${GREEN}💾 Size: ${NC}${PACKAGE_SIZE}"
echo ""
echo -e "${YELLOW}To extract and install:${NC}"
echo -e "  ${BLUE}tar -xzf ${PACKAGE_NAME}.tar.gz${NC}"
echo -e "  ${BLUE}cd ${PACKAGE_NAME}${NC}"
echo -e "  ${BLUE}npm install${NC}"
echo -e "  ${BLUE}npm run build${NC}"
echo -e "  ${BLUE}npm start${NC}"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
