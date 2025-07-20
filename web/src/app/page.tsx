"use client";

import { dedent } from "@mimir/core/src/util/dedent";
import { useState } from "react";
import { Editor } from "@/components/Editor";
import { Header } from "@/components/Header";
import { Viewer } from "@/components/Viewer";

const initial = dedent`
let x = 10
let y = 20
x + y
`;

export default function Home() {
  const [sourceCode, setSourceCode] = useState(initial);

  return (
    <div className="h-screen max-h-screen flex flex-col">
      <Header />
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 overflow-hidden gap-2 mx-2 mb-2">
        <div className="overflow-hidden">
          <Editor value={sourceCode} onChange={setSourceCode} />
        </div>
        <div className="overflow-hidden">
          <Viewer value={sourceCode} />
        </div>
      </div>
    </div>
  );
}
