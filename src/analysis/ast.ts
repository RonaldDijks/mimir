import type Span from "@/core/span";

export enum ExpressionType {
  Number = "number",
  Boolean = "boolean",
  Identifier = "identifier",
  Assignment = "assignment",
  Binary = "binary",
}

export type Expression =
  | NumberExpression
  | BooleanExpression
  | IdentifierExpression
  | AssignmentExpression
  | BinaryExpression;

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

export interface IdentifierExpression {
  readonly type: ExpressionType.Identifier;
  readonly name: string;
  readonly span: Span;
}

export function identifierExpression(
  name: string,
  span: Span
): IdentifierExpression {
  return { type: ExpressionType.Identifier, name, span };
}

export interface AssignmentExpression {
  readonly type: ExpressionType.Assignment;
  readonly left: IdentifierExpression;
  readonly right: Expression;
  readonly span: Span;
}

export function assignmentExpression(
  left: IdentifierExpression,
  right: Expression,
  span: Span
): AssignmentExpression {
  return { type: ExpressionType.Assignment, left, right, span };
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
