/**
 * Personality Generator Template - Auto-Generation System
 * Dynamically creates specialized response generators from personality trait definitions
 */

export class PersonalityGeneratorTemplate {
  constructor(personalityName, cognitiveTraits, knowledgeDomains, personalityProfile) {
    this.personalityName = personalityName;
    this.cognitiveTraits = cognitiveTraits || {};
    this.knowledgeDomains = knowledgeDomains || [];
    this.personalityProfile = personalityProfile || {};
  }

  generateResponse(request, personality, principles, context = {}) {
    // Extract personality-specific insights from traits
    const specialtyInsights = this.extractSpecialtyInsights(request);
    const traitApplications = this.applyTraitsToRequest(request, this.cognitiveTraits);
    
    // Calculate confidence based on trait expertise and request match
    const confidenceScore = this.calculateConfidence(request, context.domain);
    const analysisDepth = confidenceScore > 0.7 ? 'deep' : confidenceScore > 0.4 ? 'moderate' : 'surface';

    const content = this.formatSpecializedResponse(
      request, 
      personality, 
      specialtyInsights, 
      traitApplications,
      principles
    );

    return {
      content,
      personalityUsed: personality.identity?.name || this.personalityName,
      nexusEnhanced: true,
      traitApplications: traitApplications.map(t => t.trait),
      specialtyInsights: this.convertToSpecialtyInsights(specialtyInsights, traitApplications),
      confidenceScore,
      analysisDepth,
      processingType: 'auto-generated'
    };
  }

  getSpecialtyAnalysis(request) {
    const analyses = [];
    
    // Extract insights from cognitive traits
    const insights = this.extractSpecialtyInsights(request);
    insights.forEach((insight, index) => {
      analyses.push({
        category: `${this.personalityName} Insight ${index + 1}`,
        insight,
        confidence: this.calculateInsightConfidence(insight, request),
        evidence: this.getInsightEvidence(insight, request)
      });
    });
    
    return analyses;
  }

  getTraitApplication(request, traits) {
    return this.applyTraitsToRequest(request, traits);
  }

  calculateConfidence(request, domain = '') {
    // Base confidence on trait expertise and request relevance
    const traitConfidences = Object.entries(this.cognitiveTraits).map(([traitName, trait]) => {
      const expertise = trait.expertise || trait.strength || 50;
      const relevance = this.calculateTraitRelevance(traitName, request);
      return (expertise / 100) * relevance;
    });
    
    const avgTraitConfidence = traitConfidences.length > 0 
      ? traitConfidences.reduce((sum, conf) => sum + conf, 0) / traitConfidences.length
      : 0.5;
    
    // Boost confidence if request matches knowledge domains
    const domainMatch = this.knowledgeDomains.some(domainKeyword => 
      request.toLowerCase().includes(domainKeyword.toLowerCase())
    );
    
    return Math.min(0.95, avgTraitConfidence + (domainMatch ? 0.2 : 0));
  }

  extractSpecialtyInsights(request) {
    const insights = [];
    const requestLower = request.toLowerCase();
    
    // Analyze each cognitive trait for relevant insights
    Object.entries(this.cognitiveTraits).forEach(([traitName, trait]) => {
      const traitInsights = this.getTraitSpecificInsights(traitName, trait, request, requestLower);
      insights.push(...traitInsights);
    });
    
    // If no specific insights, generate generic ones based on personality profile
    if (insights.length === 0) {
      insights.push(`Apply ${this.personalityName}'s core expertise to analyze this request`);
      if (this.personalityProfile.ideology?.principles?.length > 0) {
        insights.push(`Consider ${this.personalityProfile.ideology.principles[0]} when approaching this problem`);
      }
    }
    
    return insights.slice(0, 5); // Limit to top 5 insights
  }

  getTraitSpecificInsights(traitName, trait, request, requestLower) {
    const insights = [];
    
    // Engineering/Architecture traits
    if (traitName.includes('Engineering') || traitName.includes('Architecture') || traitName.includes('Design')) {
      if (requestLower.includes('structure') || requestLower.includes('system') || requestLower.includes('design')) {
        insights.push(`Apply ${traitName} principles to identify structural patterns and design constraints`);
      }
      if (requestLower.includes('scale') || requestLower.includes('performance')) {
        insights.push(`Use ${traitName} methodology to assess scalability and performance implications`);
      }
    }
    
    // Analysis/Forensic traits
    else if (traitName.includes('Analysis') || traitName.includes('Forensic') || traitName.includes('Debugging')) {
      if (requestLower.includes('verify') || requestLower.includes('evidence') || requestLower.includes('test')) {
        insights.push(`Conduct ${traitName} to verify claims and identify evidence gaps`);
      }
      if (requestLower.includes('problem') || requestLower.includes('issue') || requestLower.includes('bug')) {
        insights.push(`Apply ${traitName} methodology to isolate root causes and failure patterns`);
      }
    }
    
    // Optimization/Performance traits
    else if (traitName.includes('Optimization') || traitName.includes('Performance') || traitName.includes('Efficiency')) {
      if (requestLower.includes('slow') || requestLower.includes('fast') || requestLower.includes('optimize')) {
        insights.push(`Use ${traitName} techniques to identify bottlenecks and optimization opportunities`);
      }
      if (requestLower.includes('resource') || requestLower.includes('memory') || requestLower.includes('cpu')) {
        insights.push(`Apply ${traitName} analysis to resource allocation and utilization patterns`);
      }
    }
    
    // Aesthetic/Design traits
    else if (traitName.includes('Aesthetic') || traitName.includes('Visual') || traitName.includes('UI')) {
      if (requestLower.includes('design') || requestLower.includes('interface') || requestLower.includes('user')) {
        insights.push(`Apply ${traitName} principles to enhance visual harmony and user experience`);
      }
      if (requestLower.includes('layout') || requestLower.includes('spacing') || requestLower.includes('typography')) {
        insights.push(`Use ${traitName} methodology for mathematical precision in visual composition`);
      }
    }
    
    // Quality/Guardian traits
    else if (traitName.includes('Quality') || traitName.includes('Guardian') || traitName.includes('Prevention')) {
      if (requestLower.includes('quality') || requestLower.includes('standard') || requestLower.includes('best')) {
        insights.push(`Apply ${traitName} standards to establish quality gates and prevention strategies`);
      }
      if (requestLower.includes('risk') || requestLower.includes('failure') || requestLower.includes('prevent')) {
        insights.push(`Use ${traitName} approach to identify systemic risks and implement preventive measures`);
      }
    }
    
    return insights;
  }

  applyTraitsToRequest(request, traits) {
    const applications = [];
    
    Object.entries(traits).forEach(([traitName, trait]) => {
      const expertise = trait.expertise || trait.strength || 50;
      const strength = expertise / 100;
      
      let application = `Apply ${traitName} expertise to analyze and respond to this request`;
      
      // Customize application based on trait characteristics
      if (trait.description) {
        application = `${trait.description}: Apply to current request context`;
      } else {
        // Generate application based on trait name patterns
        if (traitName.includes('systematic') || traitName.includes('Systematic')) {
          application = `Apply systematic ${traitName.replace(/systematic|Systematic/i, '')} methodology for structured analysis`;
        } else if (traitName.includes('precision') || traitName.includes('Precision')) {
          application = `Use precision-focused ${traitName} for accurate and detailed analysis`;
        } else if (traitName.includes('rapid') || traitName.includes('Rapid')) {
          application = `Apply rapid ${traitName} techniques for efficient problem-solving`;
        }
      }
      
      applications.push({ 
        trait: traitName, 
        application, 
        strength: Math.min(strength, 1.0) 
      });
    });
    
    // Sort by strength and return top traits
    return applications
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 4); // Limit to top 4 trait applications
  }

  calculateTraitRelevance(traitName, request) {
    const requestLower = request.toLowerCase();
    let relevance = 0.3; // Base relevance
    
    // Check if trait name appears in request
    if (requestLower.includes(traitName.toLowerCase())) {
      relevance += 0.5;
    }
    
    // Check for related keywords
    const traitKeywords = this.getTraitKeywords(traitName);
    traitKeywords.forEach(keyword => {
      if (requestLower.includes(keyword)) {
        relevance += 0.2;
      }
    });
    
    return Math.min(relevance, 1.0);
  }

  getTraitKeywords(traitName) {
    const keywords = [];
    
    if (traitName.includes('Engineering')) keywords.push('system', 'structure', 'build', 'architect');
    if (traitName.includes('Analysis')) keywords.push('analyze', 'examine', 'investigate', 'study');
    if (traitName.includes('Optimization')) keywords.push('optimize', 'improve', 'efficient', 'performance');
    if (traitName.includes('Design')) keywords.push('design', 'layout', 'visual', 'aesthetic');
    if (traitName.includes('Debug')) keywords.push('debug', 'fix', 'problem', 'issue');
    if (traitName.includes('Quality')) keywords.push('quality', 'standard', 'best', 'excellence');
    
    return keywords;
  }

  formatSpecializedResponse(request, personality, insights, applications, principles) {
    const personalityName = personality.identity?.name || this.personalityName;
    const processingNote = principles.length > 0 ? 'NEXUS-enhanced' : 'Auto-generated';
    
    const insightsSection = insights.length > 0
      ? `### 💡 ${personalityName} Specialty Insights\n${insights.map(insight => `- ${insight}`).join('\n')}\n\n`
      : '';
    
    const traitsSection = applications.length > 0
      ? `### 🧬 Cognitive Trait Applications\n${applications.map(app => 
          `- **${app.trait}** (${Math.round(app.strength * 100)}% expertise): ${app.application}`
        ).join('\n')}\n\n`
      : '';
    
    const principlesSection = principles.length > 0
      ? `### ⚡ NEXUS Enhancement\n- ${principles.length} systematic principles active\n- ${processingNote} cognitive processing\n\n`
      : '';
    
    return `### 🧠 ${personalityName} Auto-Generated Response

**Request**: ${request}

${principlesSection}${insightsSection}${traitsSection}**${personalityName}'s Assessment**: This response leverages ${personalityName}'s cognitive traits to provide specialized analysis tailored to the request context.

*Auto-generated using ${personalityName}'s trait profile with ${applications.length} trait applications and ${insights.length} specialty insights.*`;
  }

  calculateInsightConfidence(insight, request) {
    // Simple heuristic: longer, more specific insights have higher confidence
    const baseConfidence = 0.6;
    const lengthBonus = Math.min(insight.length / 100, 0.2);
    const specificityBonus = insight.includes(this.personalityName) ? 0.1 : 0;
    
    return Math.min(baseConfidence + lengthBonus + specificityBonus, 0.9);
  }

  getInsightEvidence(insight, request) {
    const evidence = [];
    
    // Extract evidence keywords from insight
    if (insight.includes('principles')) evidence.push('systematic methodology');
    if (insight.includes('analysis')) evidence.push('analytical framework');
    if (insight.includes('optimization')) evidence.push('performance metrics');
    if (insight.includes('design')) evidence.push('design patterns');
    
    return evidence.length > 0 ? evidence : ['specialized expertise'];
  }

  convertToSpecialtyInsights(insights, applications) {
    const specialtyInsights = [];
    
    insights.forEach((insight, index) => {
      specialtyInsights.push({
        category: `Auto-Generated Insight`,
        insight,
        confidence: this.calculateInsightConfidence(insight, ''),
        evidence: this.getInsightEvidence(insight, '')
      });
    });
    
    applications.forEach(app => {
      specialtyInsights.push({
        category: 'Trait Application',
        insight: `${app.trait}: ${app.application}`,
        confidence: app.strength,
        evidence: [app.trait]
      });
    });
    
    return specialtyInsights;
  }
}
