import { lookup } from "node:dns/promises";
import { request as httpRequest, type IncomingMessage } from "node:http";
import { request as httpsRequest } from "node:https";

import ipaddr from "ipaddr.js";

import { MAX_AUDIO_BYTES } from "#lib/shared/audio/audio.schema";

export class AudioInputError extends Error {}

export function isPublicAddress(address: string): boolean {
  try {
    return ipaddr.process(address).range() === "unicast";
  } catch {
    return false;
  }
}
export function validateAudioUrl(value: string): URL {
  const url = new URL(value);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    (url.port && !["80", "443"].includes(url.port))
  )
    throw new AudioInputError("Use a public HTTP or HTTPS audio URL.");
  return url;
}
/** Pin the validated DNS answer to the connection, including every redirect. */
export async function downloadAudio(
  value: string,
  signal: AbortSignal,
  redirects = 0,
): Promise<Uint8Array> {
  const url = validateAudioUrl(value);
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = await lookup(hostname, { all: true });
  signal.throwIfAborted();
  if (
    !addresses.length ||
    addresses.some(({ address }) => !isPublicAddress(address))
  )
    throw new AudioInputError(
      "The audio URL must resolve to a public address.",
    );
  const address = addresses[0];
  const response = await new Promise<IncomingMessage>((resolve, reject) => {
    const request = (url.protocol === "https:" ? httpsRequest : httpRequest)(
      url,
      {
        signal,
        lookup: (_host, options, callback) => {
          if (options.all) callback(null, [address]);
          else callback(null, address.address, address.family);
        },
        headers: {
          "User-Agent": "PersonalSite-AudioImport/1.0",
          "Accept-Encoding": "identity",
        },
      },
      resolve,
    );
    request.on("error", reject);
    request.end();
  });
  if ([301, 302, 303, 307, 308].includes(response.statusCode ?? 0)) {
    response.destroy();
    if (redirects >= 3 || !response.headers.location)
      throw new AudioInputError("Too many audio URL redirects.");
    return downloadAudio(
      new URL(response.headers.location, url).href,
      signal,
      redirects + 1,
    );
  }
  if (
    response.statusCode !== 200 ||
    Number(response.headers["content-length"]) > MAX_AUDIO_BYTES
  ) {
    response.destroy();
    throw new AudioInputError("Audio download failed or exceeds 50 MiB.");
  }
  let size = 0;
  const chunks: Uint8Array[] = [];
  for await (const chunk of response) {
    if (!Buffer.isBuffer(chunk))
      throw new AudioInputError("Invalid audio response.");
    size += chunk.length;
    if (size > MAX_AUDIO_BYTES) {
      response.destroy();
      throw new AudioInputError("Audio exceeds 50 MiB.");
    }
    chunks.push(chunk);
  }
  if (!size) throw new AudioInputError("The audio file is empty.");
  return Buffer.concat(chunks);
}
