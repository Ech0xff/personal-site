import { Suspense } from "react";

import { readPublicDeskConfiguration } from "#lib/server/desk/desk-configuration.service";

import { ReadingDesk } from "./_components/desk/reading-desk.component";
import { DisplayGuestbook } from "./_components/display/display-guestbook.component";
import { DisplayStats } from "./_components/display/display-stats.component";
import {
  RoutePending,
  RouteReady,
} from "./_components/layout/route-ready.component";

async function HomeDesk() {
  const configuration = await readPublicDeskConfiguration();
  return (
    <RouteReady href="/">
      <ReadingDesk
        items={configuration.items}
        layouts={configuration.layouts}
        programs={{
          stats: <DisplayStats />,
          guestbook: <DisplayGuestbook />,
        }}
      />
    </RouteReady>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<RoutePending />}>
      <HomeDesk />
    </Suspense>
  );
}
