import { createContext } from "react";

export const DeskItemContext = createContext<Readonly<{
  draggable: boolean;
  editing: boolean;
  emphasized: boolean;
}> | null>(null);
