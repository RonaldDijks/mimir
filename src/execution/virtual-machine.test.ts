import type { Statement } from "@/analysis/ast";
import { Parser } from "@/analysis/parser";
import { Tokenizer } from "@/analysis/tokenizer";
import {
  AssignmentToImmutableVariableError,
  UndefinedVariableError,
  UnknownOperatorError,
  VirtualMachine,
} from "@/execution/virtual-machine";
import { expect, test } from "bun:test";
import { booleanValue, numberValue } from "./value";

function getAst(text: string): Statement {
  const tokenizer = new Tokenizer(text);
  const tokens = tokenizer.tokenize();
  const parser = new Parser(tokens);
  return parser.parse();
}

test("evaluates simple expressions", () => {
  const ast = getAst("1;");
  const vm = new VirtualMachine();
  const result = vm.run(ast);
  expect(result).toEqual(numberValue(1));
});

test("evaluates more complex expressions", () => {
  const ast = getAst("1 + 2;");
  const vm = new VirtualMachine();
  const result = vm.run(ast);
  expect(result).toEqual(numberValue(3));
});

test("evaluates expressions with precedence", () => {
  const ast = getAst("1 + 2 * 3 - 4 / 2;");
  const vm = new VirtualMachine();
  const result = vm.run(ast);
  expect(result).toEqual(numberValue(5));
});

test("evaluates boolean expressions", () => {
  const ast = getAst("true && false || true;");
  const vm = new VirtualMachine();
  const result = vm.run(ast);
  expect(result).toEqual(booleanValue(true));
});

test("rejects unknown expressions", () => {
  const ast = getAst("1 + true;");
  const vm = new VirtualMachine();
  expect(() => vm.run(ast)).toThrow(UnknownOperatorError);
});

test("evaluates assignment expressions", () => {
  const ast = getAst("let x = 5;");
  const vm = new VirtualMachine();
  const result = vm.run(ast);
  expect(result).toEqual(numberValue(5));
});

test("evaluates variable references", () => {
  const vm = new VirtualMachine();

  // First assign a value to a variable
  const assignAst = getAst("let x = 10;");
  vm.run(assignAst);

  // Then reference that variable
  const refAst = getAst("x;");
  const result = vm.run(refAst);
  expect(result).toEqual(numberValue(10));
});

test("evaluates expressions with assignments", () => {
  const vm = new VirtualMachine();

  // Assign and use in the same expression
  const ast = getAst("let x = 5 + 3;");
  const result = vm.run(ast);
  expect(result).toEqual(numberValue(8));

  // Use the variable in another expression
  const nextAst = getAst("x * 2;");
  const nextResult = vm.run(nextAst);
  expect(nextResult).toEqual(numberValue(16));
});

test("evaluates declarations", () => {
  const ast = getAst("let x = 10;");
  const vm = new VirtualMachine();
  const result = vm.run(ast);
  expect(result).toEqual(numberValue(10));
});

test("rejects undefined variable references", () => {
  const ast = getAst("undefinedVar;");
  const vm = new VirtualMachine();
  expect(() => vm.run(ast)).toThrow(UndefinedVariableError);
});

test("allows shadowing variables", () => {
  const vm = new VirtualMachine();
  const ast = getAst("let x = 10;");
  const result = vm.run(ast);
  expect(result).toEqual(numberValue(10));

  const ast2 = getAst("let x = 20;");
  const result2 = vm.run(ast2);
  expect(result2).toEqual(numberValue(20));

  const ast3 = getAst("x;");
  const result3 = vm.run(ast3);
  expect(result3).toEqual(numberValue(20));
});

test("rejects assignment to non-mut variables", () => {
  const vm = new VirtualMachine();
  const ast = getAst("let x = 10;");
  vm.run(ast);
  const ast2 = getAst("x = 20;");
  expect(() => vm.run(ast2)).toThrow(AssignmentToImmutableVariableError);
});
