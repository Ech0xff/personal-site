import ContentPage from "../_components/features/content/content-page.component";
export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return <ContentPage kind="events" searchParams={searchParams} />;
}
