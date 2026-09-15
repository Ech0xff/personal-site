import { Suspense } from "react";

import { readPublicAudioAssets } from "#lib/server/audio/audio-assets.service";
import { readPublicDeskConfiguration } from "#lib/server/desk/desk-configuration.service";

import { ReadingDesk } from "./_components/desk/reading-desk.component";
import { DisplayGuestbook } from "./_components/display/display-guestbook.component";
import { DisplayStats } from "./_components/display/display-stats.component";
import {
  RoutePending,
  RouteReady,
} from "./_components/layout/route-ready.component";

async function HomeDesk() {
  const [configuration, audioAssets] = await Promise.all([
    readPublicDeskConfiguration(),
    readPublicAudioAssets(),
  ]);
  return (
    <RouteReady href="/">
      <ReadingDesk
        audioAssets={audioAssets}
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
