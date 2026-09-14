import { ReadingDesk } from "./_components/desk/reading-desk.component";
import { DisplayGuestbook } from "./_components/display/display-guestbook.component";
import { DisplayStats } from "./_components/display/display-stats.component";
import { DisplayTerminal } from "./_components/display/display-terminal.component";
import { RouteReady } from "./_components/layout/route-ready.component";

export default function HomePage() {
  return (
    <RouteReady href="/">
      <ReadingDesk
        programs={{
          terminal: <DisplayTerminal />,
          stats: <DisplayStats />,
          guestbook: <DisplayGuestbook />,
        }}
      />
    </RouteReady>
  );
}
