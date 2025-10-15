/**
 * Preview & Testing Endpoints
 * Makes NEXUS web output observable to AI through:
 * - Structured HTML with embedded metadata
 * - JSON test results
 * - Computed style validation
 *
 * Sprint 4 Enhancement: AI-observable web output
 */
import type { IncomingMessage, ServerResponse } from 'http';
/**
 * GET /preview?strategy=hybrid&baseUnit=8
 * Generates a live HTML preview with embedded test metadata
 * AI can read the HTML source and metadata comments to verify output
 */
export declare function getPreviewPage(req: IncomingMessage, res: ServerResponse): Promise<void>;
/**
 * GET /test-layout?strategy=hybrid&baseUnit=8
 * Returns structured JSON test results that AI can read and validate
 */
export declare function testLayoutSystem(req: IncomingMessage, res: ServerResponse): Promise<void>;
//# sourceMappingURL=preview.d.ts.map