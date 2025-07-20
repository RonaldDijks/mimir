import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import ReactCodeMirror, {
  EditorView,
  type ReactCodeMirrorProps,
} from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const myTheme = EditorView.theme({
  "&": {
    backgroundColor: "transparent !important",
  },
  ".cm-scroller": {
    paddingBottom: "3rem", // Should find a way to get rid of this
  },
  ".cm-gutters": {
    backgroundColor: "transparent !important",
    borderRight: "var(--border) 1px solid !important",
  },
});

export const CodeEditor = (props: ReactCodeMirrorProps) => {
  const { resolvedTheme: theme } = useTheme();
  return (
    <ReactCodeMirror
      {...props}
      height="100%"
      className={cn("h-full")}
      extensions={[...(props.extensions ?? []), myTheme]}
      theme={theme === "dark" ? githubDark : githubLight}
    />
  );
};
