import { Suspense } from "react";
import { z } from "zod";

import Loading from "#components/ui/loading.component";
import { requireAdminPage } from "#lib/server/auth/session.service";
import { listFiles } from "#lib/server/files/files.service";

import Files from "../_components/features/files/files.component";
type Props = {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    direction?: string;
  }>;
};
async function FilesData({ searchParams }: Props) {
  await requireAdminPage();
  const params = await searchParams;
  const page = z.coerce
    .number()
    .int()
    .min(0)
    .max(100000)
    .catch(0)
    .parse(params.page ?? 0);
  const sort = z.enum(["time", "size"]).catch("time").parse(params.sort);
  const direction = z
    .enum(["asc", "desc"])
    .catch("desc")
    .parse(params.direction);
  return (
    <Files
      {...await listFiles({ page, sort, direction })}
      page={page}
      sort={sort}
      direction={direction}
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
