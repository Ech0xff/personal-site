"use client";
import { useEffect } from "react";

import { useModal } from "#components/ui/ModalProvider";

export default function DashboardModalOptions() {
  const { setDefaultOptions } = useModal();
  useEffect(() => {
    setDefaultOptions({ boundary: "anchor", positionAnchor: "--dashboard" });
    return () => {
      setDefaultOptions({ boundary: "viewport", positionAnchor: "--body" });
    };
  }, [setDefaultOptions]);
  return null;
}
