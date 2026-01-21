import React from "react";
import NavBar from "./components/NavBar";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <div className="flex relative flex-col duration-300">
        <NavBar />
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden px-(--layout-padding-x)"
        >
          {children}
        </main>
      </div>
    </>
  );
}
