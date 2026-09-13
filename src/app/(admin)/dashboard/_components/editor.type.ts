import type { StyleInput } from "#design/style.type";

export interface BaseEditorProps {
  id: string | null;
  xstyle?: StyleInput;
  onClose: () => void;
  onSaved: () => Promise<void>;
}
