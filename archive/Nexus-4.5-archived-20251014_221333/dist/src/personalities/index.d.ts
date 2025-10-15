/**
 * NEXUS Personalities - Type-Safe Definitions
 *
 * Core personalities upgraded to use Strategic Intelligence types
 */
import type { StrategicPersonality } from '../types/index.js';
/**
 * Architect - Strategic System Designer
 */
export declare const Architect: StrategicPersonality;
/**
 * Pragmatist - Practical Execution Specialist
 */
export declare const Pragmatist: StrategicPersonality;
/**
 * Visionary - Innovation & Future Planning
 */
export declare const Visionary: StrategicPersonality;
/**
 * Guardian - Quality & Safety Specialist
 */
export declare const Guardian: StrategicPersonality;
/**
 * WCAG Specialist - Accessibility Expert (NEW)
 */
export declare const WcagSpecialist: StrategicPersonality;
/**
 * Export all personalities
 */
export declare const NexusPersonalities: {
    Architect: StrategicPersonality;
    Pragmatist: StrategicPersonality;
    Visionary: StrategicPersonality;
    Guardian: StrategicPersonality;
    WcagSpecialist: StrategicPersonality;
};
/**
 * Get personality by name
 */
export declare function getPersonality(name: string): StrategicPersonality | undefined;
/**
 * Get all personality names
 */
export declare function getAllPersonalityNames(): string[];
//# sourceMappingURL=index.d.ts.map