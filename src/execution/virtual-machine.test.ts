import { expect, test } from "bun:test";
import {
  UnknownOperatorError,
  VirtualMachine,
} from "@/execution/virtual-machine";
import { booleanValue, numberValue } from "./value";
import { Tokenizer } from "@/analysis/tokenizer";
import { Parser } from "@/analysis/parser";
import type { Expression } from "@/analysis/ast";

function getAst(text: string): Expression {
  const tokenizer = new Tokenizer(text);
  const tokens = tokenizer.tokenize();
  const parser = new Parser(tokens);
  return parser.parse();
}

test("evaluates simple expressions", () => {
  const ast = getAst("1");
  const vm = new VirtualMachine();
  const result = vm.run(ast);
  expect(result).toEqual(numberValue(1));
});

test("evaluates more complex expressions", () => {
  const ast = getAst("1 + 2");
  const vm = new VirtualMachine();
  const result = vm.run(ast);
  expect(result).toEqual(numberValue(3));
});

test("evaluates expressions with precedence", () => {
  const ast = getAst("1 + 2 * 3 - 4 / 2");
  const vm = new VirtualMachine();
  const result = vm.run(ast);
  expect(result).toEqual(numberValue(5));
});

test("evaluates boolean expressions", () => {
  const ast = getAst("true && false || true");
  const vm = new VirtualMachine();
  const result = vm.run(ast);
  expect(result).toEqual(booleanValue(true));
});

test("rejects unknown expressions", () => {
  const ast = getAst("1 + true");
  const vm = new VirtualMachine();
  expect(() => vm.run(ast)).toThrow(UnknownOperatorError);
});
