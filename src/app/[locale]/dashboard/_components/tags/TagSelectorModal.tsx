"use client";

import { Search, Tag, X } from "lucide-react";
import { type KeyboardEvent, useMemo, useState } from "react";
import { useModal } from "@/components/ui/ModalProvider";
import Stack from "@/components/ui/Stack";
import { cn } from "@/lib/shared/utils";
import type { TagWithCount } from "@/types";

export type TagSelectorFilterMode = "all" | "unselected" | "selected";

export type TagSelectorProps = {
  tags: TagWithCount[];
  onDeselect: (name: string) => void;
  onSelect: (id: string) => void;
  selectedTags: string[];
};

const filterOptions: { label: string; value: TagSelectorFilterMode }[] = [
  { label: "All", value: "all" },
  { label: "Unselected", value: "unselected" },
  { label: "Selected", value: "selected" },
];

export default function TagSelectorModal({
  onDeselect,
  onSelect,
  selectedTags,
  tags,
}: TagSelectorProps) {
  const { close } = useModal();
  const [query, setQuery] = useState("");
  const [filterMode, setFilterMode] = useState<TagSelectorFilterMode>("all");
  const [selectedTagSet, setSelectedTagSet] = useState(
    () => new Set(selectedTags),
  );

  const filteredTags = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return tags.filter((tag) => {
      const isSelected = selectedTagSet.has(tag.name);
      const matchesKeyword =
        !keyword || tag.name.toLowerCase().includes(keyword);
      const matchesFilter =
        filterMode === "all" ||
        (filterMode === "selected" && isSelected) ||
        (filterMode === "unselected" && !isSelected);

      return matchesKeyword && matchesFilter;
    });
  }, [filterMode, query, selectedTagSet, tags]);

  const selectTag = (tag: TagWithCount) => {
    if (selectedTagSet.has(tag.name)) return;

    setSelectedTagSet((current) => new Set(current).add(tag.name));
    onSelect(tag.id);
  };

  const toggleTag = (tag: TagWithCount) => {
    if (!selectedTagSet.has(tag.name)) {
      selectTag(tag);
      return;
    }

    setSelectedTagSet((current) => {
      const next = new Set(current);
      next.delete(tag.name);
      return next;
    });
    onDeselect(tag.name);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    const firstAvailableTag = filteredTags.find(
      (tag) => !selectedTagSet.has(tag.name),
    );

    if (firstAvailableTag) selectTag(firstAvailableTag);
  };

  return (
    <Stack
      y
      className="h-[min(640px,calc(100vh-48px))] w-[min(760px,calc(100vw-32px))] overflow-hidden rounded-[28px] bg-white/95 shadow-2xl shadow-zinc-950/20 backdrop-blur dark:bg-zinc-900/95"
    >
      <Stack x className="items-center justify-between gap-4 px-5 pt-5">
        <Stack x className="min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
            <Tag className="h-5 w-5 rotate-90" />
          </span>
          <h2 className="min-w-0 truncate font-semibold text-lg text-zinc-950 dark:text-zinc-50">
            Select Tag
          </h2>
        </Stack>
        <button
          type="button"
          onClick={() => close()}
          className="rounded-full bg-zinc-100 p-2 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
          aria-label="Close tag selector"
        >
          <X className="h-5 w-5" />
        </button>
      </Stack>

      <Stack x className="flex-wrap items-center gap-3 px-5 py-4">
        <label className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            type="search"
            autoFocus
            placeholder="Search tags"
            className="w-full rounded-full bg-zinc-100 py-2.5 pr-3 pl-9 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-blue-500/25 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-950"
          />
        </label>

        <Stack
          x
          className="shrink-0 flex-wrap gap-2 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800"
        >
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilterMode(option.value)}
              className={cn(
                "rounded-full px-3 py-1.5 font-medium text-sm transition-colors",
                filterMode === option.value
                  ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200",
              )}
            >
              {option.label}
            </button>
          ))}
        </Stack>
      </Stack>

      <div className="min-h-0 flex-1 overflow-auto px-5 pb-5">
        {tags.length === 0 ? (
          <div className="rounded-3xl bg-zinc-50 px-5 py-8 text-center text-sm text-zinc-400 dark:bg-zinc-800/60">
            No tags yet
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="rounded-3xl bg-zinc-50 px-5 py-8 text-center text-sm text-zinc-400 dark:bg-zinc-800/60">
            No matching tags
          </div>
        ) : (
          <div className="flex flex-wrap content-start gap-2">
            {filteredTags.map((tag) => {
              const isSelected = selectedTagSet.has(tag.name);

              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "group inline-flex max-w-full cursor-pointer items-center gap-2 rounded-full border px-3 py-2 font-medium text-sm transition-all",
                    isSelected
                      ? "border-blue-400 bg-blue-50 text-blue-700 shadow-none dark:border-blue-500/70 dark:bg-blue-950/30 dark:text-blue-300"
                      : "border-transparent bg-zinc-50 text-zinc-800 shadow-sm hover:bg-white dark:bg-zinc-800/80 dark:text-zinc-100 dark:hover:bg-zinc-800",
                  )}
                >
                  <Tag
                    className={cn(
                      "h-4 w-4 shrink-0 rotate-90",
                      isSelected ? "text-blue-500" : "text-zinc-400",
                    )}
                  />
                  <span className="truncate">{tag.name}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-xs tabular-nums",
                      isSelected
                        ? "bg-blue-100 text-blue-500 dark:bg-blue-950/60 dark:text-blue-300"
                        : "bg-white/70 text-zinc-400 dark:bg-zinc-950/40",
                    )}
                  >
                    {tag.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Stack>
  );
}
