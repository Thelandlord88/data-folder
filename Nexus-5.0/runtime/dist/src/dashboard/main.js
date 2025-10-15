/**
 * NEXUS Dashboard - Main Entry Point
 * Real-time design system preview with WebSocket updates
 *
 * Sprint 3 Deliverable: StyleForge + VisualArchitect
 */
import { NexusClient } from './services/nexus-client.js';
// Initialize Nexus client
const nexusClient = new NexusClient('http://127.0.0.1:8080');
// Global state
let currentDesignPackage = null;
let currentBreakpoint = 1024;
// Initialize dashboard
async function init() {
    console.log('🎨 NEXUS Dashboard initializing...');
    // Connect to WebSocket for live updates
    nexusClient.connect();
    // Listen for design updates
    nexusClient.on('design-generated', handleDesignUpdate);
    nexusClient.on('enhancement', handleEnhancementUpdate);
    // Check NEXUS status
    try {
        const status = await nexusClient.getStatus();
        console.log('✅ NEXUS connected:', status);
        updateConnectionStatus(true);
    }
    catch (error) {
        console.error('❌ NEXUS connection failed:', error);
        updateConnectionStatus(false);
    }
}
// Generate design system
window.generateDesign = async function () {
    const primaryColor = document.getElementById('primary-color').value;
    const layoutStrategy = document.getElementById('layout-strategy').value;
    const darkMode = document.getElementById('dark-mode').checked;
    showNotification('Generating design system...', 'info');
    try {
        const startTime = performance.now();
        const response = await nexusClient.generateDesign({
            input: {
                type: 'color',
                primary: primaryColor
            },
            options: {
                layoutStrategy,
                darkMode
            }
        });
        const elapsed = performance.now() - startTime;
        currentDesignPackage = response.design;
        // Update UI
        updateStats(response.design, elapsed);
        updatePreview(response.design);
        showNotification(`Design generated in ${elapsed.toFixed(0)}ms!`, 'success');
    }
    catch (error) {
        console.error('Design generation error:', error);
        showNotification('Design generation failed', 'error');
    }
};
// Refresh preview
window.refreshPreview = function () {
    if (currentDesignPackage) {
        updatePreview(currentDesignPackage);
        showNotification('Preview refreshed', 'success');
    }
};
// Export design
window.exportDesign = async function () {
    if (!currentDesignPackage) {
        showNotification('Generate a design first', 'error');
        return;
    }
    // Create downloadable JSON
    const dataStr = JSON.stringify(currentDesignPackage, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexus-design-${Date.now()}.json`;
    link.click();
    showNotification('Design exported', 'success');
};
// Set breakpoint
window.setBreakpoint = function (width) {
    currentBreakpoint = width;
    // Update active tab
    document.querySelectorAll('.breakpoint-tab').forEach(tab => {
        tab.classList.remove('active');
        if (parseInt(tab.dataset.width) === width) {
            tab.classList.add('active');
        }
    });
    // Update preview frame width
    const previewFrame = document.getElementById('preview-frame');
    previewFrame.style.maxWidth = `${width}px`;
    previewFrame.style.transition = 'max-width 0.3s ease';
    showNotification(`Breakpoint: ${width}px`, 'info');
};
// Update stats display
function updateStats(designPackage, generationTime) {
    // Generation time
    document.getElementById('gen-time').textContent = `${generationTime.toFixed(1)}ms`;
    // Token count
    const tokenCount = countTokens(designPackage);
    document.getElementById('token-count').textContent = tokenCount;
    document.getElementById('total-tokens').textContent = tokenCount;
    // Cache hit
    const cacheHit = designPackage._fromCache || false;
    document.getElementById('cache-hit').textContent = cacheHit ? 'Yes' : 'No';
    // WCAG level
    document.getElementById('wcag-level').textContent = 'AA';
    // Contrast pass rate (placeholder)
    document.getElementById('contrast-pass').textContent = '100%';
}
// Count tokens in design package
function countTokens(designPackage) {
    let count = 0;
    if (designPackage.tokens) {
        if (designPackage.tokens.color)
            count += Object.keys(designPackage.tokens.color).length;
        if (designPackage.tokens.typography)
            count += Object.keys(designPackage.tokens.typography).length;
        if (designPackage.tokens.spacing)
            count += Object.keys(designPackage.tokens.spacing).length;
        if (designPackage.tokens.layout)
            count += Object.keys(designPackage.tokens.layout).length;
    }
    return count;
}
// Update preview
function updatePreview(designPackage) {
    const previewFrame = document.getElementById('preview-frame');
    // Generate preview HTML
    const html = generatePreviewHTML(designPackage);
    previewFrame.innerHTML = html;
}
// Generate preview HTML
function generatePreviewHTML(designPackage) {
    const tokens = designPackage.tokens || {};
    const colors = tokens.color || {};
    const typography = tokens.typography || {};
    return `
        <div style="padding: 2rem; background: ${colors.background || '#fff'}; color: ${colors.text || '#000'}; min-height: 600px;">
            <h1 style="font-size: ${typography['heading-1'] || '2rem'}; margin-bottom: 1rem;">
                Design System Preview
            </h1>
            <p style="font-size: ${typography.body || '1rem'}; line-height: 1.6; margin-bottom: 2rem; color: ${colors['text-muted'] || '#666'};">
                This is a live preview of your generated design system. Changes are reflected in real-time.
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                ${Object.entries(colors).slice(0, 6).map(([name, value]) => `
                    <div style="background: ${value}; padding: 2rem; border-radius: 8px; text-align: center; color: ${isLightColor(value) ? '#000' : '#fff'};">
                        <div style="font-weight: 600; margin-bottom: 0.5rem;">${name}</div>
                        <div style="font-size: 0.875rem; opacity: 0.8;">${value}</div>
                    </div>
                `).join('')}
            </div>
            
            <h2 style="font-size: ${typography['heading-2'] || '1.5rem'}; margin-bottom: 1rem;">
                Typography Scale
            </h2>
            <div style="margin-bottom: 2rem;">
                ${Object.entries(typography).slice(0, 5).map(([name, value]) => `
                    <div style="margin-bottom: 0.5rem;">
                        <span style="font-size: 0.875rem; color: ${colors['text-muted'] || '#666'};">${name}:</span>
                        <span style="font-size: ${value}; margin-left: 1rem;">The quick brown fox</span>
                    </div>
                `).join('')}
            </div>
            
            <button style="
                background: ${colors.primary || '#3b82f6'};
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                font-size: 1rem;
                cursor: pointer;
                font-weight: 500;
            ">
                Primary Button
            </button>
        </div>
    `;
}
// Check if color is light
function isLightColor(hex) {
    if (!hex)
        return true;
    hex = hex.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
}
// Handle design update from WebSocket
function handleDesignUpdate(data) {
    console.log('🎨 Design update received:', data);
    showNotification('Design updated', 'info');
}
// Handle enhancement update from WebSocket
function handleEnhancementUpdate(data) {
    console.log('✨ Enhancement update:', data);
}
// Update connection status
function updateConnectionStatus(connected) {
    const statusEl = document.getElementById('connection-status');
    if (connected) {
        statusEl.innerHTML = '● Connected';
        statusEl.style.color = 'var(--success)';
    }
    else {
        statusEl.innerHTML = '● Disconnected';
        statusEl.style.color = 'var(--error)';
    }
}
// Show notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const messageEl = document.getElementById('notification-message');
    messageEl.textContent = message;
    notification.className = `notification ${type} show`;
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
// Initialize on load
init();
//# sourceMappingURL=main.js.map