/**
 * NEXUS Performance Profiler
 * Track and identify slow operations for optimization
 */
/**
 * Performance profiler for identifying bottlenecks
 */
export class PerformanceProfiler {
    profiles = new Map();
    slowThreshold;
    enabled = true;
    constructor(slowThreshold = 100) {
        this.slowThreshold = slowThreshold; // milliseconds
        console.log(`🔥 Performance profiler initialized (threshold: ${slowThreshold}ms)`);
    }
    /**
     * Profile an async function
     */
    profile(name, fn) {
        const profiler = this;
        return (async function (...args) {
            if (!profiler.enabled) {
                return await fn(...args);
            }
            const start = Date.now();
            try {
                const result = await fn(...args);
                const duration = Date.now() - start;
                profiler.recordCall(name, duration, args);
                if (duration > profiler.slowThreshold) {
                    console.warn(`⏱️  SLOW: ${name} took ${duration}ms`);
                }
                return result;
            }
            catch (error) {
                const duration = Date.now() - start;
                profiler.recordCall(name, duration, args);
                console.error(`❌ ERROR in ${name} after ${duration}ms:`, error);
                throw error;
            }
        });
    }
    /**
     * Profile a synchronous function
     */
    profileSync(name, fn) {
        const profiler = this;
        return (function (...args) {
            if (!profiler.enabled) {
                return fn(...args);
            }
            const start = Date.now();
            try {
                const result = fn(...args);
                const duration = Date.now() - start;
                profiler.recordCall(name, duration, args);
                if (duration > profiler.slowThreshold) {
                    console.warn(`⏱️  SLOW: ${name} took ${duration}ms`);
                }
                return result;
            }
            catch (error) {
                const duration = Date.now() - start;
                profiler.recordCall(name, duration, args);
                console.error(`❌ ERROR in ${name} after ${duration}ms:`, error);
                throw error;
            }
        });
    }
    /**
     * Decorator for profiling async methods
     */
    static ProfileAsync(target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const methodName = `${target.constructor.name}.${propertyKey}`;
        descriptor.value = async function (...args) {
            const start = Date.now();
            try {
                const result = await originalMethod.apply(this, args);
                const duration = Date.now() - start;
                if (duration > 100) {
                    console.warn(`⏱️  ${methodName}: ${duration}ms`);
                }
                return result;
            }
            catch (error) {
                console.error(`❌ ${methodName} failed`);
                throw error;
            }
        };
        return descriptor;
    }
    /**
     * Record a function call
     */
    recordCall(name, duration, args) {
        if (!this.profiles.has(name)) {
            this.profiles.set(name, []);
        }
        this.profiles.get(name).push({
            name,
            duration,
            timestamp: Date.now(),
            args: args?.length ? args : undefined,
        });
        // Keep only last 100 entries per function
        const entries = this.profiles.get(name);
        if (entries.length > 100) {
            entries.shift();
        }
    }
    /**
     * Get statistics for a specific function
     */
    getStats(name) {
        const entries = this.profiles.get(name);
        if (!entries || entries.length === 0) {
            return null;
        }
        const durations = entries.map(e => e.duration);
        const totalTime = durations.reduce((sum, d) => sum + d, 0);
        const slowCalls = durations.filter(d => d > this.slowThreshold).length;
        return {
            totalCalls: entries.length,
            totalTime,
            avgTime: totalTime / entries.length,
            minTime: Math.min(...durations),
            maxTime: Math.max(...durations),
            slowCallsCount: slowCalls,
        };
    }
    /**
     * Get all statistics
     */
    getAllStats() {
        const stats = new Map();
        for (const [name] of this.profiles) {
            const stat = this.getStats(name);
            if (stat) {
                stats.set(name, stat);
            }
        }
        return stats;
    }
    /**
     * Get slowest operations
     */
    getSlowest(limit = 10) {
        const allStats = this.getAllStats();
        return Array.from(allStats.entries())
            .map(([name, stats]) => ({ name, stats }))
            .sort((a, b) => b.stats.avgTime - a.stats.avgTime)
            .slice(0, limit);
    }
    /**
     * Print performance report
     */
    printReport() {
        console.log('\n📊 ========== PERFORMANCE REPORT ==========');
        const slowest = this.getSlowest(10);
        if (slowest.length === 0) {
            console.log('   No profiling data collected yet');
            return;
        }
        console.log('\n🐌 Slowest Operations:');
        slowest.forEach(({ name, stats }, index) => {
            console.log(`   ${index + 1}. ${name}`);
            console.log(`      Avg: ${stats.avgTime.toFixed(2)}ms`);
            console.log(`      Max: ${stats.maxTime}ms`);
            console.log(`      Calls: ${stats.totalCalls}`);
            console.log(`      Slow: ${stats.slowCallsCount} (${((stats.slowCallsCount / stats.totalCalls) * 100).toFixed(1)}%)`);
        });
        console.log('\n==========================================\n');
    }
    /**
     * Clear all profiling data
     */
    clear() {
        this.profiles.clear();
        console.log('🗑️  Profiling data cleared');
    }
    /**
     * Enable/disable profiling
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        console.log(`🔥 Profiler ${enabled ? 'enabled' : 'disabled'}`);
    }
}
// Export singleton instance
export const profiler = new PerformanceProfiler(100); // 100ms threshold
// Export decorator
export const ProfileAsync = PerformanceProfiler.ProfileAsync;
console.log('✅ Performance profiler ready');
//# sourceMappingURL=performance-profiler.js.map