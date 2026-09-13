import * as stylex from "@stylexjs/stylex";
import { useAtom } from "jotai";
import { useState, type FormEvent } from "react";

import { foundation } from "../_design/foundation.style";
import {
  guestbookDraftAtom,
  guestbookEntriesAtom,
  guestbookTabAtom,
} from "./desk-preferences.atom";
import { sampleGuestbook } from "./display-content.const";
import { guestbookSubmissionSchema } from "./display-content.schema";
import { panel } from "./display-panel.style";
import { DisplayTabs } from "./display-tabs.component";
import { GuestbookAvatar } from "./guestbook-avatar.component";
import { GuestbookFieldIcon } from "./guestbook-field-icon.component";

export function DisplayGuestbook() {
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
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setEntries((previous) => [entry, ...previous].slice(0, 50));
    setDraft((previous) => ({ ...previous, message: "" }));
    setNotice("Thanks for stopping by!");
    setTab("read");
    document.getElementById("guestbook-read-tab")?.focus();
  };
  return (
    <div {...stylex.props(panel.guestbook)}>
      <DisplayTabs label="Guestbook pages">
        {(["read", "write"] as const).map((value) => (
          <button
            key={value}
            id={`guestbook-${value}-tab`}
            role="tab"
            type="button"
            aria-selected={tab === value}
            aria-controls="guestbook-page"
            tabIndex={tab === value ? 0 : -1}
            onClick={() => {
              setTab(value);
              setNotice("");
            }}
            {...stylex.props(
              panel.button,
              tab === value && panel.chosen,
              foundation.focus,
            )}
          >
            {value === "read"
              ? `Read (${entries.length + sampleGuestbook.length})`
              : "Write"}
          </button>
        ))}
      </DisplayTabs>
      <div
        id="guestbook-page"
        role="tabpanel"
        aria-labelledby={`guestbook-${tab}-tab`}
        tabIndex={tab === "read" ? 0 : undefined}
        data-lenis-prevent={tab === "read" ? "" : undefined}
        {...stylex.props(panel.page, tab === "read" && panel.read)}
      >
        {tab === "read" ? (
          <ul {...stylex.props(panel.list)}>
            {[...entries, ...sampleGuestbook].map((entry) => (
              <li key={entry.id} {...stylex.props(panel.entry)}>
                <div {...stylex.props(panel.byline)}>
                  <GuestbookAvatar githubUsername={entry.githubUsername} />
                  <div {...stylex.props(panel.author)}>
                    <strong {...stylex.props(panel.authorName)}>
                      {entry.name || "Anonymous"}
                    </strong>
                    <span {...stylex.props(panel.email)}>
                      {entry.email || "anoymous@unkonw.io"}
                    </span>
                  </div>
                  <time dateTime={entry.date} {...stylex.props(panel.date)}>
                    {entry.date.slice(5, 10)}
                  </time>
                </div>
                <p {...stylex.props(panel.message)}>{entry.message}</p>
              </li>
            ))}
          </ul>
        ) : (
          <form onSubmit={submit} {...stylex.props(panel.form)}>
            <label {...stylex.props(panel.identity)}>
              <GuestbookFieldIcon field="name" />
              <input
                aria-label="Name"
                name="name"
                autoComplete="name"
                placeholder="Anonymous"
                maxLength={40}
                value={draft.name}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
                {...stylex.props(panel.field)}
              />
            </label>
            <label {...stylex.props(panel.identity)}>
              <GuestbookFieldIcon field="email" />
              <input
                aria-label="Email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email (optional)"
                maxLength={160}
                value={draft.email}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    email: event.target.value,
                  }))
                }
                {...stylex.props(panel.field)}
              />
            </label>
            <label {...stylex.props(panel.identity)}>
              <GuestbookFieldIcon field="githubUsername" />
              <input
                aria-label="GitHub username"
                name="githubUsername"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="GitHub username (optional)"
                maxLength={39}
                value={draft.githubUsername ?? ""}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    githubUsername: event.target.value,
                  }))
                }
                {...stylex.props(panel.field)}
              />
            </label>
            <label {...stylex.props(panel.identity, panel.messageField)}>
              <GuestbookFieldIcon field="message" />
              <textarea
                data-lenis-prevent=""
                aria-label="Message"
                name="message"
                required
                minLength={3}
                maxLength={500}
                placeholder="Leave a little hello…"
                value={draft.message}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    message: event.target.value,
                  }))
                }
                {...stylex.props(panel.field, panel.textarea)}
              />
            </label>
            <div {...stylex.props(panel.submitRow)}>
              <button
                type="submit"
                {...stylex.props(panel.button, foundation.focus)}
              >
                Leave a note ↗
              </button>
            </div>
          </form>
        )}
      </div>
      {notice && <output {...stylex.props(panel.notice)}>{notice}</output>}
    </div>
  );
}
