import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle } from "./Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tokenize } from "@mimir/core/src/analysis/tokenizer";
import { parse } from "@mimir/core/src/analysis/parser";
import { json } from "@codemirror/lang-json";

import { CodeEditor } from "./ui/code-editor";

export interface ViewerProps {
  value: string;
}

enum Mode {
  AST = "ast",
  Tokens = "tokens",
}

export const Viewer = ({ value }: ViewerProps) => {
  const [mode, setMode] = useState<Mode>(Mode.AST);

  const compiled = useMemo(() => {
    try {
      const tokens = tokenize(value);
      if (mode === Mode.Tokens) {
        return JSON.stringify(tokens, null, 2);
      }
      const ast = parse(tokens);
      return JSON.stringify(ast, null, 2);
    } catch (error) {
      console.log(error);
      return "";
    }
  }, [value, mode]);

  return (
    <Card className="h-full">
      <CardHeader className="justify-between">
        <CardTitle>Viewer</CardTitle>
        <ModeSelector mode={mode} setMode={setMode} />
      </CardHeader>
      <CodeEditor value={compiled} readOnly extensions={[json()]} />
    </Card>
  );
};

interface ModeSelectorProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeSelector = ({ mode, setMode }: ModeSelectorProps) => {
  return (
    <Select value={mode} onValueChange={(value) => setMode(value as Mode)}>
      <SelectTrigger className="w-36" size="sm">
        <SelectValue placeholder="Select a mode" />
      </SelectTrigger>
      <SelectContent className="w-36">
        <SelectItem value="ast">AST</SelectItem>
        <SelectItem value="tokens">Tokens</SelectItem>
      </SelectContent>
    </Select>
  );
};
