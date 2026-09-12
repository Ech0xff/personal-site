import Button from "#components/ui/button.component";
import {
  CONFIG_KEY,
  OAUTH_PROVIDERS,
  type OAuthProvider,
  providerConfig,
} from "#lib/shared/config";
import { cn } from "#lib/shared/utils";

import useConfig from "../_hooks/config.hook";
import EditorShell from "./editor-shell.component";

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
      className="w-[60%] max-w-3xl"
      title={title}
      onDelete={hasStoredValue ? deleteConfig : undefined}
      onSave={() => saveConfig(value)}
      loading={loading}
    >
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-4",
          loading && "opacity-0",
        )}
      >
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
              className={cn(
                "h-auto justify-between rounded-2xl border-border-default bg-surface-panel px-5 py-4 text-left font-normal hover:border-info-border",
                enabled && "border-info-border bg-info-bg/70  ",
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl",
                    config.color,
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">
                    {config.label}
                  </p>
                  <p className="text-sm text-text-muted">
                    {enabled ? "Enabled globally" : "Disabled globally"}
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "relative h-7 w-12 rounded-full transition-colors",
                  enabled ? "bg-primary-bg" : "bg-surface-hover-strong ",
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 left-1 h-5 w-5 rounded-full bg-primary-fg transition-transform",
                    enabled && "translate-x-5",
                  )}
                />
              </div>
            </Button>
          );
        })}
      </div>
    </EditorShell>
  );
}
