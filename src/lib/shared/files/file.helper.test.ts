import { expect, test } from "bun:test";

import { makeFilePath } from "./file.helper";
import {
  fileQuerySchema,
  fileUploadSchema,
  MAX_FILE_SIZE,
} from "./file.schema";

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

test("file URL queries preserve sorting and numeric pagination", () => {
  expect(
    fileQuerySchema.parse({ page: "12", sort: "size", direction: "asc" }),
  ).toEqual({ page: 12, sort: "size", direction: "asc", search: "" });
  expect(fileQuerySchema.parse({})).toEqual({
    page: 0,
    sort: "time",
    direction: "desc",
    search: "",
  });
});

test("malformed file URL parameters fall back independently", () => {
  for (const page of ["invalid", "-1", "1.5", "100001", ["1", "2"]]) {
    expect(
      fileQuerySchema.parse({ page, sort: "size", direction: "asc" }),
    ).toEqual({ page: 0, sort: "size", direction: "asc", search: "" });
  }
  expect(
    fileQuerySchema.parse({
      page: "3",
      sort: "name",
      direction: ["asc", "desc"],
    }),
  ).toEqual({ page: 3, sort: "time", direction: "desc", search: "" });
});
