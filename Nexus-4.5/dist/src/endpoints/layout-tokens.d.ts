/**
 * Layout Tokens Endpoint
 * Serves generated CSS variables from the optimized layout pipeline
 *
 * Sprint 4 Enhancement: CSS token delivery
 */
import type { IncomingMessage, ServerResponse } from 'http';
/**
 * GET /layout-tokens.css
 * Serves CSS variables for the layout system
 */
export declare function getLayoutTokensCSS(req: IncomingMessage, res: ServerResponse): Promise<void>;
/**
 * POST /api/layout/matrix
 * Generate and return layout matrix JSON
 */
export declare function generateLayoutMatrix(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=layout-tokens.d.ts.map