import React from "react";

import FooterSection from "@/components/ui/FooterSection";
import StackY from "@/components/ui/StackY";

import NavBar from "./components/NavBar";
import "./layout.scss";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <StackY className="relative min-h-dvw w-dvw duration-300">
        <NavBar />
        <StackY className="flex-1 px-(--layout-padding-x) pt-12">
          {children}
        </StackY>
        <FooterSection />
      </StackY>
    </>
  );
}
