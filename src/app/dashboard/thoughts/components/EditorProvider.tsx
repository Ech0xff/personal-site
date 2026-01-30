"use client";

import { ReactNode, createContext, useContext, useState } from "react";

import ThoughtEditor from "./ThoughtEditor";

interface EditorContextType {
  openEditor: (thoughtId: string | null) => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within EditorProvider");
  }
  return context;
}

interface EditorProviderProps {
  children: ReactNode;
}

export function EditorProvider({ children }: EditorProviderProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [editingThoughtId, setEditingThoughtId] = useState<string | null>(null);

  const openEditor = (thoughtId: string | null) => {
    setEditingThoughtId(thoughtId);
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingThoughtId(null);
  };

  return (
    <EditorContext.Provider value={{ openEditor }}>
      {children}
      {showEditor && (
        <ThoughtEditor
          thoughtId={editingThoughtId}
          onClose={closeEditor}
          onSaved={closeEditor}
        />
      )}
    </EditorContext.Provider>
  );
}
