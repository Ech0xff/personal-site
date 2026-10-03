import imageCompression from "browser-image-compression";

export const compressToWebp = (file: File) =>
  imageCompression(file, {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.85,
  });
