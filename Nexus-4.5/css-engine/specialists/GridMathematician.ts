import { Specialist, GridComputation, ResponsiveGridMatrix } from '../contracts.js';

interface GridMathematicianInput {
  breakpoints: Record<string, number>;
  preferredColumns?: number[];
  ratio?: 'golden' | 'perfectFourth' | 'harmonic';
  baseUnit?: number;
  containerWidths?: Record<string, number>;
}

function snapToUnit(value: number, unit: number): number {
  if (unit <= 0) return value;
  return Math.round(value / unit) * unit;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export class GridMathematician implements Specialist<GridMathematicianInput, GridComputation> {
  readonly id = 'grid-mathematician';
  readonly timeoutMs = 80;

  async run(input: GridMathematicianInput): Promise<GridComputation> {
    const baseUnit = input.baseUnit ?? 8;
    const ratio = input.ratio ?? 'golden';
    const preferredColumns = input.preferredColumns?.length ? input.preferredColumns : [4, 8, 12];
    const diagnostics: string[] = [];

    const sortedBreakpoints = Object.entries(input.breakpoints)
      .sort(([, a], [, b]) => a - b);

    const responsiveGrids: ResponsiveGridMatrix[] = [];

    for (const [breakpoint, width] of sortedBreakpoints) {
      const containerWidth = input.containerWidths?.[breakpoint] ?? width;
      const grid = this.calculateGridForWidth(containerWidth, preferredColumns, baseUnit, ratio, diagnostics, breakpoint);
      responsiveGrids.push({
        breakpoint,
        containerWidth,
        grid,
      });
    }

    const contentWidthRecommendations: Record<string, number> = {};
    for (const matrix of responsiveGrids) {
      const usable = matrix.grid.columnWidth * matrix.grid.columns + matrix.grid.gutterWidth * (matrix.grid.columns - 1);
      contentWidthRecommendations[matrix.breakpoint] = Math.round(usable);
    }

    const aspectRatios: Record<string, string> = {
      square: '1:1',
      widescreen: '16:9',
      portrait: '3:4',
      golden: '1:1.618',
      ultrawide: '21:9',
    };

    return {
      grids: responsiveGrids,
      aspectRatios,
      contentWidthRecommendations,
      diagnostics,
    };
  }

  private calculateGridForWidth(
    containerWidth: number,
    preferredColumns: number[],
    baseUnit: number,
    ratio: 'golden' | 'perfectFourth' | 'harmonic',
    diagnostics: string[],
    breakpoint: string,
  ) {
    const minCol = 60;
    const maxCol = 120;
    const margin = snapToUnit(Math.max(baseUnit * 2, containerWidth * 0.04), baseUnit);
    const gutter = snapToUnit(baseUnit * 2, baseUnit);

    let chosenColumns = preferredColumns[0];
    let chosenWidth = 0;

    for (const columns of preferredColumns) {
      const candidate = (containerWidth - margin * 2 - gutter * (columns - 1)) / columns;
      const widthPx = Math.floor(candidate * 100) / 100;

      if (widthPx >= minCol && widthPx <= maxCol) {
        chosenColumns = columns;
        chosenWidth = widthPx;
        break;
      }

      if (chosenWidth === 0 || Math.abs(widthPx - (minCol + maxCol) / 2) < Math.abs(chosenWidth - (minCol + maxCol) / 2)) {
        chosenColumns = columns;
        chosenWidth = widthPx;
      }
    }

    if (chosenWidth < minCol || chosenWidth > maxCol) {
      diagnostics.push(`Breakpoint ${breakpoint}: adjusted columns to ${chosenColumns} for readability (width ${chosenWidth.toFixed(2)}px).`);
      chosenWidth = clamp(chosenWidth, minCol, maxCol);
    }

    return {
      columns: chosenColumns,
      columnWidth: Math.round(chosenWidth * 100) / 100,
      gutterWidth: gutter,
      marginWidth: margin,
      ratioUsed: ratio,
    };
  }
}

export function createGridMathematician(): GridMathematician {
  return new GridMathematician();
}
