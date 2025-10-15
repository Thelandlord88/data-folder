/**
 * HunterBridge - Intelligent Shell Script Integration Layer
 * 
 * This bridge enables NEXUS to execute hunter shell scripts while:
 * - Learning from execution outcomes
 * - Tracking script effectiveness
 * - Discovering synergies between scripts
 * - Providing safe, sandboxed execution
 * 
 * @version 1.0.0
 * @date October 13, 2025
 */

import { spawn, type SpawnOptionsWithoutStdio } from 'child_process';
import { resolve, join } from 'path';
import { readFile, access, constants } from 'fs/promises';
import { getPatternEvolutionEngine } from './PatternEvolutionEngine.js';

// ============================================================================
// TYPES
// ============================================================================

export interface ScriptResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
  success: boolean;
}

export interface ScriptMetrics {
  executions: number;
  successCount: number;
  failureCount: number;
  avgExecutionTime: number;
  lastExecuted: string;
  valueScore: number; // 0-1 based on findings/impact
}

export interface HunterConfig {
  scriptsDir: string;
  timeout: number;
  maxConcurrent: number;
  enableLearning: boolean;
}

// ============================================================================
// HUNTER BRIDGE CLASS
// ============================================================================

export class HunterBridge {
  private scriptsDir: string;
  private timeout: number;
  private maxConcurrent: number;
  private enableLearning: boolean;
  
  // Script whitelist for security
  private whitelist: Set<string> = new Set([
    'security.sh',
    'performance.sh',
    'pattern_analysis.sh',
    'invariant_gate.sh',
    'geo_consistency.sh',
    '_common.sh'
  ]);
  
  // Metrics tracking
  private metrics: Map<string, ScriptMetrics> = new Map();
  
  // Execution queue
  private activeExecutions: number = 0;

  constructor(config: Partial<HunterConfig> = {}) {
    this.scriptsDir = config.scriptsDir || resolve(__dirname, '../hunters');
    this.timeout = config.timeout || 30000; // 30 seconds default
    this.maxConcurrent = config.maxConcurrent || 5;
    this.enableLearning = config.enableLearning ?? true;
    
    console.log('🎯 HunterBridge initialized');
    console.log(`   Scripts directory: ${this.scriptsDir}`);
    console.log(`   Timeout: ${this.timeout}ms`);
    console.log(`   Learning: ${this.enableLearning ? 'enabled' : 'disabled'}`);
  }

  // ============================================================================
  // SCRIPT EXECUTION
  // ============================================================================

  /**
   * Execute a hunter script with learning integration
   */
  async executeScript(
    scriptName: string,
    args: string[] = [],
    context?: string
  ): Promise<ScriptResult> {
    // Validate script is whitelisted
    if (!this.whitelist.has(scriptName)) {
      throw new Error(`Script not whitelisted: ${scriptName}`);
    }

    // Wait if too many concurrent executions
    while (this.activeExecutions >= this.maxConcurrent) {
      await this.sleep(100);
    }

    this.activeExecutions++;
    const startTime = Date.now();

    try {
      // Verify script exists
      const scriptPath = join(this.scriptsDir, scriptName);
      await access(scriptPath, constants.R_OK | constants.X_OK);

      // Execute with timeout
      const result = await this.executeWithTimeout(scriptPath, args);
      const executionTime = Date.now() - startTime;

      // Update metrics
      this.updateMetrics(scriptName, result.success, executionTime);

      // Learn from execution if enabled
      if (this.enableLearning) {
        await this.learnFromExecution(scriptName, result, executionTime, context);
      }

      return {
        ...result,
        executionTime
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      const result: ScriptResult = {
        stdout: '',
        stderr: error instanceof Error ? error.message : String(error),
        exitCode: 1,
        executionTime,
        success: false
      };

      // Update metrics for failure
      this.updateMetrics(scriptName, false, executionTime);

      // Learn from failure
      if (this.enableLearning) {
        await this.learnFromExecution(scriptName, result, executionTime, context);
      }

      throw error;

    } finally {
      this.activeExecutions--;
    }
  }

  /**
   * Execute script with timeout enforcement
   */
  private executeWithTimeout(
    scriptPath: string,
    args: string[]
  ): Promise<Omit<ScriptResult, 'executionTime'>> {
    return new Promise((resolve, reject) => {
      let timedOut = false;
      let stdout = '';
      let stderr = '';

      const child = spawn('bash', [scriptPath, ...args], {
        cwd: this.scriptsDir,
        env: this.getSanitizedEnv(),
        timeout: this.timeout
      });

      // Timeout handler
      const timeoutHandle = setTimeout(() => {
        timedOut = true;
        child.kill('SIGTERM');
        reject(new Error(`Script execution timeout after ${this.timeout}ms`));
      }, this.timeout);

      // Capture stdout
      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      // Capture stderr
      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      // Handle completion
      child.on('close', (code) => {
        clearTimeout(timeoutHandle);
        
        if (!timedOut) {
          resolve({
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            exitCode: code ?? 1,
            success: code === 0
          });
        }
      });

      // Handle errors
      child.on('error', (error) => {
        clearTimeout(timeoutHandle);
        if (!timedOut) {
          reject(error);
        }
      });
    });
  }

  // ============================================================================
  // LEARNING INTEGRATION
  // ============================================================================

  /**
   * Learn from script execution outcomes
   */
  private async learnFromExecution(
    scriptName: string,
    result: ScriptResult,
    executionTime: number,
    context?: string
  ): Promise<void> {
    try {
      const evolutionEngine = getPatternEvolutionEngine();
      
      // Calculate efficiency gain
      const efficiencyGain = this.calculateEfficiencyGain(
        scriptName,
        result,
        executionTime
      );

      // Record outcome with pattern evolution
      await evolutionEngine.recordEnhancedOutcome(
        ['hunter-script-execution', `hunter-${scriptName}`],
        result.success,
        {
          task_completion: result.success ? 1.0 : 0.0,
          accuracy: this.calculateAccuracy(result),
          efficiency_gain: efficiencyGain
        },
        context || `Executed ${scriptName}`
      );

      // If high value, detect breakthrough
      if (result.success && efficiencyGain > 1.5) {
        console.log(`🎯 High-value execution: ${scriptName} (${efficiencyGain.toFixed(2)}x efficiency)`);
      }

    } catch (error) {
      // Don't let learning errors break execution
      console.warn(`⚠️ Learning error for ${scriptName}:`, (error as Error).message);
    }
  }

  /**
   * Calculate efficiency gain from script execution
   */
  private calculateEfficiencyGain(
    scriptName: string,
    result: ScriptResult,
    executionTime: number
  ): number {
    const metrics = this.metrics.get(scriptName);
    
    if (!metrics || metrics.executions <= 1) {
      return 1.0; // Baseline for first execution
    }

    // Faster than average = higher efficiency
    const avgTime = metrics.avgExecutionTime;
    const speedGain = avgTime / executionTime;

    // Success adds value
    const successMultiplier = result.success ? 1.2 : 0.8;

    return speedGain * successMultiplier;
  }

  /**
   * Calculate accuracy from script result
   */
  private calculateAccuracy(result: ScriptResult): number {
    if (!result.success) return 0.0;
    
    // Check for warnings in stderr
    const hasWarnings = result.stderr.length > 0;
    
    // Perfect execution = 1.0, warnings = 0.8
    return hasWarnings ? 0.8 : 1.0;
  }

  // ============================================================================
  // METRICS TRACKING
  // ============================================================================

  /**
   * Update metrics for a script execution
   */
  private updateMetrics(
    scriptName: string,
    success: boolean,
    executionTime: number
  ): void {
    const existing = this.metrics.get(scriptName);

    if (!existing) {
      this.metrics.set(scriptName, {
        executions: 1,
        successCount: success ? 1 : 0,
        failureCount: success ? 0 : 1,
        avgExecutionTime: executionTime,
        lastExecuted: new Date().toISOString(),
        valueScore: success ? 0.5 : 0.1 // Initial score
      });
    } else {
      const newExecutions = existing.executions + 1;
      const newSuccessCount = existing.successCount + (success ? 1 : 0);
      const newFailureCount = existing.failureCount + (success ? 0 : 1);
      
      // Update average execution time (moving average)
      const newAvgTime = 
        (existing.avgExecutionTime * existing.executions + executionTime) / newExecutions;

      // Update value score based on success rate and execution time
      const successRate = newSuccessCount / newExecutions;
      const timeScore = Math.max(0, 1 - (newAvgTime / 10000)); // Penalize slow scripts
      const valueScore = (successRate * 0.7) + (timeScore * 0.3);

      this.metrics.set(scriptName, {
        executions: newExecutions,
        successCount: newSuccessCount,
        failureCount: newFailureCount,
        avgExecutionTime: newAvgTime,
        lastExecuted: new Date().toISOString(),
        valueScore
      });

      // Suggest retirement for low-value scripts
      if (newExecutions >= 10 && valueScore < 0.3) {
        console.log(`💡 Consider retiring ${scriptName} (low value score: ${valueScore.toFixed(2)})`);
      }
    }
  }

  /**
   * Get metrics for a specific script
   */
  getMetrics(scriptName: string): ScriptMetrics | undefined {
    return this.metrics.get(scriptName);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Map<string, ScriptMetrics> {
    return new Map(this.metrics);
  }

  // ============================================================================
  // WHITELIST MANAGEMENT
  // ============================================================================

  /**
   * Add script to whitelist
   */
  addToWhitelist(scriptName: string): void {
    this.whitelist.add(scriptName);
    console.log(`✅ Added ${scriptName} to whitelist`);
  }

  /**
   * Remove script from whitelist
   */
  removeFromWhitelist(scriptName: string): void {
    this.whitelist.delete(scriptName);
    console.log(`❌ Removed ${scriptName} from whitelist`);
  }

  /**
   * Get current whitelist
   */
  getWhitelist(): string[] {
    return Array.from(this.whitelist);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get sanitized environment variables for script execution
   */
  private getSanitizedEnv(): NodeJS.ProcessEnv {
    return {
      PATH: process.env.PATH,
      HOME: process.env.HOME,
      USER: process.env.USER,
      // Add other safe environment variables as needed
    };
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get status report
   */
  getStatus(): {
    scriptsDir: string;
    whitelistedScripts: number;
    activeExecutions: number;
    totalExecutions: number;
    learningEnabled: boolean;
  } {
    const totalExecutions = Array.from(this.metrics.values())
      .reduce((sum, m) => sum + m.executions, 0);

    return {
      scriptsDir: this.scriptsDir,
      whitelistedScripts: this.whitelist.size,
      activeExecutions: this.activeExecutions,
      totalExecutions,
      learningEnabled: this.enableLearning
    };
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let hunterBridgeInstance: HunterBridge | null = null;

export function getHunterBridge(config?: Partial<HunterConfig>): HunterBridge {
  if (!hunterBridgeInstance) {
    hunterBridgeInstance = new HunterBridge(config);
  }
  return hunterBridgeInstance;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default HunterBridge;
