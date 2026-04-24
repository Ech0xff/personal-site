"use client";
import { useEffect } from "react";
import { useModal } from "@/components/ui/ModalProvider";

export default function DashboardModalOptions() {
  const { setDefaultOptions } = useModal();
  useEffect(() => {
    setDefaultOptions({ positionAnchor: "--dashboard" });
    return () => {
      setDefaultOptions({ positionAnchor: "--body" });
    };
  }, [setDefaultOptions]);
  return null;
}
