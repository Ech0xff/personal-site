"use client";
import * as stylex from "@stylexjs/stylex";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { z } from "zod";

import { updateGuestbook } from "#lib/server/desk/guestbook.actions";
import type { managedEntrySchema } from "#lib/shared/desk/desk.schema";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import { styles } from "./guestbook-manager.style";
export function GuestbookManager({
  entries,
  total,
  page,
}: Readonly<{
  entries: readonly z.infer<typeof managedEntrySchema>[];
  total: number;
  page: number;
}>) {
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const router = useRouter();
  const change = async (id: string, operation: "show" | "hide" | "delete") => {
    setPending(true);
    try {
      const result = await updateGuestbook({ id, operation });
      if (!result.ok) {
        setNotice(result.error);
        if (result.unauthorized) router.push("/auth");
        return;
      }
      setNotice("");
      router.refresh();
    } catch {
      setNotice(copy.updateFailed);
    } finally {
      setPending(false);
    }
  };
  return (
    <section {...stylex.props(styles.root)}>
      <h1>
        {copy.guestbook} ({total})
      </h1>
      {notice && <output>{notice}</output>}
      {entries.length === 0 && <p>{copy.noNotesOnPage}</p>}
      {entries.map((entry) => (
        <article key={entry.id} {...stylex.props(styles.entry)}>
          <div {...stylex.props(styles.byline)}>
            <strong>{entry.name || "Anonymous"}</strong>
            <span>{entry.email}</span>
            <time dateTime={entry.date}>{entry.date.slice(0, 10)}</time>
            <span>{entry.status === "show" ? copy.public : copy.hidden}</span>
          </div>
          <p {...stylex.props(styles.message)}>{entry.message}</p>
          <div {...stylex.props(styles.actions)}>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                void change(entry.id, entry.status === "show" ? "hide" : "show")
              }
              {...stylex.props(styles.button)}
            >
              {entry.status === "show" ? copy.hide : copy.restore}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => void change(entry.id, "delete")}
              {...stylex.props(styles.button)}
            >
              {copy.delete}
            </button>
          </div>
        </article>
      ))}
      <nav aria-label="Guestbook pages" {...stylex.props(styles.actions)}>
        {page > 0 && <Link href={`?page=${page - 1}`}>Previous</Link>}
        {(page + 1) * 50 < total && (
          <Link href={`?page=${page + 1}`}>Next</Link>
        )}
      </nav>
    </section>
  );
}

const copy = defaultDictionary.desk;
