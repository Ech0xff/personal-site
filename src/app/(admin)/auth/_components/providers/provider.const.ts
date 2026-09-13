import * as stylex from "@stylexjs/stylex";
import { Link2 } from "lucide-react";

import SvgGithub from "#components/icons/Github";
import SvgGoogle from "#components/icons/Google";
import type { StyleInput } from "#design/style.type";
import { color } from "#design/tokens.stylex";
import { IDENTITY_PROVIDER } from "#lib/shared/config/config.const";
import type { IdentityProvider } from "#lib/shared/config/config.type";
const styles = stylex.create({
  email: {
    backgroundColor: color.surfaceMuted,
    color: color.text,
  },
  github: {
    backgroundColor: color.text,
    color: color.inverse,
  },
  google: {
    backgroundColor: color.surface,
    color: color.text,
  },
});
export const providerConfig = {
  [IDENTITY_PROVIDER.EMAIL]: {
    label: "email",
    icon: Link2,
    xstyle: styles.email,
  },
  [IDENTITY_PROVIDER.GITHUB]: {
    label: "GitHub",
    icon: SvgGithub,
    xstyle: styles.github,
  },
  [IDENTITY_PROVIDER.GOOGLE]: {
    label: "Google",
    icon: SvgGoogle,
    xstyle: styles.google,
  },
} satisfies Record<
  IdentityProvider,
  {
    label: string;
    icon: React.ElementType;
    xstyle: StyleInput;
  }
>;
