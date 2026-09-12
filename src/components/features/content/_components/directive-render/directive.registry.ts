import type {
  DirectiveNodeType,
  DirectiveRegistration,
  DirectiveRegistrationMap,
} from "./directive.type";
import cardDirectiveConfig from "./renders/card-render.extension";
import metaDirectiveConfig from "./renders/meta-render.extension";
import refDirectiveConfig from "./renders/ref-render.extension";

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
