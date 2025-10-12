import { parse } from "jsonc-parser";
import { join } from "node:path";
import { walk, readText } from "./fs-utils.js";

export type IssueType =
  | "config_drift" | "dependency_mismatch" | "build_inconsistency"
  | "platform_issue" | "engine_mismatch" | "module_system" | "lint_format_drift"
  | "path_alias_drift" | "import_extension_inconsistency";

export interface SystemicIssue {
  type: IssueType;
  severity: "critical" | "high" | "medium" | "low";
  file: string;
  description: string;
  evidence: string[];
  recommendation: string;
  cognitiveInsights?: string[];
}

export interface GuardianConfig {
  ignore: string[];
  checks: Record<string, boolean>;
  failOn: Record<string, boolean>;
  output: {
    json: string;
    markdown: string;
    sarif: string;
    emitSarif: boolean;
  };
  performance?: {
    maxFilesPerExtension: number;
    throttleChecks: boolean;
  };
}

export class SystemicScanner {
  constructor(
    private projectRoot = process.cwd(),
    private cfg: GuardianConfig
  ) {}

  private issues: SystemicIssue[] = [];
  get results() { return this.issues; }

  async scan(): Promise<SystemicIssue[]> {
    this.issues = [];
    
    console.log('🛡️ Starting Systemic Guardian scan...');
    
    if (this.cfg.checks.tsconfigDrift) {
      console.log('  🔍 Scanning TypeScript configuration drift...');
      await this.scanTsconfigDrift();
    }
    
    if (this.cfg.checks.pathAliasDrift) {
      console.log('  🔍 Scanning path alias inconsistencies...');
      await this.scanPathAliasDrift();
    }
    
    if (this.cfg.checks.dependencyDrift) {
      console.log('  🔍 Scanning dependency drift...');
      await this.scanDependencyDrift();
    }
    
    if (this.cfg.checks.buildOutDirDrift) {
      console.log('  🔍 Scanning build output directory drift...');
      await this.scanBuildOutDirDrift();
    }
    
    if (this.cfg.checks.platformPaths) {
      console.log('  🔍 Scanning platform-specific path issues...');
      await this.scanPlatformPaths();
    }
    
    if (this.cfg.checks.engineVersions) {
      console.log('  🔍 Scanning engine version mismatches...');
      await this.scanEngineMismatch();
    }
    
    if (this.cfg.checks.moduleSystemMismatch) {
      console.log('  🔍 Scanning module system inconsistencies...');
      await this.scanModuleSystem();
    }
    
    if (this.cfg.checks.eslintPrettierDrift) {
      console.log('  🔍 Scanning linting/formatting configuration drift...');
      await this.scanLintFormatDrift();
    }
    
    if (this.cfg.checks.importExtensionConsistency) {
      console.log('  🔍 Scanning import extension consistency...');
      await this.scanImportExtensionConsistency();
    }
    
    console.log(`✅ Scan complete: ${this.issues.length} issues found`);
    return this.issues;
  }

  // —— Helpers ——
  private parseJsonc = (s: string) => { 
    try { 
      return parse(s ?? "{}"); 
    } catch { 
      return {}; 
    } 
  };

  private async findFiles(pattern: RegExp, maxFiles?: number): Promise<string[]> {
    const out: string[] = [];
    const limit = maxFiles || this.cfg.performance?.maxFilesPerExtension || 1500;
    
    for await (const f of walk(this.projectRoot, this.cfg.ignore)) {
      if (pattern.test(f)) {
        out.push(f);
        if (out.length >= limit) break;
      }
    }
    return out;
  }

  // —— Scanners ——
  private async scanTsconfigDrift() {
    const tsFiles = await this.findFiles(/tsconfig.*\.json$/);
    if (tsFiles.length < 2) return;

    const parsed = await Promise.all(tsFiles.map(async f => {
      const txt = await readText(f); 
      return { f, j: this.parseJsonc(txt ?? "{}") };
    }));

    const pick = (k: string) => parsed.map(p => ({ f: p.f, v: p.j?.compilerOptions?.[k] }));
    
    const compareSet = (
      arr: {f:string,v:any}[], 
      label: string, 
      rec: string, 
      sev: SystemicIssue["severity"]
    ) => {
      const uniq = Array.from(new Set(arr.map(a => JSON.stringify(a.v))));
      if (uniq.length > 1) {
        this.issues.push({
          type: "config_drift",
          severity: sev,
          file: "multiple tsconfig files",
          description: `Inconsistent ${label} across tsconfigs`,
          evidence: arr.map(a => `${a.f}: ${label}=${JSON.stringify(a.v)}`),
          recommendation: rec,
          cognitiveInsights: [
            `Configuration drift in ${label} can cause environment-specific build failures`,
            `Consider using a base tsconfig.json with extends to maintain consistency`
          ]
        });
      }
    };

    compareSet(pick("moduleResolution"), "moduleResolution", "Standardize to \"bundler\" for Vite/Astro.", "high");
    compareSet(pick("strict"), "strict", "Enable \"strict\": true across all tsconfigs.", "medium");
    compareSet(pick("target"), "target", "Align to a single target (e.g., \"ES2022\").", "medium");
    compareSet(pick("jsx"), "jsx", "Use a single JSX mode (e.g., \"react-jsx\").", "low");
  }

  private async scanPathAliasDrift() {
    const tsFiles = await this.findFiles(/tsconfig.*\.json$/);
    if (tsFiles.length < 2) return;

    const pathConfigs = await Promise.all(tsFiles.map(async f => {
      const txt = await readText(f);
      const config = this.parseJsonc(txt ?? "{}");
      const paths = config?.compilerOptions?.paths || {};
      return { file: f, paths };
    }));

    // Check for inconsistent path alias patterns
    const aliasPatterns = new Map<string, Set<string>>();
    
    for (const { file, paths } of pathConfigs) {
      for (const [alias, patterns] of Object.entries(paths)) {
        if (!aliasPatterns.has(alias)) {
          aliasPatterns.set(alias, new Set());
        }
        const patternStr = JSON.stringify(patterns);
        aliasPatterns.get(alias)!.add(`${file}: ${patternStr}`);
      }
    }

    for (const [alias, variations] of aliasPatterns) {
      if (variations.size > 1) {
        this.issues.push({
          type: "config_drift",
          severity: "high",
          file: "multiple tsconfig files",
          description: `Inconsistent path alias "${alias}" across configurations`,
          evidence: Array.from(variations),
          recommendation: `Standardize path alias "${alias}" to use consistent patterns across all tsconfigs`,
          cognitiveInsights: [
            `Path alias inconsistencies cause import resolution failures in different environments`,
            `Consider using relative paths from project root (e.g., "./src/*") for consistency`
          ]
        });
      }
    }

    // Check for missing path aliases in test configs
    const testConfigs = pathConfigs.filter(({ file }) => /playwright|test/i.test(file));
    const mainConfigs = pathConfigs.filter(({ file }) => !/playwright|test/i.test(file));
    
    if (testConfigs.length > 0 && mainConfigs.length > 0) {
      const mainAliases = new Set();
      mainConfigs.forEach(({ paths }) => {
        Object.keys(paths).forEach(alias => mainAliases.add(alias));
      });
      
      testConfigs.forEach(({ file, paths }) => {
        const testAliases = new Set(Object.keys(paths));
        const missingAliases = [...mainAliases].filter(alias => !testAliases.has(alias));
        
        if (missingAliases.length > 0) {
          this.issues.push({
            type: "config_drift",
            severity: "medium",
            file: file,
            description: "Test configuration missing path aliases from main configuration",
            evidence: [`Missing aliases: ${missingAliases.join(", ")}`],
            recommendation: "Add missing path aliases to test configuration to ensure import consistency",
            cognitiveInsights: [
              "Tests should use the same import patterns as application code",
              "Missing aliases in test configs lead to import resolution failures during testing"
            ]
          });
        }
      });
    }
  }

  private async scanDependencyDrift() {
    const pkgs = await this.findFiles(/package\.json$/);
    if (!pkgs.length) return;
    
    const loaded = await Promise.all(pkgs.map(async f => ({ 
      f, 
      j: this.parseJsonc(await readText(f) || "{}") 
    })));

    // Check for duplicate package names (identity conflicts)
    const nameGroups = new Map<string, string[]>();
    loaded.forEach(({ f, j }) => {
      const name = j.name;
      if (name) {
        if (!nameGroups.has(name)) nameGroups.set(name, []);
        nameGroups.get(name)!.push(f);
      }
    });

    nameGroups.forEach((files, name) => {
      if (files.length > 1) {
        this.issues.push({
          type: "dependency_mismatch",
          severity: "high",
          file: "workspace",
          description: `Multiple package.json files with same name: "${name}"`,
          evidence: files,
          recommendation: "Ensure each package.json has a unique name or remove duplicate packages",
          cognitiveInsights: [
            "Duplicate package names cause npm/node module resolution ambiguity",
            "This can lead to unexpected behavior where the wrong package is resolved"
          ]
        });
      }
    });

    // Check for dependency version drift
    const byName = new Map<string, Set<string>>();
    for (const { f, j } of loaded) {
      for (const [name] of Object.entries(j.dependencies || {})) {
        if (!byName.has(name)) byName.set(name, new Set());
        byName.get(name)!.add(f);
      }
      for (const [name] of Object.entries(j.devDependencies || {})) {
        if (!byName.has(name)) byName.set(name, new Set());
        byName.get(name)!.add(f);
      }
    }
    
    const dup = [...byName.entries()].filter(([, set]) => set.size > 1).slice(0, 25);
    if (dup.length) {
      this.issues.push({
        type: "dependency_mismatch",
        severity: "medium",
        file: "workspace",
        description: "Dependencies declared in multiple package.json files (potential version drift).",
        evidence: dup.map(([n, set]) => `${n} → ${[...set].join(", ")}`),
        recommendation: "Hoist and pin versions consistently (workspace root), or align ranges across packages.",
        cognitiveInsights: [
          "Version drift across packages can cause subtle runtime inconsistencies",
          "Consider using workspace features or dependency pinning for consistency"
        ]
      });
    }
  }

  private async scanBuildOutDirDrift() {
    const tsFiles = await this.findFiles(/tsconfig.*\.json$/);
    const outDirs = new Set<string>();
    
    for (const f of tsFiles) {
      const j = this.parseJsonc(await readText(f) || "{}");
      const o = j?.compilerOptions?.outDir;
      if (o) outDirs.add(o);
    }
    
    if (outDirs.size > 1) {
      this.issues.push({
        type: "build_inconsistency",
        severity: "high",
        file: "multiple tsconfig files",
        description: "Multiple TypeScript outDir values can cause confusing artifacts and stale outputs.",
        evidence: [...outDirs],
        recommendation: "Standardize on a single outDir (e.g., \"./.types\" or \"./dist-types\").",
        cognitiveInsights: [
          "Multiple output directories lead to build artifact confusion and cache invalidation issues",
          "Standardizing output directories improves build reproducibility and CI performance"
        ]
      });
    }
  }

  private async scanPlatformPaths() {
    const code = await this.findFiles(/\.(m?ts|m?js|c?js|cts)$/, 1500); // throttle
    
    for (const f of code) {
      const t = await readText(f); 
      if (!t) continue;

      // Suspicious absolute Windows paths or backslashed path fragments in literals
      const suspicious = t.match(/["'`](?:[A-Za-z]:\\|(?:[^`'"\n\r]|\\.)*\\(?:[^`'"\n\r]|\\.))+["'`]/g);
      if (suspicious) {
        this.issues.push({
          type: "platform_issue",
          severity: "low",
          file: f,
          description: "Backslash path fragments found in string literals (may break on POSIX).",
          evidence: suspicious.slice(0, 3),
          recommendation: "Use path.join()/URL APIs; avoid hardcoded separators.",
          cognitiveInsights: [
            "Hardcoded path separators break cross-platform compatibility",
            "Use Node.js path utilities for platform-agnostic path handling"
          ]
        });
      }

      if (t.includes("process.platform") && !/switch\s*\(\s*process\.platform/.test(t)) {
        this.issues.push({
          type: "platform_issue",
          severity: "low",
          file: f,
          description: "Direct process.platform usage without a switch-based abstraction.",
          evidence: ["process.platform"],
          recommendation: "Wrap platform logic in a small helper (e.g., getPlatform()).",
          cognitiveInsights: [
            "Direct platform checks lead to scattered platform-specific logic",
            "Centralize platform detection for better maintainability"
          ]
        });
      }
    }
  }

  private async scanEngineMismatch() {
    const pkgPath = join(this.projectRoot, "package.json");
    const nvmrc = join(this.projectRoot, ".nvmrc");
    const pkgTxt = await readText(pkgPath);
    if (!pkgTxt) return;
    
    const pkg = this.parseJsonc(pkgTxt);
    const engine = pkg?.engines?.node as string | undefined;
    const nvm = await readText(nvmrc);

    if (engine && nvm && !nvm.trim().startsWith(engine.replace(/[^\d.]/g, ""))) {
      this.issues.push({
        type: "engine_mismatch",
        severity: "high",
        file: "package.json/.nvmrc",
        description: "Node version differs between package.json engines and .nvmrc.",
        evidence: [`engines.node=${engine}`, `.nvmrc=${(nvm||"").trim()}`],
        recommendation: "Pin a single Node version (e.g., 20.12.x) in both places.",
        cognitiveInsights: [
          "Node version mismatches cause CI/CD failures and local development inconsistencies",
          "Consistent Node versions across all environment specifications prevent runtime surprises"
        ]
      });
    }
  }

  private async scanModuleSystem() {
    const pkgPath = join(this.projectRoot, "package.json");
    const pkg = this.parseJsonc(await readText(pkgPath) || "{}");
    const isESM = pkg?.type === "module";
    const cjsFiles = await this.findFiles(/\.(cjs|cts)$/);
    
    if (isESM && cjsFiles.length > 0) {
      this.issues.push({
        type: "module_system",
        severity: "medium",
        file: "workspace",
        description: "ESM package (type:module) contains CommonJS files.",
        evidence: cjsFiles.slice(0, 8),
        recommendation: "Convert to .mjs/.mts or mark subtools with \"type\":\"commonjs\" in their own package.json.",
        cognitiveInsights: [
          "Mixed module systems create import/export confusion and runtime errors",
          "Standardize on ESM for modern Node.js applications"
        ]
      });
    }
  }

  private async scanLintFormatDrift() {
    const eslintrc = await this.findFiles(/\.eslintrc(\.json|\.cjs|\.js)?$/);
    const prettierrc = await this.findFiles(/\.prettierrc(\.json|\.cjs|\.js|\.toml)?$/);
    
    if (eslintrc.length > 1) {
      this.issues.push({
        type: "lint_format_drift",
        severity: "low",
        file: "workspace",
        description: "Multiple ESLint configs found.",
        evidence: eslintrc,
        recommendation: "Consolidate to one root config with overrides.",
        cognitiveInsights: [
          "Multiple linting configs create inconsistent code style enforcement",
          "Centralize ESLint configuration for consistent code quality"
        ]
      });
    }
    
    if (prettierrc.length > 1) {
      this.issues.push({
        type: "lint_format_drift",
        severity: "low",
        file: "workspace",
        description: "Multiple Prettier configs found.",
        evidence: prettierrc,
        recommendation: "Prefer a single root .prettierrc.",
        cognitiveInsights: [
          "Multiple formatting configs cause code style inconsistencies across the project",
          "Single formatter configuration ensures uniform code appearance"
        ]
      });
    }
  }

  private async scanImportExtensionConsistency() {
    const tsFiles = await this.findFiles(/\.(ts|tsx)$/, 500); // Sample for performance
    
    for (const f of tsFiles) {
      const content = await readText(f);
      if (!content) continue;

      // Find imports with .js extensions that might have .ts siblings
      const jsImports = content.match(/import.*from\s+['"](\..*\.js)['"]/g);
      if (jsImports) {
        for (const importMatch of jsImports) {
          const match = importMatch.match(/from\s+['"](\..*\.js)['"]/);
          if (match) {
            const jsPath = match[1];
            this.issues.push({
              type: "import_extension_inconsistency",
              severity: "low",
              file: f,
              description: "Import uses .js extension in TypeScript file",
              evidence: [importMatch],
              recommendation: "Remove .js extension or verify the target file actually exists as .js",
              cognitiveInsights: [
                "TypeScript can resolve .ts files without explicit .js extensions",
                ".js extensions in imports can cause confusion about actual file types"
              ]
            });
          }
        }
      }
    }
  }
}
