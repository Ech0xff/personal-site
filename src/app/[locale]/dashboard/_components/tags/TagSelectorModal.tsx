"use client";

import { Search, Tag, X } from "lucide-react";
import { type KeyboardEvent, useMemo, useState } from "react";
import { useModal } from "#components/ui/ModalProvider";
import Stack from "#components/ui/Stack";
import { cn } from "#lib/shared/utils";
import type { TagWithCount } from "#types";

import "./TagSelectorModal.scss";

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
      className="h-[min(640px,calc(100vh-48px))] w-[min(760px,calc(100vw-32px))] overflow-hidden rounded-[28px] bg-(--tag-selector-surface) shadow-2xl shadow-zinc-950/20 backdrop-blur"
    >
      <Stack x className="items-center justify-between gap-4 px-5 pt-5">
        <Stack x className="min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-(--accent-surface) text-(--accent)">
            <Tag className="h-5 w-5 rotate-90" />
          </span>
          <h2 className="min-w-0 truncate font-semibold text-(--text-primary) text-lg">
            Select Tag
          </h2>
        </Stack>
        <button
          type="button"
          onClick={() => close()}
          className="rounded-full bg-(--surface-muted) p-2 text-(--text-muted) transition-colors hover:bg-(--surface-hover-strong) hover:text-(--text-primary)"
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
            className="w-full rounded-full bg-(--surface-muted) py-2.5 pr-3 pl-9 text-(--text-primary) text-sm outline-none transition-colors placeholder:text-(--text-placeholder) focus:bg-(--surface-input) focus:ring-2 focus:ring-blue-500/25"
          />
        </label>

        <Stack
          x
          className="shrink-0 flex-wrap gap-2 rounded-full bg-(--surface-muted) p-1"
        >
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilterMode(option.value)}
              className={cn(
                "rounded-full px-3 py-1.5 font-medium text-sm transition-colors",
                filterMode === option.value
                  ? "bg-(--surface-selected) text-(--text-primary) shadow-sm"
                  : "text-(--text-muted) hover:text-(--text-secondary)",
              )}
            >
              {option.label}
            </button>
          ))}
        </Stack>
      </Stack>

      <div className="min-h-0 flex-1 overflow-auto px-5 pb-5">
        {tags.length === 0 ? (
          <div className="rounded-3xl bg-(--surface-muted) px-5 py-8 text-center text-(--text-placeholder) text-sm">
            No tags yet
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="rounded-3xl bg-(--surface-muted) px-5 py-8 text-center text-(--text-placeholder) text-sm">
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
                      ? "border border-(--accent-border) bg-(--accent-surface) text-(--accent-text) shadow-none"
                      : "border-transparent bg-(--surface-muted) text-(--text-primary) shadow-sm hover:bg-(--surface-card)",
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
                        ? "bg-(--accent-surface-strong) text-(--accent)"
                        : "bg-(--tag-selector-badge-surface) text-(--text-placeholder)",
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
