import { metaAttributesSchema } from "../directive.schema";
import type { RenderProps } from "../types";
import MetaRenderClient from "./MetaRende.client";

function render({ attributes }: RenderProps) {
  const { url } = metaAttributesSchema.parse(attributes);
  return <MetaRenderClient url={url} />;
}

const metaDirectiveConfig = {
  directive: "meta",
  directiveType: "textDirective" as const,
  render,
};

export default metaDirectiveConfig;
