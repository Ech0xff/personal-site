import { Link2 } from "lucide-react";

import { IDENTITY_PROVIDER } from "#lib/shared/config/config.const";
import type { IdentityProvider } from "#lib/shared/config/config.type";

import SvgGithub from "../components/icons/Github";
import SvgGoogle from "../components/icons/Google";

export const providerConfig = {
  [IDENTITY_PROVIDER.EMAIL]: {
    label: "email",
    icon: Link2,
    color: "bg-surface-muted text-text-primary",
  },
  [IDENTITY_PROVIDER.GITHUB]: {
    label: "GitHub",
    icon: SvgGithub,
    color: "bg-surface-inverse text-text-inverse",
  },
  [IDENTITY_PROVIDER.GOOGLE]: {
    label: "Google",
    icon: SvgGoogle,
    color: "bg-surface-panel text-text-primary",
  },
} satisfies Record<
  IdentityProvider,
  {
    label: string;
    icon: React.ElementType;
    color: string;
  }
>;
