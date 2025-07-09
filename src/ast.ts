import type { Token } from "./token";

export enum ExpressionType {
  UnaryExpression = "UnaryExpression",
  BinaryExpression = "BinaryExpression",
  ParenthesizedExpression = "ParenthesizedExpression",
  BooleanLiteralExpression = "BooleanLiteralExpression",
  NumberLiteralExpression = "NumberLiteralExpression",
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

export type Expression =
  | UnaryExpression
  | BinaryExpression
  | ParenthesizedExpression
  | BooleanLiteralExpression
  | NumberLiteralExpression;
