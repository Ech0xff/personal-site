import * as stylex from "@stylexjs/stylex";
import { motion } from "framer-motion";

import type { useDeskNavigation } from "./desk-navigation.hook";
import { shell } from "./desk-shell.style";

type Props = Pick<
  ReturnType<typeof useDeskNavigation>,
  "state" | "word" | "active" | "controls" | "curtain" | "label"
>;
export function DeskCurtain({
  state,
  word,
  active,
  controls,
  curtain,
  label,
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
          if (event.key === "Tab") event.preventDefault();
        }}
        {...stylex.props(shell.curtain, !active && shell.hidden)}
        initial={{ y: "0%" }}
        animate={controls}
      >
        <span aria-hidden {...stylex.props(shell.curveTop)} />
        <span aria-hidden {...stylex.props(shell.curveBottom)} />
        <span {...stylex.props(shell.word)}>
          {(state.presentation !== "greeting" || word !== null) && (
            <i aria-hidden {...stylex.props(shell.wordDot)} />
          )}
          {state.presentation === "greeting" ? word : label}
        </span>
      </motion.div>
      <noscript>
        <style>{"#redesign-curtain{display:none!important}"}</style>
      </noscript>
    </>
  );
}
