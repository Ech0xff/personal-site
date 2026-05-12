import type { DirectiveAttributes, RenderProps } from "../types";
import MetaRenderClient from "./MetaRende.client";

type MetaAttributes = { url: string };

const checkAttributes = (attributes: DirectiveAttributes) => {
  const { url } = attributes;
  if (typeof url !== "string" || url.length === 0)
    throw new Error('Directive "meta" is missing required attribute "url".');
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      throw new Error();
    }
  } catch {
    throw new Error(`Directive "meta" has invalid attribute "url": "${url}".`);
  }
};

function render({ attributes }: RenderProps) {
  const { url } = attributes as MetaAttributes;
  return <MetaRenderClient url={url} />;
}

const metaDirectiveConfig = {
  directive: "meta",
  directiveType: "textDirective" as const,
  checkAttributes,
  render,
};

export default metaDirectiveConfig;
