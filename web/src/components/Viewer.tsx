import { useMemo, useState } from "react";

import { Card, CardHeader, CardTitle } from "./Card";

import { tokenize } from "@mimir/core/src/analysis/tokenizer";
import { parse } from "@mimir/core/src/analysis/parser";
import { json } from "@codemirror/lang-json";

import { CodeEditor } from "./ui/code-editor";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import { Token } from "@mimir/core/src/analysis/token";
import { SourceFile } from "@mimir/core/src/analysis/ast";

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

        <ModeSelector
          mode={mode}
          setMode={setMode}
          className="hidden md:flex"
        />

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
      </CardHeader>
      <CodeEditor value={content} readOnly extensions={[json()]} />
    </Card>
  );
};

interface ModeSelectorProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  className?: string;
}

const ModeSelector = ({ mode, setMode, className }: ModeSelectorProps) => {
  return (
    <Select value={mode} onValueChange={(value) => setMode(value as Mode)}>
      <SelectTrigger className={cn(className)} size="sm">
        <SelectValue placeholder="Select a mode" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ast">AST</SelectItem>
        <SelectItem value="tokens">Tokens</SelectItem>
      </SelectContent>
    </Select>
  );
};
