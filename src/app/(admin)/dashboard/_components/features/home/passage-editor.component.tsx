/* oxlint-disable react/no-array-index-key -- Passage rows are controlled strings; selection and editing use their current positions. */
import * as stylex from "@stylexjs/stylex";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import Button from "#components/ui/button.component";
import { PaperField } from "#components/ui/paper-field.component";

import { editorStyles as styles } from "./home-editor.style";

export function PassageEditor({
  lines,
  change,
  errors,
}: Readonly<{
  lines: readonly string[];
  change: (lines: string[]) => void;
  errors: Readonly<Record<string, string>>;
}>) {
  const [selected, setSelected] = useState(0);
  const index = Math.min(selected, lines.length - 1);
  const move = (to: number) => {
    change(lines.toSpliced(index, 1).toSpliced(to, 0, lines[index]));
    setSelected(to);
  };
  return (
    <section aria-label="Terminal passages" {...stylex.props(styles.passages)}>
      <div {...stylex.props(styles.passageDirectory)}>
        <h3 {...stylex.props(styles.sectionTitle)}>
          Passages{" "}
          <span {...stylex.props(styles.muted)}>{lines.length} / 30</span>
        </h3>
        <ul {...stylex.props(styles.passageList)}>
          {lines.map((text, position) => (
            <li
              key={position}
              {...stylex.props(
                styles.passageRow,
                position === index && styles.selectedPassage,
              )}
            >
              <button
                type="button"
                aria-pressed={position === index}
                onClick={() => setSelected(position)}
                {...stylex.props(styles.passageButton)}
              >
                <span {...stylex.props(styles.passageSummary)}>
                  {text.split("\n")[0] || "Untitled passage"}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <Button
          disabled={lines.length >= 30}
          onClick={() => {
            change([...lines, ""]);
            setSelected(lines.length);
          }}
        >
          <Plus size={16} aria-hidden />
          Add passage
        </Button>
      </div>
      <div {...stylex.props(styles.group)}>
        <PaperField
          label="Passage"
          value={lines[index]}
          multiline
          maxLength={4000}
          error={errors[`config.terminalLines.${index}`]}
          onValueChange={(text) =>
            change(
              lines.map((line, position) => (position === index ? text : line)),
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
            disabled={index === lines.length - 1}
            onClick={() => move(index + 1)}
          >
            <ArrowDown size={16} />
          </Button>
          <Button
            aria-label="Remove passage"
            disabled={lines.length === 1}
            onClick={() => {
              change(lines.filter((_, position) => position !== index));
              setSelected(Math.min(index, lines.length - 2));
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
