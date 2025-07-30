import { rust } from "@codemirror/lang-rust";
import { type LintSource, linter } from "@codemirror/lint";
import { Diagnostic } from "@mimir/core/src/analysis/diagnostic";
import { parse } from "@mimir/core/src/analysis/parser";
import { tokenize } from "@mimir/core/src/analysis/tokenizer";
import { PlayIcon } from "lucide-react";
import { Card, CardHeader, CardTitle } from "./Card";
import { Button } from "./ui/button";
import { CodeEditor } from "./ui/code-editor";

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  runDisabled: boolean;
}

export const Editor = ({
  value,
  onChange,
  onRun,
  runDisabled,
}: EditorProps) => {
  const lint: LintSource = (view) => {
    try {
      parse(tokenize(view.state.doc.toString()));
    } catch (error) {
      if (error instanceof Diagnostic) {
        return [
          {
            from: error.span.start,
            to: error.span.end,
            severity: "error",
            message: error.message,
          },
        ];
      }
    }

    return [];
  };

  return (
    <Card className="h-full">
      <CardHeader className="justify-between">
        <CardTitle>Editor</CardTitle>
        <Button
          variant="default"
          size="sm"
          onClick={onRun}
          disabled={runDisabled}
        >
          <PlayIcon className="h-4 w-4" />
          Run
        </Button>
      </CardHeader>
      <CodeEditor
        value={value}
        onChange={onChange}
        extensions={[rust(), linter(lint)]}
      />
    </Card>
  );
};
