import ContentRenderer from "#components/features/content/content-renderer.component";
import { MarkdownEditor } from "#components/ui/codemirror";
import { CONFIG_KEY } from "#lib/shared/config";
import { cn } from "#lib/shared/utils";

import useConfig from "../_hooks/config.hook";
import EditorShell from "./editor-shell.component";

const title = "About Me";

export default function AboutMe() {
  const {
    value,
    setValue,
    locale,
    setLocale,
    loading,
    hasStoredValue,
    deleteConfig,
    saveConfig,
  } = useConfig({
    key: CONFIG_KEY.ABOUT_ME,
  });

  return (
    <EditorShell
      className="h-[80%] w-[80%]"
      title={title}
      locale={locale}
      onLocaleChange={setLocale}
      onDelete={hasStoredValue ? deleteConfig : undefined}
      onSave={() => saveConfig(value)}
      loading={loading}
    >
      <div
        className={cn(
          "grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2",
          loading && "opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden rounded-lg">
          <MarkdownEditor
            value={value}
            mode="live"
            onChange={setValue}
            className="h-full min-h-0 overflow-auto"
          />
        </div>
        <div className="min-h-0 overflow-auto rounded-lg bg-white dark:bg-zinc-950">
          <ContentRenderer
            content={value || "No content"}
            className="min-h-full p-4"
          />
        </div>
      </div>
    </EditorShell>
  );
}
