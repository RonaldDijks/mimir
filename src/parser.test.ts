import { test, expect } from "bun:test";
import { tokenize } from "./tokenizer";
import {
  unaryExpression,
  booleanLiteralExpression,
  binaryExpression,
  parenthesizedExpression,
  numberLiteralExpression,
  StatementType,
  letStatement,
  assignmentExpression,
} from "./ast";
import { TokenType, type Token } from "./token";
import { Parser } from "./parser";

function parseExpression(tokens: Token[]) {
  const parser = new Parser(tokens);
  const ast = parser.parse();
  if (ast.type !== StatementType.ExpressionStatement) {
    throw new Error("Expected expression statement");
  }
  return ast.expression;
}

test("parse simple expression", () => {
  const tokens = tokenize("1 + 2 * 3");
  const ast = parseExpression(tokens);
  expect(ast).toStrictEqual(
    binaryExpression(
      numberLiteralExpression(1),
      binaryExpression(numberLiteralExpression(2), numberLiteralExpression(3), {
        type: TokenType.Asterisk,
        text: "*",
        span: { start: 6, end: 7 },
      }),
      { type: TokenType.Plus, text: "+", span: { start: 2, end: 3 } }
    )
  );
});

test("parses complex operator precedence correctly", () => {
  const tokens = tokenize("1 + 2 * 3 + 4 * 5");
  const ast = parseExpression(tokens);
  expect(ast).toStrictEqual(
    binaryExpression(
      binaryExpression(
        numberLiteralExpression(1),
        binaryExpression(
          numberLiteralExpression(2),
          numberLiteralExpression(3),
          { type: TokenType.Asterisk, text: "*", span: { start: 6, end: 7 } }
        ),
        { type: TokenType.Plus, text: "+", span: { start: 2, end: 3 } }
      ),
      binaryExpression(numberLiteralExpression(4), numberLiteralExpression(5), {
        type: TokenType.Asterisk,
        text: "*",
        span: { start: 14, end: 15 },
      }),
      { type: TokenType.Plus, text: "+", span: { start: 10, end: 11 } }
    )
  );
});

test("parse boolean expression", () => {
  const tokens = tokenize("true && false || true");
  const ast = parseExpression(tokens);
  expect(ast).toStrictEqual(
    binaryExpression(
      binaryExpression(
        booleanLiteralExpression(true),
        booleanLiteralExpression(false),
        {
          type: TokenType.AmpersandAmpersand,
          text: "&&",
          span: { start: 5, end: 7 },
        }
      ),
      booleanLiteralExpression(true),
      { type: TokenType.PipePipe, text: "||", span: { start: 14, end: 16 } }
    )
  );
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
    const ast = parseExpression(tokenize(expression));
    expect(ast).toStrictEqual(
      binaryExpression(numberLiteralExpression(1), numberLiteralExpression(2), {
        type: operator[1],
        text: operator[0],
        span: { start: 2, end: 2 + operator[0].length },
      } as Token)
    );
  }
});

test("parse unary expression", () => {
  const tokens = tokenize("!true");
  const ast = parseExpression(tokens);
  expect(ast).toStrictEqual(
    unaryExpression(
      {
        type: TokenType.Bang,
        text: "!",
        span: { start: 0, end: 1 },
      },
      booleanLiteralExpression(true)
    )
  );
});

test("parse parenthesized expression", () => {
  const tokens = tokenize("(1 + 2) * 3");
  const ast = parseExpression(tokens);
  expect(ast).toStrictEqual(
    binaryExpression(
      parenthesizedExpression(
        binaryExpression(
          numberLiteralExpression(1),
          numberLiteralExpression(2),
          { type: TokenType.Plus, text: "+", span: { start: 3, end: 4 } }
        )
      ),
      numberLiteralExpression(3),
      { type: TokenType.Asterisk, text: "*", span: { start: 8, end: 9 } }
    )
  );
});

test("parse let expression", () => {
  const tokens = tokenize("let mut abc = 123");
  const parser = new Parser(tokens);
  const ast = parser.parse();
  if (ast.type !== StatementType.LetStatement) {
    throw new Error("Expected let statement");
  }
  expect(ast).toStrictEqual(
    letStatement(
      true,
      {
        type: TokenType.Identifier,
        text: "abc",
        span: { start: 8, end: 11 },
      },
      numberLiteralExpression(123)
    )
  );
});

test("parse assignment expression", () => {
  const tokens = tokenize("abc = 123");
  const ast = parseExpression(tokens);
  expect(ast).toStrictEqual(
    assignmentExpression(
      { type: TokenType.Identifier, text: "abc", span: { start: 0, end: 3 } },
      numberLiteralExpression(123)
    )
  );
});
