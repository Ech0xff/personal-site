import * as stylex from "@stylexjs/stylex";

import Stack from "#components/ui/stack.component";
import type { StyleInput } from "#design/style.type";
import { color, space, shape } from "#design/tokens.stylex";

import ThoughtCard, { type Thought } from "./thought-card.component";
const styles = stylex.create({
  column: {
    marginTop: space.lg,
    marginBottom: space.lg,
    gap: space.xxl,
    borderLeftWidth: shape.fine,
    borderLeftStyle: "solid",
    borderTopColor: color.line,
    borderRightColor: color.line,
    borderBottomColor: color.line,
    borderLeftColor: color.line,
    paddingTop: space.xs,
    paddingBottom: space.xs,
    paddingLeft: space.lg,
  },
});
interface Props {
  thoughts: Thought[];
  xstyle?: StyleInput;
  renderMetaRight?: (thought: Thought) => React.ReactNode;
  renderActions?: (thought: Thought) => React.ReactNode;
}
export default function ThoughtTimeline({
  thoughts,
  renderActions,
  xstyle,
}: Props) {
  return (
    <Stack y xstyle={[styles.column, xstyle]}>
      {thoughts.map((thought, index) => (
        <ThoughtCard
          key={thought.id}
          thought={thought}
          id={thought.id}
          index={index + 1}
          isLast={index === thoughts.length - 1}
          renderActions={renderActions}
        />
      ))}
    </Stack>
  );
}
