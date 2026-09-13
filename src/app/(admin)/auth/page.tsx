import * as stylex from "@stylexjs/stylex";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import ThemeToggle from "#components/shared/theme-toggle.component";
import { color, font, shape, space } from "#design/tokens.stylex";
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
  description: { color: color.muted },
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
          <Link href="/">Back to site</Link>
          <ThemeToggle />
        </div>
        <h1 {...stylex.props(styles.title)}>Welcome back</h1>
        <p {...stylex.props(styles.description)}>
          Enter your token to manage your content.
        </p>
        <Suspense fallback={<p>Loading…</p>}>
          <AuthContent />
        </Suspense>
      </section>
    </main>
  );
}
