import { json } from "@codemirror/lang-json";
import type { SourceFile } from "@mimir/core/src/analysis/ast";
import type { Diagnostic } from "@mimir/core/src/analysis/diagnostic";
import type { Token } from "@mimir/core/src/analysis/token";
import { useMemo } from "react";
import { Card, CardHeader, CardTitle } from "./Card";
import { CodeEditor } from "./ui/code-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export interface ViewerProps {
  mode: ViewerMode;
  setMode: (mode: ViewerMode) => void;
  compilationResult: ViewerCompilationResult;
}

export enum ViewerMode {
  AST = "ast",
  Tokens = "tokens",
  Console = "console",
}

export interface ViewerCompilationResult {
  diagnostic: Diagnostic | null;
  tokens: Token[] | null;
  ast: SourceFile | null;
  output: string | null;
}

export const Viewer = ({ mode, setMode, compilationResult }: ViewerProps) => {
  const content = useMemo(() => {
    if (mode === ViewerMode.Console) {
      return compilationResult.output ?? "";
    }
    if (mode === ViewerMode.Tokens) {
      return compilationResult.tokens
        ?.map((token) => `${token.type} ${token.text}`)
        .join("\n");
    }
    return JSON.stringify(compilationResult.ast, null, 2);
  }, [compilationResult, mode]);

  return (
    <Card className="h-full">
      <CardHeader className="justify-between">
        <CardTitle>Viewer</CardTitle>
        <ModeSelector mode={mode} setMode={setMode} />
      </CardHeader>
      <CodeEditor value={content} readOnly extensions={[json()]} />
    </Card>
  );
};

interface ModeSelectorProps {
  mode: ViewerMode;
  setMode: (mode: ViewerMode) => void;
}

const ModeSelector = ({ mode, setMode }: ModeSelectorProps) => {
  return (
    <>
      <Select
        value={mode}
        onValueChange={(value) => setMode(value as ViewerMode)}
      >
        <SelectTrigger className="hidden md:flex" size="sm">
          <SelectValue placeholder="Select a mode" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(ViewerMode).map(([key, value]) => (
            <SelectItem key={key} value={value}>
              {key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ToggleGroup
        variant="outline"
        className="md:hidden"
        type="single"
        value={mode}
        onValueChange={(value) => {
          if (value) {
            setMode(value as ViewerMode);
          }
        }}
      >
        {Object.entries(ViewerMode).map(([key, value]) => (
          <ToggleGroupItem key={key} value={value} className="text-xs">
            {key}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </>
  );
};
