import ReactCodeMirror from "@uiw/react-codemirror";
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
import { cn } from "@/lib/utils";

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
      const ast = parse(tokens);
      return {
        [Mode.AST]: JSON.stringify(ast, null, 2),
        [Mode.Tokens]: JSON.stringify(tokens, null, 2),
      }[mode];
    } catch (error) {
      console.log(error);
      return "";
    }
  }, [value, mode]);

  return (
    <Card className="h-full">
      <CardHeader className="justify-between">
        <CardTitle>Viewer</CardTitle>
        <Select value={mode} onValueChange={(value) => setMode(value as Mode)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select a mode" />
          </SelectTrigger>
          <SelectContent className="w-36">
            <SelectItem value="ast">AST</SelectItem>
            <SelectItem value="tokens">Tokens</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <ReactCodeMirror
        value={compiled}
        readOnly
        height="100%"
        className={cn(
          "h-full",
          "pb-12" // Should find a way to get rid of this
        )}
        extensions={[json()]}
      />
    </Card>
  );
};
