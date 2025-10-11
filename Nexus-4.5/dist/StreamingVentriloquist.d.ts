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
export declare class StreamingVentriloquist {
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
    static streamDebate(config: DebateConfig): AsyncGenerator<StreamChunk>;
    /**
     * Generate a personality's response for a specific round
     * (This is a placeholder - in production, this would call GPT-4 or similar)
     */
    private static generatePersonalityResponse;
    /**
     * Generate consensus from all personalities
     */
    private static generateConsensus;
    /**
     * Get round emoji
     */
    private static getRoundEmoji;
    /**
     * Get round title
     */
    private static getRoundTitle;
    /**
     * Variable delay based on word characteristics
     */
    private static getWordDelay;
    /**
     * Helper: async delay
     */
    private static delay;
    /**
     * Stream standard (non-debate) response
     */
    static streamStandardResponse(request: string, personalities: string[]): AsyncGenerator<StreamChunk>;
}
//# sourceMappingURL=StreamingVentriloquist.d.ts.map