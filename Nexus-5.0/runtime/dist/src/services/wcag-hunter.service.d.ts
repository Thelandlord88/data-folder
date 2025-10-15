/**
 * WCAG Hunter Integration - TypeScript Bridge
 *
 * Connects Python WCAG hunters to NEXUS TypeScript runtime
 */
import type { WcagMasterReport, WcagCheckResult, WcagPersonalityAnalysis, WcagIntelligenceData, WcagStrategicImplications } from '../types';
export declare class WcagHunterService {
    private pythonPath;
    private hunterPath;
    constructor();
    /**
     * Run WCAG hunters on HTML content
     */
    checkHtml(html: string): Promise<WcagMasterReport>;
    /**
     * Get personality analysis of WCAG findings
     */
    getPersonalityAnalysis(report: WcagMasterReport): Promise<WcagPersonalityAnalysis>;
    /**
     * Convert WCAG report to Strategic Intelligence format
     */
    toIntelligenceData(report: WcagMasterReport): Promise<WcagIntelligenceData>;
    /**
     * Generate strategic implications from WCAG findings
     */
    getStrategicImplications(report: WcagMasterReport): Promise<WcagStrategicImplications>;
    /**
     * Full WCAG check with personality analysis and strategic intelligence
     */
    runFullCheck(html: string): Promise<WcagCheckResult>;
    /**
     * Extract findings from hunter reports
     */
    private extractFindings;
}
export declare const wcagHunterService: WcagHunterService;
//# sourceMappingURL=wcag-hunter.service.d.ts.map