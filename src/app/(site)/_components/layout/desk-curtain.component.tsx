import * as stylex from "@stylexjs/stylex";
import { motion } from "framer-motion";

import type { useDeskNavigation } from "./desk-navigation.hook";
import { shell } from "./desk-shell.style";

type Props = Pick<
  ReturnType<typeof useDeskNavigation>,
  "state" | "word" | "active" | "controls"
>;
export function DeskCurtain({ state, word, active, controls }: Props) {
  return (
    <>
      {" "}
      <motion.div
        id="redesign-curtain"
        data-phase={state.phase}
        aria-hidden="true"
        {...stylex.props(shell.curtain, !active && shell.hidden)}
        initial={{ y: state.phase === "intro" ? "0%" : "125%" }}
        animate={controls}
      >
        <span {...stylex.props(shell.curveTop)} />
        <span {...stylex.props(shell.curveBottom)} />
        <span {...stylex.props(shell.word)}>
          {(state.phase !== "intro" || word !== null) && (
            <i {...stylex.props(shell.wordDot)} />
          )}
          {state.phase === "intro" ? word : "label" in state ? state.label : ""}
        </span>
      </motion.div>
      <noscript>
        <style>{"#redesign-curtain{display:none!important}"}</style>
      </noscript>
    </>
  );
}
