import Stack from "#components/ui/stack.component";

export default function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <Stack y className="gap-1 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-36 shrink-0 text-sm font-medium text-text-muted">
        {label}
      </span>
      <span
        className={`text-sm text-text-primary  ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value || "—"}
      </span>
    </Stack>
  );
}
