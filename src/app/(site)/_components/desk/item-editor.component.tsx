import * as stylex from "@stylexjs/stylex";
import { isEqual } from "es-toolkit";
import { FileText, SlidersHorizontal, RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import Button from "#components/ui/button.component";
import CloseButton from "#components/ui/close-button.component";
import Loading from "#components/ui/loading.component";
import { lockScrolling } from "#lib/client/scroll/scroll-lock.service";
import type { AudioAsset } from "#lib/shared/audio/audio.schema";
import {
  deskItemSchema,
  defaultDeskAppearance,
  restoreDeskItemContent,
  type DeskItem,
  deskItemDefinitions,
} from "#lib/shared/desk/desk-item.schema";
import type { DeskBreakpoint } from "#lib/shared/desk/desk-layout.schema";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import { ItemAppearance } from "./item-appearance.component";
import { editorStyles as styles } from "./item-editor.style";
import { ItemPreview } from "./item-preview.component";
const ItemFields = dynamic(
  () => import("./item-fields.component").then((module) => module.ItemFields),
  { loading: () => <Loading compact /> },
);
const RecordEditor = dynamic(
  () =>
    import("./record-editor.component").then((module) => module.RecordEditor),
  { loading: () => <Loading compact /> },
);
const copy = defaultDictionary.desk.itemEditor;
type Props = Readonly<{
  item: DeskItem;
  assets: readonly AudioAsset[];
  onAssets: (assets: readonly AudioAsset[]) => void;
  apply: (item: DeskItem, scale: number) => Promise<boolean>;
  scale: number;
  breakpoint: DeskBreakpoint;
  busy: boolean;
  notice: string;
  close: () => void;
}>;
export function ItemEditor({
  item,
  assets,
  onAssets,
  apply,
  close,
  scale,
  breakpoint,
  busy,
  notice,
}: Props) {
  const hasContent = !["coffee", "pencil", "lamp"].includes(item.type);
  const sections = hasContent
    ? (["content", "appearance"] as const)
    : (["appearance"] as const);
  const [section, setSection] = useState<"content" | "appearance">(
    hasContent ? "content" : "appearance",
  );
  const [contentKey, setContentKey] = useState(0);
  const [draftScale, setDraftScale] = useState(scale);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [draft, setDraft] = useState(item);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const dirty = !isEqual(item, draft) || scale !== draftScale;
  const dismiss = () => {
    if (busy) return;
    if (dirty) setConfirmDiscard(true);
    else close();
  };
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const previousFocus = document.activeElement;
    const unlock = lockScrolling(document.body);
    node.showModal();
    return () => {
      node.querySelectorAll("audio").forEach((audio) => audio.pause());
      node.close();
      unlock();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus();
    };
  }, []);
  useEffect(() => {
    if (!dirty) return;
    const prevent = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty]);
  return createPortal(
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        dismiss();
      }}
      data-item-editor
      data-lenis-prevent
      {...stylex.props(styles.dialog)}
    >
      <form
        noValidate
        {...stylex.props(styles.form)}
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy) return;
          const result = deskItemSchema.safeParse(draft);
          if (!result.success) {
            setErrors(
              Object.fromEntries(
                result.error.issues.map((issue) => [
                  issue.path.join("."),
                  issue.message,
                ]),
              ),
            );
            setSection(
              result.error.issues.some(
                (issue) =>
                  issue.path[0] === "appearance" || issue.path[0] === "name",
              )
                ? "appearance"
                : "content",
            );
            return;
          }
          if (
            deskItemDefinitions[item.type].capabilities.resizable &&
            (!Number.isFinite(draftScale) ||
              draftScale < draft.appearance.minScale ||
              draftScale > draft.appearance.maxScale)
          ) {
            setErrors({
              scale: "Current scale must be within the minimum and maximum.",
            });
            setSection("appearance");
            return;
          }
          setErrors({});
          if (!isEqual(result.data, item) || scale !== draftScale) {
            if (await apply(result.data, draftScale)) close();
          } else close();
        }}
      >
        <header {...stylex.props(styles.header)}>
          <h2 id={titleId} {...stylex.props(styles.srOnly)}>
            {copy.edit} {item.name}
          </h2>
          <nav aria-label="Item settings" {...stylex.props(styles.tabs)}>
            {sections.map((tab) => (
              <Button
                key={tab}
                aria-label={tab === "content" ? "Content" : "Appearance"}
                title={tab === "content" ? "Content" : "Appearance"}
                aria-pressed={section === tab}
                disabled={busy}
                onClick={() => setSection(tab)}
                xstyle={[styles.tab, section === tab && styles.selectedTab]}
              >
                {tab === "content" ? (
                  <FileText size={20} aria-hidden />
                ) : (
                  <SlidersHorizontal size={20} aria-hidden />
                )}
                <span
                  aria-hidden
                  {...stylex.props(
                    styles.tabDot,
                    section === tab && styles.activeDot,
                  )}
                />
              </Button>
            ))}
          </nav>
          <CloseButton
            magnetic
            aria-label={copy.close}
            onClick={dismiss}
            disabled={busy}
          />
        </header>
        <div data-lenis-prevent {...stylex.props(styles.body)}>
          <div {...stylex.props(styles.formFields)}>
            <fieldset disabled={busy} {...stylex.props(styles.fieldset)}>
              {section === "content" ? (
                <>
                  {draft.type !== "record" && (
                    <ItemFields
                      key={contentKey}
                      item={draft}
                      change={setDraft}
                      errors={errors}
                    />
                  )}
                  {draft.type === "record" && (
                    <RecordEditor
                      key={contentKey}
                      tracks={draft.config.tracks}
                      change={(tracks) =>
                        setDraft({ ...draft, config: { tracks } })
                      }
                      assets={assets}
                      onAssets={onAssets}
                      errors={errors}
                    />
                  )}
                </>
              ) : (
                <ItemAppearance
                  item={draft}
                  change={setDraft}
                  scale={draftScale}
                  setScale={setDraftScale}
                  breakpoint={breakpoint}
                  errors={errors}
                />
              )}
            </fieldset>
            {notice && (
              <p role="alert" {...stylex.props(styles.error)}>
                {notice}
              </p>
            )}
          </div>
          <ItemPreview item={draft} scale={draftScale} assets={assets} />
        </div>
        <footer {...stylex.props(styles.footer)}>
          <Button
            disabled={busy || confirmDiscard}
            xstyle={styles.restore}
            onClick={() => {
              if (section === "content") {
                setDraft(restoreDeskItemContent(draft));
                setContentKey((key) => key + 1);
              } else {
                setDraft({
                  ...draft,
                  name: deskItemDefinitions[draft.type].name,
                  appearance: defaultDeskAppearance(draft.type),
                });
                setDraftScale(1);
              }
              setErrors({});
            }}
          >
            <RotateCcw size={16} aria-hidden />
            Restore
          </Button>
          {confirmDiscard ? (
            <div {...stylex.props(styles.group)}>
              <p role="alert" {...stylex.props(styles.muted)}>
                {copy.discard}
              </p>
              <div {...stylex.props(styles.row)}>
                <Button onClick={() => setConfirmDiscard(false)}>
                  {copy.keepEditing}
                </Button>
                <Button variant="danger" onClick={close}>
                  {copy.discardChanges}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Button variant="ghost" onClick={dismiss} disabled={busy}>
                {copy.cancel}
              </Button>
              <Button type="submit" loading={busy}>
                {busy ? "Saving…" : copy.apply}
              </Button>
            </>
          )}
        </footer>
      </form>
    </dialog>,
    document.body,
  );
}
