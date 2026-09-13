import * as stylex from "@stylexjs/stylex";
import type { Element, Root } from "hast";
import type { ComponentPropsWithoutRef } from "react";
import { visit } from "unist-util-visit";

import CopyButton from "#components/ui/copy-button.component";
import Image from "#components/ui/image.component";
import { color, font, space, shape } from "#design/tokens.stylex";
import { encodePlantUml } from "#lib/shared/utils";

import "./pre-render.component.css";
const styles = stylex.create({
  codeTheme: {
    color: color.codeText,
    fontFamily: font.mono,
    overflowX: "auto",
    fontSize: "inherit",
    lineHeight: 1.7,
    "--syntax-comment": color.codeComment,
    "--syntax-keyword": color.codeKeyword,
    "--syntax-string": color.codeString,
    "--syntax-function": color.codeFunction,
    "--syntax-class": color.codeClass,
    "--syntax-number": color.codeNumber,
    "--syntax-operator": color.codeOperator,
    "--syntax-regex": color.codeRegex,
    "--syntax-muted": color.muted,
  },
  container: {
    overflow: "hidden",
    borderTopLeftRadius: shape.card,
    borderTopRightRadius: shape.card,
    borderBottomRightRadius: shape.card,
    borderBottomLeftRadius: shape.card,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    borderTopColor: color.line,
    borderRightColor: color.line,
    borderBottomColor: color.line,
    borderLeftColor: color.line,
    backgroundColor: color.surfaceMuted,
    fontSize: "0.9em",
  },
  container2: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.sm,
    borderBottomWidth: shape.fine,
    borderBottomStyle: "solid",
    borderTopColor: color.line,
    borderRightColor: color.line,
    borderBottomColor: color.line,
    borderLeftColor: color.line,
    backgroundColor: `color-mix(in srgb, ${color.surfaceMuted} 90%, transparent)`,
    paddingLeft: space.sm,
    paddingRight: space.sm,
    paddingTop: space.xxs,
    paddingBottom: space.xxs,
    fontWeight: font.medium,
    letterSpacing: ".025em",
    textTransform: "uppercase",
  },
  label: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  icon: {
    fontSize: font.small,
    lineHeight: 1.5,
  },
  code: {
    paddingTop: space.sm,
    paddingRight: space.sm,
    paddingBottom: space.sm,
    paddingLeft: space.sm,
  },
  image: {
    borderTopLeftRadius: "0",
    borderTopRightRadius: "0",
    borderBottomRightRadius: "0",
    borderBottomLeftRadius: "0",
    borderTopStyle: "none",
    borderRightStyle: "none",
    borderBottomStyle: "none",
    borderLeftStyle: "none",
  },
});
interface Props extends ComponentPropsWithoutRef<"pre"> {
  code?: string;
  language?: string;
}
const PLANTUML_SERVER_URL = "https://www.plantuml.com/plantuml";
function CodeBlockRender({
  children,
  code,
  language = "TEXT",
  ...props
}: Props) {
  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.container2)}>
        <span {...stylex.props(styles.label)}>{language}</span>
        <CopyButton content={code} xstyle={styles.icon} />
      </div>
      <pre
        {...props}
        data-code-preview
        {...stylex.props(styles.codeTheme, styles.code)}
      >
        {children}
      </pre>
    </div>
  );
}
function PlantUmlRender({ code = "" }: Props) {
  const encoded = encodePlantUml(code);
  return (
    <Image
      xstyle={styles.image}
      fit="contain"
      variant="fluid"
      src={`${PLANTUML_SERVER_URL}/svg/${encoded}`}
      alt="PlantUML diagram"
    />
  );
}
export function PreRender(props: Props) {
  const language = (props.language ?? "TEXT").toUpperCase();
  if (language === "PLANTUML" || language === "PUML") {
    return <PlantUmlRender {...props} />;
  }
  return <CodeBlockRender {...props} />;
}
export const rehypeCodeBlockProps = () => {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "pre") return;
      const codeNode = node.children.find(
        (child): child is Element =>
          child.type === "element" && child.tagName === "code",
      );
      const code =
        codeNode?.children[0]?.type === "text"
          ? codeNode.children[0].value
          : undefined;
      if (!code || !codeNode) return;
      const className = codeNode.properties.className;
      const firstClassName =
        typeof className === "string"
          ? className
          : Array.isArray(className) && typeof className[0] === "string"
            ? className[0]
            : "";
      const language = firstClassName.match(/language-([a-z0-9+#-]+)/i)?.[1];
      node.properties = {
        ...node.properties,
        code,
        language,
      };
    });
  };
};
