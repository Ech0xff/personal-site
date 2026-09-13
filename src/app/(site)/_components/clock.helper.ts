export type ClockFormat = "24h" | "12h";

export function formatClock(date: Date, format: ClockFormat): string {
  const hours = date.getHours();
  const pad = (value: number) => String(value).padStart(2, "0");
  const hour = format === "24h" ? hours : hours % 12 || 12;
  const suffix = format === "12h" ? (hours >= 12 ? " PM" : " AM") : "";
  return `${pad(hour)}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${suffix}`;
}
