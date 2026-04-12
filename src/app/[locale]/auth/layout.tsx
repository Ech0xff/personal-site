import { redirect } from "next/navigation";
import type React from "react";

import { makeServerClient } from "@/lib/server/supabase";
import { ROUTES } from "@/lib/shared/routes";
import { getUserStatus } from "@/lib/shared/utils/tools";

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const client = await makeServerClient();
  const { isAuth } = await getUserStatus(client);
  if (isAuth) redirect(ROUTES.DASHBOARD.ACCOUNT);
  return <>{children}</>;
}
