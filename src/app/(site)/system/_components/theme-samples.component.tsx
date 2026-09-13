import * as stylex from "@stylexjs/stylex";

import {
  darkShadowTheme,
  lightTheme,
  lightShadowTheme,
  darkMaterialTheme,
  lightMaterialTheme,
  darkLightingTheme,
  lightLightingTheme,
  material,
  lighting,
  darkTheme,
  color,
  font,
  media,
  shadow,
  shape,
  space,
} from "#design/tokens.stylex";

export function ThemeSamples() {
  return (
    <section aria-labelledby="theme-tokens" {...stylex.props(styles.section)}>
      <h2 id="theme-tokens" {...stylex.props(styles.heading)}>
        Shared interface tokens
      </h2>
      <p {...stylex.props(styles.intro)}>
        Forms, feedback, and code use the same semantic tokens. Dark overrides
        stay local to each sample, independent of the page preference.
      </p>
      <div {...stylex.props(styles.grid)}>
        {(["light", "dark"] as const).map((theme) => (
          <div
            key={theme}
            data-theme={theme}
            {...stylex.props(
              theme === "dark" ? darkTheme : lightTheme,
              theme === "dark" ? darkShadowTheme : lightShadowTheme,
              theme === "dark" ? darkMaterialTheme : lightMaterialTheme,
              theme === "dark" ? darkLightingTheme : lightLightingTheme,
              styles.panel,
            )}
          >
            <h3 {...stylex.props(styles.label)}>
              {theme === "dark" ? "Dark" : "Light"}
            </h3>
            <div {...stylex.props(styles.materials)}>
              <span {...stylex.props(styles.book)}>Book cloth</span>
              <span {...stylex.props(styles.screen)}>hello, world_</span>
              <span {...stylex.props(styles.lamp)}>Warm light</span>
            </div>
            <label {...stylex.props(styles.field)}>
              Title
              <input
                defaultValue="A quiet morning"
                aria-label={`${theme} sample title`}
                {...stylex.props(styles.input)}
              />
            </label>
            <div {...stylex.props(styles.row)}>
              <button type="button" {...stylex.props(styles.button)}>
                Save
              </button>
              <button type="button" disabled {...stylex.props(styles.button)}>
                Disabled
              </button>
            </div>
            <div {...stylex.props(styles.status, styles.success)}>
              Saved successfully
            </div>
            <div {...stylex.props(styles.status, styles.warning)}>
              Review before publishing
            </div>
            <div {...stylex.props(styles.status, styles.error)}>
              A title is required
            </div>
            <div {...stylex.props(styles.status, styles.info)}>
              Changes are private until published
            </div>
            <code {...stylex.props(styles.code)}>
              <span {...stylex.props(styles.keyword)}>const</span> title ={" "}
              <span {...stylex.props(styles.string)}>"A quiet morning"</span>;
            </code>
          </div>
        ))}
      </div>
    </section>
  );
}
const styles = stylex.create({
  materials: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.sm,
    marginBottom: space.md,
  },
  book: {
    padding: space.sm,
    backgroundColor: material.book,
    color: material.bookInk,
    boxShadow: shadow.contact,
  },
  screen: {
    padding: space.sm,
    backgroundColor: material.screen,
    color: material.phosphor,
    boxShadow: shadow.inset,
  },
  lamp: {
    padding: space.sm,
    backgroundImage: `radial-gradient(${material.glow}, ${lighting.warmth}, transparent)`,
    color: color.text,
  },
  section: {
    marginTop: space.xxl,
    paddingTop: space.xl,
    borderTopWidth: shape.fine,
    borderTopStyle: "solid",
    borderTopColor: color.line,
  },
  heading: {
    fontFamily: font.display,
    fontSize: font.heading,
    fontWeight: font.regular,
    marginBottom: space.lg,
  },
  intro: { color: color.muted, lineHeight: 1.8, marginBottom: space.lg },
  grid: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(2,minmax(0,1fr))",
      [media.phone]: "1fr",
    },
    gap: space.lg,
  },
  panel: {
    backgroundColor: color.canvas,
    color: color.text,
    padding: space.lg,
    borderRadius: shape.panel,
    borderWidth: shape.fine,
    borderStyle: "solid",
    borderColor: color.line,
    boxShadow: shadow.subtle,
    fontFamily: font.body,
    display: "flex",
    flexDirection: "column",
    gap: space.md,
  },
  label: { fontSize: font.large, fontWeight: font.semibold },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    fontSize: font.control,
  },
  input: {
    padding: space.sm,
    backgroundColor: color.input,
    color: color.text,
    borderRadius: shape.control,
    borderWidth: shape.fine,
    borderStyle: "solid",
    borderColor: color.line,
    outlineColor: color.focus,
  },
  row: { display: "flex", gap: space.sm },
  button: {
    paddingBlock: space.xs,
    paddingInline: space.md,
    borderRadius: shape.control,
    backgroundColor: { default: color.accent, ":hover": color.accentHover },
    color: color.onAccent,
    borderWidth: 0,
    opacity: { default: 1, ":disabled": 0.5 },
    cursor: { default: "pointer", ":disabled": "default" },
    outlineColor: color.focus,
  },
  status: {
    padding: space.sm,
    borderRadius: shape.control,
    borderWidth: shape.fine,
    borderStyle: "solid",
    fontSize: font.control,
  },
  success: {
    backgroundColor: color.successSurface,
    color: color.successText,
    borderColor: color.successBorder,
  },
  warning: {
    backgroundColor: color.warningSurface,
    color: color.warningText,
    borderColor: color.warningBorder,
  },
  error: {
    backgroundColor: color.dangerSurface,
    color: color.dangerText,
    borderColor: color.dangerBorder,
  },
  info: {
    backgroundColor: color.infoSurface,
    color: color.infoText,
    borderColor: color.infoBorder,
  },
  code: {
    fontFamily: font.mono,
    fontSize: font.small,
    color: color.codeText,
    overflowX: "auto",
    whiteSpace: "nowrap",
  },
  keyword: { color: color.codeKeyword },
  string: { color: color.codeString },
});
