import { redirect } from "next/navigation";

import { ROUTES } from "@/lib/shared/routes";

export default function Page() {
  redirect(ROUTES.DASHBOARD.ACCOUNT);
}
