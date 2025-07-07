import { test, expect } from "bun:test";
import { parse } from "./parser";
import { tokenize } from "./tokenizer";
import { ExpressionType } from "./ast";
import { TokenType } from "./token";

test("parse simple expression", () => {
  const tokens = tokenize("1 + 2 * 3");
  const ast = parse(tokens);
  expect(ast).toStrictEqual({
    type: ExpressionType.BinaryExpression,
    left: {
      type: ExpressionType.NumberLiteralExpression,
      value: 1,
    },
    right: {
      type: ExpressionType.BinaryExpression,
      operator: {
        type: TokenType.Asterisk,
        text: "*",
        span: { start: 6, end: 7 },
      },
      left: {
        type: ExpressionType.NumberLiteralExpression,
        value: 2,
      },
      right: {
        type: ExpressionType.NumberLiteralExpression,
        value: 3,
      },
    },
    operator: {
      type: TokenType.Plus,
      text: "+",
      span: { start: 2, end: 3 },
    },
  });
});

test("parses complex operator precedence correctly", () => {
  const tokens = tokenize("1 + 2 * 3 + 4 * 5");
  const ast = parse(tokens);
  expect(ast).toStrictEqual({
    type: ExpressionType.BinaryExpression,
    left: {
      type: ExpressionType.BinaryExpression,
      left: {
        type: ExpressionType.NumberLiteralExpression,
        value: 1,
      },
      operator: {
        type: TokenType.Plus,
        text: "+",
        span: { start: 2, end: 3 },
      },
      right: {
        type: ExpressionType.BinaryExpression,
        left: {
          type: ExpressionType.NumberLiteralExpression,
          value: 2,
        },
        operator: {
          type: TokenType.Asterisk,
          text: "*",
          span: { start: 6, end: 7 },
        },
        right: {
          type: ExpressionType.NumberLiteralExpression,
          value: 3,
        },
      },
    },
    operator: {
      type: TokenType.Plus,
      text: "+",
      span: { start: 10, end: 11 },
    },
    right: {
      type: ExpressionType.BinaryExpression,
      left: {
        type: ExpressionType.NumberLiteralExpression,
        value: 4,
      },
      operator: {
        type: TokenType.Asterisk,
        text: "*",
        span: { start: 14, end: 15 },
      },
      right: {
        type: ExpressionType.NumberLiteralExpression,
        value: 5,
      },
    },
  });
});
