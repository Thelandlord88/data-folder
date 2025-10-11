/**
 * NEXUS Performance Profiler
 * Track and identify slow operations for optimization
 */
interface ProfileStats {
    totalCalls: number;
    totalTime: number;
    avgTime: number;
    minTime: number;
    maxTime: number;
    slowCallsCount: number;
}
/**
 * Performance profiler for identifying bottlenecks
 */
export declare class PerformanceProfiler {
    private profiles;
    private slowThreshold;
    private enabled;
    constructor(slowThreshold?: number);
    /**
     * Profile an async function
     */
    profile<T extends (...args: any[]) => Promise<any>>(name: string, fn: T): T;
    /**
     * Profile a synchronous function
     */
    profileSync<T extends (...args: any[]) => any>(name: string, fn: T): T;
    /**
     * Decorator for profiling async methods
     */
    static ProfileAsync(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
    /**
     * Record a function call
     */
    private recordCall;
    /**
     * Get statistics for a specific function
     */
    getStats(name: string): ProfileStats | null;
    /**
     * Get all statistics
     */
    getAllStats(): Map<string, ProfileStats>;
    /**
     * Get slowest operations
     */
    getSlowest(limit?: number): Array<{
        name: string;
        stats: ProfileStats;
    }>;
    /**
     * Print performance report
     */
    printReport(): void;
    /**
     * Clear all profiling data
     */
    clear(): void;
    /**
     * Enable/disable profiling
     */
    setEnabled(enabled: boolean): void;
}
export declare const profiler: PerformanceProfiler;
export declare const ProfileAsync: typeof PerformanceProfiler.ProfileAsync;
export {};
//# sourceMappingURL=performance-profiler.d.ts.map