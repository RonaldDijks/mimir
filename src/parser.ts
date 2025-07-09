import { ExpressionType, type Expression } from "./ast";
import { TokenType, type Token } from "./token";

enum Precedence {
  Lowest = 0,
  LogicalOr = 1,
  LogicalAnd = 2,
  Equality = 3,
  Relational = 4,
  Additive = 5,
  Multiplicative = 6,
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
    const token = this.current_token();
    switch (token.type) {
      case TokenType.Number:
        return this.numberLiteralExpression();
      case TokenType.True:
      case TokenType.False:
        return this.booleanLiteralExpression();
      default:
        throw new Error("Unexpected token");
    }
  }

  private numberLiteralExpression(): Expression {
    const token = this.next_token();
    if (token.type !== TokenType.Number) {
      throw new Error("Unexpected token");
    }
    return {
      type: ExpressionType.NumberLiteralExpression,
      value: token.value,
    };
  }

  private booleanLiteralExpression(): Expression {
    const token = this.next_token();
    if (token.type !== TokenType.True && token.type !== TokenType.False) {
      throw new Error("Unexpected token");
    }
    return {
      type: ExpressionType.BooleanLiteralExpression,
      value: token.type === TokenType.True,
    };
  }
}

function binaryOperatorPrecedence(operator: TokenType): Precedence {
  switch (operator) {
    case TokenType.PipePipe:
      return Precedence.LogicalOr;
    case TokenType.AmpersandAmpersand:
      return Precedence.LogicalAnd;
    case TokenType.Plus:
      return Precedence.Additive;
    case TokenType.Minus:
      return Precedence.Additive;
    case TokenType.Asterisk:
      return Precedence.Multiplicative;
    case TokenType.Slash:
      return Precedence.Multiplicative;
    case TokenType.EqualsEquals:
      return Precedence.Equality;
    case TokenType.BangEquals:
      return Precedence.Equality;
    case TokenType.LessThan:
      return Precedence.Relational;
    case TokenType.LessThanEquals:
      return Precedence.Relational;
    case TokenType.GreaterThan:
      return Precedence.Relational;
    case TokenType.GreaterThanEquals:
      return Precedence.Relational;
    default:
      return Precedence.Lowest;
  }
}
