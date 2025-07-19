import { Card, CardHeader, CardTitle } from "./Card";
import { CodeEditor } from "./ui/code-editor";

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const Editor = ({ value, onChange }: EditorProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Editor</CardTitle>
      </CardHeader>
      <CodeEditor value={value} onChange={onChange} />
    </Card>
  );
};
