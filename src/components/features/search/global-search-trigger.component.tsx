"use client";

import { CalendarDays, FileText, Lightbulb, Search, X } from "lucide-react";
import NextLink from "next/link";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Input from "#components/ui/input.component";
import { useModal } from "#components/ui/modal-provider.component";
import Stack from "#components/ui/stack.component";
import { useDictionary } from "#dictionary";
import { searchContentByBrowser } from "#lib/client/services";
import { formatMessage } from "#lib/shared/dictionary/dictionary.helper";
import {
  getSearchHighlightSegments,
  normalizeSearchQuery,
} from "#lib/shared/search/search.helper";
import { type SearchResult } from "#lib/shared/search/search.type";
import { cn } from "#lib/shared/utils";
import { formatTime } from "#lib/shared/utils/date.helper";

interface Props {
  className?: string;
}

const RESULT_ICON_BY_TYPE: Record<SearchResult["type"], ReactNode> = {
  post: <FileText size={16} aria-hidden="true" />,
  thought: <Lightbulb size={16} aria-hidden="true" />,
  event: <CalendarDays size={16} aria-hidden="true" />,
};

export default function GlobalSearchTrigger({ className }: Props) {
  const dictionary = useDictionary();
  const { isOpen, open } = useModal();

  const handleOpen = () => {
    if (isOpen) return;

    open(<GlobalSearchModal />, {
      containerClassName: "items-start px-4 pt-[12vh]",
    });
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      className={cn(
        "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-(--text-muted) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary)",
        className,
      )}
      aria-label={dictionary.search.title}
      title={dictionary.search.title}
    >
      <Search size={14} aria-hidden="true" />
    </button>
  );
}

function GlobalSearchModal() {
  const dictionary = useDictionary();
  const { close } = useModal();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [searchRawText, setSearchRawText] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    close();
  }, [close]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(normalizeSearchQuery(query));
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
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

    searchContentByBrowser(normalizedQuery, { searchRawText })
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
  }, [debouncedQuery, searchRawText]);

  const renderHighlightedText = (value: string) =>
    getSearchHighlightSegments(value, debouncedQuery).map((segment) => (
      <span
        key={segment.start}
        className={
          segment.matched
            ? "rounded-sm bg-(--warning-bg) px-0.5 text-(--warning-text)"
            : undefined
        }
      >
        {segment.text}
      </span>
    ));

  const renderResults = () => {
    if (!debouncedQuery) {
      return (
        <div className="rounded-2xl border border-dashed border-(--border-default) px-4 py-10 text-center text-sm text-(--text-muted)">
          {dictionary.search.empty}
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="px-2 py-8 text-center text-sm text-(--text-muted)">
          {dictionary.search.loading}
        </div>
      );
    }

    if (hasError) {
      return (
        <div className="px-2 py-8 text-center text-sm text-danger-text">
          {dictionary.search.error}
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="px-2 py-8 text-center text-sm text-(--text-muted)">
          {formatMessage(dictionary.search.noResults, {
            query: debouncedQuery,
          })}
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
              href={result.href}
              onClick={handleClose}
              className={cn(
                "rounded-2xl border border-(--border-default) px-4 py-3 transition-colors hover:border-(--border-strong) hover:bg-(--surface-hover)",
                isThought && "py-4",
              )}
            >
              <Stack x className="items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {result.title ? (
                    <div className="line-clamp-1 font-semibold text-(--text-primary)">
                      {renderHighlightedText(result.rawTitle ?? result.title)}
                    </div>
                  ) : null}
                  <p
                    className={cn(
                      "line-clamp-2 text-sm text-(--text-muted)",
                      result.title
                        ? "mt-1"
                        : "line-clamp-3 text-[15px] leading-7 text-(--text-secondary)",
                    )}
                  >
                    {renderHighlightedText(result.rawSnippet ?? result.snippet)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3 pl-2">
                  <span
                    className={cn(
                      "font-mono text-xs text-(--text-placeholder)",
                      isThought && "text-(--border-strong)",
                    )}
                  >
                    {formatTime(result.publishedAt, "YYYY/MM/DD")}
                  </span>
                  <span
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--border-default) bg-(--surface-muted) text-(--text-muted)",
                      isThought &&
                        "border-transparent bg-transparent text-(--border-strong)",
                    )}
                    aria-label={dictionary.search.types[result.type]}
                    title={dictionary.search.types[result.type]}
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
    <dialog
      open
      className="relative m-0 w-full max-w-2xl rounded-[2rem] border border-(--border-default) bg-(--surface-panel) p-4 text-inherit shadow-2xl"
      aria-modal="true"
      aria-label={dictionary.search.title}
    >
      <Stack
        x
        className="items-center gap-3 rounded-2xl border border-(--border-default) px-4 py-3"
      >
        <Search size={18} className="shrink-0 text-text-muted" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={dictionary.search.placeholder}
          className="flex-1 bg-transparent"
        />
        <button
          type="button"
          onClick={handleClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-(--text-placeholder) transition-colors hover:bg-(--surface-hover) hover:text-(--text-secondary)"
          aria-label={dictionary.search.close}
        >
          <X size={16} />
        </button>
      </Stack>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1">
        <span className="text-xs text-(--text-muted)">
          {dictionary.search.advanced.title}
        </span>
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-(--text-muted)">
          <input
            type="checkbox"
            checked={searchRawText}
            onChange={(event) => setSearchRawText(event.target.checked)}
            className="peer sr-only"
          />
          <span className="relative h-5 w-9 rounded-full bg-(--surface-muted) transition-colors peer-checked:bg-primary-bg after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-(--surface-card) after:transition-transform peer-checked:after:translate-x-4" />
          <span>{dictionary.search.advanced.searchRawText}</span>
        </label>
      </div>
      <div className="mt-4 max-h-[60vh] overflow-y-auto">{renderResults()}</div>
    </dialog>
  );
}
