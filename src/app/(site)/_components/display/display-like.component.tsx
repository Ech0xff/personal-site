"use client";
import * as stylex from "@stylexjs/stylex";
import { useAtom } from "jotai";

import { foundation } from "../../_design/foundation.style";
import { panel } from "./display-panel.style";
import { deskLikedAtom } from "./stats.atom";
export function DisplayLike() {
  const [liked, setLiked] = useAtom(deskLikedAtom);
  return (
    <button
      type="button"
      aria-pressed={liked}
      onClick={() => setLiked((value) => !value)}
      {...stylex.props(panel.button, foundation.focus)}
    >
      {liked ? "♥" : "♡"} {83 + Number(liked)} likes
    </button>
  );
}
