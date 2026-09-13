import * as stylex from "@stylexjs/stylex";

import { palette } from "#design/tokens.stylex";

export const material = stylex.defineVars({
  book: palette.olive,
  bookSpine: "#884b39",
  cloth: "repeating-linear-gradient(90deg,#ffffff06 0 1px,transparent 1px 3px)",
  ruledPaper:
    "repeating-linear-gradient(transparent 0 27px, #887c6b12 27px 28px)",
  metal: "#a6a49b",
  binding: "#9c9485",
  highlight: "#ffffff18",
  scans:
    "repeating-linear-gradient(transparent 0px, transparent 2px, #00000012 3px, transparent 4px)",
  vinylSheen:
    "conic-gradient(from 25deg, transparent 0deg, #ffffff12 45deg, transparent 95deg, #00000066 180deg, #ffffff14 250deg, transparent 300deg)",
  playerText: "#eee7da",
  playerAccent: "#e8aa8b",
  playerRail: "#777b70",
  playerHover: "#46483f",
  recordMark: "#d28a6e",
  tonearm: "linear-gradient(90deg,#77756e,#d5d1c5 45%,#858078)",
  pivot: "radial-gradient(circle at 40% 30%,#d6d4c9,#8a8983)",
  saucer:
    "radial-gradient(circle,#ede3d2 46%,#d3c6b0 48%,#fcf7ec 51%,#e8ddcb 69%,#cabda5 71%)",
  handle: "#ece3d3",
  cup: "#fbf5e8",
  coffee:
    "radial-gradient(ellipse at 40% 35%,#795039,#4a2d1e 68%,#b89367 71%,#67442d 75%)",
  coffeeShine: "#e9bc8055",
  pencil:
    "linear-gradient(90deg,#635b46 20%,#a29a7a 25%,#4b4b3d 55%,#353b31 70%)",
  pencilTip: "linear-gradient(#d7b68b 0 70%,#34382c 70%)",
  bookInk: "#f3e6c8",
  bookBack: "#ad624b",
  paperEdge: "#e1dacb",
  lamp: "#a5513e",
  lampShade: "#733f32",
  glow: "#ffda8878",
  menuMask: "linear-gradient(#000 0 calc(100% - 36px), transparent 100%)",
  bulb: "#ffe5a2",
  vinyl: "#20221f",
  grooves: "#363832",
  recordLabel: "#ad624b",
  casing: "#dfd6bc",
  casingShade: "#b8b096",
  screen: "#252f29",
  phosphor: "#b8d0a0",
  running: "#8fbd80",
  paused: "#d57865",
});
export const light = stylex.defineVars({
  glowOpacity: "1",
  bulbOpacity: "1",
  warmth: "#ffda8640",
});
