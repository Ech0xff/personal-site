"use client";

import { Plus } from "lucide-react";

import { useEditor } from "@/app/dashboard/components/EditorProvider";
import Button from "@/components/ui/Button";

export default function NewThoughtButton() {
  const { openEditor } = useEditor();

  return (
    <Button onClick={() => openEditor(null)}>
      <Plus className="h-4 w-4" />
      New Thought
    </Button>
  );
}
