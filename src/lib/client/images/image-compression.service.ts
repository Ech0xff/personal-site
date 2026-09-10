import imageCompression from "browser-image-compression";

/** Compresses an image file or blob to WebP format */
export const compressToWebp = async (file: File | Blob) => {
  const imageFile =
    file instanceof File
      ? file
      : new File([file], "image.png", { type: file.type || "image/png" });

  const compressedFile = await imageCompression(imageFile, {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.85,
  });

  return compressedFile;
};
