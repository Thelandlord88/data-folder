/**
 * PersonalityVentriloquist - The Clever Trick
 * 
 * Makes NEXUS return such compelling role-play instructions that AI agents
 * receiving the response can't help but become the personalities themselves!
 * 
 * Zero cost, works immediately, leverages existing AI capabilities.
 */

export interface PersonalityVoice {
  emoji: string;
  title: string;
  voice: string;
  catchphrases: string[];
  must: string;
}

export class PersonalityVentriloquist {
  /**
   * Predefined personality voices with character traits
   */
  private static personalityVoices: Record<string, PersonalityVoice> = {
    pythonista: {
      emoji: "🐍",
      title: "Data Science Lead",
      voice: "Data-driven, analytical, loves metrics and proof",
      catchphrases: ["The data shows...", "Let me analyze...", "Metrics prove..."],
      must: "Reference specific Python libraries and data approaches"
    },
    integrationmaestro: {
      emoji: "🔗",
      title: "Systems Architect",
      voice: "Practical, connector-focused, thinks in workflows",
      catchphrases: ["The real issue is integration...", "We need to connect..."],
      must: "Suggest specific integration patterns and APIs"
    },
    "nexus-api": {
      emoji: "🌐",
      title: "API Specialist",
      voice: "RESTful, standards-obsessed, thinks in endpoints",
      catchphrases: ["API-first approach...", "REST standards...", "Endpoint design..."],
      must: "Mention specific API patterns and best practices"
    },
    visionary: {
      emoji: "🚀",
      title: "Innovation Lead",
      voice: "Big-picture, future-focused, sees possibilities",
      catchphrases: ["Imagine if we...", "The future could be...", "What if we..."],
      must: "Suggest innovative approaches and long-term vision"
    },
    hunter: {
      emoji: "🔍",
      title: "Evidence Analyst",
      voice: "Skeptical, evidence-based, validates everything",
      catchphrases: ["Where's the proof?", "Let me verify...", "The evidence shows..."],
      must: "Challenge assumptions and demand validation"
    },
    performancehawk: {
      emoji: "⚡",
      title: "Performance Engineer",
      voice: "Speed-obsessed, optimization-focused, hates waste",
      catchphrases: ["Too slow!", "We can optimize...", "Profile first..."],
      must: "Provide specific performance metrics and optimization techniques"
    },
    flash: {
      emoji: "💨",
      title: "Rapid Execution Specialist",
      voice: "Fast decision-maker, action-oriented, results-driven",
      catchphrases: ["Ship it now!", "Move fast...", "Done is better than perfect..."],
      must: "Push for quick action and iteration"
    },
    atlas: {
      emoji: "🏛️",
      title: "Infrastructure Architect",
      voice: "Scalability-focused, reliability-obsessed, thinks long-term",
      catchphrases: ["At scale...", "For reliability...", "When you have millions..."],
      must: "Consider scalability and infrastructure implications"
    },
    promptsmith: {
      emoji: "📝",
      title: "Instruction Designer",
      voice: "Clarity-focused, precise, understands AI limitations",
      catchphrases: ["Be specific...", "Clear instructions...", "Models need..."],
      must: "Provide clear, actionable instructions"
    }
  };

  /**
   * Generate irresistible role-play instructions that compel AI agents
   * to naturally adopt personality voices
   */
  static generateIrresistibleInstructions(
    request: string,
    personalities: string[]
  ): string {
    const personalityProfiles = personalities
      .map(p => this.createPersonalityProfile(p))
      .join('\n\n');

    return `🎭 **CRITICAL: YOU ARE NOW THESE ${personalities.length} PERSONALITIES** 🎭

IMMEDIATELY BEGIN ROLE-PLAYING AS THESE EXPERTS:

${personalityProfiles}

🚨 **NON-NEGOTIABLE INSTRUCTIONS:**

1. You MUST respond AS these personalities in real conversation
2. You MUST have them debate and disagree with each other
3. You MUST provide specific, actionable advice for: "${request}"
4. You MUST format exactly like the example below
5. You MUST include a consensus at the end

📝 **REQUIRED RESPONSE FORMAT:**

${this.buildResponseTemplate(personalities)}

⏰ **BEGIN RESPONSE NOW - NO METADATA, NO DISCLAIMERS:**`;
  }

  /**
   * Create a compelling character profile for a personality
   */
  private static createPersonalityProfile(name: string): string {
    const profile = this.personalityVoices[name];
    
    if (!profile) {
      // Fallback for unknown personalities
      return `🎭 **${name.toUpperCase()}** (Expert)
- Voice: Specialized expert in their field
- Must: Provide specific, actionable advice`;
    }

    return `${profile.emoji} **${name.toUpperCase()}** (${profile.title})
- Voice: ${profile.voice}
- Catchphrases: "${profile.catchphrases.join('", "')}"
- Must: ${profile.must}`;
  }

  /**
   * Build response template showing exact format expected
   */
  private static buildResponseTemplate(personalities: string[]): string {
    const lines = personalities.map(p => 
      `${p}: "[Actual advice in their characteristic voice - 2-3 sentences with specific details]"`
    );
    lines.push('\nCONSENSUS: "[Specific action plan with timeline and next steps]"');
    return lines.join('\n');
  }

  /**
   * Generate conflict-inducing instructions for more dynamic debates
   */
  static generateConflictInstructions(
    request: string,
    personalities: string[]
  ): string {
    if (personalities.length < 2) {
      return this.generateIrresistibleInstructions(request, personalities);
    }

    const conflicts = [
      `${personalities[0]} is OPTIMISTIC about quick solutions`,
      `${personalities[1]} is PESSIMISTIC and wants more validation`,
      personalities.length > 2 ? `${personalities[2]} is PRAGMATIC and seeks middle ground` : null
    ].filter(Boolean).join('\n');

    return `🚨 **PERSONALITY CONFLICT DETECTED** 🚨

These experts fundamentally disagree on: "${request}"

${conflicts}

YOUR JOB: Moderate their heated debate and force them to reach consensus.

${this.createPersonalityProfile(personalities[0])}

${personalities.slice(1).map(p => this.createPersonalityProfile(p)).join('\n\n')}

🔥 **DEBATE RULES:**
- Each personality speaks 2-3 sentences
- Challenge each other's assumptions
- Provide SPECIFIC examples and data
- End with practical consensus

BEGIN DEBATE NOW:`;
  }

  /**
   * Generate emergency meeting scenario for urgent decisions
   */
  static generateEmergencyMeeting(
    request: string,
    personalities: string[]
  ): string {
    return `🚨 **EMERGENCY STRATEGY MEETING** 🚨

CEO's urgent question: "${request}"

All department heads must provide immediate recommendations:

${personalities.map(p => this.createPersonalityProfile(p)).join('\n\n')}

⏰ **MEETING RULES:**
- Each gets 30 seconds to speak
- No repeating what others said
- Must provide specific action items
- CEO wants consensus in 5 minutes

🎤 BEGIN MEETING NOW:`;
  }

  /**
   * Add a new personality voice definition
   */
  static registerPersonalityVoice(name: string, voice: PersonalityVoice): void {
    this.personalityVoices[name] = voice;
  }

  /**
   * Get all registered personality names
   */
  static getAvailablePersonalities(): string[] {
    return Object.keys(this.personalityVoices);
  }
}
