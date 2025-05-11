export default interface Span {
  start: number;
  end: number;
}

export function merge(a: Span, b: Span): Span {
  return { start: Math.min(a.start, b.start), end: Math.max(a.end, b.end) };
}
