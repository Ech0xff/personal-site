import * as stylex from "@stylexjs/stylex";

import { color } from "#design/tokens.stylex";

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
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div {...stylex.props(styles.layout)}>
      <DashboardModalOptions />
      <DashboardNav />
      {children}
    </div>
  );
}
