import { Suspense } from "react";

import Loading from "#components/ui/loading.component";
import { requireAdminPage } from "#lib/server/auth/session.service";
import { listFiles } from "#lib/server/files/files.service";
import { fileQuerySchema } from "#lib/shared/files/file.schema";

import Files from "../_components/features/files/files.component";
type Props = {
  searchParams: Promise<{
    page?: string | string[];
    sort?: string | string[];
    direction?: string | string[];
  }>;
};
async function FilesData({ searchParams }: Props) {
  await requireAdminPage();
  const params = await searchParams;
  const query = fileQuerySchema.parse({
    page: params.page,
    sort: params.sort,
    direction: params.direction,
  });
  return (
    <Files
      {...await listFiles(query)}
      page={query.page}
      sort={query.sort}
      direction={query.direction}
    />
  );
}

export default function Page(props: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <FilesData {...props} />
    </Suspense>
  );
}
