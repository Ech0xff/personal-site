import { AlertTriangle, Check } from "lucide-react";

export default function StatusBadge({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  const styles =
    type === "success"
      ? "border-success-border bg-success-bg text-success-text   "
      : "border-danger-border bg-danger-bg text-danger-text   ";
  const Icon = type === "success" ? Check : AlertTriangle;

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${styles}`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {message}
    </div>
  );
}
