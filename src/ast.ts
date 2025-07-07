import type { Token } from "./token";

export enum ExpressionType {
  BinaryExpression = "BinaryExpression",
  BooleanLiteralExpression = "BooleanLiteralExpression",
  NumberLiteralExpression = "NumberLiteralExpression",
}

export interface BinaryExpression {
  type: ExpressionType.BinaryExpression;
  left: Expression;
  right: Expression;
  operator: Token;
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
  | BinaryExpression
  | BooleanLiteralExpression
  | NumberLiteralExpression;
