export class LayoutAlgorithmist {
    id = 'layout-algorithmist';
    timeoutMs = 120;
    async run(input) {
        const recipes = [];
        const diagnostics = [];
        const density = input.contentDensity ?? 'balanced';
        const gap = this.resolveGap(input.spacingScale, density);
        const flattened = this.flattenComponents(input.components);
        for (const gridMatrix of input.grids) {
            const recipe = this.generateRecipeForBreakpoint(gridMatrix, flattened, gap);
            recipes.push(recipe);
            diagnostics.push(...recipe.autoPlacementNotes?.map(note => ({
                componentId: '*',
                issue: note,
                resolution: 'Review layout guidance',
            })) ?? []);
        }
        const motionGuidance = this.generateMotionGuidance(flattened, input.motionPreference ?? 'auto');
        return {
            recipes,
            diagnostics,
            motionGuidance,
        };
    }
    flattenComponents(nodes, acc = []) {
        for (const node of nodes) {
            acc.push(node);
            if (node.children?.length) {
                this.flattenComponents(node.children, acc);
            }
        }
        return acc;
    }
    resolveGap(scale, density) {
        const base = scale['4'] ?? 16;
        switch (density) {
            case 'airy':
                return base * 1.5;
            case 'compact':
                return Math.max(base * 0.75, 8);
            default:
                return base;
        }
    }
    generateRecipeForBreakpoint(matrix, components, gap) {
        const columns = matrix.grid.columns;
        const placements = {};
        const notes = [];
        let currentColumn = 0;
        for (const component of components) {
            const desiredSpan = clampSpan(component.prefersColumns ?? this.defaultSpanForType(component.type, columns), columns);
            if (desiredSpan > columns) {
                notes.push(`Component ${component.id} requested span ${desiredSpan}, clamped to ${columns}.`);
            }
            if (currentColumn + desiredSpan > columns) {
                currentColumn = 0;
            }
            placements[component.id] = desiredSpan;
            currentColumn += desiredSpan;
            if (component.breakAfter) {
                currentColumn = 0;
            }
        }
        return {
            breakpoint: matrix.breakpoint,
            display: columns > 1 ? 'grid' : 'flex',
            columns,
            columnSpans: placements,
            flow: columns > 1 ? 'row' : 'column',
            gap: Math.round(gap),
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            autoPlacementNotes: notes,
        };
    }
    defaultSpanForType(type, totalColumns) {
        switch (type) {
            case 'hero':
                return totalColumns;
            case 'card':
                return Math.max(1, Math.floor(totalColumns / 3));
            case 'list':
                return Math.max(1, Math.floor(totalColumns / 2));
            case 'form':
                return Math.max(1, Math.floor(totalColumns / 2));
            case 'cta':
                return Math.max(1, Math.floor(totalColumns / 3));
            default:
                return Math.max(1, Math.floor(totalColumns / 2));
        }
    }
    generateMotionGuidance(components, preference) {
        const guidance = {};
        for (const component of components) {
            if (preference === 'reduced') {
                guidance[component.id] = { easing: 'linear', duration: 120 };
                continue;
            }
            switch (component.type) {
                case 'hero':
                    guidance[component.id] = { easing: 'cubic-bezier(0.22, 1, 0.36, 1)', duration: 420 };
                    break;
                case 'card':
                    guidance[component.id] = { easing: 'cubic-bezier(0.33, 1, 0.68, 1)', duration: 280 };
                    break;
                case 'cta':
                    guidance[component.id] = { easing: 'cubic-bezier(0.16, 1, 0.3, 1)', duration: 220 };
                    break;
                default:
                    guidance[component.id] = { easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)', duration: 260 };
                    break;
            }
        }
        return guidance;
    }
}
function clampSpan(span, max) {
    if (span < 1)
        return 1;
    if (span > max)
        return max;
    return Math.round(span);
}
export function createLayoutAlgorithmist() {
    return new LayoutAlgorithmist();
}
//# sourceMappingURL=LayoutAlgorithmist.js.map