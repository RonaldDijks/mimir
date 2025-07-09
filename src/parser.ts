import {
  binaryExpression,
  booleanLiteralExpression,
  numberLiteralExpression,
  parenthesizedExpression,
  unaryExpression,
  type Expression,
} from "./ast";
import { TokenType, type Token } from "./token";

enum Precedence {
  Lowest = 0,
  LogicalOr = 1,
  LogicalAnd = 2,
  Equality = 3,
  Relational = 4,
  Additive = 5,
  Multiplicative = 6,
  Unary = 7,
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

  private binaryExpression(parentPrecedence: Precedence): Expression {
    const unaryPrecedence = unaryOperatorPrecedence(this.current_type());

    let left: Expression;
    if (unaryPrecedence <= parentPrecedence) {
      left = this.primaryExpression();
    } else {
      const operator = this.next_token();
      const right = this.binaryExpression(unaryPrecedence);
      left = unaryExpression(operator, right);
    }

    while (true) {
      const precedence = binaryOperatorPrecedence(this.current_type());
      if (precedence <= parentPrecedence) {
        break;
      }

      const operator = this.next_token();
      const right = this.binaryExpression(precedence);
      left = binaryExpression(left, right, operator);
    }

    return left;
  }

  private primaryExpression(): Expression {
    const token = this.current_token();
    switch (token.type) {
      case TokenType.ParenthesisOpen:
        return this.parenthesizedExpression();
      case TokenType.Number:
        return this.numberLiteralExpression();
      case TokenType.True:
      case TokenType.False:
        return this.booleanLiteralExpression();
      default:
        throw new Error(`Unexpected token: ${token.type}`);
    }
  }

  private parenthesizedExpression(): Expression {
    const parenthesisOpen = this.next_token();
    if (parenthesisOpen.type !== TokenType.ParenthesisOpen) {
      throw new Error(`Unexpected token: ${parenthesisOpen.type}`);
    }
    const expression = this.expression();
    const parenthesisClose = this.next_token();
    if (parenthesisClose.type !== TokenType.ParenthesisClose) {
      throw new Error(`Unexpected token: ${parenthesisClose.type}`);
    }
    return parenthesizedExpression(expression);
  }

  private numberLiteralExpression(): Expression {
    const token = this.next_token();
    if (token.type !== TokenType.Number) {
      throw new Error(`Unexpected token: ${token.type}`);
    }
    return numberLiteralExpression(token.value);
  }

  private booleanLiteralExpression(): Expression {
    const token = this.next_token();
    if (token.type !== TokenType.True && token.type !== TokenType.False) {
      throw new Error(`Unexpected token: ${token.type}`);
    }
    return booleanLiteralExpression(token.type === TokenType.True);
  }
}

function unaryOperatorPrecedence(operator: TokenType): Precedence {
  switch (operator) {
    case TokenType.Bang:
      return Precedence.Unary;
    case TokenType.Minus:
      return Precedence.Unary;
    default:
      return Precedence.Lowest;
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
