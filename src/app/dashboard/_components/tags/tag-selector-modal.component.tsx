"use client";
import { Search, Tag, X } from "lucide-react";
import { type KeyboardEvent, useMemo, useState } from "react";

import Button from "#components/ui/button.component";
import IconButton from "#components/ui/icon-button.component";
import Input from "#components/ui/input.component";
import ModalPanel from "#components/ui/modal-panel.component";
import { useModal } from "#components/ui/modal-provider.component";
import SegmentedToggle from "#components/ui/segmented-toggle.component";
import Stack from "#components/ui/stack.component";
import { cn } from "#lib/shared/utils";
import type { TagWithCount } from "#types";

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
    <ModalPanel className="flex h-[min(640px,calc(100vh-48px))] w-[min(760px,calc(100vw-32px))] flex-col overflow-hidden shadow-2xl shadow-overlay/20 backdrop-blur">
      <Stack x className="items-center justify-between gap-4 px-5 pt-5">
        <Stack x className="min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-(--accent-surface) text-(--accent)">
            <Tag className="h-5 w-5 rotate-90" />
          </span>
          <h2 className="min-w-0 truncate text-lg font-semibold text-(--text-primary)">
            Select Tag
          </h2>
        </Stack>
        <IconButton
          onClick={() => close()}
          className="rounded-full bg-(--surface-muted) hover:bg-(--surface-hover-strong)"
          aria-label="Close tag selector"
        >
          <X className="h-5 w-5" />
        </IconButton>
      </Stack>
      <Stack x className="flex-wrap items-center gap-3 px-5 py-4">
        <label
          htmlFor="tag-selector-search"
          className="relative min-w-56 flex-1"
        >
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            id="tag-selector-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            type="search"
            autoFocus
            placeholder="Search tags"
            className="w-full rounded-full pl-9"
          />
        </label>
        <SegmentedToggle
          value={filterMode}
          onChange={setFilterMode}
          options={filterOptions}
          className="shrink-0"
        />
      </Stack>
      <div className="min-h-0 flex-1 overflow-auto px-5 pb-5">
        {tags.length === 0 ? (
          <div className="rounded-3xl bg-(--surface-muted) px-5 py-8 text-center text-sm text-(--text-placeholder)">
            No tags yet
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="rounded-3xl bg-(--surface-muted) px-5 py-8 text-center text-sm text-(--text-placeholder)">
            No matching tags
          </div>
        ) : (
          <div className="flex flex-wrap content-start gap-2">
            {filteredTags.map((tag) => {
              const isSelected = selectedTagSet.has(tag.name);
              return (
                <Button
                  variant="ghost"
                  key={tag.id}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "group max-w-full rounded-full",
                    isSelected
                      ? "border-(--accent-border) bg-(--accent-surface) text-(--accent-text)"
                      : "border-transparent bg-(--surface-muted) text-(--text-primary) shadow-sm hover:bg-(--surface-card)",
                  )}
                >
                  <Tag
                    className={cn(
                      "h-4 w-4 shrink-0 rotate-90",
                      isSelected ? "text-info-text" : "text-text-muted",
                    )}
                  />
                  <span className="truncate">{tag.name}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-xs tabular-nums",
                      isSelected
                        ? "bg-(--accent-surface-strong) text-(--accent)"
                        : "bg-(--surface-muted) text-(--text-placeholder)",
                    )}
                  >
                    {tag.count}
                  </span>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </ModalPanel>
  );
}
