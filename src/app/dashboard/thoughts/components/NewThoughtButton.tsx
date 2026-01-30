"use client";

import { Plus } from "lucide-react";

import { useEditor } from "./EditorProvider";

export default function NewThoughtButton() {
  const { openEditor } = useEditor();

  return (
    <button
      onClick={() => openEditor(null)}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
    >
      <Plus className="h-4 w-4" />
      New Thought
    </button>
  );
}
