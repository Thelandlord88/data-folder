/**
 * Personality Validation Schema
 * Zod schema for validating personality JSON files
 */

import { z } from 'zod';

// Cognitive Trait Schema - More flexible to handle real data
export const CognitiveTraitSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  activationTriggers: z.array(z.string()).optional(),
  expertise: z.number().min(0).max(100).optional(),
  knowledgeDomains: z.array(z.string()).optional(),
  responsePatterns: z.array(z.string()).optional(),
  examples: z.array(z.any()).optional(),  // Allow examples array
  applicability: z.array(z.string()).optional(),
}).passthrough(); // Allow additional properties

// Identity Schema
export const PersonalityIdentitySchema = z.object({
  name: z.string().min(1),
  aliases: z.array(z.string()).optional(),
  tagline: z.string().optional(),
  priority: z.string().optional(),
});

// Ideology Schema
export const PersonalityIdeologySchema = z.object({
  principles: z.array(z.string()),
  ethos: z.array(z.string()).optional(),
});

// Principles Schema
export const PersonalityPrinciplesSchema = z.object({
  riskPolicy: z.object({
    allowedOperations: z.array(z.string()).optional(),
    forbiddenOperations: z.array(z.string()).optional(),
  }).optional(),
  requiredSections: z.array(z.string()).optional(),
}).optional();

// Main Personality Schema - Flexible for real personality files
export const PersonalitySchema = z.object({
  version: z.string(),
  identity: PersonalityIdentitySchema,
  ideology: PersonalityIdeologySchema,
  cognitiveTraits: z.record(z.string(), CognitiveTraitSchema),
  principles: PersonalityPrinciplesSchema,
}).passthrough(); // Allow additional properties like metadata, etc.

// Type inference from schema
export type ValidatedPersonality = z.infer<typeof PersonalitySchema>;

// Validation helper
export function validatePersonality(data: unknown): ValidatedPersonality {
  return PersonalitySchema.parse(data);
}

// Safe validation that returns result
export function safeValidatePersonality(data: unknown): {
  success: boolean;
  data?: ValidatedPersonality;
  error?: z.ZodError;
} {
  const result = PersonalitySchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
