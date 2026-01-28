import React from "react";
import { cn } from "@/lib/utils";
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
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 grid-background" style={gridStyles} />
    </div>
  );
}

export default function HeroSection() {
  return (
    <>
      <div
        className={cn(
          "w-screen absolute inset-0 flex items-center justify-center snap-start flex-col overflow-hidden bg-brand-gradient transition-all h-screen",
          "duration-(--duration-fast) group-data-[scrolled=true]:h-[60svh]",
        )}
      >
        <AnimatedGridBackground />
        <div className="relative flex-1 flex flex-col justify-center items-center">
          <div className="flex flex-col items-center">
            <h1
              className="text-6xl text-center"
              style={{ fontFamily: '"Titan One", cursive' }}
            >
              BBLF
            </h1>
            <div className="w-full h-px bg-linear-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent my-2" />
            <HeroTypewriter />
            <div className="w-full h-px bg-linear-to-r from-transparentmy-2" />
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
