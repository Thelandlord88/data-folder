import { Specialist, GridComputation } from '../contracts.js';
interface GridMathematicianInput {
    breakpoints: Record<string, number>;
    preferredColumns?: number[];
    ratio?: 'golden' | 'perfectFourth' | 'harmonic';
    baseUnit?: number;
    containerWidths?: Record<string, number>;
}
export declare class GridMathematician implements Specialist<GridMathematicianInput, GridComputation> {
    readonly id = "grid-mathematician";
    readonly timeoutMs = 80;
    run(input: GridMathematicianInput): Promise<GridComputation>;
    private calculateGridForWidth;
}
export declare function createGridMathematician(): GridMathematician;
export {};
//# sourceMappingURL=GridMathematician.d.ts.map