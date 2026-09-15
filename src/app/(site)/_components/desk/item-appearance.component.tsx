import * as stylex from "@stylexjs/stylex";

import { PaperField } from "#components/ui/paper-field.component";
import {
  deskItemDefinitions,
  type DeskAppearance,
  type DeskItem,
} from "#lib/shared/desk/desk-item.schema";
import type { DeskBreakpoint } from "#lib/shared/desk/desk-layout.schema";

import { editorStyles as styles } from "./item-editor.style";

export function ItemAppearance({
  item,
  change,
  scale,
  setScale,
  breakpoint,
  errors,
}: Readonly<{
  item: DeskItem;
  change: (item: DeskItem) => void;
  scale: number;
  setScale: (scale: number) => void;
  breakpoint: DeskBreakpoint;
  errors: Readonly<Record<string, string>>;
}>) {
  const appearance = item.appearance;
  const resizable = deskItemDefinitions[item.type].capabilities.resizable;
  const field = (
    key: Exclude<keyof DeskAppearance, "draggable">,
    label: string,
    min: number,
    max: number,
    step = 1,
  ) => (
    <PaperField
      key={key}
      label={label}
      type="number"
      min={min}
      max={max}
      step={step}
      value={String(appearance[key])}
      error={errors[`appearance.${key}`]}
      onValueChange={(value) =>
        change({ ...item, appearance: { ...appearance, [key]: Number(value) } })
      }
    />
  );
  return (
    <>
      <PaperField
        label="Item name"
        value={item.name}
        maxLength={80}
        error={errors.name}
        onValueChange={(name) => change({ ...item, name })}
      />
      <div {...stylex.props(styles.toggle)}>
        <span>Movement</span>
        <button
          type="button"
          role="switch"
          aria-label="Allow dragging"
          aria-checked={appearance.draggable}
          onClick={() =>
            change({
              ...item,
              appearance: { ...appearance, draggable: !appearance.draggable },
            })
          }
          {...stylex.props(styles.movement)}
        >
          <span>{appearance.draggable ? "Draggable" : "Fixed"}</span>
          <span
            aria-hidden
            {...stylex.props(
              styles.switchTrack,
              appearance.draggable && styles.switchOn,
            )}
          >
            <span
              {...stylex.props(
                styles.switchThumb,
                appearance.draggable && styles.thumbOn,
              )}
            />
          </span>
        </button>
      </div>
      <div {...stylex.props(styles.statesGrid)}>
        <section aria-label="Initial" {...stylex.props(styles.group)}>
          <h3 {...stylex.props(styles.sectionTitle)}>Initial</h3>
          {field("rotation", "Rotation (°)", -180, 180)}
          {field("offsetX", "Horizontal offset (px)", -48, 48)}
          {field("offsetY", "Vertical offset (px)", -48, 48)}
          <PaperField
            label="Scale (×)"
            title={`${breakpoint} size`}
            type="number"
            disabled={!resizable}
            min={appearance.minScale}
            max={appearance.maxScale}
            step={0.05}
            value={String(scale)}
            onValueChange={(value) => setScale(Number(value))}
            error={errors.scale}
          />
        </section>
        <section aria-label="On hover" {...stylex.props(styles.group)}>
          <h3 {...stylex.props(styles.sectionTitle)}>On hover</h3>
          {field("hoverRotation", "Rotation (°)", -180, 180)}
          {field("hoverX", "Horizontal offset (px)", -48, 48)}
          {field("hoverY", "Vertical offset (px)", -48, 48)}
          {field("hoverScale", "Scale (×)", 0.5, 2, 0.05)}
        </section>
      </div>
      {resizable && (
        <section {...stylex.props(styles.group)}>
          <h3 {...stylex.props(styles.sectionTitle)}>Size limits</h3>
          <div {...stylex.props(styles.fieldsGrid)}>
            {field("minScale", "Minimum scale (×)", 0.5, 2, 0.05)}
            {field("maxScale", "Maximum scale (×)", 0.5, 2, 0.05)}
          </div>
        </section>
      )}
    </>
  );
}
