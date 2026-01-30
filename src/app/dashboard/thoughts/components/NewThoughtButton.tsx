"use client";

import { Plus } from "lucide-react";

import Button from "@/components/ui/Button";

import { useEditor } from "./EditorProvider";

export default function NewThoughtButton() {
  const { openEditor } = useEditor();

  return (
    <Button onClick={() => openEditor(null)}>
      <Plus className="h-4 w-4" />
      New Thought
    </Button>
  );
}
