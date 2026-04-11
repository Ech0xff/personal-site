import cardDirectiveConfig from "./renders/CardRender";
import metaDirectiveConfig from "./renders/MetaRender";
import refDirectiveConfig from "./renders/RefRender";
import type {
  DirectiveNodeType,
  DirectiveRegistration,
  DirectiveRegistrationMap,
} from "./types";

export const directiveRenderRegistry: DirectiveRegistrationMap = {
  containerDirective: {
    [cardDirectiveConfig.directive]: cardDirectiveConfig,
  },
  textDirective: {
    [metaDirectiveConfig.directive]: metaDirectiveConfig,
    [refDirectiveConfig.directive]: refDirectiveConfig,
  },
};

export function getDirectiveRegistration(
  directiveType: DirectiveNodeType,
  directive?: string,
): DirectiveRegistration | undefined {
  if (!directive) return undefined;
  const registrations = directiveRenderRegistry[directiveType];
  if (!registrations) return undefined;
  return registrations[directive];
}
