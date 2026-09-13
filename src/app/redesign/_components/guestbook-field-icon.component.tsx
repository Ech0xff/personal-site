import * as stylex from "@stylexjs/stylex";

import { panel } from "./display-panel.style";

const fieldIcons = {
  name: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM5 21v-2a7 7 0 0 1 14 0v2",
  email: "M3 5h18v14H3V5Zm0 1 9 7 9-7",
  githubUsername:
    "M8 20c-4 1-4-2-6-2m12 4v-4c0-1 .3-2 1-2.5 3-.4 5-1.5 5-5a4 4 0 0 0-1-3c.3-1 .3-2-.2-3-1.5 0-3 1-3.5 1a12 12 0 0 0-6.6 0C8 4.5 6.5 3.5 5 3.5c-.5 1-.5 2-.2 3a4 4 0 0 0-1 3c0 3.5 2 4.6 5 5-.7.5-1 1.5-1 2.5v5",
  message: "M4 4h16v12H9l-5 4V4Zm4 5h8m-8 4h5",
} as const;

export function GuestbookFieldIcon({
  field,
}: Readonly<{ field: keyof typeof fieldIcons }>) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...stylex.props(
        panel.fieldIcon,
        field === "message" && panel.messageIcon,
      )}
    >
      <path d={fieldIcons[field]} />
    </svg>
  );
}
