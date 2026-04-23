import { getThemedPlaylistUrl } from "@/lib/shared/config/site";
import { cn } from "@/lib/shared/utils";

import useConfig, { resolveConfigValue } from "../_hooks/useConfig";
import EditorShell from "./editor-shell";

export type ConfigField = {
  id: string;
  title: string;
};

function getPreviewUrl(
  value: string,
  theme: "dark" | "light",
): string | undefined {
  const trimmedValue = value.trim();
  if (!trimmedValue) return undefined;

  try {
    return getThemedPlaylistUrl(trimmedValue, theme);
  } catch {
    return undefined;
  }
}

export default function PlaylistUrl({ id, title }: ConfigField) {
  const {
    value,
    setValue,
    setLocale,
    loading,
    hasStoredValue,
    deleteConfig,
    saveConfig,
  } = useConfig({
    id,
    initialValue: "",
    resolveValue: resolveConfigValue,
  });
  const lightPreviewUrl = getPreviewUrl(value, "light");
  const darkPreviewUrl = getPreviewUrl(value, "dark");
  const hasPreview = Boolean(lightPreviewUrl && darkPreviewUrl);

  return (
    <EditorShell
      className="w-[70%]"
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
        <div className="flex shrink-0 flex-col gap-3 rounded-lg">
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="https://open.spotify.com/playlist/..."
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        {hasPreview && lightPreviewUrl && darkPreviewUrl && (
          <>
            <iframe
              title={`${title} dark preview`}
              allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
              height="450"
              className="hidden w-full overflow-hidden rounded-lg border-none dark:block"
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              src={darkPreviewUrl}
            />
            <iframe
              title={`${title} light preview`}
              allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
              height="450"
              className="w-full overflow-hidden rounded-lg border-none dark:hidden"
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              src={lightPreviewUrl}
            />
          </>
        )}
      </div>
    </EditorShell>
  );
}
