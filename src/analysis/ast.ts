import type Span from "@/core/span";

export type Expression =
  | NumberExpression
  | BooleanExpression
  | BinaryExpression;

export enum ExpressionType {
  Number = "number",
  Boolean = "boolean",
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

export interface BooleanExpression {
  readonly type: ExpressionType.Boolean;
  readonly value: boolean;
  readonly span: Span;
}

export function booleanExpression(
  value: boolean,
  span: Span
): BooleanExpression {
  return { type: ExpressionType.Boolean, value, span };
}

export enum BinaryOperator {
  Addition = "+",
  Subtraction = "-",
  Multiplication = "*",
  Division = "/",
  LogicalAnd = "&&",
  LogicalOr = "||",
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
