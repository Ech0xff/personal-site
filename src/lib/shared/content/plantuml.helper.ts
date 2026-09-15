import { deflateSync, strToU8 } from "fflate";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

export const isPlantUml = (language: string) =>
  ["plantuml", "puml"].includes(language.trim().toLowerCase());

/** PlantUML's raw-deflate and custom base64 URL format. */
export function plantUmlUrl(source: string): string {
  const bytes = deflateSync(strToU8(source));
  let encoded = "";
  for (let index = 0; index < bytes.length; index += 3) {
    const a = bytes[index];
    const b = bytes[index + 1] ?? 0;
    const c = bytes[index + 2] ?? 0;
    encoded +=
      alphabet[a >> 2] +
      alphabet[((a & 3) << 4) | (b >> 4)] +
      alphabet[((b & 15) << 2) | (c >> 6)] +
      alphabet[c & 63];
  }
  return `https://www.plantuml.com/plantuml/svg/${encoded}`;
}
