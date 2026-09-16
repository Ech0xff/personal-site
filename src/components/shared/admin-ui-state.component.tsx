"use client";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

import { isAdminAtom } from "#lib/client/auth/admin-ui.atom";

export default function AdminUiState({ value }: Readonly<{ value: boolean }>) {
  const setIsAdmin = useSetAtom(isAdminAtom);
  useEffect(() => {
    setIsAdmin(value);
  }, [setIsAdmin, value]);
  return null;
}
