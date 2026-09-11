"use client";

import { ExternalLink, Globe2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { cn } from "#lib/shared/utils";

import { parseMicrolinkResponse, type MicrolinkData } from "./microlink.schema";

type MetadataState =
  | { status: "loading" }
  | { status: "success"; metadata: MicrolinkData }
  | { status: "error"; message: string };

interface Props {
  url: string;
}

const cardClassName = cn(
  "not-prose my-4 flex h-32 w-full overflow-hidden rounded-lg border border-border-default bg-surface-panel no-underline shadow-sm transition-colors",
  "hover:border-border-strong hover:bg-surface-muted",
  "focus-visible:ring-2 focus-visible:ring-info-border/40 focus-visible:outline-none",
  "  ",
  " ",
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
      aria-label={`Open ${resolveHost(url)}`}
    >
      <span className="flex min-h-0 min-w-0 flex-1 flex-col justify-between p-4">
        <span className="block h-4 w-2/3 animate-pulse rounded bg-surface-hover-strong" />
        <span className="space-y-2">
          <span className="block h-3 w-full animate-pulse rounded bg-surface-muted" />
          <span className="block h-3 w-4/5 animate-pulse rounded bg-surface-muted" />
        </span>
        <span className="block h-3 w-32 animate-pulse rounded bg-surface-muted" />
      </span>
    </a>
  );
}

function MetaError({ message, url }: { message: string; url: string }) {
  return (
    <a
      className={cn(
        "not-prose my-4 flex h-20 w-full items-center gap-3 overflow-hidden rounded-lg border border-danger-border bg-danger-bg/80 p-4 no-underline shadow-sm",
        "text-danger-text hover:bg-danger-bg",
        "focus-visible:ring-2 focus-visible:ring-danger-border/40 focus-visible:outline-none",
        "   ",
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
        <span className="flex min-w-0 items-center gap-2 text-xs leading-none font-medium text-text-muted">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded bg-surface-muted text-text-muted">
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
            className="h-3.5 w-3.5 shrink-0 opacity-65 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
            aria-hidden="true"
          />
        </span>
        <span className="block min-w-0 space-y-1 overflow-hidden">
          <span className="m-0 block truncate text-base leading-snug font-semibold text-text-primary">
            {cardTitle}
          </span>
          {metadata.description ? (
            <span className="m-0 block truncate text-sm leading-5 text-text-secondary">
              {metadata.description}
            </span>
          ) : null}
        </span>
        <span className="truncate text-xs leading-none text-text-muted">
          {hostname}
        </span>
      </span>
      {imageUrl ? (
        <span className="relative hidden w-36 shrink-0 border-l border-border-default bg-surface-muted sm:block ">
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
        const payload = parseMicrolinkResponse(await response.json());
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
