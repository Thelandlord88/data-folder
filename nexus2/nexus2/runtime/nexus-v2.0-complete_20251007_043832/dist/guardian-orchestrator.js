export class GuardianOrchestrator {
    scanner;
    constructor(scanner) {
        this.scanner = scanner;
    }
    async performSystemicAudit() {
        const issues = await this.scanner.scan();
        const recommendations = issues
            .filter(i => i.severity === "critical" || i.severity === "high")
            .map(i => i.recommendation);
        return {
            issues,
            recommendations,
            summary: this.generateSummary(issues),
            cognitiveInsights: this.extractCognitiveInsights(issues)
        };
    }
    generateSummary(issues) {
        const byType = new Map();
        const bySeverity = new Map();
        issues.forEach(issue => {
            byType.set(issue.type, (byType.get(issue.type) || 0) + 1);
            bySeverity.set(issue.severity, (bySeverity.get(issue.severity) || 0) + 1);
        });
        return {
            total: issues.length,
            byType: Object.fromEntries(byType),
            bySeverity: Object.fromEntries(bySeverity),
            productionReady: issues.filter(i => i.severity === "critical").length === 0
        };
    }
    extractCognitiveInsights(issues) {
        const insights = new Set();
        issues.forEach(issue => {
            if (issue.cognitiveInsights) {
                issue.cognitiveInsights.forEach(insight => insights.add(insight));
            }
        });
        return Array.from(insights);
    }
    toMarkdown(issues) {
        const sec = (title, arr) => arr.length ? `## ${title} (${arr.length})\n\n` + arr.map(i => {
            const cognitiveSection = i.cognitiveInsights?.length
                ? `\n- **Cognitive Insights**: ${i.cognitiveInsights.join('; ')}`
                : '';
            return `### ${i.file}\n- **Type**: ${i.type}\n- **Description**: ${i.description}\n- **Evidence**: ${i.evidence.join(", ")}\n- **Recommendation**: ${i.recommendation}${cognitiveSection}\n`;
        }).join("\n") : "";
        const c = issues.filter(i => i.severity === "critical");
        const h = issues.filter(i => i.severity === "high");
        const m = issues.filter(i => i.severity === "medium");
        const l = issues.filter(i => i.severity === "low");
        const summary = this.generateSummary(issues);
        const insights = this.extractCognitiveInsights(issues);
        return [
            `# 🛡️ SYSTEMIC QUALITY AUDIT REPORT`,
            `> Generated: ${new Date().toISOString()}`,
            `> Issues Found: ${issues.length}`,
            `> Production Ready: ${summary.productionReady ? '✅ YES' : '❌ NO (critical issues found)'}`,
            ``,
            `## 📊 Summary`,
            `- **Critical**: ${summary.bySeverity.critical || 0}`,
            `- **High**: ${summary.bySeverity.high || 0}`,
            `- **Medium**: ${summary.bySeverity.medium || 0}`,
            `- **Low**: ${summary.bySeverity.low || 0}`,
            ``,
            `## 🧠 Cognitive Insights`,
            insights.length ? insights.map(insight => `- ${insight}`).join('\n') : 'No cognitive insights generated.',
            ``,
            sec("🚨 CRITICAL", c),
            sec("⚠️ HIGH", h),
            sec("➖ MEDIUM", m),
            sec("ℹ️ LOW", l)
        ].join("\n\n");
    }
    toSarif(issues) {
        return {
            version: "2.1.0",
            runs: [{
                    tool: {
                        driver: {
                            name: "NEXUS Systemic Guardian",
                            informationUri: "https://github.com/your-org/nexus-guardian",
                            version: "1.0.0",
                            rules: this.generateSarifRules(issues)
                        }
                    },
                    results: issues.map(i => ({
                        ruleId: i.type,
                        level: i.severity === "critical" ? "error" : i.severity === "high" ? "error" : i.severity === "medium" ? "warning" : "note",
                        message: {
                            text: `${i.description} — ${i.recommendation}`,
                            markdown: i.cognitiveInsights?.length
                                ? `${i.description}\n\n**Recommendation**: ${i.recommendation}\n\n**Cognitive Insights**: ${i.cognitiveInsights.join('; ')}`
                                : `${i.description}\n\n**Recommendation**: ${i.recommendation}`
                        },
                        locations: [{
                                physicalLocation: {
                                    artifactLocation: { uri: i.file },
                                    region: { startLine: 1, startColumn: 1 }
                                }
                            }],
                        properties: {
                            cognitiveInsights: i.cognitiveInsights || [],
                            evidence: i.evidence
                        }
                    }))
                }]
        };
    }
    generateSarifRules(issues) {
        const ruleTypes = new Set(issues.map(i => i.type));
        return Array.from(ruleTypes).map(type => ({
            id: type,
            name: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            shortDescription: { text: `Detects ${type.replace(/_/g, ' ')} issues` },
            fullDescription: {
                text: `Identifies and reports ${type.replace(/_/g, ' ')} that can cause systemic quality issues in the codebase.`
            },
            helpUri: `https://github.com/your-org/nexus-guardian/docs/${type}`,
            properties: {
                category: "systemic-quality",
                tags: ["quality", "architecture", "configuration"]
            }
        }));
    }
    toJson(issues) {
        return {
            generatedAt: new Date().toISOString(),
            summary: this.generateSummary(issues),
            cognitiveInsights: this.extractCognitiveInsights(issues),
            issues,
            recommendations: issues
                .filter(i => i.severity === "critical" || i.severity === "high")
                .map(i => i.recommendation)
        };
    }
}
//# sourceMappingURL=guardian-orchestrator.js.map