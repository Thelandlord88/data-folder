/**
 * Stable Key Generation
 * Creates deterministic cache keys for LRU cache efficiency
 *
 * @module stableKey
 * @version 1.0.0
 */
/**
 * Generate stable SHA1 hash from any object
 * Uses canonicalized JSON for determinism
 *
 * @param obj Any serializable object
 * @returns Hex-encoded SHA1 hash
 */
export declare function stableKey(obj: unknown): string;
/**
 * Generate cache key from design DNA and options
 * Includes engine version for cache busting
 *
 * @param dna Design DNA
 * @param opts Compile options
 * @returns Stable cache key
 */
export declare function designCacheKey(dna: unknown, opts: {
    engineVersion?: string;
    [key: string]: unknown;
}): string;
/**
 * Fast hash for non-cryptographic purposes
 * Uses FNV-1a algorithm for speed
 *
 * @param str String to hash
 * @returns 32-bit hash as hex string
 */
export declare function fastHash(str: string): string;
//# sourceMappingURL=stableKey.d.ts.map