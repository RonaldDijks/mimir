import {
  assignmentExpression,
  binaryExpression,
  booleanLiteralExpression,
  expressionStatement,
  identifierExpression,
  letStatement,
  numberLiteralExpression,
  parenthesizedExpression,
  sourceFile,
  unaryExpression,
  type Expression,
  type ExpressionStatement,
  type LetStatement,
  type SourceFile,
  type Statement,
} from "./ast";
import {
  TokenType,
  type Token,
  type NumberToken,
  type IdentifierToken,
} from "./token";

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

  private expectToken<Type extends TokenType>(
    expected: Type
  ): Extract<Token, { type: Type }> {
    const token = this.current_token();
    if (token.type !== expected) {
      throw new Error(
        `Expected ${expected}, got ${token.type} at position ${token.span.start}`
      );
    }
    return this.next_token() as Extract<Token, { type: Type }>;
  }

  private next_token(): Token {
    const current = this.current_token();
    this.index++;
    return current;
  }

  public parse(): SourceFile {
    const statements: Statement[] = [];
    while (this.peek().type !== TokenType.EndOfFile) {
      statements.push(this.statement());
    }
    const endOfFile = this.expectToken(TokenType.EndOfFile);
    return sourceFile(statements, endOfFile);
  }

  private statement(): Statement {
    switch (this.peek().type) {
      case TokenType.Let:
        return this.letStatement();
      default:
        return this.expressionStatement();
    }
  }

  private expressionStatement(): ExpressionStatement {
    const expression = this.expression();
    return expressionStatement(expression);
  }

  private expression(): Expression {
    return this.assignmentExpression();
  }

  private assignmentExpression(): Expression {
    if (
      this.peek().type === TokenType.Identifier &&
      this.peek(1).type === TokenType.Equals
    ) {
      const left = this.expectToken(TokenType.Identifier);
      const _equalsToken = this.expectToken(TokenType.Equals);
      const right = this.expression();
      return assignmentExpression(left, right);
    } else {
      return this.binaryExpression(Precedence.Lowest);
    }
  }

  private letStatement(): LetStatement {
    const _letToken = this.expectToken(TokenType.Let);
    const mutToken =
      this.peek().type === TokenType.Mut
        ? this.expectToken(TokenType.Mut)
        : null;
    const identifier = this.expectToken(TokenType.Identifier);
    const _equalsToken = this.expectToken(TokenType.Equals);
    const expression = this.expression();
    return letStatement(mutToken !== null, identifier, expression);
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
      case TokenType.Identifier:
        return this.identifierExpression();
      default:
        throw new Error(`Unexpected token: ${token.type}`);
    }
  }

  private parenthesizedExpression(): Expression {
    this.expectToken(TokenType.ParenthesisOpen);
    const expression = this.expression();
    this.expectToken(TokenType.ParenthesisClose);
    return parenthesizedExpression(expression);
  }

  private numberLiteralExpression(): Expression {
    const token = this.expectToken(TokenType.Number) as NumberToken;
    return numberLiteralExpression(token.value);
  }

  private booleanLiteralExpression(): Expression {
    const token = this.next_token();
    if (token.type !== TokenType.True && token.type !== TokenType.False) {
      throw new Error(
        `Expected boolean literal, got ${token.type} at position ${token.span.start}`
      );
    }
    return booleanLiteralExpression(token.type === TokenType.True);
  }

  private identifierExpression(): Expression {
    const token = this.expectToken(TokenType.Identifier) as IdentifierToken;
    return identifierExpression(token);
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
