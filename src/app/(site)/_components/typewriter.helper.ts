export type TypewriterState = Readonly<{
  line: number;
  count: number;
  phase: "typing" | "holding" | "deleting";
}>;
export const initialTypewriterState: TypewriterState = {
  line: 0,
  count: 0,
  phase: "typing",
};
export const typingTiming = {
  typing: 80,
  holding: 2200,
  deleting: 35,
} as const;
export function advanceTypewriter(
  state: TypewriterState,
  lines: readonly string[],
): TypewriterState {
  if (lines.length === 0) return state;
  const length = Array.from(lines[state.line] ?? "").length;
  switch (state.phase) {
    case "typing":
      return state.count < length
        ? { ...state, count: state.count + 1 }
        : { ...state, phase: "holding" };
    case "holding":
      return { ...state, phase: "deleting" };
    case "deleting":
      return state.count > 0
        ? { ...state, count: state.count - 1 }
        : { line: (state.line + 1) % lines.length, count: 0, phase: "typing" };
  }
}
