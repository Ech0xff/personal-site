import "server-only";
import { ServerBlockNoteEditor } from "@blocknote/server-util";

import {
  documentSchema,
  type BlockDocument,
} from "#lib/shared/content/document.schema";

let renderer: ServerBlockNoteEditor | undefined;
let rendering: Promise<void> = Promise.resolve();

export async function renderDocument(document: BlockDocument): Promise<string> {
  const blocks = documentSchema.parse(document);
  // The exporter temporarily changes JSDOM globals; serialize exports across requests.
  const result = rendering.then(() => {
    renderer ??= ServerBlockNoteEditor.create();
    return renderer.blocksToFullHTML(blocks);
  });
  rendering = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}
