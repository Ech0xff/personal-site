"use client";

import * as stylex from "@stylexjs/stylex";
import { Search, Tag, X } from "lucide-react";
import { type KeyboardEvent, useMemo, useState } from "react";

import Button from "#components/ui/button.component";
import IconButton from "#components/ui/icon-button.component";
import Input from "#components/ui/input.component";
import ModalPanel from "#components/ui/modal-panel.component";
import { useModal } from "#components/ui/modal-provider.component";
import SegmentedToggle from "#components/ui/segmented-toggle.component";
import Stack from "#components/ui/stack.component";
import { group } from "#design/interaction.stylex";
import { color, font, space, shape, shadow } from "#design/tokens.stylex";
import type { TagWithCount } from "#types";
const styles = stylex.create({
  modalPanel: {
    display: "flex",
    height: "min(640px,calc(100vh-48px))",
    width: "min(760px,calc(100vw-32px))",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: shadow.viewer,
    backdropFilter: "blur(8px)",
  },
  row: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.md,
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "20px",
  },
  row2: {
    minWidth: "0px",
    alignItems: "center",
    gap: space.sm,
  },
  label: {
    display: "flex",
    height: "40px",
    width: "40px",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: shape.panel,
    borderTopRightRadius: shape.panel,
    borderBottomRightRadius: shape.panel,
    borderBottomLeftRadius: shape.panel,
    backgroundColor: color.accentSurface,
    color: color.accent,
  },
  tag: {
    height: "20px",
    width: "20px",
    rotate: "90deg",
  },
  heading: {
    minWidth: "0px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: font.navigation,
    lineHeight: 1.5,
    fontWeight: font.semibold,
    color: color.text,
  },
  icon: {
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
    backgroundColor: {
      default: color.surfaceMuted,
      ":hover": color.surfaceStrong,
    },
  },
  icon2: {
    height: "20px",
    width: "20px",
  },
  row3: {
    flexWrap: "wrap",
    alignItems: "center",
    gap: space.sm,
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: space.md,
    paddingBottom: space.md,
  },
  label2: {
    position: "relative",
    minWidth: "224px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
  },
  search: {
    pointerEvents: "none",
    position: "absolute",
    top: "50%",
    left: space.sm,
    height: space.md,
    width: space.md,
    translate: "0 -50%",
    color: color.muted,
  },
  input: {
    width: "100%",
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
    paddingLeft: "36px",
  },
  segmentedToggle: {
    flexShrink: 0,
  },
  container: {
    minHeight: "0px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    overflow: "auto",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingBottom: "20px",
  },
  container2: {
    borderTopLeftRadius: shape.large,
    borderTopRightRadius: shape.large,
    borderBottomRightRadius: shape.large,
    borderBottomLeftRadius: shape.large,
    backgroundColor: color.surfaceMuted,
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: space.xl,
    paddingBottom: space.xl,
    textAlign: "center",
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.placeholder,
  },
  container3: {
    display: "flex",
    flexWrap: "wrap",
    alignContent: "start",
    gap: space.xs,
  },
  button: {
    maxWidth: "100%",
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
  },
  button2: {
    borderTopColor: color.accentBorder,
    borderRightColor: color.accentBorder,
    borderBottomColor: color.accentBorder,
    borderLeftColor: color.accentBorder,
    backgroundColor: color.accentSurface,
    color: color.accentText,
  },
  button3: {
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    backgroundColor: {
      default: color.surfaceMuted,
      ":hover": color.surface,
    },
    color: color.text,
    boxShadow: shadow.subtle,
  },
  tag2: {
    height: space.md,
    width: space.md,
    flexShrink: 0,
    rotate: "90deg",
  },
  tag3: {
    color: color.infoText,
  },
  tag4: {
    color: color.muted,
  },
  label3: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  label4: {
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
    paddingLeft: "6px",
    paddingRight: "6px",
    paddingTop: "2px",
    paddingBottom: "2px",
    fontSize: font.small,
    lineHeight: 1.5,
    fontVariantNumeric: "tabular-nums",
  },
  label5: {
    backgroundColor: color.accentStrong,
    color: color.accent,
  },
  label6: {
    backgroundColor: color.surfaceMuted,
    color: color.placeholder,
  },
});
export type TagSelectorFilterMode = "all" | "unselected" | "selected";
export type TagSelectorProps = {
  tags: TagWithCount[];
  onDeselect: (name: string) => void;
  onSelect: (id: string) => void;
  selectedTags: string[];
};
const filterOptions: {
  label: string;
  value: TagSelectorFilterMode;
}[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Unselected",
    value: "unselected",
  },
  {
    label: "Selected",
    value: "selected",
  },
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
    <ModalPanel xstyle={styles.modalPanel}>
      <Stack x xstyle={styles.row}>
        <Stack x xstyle={styles.row2}>
          <span {...stylex.props(styles.label)}>
            <Tag {...stylex.props(styles.tag)} />
          </span>
          <h2 {...stylex.props(styles.heading)}>Select Tag</h2>
        </Stack>
        <IconButton
          onClick={() => close()}
          xstyle={styles.icon}
          aria-label="Close tag selector"
        >
          <X {...stylex.props(styles.icon2)} />
        </IconButton>
      </Stack>
      <Stack x xstyle={styles.row3}>
        <label htmlFor="tag-selector-search" {...stylex.props(styles.label2)}>
          <Search {...stylex.props(styles.search)} />
          <Input
            id="tag-selector-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            type="search"
            autoFocus
            placeholder="Search tags"
            xstyle={styles.input}
          />
        </label>
        <SegmentedToggle
          value={filterMode}
          onChange={setFilterMode}
          options={filterOptions}
          xstyle={styles.segmentedToggle}
        />
      </Stack>
      <div {...stylex.props(styles.container)}>
        {tags.length === 0 ? (
          <div {...stylex.props(styles.container2)}>No tags yet</div>
        ) : filteredTags.length === 0 ? (
          <div {...stylex.props(styles.container2)}>No matching tags</div>
        ) : (
          <div {...stylex.props(styles.container3)}>
            {filteredTags.map((tag) => {
              const isSelected = selectedTagSet.has(tag.name);
              return (
                <Button
                  variant="ghost"
                  key={tag.id}
                  onClick={() => toggleTag(tag)}
                  xstyle={[
                    [styles.button, group],
                    isSelected ? styles.button2 : styles.button3,
                  ]}
                >
                  <Tag
                    {...stylex.props([
                      styles.tag2,
                      isSelected ? styles.tag3 : styles.tag4,
                    ])}
                  />
                  <span {...stylex.props(styles.label3)}>{tag.name}</span>
                  <span
                    {...stylex.props([
                      styles.label4,
                      isSelected ? styles.label5 : styles.label6,
                    ])}
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
