/**
 * Stable Key Generation
 * Creates deterministic cache keys for LRU cache efficiency
 * 
 * @module stableKey
 * @version 1.0.0
 */

import { createHash } from 'node:crypto';

/**
 * Generate stable SHA1 hash from any object
 * Uses canonicalized JSON for determinism
 * 
 * @param obj Any serializable object
 * @returns Hex-encoded SHA1 hash
 */
export function stableKey(obj: unknown): string {
  const canonical = JSON.stringify(obj, canonicalize);
  return createHash('sha1').update(canonical, 'utf8').digest('hex');
}

/**
 * Canonicalize JSON replacer function
 * Sorts object keys alphabetically for stable output
 * 
 * @param _ Key (unused)
 * @param value Value to canonicalize
 * @returns Canonicalized value
 */
function canonicalize(_: string, value: any): any {
  // Pass through primitives and arrays
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return value;
  }
  
  // Sort object keys alphabetically
  const sorted: Record<string, unknown> = {};
  const keys = Object.keys(value).sort();
  
  for (const key of keys) {
    sorted[key] = value[key];
  }
  
  return sorted;
}

/**
 * Generate cache key from design DNA and options
 * Includes engine version for cache busting
 * 
 * @param dna Design DNA
 * @param opts Compile options
 * @returns Stable cache key
 */
export function designCacheKey(
  dna: unknown,
  opts: { engineVersion?: string; [key: string]: unknown }
): string {
  return stableKey({
    dna,
    opts,
    v: opts.engineVersion ?? '1.0.0',
  });
}

/**
 * Fast hash for non-cryptographic purposes
 * Uses FNV-1a algorithm for speed
 * 
 * @param str String to hash
 * @returns 32-bit hash as hex string
 */
export function fastHash(str: string): string {
  let hash = 2166136261; // FNV offset basis
  
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  
  return (hash >>> 0).toString(16).padStart(8, '0');
}
