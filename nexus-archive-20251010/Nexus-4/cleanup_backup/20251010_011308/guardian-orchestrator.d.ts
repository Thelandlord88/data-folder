import { SystemicScanner, type SystemicIssue } from "./systemic-scanner.js";
export declare class GuardianOrchestrator {
    private scanner;
    constructor(scanner: SystemicScanner);
    performSystemicAudit(): Promise<{
        issues: SystemicIssue[];
        recommendations: string[];
        summary: {
            total: number;
            byType: {
                [k: string]: number;
            };
            bySeverity: {
                [k: string]: number;
            };
            productionReady: boolean;
        };
        cognitiveInsights: string[];
    }>;
    private generateSummary;
    private extractCognitiveInsights;
    toMarkdown(issues: SystemicIssue[]): string;
    toSarif(issues: SystemicIssue[]): {
        version: string;
        runs: {
            tool: {
                driver: {
                    name: string;
                    informationUri: string;
                    version: string;
                    rules: {
                        id: import("./systemic-scanner.js").IssueType;
                        name: string;
                        shortDescription: {
                            text: string;
                        };
                        fullDescription: {
                            text: string;
                        };
                        helpUri: string;
                        properties: {
                            category: string;
                            tags: string[];
                        };
                    }[];
                };
            };
            results: {
                ruleId: import("./systemic-scanner.js").IssueType;
                level: string;
                message: {
                    text: string;
                    markdown: string;
                };
                locations: {
                    physicalLocation: {
                        artifactLocation: {
                            uri: string;
                        };
                        region: {
                            startLine: number;
                            startColumn: number;
                        };
                    };
                }[];
                properties: {
                    cognitiveInsights: string[];
                    evidence: string[];
                };
            }[];
        }[];
    };
    private generateSarifRules;
    toJson(issues: SystemicIssue[]): {
        generatedAt: string;
        summary: {
            total: number;
            byType: {
                [k: string]: number;
            };
            bySeverity: {
                [k: string]: number;
            };
            productionReady: boolean;
        };
        cognitiveInsights: string[];
        issues: SystemicIssue[];
        recommendations: string[];
    };
}
//# sourceMappingURL=guardian-orchestrator.d.ts.map