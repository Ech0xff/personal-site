"use client";

import { AlertTriangle, Home } from "lucide-react";

import Link from "@/components/ui/Link";
import Stack from "@/components/ui/Stack";

interface Props {
  error: Error & { digest?: string };
}

export default function ErrorPage({ error }: Props) {
  const message =
    error.message.trim() || "An unexpected error interrupted this page.";

  return (
    <div className="flex h-svh w-svw items-center justify-center px-6 py-12">
      <Stack
        y
        className="w-full max-w-md items-center gap-5 rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
          <AlertTriangle className="size-7" />
        </div>

        <Stack y className="gap-2">
          <h1 className="font-semibold text-xl text-zinc-900 dark:text-zinc-50">
            Something went wrong
          </h1>
          <p className="wrap-break-word text-sm text-zinc-600 leading-6 dark:text-zinc-300">
            {message}
          </p>
        </Stack>

        <Link
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-blue-700"
          href="/"
        >
          <Home className="size-4" />
          Go Home
        </Link>
      </Stack>
    </div>
  );
}
