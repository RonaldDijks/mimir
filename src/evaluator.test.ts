import { test, expect } from "bun:test";
import { tokenize } from "./tokenizer";
import { parse } from "./parser";
import { Evaluator } from "./evaluator";
import { ValueType } from "./value";

function evaluate(tokens: string, evaluator?: Evaluator) {
  evaluator ??= new Evaluator();
  const ast = parse(tokenize(tokens));
  return evaluator.evaluate(ast);
}

test("evaluate simple expression", () => {
  const result = evaluate("1 + 2 * 3");
  expect(result).toStrictEqual({
    type: ValueType.Number,
    value: 7,
  });
});

test("evaluate boolean expression", () => {
  const result = evaluate("true && false || true");
  expect(result).toStrictEqual({
    type: ValueType.Boolean,
    value: true,
  });
});

test("evaluate relational expression", () => {
  const result = evaluate("1 < 2");
  expect(result).toStrictEqual({
    type: ValueType.Boolean,
    value: true,
  });
});

test("evaluate unary expression", () => {
  const result = evaluate("!true");
  expect(result).toStrictEqual({
    type: ValueType.Boolean,
    value: false,
  });
});

test("evaluate parenthesized expression", () => {
  const result = evaluate("(1 + 2) * 3");
  expect(result).toStrictEqual({
    type: ValueType.Number,
    value: 9,
  });
});

test("evaluate let expression", () => {
  const evaluator = new Evaluator();
  const assignment = evaluate("let a = 1", evaluator);
  expect(assignment).toStrictEqual({
    type: ValueType.Number,
    value: 1,
  });
  const result = evaluate("a", evaluator);
  expect(result).toStrictEqual({
    type: ValueType.Number,
    value: 1,
  });
});

test("evaluate assignment expression", () => {
  const evaluator = new Evaluator();
  const assignment = evaluate("let mut a = 1", evaluator);
  expect(assignment).toStrictEqual({
    type: ValueType.Number,
    value: 1,
  });
  const result = evaluate("a = 3", evaluator);
  expect(result).toStrictEqual({
    type: ValueType.Number,
    value: 3,
  });
  const result2 = evaluate("a", evaluator);
  expect(result2).toStrictEqual({
    type: ValueType.Number,
    value: 3,
  });
});
