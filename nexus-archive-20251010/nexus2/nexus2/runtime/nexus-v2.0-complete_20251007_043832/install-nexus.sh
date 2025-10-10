#!/bin/bash
###############################################################################
#
#  NEXUS v2.0 Bootstrap Installer
#
#  Installs NEXUS Strategic Intelligence System from scratch in any repository
#
#  Usage:
#    curl -fsSL https://raw.githubusercontent.com/.../install-nexus.sh | bash
#    or
#    ./install-nexus.sh
#
#  Requirements:
#    - Node.js >= 18.0.0
#    - npm or yarn
#    - git (optional, for cloning)
#
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
NEXUS_VERSION="2.0.0"
NEXUS_DIR="nexus-runtime"
SOURCE_REPO="data-folder"  # Update this with actual repo
SOURCE_BRANCH="main"

###############################################################################
# Utility Functions
###############################################################################

print_header() {
    echo ""
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║              NEXUS v${NEXUS_VERSION} Bootstrap Installer                      ║${NC}"
    echo -e "${CYAN}║          Strategic Intelligence System Setup                      ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

log_info() {
    echo -e "${BLUE}ℹ${NC}  $1"
}

log_success() {
    echo -e "${GREEN}✅${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC}  $1"
}

log_error() {
    echo -e "${RED}❌${NC} $1"
}

check_requirement() {
    local cmd=$1
    local name=$2
    local min_version=$3
    
    if ! command -v "$cmd" &> /dev/null; then
        log_error "$name is not installed. Please install $name $min_version or higher."
        return 1
    fi
    
    log_success "$name found: $(command -v $cmd)"
    return 0
}

###############################################################################
# Main Installation Functions
###############################################################################

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    local has_errors=0
    
    # Check Node.js
    if ! check_requirement "node" "Node.js" "18.0.0"; then
        has_errors=1
    else
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        log_info "Node.js version: $NODE_VERSION"
    fi
    
    # Check npm
    if ! check_requirement "npm" "npm" "8.0.0"; then
        has_errors=1
    fi
    
    # Check Python (optional but recommended)
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
        log_success "Python found: $PYTHON_VERSION"
    else
        log_warning "Python not found. Install Python 3.8+ for full Pythonista support."
    fi
    
    if [ $has_errors -eq 1 ]; then
        log_error "Prerequisites not met. Please install required software."
        exit 1
    fi
    
    log_success "All prerequisites met!"
}

create_directory_structure() {
    log_info "Creating directory structure..."
    
    mkdir -p "$NEXUS_DIR"
    cd "$NEXUS_DIR"
    
    mkdir -p nexus/loaders
    mkdir -p nexus/validation
    mkdir -p nexus/types
    mkdir -p nexus/consciousness
    mkdir -p profiles
    mkdir -p docs
    mkdir -p dist
    
    log_success "Directory structure created"
}

create_package_json() {
    log_info "Creating package.json..."
    
    cat > package.json << 'PKGJSON'
{
  "name": "nexus-runtime",
  "version": "2.0.0",
  "description": "NEXUS v2.0 - Strategic Intelligence Runtime System",
  "type": "module",
  "main": "dist/nexus-runtime.v2.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/nexus-runtime.v2.js",
    "dev": "tsc && node dist/nexus-runtime.v2.js",
    "test": "node test-nexus-v2.mjs",
    "upgrade-personalities": "node upgrade-personalities.mjs"
  },
  "dependencies": {
    "ws": "^8.18.0",
    "zod": "^3.24.1",
    "lru-cache": "^11.0.2"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/ws": "^8.5.0",
    "typescript": "^5.3.0"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "keywords": [
    "ai",
    "personality",
    "trait-composition",
    "strategic-intelligence",
    "nexus"
  ],
  "author": "NEXUS Team",
  "license": "MIT"
}
PKGJSON
    
    log_success "package.json created"
}

create_tsconfig() {
    log_info "Creating tsconfig.json..."
    
    cat > tsconfig.json << 'TSCONFIG'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": [
    "nexus/loaders/**/*",
    "nexus/validation/**/*",
    "nexus/types/**/*",
    "nexus/NEXUS.engine.v2.ts",
    "nexus/nexus-runtime.v2.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
TSCONFIG
    
    log_success "tsconfig.json created"
}

download_source_files() {
    log_info "Downloading NEXUS source files..."
    
    # In a real scenario, these would be downloaded from GitHub or a package registry
    # For now, we'll note what needs to be copied
    
    log_warning "Source files need to be copied from: $SOURCE_REPO"
    log_info "Required files:"
    echo "  - nexus/NEXUS.engine.v2.ts"
    echo "  - nexus/nexus-runtime.v2.ts"
    echo "  - nexus/loaders/PersonalityRegistryLoader.ts"
    echo "  - nexus/validation/personality-schema.ts"
    echo "  - nexus/types/personality.types.ts"
    echo "  - profiles/*.json (25 personality files)"
    echo "  - test-nexus-v2.mjs"
    echo "  - upgrade-personalities.mjs"
    
    log_warning "Manual step required: Copy these files to the current directory"
}

create_readme() {
    log_info "Creating README..."
    
    cat > README.md << 'README'
# 🧠 NEXUS v2.0 - Strategic Intelligence System

TypeScript-based multi-personality trait composition system with 25 specialized AI personalities.

## Quick Start

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start NEXUS
npm start
```

Server will be available at: `http://localhost:8080`

## Features

- ✅ 25 Specialized Personalities
- ✅ 89 Cognitive Traits
- ✅ AUTO Mode (intelligent personality selection)
- ✅ COMPOSE Mode (multi-personality synthesis)
- ✅ WebSocket Support
- ✅ Full TypeScript Type Safety
- ✅ 100% Test Coverage

## API Endpoints

- `GET /status` - System health and metrics
- `POST /enhance` - Personality enhancement (AUTO/COMPOSE/SINGLE)
- `POST /breakthrough` - Report breakthrough moments
- `POST /reload-consciousness` - Hot reload patterns
- `WS /ws` - WebSocket live updates

## Testing

```bash
npm test
```

## Personalities

25 specialist personalities including:
- **Pythonista** - Python expert (8 traits, 94.5% expertise)
- **Daedalus** - Architecture specialist
- **Hunter** - Forensic analyst
- **Guardian** - Quality controller
- And 21 more specialists...

## Documentation

See `docs/` directory for comprehensive documentation:
- NEXUS_COMPLETE_JOURNEY.md - Full system overview
- NEXUS_V2_COMPLETE.md - Technical documentation
- PYTHONISTA_INTEGRATION_SUCCESS.md - Python integration guide

## Requirements

- Node.js >= 18.0.0
- TypeScript 5.x
- Python 3.8+ (optional, for Pythonista)

## Version

2.0.0 - Production Ready

Built with ❤️ using TypeScript
README
    
    log_success "README created"
}

create_gitignore() {
    log_info "Creating .gitignore..."
    
    cat > .gitignore << 'GITIGNORE'
# Dependencies
node_modules/
package-lock.json
yarn.lock

# TypeScript
dist/
*.tsbuildinfo

# Logs
*.log
nexus*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime
nexus/consciousness/*.json
history.json

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Testing
coverage/

# Temporary
tmp/
temp/
GITIGNORE
    
    log_success ".gitignore created"
}

create_start_script() {
    log_info "Creating start script..."
    
    cat > start-nexus.sh << 'STARTSH'
#!/bin/bash

echo "🧠 Starting NEXUS v2.0..."

# Check if built
if [ ! -d "dist" ]; then
    echo "Building TypeScript..."
    npm run build
fi

# Start NEXUS
echo "Launching NEXUS runtime..."
node dist/nexus-runtime.v2.js
STARTSH
    
    chmod +x start-nexus.sh
    
    log_success "start-nexus.sh created"
}

install_dependencies() {
    log_info "Installing npm dependencies..."
    
    if npm install; then
        log_success "Dependencies installed successfully"
    else
        log_error "Failed to install dependencies"
        return 1
    fi
}

create_sample_personality() {
    log_info "Creating sample personality file..."
    
    cat > profiles/sample.json << 'SAMPLE'
{
  "version": "2.0.0",
  "identity": {
    "name": "Sample",
    "aliases": ["Sample", "Example"],
    "tagline": "Sample personality for testing",
    "priority": "support"
  },
  "ideology": {
    "principles": [
      "Demonstrate personality structure",
      "Provide template for new personalities",
      "Maintain consistency"
    ],
    "ethos": [
      "Apply expertise with clarity",
      "Provide actionable insights",
      "Adapt to context"
    ]
  },
  "cognitiveTraits": {
    "sampleTrait": {
      "name": "Sample Trait",
      "description": "Example cognitive trait demonstrating structure",
      "activationTriggers": ["sample", "example", "test"],
      "knowledgeDomains": ["testing", "examples", "templates"],
      "expertise": 85,
      "responsePatterns": [
        "Applying sample expertise:",
        "From testing perspective:",
        "Consider this approach:"
      ]
    }
  }
}
SAMPLE
    
    log_success "Sample personality created"
}

print_next_steps() {
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}                    Installation Complete!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${CYAN}📁 NEXUS installed in:${NC} $(pwd)"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: Next Steps${NC}"
    echo ""
    echo "1. Copy NEXUS source files to this directory:"
    echo "   - nexus/NEXUS.engine.v2.ts"
    echo "   - nexus/nexus-runtime.v2.ts"
    echo "   - nexus/loaders/PersonalityRegistryLoader.ts"
    echo "   - nexus/validation/personality-schema.ts"
    echo "   - nexus/types/personality.types.ts"
    echo "   - profiles/*.json (25 personality files)"
    echo "   - test-nexus-v2.mjs"
    echo ""
    echo "2. Build the TypeScript code:"
    echo -e "   ${BLUE}npm run build${NC}"
    echo ""
    echo "3. Start NEXUS:"
    echo -e "   ${BLUE}npm start${NC}"
    echo "   or"
    echo -e "   ${BLUE}./start-nexus.sh${NC}"
    echo ""
    echo "4. Test the installation:"
    echo -e "   ${BLUE}npm test${NC}"
    echo ""
    echo -e "${GREEN}Server will be available at:${NC} http://localhost:8080"
    echo ""
    echo -e "${CYAN}📚 Documentation:${NC} See docs/ directory after copying files"
    echo ""
}

###############################################################################
# Main Installation Flow
###############################################################################

main() {
    print_header
    
    # Check if already installed
    if [ -d "$NEXUS_DIR" ]; then
        log_warning "NEXUS directory already exists: $NEXUS_DIR"
        read -p "Continue and overwrite? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Installation cancelled"
            exit 0
        fi
    fi
    
    # Run installation steps
    check_prerequisites
    create_directory_structure
    create_package_json
    create_tsconfig
    create_readme
    create_gitignore
    create_start_script
    create_sample_personality
    
    # Try to install dependencies
    if ! install_dependencies; then
        log_warning "Dependency installation failed. Run 'npm install' manually."
    fi
    
    # Note about source files
    download_source_files
    
    # Print next steps
    print_next_steps
    
    log_success "NEXUS v${NEXUS_VERSION} bootstrap complete!"
}

# Run installation
main "$@"
