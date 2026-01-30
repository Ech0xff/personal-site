"use client";

import {
  ComponentType,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";

export interface BaseEditorProps {
  id: string | null;
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
}: {
  children: ReactNode;
  editorComponent: ComponentType<BaseEditorProps>;
}) {
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const openEditor = (id: string | null) => {
    setEditingId(id);
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingId(null);
  };

  return (
    <EditorContext.Provider
      value={{ openEditor, closeEditor, isOpen: showEditor }}
    >
      {children}
      {showEditor && (
        <Editor id={editingId} onClose={closeEditor} onSaved={closeEditor} />
      )}
    </EditorContext.Provider>
  );
}
