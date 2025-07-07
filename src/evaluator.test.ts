import { test, expect } from "bun:test";
import { tokenize } from "./tokenizer";
import { parse } from "./parser";
import { Evaluator } from "./evaluator";

test("evaluate simple expression", () => {
  const tokens = tokenize("1 + 2 * 3");
  const ast = parse(tokens);
  const evaluator = new Evaluator();
  const result = evaluator.evaluate(ast);
  expect(result).toBe(7);
});
