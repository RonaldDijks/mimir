import type { Token } from "./token";

export enum ExpressionType {
  BinaryExpression = "BinaryExpression",
  NumberLiteralExpression = "NumberLiteralExpression",
}

export interface BinaryExpression {
  type: ExpressionType.BinaryExpression;
  left: Expression;
  right: Expression;
  operator: Token;
}

export interface NumberLiteralExpression {
  type: ExpressionType.NumberLiteralExpression;
  value: number;
}

export type Expression = BinaryExpression | NumberLiteralExpression;
