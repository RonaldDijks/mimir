import { test, expect } from "bun:test";
import { tokenize } from "./tokenizer";
import { parse } from "./parser";
import { Evaluator } from "./evaluator";
import { ValueType } from "./value";

test("evaluate simple expression", () => {
  const tokens = tokenize("1 + 2 * 3");
  const ast = parse(tokens);
  const evaluator = new Evaluator();
  const result = evaluator.evaluate(ast);
  expect(result).toStrictEqual({
    type: ValueType.Number,
    value: 7,
  });
});

test("evaluate boolean expression", () => {
  const tokens = tokenize("true && false || true");
  const ast = parse(tokens);
  const evaluator = new Evaluator();
  const result = evaluator.evaluate(ast);
  expect(result).toStrictEqual({
    type: ValueType.Boolean,
    value: true,
  });
});
