import * as stylex from "@stylexjs/stylex";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import ThemeToggle from "#components/shared/theme-toggle.component";
import { Magnetic } from "#components/ui/magnetic.component";
import { color, font, shape, shadow, space } from "#design/tokens.stylex";
import { hasAdminSession } from "#lib/server/auth/session.service";

import TokenForm from "./_components/token-form.component";
const styles = stylex.create({
  page: {
    minHeight: "100dvh",
    display: "grid",
    placeItems: "center",
    padding: space.lg,
    backgroundColor: color.canvas,
    color: color.text,
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: space.xl,
    borderRadius: shape.card,
    backgroundColor: color.surface,
    borderWidth: shape.fine,
    borderStyle: "solid",
    borderColor: color.line,
    boxShadow: shadow.panel,
    display: "flex",
    flexDirection: "column",
    gap: space.lg,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: font.heading, fontWeight: font.semibold },
  back: {
    color: { default: color.secondary, ":hover": color.text },
    textDecoration: "none",
    outline: { default: "none", ":focus-visible": `2px solid ${color.focus}` },
    outlineOffset: "4px",
  },
});
async function AuthContent() {
  if (await hasAdminSession()) redirect("/dashboard/posts");
  return <TokenForm />;
}
export default function AuthPage() {
  return (
    <main {...stylex.props(styles.page)}>
      <section {...stylex.props(styles.card)}>
        <div {...stylex.props(styles.header)}>
          <Link href="/" {...stylex.props(styles.back)}>
            <Magnetic>Back to site</Magnetic>
          </Link>
          <ThemeToggle />
        </div>
        <h1 {...stylex.props(styles.title)}>Welcome back</h1>
        <Suspense fallback={<p>Loading…</p>}>
          <AuthContent />
        </Suspense>
      </section>
    </main>
  );
}
