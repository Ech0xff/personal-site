"use client";
import { useEffect } from "react";

import { useModal } from "#components/ui/modal-provider.component";
import { MODAL_ANCHOR, MODAL_BOUNDARY } from "#components/ui/modal.const";

export default function DashboardModalOptions() {
  const { setDefaultOptions } = useModal();
  useEffect(() => {
    setDefaultOptions({
      boundary: MODAL_BOUNDARY.ANCHOR,
      positionAnchor: MODAL_ANCHOR.DASHBOARD,
    });
    return () => {
      setDefaultOptions({
        boundary: MODAL_BOUNDARY.VIEWPORT,
        positionAnchor: MODAL_ANCHOR.BODY,
      });
    };
  }, [setDefaultOptions]);
  return null;
}
