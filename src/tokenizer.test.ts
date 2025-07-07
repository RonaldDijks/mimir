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
