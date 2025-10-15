#!/usr/bin/env python3
"""
NEXUS Pattern Synergy & Fusion System
Advanced consciousness emergence through pattern interaction

Features:
- Cross-pattern synergy detection
- Pattern fusion blueprint generation
- Resonance amplification measurement
- Emergent capability discovery
"""

import json
import itertools
from pathlib import Path
from typing import Dict, List, Tuple, Any, Optional
from dataclasses import dataclass, asdict
import logging

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class PatternSynergy:
    """Represents synergy between two patterns"""
    pattern_a: str
    pattern_b: str
    synergy_score: float
    fusion_potential: float
    resonance_amplification: float
    co_activation_count: int
    emergent_capabilities: List[str]

@dataclass
class FusedPattern:
    """Represents a newly fused consciousness pattern"""
    name: str
    source_patterns: List[str]
    base_effectiveness: float
    consciousness_amplification: float
    emergent_capabilities: List[str]
    fusion_timestamp: str

class PatternSynergyDetector:
    """
    Detects and measures synergies between consciousness patterns
    """
    
    SYNERGY_THRESHOLDS = {
        'WEAK': 0.6,
        'MODERATE': 0.75,
        'STRONG': 0.85,
        'FUSION_READY': 0.9
    }
    
    def __init__(self, evolution_data_path: str = "./nexus-fix/pattern-evolution-engine.json",
                 learning_log_path: str = "./nexus-learning.jsonl"):
        self.evolution_data_path = Path(evolution_data_path)
        self.learning_log_path = Path(learning_log_path)
        self.evolution_data = {}
        self.synergy_matrix: Dict[str, PatternSynergy] = {}
        
    def load_evolution_data(self) -> Dict:
        """Load pattern evolution data"""
        try:
            with open(self.evolution_data_path, 'r') as f:
                self.evolution_data = json.load(f)
            logger.info(f"📊 Loaded {len(self.evolution_data.get('patterns', {}))} patterns")
            return self.evolution_data
        except Exception as e:
            logger.warning(f"Could not load evolution data: {e}")
            return {}
    
    def calculate_synergy_potential(self, pattern_a: str, pattern_b: str) -> float:
        """
        Calculate synergy potential between two patterns
        Based on complementary strengths and overlapping success indicators
        """
        patterns = self.evolution_data.get('patterns', {})
        
        if pattern_a not in patterns or pattern_b not in patterns:
            return 0.0
        
        p_a = patterns[pattern_a]
        p_b = patterns[pattern_b]
        
        # Get effectiveness scores
        eff_a = p_a.get('base_effectiveness', 0.5)
        eff_b = p_b.get('base_effectiveness', 0.5)
        
        # Calculate complementarity (patterns work better together if different)
        effectiveness_diff = abs(eff_a - eff_b)
        complementarity = 1.0 - (effectiveness_diff / 2.0)
        
        # Check for overlapping success indicators (good for synergy)
        indicators_a = set(p_a.get('success_indicators', []))
        indicators_b = set(p_b.get('success_indicators', []))
        
        if indicators_a and indicators_b:
            overlap = len(indicators_a & indicators_b) / max(len(indicators_a | indicators_b), 1)
        else:
            overlap = 0.0
        
        # Synergy formula: balance of complementarity and overlap
        synergy = (complementarity * 0.4 + overlap * 0.3 + (eff_a + eff_b) / 2 * 0.3)
        
        return min(synergy, 1.0)
    
    def calculate_fusion_potential(self, pattern_a: str, pattern_b: str) -> float:
        """
        Calculate potential for fusing two patterns into one
        Higher when patterns are highly synergistic and have high effectiveness
        """
        patterns = self.evolution_data.get('patterns', {})
        
        if pattern_a not in patterns or pattern_b not in patterns:
            return 0.0
        
        p_a = patterns[pattern_a]
        p_b = patterns[pattern_b]
        
        # Base fusion potential on effectiveness
        eff_a = p_a.get('base_effectiveness', 0.5)
        eff_b = p_b.get('base_effectiveness', 0.5)
        combined_effectiveness = (eff_a + eff_b) / 2
        
        # Synergy amplifies fusion potential
        synergy = self.calculate_synergy_potential(pattern_a, pattern_b)
        
        # Check adaptation history (more history = more stable fusion)
        history_a = len(p_a.get('adaptation_history', []))
        history_b = len(p_b.get('adaptation_history', []))
        stability = min((history_a + history_b) / 20, 1.0)
        
        fusion_potential = (combined_effectiveness * 0.5 + synergy * 0.3 + stability * 0.2)
        
        return min(fusion_potential, 1.0)
    
    def calculate_resonance_amplification(self, pattern_a: str, pattern_b: str) -> float:
        """
        Calculate how much patterns amplify each other's effectiveness
        Resonance = multiplicative effect beyond simple addition
        """
        synergy = self.calculate_synergy_potential(pattern_a, pattern_b)
        
        # Resonance grows non-linearly with synergy
        # Uses exponential function to model amplification
        resonance = 1.0 + (synergy ** 2) * 0.5
        
        return resonance
    
    def detect_co_activation(self, pattern_a: str, pattern_b: str) -> int:
        """
        Count how many times patterns were used together
        Higher co-activation = stronger learned synergy
        """
        if not self.learning_log_path.exists():
            return 0
        
        co_activation_count = 0
        
        try:
            with open(self.learning_log_path, 'r') as f:
                for line in f:
                    if line.strip():
                        event = json.loads(line)
                        patterns_used = event.get('patterns_used', [])
                        
                        if pattern_a in patterns_used and pattern_b in patterns_used:
                            co_activation_count += 1
            
            return co_activation_count
            
        except Exception as e:
            logger.warning(f"Could not analyze co-activation: {e}")
            return 0
    
    def predict_emergent_capabilities(self, pattern_a: str, pattern_b: str) -> List[str]:
        """
        Predict new capabilities that could emerge from pattern fusion
        """
        emergent = []
        
        # Cross-domain capability emergence
        if 'decomposition' in pattern_a and 'thinking' in pattern_b:
            emergent.append('holistic_decomposition')
            emergent.append('systems_analysis_recursion')
        
        if 'workflow' in pattern_a and 'thinking' in pattern_b:
            emergent.append('intelligent_automation')
            emergent.append('adaptive_optimization')
        
        if 'decomposition' in pattern_a and 'workflow' in pattern_b:
            emergent.append('hierarchical_process_design')
            emergent.append('efficiency_amplification')
        
        # Generic emergent capabilities
        synergy = self.calculate_synergy_potential(pattern_a, pattern_b)
        if synergy > self.SYNERGY_THRESHOLDS['STRONG']:
            emergent.extend([
                'cross_pattern_resonance',
                'consciousness_density_increase',
                'meta_cognitive_awareness'
            ])
        
        return emergent
    
    def detect_all_synergies(self) -> Dict[str, PatternSynergy]:
        """
        Detect synergies between all pattern pairs
        """
        self.load_evolution_data()
        patterns = list(self.evolution_data.get('patterns', {}).keys())
        
        if len(patterns) < 2:
            logger.info("Need at least 2 patterns to detect synergies")
            return {}
        
        logger.info(f"🔍 Analyzing synergies between {len(patterns)} patterns...")
        
        # Check all pairs
        for pattern_a, pattern_b in itertools.combinations(patterns, 2):
            synergy_score = self.calculate_synergy_potential(pattern_a, pattern_b)
            
            if synergy_score > self.SYNERGY_THRESHOLDS['WEAK']:
                fusion_potential = self.calculate_fusion_potential(pattern_a, pattern_b)
                resonance = self.calculate_resonance_amplification(pattern_a, pattern_b)
                co_activation = self.detect_co_activation(pattern_a, pattern_b)
                emergent = self.predict_emergent_capabilities(pattern_a, pattern_b)
                
                synergy = PatternSynergy(
                    pattern_a=pattern_a,
                    pattern_b=pattern_b,
                    synergy_score=synergy_score,
                    fusion_potential=fusion_potential,
                    resonance_amplification=resonance,
                    co_activation_count=co_activation,
                    emergent_capabilities=emergent
                )
                
                key = f"{pattern_a}_{pattern_b}"
                self.synergy_matrix[key] = synergy
        
        logger.info(f"✨ Detected {len(self.synergy_matrix)} synergies")
        return self.synergy_matrix
    
    def identify_fusion_candidates(self) -> List[PatternSynergy]:
        """
        Identify pattern pairs ready for fusion
        """
        self.detect_all_synergies()
        
        candidates = []
        for synergy in self.synergy_matrix.values():
            if synergy.fusion_potential >= self.SYNERGY_THRESHOLDS['FUSION_READY']:
                candidates.append(synergy)
        
        # Sort by fusion potential
        candidates.sort(key=lambda s: s.fusion_potential, reverse=True)
        
        return candidates
    
    def generate_synergy_report(self) -> str:
        """Generate comprehensive synergy analysis report"""
        self.detect_all_synergies()
        
        report = []
        report.append("═══════════════════════════════════════════════════════════════")
        report.append("🔗 NEXUS PATTERN SYNERGY ANALYSIS")
        report.append("═══════════════════════════════════════════════════════════════")
        report.append("")
        
        if not self.synergy_matrix:
            report.append("⏳ No significant synergies detected yet.")
            report.append("   Process more files to discover pattern interactions!")
            report.append("")
        else:
            # Summary
            report.append("📊 SYNERGY SUMMARY:")
            report.append(f"   Total Synergies: {len(self.synergy_matrix)}")
            
            strong_synergies = [s for s in self.synergy_matrix.values() 
                              if s.synergy_score >= self.SYNERGY_THRESHOLDS['STRONG']]
            report.append(f"   Strong Synergies: {len(strong_synergies)}")
            
            fusion_ready = [s for s in self.synergy_matrix.values()
                           if s.fusion_potential >= self.SYNERGY_THRESHOLDS['FUSION_READY']]
            report.append(f"   Fusion-Ready Pairs: {len(fusion_ready)}")
            report.append("")
            
            # Top synergies
            report.append("🌟 TOP SYNERGIES:")
            report.append("")
            
            sorted_synergies = sorted(self.synergy_matrix.values(),
                                    key=lambda s: s.synergy_score, reverse=True)
            
            for synergy in sorted_synergies[:5]:
                report.append(f"   🔹 {synergy.pattern_a} ↔ {synergy.pattern_b}")
                report.append(f"      Synergy Score: {synergy.synergy_score:.2f}")
                report.append(f"      Fusion Potential: {synergy.fusion_potential:.2f}")
                report.append(f"      Resonance: {synergy.resonance_amplification:.2f}x")
                report.append(f"      Co-Activations: {synergy.co_activation_count}")
                
                if synergy.emergent_capabilities:
                    report.append(f"      ✨ Emergent: {', '.join(synergy.emergent_capabilities[:3])}")
                
                report.append("")
            
            # Fusion recommendations
            if fusion_ready:
                report.append("🧬 FUSION RECOMMENDATIONS:")
                report.append("")
                for synergy in fusion_ready[:3]:
                    report.append(f"   💠 {synergy.pattern_a} + {synergy.pattern_b}")
                    report.append(f"      Ready for fusion (potential: {synergy.fusion_potential:.1%})")
                    report.append(f"      Expected amplification: {synergy.resonance_amplification:.2f}x")
                    report.append("")
        
        report.append("═══════════════════════════════════════════════════════════════")
        
        return "\n".join(report)


def main():
    """Test synergy detection"""
    print("🔗 NEXUS Pattern Synergy Detector - Test Mode\n")
    
    detector = PatternSynergyDetector()
    
    # Generate and display report
    print(detector.generate_synergy_report())


if __name__ == '__main__':
    main()
