import { test, expect } from "bun:test";
import { tokenize } from "./tokenizer";
import { TokenType } from "./token";

test("tokenize simple expression", () => {
  const tokens = tokenize("1 + 2 * 3");
  expect(tokens).toStrictEqual([
    { type: TokenType.Number, text: "1", span: { start: 0, end: 1 }, value: 1 },
    { type: TokenType.Plus, text: "+", span: { start: 2, end: 3 } },
    { type: TokenType.Number, text: "2", span: { start: 4, end: 5 }, value: 2 },
    { type: TokenType.Asterisk, text: "*", span: { start: 6, end: 7 } },
    { type: TokenType.Number, text: "3", span: { start: 8, end: 9 }, value: 3 },
    { type: TokenType.EndOfFile, text: "\0", span: { start: 9, end: 9 } },
  ]);
});

test("tokenize boolean expression", () => {
  const tokens = tokenize("true && false || true");
  expect(tokens).toStrictEqual([
    { type: TokenType.True, text: "true", span: { start: 0, end: 4 } },
    {
      type: TokenType.AmpersandAmpersand,
      text: "&&",
      span: { start: 5, end: 7 },
    },
    { type: TokenType.False, text: "false", span: { start: 8, end: 13 } },
    { type: TokenType.PipePipe, text: "||", span: { start: 14, end: 16 } },
    { type: TokenType.True, text: "true", span: { start: 17, end: 21 } },
    { type: TokenType.EndOfFile, text: "\0", span: { start: 21, end: 21 } },
  ]);
});

test("tokenize comparison expressions", () => {
  const tokens = tokenize("1 == 2 != 3 > 4 >= 5 < 6 <= 7");
  expect(tokens).toStrictEqual([
    { type: TokenType.Number, text: "1", span: { start: 0, end: 1 }, value: 1 },
    { type: TokenType.EqualsEquals, text: "==", span: { start: 2, end: 4 } },
    { type: TokenType.Number, text: "2", span: { start: 5, end: 6 }, value: 2 },
    { type: TokenType.BangEquals, text: "!=", span: { start: 7, end: 9 } },
    {
      type: TokenType.Number,
      text: "3",
      span: { start: 10, end: 11 },
      value: 3,
    },
    { type: TokenType.GreaterThan, text: ">", span: { start: 12, end: 13 } },
    {
      type: TokenType.Number,
      text: "4",
      span: { start: 14, end: 15 },
      value: 4,
    },
    {
      type: TokenType.GreaterThanEquals,
      text: ">=",
      span: { start: 16, end: 18 },
    },
    {
      type: TokenType.Number,
      text: "5",
      span: { start: 19, end: 20 },
      value: 5,
    },
    { type: TokenType.LessThan, text: "<", span: { start: 21, end: 22 } },
    {
      type: TokenType.Number,
      text: "6",
      span: { start: 23, end: 24 },
      value: 6,
    },
    {
      type: TokenType.LessThanEquals,
      text: "<=",
      span: { start: 25, end: 27 },
    },
    {
      type: TokenType.Number,
      text: "7",
      span: { start: 28, end: 29 },
      value: 7,
    },
    { type: TokenType.EndOfFile, text: "\0", span: { start: 29, end: 29 } },
  ]);
});

test("tokenize parenthesis", () => {
  const tokens = tokenize("(1 + 2) * 3");
  expect(tokens).toStrictEqual([
    { type: TokenType.ParenthesisOpen, text: "(", span: { start: 0, end: 1 } },
    { type: TokenType.Number, text: "1", span: { start: 1, end: 2 }, value: 1 },
    { type: TokenType.Plus, text: "+", span: { start: 3, end: 4 } },
    { type: TokenType.Number, text: "2", span: { start: 5, end: 6 }, value: 2 },
    { type: TokenType.ParenthesisClose, text: ")", span: { start: 6, end: 7 } },
    { type: TokenType.Asterisk, text: "*", span: { start: 8, end: 9 } },
    {
      type: TokenType.Number,
      text: "3",
      span: { start: 10, end: 11 },
      value: 3,
    },
    { type: TokenType.EndOfFile, text: "\0", span: { start: 11, end: 11 } },
  ]);
});

test("tokenize let statement", () => {
  const tokens = tokenize("let mut x = 1");
  expect(tokens).toStrictEqual([
    { type: TokenType.Let, text: "let", span: { start: 0, end: 3 } },
    { type: TokenType.Mut, text: "mut", span: { start: 4, end: 7 } },
    { type: TokenType.Identifier, text: "x", span: { start: 8, end: 9 } },
    { type: TokenType.Equals, text: "=", span: { start: 10, end: 11 } },
    {
      type: TokenType.Number,
      text: "1",
      span: { start: 12, end: 13 },
      value: 1,
    },
    { type: TokenType.EndOfFile, text: "\0", span: { start: 13, end: 13 } },
  ]);
});
