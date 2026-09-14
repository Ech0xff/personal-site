"use client";
import * as stylex from "@stylexjs/stylex";

import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import { foundation } from "../../_design/foundation.style";
import { DisplayLoading } from "./display-loading.component";
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
    total,
    loading,
    pending,
    retry,
    loadMore,
    notice,
    setNotice,
    submit,
    readTab,
  } = useGuestbook();
  if (tab === "read" && loading) return <DisplayLoading />;
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
            {value === "read" ? `Read (${total})` : "Write"}
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
          <>
            <GuestbookList entries={entries} />
            {!loading && entries.length === 0 && !notice && (
              <p>{copy.emptyNotes}</p>
            )}
            {entries.length < total && (
              <button
                type="button"
                disabled={loading}
                onClick={loadMore}
                {...stylex.props(panel.button, foundation.focus)}
              >
                {copy.loadMore}
              </button>
            )}
          </>
        ) : (
          <GuestbookForm
            draft={draft}
            pending={pending}
            onChange={setDraft}
            onSubmit={submit}
          />
        )}
      </div>
      {notice && (
        <output {...stylex.props(panel.notice)}>
          {notice}{" "}
          {tab === "read" && (
            <button
              type="button"
              onClick={retry}
              {...stylex.props(panel.button)}
            >
              {copy.retry}
            </button>
          )}
        </output>
      )}
    </div>
  );
}

const copy = defaultDictionary.desk;
