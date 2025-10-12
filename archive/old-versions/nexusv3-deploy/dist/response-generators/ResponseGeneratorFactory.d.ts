/**
 * Response Generator Factory
 * Creates and manages personality-specific response generators
 */
import { ResponseGenerator } from './ResponseGenerator.interface.js';
export declare class ResponseGeneratorFactory {
    private generators;
    private genericGenerator;
    constructor();
    private initializeGenerators;
    getGenerator(personalityName: string): ResponseGenerator;
    hasSpecializedGenerator(personalityName: string): boolean;
    getAvailableSpecializations(): string[];
    getGeneratorStatus(): {
        specialized: number;
        total: number;
        coverage: string;
    };
}
//# sourceMappingURL=ResponseGeneratorFactory.d.ts.map