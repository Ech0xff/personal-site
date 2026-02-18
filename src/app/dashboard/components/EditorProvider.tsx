"use client";

import {
  ComponentType,
  ReactElement,
  ReactNode,
  cloneElement,
  createContext,
  useContext,
  useState,
} from "react";

export interface BaseEditorProps {
  id: string | null;
  show: boolean;
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

  const editorNode = (
    <Editor
      id={editingId}
      show={showEditor}
      onClose={closeEditor}
      onSaved={() => {
        if (onSaved) onSaved();
        closeEditor();
      }}
    />
  );

  const childrenWithEditor = cloneElement(
    children,
    undefined,
    <>
      {children.props.children}
      {editorNode}
    </>,
  );

  return (
    <EditorContext.Provider
      value={{ openEditor, closeEditor, isOpen: showEditor }}
    >
      {childrenWithEditor}
    </EditorContext.Provider>
  );
}
