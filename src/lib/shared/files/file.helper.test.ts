import { expect, test } from "bun:test";

import { makeFilePath, shouldCompressImage } from "./file.helper";
import { fileUploadSchema, MAX_FILE_SIZE } from "./file.schema";
test("compresses ordinary photos, preserving GIF, SVG and other files", () => {
  expect(shouldCompressImage("image/png")).toBe(true);
  expect(shouldCompressImage("image/jpeg")).toBe(true);
  expect(shouldCompressImage("image/webp")).toBe(true);
  for (const type of [
    "image/gif",
    "image/svg+xml",
    "video/mp4",
    "application/pdf",
    "",
  ])
    expect(shouldCompressImage(type)).toBe(false);
});
test("isolates duplicate names and removes path separators", () => {
  const a = makeFilePath("a", "../my file.pdf");
  expect(a).not.toContain("/");
  expect(a).not.toBe(makeFilePath("b", "../my file.pdf"));
  expect(a).toEndWith(".pdf");
});
test("applies the bucket size limit to all files", () => {
  expect(
    fileUploadSchema.safeParse({
      name: "data.bin",
      size: MAX_FILE_SIZE,
      type: "",
    }).success,
  ).toBe(true);
  expect(
    fileUploadSchema.safeParse({
      name: "data.bin",
      size: MAX_FILE_SIZE + 1,
      type: "",
    }).success,
  ).toBe(false);
  expect(
    fileUploadSchema.safeParse({
      name: "empty.txt",
      size: 0,
      type: "text/plain",
    }).success,
  ).toBe(false);
});
