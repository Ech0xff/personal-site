import * as stylex from "@stylexjs/stylex";

import { blocknoteStyles } from "./block-editor.style";

import "@blocknote/mantine/style.css";
import "./block-editor.css";

export default function DocumentView({ html }: Readonly<{ html: string }>) {
  return (
    <div
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
