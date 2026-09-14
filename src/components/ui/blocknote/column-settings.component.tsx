"use client";

import {
  AddBlockButton,
  DragHandleButton,
  SideMenu,
  useBlockNoteEditor,
  useComponentsContext,
} from "@blocknote/react";
import * as stylex from "@stylexjs/stylex";
import { Columns3, Minus, Plus, X } from "lucide-react";

import Button from "#components/ui/button.component";
import IconButton from "#components/ui/icon-button.component";
import Input from "#components/ui/input.component";
import { columnPercentages } from "#lib/shared/content/column-layout.helper";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import { cmsSchema } from "./blocknote.schema";
import { useColumnSettings } from "./column-settings.hook";
import { columnSettingsStyles as styles } from "./column-settings.style";

function NumberField({
  label,
  value,
  min,
  max,
  onCommit,
  autoFocus = false,
  step = 1,
}: Readonly<{
  label: string;
  value: number;
  min: number;
  max: number;
  autoFocus?: boolean;
  step?: number;
  onCommit: (value: number) => void;
}>) {
  return (
    <label {...stylex.props(styles.field)}>
      {label}
      <Input
        key={value}
        type="number"
        controlSize="sm"
        defaultValue={value}
        min={min}
        max={max}
        step={step}
        autoFocus={autoFocus}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            event.currentTarget.blur();
          }
        }}
        onBlur={(event) => {
          const next = event.currentTarget.valueAsNumber;
          if (
            Number.isFinite(next) &&
            next >= min &&
            next <= max &&
            (step !== 1 || Number.isInteger(next))
          ) {
            if (next !== value) onCommit(next);
          } else event.currentTarget.value = String(value);
        }}
      />
    </label>
  );
}

export function ColumnSideMenu() {
  return (
    <SideMenu>
      <AddBlockButton />
      <DragHandleButton />
      <ColumnSettings />
    </SideMenu>
  );
}

function ColumnSettings() {
  const editor = useBlockNoteEditor(cmsSchema);
  const components = useComponentsContext();
  const {
    freeze,
    unfreeze,
    row,
    open,
    setOpen,
    updateLayout,
    setCount,
    setWidth,
    equalize,
  } = useColumnSettings(editor);
  if (!row || !components) return null;
  const { Popover } = components.Generic;
  const widths = columnPercentages(row.children);
  return (
    <span
      data-column-controls
      onPointerEnter={freeze}
      onPointerLeave={unfreeze}
    >
      <Popover.Root open={open} onOpenChange={setOpen} position="right">
        <Popover.Trigger>
          <components.SideMenu.Button
            className="bn-button"
            onClick={() => setOpen(!open)}
            label={copy.layout}
            icon={<Columns3 size={18} />}
          />
        </Popover.Trigger>
        <Popover.Content
          variant="panel-popover"
          className={stylex.props(styles.dropdown).className}
        >
          <fieldset aria-label={copy.layout} {...stylex.props(styles.panel)}>
            <div {...stylex.props(styles.row)}>
              <h3 {...stylex.props(styles.heading)}>{copy.layout}</h3>
              <IconButton
                magnetic={false}
                size="sm"
                aria-label={copy.close}
                onClick={() => setOpen(false)}
              >
                <X size={16} />
              </IconButton>
            </div>
            <div {...stylex.props(styles.row)}>
              <NumberField
                autoFocus
                label={copy.count}
                value={row.children.length}
                min={2}
                max={100}
                onCommit={setCount}
              />
              <IconButton
                size="sm"
                magnetic={false}
                aria-label={copy.removeColumn}
                disabled={row.children.length <= 2}
                onClick={() => setCount(row.children.length - 1)}
              >
                <Minus size={16} />
              </IconButton>
              <IconButton
                size="sm"
                magnetic={false}
                aria-label={copy.addColumn}
                disabled={row.children.length >= 100}
                onClick={() => setCount(row.children.length + 1)}
              >
                <Plus size={16} />
              </IconButton>
            </div>
            <p {...stylex.props(styles.hint)}>{copy.mergeHint}</p>
            <div {...stylex.props(styles.row)}>
              {row.children.map((column, index) => (
                <NumberField
                  key={column.id}
                  step={0.1}
                  label={`${copy.column} ${index + 1} (%)`}
                  value={Math.round(widths[index] * 10) / 10}
                  min={1}
                  max={99}
                  onCommit={(value) => setWidth(index, value)}
                />
              ))}
            </div>
            <Button
              magnetic={false}
              variant="secondary"
              size="sm"
              onClick={equalize}
            >
              {copy.equalize}
            </Button>
            <NumberField
              label={copy.gap}
              value={row.props.gap}
              min={0}
              max={64}
              onCommit={(gap) => updateLayout({ gap })}
            />
            <div {...stylex.props(styles.choices)}>
              {[0, 8, 16, 24, 32].map((gap) => (
                <Button
                  key={gap}
                  magnetic={false}
                  variant="ghost"
                  size="sm"
                  aria-pressed={row.props.gap === gap}
                  xstyle={row.props.gap === gap && styles.selected}
                  onClick={() => updateLayout({ gap })}
                >
                  {gap} px
                </Button>
              ))}
            </div>
            <span {...stylex.props(styles.field)}>{copy.media}</span>
            <fieldset aria-label={copy.media} {...stylex.props(styles.choices)}>
              {mediaOptions.map(([value, label]) => (
                <Button
                  key={value}
                  magnetic={false}
                  variant="ghost"
                  size="sm"
                  aria-pressed={row.props.mediaLayout === value}
                  xstyle={row.props.mediaLayout === value && styles.selected}
                  onClick={() => updateLayout({ mediaLayout: value })}
                >
                  {label}
                </Button>
              ))}
            </fieldset>
            {row.props.mediaLayout === "equalHeight" && (
              <NumberField
                label={copy.height}
                value={row.props.mediaHeight}
                min={80}
                max={640}
                onCommit={(mediaHeight) => updateLayout({ mediaHeight })}
              />
            )}
            <fieldset aria-label={copy.fit} {...stylex.props(styles.choices)}>
              {fitOptions.map(([value, label]) => (
                <Button
                  key={value}
                  magnetic={false}
                  variant="ghost"
                  size="sm"
                  aria-pressed={row.props.mediaFit === value}
                  xstyle={row.props.mediaFit === value && styles.selected}
                  onClick={() => updateLayout({ mediaFit: value })}
                >
                  {label}
                </Button>
              ))}
            </fieldset>
            <label {...stylex.props(styles.check)}>
              <input
                type="checkbox"
                checked={row.props.equalCards}
                onChange={(event) =>
                  updateLayout({ equalCards: event.target.checked })
                }
                {...stylex.props(styles.checkbox)}
              />
              {copy.equalCards}
            </label>
            <p {...stylex.props(styles.hint)}>{copy.responsiveHint}</p>
          </fieldset>
        </Popover.Content>
      </Popover.Root>
    </span>
  );
}

const copy = defaultDictionary.editor.columns;
const mediaOptions = [
  ["original", copy.original],
  ["square", "1:1"],
  ["landscape", "4:3"],
  ["wide", "16:9"],
  ["equalHeight", copy.equalHeight],
] as const;
const fitOptions = [
  ["cover", copy.cover],
  ["contain", copy.contain],
] as const;
