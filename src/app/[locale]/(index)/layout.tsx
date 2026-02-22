import React from "react";

import FooterSection from "@/components/ui/FooterSection";
import Stack from "@/components/ui/Stack";

import NavBar from "./components/NavBar";
import "./layout.scss";

export default async function Layout({
  children,
  params,
}: {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}) {
  const { locale } = await params;
  return (
    <>
      <Stack y className="relative min-h-dvh w-dvw duration-300">
        <NavBar locale={locale} />
        <Stack y className="flex-1 px-(--layout-padding-x) pt-12">
          {children}
        </Stack>
        <FooterSection />
      </Stack>
    </>
  );
}
