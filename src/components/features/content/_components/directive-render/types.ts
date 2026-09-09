import type { ContainerDirective, TextDirective } from "mdast-util-directive";
import type { ReactNode } from "react";

export type ContentDirectiveNode = ContainerDirective | TextDirective;
export type DirectiveNodeType = "containerDirective" | "textDirective";

export interface RenderProps {
  attributes: unknown;
  children?: ReactNode;
}

export interface DirectiveRenderProps extends RenderProps {
  directive: string;
  directiveType: DirectiveNodeType;
}

export interface DirectiveRegistration {
  directive: string;
  directiveType: DirectiveNodeType;
  render: (props: RenderProps) => ReactNode;
}

export type DirectiveRegistrationMap = Partial<
  Record<DirectiveNodeType, Record<string, DirectiveRegistration>>
>;
