import {
  BinaryOperator,
  binaryExpression,
  booleanExpression,
  declarationStatement,
  expressionStatement,
  identifierExpression,
  numberExpression,
} from "@/analysis/ast";
import { Parser } from "@/analysis/parser";
import { Tokenizer } from "@/analysis/tokenizer";
import { expect, test } from "bun:test";

test("parses simple expressions", () => {
  const parser = new Parser(new Tokenizer("1 + 2;").tokenize());
  const ast = parser.parse();
  expect(ast).toEqual(
    expressionStatement(
      binaryExpression(
        numberExpression(1, { start: 0, end: 1 }),
        BinaryOperator.Addition,
        numberExpression(2, { start: 4, end: 5 }),
        { start: 0, end: 5 }
      ),
      { start: 0, end: 5 }
    )
  );
});

test("parses a binary expression with a higher precedence", () => {
  const parser = new Parser(new Tokenizer("1 + 2 * 3;").tokenize());
  const ast = parser.parse();
  expect(ast).toEqual(
    expressionStatement(
      binaryExpression(
        numberExpression(1, { start: 0, end: 1 }),
        BinaryOperator.Addition,
        binaryExpression(
          numberExpression(2, { start: 4, end: 5 }),
          BinaryOperator.Multiplication,
          numberExpression(3, { start: 8, end: 9 }),
          { start: 4, end: 9 }
        ),
        { start: 0, end: 9 }
      ),
      { start: 0, end: 9 }
    )
  );
});

test("parses a boolean expression", () => {
  const parser = new Parser(new Tokenizer("true && false || true;").tokenize());
  const ast = parser.parse();
  expect(ast).toEqual(
    expressionStatement(
      binaryExpression(
        binaryExpression(
          booleanExpression(true, { start: 0, end: 4 }),
          BinaryOperator.LogicalAnd,
          booleanExpression(false, { start: 8, end: 13 }),
          { start: 0, end: 13 }
        ),
        BinaryOperator.LogicalOr,
        booleanExpression(true, { start: 17, end: 21 }),
        { start: 0, end: 21 }
      ),
      { start: 0, end: 21 }
    )
  );
});

test("parses an identifier expression", () => {
  const parser = new Parser(new Tokenizer("let mut x = 123;").tokenize());
  const ast = parser.parse();
  expect(ast).toEqual(
    declarationStatement(
      identifierExpression("x", { start: 8, end: 9 }),
      true,
      numberExpression(123, { start: 12, end: 15 }),
      { start: 0, end: 15 }
    )
  );
});

test("throws error for missing semicolon", () => {
  const parser = new Parser(new Tokenizer("1 + 2").tokenize());
  expect(() => parser.parse()).toThrow("Expected semicolon after expression");
});

test("throws error for multiple expressions without semicolons", () => {
  const parser = new Parser(new Tokenizer("1 + 2; 3 + 4").tokenize());
  expect(() => parser.parse()).toThrow("Unexpected tokens after expression");
});
