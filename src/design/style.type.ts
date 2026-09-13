import type {
  CompiledStyles,
  InlineStyles,
  StyleXArray,
} from "@stylexjs/stylex";

/** Composable StyleX declarations, markers, and dynamic style results. */
export type StyleInput = StyleXArray<
  | CompiledStyles
  | readonly [CompiledStyles, InlineStyles]
  | boolean
  | null
  | undefined
>;
