import { createSpan, mergeSpan } from "../core/span";
import {
  assignmentExpression,
  type Block,
  type BlockExpression,
  binaryExpression,
  booleanLiteralExpression,
  type Expression,
  type ExpressionStatement,
  ExpressionType,
  expressionStatement,
  type IfExpression,
  identifierExpression,
  ifExpression,
  type LetStatement,
  letStatement,
  numberLiteralExpression,
  parenthesizedExpression,
  type SourceFile,
  type Statement,
  sourceFile,
  stringLiteralExpression,
  unaryExpression,
} from "./ast";
import { Diagnostic } from "./diagnostic";
import { type NumberToken, type Token, TokenType } from "./token";

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
      // biome-ignore lint/style/noNonNullAssertion: last token
      return this.tokens[this.tokens.length - 1]!;
    }
    // biome-ignore lint/style/noNonNullAssertion: current token
    return this.tokens[index]!;
  }

  private current_token(): Token {
    return this.peek();
  }

  private current_type(): TokenType {
    return this.current_token().type;
  }

  private expectToken<Type extends TokenType>(
    expected: Type,
  ): Extract<Token, { type: Type }> {
    const token = this.current_token();
    if (token.type !== expected) {
      throw new Diagnostic(
        `Expected ${expected}, got ${token.type} at position ${token.span.start}`,
        token.span,
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
      const span = mergeSpan(left.span, right.span);
      return assignmentExpression(left, right, span);
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
      const span = mergeSpan(operator.span, right.span);
      left = unaryExpression(operator, right, span);
    }

    while (true) {
      const precedence = binaryOperatorPrecedence(this.current_type());
      if (precedence <= parentPrecedence) {
        break;
      }

      const operator = this.next_token();
      const right = this.binaryExpression(precedence);
      const span = mergeSpan(left.span, right.span);
      left = binaryExpression(left, right, operator, span);
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
      case TokenType.StringLiteral:
        return this.stringLiteralExpression();
      case TokenType.If:
        return this.ifExpression();
      default:
        throw new Diagnostic(`Unexpected token: ${token.type}`, token.span);
    }
  }

  private parenthesizedExpression(): Expression {
    const parenthesisOpen = this.expectToken(TokenType.ParenthesisOpen);
    const expression = this.expression();
    const parenthesisClose = this.expectToken(TokenType.ParenthesisClose);
    const span = mergeSpan(parenthesisOpen.span, parenthesisClose.span);
    return parenthesizedExpression(expression, span);
  }

  private numberLiteralExpression(): Expression {
    const token = this.expectToken(TokenType.Number) as NumberToken;
    return numberLiteralExpression(token.value, token.span);
  }

  private booleanLiteralExpression(): Expression {
    const token = this.next_token();
    if (token.type !== TokenType.True && token.type !== TokenType.False) {
      throw new Diagnostic(
        `Expected boolean literal, got ${token.type} at position ${token.span.start}`,
        token.span,
      );
    }
    return booleanLiteralExpression(token.type === TokenType.True, token.span);
  }

  private identifierExpression(): Expression {
    const token = this.expectToken(TokenType.Identifier);
    return identifierExpression(token, token.span);
  }

  private stringLiteralExpression(): Expression {
    const token = this.expectToken(TokenType.StringLiteral);
    return stringLiteralExpression(token.value, token.span);
  }

  private ifExpression(): IfExpression {
    const _ifToken = this.expectToken(TokenType.If);
    const condition = this.expression();

    const then_branch = this.block();

    let else_branch: IfExpression | BlockExpression | null = null;
    if (this.peek().type === TokenType.Else) {
      const _elseToken = this.expectToken(TokenType.Else);
      if (this.peek().type === TokenType.If) {
        else_branch = this.ifExpression();
      } else {
        const elseBlock = this.block();
        const current = this.index;
        const _span = createSpan(_elseToken.span.start, current);
        else_branch = {
          type: ExpressionType.BlockExpression,
          block: elseBlock,
          span: mergeSpan(_elseToken.span, _span),
        };
      }
    }

    return ifExpression(condition, then_branch, else_branch, _ifToken.span);
  }

  private block(): Block {
    const _openBrace = this.expectToken(TokenType.BraceOpen);
    const statements: Statement[] = [];
    while (this.peek().type !== TokenType.BraceClose) {
      statements.push(this.statement());
    }
    const _closeBrace = this.expectToken(TokenType.BraceClose);
    return { statements };
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
    case TokenType.PlusPlus:
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
