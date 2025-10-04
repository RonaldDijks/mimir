import { createSpan } from "../core/span";
import { Diagnostic } from "./diagnostic";
import { keyword, type Token, TokenType } from "./token";

export function tokenize(input: string): Token[] {
  const tokenizer = new Tokenizer(input);
  const tokens = tokenizer.all();
  return tokens;
}

export class Tokenizer {
  private start: number = 0;
  private current: number = 0;

  public constructor(private readonly input: string) {}

  private peek(offset = 0): string {
    const index = this.current + offset;
    const char = this.input[index];
    if (char === undefined) {
      return "\0";
    }
    return char;
  }

  public next(): Token {
    while (isWhitespace(this.peek())) {
      this.current++;
    }

    this.start = this.current;

    let type: TokenType;
    switch (this.peek()) {
      case "+":
        if (this.peek(1) === "+") {
          type = TokenType.PlusPlus;
          this.current += 2;
          break;
        }
        type = TokenType.Plus;
        this.current++;
        break;
      case "-":
        type = TokenType.Minus;
        this.current++;
        break;
      case "*":
        type = TokenType.Asterisk;
        this.current++;
        break;
      case "/":
        type = TokenType.Slash;
        this.current++;
        break;
      case "&":
        if (this.peek(1) === "&") {
          type = TokenType.AmpersandAmpersand;
          this.current += 2;
          break;
        }
        type = TokenType.Unknown;
        this.current++;
        break;
      case "|":
        if (this.peek(1) === "|") {
          type = TokenType.PipePipe;
          this.current += 2;
          break;
        }
        type = TokenType.Unknown;
        this.current++;
        break;
      case "=":
        if (this.peek(1) === "=") {
          type = TokenType.EqualsEquals;
          this.current += 2;
          break;
        }
        type = TokenType.Equals;
        this.current++;
        break;
      case "!":
        if (this.peek(1) === "=") {
          type = TokenType.BangEquals;
          this.current += 2;
          break;
        }
        type = TokenType.Bang;
        this.current++;
        break;
      case "<":
        if (this.peek(1) === "=") {
          type = TokenType.LessThanEquals;
          this.current += 2;
          break;
        }
        type = TokenType.LessThan;
        this.current++;
        break;
      case ">":
        if (this.peek(1) === "=") {
          type = TokenType.GreaterThanEquals;
          this.current += 2;
          break;
        }
        type = TokenType.GreaterThan;
        this.current++;
        break;
      case "(":
        type = TokenType.ParenthesisOpen;
        this.current++;
        break;
      case ")":
        type = TokenType.ParenthesisClose;
        this.current++;
        break;
      case "{":
        type = TokenType.BraceOpen;
        this.current++;
        break;
      case "}":
        type = TokenType.BraceClose;
        this.current++;
        break;
      case '"':
        return this.string();

      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        return this.number();

      case "\0":
        return {
          type: TokenType.EndOfFile,
          text: "\0",
          span: createSpan(this.current, this.current),
        };

      default:
        if (this.peek().match(/[a-z_]/i)) {
          return this.keyword();
        } else {
          type = TokenType.Unknown;
          this.current++;
          while (true) {
            const peek = this.peek();
            if (peek === "\0" || !peek.match(/[a-z]/i)) {
              break;
            }
            this.current++;
          }
        }

        break;
    }

    return {
      type,
      text: this.input.slice(this.start, this.current),
      span: createSpan(this.start, this.current),
    };
  }

  private number(): Token {
    const start = this.current;
    while (
      this.current < this.input.length &&
      this.peek() >= "0" &&
      this.peek() <= "9"
    ) {
      this.current++;
    }

    const value = parseInt(this.input.slice(start, this.current));

    return {
      type: TokenType.Number,
      text: this.input.slice(start, this.current),
      span: createSpan(start, this.current),
      value,
    };
  }

  private string(): Token {
    const start = this.current;
    this.current++;
    while (true) {
      const peek = this.peek();
      if (peek === "\0") {
        const stringSpan = createSpan(start, this.current);
        throw new Diagnostic("Unterminated string literal", stringSpan);
      }
      if (peek === '"') {
        break;
      }
      this.current++;
    }
    this.current++;
    const value = this.input.slice(start + 1, this.current - 1);
    return {
      type: TokenType.StringLiteral,
      text: this.input.slice(start, this.current),
      span: createSpan(start, this.current),
      value,
    };
  }

  private keyword(): Token {
    const start = this.current;
    while (this.peek().match(/[a-z0-9_]/i)) {
      this.current++;
    }
    const type = keyword(this.input.slice(start, this.current));
    return {
      type,
      text: this.input.slice(start, this.current),
      span: createSpan(start, this.current),
    };
  }

  public all(): Token[] {
    const tokens: Token[] = [];

    while (true) {
      const token = this.next();
      tokens.push(token);
      if (token.type === TokenType.EndOfFile) {
        break;
      }
    }

    return tokens;
  }
}

function isWhitespace(char: string): boolean {
  return char === " " || char === "\n" || char === "\r" || char === "\t";
}
