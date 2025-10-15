/**
 * CSS Engine Core Contracts
 * Type-safe interfaces for the NEXUS CSS Engine specialists
 *
 * @module contracts
 * @version 1.0.0
 * @architecture Hybrid (Phase 1) → Neural Network (Phase 2)
 */
/**
 * Error types
 */
export class DesignEngineError extends Error {
    code;
    details;
    constructor(message, code, details) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = 'DesignEngineError';
    }
}
export class SpecialistTimeoutError extends DesignEngineError {
    constructor(specialistId, timeoutMs) {
        super(`Specialist "${specialistId}" exceeded timeout of ${timeoutMs}ms`, 'SPECIALIST_TIMEOUT', { specialistId, timeoutMs });
        this.name = 'SpecialistTimeoutError';
    }
}
export class ValidationError extends DesignEngineError {
    constructor(message, field) {
        super(message, 'VALIDATION_ERROR', { field });
        this.name = 'ValidationError';
    }
}
//# sourceMappingURL=contracts.js.map