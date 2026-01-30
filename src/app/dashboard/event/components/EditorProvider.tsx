"use client";

import { ReactNode, createContext, useContext, useState } from "react";

import EventEditor from "./EventEditor";

interface EditorContextType {
  openEditor: (eventId: string | null) => void;
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
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const openEditor = (eventId: string | null) => {
    setEditingEventId(eventId);
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingEventId(null);
  };

  return (
    <EditorContext.Provider value={{ openEditor }}>
      {children}
      {showEditor && (
        <EventEditor
          eventId={editingEventId}
          onClose={closeEditor}
          onSaved={closeEditor}
        />
      )}
    </EditorContext.Provider>
  );
}
