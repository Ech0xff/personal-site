import type { ReactNode } from "react";

import type { ContainerDirective, TextDirective } from "mdast-util-directive";

export type DirectiveAttributes = Record<string, string | undefined>;
export type ContentDirectiveNode = ContainerDirective | TextDirective;
export type DirectiveNodeType = "containerDirective" | "textDirective";

export interface RenderProps {
  attributes: DirectiveAttributes;
  children?: ReactNode;
}

export interface DirectiveRenderProps extends RenderProps {
  directive: string;
  directiveType: DirectiveNodeType;
}

export interface DirectiveRegistration {
  directive: string;
  directiveType: DirectiveNodeType;
  checkAttributes?: (attributes: DirectiveAttributes) => void;
  render: (props: RenderProps) => ReactNode;
}

export type DirectiveRegistrationMap = Partial<
  Record<DirectiveNodeType, Record<string, DirectiveRegistration>>
>;
