import Stack from "@/components/ui/Stack";

export default function EditorHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <Stack
      x
      className="shrink-0 items-center justify-between border-zinc-200 border-b px-6 py-4 dark:border-zinc-800"
    >
      <Stack x className="min-w-0 items-center gap-4">
        <h1 className="truncate font-semibold text-xl text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
      </Stack>

      <Stack x className="items-center gap-3">
        {children}
      </Stack>
    </Stack>
  );
}
