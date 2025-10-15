/**
 * StreamingVentriloquist - Real-time Personality Streaming
 * 
 * Enables personalities to "think out loud" in real-time, creating
 * a magical user experience where you watch the debate unfold live!
 * 
 * Week 2 Feature - Implemented Early! ⚡
 */

export interface StreamChunk {
  type: 'header' | 'personality-thinking' | 'content' | 'personality-complete' | 'round-start' | 'round-end' | 'debate-complete' | 'consensus';
  personality?: string;
  content?: string;
  round?: number;
  emoji?: string;
  timestamp?: number;
}

export interface DebateConfig {
  request: string;
  personalities: string[];
  rounds?: number;
  mode?: 'standard' | 'debate' | 'conflict' | 'teaching' | 'review';
}

export class StreamingVentriloquist {
  /**
   * Stream a debate in real-time (async generator)
   * 
   * Usage:
   * ```typescript
   * for await (const chunk of StreamingVentriloquist.streamDebate(config)) {
   *   console.log(chunk);
   *   // Send to frontend via SSE or WebSocket
   * }
   * ```
   */
  static async *streamDebate(config: DebateConfig): AsyncGenerator<StreamChunk> {
    const { request, personalities, rounds = 3, mode = 'debate' } = config;
    
    // Header
    yield {
      type: 'header',
      content: `🔥 **${rounds}-ROUND PERSONALITY DEBATE** 🔥\n\nQuestion: "${request}"\n\nDebaters: ${personalities.join(', ')}\n`,
      timestamp: Date.now()
    };

    await this.delay(500);

    // Round-by-round streaming
    for (let round = 1; round <= rounds; round++) {
      yield {
        type: 'round-start',
        round,
        content: `\n${this.getRoundEmoji(round)} **ROUND ${round}:** ${this.getRoundTitle(round)}\n`,
        timestamp: Date.now()
      };

      await this.delay(300);

      // Each personality speaks
      for (const personality of personalities) {
        // Show "thinking" indicator
        yield {
          type: 'personality-thinking',
          personality,
          content: `\n💭 ${personality} is formulating ${round === 1 ? 'position' : round === 2 ? 'rebuttal' : 'final argument'}...\n`,
          timestamp: Date.now()
        };

        await this.delay(800);

        // Stream the personality's response word-by-word
        const response = this.generatePersonalityResponse(personality, request, round, personalities);
        
        yield {
          type: 'content',
          personality,
          content: `\n**${personality}:** "`,
          timestamp: Date.now()
        };

        // Word-by-word streaming for dramatic effect
        const words = response.split(' ');
        for (let i = 0; i < words.length; i++) {
          yield {
            type: 'content',
            personality,
            content: words[i] + (i < words.length - 1 ? ' ' : ''),
            timestamp: Date.now()
          };
          
          // Variable delay for natural feel
          await this.delay(this.getWordDelay(words[i]));
        }

        yield {
          type: 'content',
          personality,
          content: '"\n',
          timestamp: Date.now()
        };

        yield {
          type: 'personality-complete',
          personality,
          timestamp: Date.now()
        };

        await this.delay(400);
      }

      yield {
        type: 'round-end',
        round,
        timestamp: Date.now()
      };

      await this.delay(600);
    }

    // Consensus
    yield {
      type: 'consensus',
      content: '\n🏆 **CONSENSUS:**\n\n💭 Personalities are synthesizing consensus...\n',
      timestamp: Date.now()
    };

    await this.delay(1000);

    const consensus = this.generateConsensus(personalities, request);
    const consensusWords = consensus.split(' ');
    
    for (let i = 0; i < consensusWords.length; i++) {
      yield {
        type: 'consensus',
        content: consensusWords[i] + (i < consensusWords.length - 1 ? ' ' : ''),
        timestamp: Date.now()
      };
      await this.delay(this.getWordDelay(consensusWords[i]));
    }

    yield {
      type: 'consensus',
      content: '\n',
      timestamp: Date.now()
    };

    // Complete
    yield {
      type: 'debate-complete',
      content: '\n✅ Debate complete!\n',
      timestamp: Date.now()
    };
  }

  /**
   * Generate a personality's response for a specific round
   * (This is a placeholder - in production, this would call GPT-4 or similar)
   */
  private static generatePersonalityResponse(
    personality: string,
    request: string,
    round: number,
    allPersonalities: string[]
  ): string {
    // In production, this would generate actual AI responses
    // For now, return template responses to show the streaming concept
    
    const templates = {
      flash: {
        1: "Ship it NOW! Done is better than perfect - release today, iterate tomorrow.",
        2: "But waiting for quality means competitors ship first! Speed wins markets.",
        3: "Fine, let's ship fast WITH quality gates. CI/CD is the answer!"
      },
      pythonista: {
        1: "The data shows bugs cost 10x more to fix in production. Quality first!",
        2: "Metrics prove it - use pytest, coverage.py before deploying anything.",
        3: "I agree with CI/CD approach. 80% test coverage minimum, then ship fast."
      }
    };

    const defaultTemplate = {
      1: `My ${round === 1 ? 'initial' : round === 2 ? 'rebuttal' : 'final'} position on "${request.slice(0, 50)}..."`,
      2: "Let me challenge that assumption with specific evidence...",
      3: "After hearing everyone, here's my refined stance with concrete next steps."
    };

    return (templates[personality as keyof typeof templates]?.[round as keyof typeof templates.flash] || defaultTemplate[round as keyof typeof defaultTemplate]) as string;
  }

  /**
   * Generate consensus from all personalities
   */
  private static generateConsensus(personalities: string[], request: string): string {
    return `After ${personalities.length} perspectives and 3 rounds of debate, here's the practical path forward: Balance speed and quality with CI/CD gates. Define quality baseline (80% coverage, security audit), then maximize iteration speed. Context matters - MVPs favor speed, infrastructure favors quality. Timeline: Set standards Week 1, rapid iteration Week 2+.`;
  }

  /**
   * Get round emoji
   */
  private static getRoundEmoji(round: number): string {
    const emojis = ['🔴', '🟡', '🟢'];
    return emojis[round - 1] || '⚪';
  }

  /**
   * Get round title
   */
  private static getRoundTitle(round: number): string {
    const titles = [
      'Initial Positions',
      'Rebuttals & Counter-Arguments',
      'Final Positions'
    ];
    return titles[round - 1] || `Round ${round}`;
  }

  /**
   * Variable delay based on word characteristics
   */
  private static getWordDelay(word: string): number {
    // Longer delay for punctuation (dramatic pauses)
    if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) {
      return 150;
    }
    // Longer delay for long words
    if (word.length > 8) {
      return 80;
    }
    // Normal delay
    return 50;
  }

  /**
   * Helper: async delay
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Stream standard (non-debate) response
   */
  static async *streamStandardResponse(
    request: string,
    personalities: string[]
  ): AsyncGenerator<StreamChunk> {
    yield {
      type: 'header',
      content: `🎭 **Multi-Personality Response**\n\nQuestion: "${request}"\n\nExperts: ${personalities.join(', ')}\n\n`,
      timestamp: Date.now()
    };

    await this.delay(500);

    for (const personality of personalities) {
      yield {
        type: 'personality-thinking',
        personality,
        content: `\n💭 ${personality} is analyzing...\n`,
        timestamp: Date.now()
      };

      await this.delay(800);

      const response = `My expert take on this: ${request.slice(0, 100)}... (detailed response would go here)`;
      
      yield {
        type: 'content',
        personality,
        content: `\n**${personality}:** "`,
        timestamp: Date.now()
      };

      const words = response.split(' ');
      for (let i = 0; i < words.length; i++) {
        yield {
          type: 'content',
          personality,
          content: words[i] + (i < words.length - 1 ? ' ' : ''),
          timestamp: Date.now()
        };
        await this.delay(this.getWordDelay(words[i]));
      }

      yield {
        type: 'content',
        personality,
        content: '"\n',
        timestamp: Date.now()
      };

      yield {
        type: 'personality-complete',
        personality,
        timestamp: Date.now()
      };

      await this.delay(400);
    }

    yield {
      type: 'debate-complete',
      content: '\n✅ Response complete!\n',
      timestamp: Date.now()
    };
  }
}
