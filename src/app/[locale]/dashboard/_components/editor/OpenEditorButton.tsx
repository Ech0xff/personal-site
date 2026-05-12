"use client";

import { Plus } from "lucide-react";

import Button from "@/components/ui/Button";

interface Props {
  label: string;
  openEditor: (id: string | null) => void;
}

export default function OpenEditorButton({ label, openEditor }: Props) {
  return (
    <Button onClick={() => openEditor(null)}>
      <Plus className="h-4 w-4" />
      {label}
    </Button>
  );
}
