"use server";
import { adminAction } from "../actions/action.service";
import { listAudioAssets, signAudioUpload } from "./audio-assets.service";
export async function readAudioLibrary() {
  return adminAction(listAudioAssets);
}
export async function createAudioUpload(input: unknown) {
  return adminAction(() => signAudioUpload(input));
}
