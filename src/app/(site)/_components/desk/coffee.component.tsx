import * as stylex from "@stylexjs/stylex";

import { objectMarker } from "../../_design/object-feedback.stylex";
import { ObjectFeedback } from "../object-feedback.component";
import { styles } from "./coffee.style";
export function Coffee({ name }: Readonly<{ name: string }>) {
  return (
    <div {...stylex.props(styles.coffee, objectMarker)}>
      <span {...stylex.props(styles.saucer)} />
      <span {...stylex.props(styles.handle)} />
      <span {...stylex.props(styles.cup)}>
        <i {...stylex.props(styles.coffeeShine)} />
      </span>
      <ObjectFeedback label={name} />
    </div>
  );
}
