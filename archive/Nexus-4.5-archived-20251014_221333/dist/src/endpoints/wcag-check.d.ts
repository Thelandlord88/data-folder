/**
 * WCAG Check Endpoint
 *
 * HTTP endpoint for WCAG compliance checking
 */
import type { IncomingMessage, ServerResponse } from 'http';
export declare function handleWcagCheck(req: IncomingMessage, res: ServerResponse): Promise<void>;
/**
 * Quick WCAG report endpoint (JSON only)
 */
export declare function handleWcagReport(req: IncomingMessage, res: ServerResponse): Promise<void>;
//# sourceMappingURL=wcag-check.d.ts.map