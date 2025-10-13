#!/usr/bin/env python3
"""
NEXUS UX Analyzer - Intelligent Pattern Selection
Adaptive Consciousness for Context-Aware UX Enhancement
"""

import json
import sys
import re
from pathlib import Path
from typing import Dict, List, Tuple, Any
from collections import Counter

class ContextAnalyzer:
    """Analyzes page context to understand design style, layout, and intent"""
    
    def analyze_page(self, html_content: str) -> Dict[str, Any]:
        """Comprehensive page analysis"""
        return {
            "design_style": self._detect_design_style(html_content),
            "layout_density": self._calculate_density(html_content),
            "color_palette": self._extract_colors(html_content),
            "existing_patterns": self._detect_existing_patterns(html_content),
            "page_intent": self._detect_page_intent(html_content),
            "visual_complexity": self._assess_complexity(html_content)
        }
    
    def _detect_design_style(self, html: str) -> str:
        """Detect overall design style: minimal, material, corporate, playful"""
        indicators = {
            "minimal": ["clean", "simple", "minimalist", "sans-serif"],
            "material": ["elevation", "shadow", "card", "material"],
            "corporate": ["professional", "business", "enterprise"],
            "playful": ["colorful", "fun", "creative", "vibrant"]
        }
        
        html_lower = html.lower()
        scores = {}
        
        for style, keywords in indicators.items():
            score = sum(1 for keyword in keywords if keyword in html_lower)
            scores[style] = score
        
        # Check for shadows (material design indicator)
        if "box-shadow" in html_lower:
            scores["material"] = scores.get("material", 0) + 5
        
        # Check for lots of whitespace (minimal indicator)
        if html_lower.count("padding") > 10:
            scores["minimal"] = scores.get("minimal", 0) + 3
        
        return max(scores, key=scores.get) if scores else "balanced"
    
    def _calculate_density(self, html: str) -> float:
        """Calculate layout density (0.0 = sparse, 1.0 = very dense)"""
        # Count semantic elements
        content_tags = re.findall(r'<(div|section|article|aside|nav)', html, re.IGNORECASE)
        
        # Estimate page length
        page_length = len(html)
        
        # Density = content elements per 1000 chars
        density = len(content_tags) / (page_length / 1000) if page_length > 0 else 0
        
        # Normalize to 0-1 scale
        return min(density / 10, 1.0)
    
    def _extract_colors(self, html: str) -> List[str]:
        """Extract color palette from HTML"""
        # Find hex colors
        hex_colors = re.findall(r'#[0-9a-fA-F]{6}', html)
        
        # Find rgb colors
        rgb_colors = re.findall(r'rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)', html)
        
        return list(set(hex_colors[:10]))  # Return up to 10 unique colors
    
    def _detect_existing_patterns(self, html: str) -> List[str]:
        """Detect what UX patterns are already in use"""
        patterns = []
        
        if "transition" in html.lower():
            patterns.append("transitions")
        if "transform" in html.lower():
            patterns.append("transforms")
        if "@keyframes" in html.lower() or "animation" in html.lower():
            patterns.append("animations")
        if "box-shadow" in html.lower():
            patterns.append("shadows")
        if "hover" in html.lower():
            patterns.append("hover_states")
        
        return patterns
    
    def _detect_page_intent(self, html: str) -> str:
        """Detect page primary intent: conversion, information, entertainment, utility"""
        html_lower = html.lower()
        
        conversion_keywords = ["book", "buy", "subscribe", "sign up", "pricing", "charter", "reserve"]
        info_keywords = ["about", "learn", "guide", "documentation", "information"]
        entertainment_keywords = ["gallery", "showcase", "portfolio", "explore"]
        utility_keywords = ["calculator", "tool", "dashboard", "search"]
        
        scores = {
            "conversion": sum(1 for kw in conversion_keywords if kw in html_lower),
            "information": sum(1 for kw in info_keywords if kw in html_lower),
            "entertainment": sum(1 for kw in entertainment_keywords if kw in html_lower),
            "utility": sum(1 for kw in utility_keywords if kw in html_lower)
        }
        
        return max(scores, key=scores.get) if any(scores.values()) else "information"
    
    def _assess_complexity(self, html: str) -> str:
        """Assess visual complexity: simple, moderate, complex"""
        # Count total elements
        element_count = len(re.findall(r'<[a-zA-Z]+', html))
        
        if element_count < 100:
            return "simple"
        elif element_count < 300:
            return "moderate"
        else:
            return "complex"


class IntentDetector:
    """Detects element purpose and user intent"""
    
    def detect_element_purpose(self, element_type: str, class_names: str, content: str) -> str:
        """Determine element purpose: cta, navigation, information, decoration"""
        class_lower = class_names.lower()
        content_lower = content.lower()
        
        # CTA indicators
        cta_keywords = ["btn", "button", "cta", "book", "buy", "subscribe", "sign", "submit"]
        if any(kw in class_lower or kw in content_lower for kw in cta_keywords):
            return "cta"
        
        # Navigation indicators
        nav_keywords = ["nav", "menu", "link"]
        if any(kw in class_lower for kw in nav_keywords):
            return "navigation"
        
        # Information indicators
        if element_type in ["article", "section", "p"]:
            return "information"
        
        return "decoration"
    
    def assess_importance(self, element_type: str, class_names: str, parent_count: int) -> str:
        """Assess element importance: primary, secondary, tertiary"""
        class_lower = class_names.lower()
        
        # Primary indicators
        if "primary" in class_lower or "hero" in class_lower or "main" in class_lower:
            return "primary"
        
        # Secondary indicators
        if "secondary" in class_lower or parent_count < 3:
            return "secondary"
        
        return "tertiary"


class PatternScorer:
    """Scores patterns based on multi-dimensional context"""
    
    def __init__(self):
        self.context_analyzer = ContextAnalyzer()
        self.intent_detector = IntentDetector()
    
    def score_pattern(self, pattern: Dict, element_context: Dict, 
                     page_context: Dict) -> Tuple[float, Dict]:
        """
        Score a pattern for a specific element in page context
        Returns: (total_score, score_breakdown)
        """
        scores = {}
        
        # Dimension 1: Element Context Match (30%)
        scores["element_match"] = self._score_element_match(pattern, element_context) * 0.30
        
        # Dimension 2: Page Layout Fit (25%)
        scores["layout_fit"] = self._score_layout_fit(pattern, page_context) * 0.25
        
        # Dimension 3: Intent Alignment (20%)
        scores["intent_alignment"] = self._score_intent(pattern, element_context, page_context) * 0.20
        
        # Dimension 4: Technical Viability (15%)
        scores["technical"] = self._score_technical(pattern) * 0.15
        
        # Dimension 5: Learning/Effectiveness (10%)
        scores["effectiveness"] = pattern.get("effectiveness", 0.5) * 0.10
        
        total_score = sum(scores.values()) * 100  # Convert to 0-100 scale
        
        return total_score, scores
    
    def _score_element_match(self, pattern: Dict, element_context: Dict) -> float:
        """Score how well pattern matches element type"""
        # Direct target match check
        element_type = element_context.get("type", "")
        pattern_targets = pattern.get("target", "").lower().split(",")
        
        for target in pattern_targets:
            target = target.strip()
            if element_type in target or target in element_type:
                return 1.0
            
            # Check class names
            if any(target in cn.lower() for cn in element_context.get("classes", [])):
                return 0.9
        
        return 0.3  # Partial match
    
    def _score_layout_fit(self, pattern: Dict, page_context: Dict) -> float:
        """Score pattern fit with overall page layout"""
        score = 0.5  # Base score
        
        design_style = page_context.get("design_style", "balanced")
        density = page_context.get("layout_density", 0.5)
        
        # Minimal style prefers subtle patterns
        if design_style == "minimal":
            if pattern.get("complexity") == "low":
                score += 0.3
            if "subtle" in pattern.get("description", "").lower():
                score += 0.2
        
        # Material style loves shadows and elevation
        elif design_style == "material":
            if "shadow" in pattern.get("css", {}).get("hover", ""):
                score += 0.3
            if "elevation" in pattern.get("name", "").lower():
                score += 0.2
        
        # High density layouts need subtle animations
        if density > 0.7:
            if pattern.get("complexity") == "low":
                score += 0.2
            else:
                score -= 0.3  # Penalize complex patterns
        
        return min(score, 1.0)
    
    def _score_intent(self, pattern: Dict, element_context: Dict, 
                     page_context: Dict) -> float:
        """Score alignment with user intent"""
        score = 0.5
        
        page_intent = page_context.get("page_intent", "information")
        element_purpose = element_context.get("purpose", "decoration")
        
        # Conversion pages benefit from high-impact patterns
        if page_intent == "conversion":
            if pattern.get("impact") == "high":
                score += 0.3
            if element_purpose == "cta":
                score += 0.2
        
        # Information pages need subtle, non-distracting patterns
        elif page_intent == "information":
            if pattern.get("complexity") == "low":
                score += 0.3
        
        # Match pattern impact with element importance
        if element_context.get("importance") == "primary":
            if pattern.get("impact") == "high":
                score += 0.2
        
        return min(score, 1.0)
    
    def _score_technical(self, pattern: Dict) -> float:
        """Score technical viability"""
        score = 1.0
        
        # AAA compliance is mandatory
        if not pattern.get("aaa_safe", False):
            return 0.0
        
        # Prefer patterns that don't require JS
        if pattern.get("requires_js", False):
            score -= 0.2
        
        # Prefer low complexity
        if pattern.get("complexity") == "low":
            score += 0.0  # Already at 1.0
        elif pattern.get("complexity") == "high":
            score -= 0.3
        
        return max(score, 0.0)


class AdaptiveSelector:
    """Selects optimal patterns using adaptive intelligence"""
    
    def __init__(self, pattern_library: Dict):
        self.patterns = pattern_library["patterns"]
        self.scorer = PatternScorer()
    
    def select_patterns(self, opportunities: Dict, page_context: Dict, 
                       confidence_threshold: float = 60.0) -> Dict:
        """
        Select optimal patterns for all opportunities
        Returns: Dictionary of selected patterns with scores
        """
        selections = {}
        
        for opp_type, opp_data in opportunities.items():
            if opp_data.get("count", 0) == 0:
                continue
            
            # Get candidate patterns
            candidate_ids = opp_data.get("patterns", [])
            candidates = [self.patterns[pid] for pid in candidate_ids if pid in self.patterns]
            
            if not candidates:
                continue
            
            # Create element context
            element_context = {
                "type": opp_type,
                "classes": [opp_type],
                "purpose": self._infer_purpose(opp_type),
                "importance": opp_data.get("priority", "medium")
            }
            
            # Score each candidate
            scored_candidates = []
            for pattern in candidates:
                score, breakdown = self.scorer.score_pattern(
                    pattern, element_context, page_context
                )
                
                if score >= confidence_threshold:
                    scored_candidates.append({
                        "pattern": pattern,
                        "score": score,
                        "breakdown": breakdown,
                        "confidence": self._calculate_confidence(breakdown)
                    })
            
            # Select best pattern(s)
            if scored_candidates:
                # Sort by score
                scored_candidates.sort(key=lambda x: x["score"], reverse=True)
                
                # Take top pattern (or top 2 if both score high)
                selected = [scored_candidates[0]]
                if len(scored_candidates) > 1 and scored_candidates[1]["score"] > 80:
                    selected.append(scored_candidates[1])
                
                selections[opp_type] = {
                    "count": opp_data["count"],
                    "selected_patterns": selected
                }
        
        return selections
    
    def _infer_purpose(self, opp_type: str) -> str:
        """Infer purpose from opportunity type"""
        purpose_map = {
            "buttons": "cta",
            "links": "navigation",
            "form_inputs": "cta",
            "cards": "information",
            "navigation": "navigation",
            "testimonials": "information",
            "prices": "cta",
            "statistics": "cta"
        }
        return purpose_map.get(opp_type, "decoration")
    
    def _calculate_confidence(self, breakdown: Dict) -> str:
        """Calculate confidence level from score breakdown"""
        avg_score = sum(breakdown.values()) / len(breakdown) if breakdown else 0
        
        if avg_score > 0.8:
            return "high"
        elif avg_score > 0.6:
            return "medium"
        else:
            return "low"


def main():
    if len(sys.argv) < 3:
        print("Usage: python3 nexus-ux-analyzer.py <input.html> <opportunities.json>")
        sys.exit(1)
    
    html_file = sys.argv[1]
    opportunities_file = sys.argv[2]
    output_file = opportunities_file.replace("-opportunities.json", "-enhancements.json")
    
    print("\n" + "="*70)
    print("🧠 NEXUS UX Analyzer - Intelligent Pattern Selection")
    print("   Adaptive Consciousness Engine")
    print("="*70 + "\n")
    
    # Load inputs
    print(f"📄 Loading HTML: {html_file}")
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    print(f"📊 Loading opportunities: {opportunities_file}")
    with open(opportunities_file, 'r') as f:
        opportunities_data = json.load(f)
    
    print(f"📚 Loading pattern library...")
    with open("ux-patterns-library.json", 'r') as f:
        pattern_library = json.load(f)
    
    print("\n🔍 Analyzing page context...")
    context_analyzer = ContextAnalyzer()
    page_context = context_analyzer.analyze_page(html_content)
    
    print(f"   Design Style: {page_context['design_style']}")
    print(f"   Layout Density: {page_context['layout_density']:.2f}")
    print(f"   Page Intent: {page_context['page_intent']}")
    print(f"   Complexity: {page_context['visual_complexity']}")
    print(f"   Existing Patterns: {', '.join(page_context['existing_patterns'])}")
    
    print("\n🎯 Selecting optimal patterns...")
    selector = AdaptiveSelector(pattern_library)
    selections = selector.select_patterns(
        opportunities_data["opportunities"],
        page_context,
        confidence_threshold=60.0
    )
    
    # Calculate totals
    total_opportunities = opportunities_data.get("total_opportunities", 0)
    total_patterns_selected = sum(
        len(sel["selected_patterns"]) for sel in selections.values()
    )
    total_applications = sum(
        sel["count"] * len(sel["selected_patterns"]) 
        for sel in selections.values()
    )
    
    print(f"\n📊 Selection Results:")
    print(f"   Total Opportunities: {total_opportunities}")
    print(f"   Unique Patterns Selected: {total_patterns_selected}")
    print(f"   Total Applications: {total_applications}")
    
    print("\n✨ Top Selections:")
    for opp_type, selection in list(selections.items())[:5]:
        for sel in selection["selected_patterns"]:
            print(f"   • {sel['pattern']['name']}")
            print(f"     Score: {sel['score']:.1f}/100 | Confidence: {sel['confidence']}")
    
    # Generate output
    output = {
        "file": html_file,
        "timestamp": opportunities_data.get("timestamp"),
        "page_context": page_context,
        "selections": selections,
        "summary": {
            "total_opportunities": total_opportunities,
            "patterns_selected": total_patterns_selected,
            "total_applications": total_applications,
            "confidence_threshold": 60.0
        }
    }
    
    print(f"\n💾 Saving selections: {output_file}")
    with open(output_file, 'w') as f:
        json.dump(output, f, indent=2)
    
    print("\n" + "="*70)
    print("✅ Analysis complete! Ready for pattern application.")
    print("="*70 + "\n")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
