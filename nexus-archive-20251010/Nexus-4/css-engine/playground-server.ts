/**
 * Simple playground server for testing ColorScientist
 * Serves the playground.html and handles /design API calls
 */

import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ColorScientist } from './specialists/ColorScientist.js';
import { TypographyArchitect } from './specialists/TypographyArchitect.js';
import type { DesignDNA, CompileOptions } from './contracts.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const colorScientist = new ColorScientist();
const typographyArchitect = new TypographyArchitect();

async function handleRequest(req: IncomingMessage, res: ServerResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Serve index (redirects to standalone)
  if (req.url === '/') {
    try {
      const html = await readFile(join(__dirname, 'index.html'), 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch (error) {
      // Fallback to standalone directly
      res.writeHead(302, { 'Location': '/standalone' });
      res.end();
    }
    return;
  }
  
  // Serve playground HTML
  if (req.url === '/playground') {
    try {
      const html = await readFile(join(__dirname, 'playground.html'), 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading playground');
    }
    return;
  }
  
  // Serve standalone playground
  if (req.url === '/standalone') {
    try {
      const html = await readFile(join(__dirname, 'standalone-playground.html'), 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading standalone playground');
    }
    return;
  }
  
  // Handle design API
  if (req.url === '/design' && req.method === 'POST') {
    try {
      // Read body
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk as Buffer);
      }
      const body = JSON.parse(Buffer.concat(chunks).toString());
      
      // Extract input
      const { input, options = {} } = body;
      
      if (!input || !input.type) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing required field: input.type' }));
        return;
      }
      
      // Build design DNA
      const dna: DesignDNA = {};
      
      if (input.type === 'color') {
        dna.colors = [input.primary];
        if (input.secondary) dna.colors.push(input.secondary);
        if (input.accent) dna.colors.push(input.accent);
      } else if (input.type === 'verbal') {
        // For verbal descriptions, we'd need more processing
        // For now, use a default
        dna.colors = ['#0ea5e9'];
      }
      
      // Run ColorScientist
      const t0 = performance.now();
      const colorFacts = await colorScientist.run(dna, options as CompileOptions);
      
      // Run TypographyArchitect
      const typeFacts = await typographyArchitect.run(dna, options as CompileOptions);
      
      const elapsed = performance.now() - t0;
      
      // Build response
      const response = {
        tokens: {
          color: colorFacts.ramp,
          spacing: {},
          typography: {
            ...typeFacts.steps,
            leading: typeFacts.leading,
          },
          breakpoints: {}
        },
        cssVariables: generateCSSVariables(colorFacts.ramp, typeFacts.steps, typeFacts.fluidSteps),
        tailwindV4CSS: generateCSSVariables(colorFacts.ramp, typeFacts.steps, typeFacts.fluidSteps),
        diagnostics: {
          notes: [
            `Generated ${Object.keys(colorFacts.ramp).length} color shades`,
            `Generated ${Object.keys(typeFacts.steps).length} typography sizes`,
            `Scale ratio: ${typeFacts.ratio} (${dna.constraints?.typeRatio ?? 'perfectFourth'})`
          ],
          audits: colorFacts.audits.map(audit => ({
            check: `contrast-ratio`,
            pass: audit.pass,
            details: {
              foreground: audit.pair[0],
              background: audit.pair[1],
              ratio: audit.ratio.toFixed(2),
              level: audit.level
            }
          })),
          timings: {
            colorScientist: elapsed / 2,
            typographyArchitect: elapsed / 2,
            total: elapsed
          }
        },
        cacheKey: 'playground-' + Date.now()
      };
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('Error processing design request:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: (error as Error).message,
        stack: (error as Error).stack
      }));
    }
    return;
  }
  
  // 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
}

function generateCSSVariables(
  ramp: Record<string, string>,
  typeSteps?: Record<string, number>,
  fluidSteps?: Record<string, string>
): string {
  const lines = ['@theme {'];
  
  // Color variables
  Object.entries(ramp).forEach(([key, value]) => {
    lines.push(`  --color-primary-${key}: ${value};`);
  });
  
  // Typography variables (if provided)
  if (typeSteps) {
    Object.entries(typeSteps).forEach(([key, value]) => {
      lines.push(`  --font-size-${key}: ${value}px;`);
    });
  }
  
  // Fluid typography (if provided)
  if (fluidSteps) {
    Object.entries(fluidSteps).forEach(([key, value]) => {
      lines.push(`  --font-size-${key}-fluid: ${value};`);
    });
  }
  
  lines.push('}');
  return lines.join('\n');
}

const PORT = 9000;
const HOST = '0.0.0.0'; // Bind to all interfaces for Codespaces
const server = createServer(handleRequest);

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('🎨 ColorScientist Playground Server');
  console.log('=====================================');
  console.log('');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Open playground at http://localhost:${PORT}/playground`);
  console.log(`✅ Open standalone at http://localhost:${PORT}/standalone`);
  console.log(`✅ API endpoint: POST http://localhost:${PORT}/design`);
  console.log('');
  console.log('Press Ctrl+C to stop');
  console.log('');
});
