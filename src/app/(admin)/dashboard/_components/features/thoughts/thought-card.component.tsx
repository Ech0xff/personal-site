import * as stylex from "@stylexjs/stylex";

import Image from "#components/ui/image.component";
import Stack from "#components/ui/stack.component";
import { group } from "#design/interaction.stylex";
import type { StyleInput } from "#design/style.type";
import { color, font, space } from "#design/tokens.stylex";
import { useDictionary } from "#dictionary";
import { formatMessage } from "#lib/shared/dictionary/dictionary.helper";
import { formatTime } from "#lib/shared/utils/date.helper";
import type { Status } from "#types";

import ThoughtContent from "../content/thought-content.component";
const styles = stylex.create({
  container: {
    scrollMarginTop: "96px",
  },
  row: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  row2: {
    gap: space.sm,
    fontFamily: font.mono,
    fontSize: font.small,
    lineHeight: 1.5,
    color: color.muted,
  },
  label: {
    fontWeight: font.bold,
    color: color.muted,
  },
  row3: {
    alignItems: "center",
    gap: space.xs,
  },
  container3: {
    marginTop: space.xxl,
    height: "1px",
    width: "100%",
    backgroundColor: color.line,
  },
  container2: {
    marginTop: space.md,
    display: "grid",
    gap: space.xs,
    gridTemplateColumns: {
      default: "repeat(6, minmax(0, 1fr))",
      "@media (min-width: 768px)": "repeat(8, minmax(0, 1fr))",
      "@media (min-width: 1024px)": "repeat(10, minmax(0, 1fr))",
    },
  },
});
export type Thought = {
  id: string;
  content: string;
  images: string[];
  status: Status;
  published_at: string;
};
interface Props {
  thought: Thought;
  id?: string;
  xstyle?: StyleInput;
  index?: number;
  isLast?: boolean;
  renderActions?: (thought: Thought) => React.ReactNode;
}
export default function ThoughtCard({
  thought,
  id,
  xstyle,
  index,
  isLast = true,
  renderActions,
}: Props) {
  const dictionary = useDictionary();
  return (
    <div id={id} {...stylex.props([[styles.container, group], xstyle])}>
      {/* Meta Row */}
      <Stack x xstyle={styles.row}>
        <Stack x xstyle={styles.row2}>
          <span {...stylex.props(styles.label)}>
            #{index ? index : dictionary.thoughtCard.preview}
          </span>
          <span>•</span>
          <span>
            {formatTime(
              thought.published_at,
              "MM/DD, HH:mm",
              dictionary.common.unknownDate,
            )}
          </span>
        </Stack>
        <Stack x xstyle={styles.row3}>
          {renderActions?.(thought)}
        </Stack>
      </Stack>
      {/* Content */}
      <ThoughtContent content={thought.content} />
      {/* Images Grid */}
      {thought.images.length > 0 && (
        <div {...stylex.props([styles.container2])}>
          {thought.images.map((img, idx) => (
            <Image
              key={img}
              framed
              src={img}
              alt={formatMessage(dictionary.thoughtCard.imageAlt, {
                index: idx + 1,
              })}
            />
          ))}
        </div>
      )}
      {/* Divider */}
      {!isLast && <div {...stylex.props(styles.container3)} />}
    </div>
  );
}
