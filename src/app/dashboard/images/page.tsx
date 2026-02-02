import HeaderSection from "../components/HeaderSection";
import ImageGallery from "./components/ImageGallery";

export default function ImagesPage() {
  return (
    <div className="space-y-6">
      <HeaderSection title="Image Gallery" />
      <ImageGallery />
    </div>
  );
}
