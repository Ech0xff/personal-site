import * as stylex from "@stylexjs/stylex";
import type { UserIdentity } from "@supabase/supabase-js";
import { assert } from "es-toolkit";
import { includes } from "es-toolkit/compat";
import { Link2Off, Loader2 } from "lucide-react";

import Button from "#components/ui/button.component";
import Stack from "#components/ui/stack.component";
import { color, font, space, shape, motionToken } from "#design/tokens.stylex";
import { IDENTITY_PROVIDER, type IdentityProvider } from "#lib/shared/config";

import { providerConfig } from "../../../../auth/_components/providers/provider.const";
const spin = stylex.keyframes({
  to: {
    rotate: "360deg",
  },
});
const styles = stylex.create({
  row: {
    alignItems: "center",
    justifyContent: "space-between",
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
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
    paddingLeft: space.md,
    paddingRight: space.md,
    paddingTop: space.sm,
    paddingBottom: space.sm,
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  row2: {
    alignItems: "center",
    gap: space.sm,
  },
  row3: {
    display: "flex",
    height: "36px",
    width: "36px",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
  },
  icon: {
    height: space.md,
    width: space.md,
  },
  row4: {
    alignItems: "center",
    gap: space.xs,
  },
  description: {
    fontSize: font.control,
    lineHeight: 1.5,
    fontWeight: font.medium,
    color: color.text,
  },
  label: {
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
    backgroundColor: color.infoSurface,
    paddingLeft: space.xs,
    paddingRight: space.xs,
    paddingTop: "2px",
    paddingBottom: "2px",
    fontSize: font.tiny,
    lineHeight: 1.5,
    fontWeight: font.medium,
    letterSpacing: ".025em",
    color: color.infoText,
    textTransform: "uppercase",
  },
  description2: {
    fontSize: font.small,
    lineHeight: 1.5,
    color: color.muted,
  },
  button: {
    gap: "6px",
    backgroundColor: {
      default: "transparent",
      ":hover": color.dangerSurface,
    },
  },
  icon2: {
    height: space.sm,
    width: space.sm,
    animationName: spin,
    animationDuration: "1s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
  link2Off: {
    height: space.sm,
    width: space.sm,
  },
});
const supportedProviders = Object.values(IDENTITY_PROVIDER);
const assertSupportedProvider: (
  provider: string,
) => asserts provider is IdentityProvider = (provider) => {
  assert(
    includes(supportedProviders, provider),
    `Unsupported identity provider: ${provider}`,
  );
};
const isPrimaryIdentity = (identity: UserIdentity) =>
  identity.provider === IDENTITY_PROVIDER.EMAIL;
export default function IdentityCard({
  identity,
  onUnlink,
}: {
  identity: UserIdentity;
  onUnlink: (identity: UserIdentity) => void;
}) {
  const provider = identity.provider;
  assertSupportedProvider(provider);
  const config = providerConfig[provider];
  const Icon = config.icon;
  return (
    <Stack x xstyle={styles.row}>
      <Stack x xstyle={styles.row2}>
        <Stack x xstyle={[styles.row3, config.xstyle, null]}>
          <Icon {...stylex.props(styles.icon)} />
        </Stack>
        <Stack y>
          <Stack x xstyle={styles.row4}>
            <p {...stylex.props(styles.description)}>{config.label}</p>
            {isPrimaryIdentity(identity) && (
              <span {...stylex.props(styles.label)}>Primary</span>
            )}
          </Stack>
          <p {...stylex.props(styles.description2)}>
            {identity.identity_data?.email ??
              identity.identity_data?.preferred_username ??
              "Connected"}
          </p>
        </Stack>
      </Stack>
      {!isPrimaryIdentity(identity) && (
        <Button
          size="sm"
          variant="danger"
          disabled={isPrimaryIdentity(identity)}
          onClick={() => onUnlink(identity)}
          xstyle={styles.button}
        >
          {isPrimaryIdentity(identity) ? (
            <Loader2 {...stylex.props(styles.icon2)} />
          ) : (
            <Link2Off {...stylex.props(styles.link2Off)} />
          )}
          Unlink
        </Button>
      )}
    </Stack>
  );
}
