import { Suspense } from "react";
import { z } from "zod";

import Loading from "#components/ui/loading.component";
import { requireAdminPage } from "#lib/server/auth/session.service";
import { listManagedGuestbook } from "#lib/server/desk/guestbook.service";

import { GuestbookManager } from "../_components/features/guestbook/guestbook-manager.component";
type Props = Readonly<{ searchParams: Promise<{ page?: string }> }>;
async function Data({ searchParams }: Props) {
  await requireAdminPage();
  const page = z.coerce
    .number()
    .int()
    .min(0)
    .max(100000)
    .catch(0)
    .parse((await searchParams).page ?? 0);
  return <GuestbookManager {...await listManagedGuestbook(page)} page={page} />;
}
export default function Page(props: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <Data {...props} />
    </Suspense>
  );
}
