"use client";

import type { SourceFile } from "@mimir/core/src/analysis/ast";
import { parse } from "@mimir/core/src/analysis/parser";
import type { Token } from "@mimir/core/src/analysis/token";
import { tokenize } from "@mimir/core/src/analysis/tokenizer";
import { Evaluator } from "@mimir/core/src/execution/evaluator";
import { type Value, ValueType } from "@mimir/core/src/execution/value";
import { dedent } from "@mimir/core/src/util/dedent";
import { useCallback, useMemo, useState } from "react";
import { Editor } from "@/components/Editor";
import { Header } from "@/components/Header";
import {
  Viewer,
  type ViewerCompilationResult,
  ViewerMode,
} from "@/components/Viewer";

const initial = dedent`
let x = 10
let y = 20
x + y
`;

export default function Home() {
  const [sourceCode, setSourceCode] = useState(initial);
  const [mode, setMode] = useState<ViewerMode>(ViewerMode.AST);
  const [output, setOutput] = useState<string>("");

  const compilationResult = useMemo((): ViewerCompilationResult => {
    let tokens: Token[] | null = null;
    try {
      tokens = tokenize(sourceCode);
    } catch (error) {
      console.log(error);
      return { tokens: null, ast: null, output: null };
    }
    let ast: SourceFile | null = null;
    try {
      ast = parse(tokens);
    } catch (error) {
      console.log(error);
      return { tokens: null, ast: null, output: null };
    }
    return { tokens, ast, output: null };
  }, [sourceCode]);

  const onRun = useCallback(() => {
    setMode(ViewerMode.Console);
    const evaluator = new Evaluator();
    if (!compilationResult.ast) {
      return;
    }
    const result = evaluator.evaluate(compilationResult.ast);
    setOutput(valueToString(result));
  }, [compilationResult]);

  return (
    <div className="h-screen max-h-screen flex flex-col">
      <Header />
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 overflow-hidden gap-2 mx-2 mb-2">
        <div className="overflow-hidden">
          <Editor
            value={sourceCode}
            onChange={setSourceCode}
            onRun={onRun}
            runDisabled={!compilationResult.ast}
          />
        </div>
        <div className="overflow-hidden">
          <Viewer
            mode={mode}
            setMode={setMode}
            compilationResult={{ ...compilationResult, output }}
          />
        </div>
      </div>
    </div>
  );
}

function valueToString(value: Value): string {
  switch (value.type) {
    case ValueType.Number:
      return `${value.value}: number`;
    case ValueType.String:
      return `${value.value}: string`;
    case ValueType.Boolean:
      return `${value.value}: boolean`;
    case ValueType.Nil:
      return "nil";
    default:
      return "unknown";
  }
}
