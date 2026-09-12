"use client";

import { AlertTriangle, Home } from "lucide-react";

import Link from "#components/shared/link.component";
import Stack from "#components/ui/stack.component";
import { useDictionary } from "#dictionary";

interface Props {
  error: Error & { digest?: string };
}

export default function ErrorPage({ error }: Props) {
  const dictionary = useDictionary();
  const message = error.message.trim() || dictionary.errorPage.fallback;

  return (
    <div className="flex h-svh w-svw items-center justify-center px-6 py-12">
      <Stack
        y
        className="w-full max-w-md items-center gap-5 rounded-2xl border border-border-default bg-surface-panel p-8 text-center"
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-surface-muted text-text-secondary">
          <AlertTriangle className="size-7" />
        </div>
        <Stack y className="gap-2">
          <h1 className="text-xl font-semibold text-text-primary">
            {dictionary.errorPage.title}
          </h1>
          <p className="text-sm leading-6 wrap-break-word text-text-secondary">
            {message}
          </p>
        </Stack>
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-bg px-4 py-2 text-sm font-medium text-primary-fg transition-colors hover:bg-primary-hover"
          href="/"
        >
          <Home className="size-4" />
          {dictionary.errorPage.backHome}
        </Link>
      </Stack>
    </div>
  );
}
