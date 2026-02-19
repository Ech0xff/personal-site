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
      <StackY className="relative w-screen duration-300">
        <NavBar />
        <StackY className="flex-1 px-(--layout-padding-x) pt-12">
          {children}
        </StackY>
      </StackY>
    </>
  );
}
