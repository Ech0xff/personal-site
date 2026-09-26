import * as stylex from "@stylexjs/stylex";

import { material, shadow } from "#design/tokens.stylex";

const styles = stylex.create({
  root: { position: "relative", width: "118px", height: "35px" },
  pencil: {
    position: "absolute",
    left: "52px",
    top: "-34px",
    width: "7px",
    height: "100px",
    backgroundImage: material.pencil,
    borderRadius: "2px",
    transform: "rotate(75deg)",
    boxShadow: shadow.detail,
  },
  tip: {
    position: "absolute",
    bottom: "-17px",
    width: "7px",
    height: "20px",
    backgroundImage: material.pencilTip,
    clipPath: "polygon(0 0,100% 0,50% 100%)",
  },
});
export function Pencil() {
  return (
    <div {...stylex.props(styles.root)}>
      <span {...stylex.props(styles.pencil)}>
        <i {...stylex.props(styles.tip)} />
      </span>
    </div>
  );
}
