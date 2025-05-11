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
  expressionStatement,
  type Statement,
  declarationStatement,
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

  private match(type: TokenType): boolean {
    if (this.peek().type === type) {
      this.consume();
      return true;
    }
    return false;
  }

  private expectSemicolon(): void {
    if (!this.match(TokenType.Semicolon)) {
      throw new Error("Expected semicolon after expression");
    }
  }

  private expectEof(): void {
    if (this.peek().type !== TokenType.Eof) {
      throw new Error("Unexpected tokens after expression");
    }
  }

  public parse(): Statement {
    const stmt = this.statement();
    this.expectEof();
    return stmt;
  }

  private statement(): Statement {
    if (this.peek().type === TokenType.Let) {
      return this.letStatement();
    }
    return this.expressionStatement();
  }

  private letStatement(): Statement {
    const peek = this.peek();
    if (peek.type !== TokenType.Let) {
      throw new Error("Expected let keyword");
    }
    this.consume();
    const mut = this.match(TokenType.Mut);
    const identifier = this.identifierExpression();
    this.match(TokenType.Equal);
    const expression = this.expression();
    const span = merge(peek.span, expression.span);
    const stmt = declarationStatement(identifier, mut, expression, span);
    return stmt;
  }

  private expressionStatement(): Statement {
    const expr = this.expression();
    return expressionStatement(expr, expr.span);
  }

  private expression(): Expression {
    const expr = this.assignmentExpression();
    this.expectSemicolon();
    return expr;
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

  private identifierExpression(): IdentifierExpression {
    const token = this.peek();
    if (token.type !== TokenType.Identifier) {
      throw new Error("Expected identifier but got " + token.type);
    }
    this.consume();
    return identifierExpression(token.name, token.span);
  }
}
