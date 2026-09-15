import * as stylex from "@stylexjs/stylex";

import { shadow, shape, material } from "#design/tokens.stylex";

export const styles = stylex.create({
  coffee: {
    position: "relative",
    width: "145px",
    height: "130px",
  },
  saucer: {
    position: "absolute",
    width: "130px",
    height: "130px",
    borderRadius: shape.round,
    backgroundImage: material.saucer,
    boxShadow: shadow.lifted,
  },
  handle: {
    position: "absolute",
    right: "4px",
    top: "48px",
    width: "32px",
    height: "25px",
    borderWidth: "8px",
    borderStyle: "solid",
    borderColor: material.handle,
    borderTopLeftRadius: "5px",
    borderTopRightRadius: "11px",
    borderBottomRightRadius: "11px",
    borderBottomLeftRadius: "5px",
    boxShadow: shadow.detail,
  },
  cup: {
    position: "absolute",
    width: "91px",
    height: "91px",
    left: "19px",
    top: "18px",
    borderRadius: shape.round,
    borderWidth: "7px",
    borderStyle: "solid",
    borderColor: material.cup,
    backgroundImage: material.coffee,
    boxShadow: shadow.cup,
  },
  coffeeShine: {
    position: "absolute",
    left: "14px",
    top: "12px",
    width: "48px",
    height: "30px",
    borderTopWidth: "2px",
    borderTopStyle: "solid",
    borderTopColor: material.coffeeShine,
    borderRadius: shape.round,
    transform: "rotate(-25deg)",
  },
});
