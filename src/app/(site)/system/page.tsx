import { RouteReady } from "../_components/layout/route-ready.component";
import { DesignSystem } from "./_components/design-system.component";
export default function SystemPage() {
  return (
    <RouteReady href="/system">
      <DesignSystem />
    </RouteReady>
  );
}
