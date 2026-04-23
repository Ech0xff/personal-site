import { useCallback } from "react";

import {
  type OAuthProvider,
  providerConfig,
  resolveOauthProviders,
} from "@/lib/shared/config/oauth";
import { cn } from "@/lib/shared/utils";

import useConfig, { type ResolveConfigValueArgs } from "../_hooks/useConfig";
import EditorShell from "./editor-shell";

export type ConfigField = {
  id: string;
  title: string;
};

const allProviders = Object.keys(providerConfig) as OAuthProvider[];
const defaultProviders: OAuthProvider[] = [];

export default function OauthProviders({ id, title }: ConfigField) {
  const resolveOauthProviderValue = useCallback(
    ({ currentValue }: ResolveConfigValueArgs) =>
      Array.isArray(currentValue)
        ? resolveOauthProviders(currentValue, allProviders)
        : [],
    [],
  );

  const {
    value,
    setValue,
    setLocale,
    loading,
    hasStoredValue,
    deleteConfig,
    saveConfig,
  } = useConfig<OAuthProvider[]>({
    id,
    initialValue: defaultProviders,
    resolveValue: resolveOauthProviderValue,
  });

  const toggleProvider = (provider: OAuthProvider) => {
    setValue(
      value.includes(provider)
        ? value.filter((item) => item !== provider)
        : [...value, provider],
    );
  };

  return (
    <EditorShell
      className="h-[70%] w-[60%] max-w-3xl"
      title={title}
      onLocaleChange={setLocale}
      onDelete={hasStoredValue ? deleteConfig : undefined}
      onSave={saveConfig}
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
          const enabled = value.includes(provider);

          return (
            <button
              key={provider}
              type="button"
              onClick={() => toggleProvider(provider)}
              className={cn(
                "flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-left transition hover:border-blue-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-700 dark:hover:bg-zinc-900",
                enabled &&
                  "border-blue-500 bg-blue-50/70 dark:border-blue-600 dark:bg-blue-950/20",
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
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {config.label}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {enabled
                      ? "Enabled for this locale"
                      : "Disabled for this locale"}
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  "relative h-7 w-12 rounded-full transition",
                  enabled ? "bg-blue-600" : "bg-zinc-300 dark:bg-zinc-700",
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-transform",
                    enabled && "translate-x-5",
                  )}
                />
              </div>
            </button>
          );
        })}
      </div>
    </EditorShell>
  );
}
