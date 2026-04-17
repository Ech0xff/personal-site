import { redirect } from "next/navigation";
import type React from "react";

import { makeServerClient } from "@/lib/server/supabase";
import { getLocalizedRoutes } from "@/lib/shared/routes";
import { getUserStatus } from "@/lib/shared/utils/tools";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;
  const routes = getLocalizedRoutes(locale);
  const client = await makeServerClient();
  const { isAuth } = await getUserStatus(client);
  if (isAuth) redirect(routes.DASHBOARD.ACCOUNT);
  return <>{children}</>;
}
