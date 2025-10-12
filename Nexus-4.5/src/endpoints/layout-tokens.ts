/**
 * Layout Tokens Endpoint
 * Serves generated CSS variables from the optimized layout pipeline
 * 
 * Sprint 4 Enhancement: CSS token delivery
 */

import type { Request, Response } from 'express';
import { layoutPipeline } from '../../css-engine/pipelines/LayoutDeliveryPipeline.optimized.js';
import type { DesignDNA } from '../../css-engine/contracts.js';

/**
 * GET /layout-tokens.css
 * Serves CSS variables for the layout system
 */
export async function getLayoutTokensCSS(req: Request, res: Response): Promise<void> {
  try {
    // Extract options from query params
    const strategy = (req.query.strategy as string) || 'hybrid';
    const baseUnit = parseInt(req.query.baseUnit as string) || 8;
    
    // Create minimal DesignDNA
    const dna: DesignDNA = {
      constraints: {
        baseSpacePx: baseUnit,
        breakpoints: {
          mobile: 360,
          tablet: 768,
          desktop: 1024,
          wide: 1440
        }
      }
    };

    // Generate layout matrix
    const matrix = await layoutPipeline.generateLayoutMatrix(dna, {
      layoutStrategy: strategy as any,
      baseUnit,
      fluidClamp: {
        gutterMin: 12,
        gutterMax: 40,
        marginMin: 16,
        marginMax: 96
      }
    });

    // Generate CSS
    const css = layoutPipeline.emitCSS(matrix, { selector: ':root' });

    // Set headers
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(css);
  } catch (error) {
    console.error('Error generating layout tokens:', error);
    res.status(500).send('/* Error generating layout tokens */');
  }
}

/**
 * POST /api/layout/matrix
 * Generate and return layout matrix JSON
 */
export async function generateLayoutMatrix(req: Request, res: Response): Promise<void> {
  try {
    const { dna, config } = req.body;

    if (!dna) {
      res.status(400).json({ error: 'DesignDNA required' });
      return;
    }

    const matrix = await layoutPipeline.generateLayoutMatrix(dna, config);
    const validation = layoutPipeline.validateMatrix(matrix);

    res.json({
      matrix,
      validation,
      css: layoutPipeline.emitCSS(matrix),
      tailwind: layoutPipeline.toTailwindFragments(matrix)
    });
  } catch (error: any) {
    console.error('Error generating layout matrix:', error);
    res.status(500).json({ error: error.message });
  }
}
