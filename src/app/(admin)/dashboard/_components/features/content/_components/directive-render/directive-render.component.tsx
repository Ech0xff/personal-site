import * as stylex from "@stylexjs/stylex";
import { TriangleAlert } from "lucide-react";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import { z } from "zod";

import { group } from "#design/interaction.stylex";
import { color, space } from "#design/tokens.stylex";

import {
  CONTENT_DIRECTIVE_NODE_TYPES,
  DIRECTIVE_RENDER_ELEMENT_NAME,
} from "./directive.const";
import { getDirectiveRegistration } from "./directive.registry";
import type {
  ContentDirectiveNode,
  DirectiveRenderProps,
} from "./directive.type";
const styles = stylex.create({
  label: {
    position: "relative",
    isolation: "isolate",
    display: "inline-flex",
    alignItems: "center",
    verticalAlign: "middle",
    color: color.dangerText,
  },
  triangleAlert: {
    height: space.md,
    width: space.md,
  },
});
function ErrorDirectiveMessage({ message }: { message: string }) {
  return (
    <span
      {...stylex.props([styles.label, group])}
      title={message}
      aria-label={`Directive error: ${message}`}
    >
      <TriangleAlert
        {...stylex.props(styles.triangleAlert)}
        aria-hidden="true"
      />
    </span>
  );
}
export function DirectiveRender({
  attributes,
  children,
  directive,
  directiveType,
}: DirectiveRenderProps) {
  try {
    const registration = getDirectiveRegistration(directiveType, directive);
    if (!registration) {
      throw new Error(
        `No registration found for directive "${directive}" of type "${directiveType}"`,
      );
    }
    const parsedAttributes: unknown = JSON.parse(z.string().parse(attributes));
    return registration.render({
      attributes: parsedAttributes,
      children,
    });
  } catch (error) {
    return (
      <ErrorDirectiveMessage
        message={error instanceof Error ? error.message : "Unknown error"}
      />
    );
  }
}
export const remarkContentNodes = () => {
  return (tree: Root) => {
    for (const directiveType of CONTENT_DIRECTIVE_NODE_TYPES) {
      visit(tree, directiveType, (node: ContentDirectiveNode) => {
        node.data = {
          ...node.data,
          hName: DIRECTIVE_RENDER_ELEMENT_NAME,
          hProperties: {
            directive: node.name,
            directiveType: node.type,
            attributes: JSON.stringify(node.attributes ?? {}),
          },
        };
      });
    }
  };
};
