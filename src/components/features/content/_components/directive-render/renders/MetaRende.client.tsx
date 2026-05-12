"use client";

import { ExternalLink, Globe2 } from "lucide-react";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/shared/utils";

type MicrolinkImage = {
  url?: string;
};

type MicrolinkData = {
  title?: string;
  description?: string;
  publisher?: string;
  url?: string;
  image?: MicrolinkImage;
  logo?: MicrolinkImage;
};

type MicrolinkResponse = {
  status?: string;
  data?: MicrolinkData;
  message?: string;
};

type MetadataState =
  | { status: "loading" }
  | { status: "success"; metadata: MicrolinkData }
  | { status: "error"; message: string };

interface Props {
  url: string;
}

const cardClassName = cn(
  "not-prose my-4 flex h-32 w-full overflow-hidden rounded-lg border border-zinc-200 bg-white no-underline shadow-sm transition-colors",
  "hover:border-zinc-300 hover:bg-zinc-50",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40",
  "dark:border-zinc-600/80 dark:bg-[#18181b] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_12px_28px_rgba(0,0,0,0.32)]",
  "dark:hover:border-zinc-500 dark:hover:bg-[#202024]",
);

const resolveHost = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

function MetaSkeleton({ url }: { url: string }) {
  return (
    <a
      className={cardClassName}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="flex min-h-0 min-w-0 flex-1 flex-col justify-between p-4">
        <span className="block h-4 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-600" />
        <span className="space-y-2">
          <span className="block h-3 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-700" />
          <span className="block h-3 w-4/5 animate-pulse rounded bg-zinc-100 dark:bg-zinc-700" />
        </span>
        <span className="block h-3 w-32 animate-pulse rounded bg-zinc-100 dark:bg-zinc-700" />
      </span>
    </a>
  );
}

function MetaError({ message, url }: { message: string; url: string }) {
  return (
    <a
      className={cn(
        "not-prose my-4 flex h-20 w-full items-center gap-3 overflow-hidden rounded-lg border border-rose-200 bg-rose-50/80 p-4 no-underline shadow-sm",
        "text-rose-950 hover:bg-rose-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40",
        "dark:border-rose-900/60 dark:bg-rose-950/35 dark:text-rose-100 dark:hover:bg-rose-950/50",
      )}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        <Globe2 className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 text-sm">{message}</span>
      <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
    </a>
  );
}

function MetaContent({
  metadata,
  url,
}: {
  metadata: MicrolinkData;
  url: string;
}) {
  const href = metadata.url || url;
  const hostname = resolveHost(href);
  const imageUrl = metadata.image?.url;
  const logoUrl = metadata.logo?.url;
  const cardTitle = metadata.title || hostname;

  return (
    <a
      className={cn(cardClassName, "group")}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-2 p-4">
        <span className="flex min-w-0 items-center gap-2 font-medium text-xs text-zinc-500 leading-none dark:text-zinc-400">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-200">
            {logoUrl ? (
              <Image
                className="m-0 h-4 w-4 object-contain"
                src={logoUrl}
                alt=""
                width={16}
                height={16}
                loading="lazy"
                unoptimized
              />
            ) : (
              <Globe2 className="h-4 w-4" aria-hidden="true" />
            )}
          </span>
          <span className="min-w-0 flex-1 truncate">
            {metadata.publisher || hostname}
          </span>
          <ExternalLink
            className="h-3.5 w-3.5 shrink-0 opacity-65 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </span>
        <span className="block min-w-0 space-y-1 overflow-hidden">
          <span className="m-0 block truncate font-semibold text-base text-zinc-950 leading-snug dark:text-zinc-50">
            {cardTitle}
          </span>
          {metadata.description ? (
            <span className="m-0 block truncate text-sm text-zinc-600 leading-5 dark:text-zinc-300">
              {metadata.description}
            </span>
          ) : null}
        </span>
        <span className="truncate text-xs text-zinc-500 leading-none dark:text-zinc-400">
          {hostname}
        </span>
      </span>
      {imageUrl ? (
        <span className="relative hidden w-36 shrink-0 border-zinc-200 border-l bg-zinc-100 sm:block dark:border-zinc-600/80 dark:bg-[#111113]">
          <Image
            className="m-0 h-full w-full object-cover"
            src={imageUrl}
            alt=""
            fill
            loading="lazy"
            sizes="144px"
            unoptimized
          />
        </span>
      ) : null}
    </a>
  );
}

export default function MetaRenderClient({ url }: Props) {
  const [state, setState] = useState<MetadataState>({ status: "loading" });

  const metadataUrl = useMemo(() => {
    const endpoint = new URL("https://api.microlink.io/");
    endpoint.searchParams.set("url", url);
    return endpoint.toString();
  }, [url]);

  useEffect(() => {
    const controller = new AbortController();

    setState({ status: "loading" });

    fetch(metadataUrl, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load link metadata.");
        }

        const payload = (await response.json()) as MicrolinkResponse;
        if (payload.status !== "success" || !payload.data) {
          throw new Error(payload.message || "Failed to load link metadata.");
        }

        setState({ status: "success", metadata: payload.data });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Failed to load link metadata.",
        });
      });

    return () => controller.abort();
  }, [metadataUrl]);

  if (state.status === "loading") return <MetaSkeleton url={url} />;

  if (state.status === "error") {
    return <MetaError message={state.message} url={url} />;
  }

  return <MetaContent metadata={state.metadata} url={url} />;
}
