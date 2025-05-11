import { isNumeric, isWhitespace } from "@/core/char";
import { Source } from "@/core/source";
import type Span from "@/core/span";

export const enum TokenType {
  Number = "number",

  Plus = "plus",
  Minus = "minus",
  Asterisk = "asterisk",
  Slash = "slash",

  Unknown = "unknown",
  Eof = "eof",
}

export type Token =
  | NumberToken
  | PlusToken
  | MinusToken
  | AsteriskToken
  | SlashToken
  | UnknownToken
  | EofToken;

export interface NumberToken {
  type: TokenType.Number;
  value: number;
  span: Span;
}

export interface PlusToken {
  type: TokenType.Plus;
  span: Span;
}

export interface MinusToken {
  type: TokenType.Minus;
  span: Span;
}

export interface AsteriskToken {
  type: TokenType.Asterisk;
  span: Span;
}

export interface SlashToken {
  type: TokenType.Slash;
  span: Span;
}

export interface UnknownToken {
  type: TokenType.Unknown;
  span: Span;
}

export interface EofToken {
  type: TokenType.Eof;
  span: Span;
}

export class Tokenizer {
  /** The source of the input. */
  private readonly source: Source;
  /** The current index in the input string. */
  private index = 0;
  /** The start index of the current token. */
  private start = 0;

  public constructor(readonly text: string) {
    this.source = Source.fromString(text);
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];
    while (true) {
      const token = this.next();
      tokens.push(token);
      if (token.type === TokenType.Eof) {
        break;
      }
    }
    return tokens;
  }

  public next(): Token {
    this.skipWhitespace();
    this.start = this.index;
    const c = this.current();
    switch (c) {
      case "\0":
        this.index++;
        return { type: TokenType.Eof, span: this.getSpan() };
      case "+":
        this.index++;
        return { type: TokenType.Plus, span: this.getSpan() };
      case "-":
        this.index++;
        return { type: TokenType.Minus, span: this.getSpan() };
      case "*":
        this.index++;
        return { type: TokenType.Asterisk, span: this.getSpan() };
      case "/":
        this.index++;
        return { type: TokenType.Slash, span: this.getSpan() };
      default:
        if (isNumeric(c)) {
          return this.number();
        }

        this.skipUnknown();
        return { type: TokenType.Unknown, span: this.getSpan() };
    }
  }

  private number(): Token {
    while (isNumeric(this.current())) {
      this.index++;
    }
    const span = this.getSpan();
    return {
      type: TokenType.Number,
      value: Number(this.source.slice(span)),
      span,
    };
  }

  private takeWhile(predicate: (c: string) => boolean): string {
    while (!this.isAtEnd() && predicate(this.current())) {
      this.index++;
    }
    return this.source.slice(this.getSpan());
  }

  private isAtEnd(): boolean {
    return this.index >= this.source.text.length;
  }

  private skipWhitespace(): void {
    this.takeWhile(isWhitespace);
  }

  private skipUnknown(): void {
    this.takeWhile((c) => !isWhitespace(c));
  }

  /** Get the span of the current token. */
  private getSpan(): Span {
    return { start: this.start, end: this.index };
  }

  /** Get the current character. */
  private current(): string {
    return this.source.text[this.index] ?? "\0";
  }
}
