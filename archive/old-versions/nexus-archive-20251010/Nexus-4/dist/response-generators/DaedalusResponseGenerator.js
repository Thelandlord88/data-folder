/**
 * Daedalus Response Generator - Architectural Intelligence
 * Specializes in systems thinking, architectural analysis, and design patterns
 */
export class DaedalusResponseGenerator {
    generateResponse(request, personality, principles, context) {
        const architecturalAnalysis = this.performArchitecturalAnalysis(request);
        const systemicPatterns = this.identifySystemicPatterns(request);
        const designPrinciples = this.extractDesignPrinciples(request);
        const traitApplications = this.getTraitApplication(request, ['architecturalThinking', 'systemsDesign', 'scalabilityFocus']);
        const content = this.synthesizeArchitecturalResponse(request, architecturalAnalysis, systemicPatterns, designPrinciples, personality.identity?.name || 'Daedalus');
        return {
            content,
            personalityUsed: personality.identity?.name || 'Daedalus',
            nexusEnhanced: true,
            traitApplications: traitApplications.map(ta => ta.trait),
            specialtyInsights: this.convertToSpecialtyInsights(architecturalAnalysis, systemicPatterns),
            confidenceScore: this.calculateConfidence(request, 'architecture'),
            analysisDepth: this.determineAnalysisDepth(request)
        };
    }
    getSpecialtyAnalysis(request) {
        const analyses = [];
        // Structural analysis
        if (this.containsStructuralConcerns(request)) {
            analyses.push({
                category: 'Structural Integrity',
                insight: 'Component boundaries must enforce single responsibility principle',
                confidence: 0.9,
                evidence: ['cohesion patterns', 'coupling analysis', 'interface clarity']
            });
        }
        // Scalability analysis
        if (this.containsScalabilityConcerns(request)) {
            analyses.push({
                category: 'Scalability Architecture',
                insight: 'Design must accommodate horizontal scaling vectors from inception',
                confidence: 0.8,
                evidence: ['load distribution patterns', 'state management', 'resource allocation']
            });
        }
        // Integration analysis
        if (this.containsIntegrationConcerns(request)) {
            analyses.push({
                category: 'Integration Strategy',
                insight: 'Explicit contracts preferred over implicit coupling mechanisms',
                confidence: 0.85,
                evidence: ['interface definitions', 'dependency management', 'protocol specification']
            });
        }
        return analyses;
    }
    getTraitApplication(request, traits) {
        const applications = [];
        // Architectural Thinking
        if (traits.includes('architecturalThinking')) {
            applications.push({
                trait: 'architecturalThinking',
                application: 'Systematic decomposition of system components and their relationships',
                strength: this.assessArchitecturalComplexity(request)
            });
        }
        // Systems Design
        if (traits.includes('systemsDesign')) {
            applications.push({
                trait: 'systemsDesign',
                application: 'Pattern recognition and application of proven design paradigms',
                strength: this.assessDesignPatternRelevance(request)
            });
        }
        // Scalability Focus
        if (traits.includes('scalabilityFocus')) {
            applications.push({
                trait: 'scalabilityFocus',
                application: 'Analysis of growth vectors and constraint identification',
                strength: this.assessScalabilityRequirements(request)
            });
        }
        return applications;
    }
    calculateConfidence(request, domain) {
        let confidence = 0.5; // Base confidence
        // Architecture domain expertise
        if (domain === 'architecture') {
            if (this.containsArchitecturalTerms(request))
                confidence += 0.3;
            if (this.containsSystemDesignConcepts(request))
                confidence += 0.2;
            if (this.containsScalabilityIndicators(request))
                confidence += 0.15;
        }
        // Complexity bonus
        const complexity = this.assessRequestComplexity(request);
        if (complexity === 'complex')
            confidence += 0.1;
        return Math.min(confidence, 1.0);
    }
    performArchitecturalAnalysis(request) {
        const analyses = [];
        if (this.containsStructuralConcerns(request)) {
            analyses.push({
                category: 'Structural Analysis',
                insight: 'System structure determines behavioral constraints',
                rationale: 'Architecture shapes the possible vs impossible at runtime',
                tradeoffs: ['Flexibility vs Performance', 'Simplicity vs Extensibility']
            });
        }
        if (this.containsScalabilityConcerns(request)) {
            analyses.push({
                category: 'Scalability Vector',
                insight: 'Identify bottlenecks before they constrain growth',
                rationale: 'Proactive scaling design prevents reactive architecture rewrites',
                tradeoffs: ['Memory vs CPU', 'Consistency vs Availability']
            });
        }
        if (this.containsModularityConcerns(request)) {
            analyses.push({
                category: 'Modular Design',
                insight: 'Loose coupling enables independent evolution',
                rationale: 'Modules that change together should be packaged together',
                tradeoffs: ['Modularity vs Simplicity', 'Abstraction vs Performance']
            });
        }
        return analyses;
    }
    identifySystemicPatterns(request) {
        const patterns = [];
        if (this.indicatesLayeredArchitecture(request)) {
            patterns.push({
                pattern: 'Layered Architecture',
                application: 'Separation of concerns through hierarchical organization',
                benefits: ['Clear dependencies', 'Testability', 'Maintainability'],
                considerations: ['Performance overhead', 'Complexity for simple cases']
            });
        }
        if (this.indicatesEventDrivenDesign(request)) {
            patterns.push({
                pattern: 'Event-Driven Architecture',
                application: 'Loose coupling through asynchronous message passing',
                benefits: ['Scalability', 'Resilience', 'Flexibility'],
                considerations: ['Eventual consistency', 'Debugging complexity']
            });
        }
        return patterns;
    }
    extractDesignPrinciples(request) {
        const principles = [];
        // Always include core architectural principles
        principles.push({
            principle: 'Single Responsibility',
            rationale: 'Each component should have one reason to change',
            implementation: 'Define clear, focused interfaces with minimal surface area'
        });
        if (this.requiresScalabilityFocus(request)) {
            principles.push({
                principle: 'Design for Scale',
                rationale: 'Anticipate growth vectors to avoid architectural rewrites',
                implementation: 'Use horizontal scaling patterns and stateless components'
            });
        }
        return principles;
    }
    synthesizeArchitecturalResponse(request, analyses, patterns, principles, personalityName) {
        const analysisSection = analyses.length > 0
            ? `### 🏗️ Architectural Analysis\n${analyses.map(a => `- **${a.category}**: ${a.insight}\n  *${a.rationale}*`).join('\n')}\n\n`
            : '';
        const patternsSection = patterns.length > 0
            ? `### 🔄 Systemic Patterns\n${patterns.map(p => `- **${p.pattern}**: ${p.application}\n  *Benefits: ${p.benefits.join(', ')}*`).join('\n')}\n\n`
            : '';
        const principlesSection = principles.length > 0
            ? `### 📐 Design Principles Applied\n${principles.map(dp => `- **${dp.principle}**: ${dp.implementation}\n  *${dp.rationale}*`).join('\n')}\n\n`
            : '';
        const recommendation = this.synthesizeRecommendation(request, analyses);
        return `### 🧠 ${personalityName} Architectural Response

**Request**: ${request}

${analysisSection}${patternsSection}${principlesSection}**Architectural Synthesis**: ${recommendation}

*This analysis applies systematic architectural thinking to identify structural patterns, scalability vectors, and design principles relevant to your specific context.*`;
    }
    synthesizeRecommendation(request, analyses) {
        if (analyses.length === 0) {
            return 'Focus on establishing clear architectural boundaries and explicit contracts between components.';
        }
        const primaryConcern = analyses[0];
        return `Primary focus should be ${primaryConcern.category.toLowerCase()}: ${primaryConcern.insight.toLowerCase()}. ${primaryConcern.rationale}`;
    }
    // Analysis helper methods
    containsStructuralConcerns(request) {
        return /structure|component|module|organization|hierarchy/i.test(request);
    }
    containsScalabilityConcerns(request) {
        return /scale|scalab|performance|load|growth|bottleneck/i.test(request);
    }
    containsIntegrationConcerns(request) {
        return /integrat|connect|interface|api|coupling|dependency/i.test(request);
    }
    containsModularityConcerns(request) {
        return /modular|module|separation|decouple|isolat/i.test(request);
    }
    containsArchitecturalTerms(request) {
        return /architect|design|pattern|structure|system/i.test(request);
    }
    containsSystemDesignConcepts(request) {
        return /design|pattern|principle|framework|paradigm/i.test(request);
    }
    containsScalabilityIndicators(request) {
        return /scale|performance|load|concurrent|distributed/i.test(request);
    }
    indicatesLayeredArchitecture(request) {
        return /layer|tier|level|hierarchy|stack/i.test(request);
    }
    indicatesEventDrivenDesign(request) {
        return /event|message|async|reactive|stream/i.test(request);
    }
    requiresScalabilityFocus(request) {
        return /scale|growth|performance|load|concurrent/i.test(request);
    }
    assessArchitecturalComplexity(request) {
        let complexity = 0.5;
        if (/system|architect|design/i.test(request))
            complexity += 0.3;
        if (/scale|performance|distributed/i.test(request))
            complexity += 0.2;
        return Math.min(complexity, 1.0);
    }
    assessDesignPatternRelevance(request) {
        let relevance = 0.4;
        if (/pattern|design|structure/i.test(request))
            relevance += 0.4;
        if (/component|module|interface/i.test(request))
            relevance += 0.2;
        return Math.min(relevance, 1.0);
    }
    assessScalabilityRequirements(request) {
        let requirement = 0.3;
        if (/scale|scalab|growth|performance/i.test(request))
            requirement += 0.5;
        if (/load|concurrent|distributed/i.test(request))
            requirement += 0.2;
        return Math.min(requirement, 1.0);
    }
    assessRequestComplexity(request) {
        const complexityIndicators = [
            /system|architect/i.test(request),
            /scale|performance/i.test(request),
            /integrat|distributed/i.test(request),
            /pattern|design/i.test(request)
        ].filter(Boolean).length;
        if (complexityIndicators >= 3)
            return 'complex';
        if (complexityIndicators >= 2)
            return 'moderate';
        return 'simple';
    }
    determineAnalysisDepth(request) {
        const complexity = this.assessRequestComplexity(request);
        const architecturalDepth = this.containsArchitecturalTerms(request);
        if (complexity === 'complex' && architecturalDepth)
            return 'deep';
        if (complexity === 'moderate' || architecturalDepth)
            return 'moderate';
        return 'surface';
    }
    convertToSpecialtyInsights(analyses, patterns) {
        const insights = [];
        analyses.forEach(analysis => {
            insights.push({
                category: analysis.category,
                insight: analysis.insight,
                confidence: 0.8,
                evidence: analysis.tradeoffs
            });
        });
        patterns.forEach(pattern => {
            insights.push({
                category: 'Pattern Application',
                insight: `${pattern.pattern}: ${pattern.application}`,
                confidence: 0.75,
                evidence: pattern.benefits
            });
        });
        return insights;
    }
}
//# sourceMappingURL=DaedalusResponseGenerator.js.map