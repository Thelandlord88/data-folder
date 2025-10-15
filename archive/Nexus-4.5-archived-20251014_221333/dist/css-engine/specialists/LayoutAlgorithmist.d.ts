import { Specialist, LayoutPlan, ResponsiveGridMatrix } from '../contracts.js';
interface LayoutAlgorithmistInput {
    components: ComponentNode[];
    grids: ResponsiveGridMatrix[];
    spacingScale: Record<string, number>;
    contentDensity?: 'airy' | 'balanced' | 'compact';
    motionPreference?: 'auto' | 'reduced';
}
export interface ComponentNode {
    id: string;
    type: 'hero' | 'card' | 'list' | 'form' | 'cta' | 'custom';
    priority: 'primary' | 'secondary' | 'supporting';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    prefersColumns?: number;
    alignment?: 'start' | 'center' | 'end' | 'stretch';
    breakAfter?: boolean;
    children?: ComponentNode[];
}
export declare class LayoutAlgorithmist implements Specialist<LayoutAlgorithmistInput, LayoutPlan> {
    readonly id = "layout-algorithmist";
    readonly timeoutMs = 120;
    run(input: LayoutAlgorithmistInput): Promise<LayoutPlan>;
    private flattenComponents;
    private resolveGap;
    private generateRecipeForBreakpoint;
    private defaultSpanForType;
    private generateMotionGuidance;
}
export declare function createLayoutAlgorithmist(): LayoutAlgorithmist;
export {};
//# sourceMappingURL=LayoutAlgorithmist.d.ts.map