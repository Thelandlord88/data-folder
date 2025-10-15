/**
 * CSS Engine Type Definitions
 * Type contracts for NEXUS CSS calculation engine
 *
 * @module css-engine.types
 * @version 1.0.0
 * @see {@link NEXUS_CSS_ENGINE_BOARDROOM_MEETING.md} for architecture decisions
 */
/**
 * CSS Engine error types
 */
export class CSSEngineError extends Error {
    code;
    details;
    constructor(message, code, details) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = 'CSSEngineError';
    }
}
/**
 * Validation error for CSS requirements
 */
export class CSSValidationError extends CSSEngineError {
    constructor(message, details) {
        super(message, 'VALIDATION_ERROR', details);
        this.name = 'CSSValidationError';
    }
}
/**
 * Compute timeout error
 */
export class CSSComputeTimeoutError extends CSSEngineError {
    constructor(timeoutMs) {
        super(`CSS computation exceeded timeout of ${timeoutMs}ms`, 'COMPUTE_TIMEOUT');
        this.name = 'CSSComputeTimeoutError';
    }
}
/**
 * WCAG contrast failure error
 */
export class WCAGContrastError extends CSSEngineError {
    foreground;
    background;
    ratio;
    required;
    constructor(message, foreground, background, ratio, required) {
        super(message, 'WCAG_CONTRAST_FAIL', { foreground, background, ratio, required });
        this.foreground = foreground;
        this.background = background;
        this.ratio = ratio;
        this.required = required;
        this.name = 'WCAGContrastError';
    }
}
//# sourceMappingURL=css-engine.types.js.map