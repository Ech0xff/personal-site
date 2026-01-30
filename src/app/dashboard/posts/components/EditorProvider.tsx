"use client";

import { ReactNode, createContext, useContext, useState } from "react";

import PostEditor from "./PostEditor";

interface EditorContextType {
  openEditor: (postId: string | null) => void;
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
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const openEditor = (postId: string | null) => {
    setEditingPostId(postId);
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingPostId(null);
  };

  return (
    <EditorContext.Provider value={{ openEditor }}>
      {children}
      {showEditor && (
        <PostEditor
          postId={editingPostId}
          onClose={closeEditor}
          onSaved={closeEditor}
        />
      )}
    </EditorContext.Provider>
  );
}
