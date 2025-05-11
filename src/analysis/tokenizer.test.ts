import { Tokenizer, TokenType } from "@/analysis/tokenizer";
import { test, expect } from "bun:test";

test("tokenizes unknown characters", () => {
  const tokenizer = new Tokenizer("%%%");
  const tokens = tokenizer.tokenize();
  expect(tokens).toEqual([
    { type: TokenType.Unknown, span: { start: 0, end: 3 } },
    { type: TokenType.Eof, span: { start: 3, end: 4 } },
  ]);
});

test("tokenizes simple expressions", () => {
  const tokenizer = new Tokenizer("123 + 456");
  const tokens = tokenizer.tokenize();
  expect(tokens).toEqual([
    { type: TokenType.Number, value: 123, span: { start: 0, end: 3 } },
    { type: TokenType.Plus, span: { start: 4, end: 5 } },
    { type: TokenType.Number, value: 456, span: { start: 6, end: 9 } },
    { type: TokenType.Eof, span: { start: 9, end: 10 } },
  ]);
});

test("tokenizes more complex expressions", () => {
  const tokenizer = new Tokenizer("123 + 456 * 789");
  const tokens = tokenizer.tokenize();
  expect(tokens).toEqual([
    { type: TokenType.Number, value: 123, span: { start: 0, end: 3 } },
    { type: TokenType.Plus, span: { start: 4, end: 5 } },
    { type: TokenType.Number, value: 456, span: { start: 6, end: 9 } },
    { type: TokenType.Asterisk, span: { start: 10, end: 11 } },
    { type: TokenType.Number, value: 789, span: { start: 12, end: 15 } },
    { type: TokenType.Eof, span: { start: 15, end: 16 } },
  ]);
});
