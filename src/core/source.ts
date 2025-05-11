import type Span from "@/core/span";

export class Source {
  public constructor(public readonly text: string) {}

  public static fromString(text: string): Source {
    return new Source(text);
  }

  public inBounds(span: Span): boolean {
    return span.start >= 0 && span.end <= this.text.length;
  }

  public slice(span: Span): string {
    if (!this.inBounds(span)) {
      throw new Error("Span out of bounds");
    }
    return this.text.slice(span.start, span.end);
  }
}
