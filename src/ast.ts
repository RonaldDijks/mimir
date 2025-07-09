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

export interface BinaryExpression {
  type: ExpressionType.BinaryExpression;
  left: Expression;
  right: Expression;
  operator: Token;
}

export interface ParenthesizedExpression {
  type: ExpressionType.ParenthesizedExpression;
  expression: Expression;
}

export interface BooleanLiteralExpression {
  type: ExpressionType.BooleanLiteralExpression;
  value: boolean;
}

export interface NumberLiteralExpression {
  type: ExpressionType.NumberLiteralExpression;
  value: number;
}

export type Expression =
  | UnaryExpression
  | BinaryExpression
  | ParenthesizedExpression
  | BooleanLiteralExpression
  | NumberLiteralExpression;
