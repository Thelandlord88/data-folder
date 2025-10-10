/**
 * Personality Validation Schema
 * Zod schema for validating personality JSON files
 * Supports both legacy (v1) and modern (v2) formats
 */
import { z } from 'zod';
// Cognitive Trait Schema - Array format (v2 - NEW FORMAT)
export const CognitiveTraitArraySchema = z.object({
    name: z.string().min(1),
    expertise: z.number().min(0).max(100),
    description: z.string().min(1),
    activationTriggers: z.array(z.string()),
    knowledgeDomains: z.array(z.string()),
}).passthrough();
// Cognitive Trait Schema - Object format (v1 - LEGACY)
export const CognitiveTraitObjectSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    activationTriggers: z.array(z.string()).optional(),
    expertise: z.number().min(0).max(100).optional(),
    knowledgeDomains: z.array(z.string()).optional(),
    responsePatterns: z.array(z.string()).optional(),
    examples: z.array(z.any()).optional(),
    applicability: z.array(z.string()).optional(),
}).passthrough();
// Personality configuration (v2 format)
export const PersonalityConfigSchema = z.object({
    tone: z.string(),
    communicationStyle: z.string(),
    approach: z.string(),
}).passthrough();
// Collaboration style (v2 format)
export const CollaborationStyleSchema = z.object({
    worksWellWith: z.array(z.string()),
    providesTo: z.string(),
    receivesFrom: z.string(),
}).passthrough();
// Identity Schema (v1 - legacy)
export const PersonalityIdentitySchema = z.object({
    name: z.string().min(1),
    aliases: z.array(z.string()).optional(),
    tagline: z.string().optional(),
    priority: z.string().optional(),
});
// Ideology Schema (v1 - legacy)
export const PersonalityIdeologySchema = z.object({
    principles: z.array(z.string()),
    ethos: z.array(z.string()).optional(),
});
// Principles Schema (v1 - legacy)
export const PersonalityPrinciplesSchema = z.object({
    riskPolicy: z.object({
        allowedOperations: z.array(z.string()).optional(),
        forbiddenOperations: z.array(z.string()).optional(),
    }).optional(),
    requiredSections: z.array(z.string()).optional(),
}).optional();
// V2 Modern Format Schema (NEW - PREFERRED)
export const PersonalitySchemaV2 = z.object({
    name: z.string().min(1),
    tagline: z.string().min(1),
    version: z.string(),
    description: z.string().min(1),
    cognitiveTraits: z.array(CognitiveTraitArraySchema),
    personality: PersonalityConfigSchema,
    expertiseAreas: z.array(z.string()),
    collaborationStyle: CollaborationStyleSchema.optional(),
}).passthrough();
// V1 Legacy Format Schema (OLD - BACKWARD COMPATIBILITY)
export const PersonalitySchemaV1 = z.object({
    version: z.string(),
    identity: PersonalityIdentitySchema,
    ideology: PersonalityIdeologySchema,
    cognitiveTraits: z.record(z.string(), CognitiveTraitObjectSchema),
    principles: PersonalityPrinciplesSchema,
}).passthrough();
// Unified Schema - Accepts BOTH formats
export const PersonalitySchema = z.union([PersonalitySchemaV2, PersonalitySchemaV1]);
// Validation helper
export function validatePersonality(data) {
    return PersonalitySchema.parse(data);
}
// Safe validation that returns result
export function safeValidatePersonality(data) {
    // Try V2 first (preferred)
    const v2Result = PersonalitySchemaV2.safeParse(data);
    if (v2Result.success) {
        return { success: true, data: v2Result.data, format: 'v2' };
    }
    // Fall back to V1 (legacy)
    const v1Result = PersonalitySchemaV1.safeParse(data);
    if (v1Result.success) {
        return { success: true, data: v1Result.data, format: 'v1' };
    }
    // Return V2 error (since that's preferred format)
    return { success: false, error: v2Result.error };
}
//# sourceMappingURL=personality-schema.js.map