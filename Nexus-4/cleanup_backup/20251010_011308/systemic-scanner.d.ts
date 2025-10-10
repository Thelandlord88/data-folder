export type IssueType = "config_drift" | "dependency_mismatch" | "build_inconsistency" | "platform_issue" | "engine_mismatch" | "module_system" | "lint_format_drift" | "path_alias_drift" | "import_extension_inconsistency";
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
export declare class SystemicScanner {
    private projectRoot;
    private cfg;
    constructor(projectRoot: string | undefined, cfg: GuardianConfig);
    private issues;
    get results(): SystemicIssue[];
    scan(): Promise<SystemicIssue[]>;
    private parseJsonc;
    private findFiles;
    private scanTsconfigDrift;
    private scanPathAliasDrift;
    private scanDependencyDrift;
    private scanBuildOutDirDrift;
    private scanPlatformPaths;
    private scanEngineMismatch;
    private scanModuleSystem;
    private scanLintFormatDrift;
    private scanImportExtensionConsistency;
}
//# sourceMappingURL=systemic-scanner.d.ts.map