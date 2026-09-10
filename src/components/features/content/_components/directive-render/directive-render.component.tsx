import { TriangleAlert } from "lucide-react";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import { z } from "zod";

import {
  CONTENT_DIRECTIVE_NODE_TYPES,
  DIRECTIVE_RENDER_ELEMENT_NAME,
} from "./directive.const";
import { getDirectiveRegistration } from "./directive.registry";
import type {
  ContentDirectiveNode,
  DirectiveRenderProps,
} from "./directive.type";

function ErrorDirectiveMessage({ message }: { message: string }) {
  return (
    <span
      className="group relative isolate inline-flex items-center align-middle text-rose-600 dark:text-rose-400"
      title={message}
      aria-label={`Directive error: ${message}`}
    >
      <TriangleAlert className="h-4 w-4" aria-hidden="true" />
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
