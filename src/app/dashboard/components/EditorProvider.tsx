"use client";

import {
  ComponentType,
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";

export interface BaseEditorProps {
  id: string | null;
  className?: string;
  onClose: () => void;
  onSaved: () => void;
}

interface EditorContextType {
  openEditor: (id: string | null) => void;
  closeEditor: () => void;
  isOpen: boolean;
}

const EditorContext = createContext<EditorContextType | null>(null);

// Hook
export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within a EditorProvider");
  }
  return context;
}

export default function EditorProvider({
  children,
  editorComponent: Editor,
  onSaved,
}: {
  children: ReactElement<{ children?: ReactNode }>;
  editorComponent: ComponentType<BaseEditorProps>;
  onSaved?: () => Promise<void> | void;
}) {
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const openEditor = (id: string | null) => {
    setEditingId(id);
    setShowEditor(true);
  };

  const closeEditor = async () => {
    setShowEditor(false);
    setEditingId(null);
  };

  return (
    <EditorContext.Provider
      value={{ openEditor, closeEditor, isOpen: showEditor }}
    >
      {children}
      {showEditor && (
        <Editor
          key={editingId || "new"}
          id={editingId}
          onClose={closeEditor}
          onSaved={async () => {
            await onSaved?.();
            closeEditor();
          }}
          className="fixed inset-[anchor(top)_anchor(right)_anchor(bottom)_anchor(left)] z-100 [position-anchor:--dashboard]"
        />
      )}
    </EditorContext.Provider>
  );
}
