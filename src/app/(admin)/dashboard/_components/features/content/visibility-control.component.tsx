import SegmentedToggle from "#components/ui/segmented-toggle.component";
import type { Status } from "#lib/shared/content/status.schema";
const options = [
  { value: "hide", label: "Hide" },
  { value: "show", label: "Show" },
] as const;
export function VisibilityControl({
  value,
  onChange,
  disabled = false,
  label = "Visibility",
}: Readonly<{
  value: Status;
  onChange: (value: Status) => void;
  disabled?: boolean;
  label?: string;
}>) {
  return (
    <SegmentedToggle
      variant="surface"
      size="sm"
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
