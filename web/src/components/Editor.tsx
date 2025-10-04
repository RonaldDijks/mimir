import { rust } from "@codemirror/lang-rust";
import { type LintSource, linter } from "@codemirror/lint";
import type { Diagnostic } from "@mimir/core/src/analysis/diagnostic";
import { PlayIcon } from "lucide-react";
import { Card, CardHeader, CardTitle } from "./Card";
import { Button } from "./ui/button";
import { CodeEditor } from "./ui/code-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { examples } from "@/lib/examples";

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  runDisabled: boolean;
  diagnostics: Diagnostic[] | null;
  onExampleSelect?: (exampleCode: string) => void;
}

export const Editor = ({
  value,
  onChange,
  onRun,
  runDisabled,
  diagnostics,
  onExampleSelect,
}: EditorProps) => {
  const lint: LintSource = () => {
    return (
      diagnostics?.map((diagnostic) => ({
        from: diagnostic.span.start,
        to: diagnostic.span.end,
        severity: "error",
        message: diagnostic.message,
      })) ?? []
    );
  };

  const handleExampleChange = (exampleId: string) => {
    const example = examples.find((e) => e.id === exampleId);
    if (example && onExampleSelect) {
      onExampleSelect(example.code);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="justify-between">
        <CardTitle>Editor</CardTitle>
        <div className="flex gap-2 items-center">
          <Select onValueChange={handleExampleChange}>
            <SelectTrigger size="sm" className="w-[180px]">
              <SelectValue placeholder="Load example..." />
            </SelectTrigger>
            <SelectContent>
              {examples.map((example) => (
                <SelectItem key={example.id} value={example.id}>
                  {example.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="default"
            size="sm"
            onClick={onRun}
            disabled={runDisabled}
          >
            <PlayIcon className="h-4 w-4" />
            Run
          </Button>
        </div>
      </CardHeader>
      <CodeEditor
        value={value}
        onChange={onChange}
        extensions={[rust(), linter(lint)]}
      />
    </Card>
  );
};
