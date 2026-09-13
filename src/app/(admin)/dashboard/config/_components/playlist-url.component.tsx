import * as stylex from "@stylexjs/stylex";
import { useAtomValue } from "jotai";

import Input from "#components/ui/input.component";
import { space, shape } from "#design/tokens.stylex";
import { resolvedThemeAtom } from "#lib/client/theme/theme.atom";
import { CONFIG_KEY, generatePlaylistUrl } from "#lib/shared/config";
import type { ResolvedTheme } from "#lib/shared/theme/theme.type";

import useConfig from "../_hooks/config.hook";
import EditorShell from "./editor-shell.component";
const styles = stylex.create({
  icon: {
    width: "100%",
    maxWidth: "1152px",
  },
  container: {
    display: "flex",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    flexDirection: "column",
    gap: space.md,
  },
  container2: {
    opacity: 0,
  },
  container3: {
    display: "flex",
    flexShrink: 0,
    flexDirection: "column",
    gap: space.sm,
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
  },
  input: {
    width: "100%",
  },
  container4: {
    width: "100%",
    overflow: "hidden",
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
    borderTopStyle: "none",
    borderRightStyle: "none",
    borderBottomStyle: "none",
    borderLeftStyle: "none",
  },
});
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
      xstyle={styles.icon}
      title={title}
      onDelete={hasStoredValue ? deleteConfig : undefined}
      onSave={() => saveConfig(value)}
      loading={loading}
    >
      <div {...stylex.props([styles.container, loading && styles.container2])}>
        <div {...stylex.props(styles.container3)}>
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="https://open.spotify.com/playlist/..."
            xstyle={styles.input}
          />
        </div>
        {previewUrl && (
          <iframe
            title={`${title} preview`}
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
            height="450"
            {...stylex.props(styles.container4)}
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            src={previewUrl}
          />
        )}
      </div>
    </EditorShell>
  );
}
