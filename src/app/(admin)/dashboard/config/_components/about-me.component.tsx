import * as stylex from "@stylexjs/stylex";

import { MarkdownEditor } from "#components/ui/codemirror";
import { color, space, shape } from "#design/tokens.stylex";
import { CONFIG_KEY } from "#lib/shared/config";

import ContentRenderer from "../../_components/features/content/content-renderer.component";
import useConfig from "../_hooks/config.hook";
import EditorShell from "./editor-shell.component";
const styles = stylex.create({
  icon: {
    height: "80%",
    width: "80%",
  },
  container: {
    display: "grid",
    minHeight: "0px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    gridTemplateColumns: {
      default: "repeat(1, minmax(0, 1fr))",
      "@media (min-width: 1024px)": "repeat(2, minmax(0, 1fr))",
    },
    gap: space.md,
  },
  container2: {
    opacity: 0,
  },
  container3: {
    minHeight: "0px",
    overflow: "hidden",
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
  },
  icon2: {
    height: "100%",
    minHeight: "0px",
    overflow: "auto",
  },
  container4: {
    minHeight: "0px",
    overflow: "auto",
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
    backgroundColor: color.surface,
  },
  contentRenderer: {
    minHeight: "100%",
    paddingTop: space.md,
    paddingRight: space.md,
    paddingBottom: space.md,
    paddingLeft: space.md,
  },
});
const title = "About Me";
export default function AboutMe() {
  const { value, setValue, loading, hasStoredValue, deleteConfig, saveConfig } =
    useConfig({
      key: CONFIG_KEY.ABOUT_ME,
    });
  return (
    <EditorShell
      xstyle={styles.icon}
      title={title}
      onDelete={hasStoredValue ? deleteConfig : undefined}
      onSave={() => saveConfig(value)}
      loading={loading}
    >
      <div {...stylex.props([styles.container, loading && styles.container2])}>
        <div {...stylex.props(styles.container3)}>
          <MarkdownEditor
            value={value}
            mode="live"
            onChange={setValue}
            xstyle={styles.icon2}
          />
        </div>
        <div {...stylex.props(styles.container4)}>
          <ContentRenderer
            content={value || "No content"}
            xstyle={styles.contentRenderer}
          />
        </div>
      </div>
    </EditorShell>
  );
}
