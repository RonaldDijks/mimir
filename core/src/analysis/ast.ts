import type { Span } from "../core/span";
import type { EndOfFileToken, IdentifierToken, Token } from "./token";

export interface SourceFile {
  statements: Statement[];
  endOfFile: EndOfFileToken;
}

export function sourceFile(
  statements: Statement[],
  endOfFile: EndOfFileToken,
): SourceFile {
  return { statements, endOfFile };
}

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
  expression: Expression,
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
  value: Expression,
): LetStatement {
  return { type: StatementType.LetStatement, mut, name, value };
}

export type Expression =
  | AssignmentExpression
  | UnaryExpression
  | BinaryExpression
  | IdentifierExpression
  | ParenthesizedExpression
  | BlockExpression
  | IfExpression
  | BooleanLiteralExpression
  | NumberLiteralExpression
  | StringLiteralExpression;

export enum ExpressionType {
  AssignmentExpression = "AssignmentExpression",
  UnaryExpression = "UnaryExpression",
  BinaryExpression = "BinaryExpression",
  IdentifierExpression = "IdentifierExpression",
  ParenthesizedExpression = "ParenthesizedExpression",
  BlockExpression = "BlockExpression",
  IfExpression = "IfExpression",
  BooleanLiteralExpression = "BooleanLiteralExpression",
  NumberLiteralExpression = "NumberLiteralExpression",
  StringLiteralExpression = "StringLiteralExpression",
}

export interface AssignmentExpression {
  type: ExpressionType.AssignmentExpression;
  left: IdentifierToken;
  right: Expression;
  span: Span;
}

export function assignmentExpression(
  left: IdentifierToken,
  right: Expression,
  span: Span,
): AssignmentExpression {
  return { type: ExpressionType.AssignmentExpression, left, right, span };
}

export interface UnaryExpression {
  type: ExpressionType.UnaryExpression;
  operator: Token;
  right: Expression;
  span: Span;
}

export function unaryExpression(
  operator: Token,
  right: Expression,
  span: Span,
): UnaryExpression {
  return { type: ExpressionType.UnaryExpression, operator, right, span };
}

export interface BinaryExpression {
  type: ExpressionType.BinaryExpression;
  left: Expression;
  right: Expression;
  operator: Token;
  span: Span;
}

export function binaryExpression(
  left: Expression,
  right: Expression,
  operator: Token,
  span: Span,
): BinaryExpression {
  return { type: ExpressionType.BinaryExpression, left, right, operator, span };
}

export interface IdentifierExpression {
  type: ExpressionType.IdentifierExpression;
  name: IdentifierToken;
  span: Span;
}

export function identifierExpression(
  name: IdentifierToken,
  span: Span,
): IdentifierExpression {
  return { type: ExpressionType.IdentifierExpression, name, span };
}

export interface ParenthesizedExpression {
  type: ExpressionType.ParenthesizedExpression;
  expression: Expression;
  span: Span;
}

export function parenthesizedExpression(
  expression: Expression,
  span: Span,
): ParenthesizedExpression {
  return { type: ExpressionType.ParenthesizedExpression, expression, span };
}

export interface BlockExpression {
  type: ExpressionType.BlockExpression;
  block: Block;
  span: Span;
}

export function blockExpression(
  statements: Statement[],
  span: Span,
): BlockExpression {
  return { type: ExpressionType.BlockExpression, block: { statements }, span };
}

export interface Block {
  statements: Statement[];
}

export interface IfExpression {
  type: ExpressionType.IfExpression;
  condition: Expression;
  then_branch: Block;
  else_branch?: IfExpression | BlockExpression | null;
  span: Span;
}

export function ifExpression(
  condition: Expression,
  then_branch: Block,
  else_branch: IfExpression | BlockExpression | null,
  span: Span,
): IfExpression {
  return {
    type: ExpressionType.IfExpression,
    condition,
    then_branch,
    else_branch,
    span,
  };
}

export interface BooleanLiteralExpression {
  type: ExpressionType.BooleanLiteralExpression;
  value: boolean;
  span: Span;
}

export function booleanLiteralExpression(
  value: boolean,
  span: Span,
): BooleanLiteralExpression {
  return { type: ExpressionType.BooleanLiteralExpression, value, span };
}

export interface NumberLiteralExpression {
  type: ExpressionType.NumberLiteralExpression;
  value: number;
  span: Span;
}

export function numberLiteralExpression(
  value: number,
  span: Span,
): NumberLiteralExpression {
  return { type: ExpressionType.NumberLiteralExpression, value, span };
}

export interface StringLiteralExpression {
  type: ExpressionType.StringLiteralExpression;
  value: string;
  span: Span;
}

export function stringLiteralExpression(
  value: string,
  span: Span,
): StringLiteralExpression {
  return { type: ExpressionType.StringLiteralExpression, value, span };
}
