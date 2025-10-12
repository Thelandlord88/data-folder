/**
 * Preview & Testing Endpoints
 * Makes NEXUS web output observable to AI through:
 * - Structured HTML with embedded metadata
 * - JSON test results
 * - Computed style validation
 *
 * Sprint 4 Enhancement: AI-observable web output
 */
import { layoutPipeline } from '../../css-engine/pipelines/LayoutDeliveryPipeline.optimized.js';
import { URL } from 'url';
/**
 * GET /preview?strategy=hybrid&baseUnit=8
 * Generates a live HTML preview with embedded test metadata
 * AI can read the HTML source and metadata comments to verify output
 */
export async function getPreviewPage(req, res) {
    try {
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const strategy = url.searchParams.get('strategy') || 'hybrid';
        const baseUnit = parseInt(url.searchParams.get('baseUnit') || '8');
        // Create DesignDNA
        const dna = {
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
            layoutStrategy: strategy,
            baseUnit,
            fluidClamp: {
                gutterMin: 12,
                gutterMax: 40,
                marginMin: 16,
                marginMax: 96
            }
        });
        // Validate
        const validation = layoutPipeline.validateMatrix(matrix);
        // Generate CSS
        const css = layoutPipeline.emitCSS(matrix, { selector: ':root' });
        // Build HTML with embedded metadata
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEXUS Layout Preview - ${strategy.toUpperCase()}</title>
    
    <!--
    ============================================================
    AI-READABLE METADATA: Layout Configuration
    ============================================================
    Strategy: ${strategy}
    Base Unit: ${baseUnit}px
    Validation: ${validation.valid ? 'PASS' : 'FAIL'}
    ${!validation.valid ? `Errors: ${validation.errors.join(', ')}` : ''}
    
    Breakpoints Generated:
    ${matrix.breakpoints.map(bp => `
    - ${bp.name}: ${bp.width}px (${bp.columns} cols, ${bp.gutter}px gutter, ${bp.margin}px margin)
      Container: ${matrix.computed[bp.name].containerWidth}px
      Column Width: ${matrix.computed[bp.name].columnWidth}px
    `).join('')}
    ============================================================
    -->
    
    <style>
        /* Generated CSS Variables */
        ${css}
        
        /* Demo Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #0a0a0a;
            color: #f5f5f5;
            line-height: 1.6;
        }
        
        .container {
            max-width: var(--grid-container);
            margin: 0 auto;
            padding: 0 var(--grid-margin);
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(var(--grid-columns), 1fr);
            gap: var(--grid-gutter);
            margin: 2rem 0;
        }
        
        .card {
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 1.5rem;
        }
        
        .metrics {
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 1.5rem;
            margin: 2rem 0;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
        }
        
        .metrics dt {
            color: #888;
            margin-top: 0.5rem;
        }
        
        .metrics dd {
            color: #3b82f6;
            margin-left: 1rem;
        }
        
        .success {
            color: #10b981;
        }
        
        .error {
            color: #ef4444;
        }
        
        h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        
        h2 {
            font-size: 1.5rem;
            margin: 2rem 0 1rem;
        }
        
        code {
            background: #0a0a0a;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.875rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 NEXUS Layout Preview</h1>
        <p>Strategy: <code>${strategy}</code> | Base Unit: <code>${baseUnit}px</code></p>
        
        <div class="metrics">
            <h2>📊 Live Computed Values (Readable by AI)</h2>
            <dl>
                <dt>Current Breakpoint Columns:</dt>
                <dd id="current-columns">Loading...</dd>
                
                <dt>Current Container Width:</dt>
                <dd id="current-container">Loading...</dd>
                
                <dt>Current Gutter:</dt>
                <dd id="current-gutter">Loading...</dd>
                
                <dt>Current Margin:</dt>
                <dd id="current-margin">Loading...</dd>
                
                <dt>Current Column Width:</dt>
                <dd id="current-column-width">Loading...</dd>
                
                <dt>Viewport Width:</dt>
                <dd id="viewport-width">Loading...</dd>
                
                <dt>Validation Status:</dt>
                <dd class="${validation.valid ? 'success' : 'error'}">
                    ${validation.valid ? '✅ VALID' : '❌ INVALID'}
                </dd>
            </dl>
        </div>
        
        <h2>Grid Demonstration</h2>
        <p>This grid adapts to breakpoints: ${matrix.breakpoints.map(bp => bp.name).join(' → ')}</p>
        
        <div class="grid">
            ${Array.from({ length: 12 }, (_, i) => `
                <div class="card">
                    <h3>Card ${i + 1}</h3>
                    <p>Column content</p>
                </div>
            `).join('')}
        </div>
        
        <div class="metrics">
            <h2>📐 All Breakpoints Configuration</h2>
            ${matrix.breakpoints.map(bp => {
            const computed = matrix.computed[bp.name];
            return `
                <h3>${bp.name} (${bp.width}px)</h3>
                <dl>
                    <dt>Columns:</dt><dd>${bp.columns}</dd>
                    <dt>Gutter:</dt><dd>${bp.gutter}px</dd>
                    <dt>Margin:</dt><dd>${bp.margin}px</dd>
                    <dt>Container Width:</dt><dd>${computed.containerWidth}px</dd>
                    <dt>Column Width:</dt><dd>${computed.columnWidth}px</dd>
                    <dt>Clamped:</dt><dd>${computed.clamped ? 'Yes' : 'No'}</dd>
                </dl>
                `;
        }).join('')}
        </div>
    </div>
    
    <script>
        // Read computed CSS values and display them
        // This makes the actual rendered values observable
        function updateMetrics() {
            const root = document.documentElement;
            const style = getComputedStyle(root);
            
            const metrics = {
                columns: style.getPropertyValue('--grid-columns').trim(),
                container: style.getPropertyValue('--grid-container').trim(),
                gutter: style.getPropertyValue('--grid-gutter').trim(),
                margin: style.getPropertyValue('--grid-margin').trim(),
                columnWidth: style.getPropertyValue('--grid-column-width').trim(),
                viewport: window.innerWidth + 'px'
            };
            
            document.getElementById('current-columns').textContent = metrics.columns;
            document.getElementById('current-container').textContent = metrics.container;
            document.getElementById('current-gutter').textContent = metrics.gutter;
            document.getElementById('current-margin').textContent = metrics.margin;
            document.getElementById('current-column-width').textContent = metrics.columnWidth;
            document.getElementById('viewport-width').textContent = metrics.viewport;
            
            // Output to console for AI to read via logs
            console.log('NEXUS_METRICS:', JSON.stringify(metrics, null, 2));
        }
        
        updateMetrics();
        window.addEventListener('resize', updateMetrics);
        
        // Make metrics available globally for testing
        window.NEXUS_METRICS = function() {
            const root = document.documentElement;
            const style = getComputedStyle(root);
            return {
                columns: style.getPropertyValue('--grid-columns').trim(),
                container: style.getPropertyValue('--grid-container').trim(),
                gutter: style.getPropertyValue('--grid-gutter').trim(),
                margin: style.getPropertyValue('--grid-margin').trim(),
                columnWidth: style.getPropertyValue('--grid-column-width').trim(),
                viewport: window.innerWidth
            };
        };
    </script>
    
    <!--
    ============================================================
    AI-READABLE TEST INSTRUCTIONS:
    ============================================================
    To verify this page works correctly:
    
    1. Check HTML source for metadata comments (above)
    2. Verify CSS variables are defined in <style> tag
    3. Check console logs for NEXUS_METRICS output
    4. Call window.NEXUS_METRICS() in browser console
    5. Use /test-layout endpoint for automated validation
    
    Expected behavior:
    - Grid should have ${matrix.breakpoints[0].columns} columns on mobile
    - Grid should have ${matrix.breakpoints[matrix.breakpoints.length - 1].columns} columns on wide screens
    - Container should respect margins at each breakpoint
    - Column widths should be computed correctly
    ============================================================
    -->
</body>
</html>`;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
    }
    catch (error) {
        console.error('Error generating preview:', error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`<html><body><h1>Error</h1><pre>${error.message}</pre></body></html>`);
    }
}
/**
 * GET /test-layout?strategy=hybrid&baseUnit=8
 * Returns structured JSON test results that AI can read and validate
 */
export async function testLayoutSystem(req, res) {
    try {
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const strategy = url.searchParams.get('strategy') || 'hybrid';
        const baseUnit = parseInt(url.searchParams.get('baseUnit') || '8');
        // Create DesignDNA
        const dna = {
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
        const startTime = Date.now();
        const matrix = await layoutPipeline.generateLayoutMatrix(dna, {
            layoutStrategy: strategy,
            baseUnit,
            fluidClamp: {
                gutterMin: 12,
                gutterMax: 40,
                marginMin: 16,
                marginMax: 96
            }
        });
        const generationTime = Date.now() - startTime;
        // Validate
        const validation = layoutPipeline.validateMatrix(matrix);
        // Run additional tests
        const tests = {
            'Column widths are multiples of base unit': matrix.breakpoints.every(bp => {
                const colWidth = matrix.computed[bp.name].columnWidth;
                return colWidth % baseUnit === 0;
            }),
            'Container widths are positive': matrix.breakpoints.every(bp => {
                return matrix.computed[bp.name].containerWidth > 0;
            }),
            'Breakpoints are ascending': matrix.breakpoints.every((bp, i, arr) => {
                return i === 0 || bp.width > arr[i - 1].width;
            }),
            'Column counts are valid (1-24)': matrix.breakpoints.every(bp => {
                return bp.columns >= 1 && bp.columns <= 24;
            }),
            'Gutters and margins are non-negative': matrix.breakpoints.every(bp => {
                return bp.gutter >= 0 && bp.margin >= 0;
            })
        };
        const allTestsPassed = Object.values(tests).every(result => result === true);
        // Generate CSS and measure size
        const css = layoutPipeline.emitCSS(matrix);
        const cssSize = new TextEncoder().encode(css).length;
        // Build comprehensive test result
        const result = {
            timestamp: new Date().toISOString(),
            strategy,
            baseUnit,
            generationTime: `${generationTime}ms`,
            validation: {
                valid: validation.valid,
                errors: validation.errors
            },
            tests: Object.entries(tests).map(([name, passed]) => ({
                name,
                passed,
                status: passed ? '✅ PASS' : '❌ FAIL'
            })),
            summary: {
                totalTests: Object.keys(tests).length,
                passed: Object.values(tests).filter(Boolean).length,
                failed: Object.values(tests).filter(v => !v).length,
                allPassed: allTestsPassed,
                overallStatus: allTestsPassed && validation.valid ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'
            },
            breakpoints: matrix.breakpoints.map(bp => ({
                name: bp.name,
                width: bp.width,
                columns: bp.columns,
                gutter: bp.gutter,
                margin: bp.margin,
                computed: {
                    containerWidth: matrix.computed[bp.name].containerWidth,
                    columnWidth: matrix.computed[bp.name].columnWidth,
                    totalGutters: matrix.computed[bp.name].totalGutters,
                    clamped: matrix.computed[bp.name].clamped || false
                }
            })),
            css: {
                generated: true,
                size: `${cssSize} bytes`,
                preview: css.substring(0, 200) + '...'
            },
            recommendations: generateRecommendations(matrix, validation)
        };
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        res.end(JSON.stringify(result, null, 2));
    }
    catch (error) {
        console.error('Error testing layout:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            error: error.message,
            stack: error.stack
        }, null, 2));
    }
}
/**
 * Generate actionable recommendations based on test results
 */
function generateRecommendations(matrix, validation) {
    const recommendations = [];
    if (!validation.valid) {
        recommendations.push('⚠️  Fix validation errors before deploying to production');
    }
    // Check for extreme column widths
    matrix.breakpoints.forEach((bp) => {
        const colWidth = matrix.computed[bp.name].columnWidth;
        if (colWidth < 40) {
            recommendations.push(`⚠️  ${bp.name} breakpoint has narrow columns (${colWidth}px). Consider reducing columns or increasing viewport width.`);
        }
        if (colWidth > 200) {
            recommendations.push(`⚠️  ${bp.name} breakpoint has wide columns (${colWidth}px). Consider increasing columns for better content distribution.`);
        }
    });
    // Check for clamping
    const clampedBreakpoints = matrix.breakpoints.filter((bp) => matrix.computed[bp.name].clamped);
    if (clampedBreakpoints.length > 0) {
        recommendations.push(`ℹ️  Clamping applied to: ${clampedBreakpoints.map((bp) => bp.name).join(', ')}. This is normal for extreme viewports.`);
    }
    if (recommendations.length === 0) {
        recommendations.push('✅ Layout configuration looks optimal!');
    }
    return recommendations;
}
//# sourceMappingURL=preview.js.map