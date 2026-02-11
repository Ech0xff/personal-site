import React from "react";

import { cn } from "@/lib/shared/utils";

import HeroTypewriter from "./Typewriter";
import "./index.scss";

function AnimatedGridBackground({
  smallGridSize = 30,
}: {
  smallGridSize?: number;
}) {
  const largeGridSize = smallGridSize * 8;
  const gridStyles = {
    "--small-size": `${smallGridSize}px`,
    "--large-size": `${largeGridSize}px`,
    "--grid-offset": `${largeGridSize}px`,
  } as React.CSSProperties;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="grid-background absolute inset-0" style={gridStyles} />
    </div>
  );
}

export default function HeroSection() {
  return (
    <>
      <div
        className={cn(
          "bg-brand-gradient absolute inset-0 flex h-screen w-screen snap-start flex-col items-center justify-center overflow-hidden transition-all",
          "duration-(--duration-fast) group-data-[scrolled=true]:h-[60svh]",
        )}
      >
        <AnimatedGridBackground />
        <div className="relative flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <h1
              className="text-center text-6xl"
              style={{ fontFamily: '"Titan One", cursive' }}
            >
              BBLF
            </h1>
            <div className="my-2 h-px w-full bg-linear-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700" />
            <HeroTypewriter />
            <div className="from-transparentmy-2 h-px w-full bg-linear-to-r" />
            <div
              className="mt-8 text-9xl font-black"
              style={{
                fontFamily:
                  '"Savoye LET", "Snell Roundhand", "Segoe Script", "Gabriola", cursive',
              }}
            >
              In code we trust
            </div>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "h-screen transition-all duration-(--duration-fast)",
          "group-data-[scrolled=true]:h-[60svh]",
        )}
      ></div>
    </>
  );
}
