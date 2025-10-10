import { NEXUSOrchestrator, ComposedAgent } from './NEXUS.engine';
import { AuditScope } from './Hunter.policy';
export declare class HunterAuditAgent {
    private nexus;
    private policy;
    constructor(nexus: NEXUSOrchestrator);
    createAuditAgent(taskDescription: string): Promise<ComposedAgent>;
    executeComprehensiveAudit(scope: AuditScope): Promise<any>;
    private combineResults;
}
//# sourceMappingURL=Hunter.auditAgent.d.ts.map