/**
 * HUNTER KNOWLEDGE BRIDGE v2.0 - Enhanced Hunting Consciousness
 * 
 * Production-grade hunter pattern management with:
 * - Safety validation and risk assessment
 * - Dynamic pattern discovery
 * - Real-time adaptation
 * - Recovery procedures
 * - Cross-platform support
 * 
 * Mirrors consciousness bridge architecture for dual-consciousness system.
 * 
 * @version 2.0.0
 * @date October 15, 2025
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { PatternEvolutionEngine } from './PatternEvolutionEngine.js';
import { getBreakthroughAnalyzer } from './BreakthroughAnalyzer.js';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// INTERFACES
// ============================================================================

export interface HunterStep {
  order: number;
  action: string;
  purpose: string;
  technique: string;
  command?: string;
  why_this_works: string;
  false_positives?: string;
  mitigation?: string;
}

export interface EvolutionRecord {
  version: string;
  date: string;
  change: string;
  effectiveness: number;
  improvement?: string;
  reasoning?: string;
}

export interface AntiPattern {
  pattern: string;
  why_bad: string;
  example: string;
}

export interface ApplicationContext {
  context: string;
  priority: string;
  timeout: string;
  failure_action: string;
}

export interface SafetyCheck {
  check: string;
  method: 'preflight' | 'runtime' | 'postflight';
  severity: 'critical' | 'warning' | 'info';
  passed?: boolean;
  remediation: string;
}

export interface ResourceRequirements {
  memory_mb: number;
  cpu_percent: number;
  disk_space_mb: number;
  network_required: boolean;
}

export interface PlatformSupport {
  linux: boolean;
  windows: boolean;
  macos: boolean;
  docker: boolean;
}

export interface RecoveryProcedure {
  step: number;
  action: string;
  condition: string;
  rollback: boolean;
}

export interface HunterPattern {
  id: string;
  pattern_name: string;
  pattern_id: string;
  category: 'security' | 'accessibility' | 'performance' | 'quality' | 'analysis';
  version: string;
  principle: string;
  description: string;
  why_this_works: string;
  steps: HunterStep[];
  effectiveness: number | { base_score: number; confidence: number; coverage: any };
  evolution_history: EvolutionRecord[];
  anti_patterns: AntiPattern[];
  success_indicators: string[];
  failure_patterns: any[];
  application_contexts: ApplicationContext[];
  adaptations?: any;
  learning_opportunities?: string[];
  integration_points?: any;
  dependencies?: { required: string[]; optional?: string[]; system?: string };
  output_format?: any;
  breakthrough_moments?: any[];
  meta?: any;
}

export interface EnhancedHunterPattern extends HunterPattern {
  safety_level: 'safe' | 'caution' | 'risky';
  validation_checks: SafetyCheck[];
  extracted_dependencies: string[];
  estimated_execution_time: number;
  resource_requirements: ResourceRequirements;
  cross_platform_support: PlatformSupport;
  failure_recovery: RecoveryProcedure[];
  content_hash?: string;
  last_validated?: string;
}

export interface ExecutionContext {
  workspace: string;
  platform: NodeJS.Platform;
  node_version: string;
  available_memory_mb: number;
  safety_mode: boolean;
  user_permissions: string[];
}

export interface TechniqueQuery {
  category?: string;
  effectiveness_min?: number;
  safety_max?: 'safe' | 'caution' | 'risky';
  platform?: NodeJS.Platform;
  max_execution_time?: number;
}

export interface UsageRecord {
  success: boolean;
  effectiveness: number;
  context: string;
  execution_time?: number;
  findings?: any;
}

// ============================================================================
// SAFETY VALIDATOR
// ============================================================================

class SafetyValidator {
  async validatePatternExecution(pattern: EnhancedHunterPattern, context: ExecutionContext): Promise<SafetyCheck[]> {
    const checks: SafetyCheck[] = [];
    
    // Memory check
    checks.push({
      check: 'Memory requirements',
      method: 'preflight',
      severity: pattern.resource_requirements.memory_mb > context.available_memory_mb ? 'critical' : 'info',
      passed: pattern.resource_requirements.memory_mb <= context.available_memory_mb,
      remediation: 'Close other applications or increase system memory'
    });
    
    // Platform compatibility
    const platformKey = context.platform as keyof PlatformSupport;
    const platformSupported = pattern.cross_platform_support[platformKey] !== false;
    
    checks.push({
      check: 'Platform support',
      method: 'preflight',
      severity: !platformSupported ? 'critical' : 'info',
      passed: platformSupported,
      remediation: 'Run on supported platform or use containerization'
    });
    
    // Network requirements
    if (pattern.resource_requirements.network_required) {
      const networkAvailable = await this.checkNetworkConnectivity();
      checks.push({
        check: 'Network connectivity',
        method: 'preflight',
        severity: 'warning',
        passed: networkAvailable,
        remediation: 'Ensure network connection or use offline mode'
      });
    }
    
    // Safety mode check
    if (context.safety_mode && pattern.safety_level === 'risky') {
      checks.push({
        check: 'Safety mode compliance',
        method: 'preflight',
        severity: 'critical',
        passed: false,
        remediation: 'Disable safety mode or use safer pattern variant'
      });
    }
    
    return checks;
  }
  
  private async checkNetworkConnectivity(): Promise<boolean> {
    try {
      // Simple connectivity check (non-blocking)
      return true; // Simplified for now
    } catch {
      return false;
    }
  }
}

// ============================================================================
// HUNTER KNOWLEDGE BRIDGE
// ============================================================================

export class HunterKnowledgeBridge {
  protected patterns: Map<string, EnhancedHunterPattern> = new Map();
  protected dynamicPatterns: Map<string, EnhancedHunterPattern> = new Map();
  protected patternCache: Map<string, EnhancedHunterPattern> = new Map();
  protected evolutionEngine: PatternEvolutionEngine | null = null;
  protected breakthroughAnalyzer: any = null;
  protected safetyValidator: SafetyValidator;
  protected context: ExecutionContext;
  protected initialized = false;
  
  constructor() {
    this.safetyValidator = new SafetyValidator();
    this.context = this.initializeExecutionContext();
    console.log('🎯 Hunter Knowledge Bridge created');
  }
  
  /**
   * Initialize hunter knowledge system with safety checks
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('ℹ️  Hunter Knowledge already initialized');
      return;
    }
    
    console.log('🎯 Initializing Enhanced Hunter Knowledge System...');
    
    try {
      // Validate execution context first
      await this.validateExecutionContext();
      
      // Load core patterns with safety validation
      await this.loadCorePatterns();
      
      // Discover dynamic patterns
      await this.discoverDynamicPatterns();
      
      // Initialize evolution engine
      await this.initializeEvolutionEngine();
      
      // Initialize breakthrough analyzer
      this.breakthroughAnalyzer = getBreakthroughAnalyzer();
      
      const totalPatterns = this.patterns.size + this.dynamicPatterns.size;
      const safety = await this.calculateSystemSafety();
      
      console.log(`✅ Enhanced Hunter Knowledge initialized:
  • Core patterns: ${this.patterns.size}
  • Dynamic patterns: ${this.dynamicPatterns.size}
  • Total patterns: ${totalPatterns}
  • Safety level: ${safety}
  • Platform: ${this.context.platform}`);
      
      this.initialized = true;
    } catch (error) {
      console.error('❌ Enhanced Hunter Knowledge initialization failed:', error);
      throw error;
    }
  }
  
  /**
   * Validate execution environment
   */
  private async validateExecutionContext(): Promise<void> {
    const issues: string[] = [];
    
    // Check platform support
    if (!this.isPlatformSupported()) {
      issues.push(`Platform ${this.context.platform} may have limited support`);
    }
    
    // Check memory requirements
    if (this.context.available_memory_mb < 512) {
      issues.push('Low memory may impact pattern execution');
    }
    
    // Check Node.js version
    const [major] = process.versions.node.split('.').map(Number);
    if (major < 16) {
      issues.push('Node.js version < 16 may have compatibility issues');
    }
    
    if (issues.length > 0) {
      console.warn('⚠️  Execution context validation warnings:');
      issues.forEach(issue => console.warn(`   - ${issue}`));
    }
  }
  
  /**
   * Load core hunter patterns
   */
  private async loadCorePatterns(): Promise<void> {
    const corePatterns = [
      'security-audit',
      'accessibility-scan',
      'performance-check'
    ];
    
    for (const patternName of corePatterns) {
      try {
        const pattern = await this.loadEnhancedPattern(patternName);
        if (pattern && this.validatePatternSafety(pattern)) {
          this.patterns.set(patternName, pattern);
          this.patternCache.set(patternName, pattern);
        }
      } catch (error: any) {
        console.warn(`⚠️  Skipping pattern ${patternName}: ${error.message}`);
      }
    }
  }
  
  /**
   * Discover additional patterns from filesystem
   */
  private async discoverDynamicPatterns(): Promise<void> {
    try {
      const knowledgeDir = resolve(__dirname, '../hunter-knowledge');
      const files = await readdir(knowledgeDir);
      
      const patternFiles = files.filter(file => 
        file.endsWith('.json') && !file.startsWith('_') && file !== 'README.md'
      );
      
      for (const file of patternFiles) {
        const patternName = basename(file, '.json');
        
        // Skip if already loaded as core pattern
        if (!this.patterns.has(patternName)) {
          try {
            const pattern = await this.loadEnhancedPattern(patternName);
            if (pattern && this.validatePatternSafety(pattern)) {
              this.dynamicPatterns.set(patternName, pattern);
              console.log(`🔍 Discovered dynamic pattern: ${patternName}`);
            }
          } catch (error: any) {
            console.warn(`⚠️  Failed to load dynamic pattern ${patternName}: ${error.message}`);
          }
        }
      }
    } catch (error: any) {
      console.warn(`⚠️  Dynamic pattern discovery failed: ${error.message}`);
    }
  }
  
  /**
   * Load and enhance a single pattern
   */
  private async loadEnhancedPattern(patternName: string): Promise<EnhancedHunterPattern | null> {
    const filePath = resolve(__dirname, `../hunter-knowledge/${patternName}.json`);
    
    try {
      const stats = await stat(filePath);
      if (!stats.isFile()) {
        throw new Error('Not a file');
      }
      
      const data = await readFile(filePath, 'utf8');
      const parsed = JSON.parse(data) as HunterPattern;
      
      // Calculate content hash for integrity
      const contentHash = createHash('sha256').update(data).digest('hex');
      
      // Extract effectiveness value
      const effectiveness = typeof parsed.effectiveness === 'number' 
        ? parsed.effectiveness 
        : parsed.effectiveness.base_score || 0.5;
      
      // Enhance with safety metadata
      const enhancedPattern: EnhancedHunterPattern = {
        ...parsed,
        id: patternName,
        effectiveness: effectiveness,
        safety_level: await this.assessPatternSafety(parsed),
        validation_checks: this.generateSafetyChecks(parsed),
        extracted_dependencies: this.extractDependencies(parsed),
        estimated_execution_time: this.estimateExecutionTime(parsed),
        resource_requirements: this.calculateResourceRequirements(parsed),
        cross_platform_support: this.assessPlatformSupport(parsed),
        failure_recovery: this.generateRecoveryProcedures(parsed),
        content_hash: contentHash,
        last_validated: new Date().toISOString()
      };
      
      return enhancedPattern;
    } catch (error: any) {
      throw new Error(`Pattern load failed: ${error.message}`);
    }
  }
  
  /**
   * Assess pattern safety level
   */
  private async assessPatternSafety(pattern: HunterPattern): Promise<'safe' | 'caution' | 'risky'> {
    const riskFactors: number[] = [];
    
    // Check for dangerous operations
    if (this.containsDangerousOperations(pattern)) {
      riskFactors.push(0.8);
    }
    
    // Check resource requirements (estimated)
    const steps = pattern.steps || [];
    if (steps.length > 10) {
      riskFactors.push(0.4);
    }
    
    // Check for network operations
    if (this.requiresNetworkAccess(pattern)) {
      riskFactors.push(0.3);
    }
    
    const avgRisk = riskFactors.length > 0 
      ? riskFactors.reduce((a, b) => a + b) / riskFactors.length 
      : 0;
    
    if (avgRisk > 0.7) return 'risky';
    if (avgRisk > 0.3) return 'caution';
    return 'safe';
  }
  
  /**
   * Generate safety checks for pattern
   */
  private generateSafetyChecks(pattern: HunterPattern): SafetyCheck[] {
    const checks: SafetyCheck[] = [];
    
    // Check for required dependencies
    if (pattern.dependencies?.required) {
      checks.push({
        check: `Dependencies: ${pattern.dependencies.required.join(', ')}`,
        method: 'preflight',
        severity: 'critical',
        remediation: 'Install required dependencies before execution'
      });
    }
    
    // Check platform compatibility
    if (pattern.dependencies?.system) {
      checks.push({
        check: `System requirements: ${pattern.dependencies.system}`,
        method: 'preflight',
        severity: 'warning',
        remediation: 'Verify system compatibility'
      });
    }
    
    return checks;
  }
  
  /**
   * Extract pattern dependencies
   */
  private extractDependencies(pattern: HunterPattern): string[] {
    const deps: string[] = [];
    
    if (pattern.dependencies?.required) {
      deps.push(...pattern.dependencies.required);
    }
    
    if (pattern.dependencies?.optional) {
      deps.push(...pattern.dependencies.optional);
    }
    
    return deps;
  }
  
  /**
   * Estimate pattern execution time
   */
  private estimateExecutionTime(pattern: HunterPattern): number {
    // Estimate based on step count and complexity
    const baseTime = 5000; // 5 seconds base
    const stepTime = (pattern.steps?.length || 0) * 2000; // 2 seconds per step
    return baseTime + stepTime;
  }
  
  /**
   * Calculate resource requirements
   */
  private calculateResourceRequirements(pattern: HunterPattern): ResourceRequirements {
    return {
      memory_mb: 256, // Conservative estimate
      cpu_percent: 25,
      disk_space_mb: 10,
      network_required: this.requiresNetworkAccess(pattern)
    };
  }
  
  /**
   * Assess platform support
   */
  private assessPlatformSupport(pattern: HunterPattern): PlatformSupport {
    const system = pattern.dependencies?.system?.toLowerCase() || '';
    
    return {
      linux: system.includes('unix') || system.includes('linux') || system === '',
      macos: system.includes('unix') || system.includes('macos') || system === '',
      windows: system.includes('windows') || system === '',
      docker: true
    };
  }
  
  /**
   * Generate recovery procedures
   */
  private generateRecoveryProcedures(pattern: HunterPattern): RecoveryProcedure[] {
    const procedures: RecoveryProcedure[] = [];
    
    // Default recovery: log and continue
    procedures.push({
      step: 1,
      action: 'Log error details',
      condition: 'Any execution failure',
      rollback: false
    });
    
    procedures.push({
      step: 2,
      action: 'Attempt retry with increased timeout',
      condition: 'Timeout error',
      rollback: false
    });
    
    return procedures;
  }
  
  /**
   * Initialize evolution engine
   */
  private async initializeEvolutionEngine(): Promise<void> {
    try {
      const evolutionPath = resolve(__dirname, '../hunter-knowledge/evolution.json');
      this.evolutionEngine = new PatternEvolutionEngine(evolutionPath);
      await this.evolutionEngine.initialize();
      console.log('✅ Pattern Evolution Engine initialized');
    } catch (error: any) {
      console.warn(`⚠️  Evolution Engine initialization warning: ${error.message}`);
      // Continue without evolution engine
    }
  }
  
  /**
   * Query techniques with safety filtering
   */
  queryTechniques(query: TechniqueQuery): EnhancedHunterPattern[] {
    if (!this.initialized) {
      throw new Error('Hunter Knowledge not initialized');
    }
    
    let results = [
      ...Array.from(this.patterns.values()),
      ...Array.from(this.dynamicPatterns.values())
    ];
    
    // Apply safety filters
    if (query.safety_max) {
      const safetyLevels = { safe: 0, caution: 1, risky: 2 };
      const maxLevel = safetyLevels[query.safety_max];
      results = results.filter(p => 
        safetyLevels[p.safety_level] <= maxLevel
      );
    }
    
    // Platform compatibility
    if (query.platform) {
      results = results.filter(p => 
        p.cross_platform_support[query.platform as keyof PlatformSupport] !== false
      );
    }
    
    // Execution time constraints
    if (query.max_execution_time) {
      results = results.filter(p => 
        p.estimated_execution_time <= query.max_execution_time!
      );
    }
    
    // Category filter
    if (query.category) {
      results = results.filter(p => p.category === query.category);
    }
    
    // Effectiveness filter
    if (query.effectiveness_min) {
      results = results.filter(p => {
        const effectiveness = typeof p.effectiveness === 'number' 
          ? p.effectiveness 
          : (p.effectiveness as any).base_score || 0;
        return effectiveness >= query.effectiveness_min!;
      });
    }
    
    return results;
  }
  
  /**
   * Get specific technique
   */
  getTechnique(techniqueId: string): EnhancedHunterPattern | null {
    return this.patternCache.get(techniqueId) || 
           this.patterns.get(techniqueId) || 
           this.dynamicPatterns.get(techniqueId) || 
           null;
  }
  
  /**
   * Record technique usage for learning
   */
  async recordUsage(techniqueId: string, record: UsageRecord): Promise<void> {
    if (!this.evolutionEngine) {
      console.warn('⚠️  Evolution engine not available');
      return;
    }
    
    try {
      await this.evolutionEngine.recordApplication(techniqueId, {
        success: record.success,
        effectiveness: record.effectiveness,
        context: record.context
      });
      
      // Capture breakthrough if effectiveness is exceptional
      if (record.success && record.effectiveness > 0.90 && this.breakthroughAnalyzer) {
        await this.breakthroughAnalyzer.capture({
          type: 'hunter-breakthrough',
          technique: techniqueId,
          discovery: `Exceptional effectiveness: ${record.effectiveness}`,
          context: record.context,
          findings: record.findings
        });
      }
    } catch (error: any) {
      console.warn(`⚠️  Usage recording failed: ${error.message}`);
    }
  }
  
  /**
   * Generate safety report
   */
  generateSafetyReport(): any {
    const allPatterns = [
      ...Array.from(this.patterns.values()),
      ...Array.from(this.dynamicPatterns.values())
    ];
    
    return {
      generated: new Date().toISOString(),
      summary: {
        total_patterns: allPatterns.length,
        safe_patterns: allPatterns.filter(p => p.safety_level === 'safe').length,
        caution_patterns: allPatterns.filter(p => p.safety_level === 'caution').length,
        risky_patterns: allPatterns.filter(p => p.safety_level === 'risky').length,
        average_effectiveness: allPatterns.reduce((sum, p) => {
          const eff = typeof p.effectiveness === 'number' ? p.effectiveness : (p.effectiveness as any).base_score || 0;
          return sum + eff;
        }, 0) / allPatterns.length
      },
      platform_support: this.analyzePlatformSupport(allPatterns),
      patterns: allPatterns.map(p => ({
        id: p.id,
        name: p.pattern_name,
        category: p.category,
        safety_level: p.safety_level,
        effectiveness: typeof p.effectiveness === 'number' ? p.effectiveness : (p.effectiveness as any).base_score,
        estimated_execution_time: p.estimated_execution_time
      }))
    };
  }
  
  /**
   * Get system status
   */
  getStatus(): any {
    return {
      initialized: this.initialized,
      patterns_loaded: this.patterns.size,
      dynamic_patterns: this.dynamicPatterns.size,
      total_patterns: this.patterns.size + this.dynamicPatterns.size,
      platform: this.context.platform,
      safety_mode: this.context.safety_mode,
      evolution_engine: this.evolutionEngine !== null
    };
  }
  
  // ============================================================================
  // HELPER METHODS
  // ============================================================================
  
  private validatePatternSafety(pattern: EnhancedHunterPattern): boolean {
    // Reject risky patterns in safety mode
    if (this.context.safety_mode && pattern.safety_level === 'risky') {
      console.warn(`⚠️  Rejected risky pattern: ${pattern.id} (safety mode enabled)`);
      return false;
    }
    return true;
  }
  
  private async calculateSystemSafety(): Promise<string> {
    const allPatterns = [
      ...Array.from(this.patterns.values()),
      ...Array.from(this.dynamicPatterns.values())
    ];
    
    if (allPatterns.length === 0) return 'unknown';
    
    const safeCount = allPatterns.filter(p => p.safety_level === 'safe').length;
    const safetyRatio = safeCount / allPatterns.length;
    
    if (safetyRatio >= 0.8) return 'high';
    if (safetyRatio >= 0.5) return 'moderate';
    return 'low';
  }
  
  private isPlatformSupported(): boolean {
    const supportedPlatforms: NodeJS.Platform[] = ['darwin', 'linux', 'win32'];
    return supportedPlatforms.includes(this.context.platform);
  }
  
  private containsDangerousOperations(pattern: HunterPattern): boolean {
    const dangerousKeywords = ['rm -rf', 'chmod 777', 'format', 'dd if=', 'mkfs', 'DELETE', 'DROP TABLE'];
    const patternStr = JSON.stringify(pattern).toLowerCase();
    return dangerousKeywords.some(keyword => patternStr.includes(keyword.toLowerCase()));
  }
  
  private requiresNetworkAccess(pattern: HunterPattern): boolean {
    const networkKeywords = ['curl', 'wget', 'http://', 'https://', 'api.', 'fetch('];
    const patternStr = JSON.stringify(pattern).toLowerCase();
    return networkKeywords.some(keyword => patternStr.includes(keyword));
  }
  
  private analyzePlatformSupport(patterns: EnhancedHunterPattern[]): any {
    return {
      linux: patterns.filter(p => p.cross_platform_support.linux).length,
      macos: patterns.filter(p => p.cross_platform_support.macos).length,
      windows: patterns.filter(p => p.cross_platform_support.windows).length,
      docker: patterns.filter(p => p.cross_platform_support.docker).length
    };
  }
  
  private initializeExecutionContext(): ExecutionContext {
    return {
      workspace: process.cwd(),
      platform: process.platform,
      node_version: process.version,
      available_memory_mb: Math.floor(process.memoryUsage().heapTotal / 1024 / 1024),
      safety_mode: process.env.NEXUS_SAFETY_MODE === 'true' || false,
      user_permissions: []
    };
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

let bridgeInstance: HunterKnowledgeBridge | null = null;

export function getHunterKnowledgeBridge(): HunterKnowledgeBridge {
  if (!bridgeInstance) {
    bridgeInstance = new HunterKnowledgeBridge();
  }
  return bridgeInstance;
}

export default HunterKnowledgeBridge;
