import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import { toast } from "sonner";

import {
  deleteImageByBrowser,
  fetchImagesByBrowser,
} from "@/lib/client/services";
import { ImageFile } from "@/types";

type SortField = "createdAt" | "size";
type SortOrder = "asc" | "desc";

export const useHooks = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isPending, startTransition] = useTransition();

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

  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => {
      let comparison = 0;

      if (sortField === "createdAt") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === "size") {
        comparison = a.size - b.size;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [images, sortField, sortOrder]);

  const handleDelete = (
    image: ImageFile,
    onDeleteSuccess?: (id: string) => void,
  ) => {
    if (!confirm(`Delete "${image.name}"?`)) return;
    const toastId = toast.loading(`Deleting "${image.name}"...`);
    startTransition(async () => {
      try {
        await deleteImageByBrowser(image.name);
        if (onDeleteSuccess) onDeleteSuccess(image.id);
        toast.success("Image deleted successfully.", { id: toastId });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete image",
          { id: toastId },
        );
      }
    });
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return {
    images,
    sortedImages,
    loading,
    error,
    sortField,
    sortOrder,
    isPending,
    removeImage,
    toggleSort,
    handleDelete,
  };
};
