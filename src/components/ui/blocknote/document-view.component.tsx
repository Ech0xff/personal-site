"use client";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef } from "react";

import { blocknoteStyles } from "./block-editor.style";
import { activateCodeControl, showDiagramError } from "./code-block.helper";

import "@blocknote/mantine/style.css";
import "./block-editor.css";

export default function DocumentView({ html }: Readonly<{ html: string }>) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const click = (event: MouseEvent) => {
      void activateCodeControl(event.target);
    };
    const error = (event: Event) => showDiagramError(event.target);
    element.addEventListener("click", click);
    element.addEventListener("error", error, true);
    return () => {
      element.removeEventListener("click", click);
      element.removeEventListener("error", error, true);
    };
  }, []);
  return (
    <div
      ref={root}
      data-cms-blocknote
      data-readonly
      {...stylex.props(blocknoteStyles.root, blocknoteStyles.readonly)}
    >
      <div className="bn-container">
        <div className="bn-editor" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
