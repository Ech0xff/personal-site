const paths = {
  github:
    "M8 20c-4 1-4-2-6-2m12 4v-4c0-1 .3-2 1-2.5 3-.4 5-1.5 5-5a4 4 0 0 0-1-3c.3-1 .3-2-.2-3-1.5 0-3 1-3.5 1a12 12 0 0 0-6.6 0C8 4.5 6.5 3.5 5 3.5c-.5 1-.5 2-.2 3a4 4 0 0 0-1 3c0 3.5 2 4.6 5 5-.7.5-1 1.5-1 2.5v5",
  email: "M3 5h18v14H3z M3 6l9 7 9-7",
  x: "M4 3h4l12 18h-4z M20 3l-7 8 M4 21l7-8",
  bilibili:
    "M8 2l3 4 M17 2l-3 4 M5 6h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z M8 11v3 M16 11v3 M10 17l2 1 2-1",
} as const;

export function SocialIcon({
  kind,
  size = 23,
}: Readonly<{ kind: keyof typeof paths; size?: number }>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[kind]} />
    </svg>
  );
}
