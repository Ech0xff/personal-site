"use client";

import { CalendarDays, FileText, Lightbulb, Search, X } from "lucide-react";
import NextLink from "next/link";
import {
  type MouseEvent,
  type ReactNode,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

import Stack from "@/components/ui/Stack";
import { useCurrentLocale } from "@/lib/client/locale";
import { searchContentByBrowser } from "@/lib/client/services";
import {
  getSearchHighlightSegments,
  normalizeSearchQuery,
  type SearchResult,
} from "@/lib/client/services/search-utils";
import { localizeHref } from "@/lib/shared/i18n";
import { getT } from "@/lib/shared/i18n/tools";
import { cn, formatTime } from "@/lib/shared/utils";

interface Props {
  className?: string;
}

const RESULT_ICON_BY_TYPE: Record<SearchResult["type"], ReactNode> = {
  post: <FileText size={16} aria-hidden="true" />,
  thought: <Lightbulb size={16} aria-hidden="true" />,
  event: <CalendarDays size={16} aria-hidden="true" />,
};

export default function GlobalSearchTrigger({ className }: Props) {
  const locale = useCurrentLocale();
  const tSearch = getT("Search", locale);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const closeModal = useEffectEvent(() => {
    setIsOpen(false);
    setQuery("");
    setDebouncedQuery("");
    setResults([]);
    setHasError(false);
    setIsLoading(false);
  });

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(() => {
      setDebouncedQuery(normalizeSearchQuery(query));
    }, 250);

    return () => window.clearTimeout(timer);
  }, [isOpen, query]);

  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;
    const normalizedQuery = normalizeSearchQuery(debouncedQuery);

    if (!normalizedQuery) {
      setResults([]);
      setHasError(false);
      setIsLoading(false);
      return () => {
        isCancelled = true;
      };
    }

    setIsLoading(true);
    setHasError(false);

    searchContentByBrowser(normalizedQuery)
      .then((nextResults) => {
        if (isCancelled) return;
        setResults(nextResults);
      })
      .catch(() => {
        if (isCancelled) return;
        setResults([]);
        setHasError(true);
      })
      .finally(() => {
        if (isCancelled) return;
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  const renderHighlightedText = (value: string) =>
    getSearchHighlightSegments(value, debouncedQuery).map((segment, index) => (
      <span
        key={`${segment.text}-${index}`}
        className={
          segment.matched
            ? "rounded-sm bg-amber-200/80 px-0.5 text-zinc-950 dark:bg-amber-300/75"
            : undefined
        }
      >
        {segment.text}
      </span>
    ));

  const renderResults = () => {
    if (!debouncedQuery) {
      return (
        <div className="rounded-2xl border border-zinc-200 border-dashed px-4 py-10 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          {tSearch("empty")}
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="px-2 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {tSearch("loading")}
        </div>
      );
    }

    if (hasError) {
      return (
        <div className="px-2 py-8 text-center text-red-500 text-sm">
          {tSearch("error")}
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="px-2 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {tSearch("noResults", { query: debouncedQuery })}
        </div>
      );
    }

    return (
      <Stack y className="gap-2">
        {results.map((result) => {
          const isThought = result.type === "thought";

          return (
            <NextLink
              key={`${result.type}-${result.id}`}
              href={localizeHref(locale, result.href)}
              onClick={() => closeModal()}
              className={cn(
                "rounded-2xl border border-zinc-200 px-4 py-3 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900",
                isThought && "py-4",
              )}
            >
              <Stack x className="items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {result.title ? (
                    <div className="line-clamp-1 font-semibold text-zinc-900 dark:text-zinc-100">
                      {renderHighlightedText(result.title)}
                    </div>
                  ) : null}
                  <p
                    className={cn(
                      "line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400",
                      result.title
                        ? "mt-1"
                        : "line-clamp-3 text-[15px] text-zinc-700 leading-7 dark:text-zinc-200",
                    )}
                  >
                    {renderHighlightedText(result.snippet)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3 pl-2">
                  <span
                    className={cn(
                      "font-mono text-xs text-zinc-400 dark:text-zinc-500",
                      isThought && "text-zinc-300 dark:text-zinc-600",
                    )}
                  >
                    {formatTime(result.publishedAt, "YYYY/MM/DD")}
                  </span>
                  <span
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300",
                      isThought &&
                        "border-transparent bg-transparent text-zinc-300 dark:text-zinc-600",
                    )}
                    aria-label={tSearch(`types.${result.type}`)}
                    title={tSearch(`types.${result.type}`)}
                  >
                    {RESULT_ICON_BY_TYPE[result.type]}
                  </span>
                </div>
              </Stack>
            </NextLink>
          );
        })}
      </Stack>
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-all hover:bg-theme-hover hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
          className,
        )}
        aria-label={tSearch("title")}
        title={tSearch("title")}
      >
        <Search size={14} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[1200] flex items-start justify-center bg-zinc-950/35 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <div
            className="w-full max-w-2xl rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
            role="dialog"
            aria-modal="true"
            aria-label={tSearch("title")}
          >
            <Stack
              x
              className="items-center gap-3 rounded-2xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
            >
              <Search size={18} className="shrink-0 text-zinc-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tSearch("placeholder")}
                className="flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
                aria-label={tSearch("close")}
              >
                <X size={16} />
              </button>
            </Stack>

            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              {renderResults()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
