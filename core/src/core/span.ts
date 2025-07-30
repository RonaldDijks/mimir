export interface Span {
  start: number;
  end: number;
}

export function createSpan(start: number, end: number): Span {
  return { start, end };
}

export function mergeSpan(a: Span, b: Span): Span {
  return {
    start: Math.min(a.start, b.start),
    end: Math.max(a.end, b.end),
  };
}

export const ZERO: Span = createSpan(0, 0);
