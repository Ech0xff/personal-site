"use client";
import * as stylex from "@stylexjs/stylex";

import { foundation } from "../../_design/foundation.style";
import { sampleGuestbook } from "./display-content.const";
import { panel } from "./display-panel.style";
import { DisplayTabs } from "./display-tabs.component";
import { GuestbookForm } from "./guestbook-form.component";
import { GuestbookList } from "./guestbook-list.component";
import { useGuestbook } from "./guestbook.hook";

export function DisplayGuestbook() {
  const {
    tab,
    setTab,
    draft,
    setDraft,
    entries,
    notice,
    setNotice,
    submit,
    readTab,
  } = useGuestbook();
  return (
    <div {...stylex.props(panel.guestbook)}>
      <DisplayTabs label="Guestbook pages">
        {(["read", "write"] as const).map((value) => (
          <button
            key={value}
            id={`guestbook-${value}-tab`}
            ref={value === "read" ? readTab : undefined}
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
          <GuestbookList entries={[...entries, ...sampleGuestbook]} />
        ) : (
          <GuestbookForm draft={draft} onChange={setDraft} onSubmit={submit} />
        )}
      </div>
      {notice && <output {...stylex.props(panel.notice)}>{notice}</output>}
    </div>
  );
}
