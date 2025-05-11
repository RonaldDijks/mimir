import type Span from "@/core/span";

export type Expression = NumberExpression | BinaryExpression;

export enum ExpressionType {
  Number = "number",
  Binary = "binary",
}

export interface NumberExpression {
  readonly type: ExpressionType.Number;
  readonly value: number;
  readonly span: Span;
}

export function numberExpression(value: number, span: Span): NumberExpression {
  return { type: ExpressionType.Number, value, span };
}

export enum BinaryOperator {
  Plus = "+",
  Minus = "-",
  Asterisk = "*",
  Slash = "/",
}

export interface BinaryExpression {
  readonly type: ExpressionType.Binary;
  readonly left: Expression;
  readonly operator: BinaryOperator;
  readonly right: Expression;
  readonly span: Span;
}

export function binaryExpression(
  left: Expression,
  operator: BinaryOperator,
  right: Expression,
  span: Span
): BinaryExpression {
  return { type: ExpressionType.Binary, left, operator, right, span };
}
