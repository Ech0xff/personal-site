import * as stylex from "@stylexjs/stylex";

import Button from "#components/ui/button.component";
import { color, font, space, shape, motionToken } from "#design/tokens.stylex";
import {
  CONFIG_KEY,
  OAUTH_PROVIDERS,
  type OAuthProvider,
} from "#lib/shared/config";

import { providerConfig } from "../../../auth/_components/providers/provider.const";
import useConfig from "../_hooks/config.hook";
import EditorShell from "./editor-shell.component";
const styles = stylex.create({
  icon: {
    width: "60%",
    maxWidth: "768px",
  },
  container: {
    display: "flex",
    minHeight: "0px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    flexDirection: "column",
    gap: space.md,
  },
  container2: {
    opacity: 0,
  },
  button: {
    height: "auto",
    justifyContent: "space-between",
    borderTopLeftRadius: shape.panel,
    borderTopRightRadius: shape.panel,
    borderBottomRightRadius: shape.panel,
    borderBottomLeftRadius: shape.panel,
    borderTopColor: {
      default: color.line,
      ":hover": color.infoBorder,
    },
    borderRightColor: {
      default: color.line,
      ":hover": color.infoBorder,
    },
    borderBottomColor: {
      default: color.line,
      ":hover": color.infoBorder,
    },
    borderLeftColor: {
      default: color.line,
      ":hover": color.infoBorder,
    },
    backgroundColor: color.surface,
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: space.md,
    paddingBottom: space.md,
    textAlign: "left",
    fontWeight: font.regular,
  },
  button2: {
    borderTopColor: color.infoBorder,
    borderRightColor: color.infoBorder,
    borderBottomColor: color.infoBorder,
    borderLeftColor: color.infoBorder,
    backgroundColor: `color-mix(in srgb, ${color.infoSurface} 70%, transparent)`,
  },
  container3: {
    display: "flex",
    alignItems: "center",
    gap: space.md,
  },
  container4: {
    display: "flex",
    height: "44px",
    width: "44px",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: shape.card,
    borderTopRightRadius: shape.card,
    borderBottomRightRadius: shape.card,
    borderBottomLeftRadius: shape.card,
  },
  icon2: {
    height: "20px",
    width: "20px",
  },
  description: {
    fontWeight: font.medium,
    color: color.text,
  },
  description2: {
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.muted,
  },
  container5: {
    position: "relative",
    height: "28px",
    width: space.xxl,
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
    transitionProperty:
      "color, background-color, border-color, opacity, box-shadow, transform, translate, scale",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  container6: {
    backgroundColor: color.accent,
  },
  container7: {
    backgroundColor: color.surfaceStrong,
  },
  label: {
    position: "absolute",
    top: space.xxs,
    left: space.xxs,
    height: "20px",
    width: "20px",
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
    backgroundColor: color.objectLabel,
    transitionProperty: "transform, translate, scale",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  label2: {
    translate: "20px 0",
  },
});
const allProviders: OAuthProvider[] = [...OAUTH_PROVIDERS];
const title = "OAuth Providers";
export default function OauthProviders() {
  const { value, setValue, loading, hasStoredValue, deleteConfig, saveConfig } =
    useConfig({
      key: CONFIG_KEY.OAUTH,
    });
  const providers = value;
  const toggleProvider = (provider: OAuthProvider) => {
    setValue(
      providers.includes(provider)
        ? providers.filter((item) => item !== provider)
        : [...providers, provider],
    );
  };
  return (
    <EditorShell
      xstyle={styles.icon}
      title={title}
      onDelete={hasStoredValue ? deleteConfig : undefined}
      onSave={() => saveConfig(value)}
      loading={loading}
    >
      <div {...stylex.props([styles.container, loading && styles.container2])}>
        {allProviders.map((provider) => {
          const config = providerConfig[provider];
          const Icon = config.icon;
          const enabled = providers.includes(provider);
          return (
            <Button
              variant="ghost"
              key={provider}
              onClick={() => toggleProvider(provider)}
              aria-label={`${enabled ? "Disable" : "Enable"} ${config.label}`}
              aria-pressed={enabled}
              xstyle={[styles.button, enabled && styles.button2]}
            >
              <div {...stylex.props(styles.container3)}>
                <div {...stylex.props([styles.container4, config.xstyle])}>
                  <Icon {...stylex.props(styles.icon2)} />
                </div>
                <div>
                  <p {...stylex.props(styles.description)}>{config.label}</p>
                  <p {...stylex.props(styles.description2)}>
                    {enabled ? "Enabled globally" : "Disabled globally"}
                  </p>
                </div>
              </div>
              <div
                {...stylex.props([
                  styles.container5,
                  enabled ? styles.container6 : styles.container7,
                ])}
              >
                <span
                  {...stylex.props([styles.label, enabled && styles.label2])}
                />
              </div>
            </Button>
          );
        })}
      </div>
    </EditorShell>
  );
}
