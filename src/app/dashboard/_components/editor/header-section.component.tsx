import Stack from "#components/ui/stack.component";

export default function HeaderSection({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <Stack
      x
      className="shrink-0 items-center justify-between border-b border-border-default px-6 py-4"
    >
      <Stack x className="min-w-0 items-center gap-4">
        <h1 className="truncate text-xl font-semibold text-text-primary">
          {title}
        </h1>
      </Stack>
      <Stack x className="items-center gap-3">
        {children}
      </Stack>
    </Stack>
  );
}
