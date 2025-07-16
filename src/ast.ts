import type { IdentifierToken, Token } from "./token";

export type Statement = ExpressionStatement | LetStatement;

export enum StatementType {
  ExpressionStatement = "ExpressionStatement",
  LetStatement = "LetStatement",
}

export interface ExpressionStatement {
  type: StatementType.ExpressionStatement;
  expression: Expression;
}

export function expressionStatement(
  expression: Expression
): ExpressionStatement {
  return { type: StatementType.ExpressionStatement, expression };
}

export interface LetStatement {
  type: StatementType.LetStatement;
  mut: boolean;
  name: Token;
  value: Expression;
}

export function letStatement(
  mut: boolean,
  name: Token,
  value: Expression
): LetStatement {
  return { type: StatementType.LetStatement, mut, name, value };
}

export type Expression =
  | AssignmentExpression
  | UnaryExpression
  | BinaryExpression
  | IdentifierExpression
  | ParenthesizedExpression
  | BooleanLiteralExpression
  | NumberLiteralExpression;

export enum ExpressionType {
  AssignmentExpression = "AssignmentExpression",
  UnaryExpression = "UnaryExpression",
  BinaryExpression = "BinaryExpression",
  IdentifierExpression = "IdentifierExpression",
  ParenthesizedExpression = "ParenthesizedExpression",
  BooleanLiteralExpression = "BooleanLiteralExpression",
  NumberLiteralExpression = "NumberLiteralExpression",
}

export interface AssignmentExpression {
  type: ExpressionType.AssignmentExpression;
  left: IdentifierToken;
  right: Expression;
}

export function assignmentExpression(
  left: IdentifierToken,
  right: Expression
): AssignmentExpression {
  return { type: ExpressionType.AssignmentExpression, left, right };
}

export interface UnaryExpression {
  type: ExpressionType.UnaryExpression;
  operator: Token;
  right: Expression;
}

export function unaryExpression(
  operator: Token,
  right: Expression
): UnaryExpression {
  return { type: ExpressionType.UnaryExpression, operator, right };
}

export interface BinaryExpression {
  type: ExpressionType.BinaryExpression;
  left: Expression;
  right: Expression;
  operator: Token;
}

export function binaryExpression(
  left: Expression,
  right: Expression,
  operator: Token
): BinaryExpression {
  return { type: ExpressionType.BinaryExpression, left, right, operator };
}

export interface IdentifierExpression {
  type: ExpressionType.IdentifierExpression;
  name: IdentifierToken;
}

export function identifierExpression(
  name: IdentifierToken
): IdentifierExpression {
  return { type: ExpressionType.IdentifierExpression, name };
}

export interface ParenthesizedExpression {
  type: ExpressionType.ParenthesizedExpression;
  expression: Expression;
}

export function parenthesizedExpression(
  expression: Expression
): ParenthesizedExpression {
  return { type: ExpressionType.ParenthesizedExpression, expression };
}

export interface BooleanLiteralExpression {
  type: ExpressionType.BooleanLiteralExpression;
  value: boolean;
}

export function booleanLiteralExpression(
  value: boolean
): BooleanLiteralExpression {
  return { type: ExpressionType.BooleanLiteralExpression, value };
}

export interface NumberLiteralExpression {
  type: ExpressionType.NumberLiteralExpression;
  value: number;
}

export function numberLiteralExpression(
  value: number
): NumberLiteralExpression {
  return { type: ExpressionType.NumberLiteralExpression, value };
}
