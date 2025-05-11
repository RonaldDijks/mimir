import { Tokenizer } from "@/analysis/tokenizer";
import { test, expect } from "bun:test";
import { TokenType } from "./token";

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

test("tokenizes boolean expressions", () => {
  const tokenizer = new Tokenizer("true && false || true");
  const tokens = tokenizer.tokenize();
  expect(tokens).toEqual([
    { type: TokenType.True, span: { start: 0, end: 4 } },
    { type: TokenType.AmpersandAmpersand, span: { start: 5, end: 7 } },
    { type: TokenType.False, span: { start: 8, end: 13 } },
    { type: TokenType.PipePipe, span: { start: 14, end: 16 } },
    { type: TokenType.True, span: { start: 17, end: 21 } },
    { type: TokenType.Eof, span: { start: 21, end: 22 } },
  ]);
});

test("tokenizes identifiers", () => {
  const tokenizer = new Tokenizer("x = 123");
  const tokens = tokenizer.tokenize();
  expect(tokens).toEqual([
    { type: TokenType.Identifier, name: "x", span: { start: 0, end: 1 } },
    { type: TokenType.Equal, span: { start: 2, end: 3 } },
    { type: TokenType.Number, value: 123, span: { start: 4, end: 7 } },
    { type: TokenType.Eof, span: { start: 7, end: 8 } },
  ]);
});

test("tokenizes semicolons", () => {
  const tokenizer = new Tokenizer("123 + 456;");
  const tokens = tokenizer.tokenize();
  expect(tokens).toEqual([
    { type: TokenType.Number, value: 123, span: { start: 0, end: 3 } },
    { type: TokenType.Plus, span: { start: 4, end: 5 } },
    { type: TokenType.Number, value: 456, span: { start: 6, end: 9 } },
    { type: TokenType.Semicolon, span: { start: 9, end: 10 } },
    { type: TokenType.Eof, span: { start: 10, end: 11 } },
  ]);
});
