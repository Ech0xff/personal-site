import { useAtomValue } from "jotai";

import Input from "#components/ui/input.component";
import { resolvedThemeAtom } from "#lib/client/theme.atom";
import { CONFIG_KEY, generatePlaylistUrl } from "#lib/shared/config";
import type { ResolvedTheme } from "#lib/shared/theme/theme.type";
import { cn } from "#lib/shared/utils";

import useConfig from "../_hooks/config.hook";
import EditorShell from "./editor-shell.component";

const title = "Playlist URL";

function getPreviewUrl(
  value: string,
  theme: ResolvedTheme,
): string | undefined {
  const trimmedValue = value.trim();
  if (!trimmedValue) return undefined;

  try {
    return generatePlaylistUrl(trimmedValue, theme);
  } catch {
    return undefined;
  }
}

export default function PlaylistUrl() {
  const { value, setValue, loading, hasStoredValue, deleteConfig, saveConfig } =
    useConfig({
      key: CONFIG_KEY.PLAYLIST_URL,
    });
  const theme = useAtomValue(resolvedThemeAtom);
  const previewUrl = getPreviewUrl(value, theme);

  return (
    <EditorShell
      className="w-full max-w-6xl"
      title={title}
      onDelete={hasStoredValue ? deleteConfig : undefined}
      onSave={() => saveConfig(value)}
      loading={loading}
    >
      <div className={cn("flex flex-1 flex-col gap-4", loading && "opacity-0")}>
        <div className="flex shrink-0 flex-col gap-3 rounded-lg">
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="https://open.spotify.com/playlist/..."
            className="w-full"
          />
        </div>
        {previewUrl && (
          <iframe
            title={`${title} preview`}
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
            height="450"
            className="w-full overflow-hidden rounded-lg border-none"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            src={previewUrl}
          />
        )}
      </div>
    </EditorShell>
  );
}
