import { expect, test } from "bun:test";

import { makeFilePath } from "./file.helper";
import { fileUploadSchema, MAX_FILE_SIZE } from "./file.schema";

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
