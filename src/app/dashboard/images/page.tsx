import { getImages } from "@/lib/data/dashboard";

import HeaderSection from "../components/HeaderSection";
import ImageGallery from "./components/ImageGallery";

export const dynamic = "force-dynamic";

export default async function ImagesPage() {
  const result = await getImages();
  const errorMessage = result.success
    ? ""
    : result.error || "Failed to load images";

  return (
    <div className="space-y-6">
      <HeaderSection title="Image Gallery" />
      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
          {errorMessage}
        </div>
      )}
      <ImageGallery images={result.success ? result.images || [] : []} />
    </div>
  );
}
