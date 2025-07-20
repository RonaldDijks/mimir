import { expect, test } from "bun:test";
import { dedent } from "../util/dedent";
import { TokenType } from "./token";
import { tokenize } from "./tokenizer";

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

test("tokenize strings", () => {
  const tokens = tokenize('"hello" ++ " world"');
  expect(tokens).toStrictEqual([
    {
      type: TokenType.StringLiteral,
      text: '"hello"',
      value: "hello",
      span: { start: 0, end: 7 },
    },
    { type: TokenType.PlusPlus, text: "++", span: { start: 8, end: 10 } },
    {
      type: TokenType.StringLiteral,
      text: '" world"',
      value: " world",
      span: { start: 11, end: 19 },
    },
    { type: TokenType.EndOfFile, text: "\0", span: { start: 19, end: 19 } },
  ]);
});

test("tokenize if expressions", () => {
  const input = dedent`
    if (true) {
      1
    } else if (false) {
      2
    } else {
      3
    }
  `;
  const tokens = tokenize(input);
  expect(tokens).toStrictEqual([
    { type: TokenType.If, text: "if", span: { start: 0, end: 2 } },
    { type: TokenType.ParenthesisOpen, text: "(", span: { start: 3, end: 4 } },
    { type: TokenType.True, text: "true", span: { start: 4, end: 8 } },
    {
      type: TokenType.ParenthesisClose,
      text: ")",
      span: { start: 8, end: 9 },
    },
    { type: TokenType.BraceOpen, text: "{", span: { start: 10, end: 11 } },
    {
      type: TokenType.Number,
      text: "1",
      span: { start: 14, end: 15 },
      value: 1,
    },
    { type: TokenType.BraceClose, text: "}", span: { start: 16, end: 17 } },
    { type: TokenType.Else, text: "else", span: { start: 18, end: 22 } },
    { type: TokenType.If, text: "if", span: { start: 23, end: 25 } },
    {
      type: TokenType.ParenthesisOpen,
      text: "(",
      span: { start: 26, end: 27 },
    },
    { type: TokenType.False, text: "false", span: { start: 27, end: 32 } },
    {
      type: TokenType.ParenthesisClose,
      text: ")",
      span: { start: 32, end: 33 },
    },
    { type: TokenType.BraceOpen, text: "{", span: { start: 34, end: 35 } },
    {
      type: TokenType.Number,
      text: "2",
      span: { start: 38, end: 39 },
      value: 2,
    },
    { type: TokenType.BraceClose, text: "}", span: { start: 40, end: 41 } },
    { type: TokenType.Else, text: "else", span: { start: 42, end: 46 } },
    {
      type: TokenType.BraceOpen,
      text: "{",
      span: { start: 47, end: 48 },
    },
    {
      type: TokenType.Number,
      text: "3",
      span: { start: 51, end: 52 },
      value: 3,
    },
    { type: TokenType.BraceClose, text: "}", span: { start: 53, end: 54 } },
    { type: TokenType.EndOfFile, text: "\0", span: { start: 54, end: 54 } },
  ]);
});
