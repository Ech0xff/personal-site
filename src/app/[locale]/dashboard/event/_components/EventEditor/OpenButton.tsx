"use client";

import { Plus } from "lucide-react";

import Button from "@/components/ui/Button";

interface Props {
  openEditor: (id: string | null) => void;
}

export default function NewEventButton({ openEditor }: Props) {
  return (
    <Button onClick={() => openEditor(null)}>
      <Plus className="h-4 w-4" />
      New Event
    </Button>
  );
}
