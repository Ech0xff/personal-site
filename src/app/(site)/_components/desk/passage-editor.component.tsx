import * as stylex from "@stylexjs/stylex";
import { Reorder, useDragControls } from "framer-motion";
import { ArrowDown, ArrowUp, GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import Button from "#components/ui/button.component";
import { PaperField } from "#components/ui/paper-field.component";

import { editorStyles as styles } from "./item-editor.style";

type Passage = Readonly<{ id: string; text: string }>;
function PassageRow({
  passage,
  index,
  selected,
  select,
}: Readonly<{
  passage: Passage;
  index: number;
  selected: boolean;
  select: () => void;
}>) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={passage}
      dragListener={false}
      dragControls={controls}
      {...stylex.props(styles.passageRow, selected && styles.selectedPassage)}
    >
      <button
        type="button"
        aria-label={`Drag passage ${index + 1}`}
        onPointerDown={(event) => controls.start(event)}
        {...stylex.props(styles.dragHandle)}
      >
        <GripVertical size={14} aria-hidden />
      </button>
      <button
        type="button"
        aria-pressed={selected}
        onClick={select}
        {...stylex.props(styles.passageButton)}
      >
        <span {...stylex.props(styles.passageSummary)}>
          {passage.text.split("\n")[0] || "Untitled passage"}
        </span>
      </button>
    </Reorder.Item>
  );
}

export function PassageEditor({
  lines,
  change,
  errors,
}: Readonly<{
  lines: readonly string[];
  change: (lines: string[]) => void;
  errors: Readonly<Record<string, string>>;
}>) {
  const [passages, setPassages] = useState(() =>
    lines.map((text) => ({ id: crypto.randomUUID(), text })),
  );
  const [selected, setSelected] = useState(passages[0].id);
  const index = Math.max(
    0,
    passages.findIndex((passage) => passage.id === selected),
  );
  const current = passages[index];
  const update = (next: Passage[]) => {
    setPassages(next);
    change(next.map((passage) => passage.text));
  };
  const move = (to: number) =>
    update(passages.toSpliced(index, 1).toSpliced(to, 0, current));
  return (
    <section aria-label="Terminal passages" {...stylex.props(styles.passages)}>
      <div {...stylex.props(styles.passageDirectory)}>
        <h3 {...stylex.props(styles.sectionTitle)}>
          Passages{" "}
          <span {...stylex.props(styles.muted)}>{passages.length} / 30</span>
        </h3>
        <Reorder.Group
          axis="y"
          values={passages}
          onReorder={update}
          {...stylex.props(styles.passageList)}
        >
          {passages.map((passage, i) => (
            <PassageRow
              key={passage.id}
              passage={passage}
              index={i}
              selected={passage.id === current.id}
              select={() => setSelected(passage.id)}
            />
          ))}
        </Reorder.Group>
        <Button
          disabled={passages.length >= 30}
          onClick={() => {
            const passage = { id: crypto.randomUUID(), text: "" };
            update([...passages, passage]);
            setSelected(passage.id);
          }}
        >
          <Plus size={16} aria-hidden />
          Add passage
        </Button>
      </div>
      <div {...stylex.props(styles.group)}>
        <PaperField
          key={current.id}
          label="Passage"
          value={current.text}
          multiline
          maxLength={4000}
          error={errors[`config.terminalLines.${index}`]}
          onValueChange={(text) =>
            update(
              passages.map((passage) =>
                passage.id === current.id ? { ...passage, text } : passage,
              ),
            )
          }
        />
        {errors["config.terminalLines"] && (
          <p role="alert" {...stylex.props(styles.error)}>
            {errors["config.terminalLines"]}
          </p>
        )}
        <div {...stylex.props(styles.row)}>
          <Button
            aria-label="Move passage up"
            disabled={index === 0}
            onClick={() => move(index - 1)}
          >
            <ArrowUp size={16} />
          </Button>
          <Button
            aria-label="Move passage down"
            disabled={index === passages.length - 1}
            onClick={() => move(index + 1)}
          >
            <ArrowDown size={16} />
          </Button>
          <Button
            aria-label="Remove passage"
            disabled={passages.length === 1}
            onClick={() => {
              const next = passages.filter(
                (passage) => passage.id !== current.id,
              );
              update(next);
              setSelected(next[Math.min(index, next.length - 1)].id);
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
