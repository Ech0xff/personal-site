import { Suspense } from "react";

import { ReadingDesk } from "./_components/desk/reading-desk.component";
import { DisplayGuestbook } from "./_components/display/display-guestbook.component";
import { DisplayLoading } from "./_components/display/display-loading.component";
import { DisplayStats } from "./_components/display/display-stats.component";
import { DisplayTerminal } from "./_components/display/display-terminal.component";

export default function HomePage() {
  return (
    <ReadingDesk
      programs={{
        terminal: <DisplayTerminal />,
        stats: (
          <Suspense fallback={<DisplayLoading />}>
            <DisplayStats />
          </Suspense>
        ),
        guestbook: (
          <Suspense fallback={<DisplayLoading />}>
            <DisplayGuestbook />
          </Suspense>
        ),
      }}
    />
  );
}
