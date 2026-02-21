import StackX from "@/components/ui/StackX";

export default function EditorHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <StackX className="shrink-0 items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
      <StackX className="min-w-0 items-center gap-4">
        <h1 className="truncate text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
      </StackX>

      <StackX className="items-center gap-3">{children}</StackX>
    </StackX>
  );
}
