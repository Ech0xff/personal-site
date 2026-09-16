import * as stylex from "@stylexjs/stylex";
import { Suspense } from "react";

import AdminUiState from "#components/shared/admin-ui-state.component";
import { color } from "#design/tokens.stylex";
import { requireAdminPage } from "#lib/server/auth/session.service";

import DashboardModalOptions from "./_components/dashboard-modal-options.component";
import DashboardNav from "./_components/layout/dashboard-nav.component";

const styles = stylex.create({
  layout: {
    display: "flex",
    flexDirection: { default: "row", "@media (max-width: 767px)": "column" },
    height: "100dvh",
    width: "100%",
    backgroundColor: color.canvas,
  },
});
async function AdminAccess() {
  await requireAdminPage();
  return <AdminUiState value />;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div {...stylex.props(styles.layout)}>
      <Suspense fallback={null}>
        <AdminAccess />
      </Suspense>
      <DashboardModalOptions />
      <DashboardNav />
      {children}
    </div>
  );
}
