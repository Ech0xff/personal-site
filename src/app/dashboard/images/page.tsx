"use client";

import DashboardShell from "../components/ui/DashboardShell";
import ImageGallery from "./components/ImageGallery";
import { useHooks } from "./use-hooks";

export default function ImagesPage() {
  const { images, loading, error, removeImage } = useHooks();

  return (
    <DashboardShell title="Image Gallery" loading={loading} error={error}>
      <ImageGallery images={images} onDeleteSuccess={removeImage} />
    </DashboardShell>
  );
}
