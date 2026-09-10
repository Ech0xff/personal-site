import type { DirectiveNodeType } from "./directive.type";

export const CONTENT_DIRECTIVE_NODE_TYPES = [
  "containerDirective",
  "textDirective",
] as const satisfies readonly DirectiveNodeType[];

export const DIRECTIVE_RENDER_ELEMENT_NAME = "directive-render";
