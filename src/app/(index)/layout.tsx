import React from "react";

import NavBar from "./components/NavBar";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <div className="relative flex flex-col duration-300">
        <NavBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-(--layout-padding-x) pt-12">
          {children}
        </main>
      </div>
    </>
  );
}
