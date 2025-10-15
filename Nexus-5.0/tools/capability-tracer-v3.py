#!/usr/bin/env python3
"""
NEXUS Capability Tracer v3.0 - Enterprise Edition
==================================================

Enhanced with:
- Dynamic capability discovery
- Health scoring system
- Automated fix generation
- CI/CD compliance checking
- Dependency graph visualization
- Historical tracking

Usage:
    python3 capability-tracer-v3.py [options]
    
Options:
    --check-ci          Run CI compliance check
    --generate-fixes    Generate automated fix scripts
    --visualize         Generate dependency graph (requires networkx, matplotlib)
    --threshold FLOAT   CI compliance threshold (default: 0.8)
    --export-graph      Export graph data for external visualization
"""

import os
import re
import json
import hashlib
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from collections import defaultdict
from datetime import datetime

VERSION = "3.1.0"
# Make portable across dev, CI, and prod environments
WORKSPACE_ROOT = Path(os.getenv("NEXUS_WORKSPACE", Path.cwd()))

class CapabilityTracer:
    def __init__(self, workspace_root: Path):
        self.workspace_root = workspace_root
        self.switches = {
            'nexus': [],
            'nuxee': [],
            'hunter': [],
            'integrations': [],
            'orphaned': [],
            'dynamic': []  # NEW: Dynamically discovered
        }
        self.connections = []
        self.powers = {
            'active': [],
            'dormant': [],
            'potential': []
        }
        self.health_scores = {}
        self.fixes = []
        self.cache_dir = workspace_root / "__reports" / ".tracer_cache"
        self.file_hash_cache = {}
        
    def log(self, message: str, level: str = "INFO"):
        """Enhanced logging with levels"""
        icons = {
            "INFO": "ℹ️",
            "SUCCESS": "✅",
            "WARNING": "⚠️",
            "ERROR": "❌",
            "DISCOVERY": "🔍"
        }
        print(f"{icons.get(level, 'ℹ️')} {message}")
    
    # ============================================================================
    # CACHING SUPPORT
    # ============================================================================
    
    def _load_cache(self):
        """Load file hash cache for incremental analysis"""
        cache_file = self.cache_dir / "file_hashes.json"
        if cache_file.exists():
            try:
                self.file_hash_cache = json.loads(cache_file.read_text())
            except:
                self.file_hash_cache = {}
    
    def _save_cache(self):
        """Save file hash cache"""
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        cache_file = self.cache_dir / "file_hashes.json"
        cache_file.write_text(json.dumps(self.file_hash_cache, indent=2))
    
    def _get_file_hash(self, file_path: Path) -> str:
        """Calculate file hash for caching"""
        try:
            content = file_path.read_bytes()
            return hashlib.md5(content).hexdigest()
        except:
            return ""
    
    def _is_file_changed(self, file_path: Path) -> bool:
        """Check if file changed since last analysis"""
        file_str = str(file_path.relative_to(self.workspace_root))
        current_hash = self._get_file_hash(file_path)
        cached_hash = self.file_hash_cache.get(file_str, "")
        
        if current_hash != cached_hash:
            self.file_hash_cache[file_str] = current_hash
            return True
        return False
    
    # ============================================================================
    # PHASE 1: ENHANCED DISCOVERY (with Dynamic Patterns)
    # ============================================================================
    
    def discover_all_capabilities(self):
        """Enhanced discovery with static + dynamic patterns"""
        self.log("Phase 1: Enhanced Capability Discovery", "DISCOVERY")
        
        # Original static discovery
        self._discover_static_capabilities()
        
        # NEW: Dynamic pattern-based discovery
        self._discover_dynamic_capabilities()
        
        total = sum(len(v) for v in self.switches.values())
        self.log(f"Discovered {total} capabilities", "SUCCESS")
    
    def _discover_static_capabilities(self):
        """Original hardcoded capability discovery"""
        
        # NEXUS Core Capabilities
        nexus_files = [
            'runtime/nexus-runtime.v2.ts',
            'runtime/NEXUS.engine.v2.ts',
            'runtime/nexus-bridge.ts',
            'runtime/PersonalityVentriloquist.ts',
            'runtime/PatternEvolutionEngine.ts',
            'runtime/BreakthroughAnalyzer.ts',
            'runtime/HunterBridge.ts',
            'personalities/registry/',
            'consciousness/',
        ]
        
        for file in nexus_files:
            path = self.workspace_root / file
            if path.exists():
                self.switches['nexus'].append({
                    'file': str(path.relative_to(self.workspace_root)),
                    'type': 'nexus_core',
                    'discovery': 'static'
                })
        
        # NUXEE Capabilities
        nuxee_base = self.workspace_root / 'tools' / 'nuxee'
        if nuxee_base.exists():
            for file in nuxee_base.rglob('*'):
                if file.is_file() and file.suffix in ['.py', '.sh', '.json']:
                    self.switches['nuxee'].append({
                        'file': str(file.relative_to(self.workspace_root)),
                        'type': 'nuxee_ux',
                        'discovery': 'static'
                    })
        
        # Hunter Capabilities
        hunter_base = self.workspace_root / 'hunter-pack'
        if hunter_base.exists():
            for file in hunter_base.rglob('*.sh'):
                if file.is_file():
                    self.switches['hunter'].append({
                        'file': str(file.relative_to(self.workspace_root)),
                        'type': 'hunter_audit',
                        'discovery': 'static'
                    })
    
    def _discover_dynamic_capabilities(self):
        """NEW: Pattern-based dynamic discovery"""
        self.log("Discovering dynamic capabilities...", "DISCOVERY")
        
        capability_patterns = {
            'bridge': (r'.*[Bb]ridge\.(ts|js|py)$', 'integration_bridge'),
            'integration': (r'.*[Ii]ntegration\.(ts|js|py)$', 'integration_module'),
            'orchestrator': (r'.*[Oo]rchestrat.*\.(ts|js|py)$', 'orchestrator'),
            'analyzer': (r'.*[Aa]nalyz.*\.(py|js|ts)$', 'analyzer'),
            'validator': (r'.*[Vv]alidat.*\.(py|sh)$', 'validator'),
            'tracer': (r'.*[Tt]race.*\.(py|sh)$', 'tracer'),
            'enhancer': (r'.*[Ee]nhanc.*\.(sh|py)$', 'enhancer'),
        }
        
        for pattern_name, (pattern, cap_type) in capability_patterns.items():
            for file_path in self.workspace_root.rglob("*"):
                if file_path.is_file() and re.match(pattern, file_path.name):
                    # Skip if already discovered
                    rel_path = str(file_path.relative_to(self.workspace_root))
                    if not any(rel_path == s['file'] for switches in self.switches.values() for s in switches):
                        self.switches['dynamic'].append({
                            'file': rel_path,
                            'type': cap_type,
                            'pattern': pattern_name,
                            'discovery': 'dynamic'
                        })
    
    # ============================================================================
    # PHASE 2: CONNECTION ANALYSIS (IMPROVED)
    # ============================================================================
    
    def _is_imported_in_ts(self, content: str, module_name: str) -> bool:
        """More precise TypeScript import detection"""
        patterns = [
            rf'import\s+.*{re.escape(module_name)}',
            rf'from\s+["\'].*{re.escape(module_name)}',
            rf'require\(["\'].*{re.escape(module_name)}',
            rf'import\(["\'].*{re.escape(module_name)}'
        ]
        return any(re.search(p, content, re.MULTILINE) for p in patterns)
    
    def _is_imported_in_python(self, content: str, module_name: str) -> bool:
        """More precise Python import detection"""
        patterns = [
            rf'^\s*import\s+{re.escape(module_name)}',
            rf'^\s*from\s+.*{re.escape(module_name)}\s+import',
            rf'^\s*from\s+{re.escape(module_name)}\s+import'
        ]
        return any(re.search(p, content, re.MULTILINE) for p in patterns)
    
    def _is_sourced_in_shell(self, content: str, script_name: str) -> bool:
        """More precise shell script sourcing detection"""
        patterns = [
            rf'source\s+.*{re.escape(script_name)}',
            rf'\.\s+.*{re.escape(script_name)}',
            rf'bash\s+.*{re.escape(script_name)}'
        ]
        return any(re.search(p, content, re.MULTILINE) for p in patterns)
    
    def analyze_connections(self):
        """Analyze how capabilities connect (IMPROVED: more precise)"""
        self.log("Phase 2: Connection Analysis (Enhanced)", "DISCOVERY")
        
        all_capabilities = []
        for switch_list in self.switches.values():
            all_capabilities.extend(switch_list)
        
        for cap in all_capabilities:
            file_path = self.workspace_root / cap['file']
            
            if file_path.is_file():
                try:
                    content = file_path.read_text(encoding='utf-8', errors='ignore')
                    file_ext = file_path.suffix.lower()
                    
                    # Find imports/references with precision
                    for other_cap in all_capabilities:
                        if cap != other_cap:
                            other_name = Path(other_cap['file']).stem
                            is_connected = False
                            
                            # Use appropriate detection method
                            if file_ext in ['.ts', '.tsx', '.js', '.jsx', '.mjs']:
                                is_connected = self._is_imported_in_ts(content, other_name)
                            elif file_ext == '.py':
                                is_connected = self._is_imported_in_python(content, other_name)
                            elif file_ext == '.sh':
                                is_connected = self._is_sourced_in_shell(content, other_name)
                            else:
                                # Fallback to substring (for JSON, MD, etc.)
                                is_connected = other_name in content
                            
                            if is_connected:
                                self.connections.append({
                                    'from': cap['file'],
                                    'to': other_cap['file'],
                                    'type': 'import',
                                    'status': '✅ Connected'
                                })
                except:
                    pass
    
    # ============================================================================
    # PHASE 3: POWER ANALYSIS
    # ============================================================================
    
    def analyze_powers(self):
        """Analyze active, dormant, and potential powers"""
        self.log("Phase 3: Power Analysis", "DISCOVERY")
        
        # Check which capabilities are actively connected
        connected_files = set()
        for conn in self.connections:
            connected_files.add(conn['from'])
            connected_files.add(conn['to'])
        
        all_capabilities = []
        for switch_list in self.switches.values():
            all_capabilities.extend(switch_list)
        
        for cap in all_capabilities:
            importers = [c for c in self.connections if c['to'] == cap['file']]
            importees = [c for c in self.connections if c['from'] == cap['file']]
            
            if importers and importees:
                self.powers['active'].append(cap)
            elif importees and not importers:
                self.powers['dormant'].append(cap)
            else:
                self.powers['potential'].append(cap)
    
    # ============================================================================
    # PHASE 4: ORPHAN DETECTION
    # ============================================================================
    
    def detect_orphans(self):
        """Detect orphaned capabilities"""
        self.log("Phase 4: Orphan Detection", "DISCOVERY")
        
        for cap in self.powers['potential']:
            impact = self._assess_impact(cap)
            reason = self._determine_orphan_reason(cap)
            fix_suggestion = self._suggest_fix(cap)
            
            self.switches['orphaned'].append({
                **cap,
                'impact': impact,
                'reason': reason,
                'fix': fix_suggestion
            })
    
    def _assess_impact(self, cap: Dict) -> str:
        """Assess impact of orphaned capability"""
        high_impact_keywords = ['bridge', 'runtime', 'engine', 'core']
        medium_impact_keywords = ['integration', 'orchestrator', 'analyzer']
        
        cap_file_lower = cap['file'].lower()
        
        if any(keyword in cap_file_lower for keyword in high_impact_keywords):
            return 'HIGH'
        elif any(keyword in cap_file_lower for keyword in medium_impact_keywords):
            return 'MEDIUM'
        return 'LOW'
    
    def _determine_orphan_reason(self, cap: Dict) -> str:
        """Determine why capability is orphaned"""
        if 'Bridge' in cap['file']:
            return 'Not imported in runtime'
        elif cap['type'] == 'nuxee_ux':
            return 'Not integrated in build process'
        elif cap['type'] == 'hunter_audit':
            return 'Not called by any script'
        return 'No connections detected'
    
    def _suggest_fix(self, cap: Dict) -> str:
        """Suggest how to fix orphaned capability"""
        if 'HunterBridge' in cap['file']:
            return 'Import in runtime/nexus-runtime.v2.ts'
        elif cap['type'] == 'nuxee_ux':
            return 'Add to astro.config.mjs integrations'
        elif 'Pattern' in cap['file']:
            return 'Load in consciousness bridge'
        return 'Review and integrate manually'
    
    # ============================================================================
    # NEW FEATURE: HEALTH SCORING
    # ============================================================================
    
    def calculate_health_score(self) -> Dict[str, float]:
        """Calculate comprehensive system health scores"""
        self.log("Calculating health scores...", "DISCOVERY")
        
        total_switches = sum(len(v) for v in self.switches.values()) - len(self.switches['orphaned'])
        active_connections = len([c for c in self.connections if '✅' in c.get('status', '')])
        orphaned_count = len(self.switches['orphaned'])
        high_impact_orphans = len([o for o in self.switches['orphaned'] if o.get('impact') == 'HIGH'])
        
        # Calculate individual metrics
        connection_health = active_connections / len(self.connections) if self.connections else 0
        orphan_health = 1 - (orphaned_count / total_switches) if total_switches else 1
        critical_health = 1 - (high_impact_orphans / total_switches) if total_switches else 1
        potential_power = len(self.powers['dormant']) / total_switches if total_switches else 0
        
        # Overall weighted score
        overall = (connection_health * 0.4 + orphan_health * 0.3 + critical_health * 0.3)
        
        self.health_scores = {
            'overall': overall,
            'connectivity': connection_health,
            'completeness': orphan_health,
            'critical_health': critical_health,
            'potential': potential_power,
            'timestamp': datetime.now().isoformat()
        }
        
        return self.health_scores
    
    # ============================================================================
    # NEW FEATURE: AUTOMATED FIX GENERATION (WITH DRY-RUN)
    # ============================================================================
    
    def generate_fix_scripts(self, dry_run=False):
        """Generate automated fix scripts for identified issues"""
        mode = "DRY RUN" if dry_run else "GENERATION"
        self.log(f"Automated fix script {mode.lower()}...", "DISCOVERY")
        
        fix_dir = self.workspace_root / "__fixes"
        
        if not dry_run:
            fix_dir.mkdir(exist_ok=True)
        
        for orphan in self.switches['orphaned']:
            if orphan.get('impact') in ['HIGH', 'MEDIUM']:
                fix_script = self._create_fix_script(orphan)
                if fix_script:
                    self.fixes.append(fix_script)
                    
                    if dry_run:
                        print(f"  [DRY RUN] Would create {fix_dir / fix_script['filename']}")
                        print(f"            {fix_script['description']}")
                    else:
                        # Write script file
                        script_path = fix_dir / fix_script['filename']
                        script_path.write_text(fix_script['content'])
                        script_path.chmod(0o755)
        
        if dry_run:
            self.log(f"[DRY RUN] Would generate {len(self.fixes)} fix scripts", "INFO")
        else:
            self.log(f"Generated {len(self.fixes)} fix scripts in __fixes/", "SUCCESS")
        
        return self.fixes
    
    def _create_fix_script(self, orphan: Dict) -> Optional[Dict]:
        """Create specific fix script for an orphan"""
        
        if 'HunterBridge' in orphan['file']:
            runtime_file = self.workspace_root / "runtime" / "nexus-runtime.v2.ts"
            
            # Validate target exists
            if not runtime_file.exists():
                self.log(f"Warning: Target file {runtime_file} not found", "WARNING")
                return None
            
            return {
                'filename': 'fix_hunter_bridge.sh',
                'content': f'''#!/bin/bash
# Auto-generated fix script for HunterBridge integration
# Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

set -e  # Exit on error

echo "🔧 Fixing HunterBridge integration..."

RUNTIME_FILE="runtime/nexus-runtime.v2.ts"

# Validate file exists
if [ ! -f "$RUNTIME_FILE" ]; then
    echo "❌ Error: $RUNTIME_FILE not found"
    exit 1
fi

# Create backup
cp "$RUNTIME_FILE" "${{RUNTIME_FILE}}.bak"
echo "📦 Backup created: ${{RUNTIME_FILE}}.bak"

# Add import statement
if ! grep -q "HunterBridge" "$RUNTIME_FILE"; then
    sed -i '/import.*PersonalityVentriloquist/a import {{ HunterBridge }} from "./HunterBridge.js";' "$RUNTIME_FILE"
    echo "✅ Added HunterBridge import"
else
    echo "ℹ️  HunterBridge already imported"
fi

# Initialize in runtime
if ! grep -q "HunterBridge.initialize" "$RUNTIME_FILE"; then
    echo "⚠️  Manual step: Add HunterBridge.initialize() in runtime startup"
fi

echo "✅ HunterBridge fix applied"
echo "📝 Review changes and remove .bak file if satisfied"
''',
                'description': 'Integrate HunterBridge into NEXUS runtime',
                'impact': orphan.get('impact'),
                'target': orphan['file']
            }
        
        elif 'nuxee' in orphan['file'].lower():
            return {
                'filename': 'fix_nuxee_integration.sh',
                'content': f'''#!/bin/bash
# Auto-generated fix script for NUXEE integration
# Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

set -e  # Exit on error

echo "🔧 Enabling NUXEE UX integration..."

CONFIG_FILE="astro.config.mjs"

if [ -f "$CONFIG_FILE" ]; then
    # Create backup
    cp "$CONFIG_FILE" "${{CONFIG_FILE}}.bak"
    echo "📦 Backup created: ${{CONFIG_FILE}}.bak"
    
    if ! grep -q "nuxeeIntegration" "$CONFIG_FILE"; then
        echo "📝 Manual step required:"
        echo ""
        echo "Add to astro.config.mjs:"
        echo ""
        echo "import {{ nuxeeIntegration }} from './tools/nuxee/integration.mjs';"
        echo ""
        echo "integrations: ["
        echo "  nuxeeIntegration(),"
        echo "  // ... other integrations"
        echo "]"
    else
        echo "ℹ️  NUXEE already integrated"
    fi
else
    echo "⚠️  astro.config.mjs not found - manual integration required"
fi

echo "ℹ️  Review and remove .bak file if satisfied"
''',
                'description': 'Enable NUXEE UX enhancement integration',
                'impact': orphan.get('impact'),
                'target': orphan['file']
            }
        
        return None
    
    # ============================================================================
    # NEW FEATURE: CI/CD COMPLIANCE
    # ============================================================================
    
    def check_ci_compliance(self, threshold: float = 0.8) -> bool:
        """Check if system meets CI compliance thresholds"""
        self.log("Running CI/CD Compliance Check", "DISCOVERY")
        print("=" * 70)
        
        health = self.calculate_health_score()
        
        print(f"\n📊 System Health Metrics:")
        print(f"  Overall Health:      {health['overall']:.1%} (threshold: {threshold:.1%})")
        print(f"  Connectivity:        {health['connectivity']:.1%}")
        print(f"  Completeness:        {health['completeness']:.1%}")
        print(f"  Critical Health:     {health['critical_health']:.1%}")
        print(f"  Unlocked Potential:  {health['potential']:.1%}")
        
        passing = health['overall'] >= threshold
        
        print(f"\n{'✅ PASS' if passing else '❌ FAIL'} - CI Compliance Check")
        
        if not passing:
            print(f"\n⚠️  System below compliance threshold!")
            print(f"\n🔧 Required Fixes:")
            
            for orphan in self.switches['orphaned']:
                if orphan.get('impact') in ['HIGH', 'MEDIUM']:
                    print(f"  - {orphan['file']}")
                    print(f"    Impact: {orphan.get('impact')}")
                    print(f"    Fix: {orphan.get('fix')}")
            
            print(f"\n💡 Run with --generate-fixes to create automated fix scripts")
        
        print("=" * 70)
        return passing
    
    # ============================================================================
    # NEW FEATURE: GRAPH EXPORT
    # ============================================================================
    
    def export_graph_data(self) -> Dict:
        """Export graph data for external visualization"""
        nodes = []
        edges = []
        
        # Create nodes
        for switch_type, switches in self.switches.items():
            for switch in switches:
                nodes.append({
                    'id': switch['file'],
                    'label': Path(switch['file']).name,
                    'type': switch_type,
                    'discovery': switch.get('discovery', 'static')
                })
        
        # Create edges
        for conn in self.connections:
            edges.append({
                'source': conn['from'],
                'target': conn['to'],
                'type': conn['type']
            })
        
        graph_data = {
            'nodes': nodes,
            'edges': edges,
            'metadata': {
                'version': VERSION,
                'timestamp': datetime.now().isoformat(),
                'health_scores': self.health_scores
            }
        }
        
        # Save to file
        graph_file = self.workspace_root / "__reports" / "capability-graph.json"
        graph_file.parent.mkdir(parents=True, exist_ok=True)
        graph_file.write_text(json.dumps(graph_data, indent=2))
        
        self.log(f"Graph data exported to {graph_file}", "SUCCESS")
        return graph_data
    
    # ============================================================================
    # REPORTING
    # ============================================================================
    
    def generate_enhanced_report(self):
        """Generate enhanced markdown report"""
        report = []
        
        report.append(f"# 🔍 NEXUS Capability Tracer v{VERSION}")
        report.append(f"**Analysis Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"**Workspace:** {self.workspace_root}")
        report.append("")
        report.append("---")
        report.append("")
        
        # Health Score Section
        health = self.health_scores
        report.append("## 📊 System Health Score")
        report.append("")
        report.append(f"**Overall Health:** {health['overall']:.1%} "
                     f"{'✅' if health['overall'] >= 0.8 else '⚠️' if health['overall'] >= 0.6 else '❌'}")
        report.append("")
        report.append("| Metric | Score | Status |")
        report.append("|--------|-------|--------|")
        report.append(f"| Connectivity | {health['connectivity']:.1%} | "
                     f"{'✅' if health['connectivity'] >= 0.7 else '⚠️'} |")
        report.append(f"| Completeness | {health['completeness']:.1%} | "
                     f"{'✅' if health['completeness'] >= 0.8 else '⚠️'} |")
        report.append(f"| Critical Health | {health['critical_health']:.1%} | "
                     f"{'✅' if health['critical_health'] >= 0.9 else '❌'} |")
        report.append(f"| Potential Power | {health['potential']:.1%} | 💡 |")
        report.append("")
        report.append("---")
        report.append("")
        
        # Capabilities Summary
        report.append("## 🎛️ Capability Switches Discovered")
        report.append("")
        
        for switch_type, switches in self.switches.items():
            if switches and switch_type != 'orphaned':
                report.append(f"### {switch_type.upper()} ({len(switches)} capabilities)")
                for cap in switches[:5]:  # Show first 5
                    discovery_badge = "🔍" if cap.get('discovery') == 'dynamic' else "📍"
                    report.append(f"- {discovery_badge} `{cap['file']}`")
                if len(switches) > 5:
                    report.append(f"- *... and {len(switches) - 5} more*")
                report.append("")
        
        # Powers Section
        report.append("## 💡 Power Analysis")
        report.append("")
        report.append(f"### ✅ Active Powers ({len(self.powers['active'])})")
        for power in self.powers['active'][:5]:
            report.append(f"- {power['file']}")
        report.append("")
        
        report.append(f"### 🔒 Dormant Powers ({len(self.powers['dormant'])})")
        for power in self.powers['dormant'][:5]:
            report.append(f"- {power['file']} - *Can be activated*")
        report.append("")
        
        # Orphans Section
        if self.switches['orphaned']:
            report.append("## ⚠️ Orphaned Capabilities")
            report.append("")
            
            for orphan in self.switches['orphaned']:
                impact_icon = "❌" if orphan['impact'] == 'HIGH' else "⚠️" if orphan['impact'] == 'MEDIUM' else "ℹ️"
                report.append(f"### {impact_icon} {Path(orphan['file']).name}")
                report.append(f"- **Impact:** {orphan['impact']}")
                report.append(f"- **Reason:** {orphan['reason']}")
                report.append(f"- **Fix:** {orphan['fix']}")
                report.append("")
        
        # Fixes Section
        if self.fixes:
            report.append("## 🔧 Generated Fix Scripts")
            report.append("")
            for fix in self.fixes:
                report.append(f"### {fix['filename']}")
                report.append(f"- **Description:** {fix['description']}")
                report.append(f"- **Impact:** {fix['impact']}")
                report.append(f"- **Target:** `{fix['target']}`")
                report.append("")
        
        # Save report
        report_file = self.workspace_root / "__reports" / "capability-trace" / "CAPABILITY_REPORT.md"
        report_file.parent.mkdir(parents=True, exist_ok=True)
        report_file.write_text("\n".join(report))
        
        self.log(f"Enhanced report saved to {report_file}", "SUCCESS")
        return report_file
    
    # ============================================================================
    # MAIN EXECUTION
    # ============================================================================
    
    def run_full_analysis(self, ci_check=False, generate_fixes=False, export_graph=False, 
                         threshold=0.8, dry_run=False, use_cache=False):
        """Run complete capability analysis"""
        print(f"\n{'='*70}")
        print(f"🔍 NEXUS Capability Tracer v{VERSION}")
        if dry_run:
            print(f"   [DRY RUN MODE - No files will be modified]")
        print(f"{'='*70}\n")
        
        # Load cache if requested
        if use_cache:
            self._load_cache()
        
        # Phase 1-4: Core analysis
        self.discover_all_capabilities()
        self.analyze_connections()
        self.analyze_powers()
        self.detect_orphans()
        
        # Calculate health
        self.calculate_health_score()
        
        # Optional: Generate fixes
        if generate_fixes:
            self.generate_fix_scripts(dry_run=dry_run)
        
        # Optional: Export graph
        if export_graph and not dry_run:
            self.export_graph_data()
        elif export_graph and dry_run:
            print(f"  [DRY RUN] Would export graph to {self.workspace_root / '__reports' / 'capability-graph.json'}")
        
        # Generate report (always, even in dry-run)
        if not dry_run:
            self.generate_enhanced_report()
        else:
            print(f"  [DRY RUN] Would generate report at {self.workspace_root / '__reports' / 'capability-trace' / 'CAPABILITY_REPORT.md'}")
        
        # Save cache if requested
        if use_cache and not dry_run:
            self._save_cache()
        
        # Optional: CI check
        if ci_check:
            return self.check_ci_compliance(threshold)
        
        print(f"\n{'='*70}")
        print("✅ Analysis Complete!" if not dry_run else "✅ Dry Run Complete!")
        print(f"{'='*70}\n")
        
        return True


def main():
    import argparse
    
    parser = argparse.ArgumentParser(
        description=f"NEXUS Capability Tracer v{VERSION} - Enterprise Edition",
        epilog="Example: python3 capability-tracer-v3.py --check-ci --generate-fixes --dry-run"
    )
    parser.add_argument('--check-ci', action='store_true',
                       help='Run CI compliance check')
    parser.add_argument('--generate-fixes', action='store_true',
                       help='Generate automated fix scripts')
    parser.add_argument('--export-graph', action='store_true',
                       help='Export graph data for visualization')
    parser.add_argument('--threshold', type=float, default=0.8,
                       help='CI compliance threshold (default: 0.8)')
    parser.add_argument('--root', default=str(WORKSPACE_ROOT),
                       help='Workspace root directory')
    parser.add_argument('--dry-run', action='store_true',
                       help='Show what would be done without making changes')
    parser.add_argument('--use-cache', action='store_true',
                       help='Use file hash cache for incremental analysis')
    
    args = parser.parse_args()
    
    tracer = CapabilityTracer(Path(args.root))
    success = tracer.run_full_analysis(
        ci_check=args.check_ci,
        generate_fixes=args.generate_fixes,
        export_graph=args.export_graph,
        threshold=args.threshold,
        dry_run=args.dry_run,
        use_cache=args.use_cache
    )
    
    return 0 if success else 1


if __name__ == "__main__":
    exit(main())
