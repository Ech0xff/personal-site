export const shouldCompressImage = (type: string) =>
  ["image/jpeg", "image/png", "image/webp"].includes(type);
export const searchableFileName = (name: string) =>
  name.normalize("NFKC").replace(/[^a-zA-Z0-9._-]/g, "_");
export const makeFilePath = (id: string, name: string) =>
  `${id}-${searchableFileName(name).slice(-180) || "file"}`;
