import { deflateSync, strToU8 } from "fflate";

const PLANTUML_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

function append3Bytes(bytes: number[]) {
  const c1 = bytes[0] ?? 0;
  const c2 = bytes[1] ?? 0;
  const c3 = bytes[2] ?? 0;

  return (
    PLANTUML_ALPHABET[c1 >> 2] +
    PLANTUML_ALPHABET[((c1 & 0x3) << 4) | (c2 >> 4)] +
    PLANTUML_ALPHABET[((c2 & 0xf) << 2) | (c3 >> 6)] +
    PLANTUML_ALPHABET[c3 & 0x3f]
  );
}

function encode64(data: Uint8Array) {
  let encoded = "";

  for (let index = 0; index < data.length; index += 3)
    encoded += append3Bytes([data[index], data[index + 1], data[index + 2]]);

  return encoded;
}

export function encodePlantUml(source: string) {
  return encode64(deflateSync(strToU8(source)));
}
