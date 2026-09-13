import { useAtom } from "jotai";
import { useState, useRef, type FormEvent } from "react";

import { guestbookSubmissionSchema } from "./display-content.schema";
import {
  guestbookDraftAtom,
  guestbookEntriesAtom,
  guestbookTabAtom,
} from "./guestbook.atom";
export function useGuestbook() {
  const readTab = useRef<HTMLButtonElement>(null);
  const [tab, setTab] = useAtom(guestbookTabAtom);
  const [draft, setDraft] = useAtom(guestbookDraftAtom);
  const [entries, setEntries] = useAtom(guestbookEntriesAtom);
  const [notice, setNotice] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    const entry = {
      ...parsed.data,
      id: `local-${crypto.getRandomValues(new Uint32Array(4)).join("-")}`,
      date: new Date().toISOString(),
    };
    setEntries((previous) => [entry, ...previous].slice(0, 50));
    setDraft((previous) => ({ ...previous, message: "" }));
    setNotice("Thanks for stopping by!");
    setTab("read");
    readTab.current?.focus();
  };
  return {
    tab,
    setTab,
    draft,
    setDraft,
    entries,
    notice,
    setNotice,
    submit,
    readTab,
  };
}
