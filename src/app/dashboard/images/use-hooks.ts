import { useCallback, useEffect, useState } from "react";

import { fetchImagesByBrowser } from "@/lib/client/services";
import { ImageFile } from "@/types";

export const useHooks = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const refetch = useCallback(async () => {
    try {
      const data = await fetchImagesByBrowser();
      setImages(data);
      setError(false);
    } catch {
      setImages([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const removeImage = (imageId: string) => {
    setImages((prev) => prev.filter((image) => image.id !== imageId));
  };

  return {
    images,
    loading,
    error,
    removeImage,
    refetch,
  };
};
