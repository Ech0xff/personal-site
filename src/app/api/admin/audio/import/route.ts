import { after } from "next/server";

import { adminAction, InputError } from "#lib/server/actions/action.service";
import {
  prepareAudioImport,
  processAudioImport,
} from "#lib/server/audio/audio-import.service";
export const maxDuration = 300;
export async function POST(request: Request) {
  const result = await adminAction(async () => {
    if (request.headers.get("origin") !== new URL(request.url).origin)
      throw new InputError("Invalid request origin.");
    const job = await prepareAudioImport(await request.json());
    after(() => processAudioImport(job.id, job.runId));
    return { id: job.id };
  });
  return Response.json(result, {
    status: result.ok ? 202 : result.unauthorized ? 401 : 400,
  });
}
