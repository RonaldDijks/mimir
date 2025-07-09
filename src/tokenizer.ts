import { span } from "./span";
import { keyword, TokenType, type Token } from "./token";

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
    if (index >= this.input.length) {
      return "\0";
    }
    return this.input[index]!;
  }

  public next(): Token {
    while (this.input[this.current] === " ") {
      this.current++;
    }

    this.start = this.current;

    let type: TokenType;
    switch (this.peek()) {
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
        type = TokenType.Unknown;
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
        console.log(this.peek(1));
        if (this.peek(1) === "=") {
          console.log("greater than equals");
          type = TokenType.GreaterThanEquals;
          this.current += 2;
          break;
        }
        type = TokenType.GreaterThan;
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

      case "\0":
        return {
          type: TokenType.EndOfFile,
          text: "\0",
          span: span(this.current, this.current),
        };

      default:
        if (this.peek().match(/[a-z]/i)) {
          while (this.peek().match(/[a-z]/i)) {
            this.current++;
          }
          type = keyword(this.input.slice(this.start, this.current));
          break;
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
      span: span(this.start, this.current),
    };
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
