"use client";

import { Plus } from "lucide-react";

import Button from "@/components/ui/Button";
import { useEditor } from "../../../components/EditorProvider";

export default function NewPostButton() {
  const { openEditor } = useEditor();

  return (
    <Button onClick={() => openEditor(null)}>
      <Plus className="h-4 w-4" />
      New Post
    </Button>
  );
}
