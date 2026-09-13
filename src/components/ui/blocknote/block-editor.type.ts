import type { BlockDocument } from "#lib/shared/content/document.schema";
export type BlockEditorProps = Readonly<{
  initialContent: BlockDocument;
  editable?: boolean;
  onChange?: (content: BlockDocument) => void;
  onUploadChange?: (change: number) => void;
}>;
