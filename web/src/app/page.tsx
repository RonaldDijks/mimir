"use client";

import { compile } from "@mimir/core";
import { dedent } from "@mimir/core/src/util/dedent";
import ReactCodeMirror from "@uiw/react-codemirror";
import { useMemo, useState } from "react";

const initial = dedent`
let x = 10
let y = 20
x + y
`;

export default function Home() {
  const [sourceCode, setSourceCode] = useState(initial);

  const compiled = useMemo(() => {
    try {
      return compile(sourceCode);
    } catch (error) {
      console.log(error);
      return null;
    }
  }, [sourceCode]);

  return (
    <div className="h-screen w-screen grid grid-cols-2">
      <div className="min-h-screen overflow-y-scroll">
        <ReactCodeMirror
          height="100%"
          value={sourceCode}
          onChange={(value) => setSourceCode(value)}
        />
      </div>
      <div className="min-h-screen overflow-y-scroll">
        <ReactCodeMirror
          height="100%"
          value={JSON.stringify(compiled, null, 2)}
          readOnly
        />
      </div>
    </div>
  );
}
