import { Suspense } from "react";

import Loading from "#components/ui/loading.component";
import { listAudioAssets } from "#lib/server/audio/audio-assets.service";
import { requireAdminPage } from "#lib/server/auth/session.service";
import { readAdminDeskConfiguration } from "#lib/server/desk/desk-configuration.service";

import HomepageEditor from "../_components/features/home/home-editor.component";

async function HomepageData() {
  await requireAdminPage();
  const [configuration, audioAssets] = await Promise.all([
    readAdminDeskConfiguration(),
    listAudioAssets(),
  ]);
  return <HomepageEditor initial={configuration} initialAudio={audioAssets} />;
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <HomepageData />
    </Suspense>
  );
}
