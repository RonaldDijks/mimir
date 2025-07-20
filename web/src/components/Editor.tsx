import { rust } from "@codemirror/lang-rust";
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
      <CodeEditor value={value} onChange={onChange} extensions={[rust()]} />
    </Card>
  );
};
