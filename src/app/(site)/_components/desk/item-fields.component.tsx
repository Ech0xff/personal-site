import * as stylex from "@stylexjs/stylex";

import { PaperField } from "#components/ui/paper-field.component";
import type { DeskItem } from "#lib/shared/desk/desk-item.schema";

import { editorStyles as styles } from "./item-editor.style";
import { PassageEditor } from "./passage-editor.component";
type Props = Readonly<{
  item: DeskItem;
  change: (item: DeskItem) => void;
  errors: Readonly<Record<string, string>>;
}>;
export function ItemFields({ item, change, errors }: Props) {
  const field = (
    key: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
    multiline = false,
  ) => (
    <PaperField
      key={key}
      label={label}
      value={value}
      onValueChange={onChange}
      multiline={multiline}
      maxLength={4000}
      error={errors[key]}
    />
  );
  switch (item.type) {
    case "intro":
      return (
        <>
          {(
            [
              ["name", "Personal name"],
              ["greeting", "Greeting"],
              ["role", "Role"],
              ["introduction", "Introduction"],
            ] as const
          ).map(([key, label]) =>
            field(
              `config.${key}`,
              label,
              item.config[key],
              (value) =>
                change({ ...item, config: { ...item.config, [key]: value } }),
              key === "introduction",
            ),
          )}
          {(["github", "email", "x", "bilibili"] as const).map((key) =>
            field(
              `config.links.${key}`,
              key === "email"
                ? "Email link (mailto:you@example.com)"
                : `${key === "github" ? "GitHub" : key === "x" ? "X" : "Bilibili"} URL`,
              item.config.links[key] ?? "",
              (value) =>
                change({
                  ...item,
                  config: {
                    ...item.config,
                    links: { ...item.config.links, [key]: value || null },
                  },
                }),
            ),
          )}
        </>
      );
    case "books":
      return (
        <>
          {(
            [
              ["eyebrow", "Eyebrow"],
              ["title", "Cover title"],
              ["author", "Author"],
            ] as const
          ).map(([key, label]) =>
            field(
              `config.${key}`,
              label,
              item.config[key],
              (value) =>
                change({ ...item, config: { ...item.config, [key]: value } }),
              key === "title",
            ),
          )}
        </>
      );
    case "letter":
      return (
        <>
          {(
            [
              ["heading", "Heading"],
              ["body", "Body"],
              ["signature", "Signature"],
            ] as const
          ).map(([key, label]) =>
            field(
              `config.${key}`,
              label,
              item.config[key],
              (value) =>
                change({ ...item, config: { ...item.config, [key]: value } }),
              key === "body",
            ),
          )}
        </>
      );
    case "calendar":
      return (
        <>
          {(
            [
              ["heading", "Heading"],
              ["caption", "Caption"],
            ] as const
          ).map(([key, label]) =>
            field(`config.${key}`, label, item.config[key], (value) =>
              change({ ...item, config: { ...item.config, [key]: value } }),
            ),
          )}
        </>
      );
    case "display":
      return (
        <PassageEditor
          lines={item.config.terminalLines}
          change={(terminalLines) =>
            change({ ...item, config: { terminalLines } })
          }
          errors={errors}
        />
      );
    case "record":
      return null;
    case "coffee":
    case "pencil":
    case "lamp":
      return (
        <p {...stylex.props(styles.muted)}>
          No content settings for this item.
        </p>
      );
  }
}
