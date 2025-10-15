#!/usr/bin/env node
/**
 * NEXUS Conversation Hearing - Emotional and Cognitive Pattern Detection
 *
 * This sensor detects emotional undertones, cognitive patterns, and collaboration
 * dynamics in real-time conversations. It processes natural language to identify
 * significant moments, breakthrough potential, and cognitive state changes.
 *
 * Part of the NEXUS sensory system - "It's perception, not just monitoring."
 *
 * Author: NEXUS Collaborative Intelligence System
 */
export class ConversationHearing {
    constructor(nervousSystem: any);
    nervous: any;
    emotionalBaseline: number;
    cognitivePatterns: Map<any, any>;
    conversationHistory: any[];
    /**
     * Process conversation events for emotional and cognitive patterns
     * @param {Object} conversationEvent - Event from nervous system
     */
    process(conversationEvent: Object): {
        emotional_signals: Object;
        cognitive_patterns: Object;
        collaboration_dynamics: Object;
        breakthrough_indicators: Object;
        meta_awareness: Object;
        intensity_mapping: number;
    };
    /**
     * Detect emotional undertones and intensity
     * @param {string} text - Text to analyze
     * @returns {Object} Emotional analysis
     */
    detectEmotion(text: string): Object;
    /**
     * Detect cognitive patterns and thinking styles
     * @param {string} text - Text to analyze
     * @returns {Object} Cognitive pattern analysis
     */
    detectCognitivePatterns(text: string): Object;
    /**
     * Analyze collaboration dynamics
     * @param {string} text - Text to analyze
     * @returns {Object} Collaboration analysis
     */
    analyzeCollaborationDynamics(text: string): Object;
    /**
     * Detect breakthrough indicators
     * @param {string} text - Text to analyze
     * @returns {Object} Breakthrough analysis
     */
    detectBreakthroughIndicators(text: string): Object;
    /**
     * Detect meta-awareness about the conversation or collaboration
     * @param {string} text - Text to analyze
     * @returns {Object} Meta-awareness analysis
     */
    detectMetaAwareness(text: string): Object;
    /**
     * Emit significant patterns to the nervous system
     * @private
     */
    private emitSignificantPatterns;
    calculateEmotionalSignificance(emotionType: any, intensity: any): number;
    classifyEmotionalState(intensity: any): "breakthrough" | "normal" | "high_energy" | "engaged" | "low_energy";
    assessEmotionalBreakthroughPotential(emotions: any): number;
    determineDominantCognitiveStyle(patterns: any): string;
    assessCognitiveComplexity(text: any, patterns: any): number;
    mapIntensityLevels(text: any): number;
    calculateCollaborationLevel(dynamics: any): number;
    classifyInteractionType(dynamics: any): "collaborative_invitation" | "idea_building" | "exploratory_questioning" | "agreement_validation" | "general_interaction";
    classifyBreakthroughType(indicators: any): "none" | "paradigm_shift" | "major_breakthrough" | "cognitive_surprise" | "general_breakthrough";
    analyzeCognitiveComplexity(text: any, patterns: any): number;
}
export default ConversationHearing;
//# sourceMappingURL=conversation-hearing.d.mts.map