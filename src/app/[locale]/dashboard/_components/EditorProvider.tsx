"use client";

import {
  type ComponentType,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";

import ModalProvider, { useModal } from "./ModalProvider";

export interface BaseEditorProps {
  id: string | null;
  className?: string;
  onClose: () => void;
  onSaved: () => Promise<void>;
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

function EditorProviderContent({
  children,
  editorComponent: Editor,
  onSaved,
}: {
  children: ReactNode;
  editorComponent: ComponentType<BaseEditorProps>;
  onSaved?: () => Promise<void> | void;
}) {
  const { open, close, isOpen } = useModal();

  const openEditor = useCallback(
    (id: string | null) => {
      open(
        <Editor
          key={id || "new"}
          id={id}
          onClose={close}
          onSaved={async () => {
            await onSaved?.();
            close();
          }}
          className="h-full min-h-0 w-full overflow-hidden"
        />,
      );
    },
    [Editor, close, onSaved, open],
  );

  const value = useMemo(
    () => ({
      openEditor,
      closeEditor: close,
      isOpen,
    }),
    [close, isOpen, openEditor],
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export default function EditorProvider(props: {
  children: ReactNode;
  editorComponent: ComponentType<BaseEditorProps>;
  onSaved?: () => Promise<void> | void;
}) {
  return (
    <ModalProvider>
      <EditorProviderContent {...props} />
    </ModalProvider>
  );
}
