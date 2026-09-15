import * as stylex from "@stylexjs/stylex";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import ThemeToggle from "#components/shared/theme-toggle.component";
import { Magnetic } from "#components/ui/magnetic.component";
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
    borderWidth: shape.fine,
    borderStyle: "solid",
    borderColor: color.line,
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
  backContent: { display: "inline-flex", alignItems: "center", gap: space.xs },
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
            <Magnetic>
              <span {...stylex.props(styles.backContent)}>
                <ArrowLeft size={16} aria-hidden />
                Back to site
              </span>
            </Magnetic>
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
