export interface BaseEditorProps {
  id: string | null;
  className?: string;
  onClose: () => void;
  onSaved: () => Promise<void>;
}
