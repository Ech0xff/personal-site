"use client";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

import Input from "#components/ui/input.component";
import { makeBrowserClient } from "#lib/client/supabase.client";
import { getUserStatus } from "#lib/shared/auth/session.service";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function AuthorInput({ value, onChange, disabled }: Props) {
  const supabase = useMemo(() => makeBrowserClient(), []);

  useEffect(() => {
    if (value) return;

    const fillNickname = async () => {
      const userStatus = await getUserStatus(supabase);
      const nickname = userStatus.metadata.nickname;
      if (nickname && !value) {
        onChange(nickname);
      }
    };

    fillNickname().catch(() => toast.error("Failed to load author nickname"));
  }, [onChange, supabase, value]);

  return (
    <div className="flex items-center rounded-lg bg-surface-muted p-1">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        placeholder="Author"
        disabled={disabled}
        controlSize="sm"
        className="w-32 border-0 bg-transparent text-sm"
      />
    </div>
  );
}
