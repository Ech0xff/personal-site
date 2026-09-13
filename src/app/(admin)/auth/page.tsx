import * as stylex from "@stylexjs/stylex";
import Link from "next/link";
import { redirect } from "next/navigation";

import ThemeToggle from "#components/shared/theme-toggle.component";
import {
  color,
  font,
  space,
  shape,
  shadow,
  motionToken,
} from "#design/tokens.stylex";
import { useDictionary } from "#dictionary";
import { loadConfigsByServer } from "#lib/server/services/configs.service";
import { makeServerClient } from "#lib/server/supabase.client";
import { getUserStatus } from "#lib/shared/auth/session.service";
import { CONFIG_KEY, type OAuthProvider } from "#lib/shared/config";
import { ROUTES } from "#lib/shared/routes/routes.const";

import AuthForm from "./_components/auth-form.component.client";
const styles = stylex.create({
  container: {
    position: "relative",
    display: "flex",
    minHeight: "100dvh",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.canvas,
    paddingTop: space.md,
    paddingRight: space.md,
    paddingBottom: space.md,
    paddingLeft: space.md,
  },
  container2: {
    position: "absolute",
    top: space.md,
    right: space.md,
    display: "flex",
    alignItems: "center",
    gap: space.xxs,
  },
  container3: {
    width: "100%",
    maxWidth: "448px",
  },
  container4: {
    borderTopLeftRadius: shape.panel,
    borderTopRightRadius: shape.panel,
    borderBottomRightRadius: shape.panel,
    borderBottomLeftRadius: shape.panel,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    borderTopColor: color.line,
    borderRightColor: color.line,
    borderBottomColor: color.line,
    borderLeftColor: color.line,
    backgroundColor: color.surface,
    paddingTop: space.xl,
    paddingRight: space.xl,
    paddingBottom: space.xl,
    paddingLeft: space.xl,
    boxShadow: shadow.panel,
  },
  description: {
    marginTop: space.lg,
    textAlign: "center",
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.muted,
  },
  link: {
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
    color: {
      default: null,
      ":hover": color.infoText,
    },
  },
});
export default async function Page() {
  const client = await makeServerClient();
  const { isAuth } = await getUserStatus(client);
  if (isAuth) redirect(ROUTES.DASHBOARD.ACCOUNT);
  const configs = await loadConfigsByServer([CONFIG_KEY.OAUTH]);
  const oauthProviders = configs[CONFIG_KEY.OAUTH];
  return (
    <AuthPageContent oauthProviders={oauthProviders} homeHref={ROUTES.HOME} />
  );
}
function AuthPageContent({
  oauthProviders,
  homeHref,
}: {
  oauthProviders: OAuthProvider[];
  homeHref: string;
}) {
  const dictionary = useDictionary();
  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.container2)}>
        <ThemeToggle />
      </div>
      <div {...stylex.props(styles.container3)}>
        <div {...stylex.props(styles.container4)}>
          <AuthForm oauthProviders={oauthProviders} />
        </div>
        <p {...stylex.props(styles.description)}>
          <Link href={homeHref} {...stylex.props(styles.link)}>
            &larr; {dictionary.auth.backToHome}
          </Link>
        </p>
      </div>
    </div>
  );
}
