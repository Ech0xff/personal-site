import type { KeyboardEvent, MouseEvent } from "react";
import { useMemo, useState } from "react";

import type { TagWithCount } from "@/types";

type Props = {
  tags: TagWithCount[];
  onSelect: (id: string) => void;
  selectedTags: string[];
};

export default function TagSelector({ tags, onSelect, selectedTags }: Props) {
  const [query, setQuery] = useState("");
  const filteredTags = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return tags;
    return tags.filter((tag) => tag.name.toLowerCase().includes(keyword));
  }, [tags, query]);

  const selectTag = (id: string) => {
    onSelect(id);
    setQuery("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    const firstAvailableTag = filteredTags.find(
      (tag) => !selectedTags.includes(tag.name),
    );
    if (firstAvailableTag) selectTag(firstAvailableTag.id);
  };

  return (
    <div className="group/tags relative shrink-0">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        type="search"
        placeholder="Search tag..."
        className="w-28 rounded border border-zinc-200 bg-transparent px-2 py-0.5 text-xs text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-700 dark:text-zinc-100"
      />
      <div className="invisible absolute top-full left-0 z-20 mt-2 max-h-48 min-w-56 overflow-auto rounded border border-zinc-200 bg-white p-1 opacity-0 shadow-lg transition-all group-focus-within/tags:visible group-focus-within/tags:opacity-100 group-hover/tags:visible group-hover/tags:opacity-100 dark:border-zinc-800 dark:bg-zinc-900">
        {tags.length > 0 ? (
          filteredTags.length > 0 ? (
            filteredTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.name);

              const handleMouseDown = (
                event: MouseEvent<HTMLButtonElement>,
              ) => {
                if (!isSelected) event.preventDefault();
              };

              return (
                <button
                  key={tag.id}
                  type="button"
                  disabled={isSelected}
                  onMouseDown={handleMouseDown}
                  onClick={() => selectTag(tag.id)}
                  className="flex w-full items-center justify-between gap-3 rounded px-2 py-1 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-default disabled:text-zinc-400 disabled:hover:bg-transparent dark:text-zinc-200 dark:disabled:text-zinc-600 dark:hover:bg-zinc-800"
                >
                  <span className="truncate">#{tag.name}</span>
                  <span className="shrink-0 text-xs text-zinc-400">
                    {tag.count}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="px-2 py-1 text-sm text-zinc-400">
              No matching tags
            </div>
          )
        ) : (
          <div className="px-2 py-1 text-sm text-zinc-400">No tags yet</div>
        )}
      </div>
    </div>
  );
}
