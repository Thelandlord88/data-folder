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
export declare class PersonalityVentriloquist {
    /**
     * Predefined personality voices with character traits
     */
    private static personalityVoices;
    /**
     * Generate irresistible role-play instructions that compel AI agents
     * to naturally adopt personality voices
     */
    static generateIrresistibleInstructions(request: string, personalities: string[]): string;
    /**
     * Create a compelling character profile for a personality
     */
    private static createPersonalityProfile;
    /**
     * Build response template showing exact format expected
     */
    private static buildResponseTemplate;
    /**
     * Generate conflict-inducing instructions for more dynamic debates
     */
    static generateConflictInstructions(request: string, personalities: string[]): string;
    /**
     * Generate emergency meeting scenario for urgent decisions
     */
    static generateEmergencyMeeting(request: string, personalities: string[]): string;
    /**
     * Add a new personality voice definition
     */
    static registerPersonalityVoice(name: string, voice: PersonalityVoice): void;
    /**
     * Get all registered personality names
     */
    static getAvailablePersonalities(): string[];
}
//# sourceMappingURL=PersonalityVentriloquist.d.ts.map