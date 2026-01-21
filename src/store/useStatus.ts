import { create } from "zustand";

export type LayoutStatus = "home-top" | "other-top" | "scrolled";

interface StatusState {
  layoutStatus: LayoutStatus;
  setLayoutStatus: (status: LayoutStatus) => void;
}

export const useStatusStore = create<StatusState>((set) => ({
  layoutStatus: "home-top",
  setLayoutStatus: (status: LayoutStatus) => set({ layoutStatus: status }),
}));
