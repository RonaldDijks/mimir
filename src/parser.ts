import { ExpressionType, type Expression } from "./ast";
import { TokenType, type Token } from "./token";

enum Precedence {
  Lowest = 0,
  Addition = 1,
  Multiplication = 2,
}

export function parse(tokens: Token[]) {
  const parser = new Parser(tokens);
  return parser.parse();
}

export class Parser {
  private index: number = 0;

  public constructor(private readonly tokens: Token[]) {}

  public parse(): Expression {
    return this.expression();
  }

  private peek(offset: number = 0): Token {
    const index = this.index + offset;
    if (index >= this.tokens.length) {
      return this.tokens[this.tokens.length - 1]!;
    }
    return this.tokens[index]!;
  }

  private current_token(): Token {
    return this.peek();
  }

  private current_type(): TokenType {
    return this.current_token().type;
  }

  private next_token(): Token {
    const current = this.current_token();
    this.index++;
    return current;
  }

  private expression(): Expression {
    return this.binaryExpression(Precedence.Lowest);
  }

  private binaryExpression(parent_precedence: Precedence): Expression {
    let left: Expression = this.primaryExpression();

    while (true) {
      const precedence = binaryOperatorPrecedence(this.current_type());
      if (precedence <= parent_precedence) {
        break;
      }

      const operator = this.next_token();
      const right = this.binaryExpression(precedence);
      left = {
        type: ExpressionType.BinaryExpression,
        left,
        right,
        operator,
      };
    }

    return left;
  }

  private primaryExpression(): Expression {
    const token = this.next_token();
    if (token.type === TokenType.Number) {
      return {
        type: ExpressionType.NumberLiteralExpression,
        value: token.value,
      };
    }
    throw new Error("Unexpected token");
  }
}

function binaryOperatorPrecedence(operator: TokenType): Precedence {
  switch (operator) {
    case TokenType.Plus:
      return Precedence.Addition;
    case TokenType.Minus:
      return Precedence.Addition;
    case TokenType.Asterisk:
      return Precedence.Multiplication;
    case TokenType.Slash:
      return Precedence.Multiplication;
    default:
      return Precedence.Lowest;
  }
}
