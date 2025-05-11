import { TokenType, type Token } from "@/analysis/token";
import {
  binaryExpression,
  BinaryOperator,
  booleanExpression,
  identifierExpression,
  numberExpression,
  assignmentExpression,
  type Expression,
  type IdentifierExpression,
} from "@/analysis/ast";
import { merge } from "@/core/span";

function tokenToOperator(token: Token): BinaryOperator | undefined {
  switch (token.type) {
    case TokenType.Plus:
      return BinaryOperator.Addition;
    case TokenType.Minus:
      return BinaryOperator.Subtraction;
    case TokenType.Asterisk:
      return BinaryOperator.Multiplication;
    case TokenType.Slash:
      return BinaryOperator.Division;
    case TokenType.AmpersandAmpersand:
      return BinaryOperator.LogicalAnd;
    case TokenType.PipePipe:
      return BinaryOperator.LogicalOr;
    default:
      return undefined;
  }
}
enum Precedence {
  Lowest = 0,
  Additive = 1,
  Multiplicative = 2,
  Logical = 3,
}

function precedence(operator: BinaryOperator): Precedence {
  switch (operator) {
    case BinaryOperator.Addition:
    case BinaryOperator.Subtraction:
      return Precedence.Additive;
    case BinaryOperator.Multiplication:
    case BinaryOperator.Division:
      return Precedence.Multiplicative;
    case BinaryOperator.LogicalAnd:
    case BinaryOperator.LogicalOr:
      return Precedence.Logical;
    default:
      return Precedence.Lowest;
  }
}

export class Parser {
  private current = 0;
  public constructor(private tokens: ReadonlyArray<Token>) {}

  private peek(offset = 0): Token {
    const index = this.current + offset;
    if (index >= this.tokens.length) {
      return this.tokens[this.tokens.length - 1]!;
    }
    return this.tokens[index]!;
  }

  private consume(): Token {
    const token = this.peek();
    this.current++;
    return token;
  }

  public parse(): Expression {
    return this.expression();
  }

  private expression(): Expression {
    return this.assignmentExpression();
  }

  private assignmentExpression(): Expression {
    const left = this.binaryExpression();

    // Check if the next token is an equals sign
    if (this.peek().type === TokenType.Equal) {
      // Only identifiers can be on the left side of an assignment
      if (left.type !== "identifier") {
        throw new Error("Left side of assignment must be an identifier");
      }

      // Consume the equals token
      const equalToken = this.consume();

      // Parse the right side of the assignment
      const right = this.assignmentExpression();

      // Create span covering the entire assignment expression
      const span = merge(left.span, right.span);

      // Return the assignment expression
      return assignmentExpression(left as IdentifierExpression, right, span);
    }

    return left;
  }

  private binaryExpression(
    previousPrecedence: Precedence = Precedence.Lowest
  ): Expression {
    let left: Expression = this.primary();
    while (true) {
      const operator = tokenToOperator(this.peek());
      if (!operator) {
        break;
      }
      const operatorPrecedence = precedence(operator);
      if (operatorPrecedence <= previousPrecedence) {
        break;
      }
      this.consume();
      const right = this.binaryExpression(operatorPrecedence);
      const span = merge(left.span, right.span);
      left = binaryExpression(left, operator, right, span);
    }
    return left;
  }

  private primary(): Expression {
    const token = this.consume();
    if (token.type === TokenType.Number) {
      return numberExpression(token.value, token.span);
    } else if (token.type === TokenType.True) {
      return booleanExpression(true, token.span);
    } else if (token.type === TokenType.False) {
      return booleanExpression(false, token.span);
    } else if (token.type === TokenType.Identifier) {
      return identifierExpression(token.name, token.span);
    } else {
      throw new Error(`Unexpected token: ${token.type}`);
    }
  }
}
