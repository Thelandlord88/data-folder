/**
 * Personality Validation Schema
 * Zod schema for validating personality JSON files
 * Supports both legacy (v1) and modern (v2) formats
 */
import { z } from 'zod';
export declare const CognitiveTraitArraySchema: z.ZodObject<{
    name: z.ZodString;
    expertise: z.ZodNumber;
    description: z.ZodString;
    activationTriggers: z.ZodArray<z.ZodString>;
    knowledgeDomains: z.ZodArray<z.ZodString>;
}, z.core.$loose>;
export declare const CognitiveTraitObjectSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    activationTriggers: z.ZodOptional<z.ZodArray<z.ZodString>>;
    expertise: z.ZodOptional<z.ZodNumber>;
    knowledgeDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
    responsePatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
    examples: z.ZodOptional<z.ZodArray<z.ZodAny>>;
    applicability: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$loose>;
export declare const PersonalityConfigSchema: z.ZodObject<{
    tone: z.ZodString;
    communicationStyle: z.ZodString;
    approach: z.ZodString;
}, z.core.$loose>;
export declare const CollaborationStyleSchema: z.ZodObject<{
    worksWellWith: z.ZodArray<z.ZodString>;
    providesTo: z.ZodString;
    receivesFrom: z.ZodString;
}, z.core.$loose>;
export declare const PersonalityIdentitySchema: z.ZodObject<{
    name: z.ZodString;
    aliases: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tagline: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const PersonalityIdeologySchema: z.ZodObject<{
    principles: z.ZodArray<z.ZodString>;
    ethos: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const PersonalityPrinciplesSchema: z.ZodOptional<z.ZodObject<{
    riskPolicy: z.ZodOptional<z.ZodObject<{
        allowedOperations: z.ZodOptional<z.ZodArray<z.ZodString>>;
        forbiddenOperations: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    requiredSections: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>>;
export declare const PersonalitySchemaV2: z.ZodObject<{
    name: z.ZodString;
    tagline: z.ZodString;
    version: z.ZodString;
    description: z.ZodString;
    cognitiveTraits: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        expertise: z.ZodNumber;
        description: z.ZodString;
        activationTriggers: z.ZodArray<z.ZodString>;
        knowledgeDomains: z.ZodArray<z.ZodString>;
    }, z.core.$loose>>;
    personality: z.ZodObject<{
        tone: z.ZodString;
        communicationStyle: z.ZodString;
        approach: z.ZodString;
    }, z.core.$loose>;
    expertiseAreas: z.ZodArray<z.ZodString>;
    collaborationStyle: z.ZodOptional<z.ZodObject<{
        worksWellWith: z.ZodArray<z.ZodString>;
        providesTo: z.ZodString;
        receivesFrom: z.ZodString;
    }, z.core.$loose>>;
}, z.core.$loose>;
export declare const PersonalitySchemaV1: z.ZodObject<{
    version: z.ZodString;
    identity: z.ZodObject<{
        name: z.ZodString;
        aliases: z.ZodOptional<z.ZodArray<z.ZodString>>;
        tagline: z.ZodOptional<z.ZodString>;
        priority: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    ideology: z.ZodObject<{
        principles: z.ZodArray<z.ZodString>;
        ethos: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
    cognitiveTraits: z.ZodRecord<z.ZodString, z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        activationTriggers: z.ZodOptional<z.ZodArray<z.ZodString>>;
        expertise: z.ZodOptional<z.ZodNumber>;
        knowledgeDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
        responsePatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
        examples: z.ZodOptional<z.ZodArray<z.ZodAny>>;
        applicability: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$loose>>;
    principles: z.ZodOptional<z.ZodObject<{
        riskPolicy: z.ZodOptional<z.ZodObject<{
            allowedOperations: z.ZodOptional<z.ZodArray<z.ZodString>>;
            forbiddenOperations: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
        requiredSections: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$loose>;
export declare const PersonalitySchema: z.ZodUnion<readonly [z.ZodObject<{
    name: z.ZodString;
    tagline: z.ZodString;
    version: z.ZodString;
    description: z.ZodString;
    cognitiveTraits: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        expertise: z.ZodNumber;
        description: z.ZodString;
        activationTriggers: z.ZodArray<z.ZodString>;
        knowledgeDomains: z.ZodArray<z.ZodString>;
    }, z.core.$loose>>;
    personality: z.ZodObject<{
        tone: z.ZodString;
        communicationStyle: z.ZodString;
        approach: z.ZodString;
    }, z.core.$loose>;
    expertiseAreas: z.ZodArray<z.ZodString>;
    collaborationStyle: z.ZodOptional<z.ZodObject<{
        worksWellWith: z.ZodArray<z.ZodString>;
        providesTo: z.ZodString;
        receivesFrom: z.ZodString;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    version: z.ZodString;
    identity: z.ZodObject<{
        name: z.ZodString;
        aliases: z.ZodOptional<z.ZodArray<z.ZodString>>;
        tagline: z.ZodOptional<z.ZodString>;
        priority: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    ideology: z.ZodObject<{
        principles: z.ZodArray<z.ZodString>;
        ethos: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
    cognitiveTraits: z.ZodRecord<z.ZodString, z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        activationTriggers: z.ZodOptional<z.ZodArray<z.ZodString>>;
        expertise: z.ZodOptional<z.ZodNumber>;
        knowledgeDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
        responsePatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
        examples: z.ZodOptional<z.ZodArray<z.ZodAny>>;
        applicability: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$loose>>;
    principles: z.ZodOptional<z.ZodObject<{
        riskPolicy: z.ZodOptional<z.ZodObject<{
            allowedOperations: z.ZodOptional<z.ZodArray<z.ZodString>>;
            forbiddenOperations: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
        requiredSections: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$loose>]>;
export type ValidatedPersonality = z.infer<typeof PersonalitySchemaV2>;
export type ValidatedPersonalityV1 = z.infer<typeof PersonalitySchemaV1>;
export type ValidatedPersonalityV2 = z.infer<typeof PersonalitySchemaV2>;
export declare function validatePersonality(data: unknown): ValidatedPersonality | ValidatedPersonalityV1;
export declare function safeValidatePersonality(data: unknown): {
    success: boolean;
    data?: ValidatedPersonality | ValidatedPersonalityV1;
    error?: z.ZodError;
    format?: 'v1' | 'v2';
};
//# sourceMappingURL=personality-schema.d.ts.map