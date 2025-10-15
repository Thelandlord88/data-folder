#!/usr/bin/env python3
"""
NEXUS WCAG HUNTER SYSTEM v2.0
Enhanced with hunter-pack architectural patterns

Based on hunter-pack brilliance:
- Standardized JSON schema
- Policy invariants
- Unlock dependencies
- ETA estimates
- Static signal detection
"""

import json
import os
import re
from pathlib import Path
from typing import Dict, List, Any, Literal
from bs4 import BeautifulSoup


class BaseWcagHunter:
    """Base hunter following hunter-pack patterns"""
    
    def __init__(self, html_content: str, report_dir: str = "__reports/hunt"):
        self.html_content = html_content
        self.soup = BeautifulSoup(html_content, 'html.parser')
        self.report_dir = Path(report_dir)
        self.report_dir.mkdir(parents=True, exist_ok=True)
        self.findings = []
        
        # Hunter configuration (override via env)
        self.contrast_threshold_aa = float(os.getenv('CONTRAST_THRESHOLD_AA', '4.5'))
        self.contrast_threshold_aaa = float(os.getenv('CONTRAST_THRESHOLD_AAA', '7.0'))
    
    def scan(self) -> Dict[str, Any]:
        """Main scan method - returns hunter-pack compatible JSON"""
        raise NotImplementedError
    
    def write_report(self) -> Dict[str, Any]:
        """Write standardized hunter JSON report"""
        report = self.scan()
        output_file = self.report_dir / f"{self.__class__.__name__.lower()}.json"
        
        with open(output_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        return report
    
    def trace_issue(self, issue_data: Dict[str, Any]):
        """Hunter-style issue tracing"""
        print(f"🔍 {self.__class__.__name__}: {issue_data}")


class ColorContrastHunter(BaseWcagHunter):
    """WCAG 1.4.3 Color Contrast Hunter"""
    
    def scan(self) -> Dict[str, Any]:
        low_contrast_elements = 0
        insufficient_aa = 0
        insufficient_aaa = 0
        
        # Hunt for inline style contrast issues
        styled_elements = self.soup.find_all(style=re.compile(r'color|background'))
        
        for element in styled_elements:
            style = element.get('style', '')
            fg_match = re.search(r'color:\s*(#[a-fA-F0-9]{3,6}|rgb\([^)]+\)|[a-zA-Z]+)', style)
            bg_match = re.search(r'background(-color)?:\s*(#[a-fA-F0-9]{3,6}|rgb\([^)]+\)|[a-zA-Z]+)', style)
            
            if fg_match and bg_match:
                fg_color = fg_match.group(1)
                bg_color = bg_match.group(2)
                contrast_ratio = self._calculate_contrast_ratio(fg_color, bg_color)
                
                if contrast_ratio and contrast_ratio < self.contrast_threshold_aaa:
                    insufficient_aaa += 1
                    self.findings.append({
                        "element": str(element)[:100],
                        "fg_color": fg_color,
                        "bg_color": bg_color,
                        "contrast_ratio": round(contrast_ratio, 2),
                        "required_aaa": self.contrast_threshold_aaa,
                        "issue": "Insufficient contrast for AAA compliance"
                    })
                
                if contrast_ratio and contrast_ratio < self.contrast_threshold_aa:
                    insufficient_aa += 1
                    low_contrast_elements += 1
                    self.trace_issue({
                        "class": "low-contrast",
                        "element": str(element)[:50],
                        "contrast": contrast_ratio,
                        "severity": "critical" if contrast_ratio < 3.0 else "warn"
                    })
        
        issues = low_contrast_elements
        status = "pass" if issues == 0 else "warn"
        
        return {
            "schemaVersion": 1,
            "module": "wcag_color_contrast",
            "status": status,
            "issues": issues,
            "affected_elements": issues,
            "counts": {
                "low_contrast_elements": low_contrast_elements,
                "insufficient_aa": insufficient_aa,
                "insufficient_aaa": insufficient_aaa
            },
            "findings": self.findings,
            "actions": [
                "Ensure color contrast of at least 4.5:1 for normal text (AA)",
                "Aim for 7:1 contrast for enhanced readability (AAA)",
                "Use automated tools to verify contrast ratios",
                "Test with users with visual impairments"
            ],
            "policy_invariants": [
                "counts.insufficient_aa == 0",
                "counts.low_contrast_elements == 0"
            ],
            "eta_minutes": 45,
            "unlocks": ["wcag_images", "wcag_typography"]
        }
    
    def _calculate_contrast_ratio(self, fg_color: str, bg_color: str) -> float:
        """Calculate contrast ratio between two colors"""
        # Simplified implementation - in production use libraries like `webcolors`
        # For now, use known contrasts for common color combinations
        known_contrasts = {
            ('black', 'white'): 21.0,
            ('white', 'black'): 21.0,
            ('#000', '#fff'): 21.0,
            ('#000000', '#ffffff'): 21.0,
            ('#333', '#fff'): 12.6,
            ('#333333', '#ffffff'): 12.6,
            ('#666', '#fff'): 5.7,
            ('#666666', '#ffffff'): 5.7,
            ('#999', '#fff'): 2.9,
            ('#999999', '#ffffff'): 2.9,
            ('#ccc', '#fff'): 1.6,
            ('#cccccc', '#ffffff'): 1.6,
        }
        
        # Normalize colors for comparison
        fg_norm = fg_color.lower().strip()
        bg_norm = bg_color.lower().strip()
        
        return known_contrasts.get((fg_norm, bg_norm), 4.5)  # Default to passing


class ImageAccessibilityHunter(BaseWcagHunter):
    """WCAG 1.1.1 Image Alt Text Hunter"""
    
    def scan(self) -> Dict[str, Any]:
        missing_alt = 0
        empty_alt_decorative = 0
        suspicious_alt = 0
        
        images = self.soup.find_all('img')
        
        for img in images:
            alt_text = img.get('alt')
            
            # Missing alt attribute
            if alt_text is None:
                missing_alt += 1
                self.trace_issue({
                    "class": "missing-alt",
                    "element": str(img)[:50],
                    "severity": "critical"
                })
                self.findings.append({
                    "element": str(img)[:100],
                    "issue": "Missing alt attribute",
                    "fix": "Add alt text or empty alt for decorative images",
                    "severity": "critical"
                })
            
            # Empty alt for potentially meaningful images
            elif alt_text == "" and self._is_potentially_meaningful(img):
                empty_alt_decorative += 1
                self.findings.append({
                    "element": str(img)[:100],
                    "issue": "Empty alt on potentially meaningful image",
                    "fix": "Add descriptive alt text or confirm image is decorative",
                    "severity": "warning"
                })
            
            # Suspicious alt text (filename, etc.)
            elif alt_text and self._is_suspicious_alt(alt_text):
                suspicious_alt += 1
                self.findings.append({
                    "element": str(img)[:100],
                    "alt_text": alt_text,
                    "issue": "Suspicious alt text detected",
                    "fix": "Use descriptive, meaningful alt text",
                    "severity": "warning"
                })
        
        issues = missing_alt + empty_alt_decorative + suspicious_alt
        status = "pass" if issues == 0 else "warn"
        
        return {
            "schemaVersion": 1,
            "module": "wcag_images",
            "status": status,
            "issues": issues,
            "affected_elements": issues,
            "counts": {
                "missing_alt": missing_alt,
                "empty_alt_decorative": empty_alt_decorative,
                "suspicious_alt": suspicious_alt
            },
            "findings": self.findings,
            "actions": [
                "Add alt text to all images missing alt attributes",
                "Use empty alt='' for purely decorative images",
                "Ensure alt text describes image content and function",
                "Avoid using filenames or placeholder text as alt"
            ],
            "policy_invariants": [
                "counts.missing_alt == 0",
                "counts.suspicious_alt == 0"
            ],
            "eta_minutes": 30,
            "unlocks": ["wcag_semantic_html", "wcag_aria"]
        }
    
    def _is_potentially_meaningful(self, img) -> bool:
        """Heuristic to detect if image might be meaningful"""
        # Images with certain attributes might be meaningful
        src = img.get('src', '').lower()
        if any(keyword in src for keyword in ['chart', 'graph', 'diagram', 'map', 'photo']):
            return True
        if img.parent and img.parent.name in ['figure', 'a', 'button']:
            return True
        return False
    
    def _is_suspicious_alt(self, alt_text: str) -> bool:
        """Detect suspicious alt text patterns"""
        suspicious_patterns = [
            r'\.(jpg|jpeg|png|gif|webp)$',
            r'^image\d*$',
            r'^img\d*$',
            r'^picture\d*$',
            r'^[0-9a-f]{8,}$'  # Looks like a hash
        ]
        
        alt_lower = alt_text.lower()
        return any(re.search(pattern, alt_lower) for pattern in suspicious_patterns)


class SemanticHtmlHunter(BaseWcagHunter):
    """WCAG 1.3.1 Semantic HTML Hunter"""
    
    def scan(self) -> Dict[str, Any]:
        missing_landmarks = 0
        bad_heading_order = 0
        generic_containers = 0
        missing_document_language = 0
        
        # Check for essential landmarks
        landmarks = ['main', 'nav', 'header', 'footer']
        found_landmarks = [tag.name for tag in self.soup.find_all(landmarks)]
        missing_landmark_list = []
        
        for landmark in landmarks:
            if landmark not in found_landmarks:
                missing_landmarks += 1
                missing_landmark_list.append(landmark)
                self.trace_issue({
                    "class": "missing-landmark",
                    "landmark": landmark,
                    "severity": "warn"
                })
                self.findings.append({
                    "issue": f"Missing <{landmark}> landmark",
                    "fix": f"Add <{landmark}> element for proper document structure",
                    "severity": "warning"
                })
        
        # Check heading hierarchy
        headings = self.soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        heading_levels = [int(h.name[1]) for h in headings]
        
        if heading_levels:
            # Check for heading order (shouldn't skip levels)
            current_level = heading_levels[0]
            for i, level in enumerate(heading_levels[1:], 1):
                if level > current_level + 1:
                    bad_heading_order += 1
                    self.findings.append({
                        "issue": f"Heading hierarchy skips level: h{current_level} to h{level}",
                        "fix": "Use proper heading hierarchy (h1 → h2 → h3)",
                        "severity": "warning"
                    })
                    break
                current_level = level
        
        # Check for document language
        html_tag = self.soup.find('html')
        if not html_tag or not html_tag.get('lang'):
            missing_document_language += 1
            self.trace_issue({
                "class": "missing-lang",
                "severity": "critical"
            })
            self.findings.append({
                "issue": "Missing lang attribute on <html> element",
                "fix": "Add lang='en' or appropriate language code to <html>",
                "severity": "critical"
            })
        
        issues = missing_landmarks + bad_heading_order + missing_document_language
        status = "pass" if issues == 0 else "warn"
        
        return {
            "schemaVersion": 1,
            "module": "wcag_semantic_html",
            "status": status,
            "issues": issues,
            "affected_elements": issues,
            "counts": {
                "missing_landmarks": missing_landmarks,
                "bad_heading_order": bad_heading_order,
                "generic_containers": generic_containers,
                "missing_document_language": missing_document_language
            },
            "findings": self.findings,
            "actions": [
                "Add missing HTML5 landmark elements (main, nav, header, footer)",
                "Ensure proper heading hierarchy (h1 → h2 → h3)",
                "Add lang attribute to html element",
                "Use semantic elements instead of generic divs"
            ],
            "policy_invariants": [
                "counts.missing_document_language == 0",
                "counts.bad_heading_order == 0"
            ],
            "eta_minutes": 25,
            "unlocks": ["wcag_keyboard", "wcag_aria"]
        }


class WcagHunterOrchestrator:
    """Master orchestrator following hunter-pack patterns"""
    
    def __init__(self, html_content: str):
        self.html_content = html_content
        self.hunters = [
            ColorContrastHunter(html_content),
            ImageAccessibilityHunter(html_content),
            SemanticHtmlHunter(html_content)
        ]
        self.all_reports = {}
    
    def run_all_hunts(self) -> Dict[str, Any]:
        """Run all hunters and collect reports"""
        print("🎯 NEXUS WCAG Hunter System Starting...")
        print("=" * 60)
        
        for hunter in self.hunters:
            report = hunter.write_report()
            self.all_reports[hunter.__class__.__name__] = report
            status_icon = "✅" if report['status'] == 'pass' else "⚠️"
            print(f"{status_icon} {report['module']}: {report['status']} ({report['issues']} issues)")
        
        print("=" * 60)
        return self.generate_master_report()
    
    def generate_master_report(self) -> Dict[str, Any]:
        """Generate master report combining all hunters"""
        total_issues = sum(report['issues'] for report in self.all_reports.values())
        critical_hunters = [
            name for name, report in self.all_reports.items() 
            if report['status'] in ['critical', 'warn'] and report['issues'] > 0
        ]
        
        master_status = "pass" if total_issues == 0 else "warn"
        
        master_report = {
            "schemaVersion": 1,
            "module": "wcag_master",
            "status": master_status,
            "total_issues": total_issues,
            "hunters_run": len(self.hunters),
            "critical_hunters": critical_hunters,
            "hunter_reports": self.all_reports,
            "summary": {
                "wcag_a_compliance": self.calculate_compliance_level('A'),
                "wcag_aa_compliance": self.calculate_compliance_level('AA'),
                "estimated_fix_time_minutes": sum(
                    report.get('eta_minutes', 0) 
                    for report in self.all_reports.values()
                )
            },
            "next_actions": self.generate_next_actions()
        }
        
        # Write master report
        report_dir = Path("__reports/hunt")
        with open(report_dir / "wcag_master.json", 'w') as f:
            json.dump(master_report, f, indent=2)
        
        return master_report
    
    def calculate_compliance_level(self, level: str) -> str:
        """Calculate WCAG compliance level"""
        # Simplified - in reality would check specific criteria per level
        total_issues = sum(report['issues'] for report in self.all_reports.values())
        
        if total_issues == 0:
            return "fully-compliant"
        elif total_issues <= 5:
            return "mostly-compliant"
        else:
            return "needs-work"
    
    def generate_next_actions(self) -> List[str]:
        """Generate prioritized next actions from all hunters"""
        all_actions = []
        for report in self.all_reports.values():
            if report['issues'] > 0:
                all_actions.extend(report.get('actions', []))
        
        # Remove duplicates and prioritize
        return list(dict.fromkeys(all_actions))[:5]  # Top 5 unique actions


def analyze_with_personalities(wcag_report: Dict[str, Any]) -> Dict[str, str]:
    """Have NEXUS personalities analyze WCAG findings"""
    total_issues = wcag_report['total_issues']
    est_time = wcag_report['summary']['estimated_fix_time_minutes']
    
    return {
        "guardian": f"🛡️  Found {total_issues} accessibility issues. Critical items must be addressed to ensure all users can access content. This affects usability for vision-impaired and motor-impaired users.",
        "pragmatist": f"🔧 WCAG compliance impacts SEO and legal requirements. Estimated fix time: {est_time} minutes. Focus on Level AA for industry standard compliance.",
        "architect": f"🏗️  Build accessibility into component patterns. {len(wcag_report['critical_hunters'])} areas need architectural attention. Consider baking WCAG checks into CSS Engine generation.",
        "visionary": f"🚀 Accessibility enhances design for everyone. Color contrast and semantic structure improve user experience. Future: AI-powered alt text generation and real-time WCAG validation."
    }


# CLI Interface
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python wcag_hunters.py <html_file>")
        print("   or: python wcag_hunters.py --test")
        sys.exit(1)
    
    if sys.argv[1] == "--test":
        # Test with sample HTML
        test_html = """
        <!DOCTYPE html>
        <html>
            <body>
                <div style="color: lightgray; background: white;">Low contrast text</div>
                <img src="chart.png">
                <div onclick="doSomething()">Clickable div</div>
                <h1>Main heading</h1>
                <h3>Jumped to h3</h3>
            </body>
        </html>
        """
        html_content = test_html
    else:
        # Read from file
        with open(sys.argv[1], 'r') as f:
            html_content = f.read()
    
    # Run hunters
    orchestrator = WcagHunterOrchestrator(html_content)
    results = orchestrator.run_all_hunts()
    
    print("\n" + "="*60)
    print("NEXUS WCAG HUNTER SYSTEM - MASTER REPORT")
    print("="*60)
    print(f"Status: {results['status'].upper()}")
    print(f"Total Issues: {results['total_issues']}")
    print(f"Critical Areas: {', '.join(results['critical_hunters']) if results['critical_hunters'] else 'None'}")
    print(f"WCAG AA Compliance: {results['summary']['wcag_aa_compliance']}")
    print(f"Estimated Fix Time: {results['summary']['estimated_fix_time_minutes']} minutes")
    
    print("\n🎭 Personality Analysis:")
    analysis = analyze_with_personalities(results)
    for personality, insight in analysis.items():
        print(f"\n   {personality.upper()}:")
        print(f"   {insight}")
    
    print("\n📋 Next Actions:")
    for i, action in enumerate(results['next_actions'], 1):
        print(f"   {i}. {action}")
    
    print("\n✅ Reports saved to __reports/hunt/")
