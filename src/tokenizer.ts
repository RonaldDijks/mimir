import { span } from "./span";
import { TokenType, type Token } from "./token";

export function tokenize(input: string): Token[] {
  const tokenizer = new Tokenizer(input);
  const tokens = tokenizer.all();
  return tokens;
}

export class Tokenizer {
  private current: number = 0;

  public constructor(private readonly input: string) {}

  public next(): Token {
    while (this.input[this.current] === " ") {
      this.current++;
    }

    const current = this.input[this.current];
    const start = this.current;

    let type: TokenType;
    switch (current) {
      case "+":
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

      case undefined:
        return {
          type: TokenType.EndOfFile,
          text: "\0",
          span: span(this.current, this.current),
        };

      default:
        type = TokenType.Unknown;
        this.current++;
        break;
    }

    return { type, text: current!, span: span(start, start + 1) };
  }

  private number(): Token {
    const start = this.current;
    while (
      this.current < this.input.length &&
      this.input[this.current]! >= "0" &&
      this.input[this.current]! <= "9"
    ) {
      this.current++;
    }

    const value = parseInt(this.input.slice(start, this.current));

    return {
      type: TokenType.Number,
      text: this.input.slice(start, this.current),
      span: span(start, this.current),
      value,
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
