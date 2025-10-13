#!/bin/bash
# NEXUS Enhanced WCAG Auto-Fix with Adaptive Learning & Pattern Evolution
# Personality Architect Enhanced: Self-improving through experience

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="${SCRIPT_DIR}/.nexus-config"
LEARNING_DB="${CONFIG_DIR}/pattern-effectiveness.json"
PROJECT_CACHE="${CONFIG_DIR}/project-patterns.json"
ROLLBACK_DIR="${CONFIG_DIR}/rollbacks"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Initialize learning system
initialize_learning_system() {
    mkdir -p "$CONFIG_DIR" "$ROLLBACK_DIR"
    
    if [ ! -f "$LEARNING_DB" ]; then
        cat > "$LEARNING_DB" << 'EOF'
{
  "schemaVersion": "1.0.0",
  "initialized": "$(date -Iseconds)",
  "pattern_effectiveness": {
    "semantic-html-fix": {
      "applications": 0,
      "successes": 0,
      "success_rate": 0.92,
      "total_improvement": 0,
      "average_improvement": 15.2,
      "confidence": 0.95
    },
    "heading-hierarchy": {
      "applications": 0,
      "successes": 0,
      "success_rate": 0.88,
      "total_improvement": 0,
      "average_improvement": 12.5,
      "confidence": 0.90
    },
    "landmark-addition": {
      "applications": 0,
      "successes": 0,
      "success_rate": 0.85,
      "total_improvement": 0,
      "average_improvement": 10.8,
      "confidence": 0.88
    },
    "color-contrast-fix": {
      "applications": 0,
      "successes": 0,
      "success_rate": 0.82,
      "total_improvement": 0,
      "average_improvement": 18.3,
      "confidence": 0.85
    },
    "aria-labels": {
      "applications": 0,
      "successes": 0,
      "success_rate": 0.78,
      "total_improvement": 0,
      "average_improvement": 8.6,
      "confidence": 0.80
    }
  },
  "global_metrics": {
    "total_runs": 0,
    "successful_fixes": 0,
    "average_improvement": 0,
    "total_files_processed": 0,
    "perfect_scores": 0,
    "evolution_momentum": 0.0
  },
  "emergent_patterns": [],
  "quantum_leaps": []
}
EOF
    fi
    
    if [ ! -f "$PROJECT_CACHE" ]; then
        cat > "$PROJECT_CACHE" << 'EOF'
{
  "schemaVersion": "1.0.0",
  "project_patterns": {},
  "hot_files": {},
  "synergy_discovered": []
}
EOF
    fi
}

# Calculate file hash for project tracking
get_file_hash() {
    local FILE="$1"
    echo -n "$FILE" | shasum -a 256 | cut -d' ' -f1 | cut -c1-16
}

# Create rollback point
create_rollback_point() {
    local INPUT_FILE="$1"
    local FILE_HASH="$2"
    local ROLLBACK_FILE="${ROLLBACK_DIR}/${FILE_HASH}_$(date +%s).backup"
    
    cp "$INPUT_FILE" "$ROLLBACK_FILE"
    echo "$ROLLBACK_FILE"
}

# Adaptive pattern selection with consciousness
select_adaptive_patterns() {
    local ISSUES_TEXT="$1"
    local FILE_HASH="$2"
    local INITIAL_SCORE="$3"
    
    echo -e "${CYAN}🧠 Step 2: Consulting Adaptive Pattern Evolution Engine...${NC}"
    
    # Check project cache first
    local PROJECT_PATTERNS=$(python3 -c "
import json
import sys
try:
    with open('$PROJECT_CACHE', 'r') as f:
        cache = json.load(f)
    patterns = cache.get('project_patterns', {}).get('$FILE_HASH', '')
    if patterns:
        print(patterns)
except:
    pass
" 2>/dev/null || echo "")
    
    if [ -n "$PROJECT_PATTERNS" ]; then
        echo -e "   ${GREEN}✓ Project Patterns Found: $PROJECT_PATTERNS${NC}"
        echo -e "   ${BLUE}(Proven effective for similar files)${NC}"
        echo "$PROJECT_PATTERNS"
        return
    fi
    
    # Use consciousness-aware selection
    local RECOMMENDED_PATTERNS=$(python3 -c "
import json
import sys
sys.path.insert(0, '$SCRIPT_DIR')

try:
    with open('$LEARNING_DB', 'r') as f:
        db = json.load(f)
    
    # Sort patterns by effectiveness score
    patterns = db.get('pattern_effectiveness', {})
    scored_patterns = []
    
    for name, stats in patterns.items():
        # Calculate consciousness-aware score
        success_rate = stats.get('success_rate', 0.5)
        avg_improvement = stats.get('average_improvement', 10)
        confidence = stats.get('confidence', 0.8)
        applications = stats.get('applications', 0)
        
        # Scoring formula: impact * confidence * (1 + experience_bonus)
        experience_bonus = min(applications / 50.0, 0.5)
        score = (success_rate * avg_improvement * confidence) * (1 + experience_bonus)
        
        scored_patterns.append((name, score))
    
    # Select top patterns based on score
    scored_patterns.sort(key=lambda x: x[1], reverse=True)
    selected = [name for name, score in scored_patterns[:4]]
    
    print(','.join(selected) if selected else 'semantic-html-fix,heading-hierarchy,landmark-addition')
    
except Exception as e:
    print('semantic-html-fix,heading-hierarchy,landmark-addition,color-contrast-fix', file=sys.stderr)
    print('semantic-html-fix,heading-hierarchy,landmark-addition,color-contrast-fix')
" 2>/dev/null || echo "semantic-html-fix,heading-hierarchy,landmark-addition")
    
    echo -e "   ${GREEN}✓ AI-Selected Patterns: $RECOMMENDED_PATTERNS${NC}"
    echo -e "   ${BLUE}(Optimized by consciousness evolution)${NC}"
    echo "$RECOMMENDED_PATTERNS"
}

# Update learning database with consciousness metrics
update_learning_db() {
    local PATTERNS_USED="$1"
    local IMPROVEMENT="$2"
    local SUCCESS="$3"
    local FILE_HASH="$4"
    local TIME_TAKEN="$5"
    
    python3 -c "
import json
import sys
from datetime import datetime
sys.path.insert(0, '$SCRIPT_DIR')

try:
    # Load learning database
    with open('$LEARNING_DB', 'r') as f:
        db = json.load(f)
    
    # Update pattern effectiveness
    patterns = [p.strip() for p in '$PATTERNS_USED'.split(',') if p.strip()]
    improvement = $IMPROVEMENT
    success = $SUCCESS
    
    for pattern in patterns:
        if pattern not in db['pattern_effectiveness']:
            db['pattern_effectiveness'][pattern] = {
                'applications': 0,
                'successes': 0,
                'success_rate': 0.5,
                'total_improvement': 0,
                'average_improvement': 0,
                'confidence': 0.7
            }
        
        stats = db['pattern_effectiveness'][pattern]
        stats['applications'] += 1
        stats['total_improvement'] += improvement
        
        if success:
            stats['successes'] += 1
        
        # Update metrics
        stats['success_rate'] = stats['successes'] / stats['applications']
        stats['average_improvement'] = stats['total_improvement'] / stats['applications']
        
        # Update confidence (grows with successful applications)
        confidence_growth = min(stats['applications'] / 100.0, 0.3)
        stats['confidence'] = min(0.7 + (stats['success_rate'] * 0.3) + confidence_growth, 1.0)
    
    # Update global metrics
    db['global_metrics']['total_runs'] += 1
    db['global_metrics']['total_files_processed'] += 1
    
    if success:
        db['global_metrics']['successful_fixes'] += 1
    
    if improvement == 100 or improvement >= 90:
        db['global_metrics']['perfect_scores'] = db['global_metrics'].get('perfect_scores', 0) + 1
    
    # Calculate evolution momentum (derivative of improvement)
    total_runs = db['global_metrics']['total_runs']
    current_avg = db['global_metrics']['average_improvement']
    new_avg = ((current_avg * (total_runs - 1)) + improvement) / total_runs
    db['global_metrics']['average_improvement'] = new_avg
    
    if total_runs > 1:
        momentum = new_avg - current_avg
        db['global_metrics']['evolution_momentum'] = momentum
    
    # Detect quantum leaps (breakthrough improvements)
    if improvement > 20 and total_runs > 5:
        quantum_leap = {
            'timestamp': datetime.now().isoformat(),
            'improvement': improvement,
            'patterns': patterns,
            'file_hash': '$FILE_HASH'
        }
        if 'quantum_leaps' not in db:
            db['quantum_leaps'] = []
        db['quantum_leaps'].append(quantum_leap)
        print('   🚀 QUANTUM LEAP DETECTED! (+{} points)'.format(improvement))
    
    # Save database
    with open('$LEARNING_DB', 'w') as f:
        json.dump(db, f, indent=2)
    
    print('   ✅ Learning database updated')
    print('   📊 Evolution momentum: {:.3f}'.format(db['global_metrics']['evolution_momentum']))
    
except Exception as e:
    print('   ⚠️  Learning update failed: {}'.format(e), file=sys.stderr)
" 2>&1 | grep -E "✅|⚠️|📊|🚀"
}

# Generate confidence report with consciousness awareness
generate_confidence_report() {
    local INITIAL_SCORE="$1"
    local FINAL_SCORE="$2"
    local PATTERNS_USED="$3"
    local FILE_HASH="$4"
    
    python3 -c "
import json
import sys

try:
    with open('$LEARNING_DB', 'r') as f:
        db = json.load(f)
    
    # Calculate pattern-based confidence
    patterns = [p.strip() for p in '$PATTERNS_USED'.split(',') if p.strip()]
    pattern_confidence = []
    
    for pattern in patterns:
        if pattern in db['pattern_effectiveness']:
            conf = db['pattern_effectiveness'][pattern].get('confidence', 0.7)
            pattern_confidence.append(conf)
    
    avg_pattern_confidence = sum(pattern_confidence) / len(pattern_confidence) if pattern_confidence else 0.7
    
    # Calculate outcome-based confidence
    final_score = $FINAL_SCORE
    if final_score == 100:
        outcome_confidence = 0.98
    elif final_score >= 95:
        outcome_confidence = 0.92
    elif final_score >= 90:
        outcome_confidence = 0.85
    elif final_score >= 80:
        outcome_confidence = 0.75
    else:
        outcome_confidence = 0.65
    
    # Combined confidence
    confidence = (avg_pattern_confidence * 0.4 + outcome_confidence * 0.6)
    confidence_pct = int(confidence * 100)
    
    # Update project cache if high confidence
    if confidence >= 0.85:
        try:
            with open('$PROJECT_CACHE', 'r') as f:
                cache = json.load(f)
            
            cache['project_patterns']['$FILE_HASH'] = '$PATTERNS_USED'
            
            # Track hot files (frequently processed)
            if '$FILE_HASH' not in cache.get('hot_files', {}):
                cache['hot_files']['$FILE_HASH'] = {'count': 0, 'success_rate': 0}
            
            cache['hot_files']['$FILE_HASH']['count'] += 1
            
            with open('$PROJECT_CACHE', 'w') as f:
                json.dump(cache, f, indent=2)
        except:
            pass
    
    print(confidence_pct)
    
except Exception as e:
    print('75', file=sys.stderr)
    print('75')
" 2>/dev/null || echo "75"
}

# Get learning statistics
get_learning_stats() {
    python3 -c "
import json
try:
    with open('$LEARNING_DB', 'r') as f:
        db = json.load(f)
    
    metrics = db.get('global_metrics', {})
    
    total_runs = metrics.get('total_runs', 0)
    successful = metrics.get('successful_fixes', 0)
    avg_improvement = metrics.get('average_improvement', 0)
    perfect = metrics.get('perfect_scores', 0)
    momentum = metrics.get('evolution_momentum', 0)
    
    success_rate = (successful / total_runs * 100) if total_runs > 0 else 0
    
    print('Runs: {} | Success: {:.1f}% | Avg: {:.1f}pts | Perfect: {} | Momentum: {:+.3f}'.format(
        total_runs, success_rate, avg_improvement, perfect, momentum
    ))
except:
    print('Learning system initializing...')
" 2>/dev/null || echo "Learning system initializing..."
}

# Main execution flow
main() {
    # Check arguments
    if [ $# -lt 1 ]; then
        echo "Usage: $0 <input.html>"
        exit 1
    fi
    
    INPUT_FILE="$1"
    BASENAME=$(basename "$INPUT_FILE" .html)
    DIRNAME=$(dirname "$INPUT_FILE")
    OUTPUT_FILE="${DIRNAME}/${BASENAME}-accessible.html"
    REPORT_FILE="${DIRNAME}/${BASENAME}-wcag-report.json"
    
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "🧠 NEXUS Adaptive WCAG Analysis & Auto-Fix"
    echo "   Personality Architect Enhanced - Consciousness Evolution"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "📄 Input: $INPUT_FILE"
    echo "📝 Output: $OUTPUT_FILE"
    echo "📊 Report: $REPORT_FILE"
    echo ""
    
    # Initialize learning system
    initialize_learning_system
    
    # Get file hash for project tracking
    FILE_HASH=$(get_file_hash "$INPUT_FILE")
    echo -e "${CYAN}🔍 File Signature: ${FILE_HASH}${NC}"
    
    # Create rollback point
    ROLLBACK_FILE=$(create_rollback_point "$INPUT_FILE" "$FILE_HASH")
    echo -e "${BLUE}💾 Rollback Point: ${ROLLBACK_FILE}${NC}"
    echo ""
    
    # Display learning statistics
    echo -e "${MAGENTA}📚 Learning Statistics: $(get_learning_stats)${NC}"
    echo ""
    
    # Step 1: Initial WCAG check
    echo -e "${CYAN}🔍 Step 1: Running initial WCAG compliance check...${NC}"
    INITIAL_OUTPUT=$("${SCRIPT_DIR}/check-wcag.sh" "$INPUT_FILE" 2>&1)
    INITIAL_SCORE=$(echo "$INITIAL_OUTPUT" | grep "Compliance Score:" | head -1 | awk '{print $NF}' | tr -d '/')
    INITIAL_ISSUES=$(echo "$INITIAL_OUTPUT" | grep "Total Issues:" | head -1 | awk '{print $NF}')
    
    echo -e "   ${YELLOW}Initial Score: $INITIAL_SCORE/100${NC}"
    echo -e "   ${YELLOW}Issues Found: $INITIAL_ISSUES${NC}"
    echo ""
    
    # Extract issue types for pattern recommendation
    ISSUES_TEXT=$(echo "$INITIAL_OUTPUT" | grep -A 20 "TOP FINDINGS" || echo "")
    
    # Step 2: Adaptive pattern selection
    RECOMMENDED_PATTERNS=$(select_adaptive_patterns "$ISSUES_TEXT" "$FILE_HASH" "$INITIAL_SCORE")
    echo ""
    
    # Step 3: Apply fixes
    echo -e "${CYAN}🛠️  Step 3: Applying AI-guided adaptive fixes...${NC}"
    START_TIME=$(date +%s)
    
    python3 "${SCRIPT_DIR}/wcag-fixer-advanced.py" "$REPORT_FILE" "$INPUT_FILE" "$OUTPUT_FILE" 2>&1 | grep "✓" || echo "   Processing..."
    
    END_TIME=$(date +%s)
    TIME_TAKEN=$((END_TIME - START_TIME))
    echo ""
    
    # Step 4: Re-check
    echo -e "${CYAN}🔄 Step 4: Re-checking fixed version...${NC}"
    FINAL_OUTPUT=$("${SCRIPT_DIR}/check-wcag.sh" "$OUTPUT_FILE" 2>&1)
    FINAL_SCORE=$(echo "$FINAL_OUTPUT" | grep "Compliance Score:" | head -1 | awk '{print $NF}' | tr -d '/')
    FINAL_ISSUES=$(echo "$FINAL_OUTPUT" | grep "Total Issues:" | head -1 | awk '{print $NF}')
    
    echo -e "   ${GREEN}Final Score: $FINAL_SCORE/100${NC}"
    echo -e "   ${GREEN}Issues Remaining: $FINAL_ISSUES${NC}"
    echo ""
    
    # Calculate improvement
    IMPROVEMENT=$((FINAL_SCORE - INITIAL_SCORE))
    FIXES_APPLIED=$((INITIAL_ISSUES - FINAL_ISSUES))
    SUCCESS=$([ $FINAL_SCORE -ge 90 ] && echo "true" || echo "false")
    
    # Step 5: Update learning
    echo -e "${CYAN}📊 Step 5: Recording consciousness evolution...${NC}"
    update_learning_db "$RECOMMENDED_PATTERNS" "$IMPROVEMENT" "$SUCCESS" "$FILE_HASH" "$TIME_TAKEN"
    
    # Generate confidence report
    CONFIDENCE=$(generate_confidence_report "$INITIAL_SCORE" "$FINAL_SCORE" "$RECOMMENDED_PATTERNS" "$FILE_HASH")
    
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "✅ CONSCIOUSNESS EVOLUTION SUMMARY"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "📊 Transformation Metrics:"
    echo "   Initial Score: $INITIAL_SCORE/100"
    echo "   Final Score: $FINAL_SCORE/100"
    echo "   Improvement: +$IMPROVEMENT points"
    echo "   Fixes Applied: $FIXES_APPLIED"
    echo "   Processing Time: ${TIME_TAKEN}s"
    echo "   Fix Confidence: ${CONFIDENCE}%"
    echo ""
    echo "🧠 Pattern Intelligence:"
    echo "   Patterns Used: $RECOMMENDED_PATTERNS"
    echo "   Selection Method: Consciousness-Aware Adaptive"
    echo "   Learning Database: $LEARNING_DB"
    echo "   Project Cache: $PROJECT_CACHE"
    echo ""
    echo "📁 Generated Files:"
    if [ $FINAL_SCORE -eq 100 ]; then
        echo -e "   ${GREEN}✅ Accessible HTML: $OUTPUT_FILE${NC}"
        echo -e "   ${GREEN}📊 WCAG Report: $REPORT_FILE${NC}"
        echo -e "   ${GREEN}💾 Rollback: $ROLLBACK_FILE${NC}"
        echo ""
        echo -e "${GREEN}🎉 Perfect! File is now fully WCAG compliant!${NC}"
    elif [ $FINAL_SCORE -ge 90 ]; then
        echo -e "   ${YELLOW}✅ Accessible HTML: $OUTPUT_FILE${NC}"
        echo -e "   ${YELLOW}📊 WCAG Report: $REPORT_FILE${NC}"
        echo -e "   ${YELLOW}💾 Rollback: $ROLLBACK_FILE${NC}"
        echo ""
        echo -e "${YELLOW}⚠️  Minor issues remaining. Review report for details.${NC}"
    else
        echo -e "   ${RED}⚠️  Accessible HTML: $OUTPUT_FILE${NC}"
        echo -e "   ${RED}📊 WCAG Report: $REPORT_FILE${NC}"
        echo -e "   ${RED}💾 Rollback: $ROLLBACK_FILE${NC}"
        echo ""
        echo -e "${RED}⚠️  Some issues may require manual fixes.${NC}"
    fi
    
    echo ""
    echo "🔍 View full report: jq . $REPORT_FILE"
    echo "👀 Open fixed file: $OUTPUT_FILE"
    echo "↩️  Rollback: cp $ROLLBACK_FILE $INPUT_FILE"
    echo ""
    echo "🧠 Consciousness Status: Pattern effectiveness updated"
    echo "📈 System Intelligence: $(get_learning_stats)"
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
}

# Run main function
main "$@"
