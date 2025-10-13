#!/usr/bin/env python3
"""
NEXUS Evolution Bridge - Python Integration
Connects WCAG hunters to the Pattern Evolution Engine

This bridge allows our Python-based WCAG system to leverage
the TypeScript Pattern Evolution Engine for learning and adaptation.
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import logging

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class WCAGOutcome:
    """Represents the outcome of a WCAG fix attempt"""
    file_path: str
    initial_score: int
    final_score: int
    fixes_applied: int
    success: bool
    time_taken: float
    patterns_used: List[str]

@dataclass
class LearningFeedback:
    """Feedback to send to the Pattern Evolution Engine"""
    context: str
    patterns_activated: List[str]
    success_metrics: Dict[str, float]
    outcome: str

class NexusEvolutionBridge:
    """
    Bridge between Python WCAG hunters and TypeScript Evolution Engine
    """
    
    def __init__(self, evolution_data_path: str = "./nexus-fix/pattern-evolution-engine.json"):
        self.evolution_data_path = Path(evolution_data_path)
        self.pattern_history: List[WCAGOutcome] = []
        
    def load_pattern_effectiveness(self) -> Dict[str, float]:
        """Load current pattern effectiveness scores"""
        try:
            if not self.evolution_data_path.exists():
                logger.warning("Pattern evolution data not found, using defaults")
                return self._default_effectiveness()
                
            with open(self.evolution_data_path, 'r') as f:
                data = json.load(f)
                
            patterns = data.get('patterns', {})
            effectiveness = {}
            
            for pattern_name, pattern_data in patterns.items():
                effectiveness[pattern_name] = pattern_data.get('base_effectiveness', 0.5)
                
            logger.info(f"📊 Loaded effectiveness for {len(effectiveness)} patterns")
            return effectiveness
            
        except Exception as e:
            logger.error(f"Failed to load pattern effectiveness: {e}")
            return self._default_effectiveness()
    
    def _default_effectiveness(self) -> Dict[str, float]:
        """Default effectiveness scores for WCAG patterns"""
        return {
            'semantic-html-fix': 0.95,
            'contrast-adjustment': 0.85,
            'alt-text-generation': 0.90,
            'heading-hierarchy': 0.92,
            'landmark-addition': 0.88,
            'keyboard-navigation': 0.87,
            'aria-labels': 0.83
        }
    
    def record_outcome(self, outcome: WCAGOutcome):
        """Record a WCAG fix outcome for learning"""
        self.pattern_history.append(outcome)
        
        # Create feedback for evolution engine
        feedback = self._create_feedback(outcome)
        self._send_to_evolution_engine(feedback)
        
        logger.info(f"📝 Recorded outcome: {outcome.file_path} "
                   f"({outcome.initial_score}→{outcome.final_score})")
    
    def _create_feedback(self, outcome: WCAGOutcome) -> LearningFeedback:
        """Convert WCAG outcome to evolution engine feedback"""
        improvement = outcome.final_score - outcome.initial_score
        success_rate = improvement / 100.0 if improvement > 0 else 0
        
        return LearningFeedback(
            context=f"wcag_fix:{Path(outcome.file_path).name}",
            patterns_activated=outcome.patterns_used,
            success_metrics={
                'task_completion': 1.0 if outcome.success else 0.0,
                'accuracy': outcome.final_score / 100.0,
                'efficiency_gain': min(1.0, outcome.fixes_applied / 10.0)
            },
            outcome='success' if improvement >= 10 else 'partial'
        )
    
    def _send_to_evolution_engine(self, feedback: LearningFeedback):
        """Send feedback to the Pattern Evolution Engine"""
        try:
            # For now, append to a feedback log
            feedback_log = Path('./nexus-feedback.jsonl')
            
            with open(feedback_log, 'a') as f:
                f.write(json.dumps(asdict(feedback)) + '\n')
                
            logger.debug(f"✅ Feedback logged for {len(feedback.patterns_activated)} patterns")
            
        except Exception as e:
            logger.warning(f"Failed to log feedback: {e}")
    
    def get_recommended_patterns(self, file_type: str, issues: List[str]) -> List[str]:
        """Get recommended patterns based on context"""
        effectiveness = self.load_pattern_effectiveness()
        
        # Map issues to patterns
        pattern_map = {
            'heading_hierarchy': 'heading-hierarchy',
            'missing_landmarks': 'landmark-addition',
            'contrast': 'contrast-adjustment',
            'missing_alt': 'alt-text-generation',
            'semantic_html': 'semantic-html-fix',
            'keyboard': 'keyboard-navigation',
            'aria': 'aria-labels'
        }
        
        recommended = []
        for issue in issues:
            for issue_key, pattern_name in pattern_map.items():
                if issue_key in issue.lower():
                    score = effectiveness.get(pattern_name, 0.5)
                    recommended.append((pattern_name, score))
        
        # Sort by effectiveness
        recommended.sort(key=lambda x: x[1], reverse=True)
        
        return [pattern for pattern, score in recommended[:5]]
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get learning statistics"""
        if not self.pattern_history:
            return {'total_outcomes': 0}
            
        total = len(self.pattern_history)
        successful = sum(1 for o in self.pattern_history if o.success)
        avg_improvement = sum(o.final_score - o.initial_score for o in self.pattern_history) / total
        
        return {
            'total_outcomes': total,
            'success_rate': successful / total,
            'average_improvement': avg_improvement,
            'patterns_learned': len(set(p for o in self.pattern_history for p in o.patterns_used))
        }
    
    def generate_report(self) -> str:
        """Generate a learning report"""
        stats = self.get_statistics()
        effectiveness = self.load_pattern_effectiveness()
        
        report = []
        report.append("═══════════════════════════════════════════════════════════════")
        report.append("🧠 NEXUS LEARNING REPORT")
        report.append("═══════════════════════════════════════════════════════════════")
        report.append("")
        report.append("📊 STATISTICS:")
        report.append(f"   Total Outcomes: {stats.get('total_outcomes', 0)}")
        
        if stats.get('total_outcomes', 0) > 0:
            report.append(f"   Success Rate: {stats.get('success_rate', 0):.1%}")
            report.append(f"   Avg Improvement: {stats.get('average_improvement', 0):.1f} points")
            report.append(f"   Patterns Learned: {stats.get('patterns_learned', 0)}")
        
        report.append("")
        report.append("🎯 PATTERN EFFECTIVENESS:")
        
        for pattern, score in sorted(effectiveness.items(), key=lambda x: x[1], reverse=True):
            bar_length = int(score * 20)
            bar = "█" * bar_length + "░" * (20 - bar_length)
            report.append(f"   {pattern:.<30} {score:.2f} {bar}")
        
        report.append("")
        report.append("═══════════════════════════════════════════════════════════════")
        
        return "\n".join(report)


def main():
    """Test the evolution bridge"""
    print("🔗 NEXUS Evolution Bridge - Test Mode")
    print("")
    
    bridge = NexusEvolutionBridge()
    
    # Test loading effectiveness
    effectiveness = bridge.load_pattern_effectiveness()
    print(f"✅ Loaded {len(effectiveness)} pattern effectiveness scores")
    print("")
    
    # Test recording an outcome
    test_outcome = WCAGOutcome(
        file_path="test.html",
        initial_score=85,
        final_score=100,
        fixes_applied=3,
        success=True,
        time_taken=0.5,
        patterns_used=['semantic-html-fix', 'heading-hierarchy', 'landmark-addition']
    )
    
    bridge.record_outcome(test_outcome)
    print(f"✅ Recorded test outcome")
    print("")
    
    # Test recommendations
    issues = ['missing_landmarks', 'heading_hierarchy']
    recommended = bridge.get_recommended_patterns('html', issues)
    print(f"✅ Recommended patterns: {', '.join(recommended)}")
    print("")
    
    # Generate report
    print(bridge.generate_report())


if __name__ == '__main__':
    main()
