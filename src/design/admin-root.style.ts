import * as stylex from "@stylexjs/stylex";

import { color, font, layer, motionToken, shape } from "./tokens.stylex";

export const adminRoot = stylex.create({
  document: {
    backgroundColor: color.canvas,
    color: color.text,
    fontFamily: font.body,
    fontSize: font.bodySize,
    lineHeight: 1.5,
    "--admin-focus": color.focus,
    "--admin-scrollbar": color.scrollbar,
    "--admin-line": color.line,
    "--admin-control-radius": shape.control,
    "--admin-state-duration": motionToken.fast,
    "--admin-toast-layer": layer.toast,
  },
});
