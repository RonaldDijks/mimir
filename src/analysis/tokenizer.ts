import { isAlpha, isNumeric, isWhitespace } from "@/core/char";
import { Source } from "@/core/source";
import type Span from "@/core/span";
import { TokenType, type Token } from "./token";

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
    const c = this.peek();
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
      case "=":
        this.index++;
        return { type: TokenType.Equal, span: this.getSpan() };
      case "&":
        if (this.peek(1) === "&") {
          this.index += 2;
          return { type: TokenType.AmpersandAmpersand, span: this.getSpan() };
        }
        break;
      case "|":
        if (this.peek(1) === "|") {
          this.index += 2;
          return { type: TokenType.PipePipe, span: this.getSpan() };
        }
        break;
      default:
        if (isNumeric(c)) {
          return this.number();
        }

        if (isAlpha(c) || c === "_") {
          return this.identifier();
        }
    }

    this.skipUnknown();
    return { type: TokenType.Unknown, span: this.getSpan() };
  }

  private number(): Token {
    while (isNumeric(this.peek())) {
      this.index++;
    }
    const span = this.getSpan();
    return {
      type: TokenType.Number,
      value: Number(this.source.slice(span)),
      span,
    };
  }

  private identifier(): Token {
    while (isAlpha(this.peek()) || this.peek() === "_") {
      this.index++;
    }
    const span = this.getSpan();
    const text = this.source.slice(span);
    const type = tokenizeIdentifier(text);
    if (type === TokenType.Identifier) {
      return { type, name: text, span };
    } else {
      return { type, span };
    }
  }

  private takeWhile(predicate: (c: string) => boolean): string {
    while (!this.isAtEnd() && predicate(this.peek())) {
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

  private peek(offset = 0): string {
    return this.source.text[this.index + offset] ?? "\0";
  }
}

function tokenizeIdentifier(
  text: string
): TokenType.True | TokenType.False | TokenType.Identifier {
  switch (text) {
    case "true":
      return TokenType.True;
    case "false":
      return TokenType.False;
    default:
      return TokenType.Identifier;
  }
}
