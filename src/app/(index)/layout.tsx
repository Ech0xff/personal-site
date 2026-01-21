import React from "react";
import NavBar from "./components/NavBar";

interface Props {
  children: React.ReactNode;
}

const LAYOUT_PADDING = "px-60"; // The padding variable

export default function Layout({ children }: Props) {
  return (
    <>
      <div className="flex relative flex-col duration-300">
        <NavBar layoutPadding={LAYOUT_PADDING} />
        <main
          className={`flex-1 overflow-y-auto overflow-x-hidden ${LAYOUT_PADDING}`}
        >
          {children}
        </main>
      </div>
    </>
  );
}
