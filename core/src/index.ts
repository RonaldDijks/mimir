import { parse } from "./analysis/parser";
import { tokenize } from "./analysis/tokenizer";

export function compile(sourceCode: string) {
  const tokens = tokenize(sourceCode);
  const ast = parse(tokens);
  return ast;
}
