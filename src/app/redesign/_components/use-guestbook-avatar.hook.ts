import { useState } from "react";

import { getGuestbookAvatarUrl } from "./guestbook-avatar.helper";

export function useGuestbookAvatar(githubUsername?: string) {
  const url = getGuestbookAvatarUrl(githubUsername);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  return {
    url: url === failedUrl ? null : url,
    failed: () => setFailedUrl(url),
  };
}
