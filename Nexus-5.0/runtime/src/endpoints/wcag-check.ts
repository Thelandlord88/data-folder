/**
 * WCAG Check Endpoint
 * 
 * HTTP endpoint for WCAG compliance checking
 */

import { wcagHunterService } from '../services/wcag-hunter.service';
import type { IncomingMessage, ServerResponse } from 'http';

// Helper to read request body
async function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        resolve(parsed.html || '');
      } catch {
        resolve(body);
      }
    });
    req.on('error', reject);
  });
}

export async function handleWcagCheck(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    // Get HTML from request body or URL
    let html = '';
    
    if (req.method === 'POST') {
      // Read body
      html = await readBody(req);
    } else if (req.url) {
      // Extract URL parameter
      const url = new URL(req.url, 'http://localhost');
      const targetUrl = url.searchParams.get('url');
      
      if (targetUrl) {
        // For now, just return error - would need fetch
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'URL fetching not implemented yet',
          usage: 'POST /wcag-check with body: {"html": "..."}'
        }));
        return;
      }
    }

    if (!html) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'No HTML provided',
        usage: {
          post: 'POST /wcag-check with {"html": "..."}',
          get: 'GET /wcag-check?url=http://...'
        }
      }));
      return;
    }

    // Run full WCAG check
    const result = await wcagHunterService.runFullCheck(html);

    // Return results
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result, null, 2));
    
  } catch (error: any) {
    console.error('WCAG check error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'WCAG check failed',
      message: error.message
    }));
  }
}

/**
 * Quick WCAG report endpoint (JSON only)
 */
export async function handleWcagReport(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const html = await readBody(req);
    
    if (!html) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No HTML provided' }));
      return;
    }

    // Just return the WCAG report
    const report = await wcagHunterService.checkHtml(html);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(report, null, 2));
    
  } catch (error: any) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
}
