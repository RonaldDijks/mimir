import { json } from "@codemirror/lang-json";
import type { SourceFile } from "@mimir/core/src/analysis/ast";
import { parse } from "@mimir/core/src/analysis/parser";
import type { Token } from "@mimir/core/src/analysis/token";
import { tokenize } from "@mimir/core/src/analysis/tokenizer";
import { useMemo, useState } from "react";
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
  value: string;
}

enum Mode {
  AST = "ast",
  Tokens = "tokens",
}

export const Viewer = ({ value }: ViewerProps) => {
  const [mode, setMode] = useState<Mode>(Mode.AST);

  const compiled = useMemo((): {
    tokens: Token[] | null;
    ast: SourceFile | null;
  } => {
    try {
      const tokens = tokenize(value);
      if (mode === Mode.Tokens) {
        return { tokens, ast: null } as const;
      }
      const ast = parse(tokens);
      return { tokens, ast } as const;
    } catch (error) {
      console.log(error);
      return { tokens: null, ast: null } as const;
    }
  }, [value, mode]);

  const content = useMemo(() => {
    if (mode === Mode.Tokens) {
      return JSON.stringify(compiled.tokens, null, 2);
    }
    return JSON.stringify(compiled.ast, null, 2);
  }, [compiled, mode]);

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
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeSelector = ({ mode, setMode }: ModeSelectorProps) => {
  return (
    <>
      <Select value={mode} onValueChange={(value) => setMode(value as Mode)}>
        <SelectTrigger className="hidden md:flex" size="sm">
          <SelectValue placeholder="Select a mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ast">AST</SelectItem>
          <SelectItem value="tokens">Tokens</SelectItem>
        </SelectContent>
      </Select>

      <ToggleGroup
        variant="outline"
        className="md:hidden"
        type="single"
        value={mode}
        onValueChange={(value) => {
          if (value) {
            setMode(value as Mode);
          }
        }}
      >
        <ToggleGroupItem value={Mode.AST} className="text-xs">
          AST
        </ToggleGroupItem>
        <ToggleGroupItem value={Mode.Tokens} className="text-xs">
          Tokens
        </ToggleGroupItem>
      </ToggleGroup>
    </>
  );
};
