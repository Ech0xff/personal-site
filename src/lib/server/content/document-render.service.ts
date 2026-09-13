import "server-only";
import { ServerBlockNoteEditor } from "@blocknote/server-util";

import { prepareArticle } from "#lib/shared/content/article.helper";
import {
  documentSchema,
  type BlockDocument,
} from "#lib/shared/content/document.schema";

let renderer: ServerBlockNoteEditor | undefined;
let rendering: Promise<void> = Promise.resolve();

export async function renderDocument(document: BlockDocument): Promise<string> {
  const blocks = documentSchema.parse(document);
  // The exporter temporarily changes JSDOM globals; serialize exports across requests.
  const result = rendering.then(async () => {
    renderer ??= ServerBlockNoteEditor.create();
    const html = await renderer.blocksToFullHTML(blocks);
    // Use the exporter's DOM context so media attributes are escaped by the serializer.
    return renderer._withJSDOM(async () => {
      const container = globalThis.document.createElement("div");
      container.innerHTML = html;
      for (const image of container.querySelectorAll("img[src]")) {
        if (image.closest("a, button")) continue;
        const src = image.getAttribute("src");
        if (!src) continue;
        const alt =
          image.getAttribute("alt") ||
          image
            .closest('[data-content-type="image"]')
            ?.querySelector(".bn-file-caption")?.textContent ||
          "";
        const trigger = globalThis.document.createElement("button");
        trigger.type = "button";
        trigger.setAttribute("data-viewer-trigger", "");
        trigger.setAttribute("data-src", src);
        trigger.setAttribute("data-alt", alt);
        trigger.setAttribute(
          "aria-label",
          alt ? `Preview ${alt}` : "Preview image",
        );
        image.setAttribute("loading", "lazy");
        image.setAttribute("decoding", "async");
        image.replaceWith(trigger);
        trigger.append(image);
      }
      return container.innerHTML;
    });
  });
  rendering = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

/** Attach anchors only to exporter-generated heading tags, never to source text. */
export async function renderArticleDocument(document: BlockDocument) {
  const { blocks, headings } = prepareArticle(documentSchema.parse(document));
  const html = await renderDocument(blocks);
  let index = 0;
  return {
    html: html.replace(/<h([1-6])\b/g, (tag) => {
      const heading = headings.at(index++);
      return heading ? `${tag} id="${heading.id}"` : tag;
    }),
    headings: headings.filter((heading) => heading.text.length > 0),
  };
}
