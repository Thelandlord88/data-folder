export function validatePersonality(data: any): {
    [x: string]: unknown;
    name: string;
    tagline: string;
    version: string;
    description: string;
    cognitiveTraits: {
        [x: string]: unknown;
        name: string;
        expertise: number;
        description: string;
        activationTriggers: string[];
        knowledgeDomains: string[];
    }[];
    personality: {
        [x: string]: unknown;
        tone: string;
        communicationStyle: string;
        approach: string;
    };
    expertiseAreas: string[];
    collaborationStyle?: {
        [x: string]: unknown;
        worksWellWith: string[];
        providesTo: string;
        receivesFrom: string;
    } | undefined;
} | {
    [x: string]: unknown;
    version: string;
    identity: {
        name: string;
        aliases?: string[] | undefined;
        tagline?: string | undefined;
        priority?: string | undefined;
    };
    ideology: {
        principles: string[];
        ethos?: string[] | undefined;
    };
    cognitiveTraits: Record<string, {
        [x: string]: unknown;
        name: string;
        description: string;
        activationTriggers?: string[] | undefined;
        expertise?: number | undefined;
        knowledgeDomains?: string[] | undefined;
        responsePatterns?: string[] | undefined;
        examples?: any[] | undefined;
        applicability?: string[] | undefined;
    }>;
    principles?: {
        riskPolicy?: {
            allowedOperations?: string[] | undefined;
            forbiddenOperations?: string[] | undefined;
        } | undefined;
        requiredSections?: string[] | undefined;
    } | undefined;
};
export function safeValidatePersonality(data: any): {
    success: boolean;
    data: {
        [x: string]: unknown;
        name: string;
        tagline: string;
        version: string;
        description: string;
        cognitiveTraits: {
            [x: string]: unknown;
            name: string;
            expertise: number;
            description: string;
            activationTriggers: string[];
            knowledgeDomains: string[];
        }[];
        personality: {
            [x: string]: unknown;
            tone: string;
            communicationStyle: string;
            approach: string;
        };
        expertiseAreas: string[];
        collaborationStyle?: {
            [x: string]: unknown;
            worksWellWith: string[];
            providesTo: string;
            receivesFrom: string;
        } | undefined;
    };
    format: string;
    error?: undefined;
} | {
    success: boolean;
    data: {
        [x: string]: unknown;
        version: string;
        identity: {
            name: string;
            aliases?: string[] | undefined;
            tagline?: string | undefined;
            priority?: string | undefined;
        };
        ideology: {
            principles: string[];
            ethos?: string[] | undefined;
        };
        cognitiveTraits: Record<string, {
            [x: string]: unknown;
            name: string;
            description: string;
            activationTriggers?: string[] | undefined;
            expertise?: number | undefined;
            knowledgeDomains?: string[] | undefined;
            responsePatterns?: string[] | undefined;
            examples?: any[] | undefined;
            applicability?: string[] | undefined;
        }>;
        principles?: {
            riskPolicy?: {
                allowedOperations?: string[] | undefined;
                forbiddenOperations?: string[] | undefined;
            } | undefined;
            requiredSections?: string[] | undefined;
        } | undefined;
    };
    format: string;
    error?: undefined;
} | {
    success: boolean;
    error: z.ZodError<{
        [x: string]: unknown;
        name: string;
        tagline: string;
        version: string;
        description: string;
        cognitiveTraits: {
            [x: string]: unknown;
            name: string;
            expertise: number;
            description: string;
            activationTriggers: string[];
            knowledgeDomains: string[];
        }[];
        personality: {
            [x: string]: unknown;
            tone: string;
            communicationStyle: string;
            approach: string;
        };
        expertiseAreas: string[];
        collaborationStyle?: {
            [x: string]: unknown;
            worksWellWith: string[];
            providesTo: string;
            receivesFrom: string;
        } | undefined;
    }>;
    data?: undefined;
    format?: undefined;
};
export const CognitiveTraitArraySchema: z.ZodObject<{
    name: z.ZodString;
    expertise: z.ZodNumber;
    description: z.ZodString;
    activationTriggers: z.ZodArray<z.ZodString>;
    knowledgeDomains: z.ZodArray<z.ZodString>;
}, z.core.$loose>;
export const CognitiveTraitObjectSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    activationTriggers: z.ZodOptional<z.ZodArray<z.ZodString>>;
    expertise: z.ZodOptional<z.ZodNumber>;
    knowledgeDomains: z.ZodOptional<z.ZodArray<z.ZodString>>;
    responsePatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
    examples: z.ZodOptional<z.ZodArray<z.ZodAny>>;
    applicability: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$loose>;
export const PersonalityConfigSchema: z.ZodObject<{
    tone: z.ZodString;
    communicationStyle: z.ZodString;
    approach: z.ZodString;
}, z.core.$loose>;
export const CollaborationStyleSchema: z.ZodObject<{
    worksWellWith: z.ZodArray<z.ZodString>;
    providesTo: z.ZodString;
    receivesFrom: z.ZodString;
}, z.core.$loose>;
export const PersonalityIdentitySchema: z.ZodObject<{
    name: z.ZodString;
    aliases: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tagline: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export const PersonalityIdeologySchema: z.ZodObject<{
    principles: z.ZodArray<z.ZodString>;
    ethos: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export const PersonalityPrinciplesSchema: z.ZodOptional<z.ZodObject<{
    riskPolicy: z.ZodOptional<z.ZodObject<{
        allowedOperations: z.ZodOptional<z.ZodArray<z.ZodString>>;
        forbiddenOperations: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    requiredSections: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>>;
export const PersonalitySchemaV2: z.ZodObject<{
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
export const PersonalitySchemaV1: z.ZodObject<{
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
export const PersonalitySchema: z.ZodUnion<readonly [z.ZodObject<{
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
import { z } from 'zod';
//# sourceMappingURL=personality-schema.d.ts.map