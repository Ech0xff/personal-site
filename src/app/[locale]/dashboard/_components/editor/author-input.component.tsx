"use client";

import { useEffect, useMemo } from "react";
import { toast } from "sonner";

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
    <div className="flex items-center rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        placeholder="Author"
        disabled={disabled}
        className="w-32 px-3 py-1.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed dark:text-zinc-100 dark:placeholder:text-zinc-300"
      />
    </div>
  );
}
