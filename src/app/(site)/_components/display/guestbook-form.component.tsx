import * as stylex from "@stylexjs/stylex";
import type { FormEventHandler } from "react";

import { foundation } from "../../_design/foundation.style";
import type { GuestbookDraft } from "./display-content.schema";
import { panel } from "./display-panel.style";
import { GuestbookFieldIcon } from "./guestbook-field-icon.component";
export function GuestbookForm({
  draft,
  pending,
  onChange,
  onSubmit,
}: Readonly<{
  draft: GuestbookDraft;
  pending: boolean;
  onChange: (update: (previous: GuestbookDraft) => GuestbookDraft) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}>) {
  return (
    <form onSubmit={onSubmit} {...stylex.props(panel.form)}>
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
            onChange((previous) => ({
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
            onChange((previous) => ({
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
          placeholder="GitHub (optional)"
          maxLength={39}
          value={draft.githubUsername ?? ""}
          onChange={(event) =>
            onChange((previous) => ({
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
            onChange((previous) => ({
              ...previous,
              message: event.target.value,
            }))
          }
          {...stylex.props(panel.field, panel.textarea)}
        />
      </label>
      <div {...stylex.props(panel.submitRow)}>
        <button
          disabled={pending}
          type="submit"
          {...stylex.props(panel.button, foundation.focus)}
        >
          Leave a note ↗
        </button>
      </div>
    </form>
  );
}
