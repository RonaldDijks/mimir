import {
  BinaryOperator,
  ExpressionType,
  binaryExpression,
  numberExpression,
} from "@/analysis/ast";
import { Parser } from "@/analysis/parser";
import { Tokenizer } from "@/analysis/tokenizer";
import { test, expect } from "bun:test";

test("parses simple expressions", () => {
  const parser = new Parser(new Tokenizer("1 + 2").tokenize());
  const ast = parser.parse();
  expect(ast).toEqual({
    type: ExpressionType.Binary,
    operator: BinaryOperator.Plus,
    left: numberExpression(1, { start: 0, end: 1 }),
    right: numberExpression(2, { start: 4, end: 5 }),
    span: { start: 0, end: 5 },
  });
});

test("parses a binary expression with a higher precedence", () => {
  const parser = new Parser(new Tokenizer("1 + 2 * 3").tokenize());
  const ast = parser.parse();
  expect(ast).toEqual(
    binaryExpression(
      numberExpression(1, { start: 0, end: 1 }),
      BinaryOperator.Plus,
      binaryExpression(
        numberExpression(2, { start: 4, end: 5 }),
        BinaryOperator.Asterisk,
        numberExpression(3, { start: 8, end: 9 }),
        { start: 4, end: 9 }
      ),
      { start: 0, end: 9 }
    )
  );
});
