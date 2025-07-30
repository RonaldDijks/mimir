import type { Span } from "../core/span";

export class Diagnostic extends Error {
  public constructor(
    message: string,
    public readonly span: Span,
  ) {
    super(message);
  }
}
