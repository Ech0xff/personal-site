import { useRef, useState, useEffect, useCallback } from "react";

import { loadLinkMetadata } from "#lib/server/content/link-metadata.actions";
import { webUrlSchema } from "#lib/shared/content/link-metadata.schema";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import type { CmsEditor } from "./blocknote.schema";
export function useLinkCard(editor: CmsEditor, id: string) {
  const initial = editor.getBlock(id);
  const [url, setUrl] = useState(
    initial?.type === "linkCard" ? initial.props.url : "",
  );
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const request = useRef(0);
  const savedUrl = useRef(url);
  useEffect(
    () =>
      editor.onChange(() => {
        const block = editor.getBlock(id);
        if (
          block?.type === "linkCard" &&
          block.props.url !== savedUrl.current
        ) {
          savedUrl.current = block.props.url;
          request.current += 1;
          setPending(false);
          setUrl(block.props.url);
        }
      }),
    [editor, id],
  );
  const refresh = useCallback(async () => {
    const block = editor.getBlock(id);
    if (
      block?.type !== "linkCard" ||
      !webUrlSchema.safeParse(block.props.url).success
    )
      return;
    const target = block.props.url;
    const version = ++request.current;
    setPending(true);
    setNotice("");
    try {
      const result = await loadLinkMetadata(target);
      const current = editor.getBlock(id);
      if (
        request.current !== version ||
        current?.type !== "linkCard" ||
        current.props.url !== target
      )
        return;
      if (!result.ok) {
        setNotice(copy.metadataFailed);
        return;
      }
      editor.updateBlock(id, { props: result.data });
    } catch {
      if (request.current === version) setNotice(copy.metadataFailed);
    } finally {
      if (request.current === version) setPending(false);
    }
  }, [editor, id]);
  useEffect(() => {
    if (!editor.isEditable) return;
    const timer = setTimeout(() => {
      const target = url.trim();
      if (target && !webUrlSchema.safeParse(target).success) {
        setNotice(copy.invalidUrl);
        return;
      }
      const block = editor.getBlock(id);
      if (block?.type !== "linkCard") return;
      savedUrl.current = target;
      if (target !== block.props.url)
        editor.updateBlock(id, {
          props: {
            url: target,
            title: "",
            description: "",
            siteName: "",
            image: "",
            icon: "",
          },
        });
      if (
        target &&
        (target !== block.props.url ||
          (!block.props.title && !block.props.description))
      )
        void refresh();
    }, 500);
    return () => {
      clearTimeout(timer);
      request.current += 1;
    };
  }, [editor, id, url, refresh]);
  const changeUrl = (value: string) => {
    request.current += 1;
    setPending(false);
    setNotice("");
    setUrl(value);
    const target = value.trim();
    if (!target || webUrlSchema.safeParse(target).success) {
      const block = editor.getBlock(id);
      if (block?.type === "linkCard" && target !== block.props.url) {
        savedUrl.current = target;
        // Persist the URL immediately so saving during parsing keeps the link.
        editor.updateBlock(id, {
          props: {
            url: target,
            title: "",
            description: "",
            siteName: "",
            image: "",
            icon: "",
          },
        });
      }
    }
  };
  return { url, pending, notice, changeUrl, refresh };
}
const copy = defaultDictionary.editor;
