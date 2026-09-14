import { useAtom } from "jotai";
import {
  useCallback,
  useLayoutEffect,
  useState,
  useRef,
  type FormEvent,
} from "react";

import { readGuestbook, submitGuestbook } from "#lib/client/desk/desk.service";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import {
  guestbookSubmissionSchema,
  type GuestbookEntry,
} from "./display-content.schema";
import { guestbookDraftAtom, guestbookTabAtom } from "./guestbook.atom";
export function useGuestbook() {
  const readTab = useRef<HTMLButtonElement>(null);
  const [tab, setTab] = useAtom(guestbookTabAtom);
  const [draft, setDraft] = useAtom(guestbookDraftAtom);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(tab === "read");
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);
  const request = useRef<AbortController | null>(null);
  const load = useCallback(async (nextPage: number) => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    try {
      const data = await readGuestbook(nextPage, controller.signal);
      if (controller.signal.aborted) return;
      setEntries((previous) =>
        nextPage === 0
          ? data.entries
          : [
              ...previous,
              ...data.entries.filter(
                (entry) => !previous.some(({ id }) => id === entry.id),
              ),
            ],
      );
      setTotal(data.total);
      setPage(nextPage);
      setNotice("");
    } catch {
      if (!controller.signal.aborted) setNotice(copy.notesUnavailable);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);
  useLayoutEffect(() => {
    if (tab === "read") void load(0);
    return () => request.current?.abort();
  }, [load, tab]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current) return;
    const parsed = guestbookSubmissionSchema.safeParse({
      ...draft,
      email: draft.email.trim(),
    });
    if (!parsed.success) {
      setNotice(
        parsed.error.issues[0]?.message ?? "Please check your message.",
      );
      return;
    }
    submitting.current = true;
    setPending(true);
    try {
      const result = await submitGuestbook(parsed.data);
      if (!result.ok) {
        setNotice(result.error);
        return;
      }
      setDraft((previous) => ({ ...previous, message: "" }));
      setNotice("");
      setTab("read");
      readTab.current?.focus();
    } catch {
      setNotice(copy.submitFailed);
    } finally {
      submitting.current = false;
      setPending(false);
    }
  };
  return {
    tab,
    setTab,
    draft,
    setDraft,
    entries,
    total,
    loading,
    pending,
    notice,
    setNotice,
    submit,
    readTab,
    retry: () => void load(0),
    loadMore: () => void load(page + 1),
  };
}

const copy = defaultDictionary.desk;
