import "server-only";
import { cacheLife } from "next/cache";

import type { BlockDocument } from "#lib/shared/content/document.schema";

import {
  renderArticleDocument,
  renderDocument,
} from "./document-render.service";

export async function renderCachedDocument(document: BlockDocument) {
  "use cache";
  cacheLife("hours");
  return renderDocument(document);
}
export async function renderCachedArticle(document: BlockDocument) {
  "use cache";
  cacheLife("hours");
  return renderArticleDocument(document);
}
