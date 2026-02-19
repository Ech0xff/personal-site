import React from "react";

import StackY from "@/components/ui/StackY";
import NavBar from "./components/NavBar";
import "./layout.scss";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <StackY className="relative duration-300 w-screen">
        <NavBar />
        <StackY className="flex-1 pt-12 px-(--layout-padding-x)">
          {children}
        </StackY>
      </StackY>
    </>
  );
}
