import { test, expect } from "bun:test";
import { parse } from "./parser";
import { tokenize } from "./tokenizer";
import { ExpressionType } from "./ast";
import { TokenType, type Token } from "./token";

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

test("parse boolean expression", () => {
  const tokens = tokenize("true && false || true");
  const ast = parse(tokens);
  expect(ast).toStrictEqual({
    type: ExpressionType.BinaryExpression,
    left: {
      type: ExpressionType.BinaryExpression,
      left: {
        type: ExpressionType.BooleanLiteralExpression,
        value: true,
      },
      operator: {
        type: TokenType.AmpersandAmpersand,
        text: "&&",
        span: { start: 5, end: 7 },
      },
      right: {
        type: ExpressionType.BooleanLiteralExpression,
        value: false,
      },
    },
    operator: {
      type: TokenType.PipePipe,
      text: "||",
      span: { start: 14, end: 16 },
    },
    right: {
      type: ExpressionType.BooleanLiteralExpression,
      value: true,
    },
  });
});

test("parse comparison expression", () => {
  const operators: [string, TokenType][] = [
    ["==", TokenType.EqualsEquals],
    ["!=", TokenType.BangEquals],
    [">", TokenType.GreaterThan],
    [">=", TokenType.GreaterThanEquals],
    ["<", TokenType.LessThan],
    ["<=", TokenType.LessThanEquals],
  ];
  for (const operator of operators) {
    const expression = `1 ${operator[0]} 2`;
    const ast = parse(tokenize(expression));
    expect(ast).toStrictEqual({
      type: ExpressionType.BinaryExpression,
      left: {
        type: ExpressionType.NumberLiteralExpression,
        value: 1,
      },
      operator: {
        type: operator[1],
        text: operator[0],
        span: { start: 2, end: 2 + operator[0].length },
      } as Token,
      right: {
        type: ExpressionType.NumberLiteralExpression,
        value: 2,
      },
    });
  }
});

test("parse unary expression", () => {
  const tokens = tokenize("!true");
  const ast = parse(tokens);
  expect(ast).toStrictEqual({
    type: ExpressionType.UnaryExpression,
    operator: {
      type: TokenType.Bang,
      text: "!",
      span: { start: 0, end: 1 },
    },
    right: {
      type: ExpressionType.BooleanLiteralExpression,
      value: true,
    },
  });
});

test("parse parenthesized expression", () => {
  const tokens = tokenize("(1 + 2) * 3");
  const ast = parse(tokens);
  expect(ast).toStrictEqual({
    type: ExpressionType.BinaryExpression,
    left: {
      type: ExpressionType.ParenthesizedExpression,
      expression: {
        type: ExpressionType.BinaryExpression,
        left: {
          type: ExpressionType.NumberLiteralExpression,
          value: 1,
        },
        operator: {
          type: TokenType.Plus,
          text: "+",
          span: { start: 3, end: 4 },
        },
        right: {
          type: ExpressionType.NumberLiteralExpression,
          value: 2,
        },
      },
    },
    operator: {
      type: TokenType.Asterisk,
      text: "*",
      span: { start: 8, end: 9 },
    },
    right: {
      type: ExpressionType.NumberLiteralExpression,
      value: 3,
    },
  });
});
