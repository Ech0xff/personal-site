import type { Element, Root } from "hast";
import type { ComponentPropsWithoutRef } from "react";
import { visit } from "unist-util-visit";

import CopyButton from "@/components/ui/CopyButton";
import { cn, encodePlantUml } from "@/lib/shared/utils";
import Image from "../../Image";
import "./PreRender.scss";

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
    <div className="not-prose overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 text-[0.9em] dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-3 border-zinc-200 border-b bg-zinc-100/90 px-3 py-1 font-medium uppercase tracking-wide dark:border-zinc-800 dark:bg-zinc-800/90">
        <span className="truncate">{language}</span>
        <CopyButton content={code} className="text-xs" />
      </div>
      <pre
        {...props}
        className={cn("pre-render-code-block p-3", props.className)}
      >
        {children}
      </pre>
    </div>
  );
}

function PlantUmlRender({ className, code = "" }: Props) {
  const encoded = encodePlantUml(code);

  return (
    <Image
      className={cn("not-prose rounded-none border-none", className)}
      fit="contain"
      variant="fluid"
      src={`${PLANTUML_SERVER_URL}/svg/${encoded}`}
      alt="PlantUML diagram"
    />
  );
}

export function PreRender(props: Props) {
  const { language } = props;
  switch (language?.toUpperCase()) {
    case "PLANTUML":
    case "PUML":
      return <PlantUmlRender {...props} />;
    default:
      return <CodeBlockRender {...props} />;
  }
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
