"use client";

import { useEffect, useState } from "react";

import { fetchImagesByBrowser } from "@/lib/client/services";
import { ImageFile } from "@/types";

import DashboardShell from "../components/ui/DashboardShell";
import ImageGallery from "./components/ImageGallery";

export default function ImagesPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setLoading(true);
      fetchImagesByBrowser()
        .then((res) => {
          setImages(res);
        })
        .finally(() => setLoading(false));

      if (!isMounted) return;
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardShell title="Image Gallery" loading={loading}>
      <ImageGallery images={images} />
    </DashboardShell>
  );
}
