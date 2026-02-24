import React from "react";

import FooterSection from "@/components/ui/FooterSection";

import LayoutClient from "./components/LayoutClient";
import NavBar from "./components/NavBar";
import "./layout.scss";

export default async function Layout({
  children,
  params,
}: {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}) {
  "use cache";
  const { locale } = await params;
  return (
    <LayoutClient navbar={<NavBar locale={locale} />}>
      {children}
      <FooterSection />
    </LayoutClient>
  );
}
