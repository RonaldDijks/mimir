import ReactCodeMirror from "@uiw/react-codemirror";
import { Card, CardHeader, CardTitle } from "./Card";
import { cn } from "@/lib/utils";

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
      <ReactCodeMirror
        value={value}
        onChange={onChange}
        height="100%"
        className={cn(
          "outline-none",
          "h-full",
          "pb-12" // Should find a way to get rid of this
        )}
      />
    </Card>
  );
};
