"use client";

import { useEffect, useState } from "react";

import { type ImageFile, getImagesClient } from "@/lib/client/data";

import DashboardShell from "../components/ui/DashboardShell";
import ImageGallery from "./components/ImageGallery";

export default function ImagesPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setLoading(true);
      const result = await getImagesClient();

      if (!isMounted) return;

      if (result.success) {
        setImages(result.images || []);
        setErrorMessage("");
      } else {
        setImages([]);
        setErrorMessage(result.error || "Failed to load images");
      }

      setLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardShell title="Image Gallery" loading={loading}>
      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
          {errorMessage}
        </div>
      )}
      <ImageGallery images={images} />
    </DashboardShell>
  );
}
