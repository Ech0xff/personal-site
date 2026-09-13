import { useEffect, useRef } from "react";

import { recordVisit } from "#lib/client/desk/desk.service";
export function useDeskVisits(pathname: string) {
  const lastPath = useRef<string | null>(null);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (
      !["/", "/posts", "/thoughts", "/events"].includes(pathname) &&
      !/^\/posts\/[0-9a-f-]{36}$/i.test(pathname)
    )
      return;
    void recordVisit(pathname).catch(() => undefined);
  }, [pathname]);
}
