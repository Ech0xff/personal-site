import * as stylex from "@stylexjs/stylex";
import { motion } from "framer-motion";

import Loading from "#components/ui/loading.component";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import { foundation } from "../../_design/foundation.style";
import type { useDeskNavigation } from "./desk-navigation.hook";
import { shell } from "./desk-shell.style";

type Props = Pick<
  ReturnType<typeof useDeskNavigation>,
  | "state"
  | "word"
  | "active"
  | "controls"
  | "curtain"
  | "slow"
  | "label"
  | "retry"
  | "returnToSource"
>;
export function DeskCurtain({
  state,
  word,
  active,
  controls,
  curtain,
  slow,
  label,
  retry,
  returnToSource,
}: Props) {
  return (
    <>
      <motion.div
        ref={curtain}
        id="redesign-curtain"
        data-phase={state.phase}
        role={active ? "dialog" : undefined}
        aria-modal={active || undefined}
        aria-label={`Loading ${label}`}
        aria-hidden={!active}
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const buttons = [
            ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
              "button",
            ),
          ];
          const first = buttons.at(0);
          const last = buttons.at(-1);
          if (!first) {
            event.preventDefault();
            return;
          }
          if (
            event.shiftKey &&
            (document.activeElement === first ||
              document.activeElement === event.currentTarget)
          ) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
        {...stylex.props(shell.curtain, !active && shell.hidden)}
        initial={{ y: "0%" }}
        animate={controls}
      >
        <span aria-hidden {...stylex.props(shell.curveTop)} />
        <span aria-hidden {...stylex.props(shell.curveBottom)} />
        <span {...stylex.props(shell.word)}>
          {(state.phase !== "intro" || word !== null) && (
            <i aria-hidden {...stylex.props(shell.wordDot)} />
          )}
          {state.phase === "intro" ? word : label}
        </span>
        {state.phase === "waiting" && (
          <Loading tone="inherit" xstyle={shell.curtainLoading} />
        )}
        {slow && (
          <div {...stylex.props(shell.curtainActions)}>
            <output>{copy.pageWait}</output>
            <div {...stylex.props(shell.curtainButtons)}>
              <button
                type="button"
                onClick={retry}
                {...stylex.props(shell.curtainButton, foundation.focus)}
              >
                {copy.reloadPage}
              </button>
              <button
                type="button"
                onClick={returnToSource}
                {...stylex.props(shell.curtainButton, foundation.focus)}
              >
                {copy.returnPage}
              </button>
            </div>
          </div>
        )}
      </motion.div>
      <noscript>
        <style>{"#redesign-curtain{display:none!important}"}</style>
      </noscript>
    </>
  );
}

const copy = defaultDictionary.desk;
