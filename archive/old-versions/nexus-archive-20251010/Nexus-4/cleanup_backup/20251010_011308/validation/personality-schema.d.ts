/**
 * Personality Validation Schema
 * Zod schema for validating personality JSON files
 */
import { z } from 'zod';
export declare const CognitiveTraitSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    activationTriggers: z.ZodOptional<z.ZodArray<z.ZodString>>;
    expertise: z.ZodOptional<z.ZodNumber>;
    knowledgeDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
    responsePatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
    examples: z.ZodOptional<z.ZodArray<z.ZodAny>>;
    applicability: z.ZodOptional<z.ZodArray<z.ZodString>>;
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
export declare const PersonalitySchema: z.ZodObject<{
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
export type ValidatedPersonality = z.infer<typeof PersonalitySchema>;
export declare function validatePersonality(data: unknown): ValidatedPersonality;
export declare function safeValidatePersonality(data: unknown): {
    success: boolean;
    data?: ValidatedPersonality;
    error?: z.ZodError;
};
//# sourceMappingURL=personality-schema.d.ts.map