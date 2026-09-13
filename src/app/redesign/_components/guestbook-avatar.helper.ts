import { githubUsernameSchema } from "./display-content.schema";

export function getGuestbookAvatarUrl(githubUsername?: string): string | null {
  const parsed = githubUsernameSchema.safeParse(githubUsername?.trim());
  return parsed.success
    ? `https://github.com/${parsed.data}.png?size=64`
    : null;
}
