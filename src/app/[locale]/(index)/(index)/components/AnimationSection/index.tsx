import React from "react";

import Stack from "@/components/ui/Stack";
import { cn } from "@/lib/shared/utils";

import Typewriter from "./Typewriter";
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

export default function AnimationSection() {
  return (
    <>
      <Stack
        y
        className={cn(
          "bg-brand-gradient absolute inset-0 h-dvh w-dvw snap-start items-center justify-center overflow-hidden transition-all",
          "duration-300 group-data-[scrolled=true]:h-[60svh]",
        )}
      >
        <AnimatedGridBackground />
        <Stack
          y
          className="relative flex-1 items-center justify-center text-[clamp(0.6rem,2vw,1.2rem)]"
        >
          <Stack y className="items-center">
            <h1
              className="text-center text-[5em]"
              style={{ fontFamily: '"Titan One", cursive' }}
            >
              BBLF
            </h1>

            <div className="my-2 h-px w-full bg-linear-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700" />

            <Typewriter />

            <div
              className="mt-8 text-[4.5em] font-black"
              style={{
                fontFamily:
                  '"Savoye LET", "Snell Roundhand", "Segoe Script", "Gabriola", cursive',
              }}
            >
              Always Continue, Never break.
            </div>
          </Stack>
        </Stack>
      </Stack>
      <div
        className={cn(
          "h-dvh transition-all duration-300",
          "group-data-[scrolled=true]:h-[60svh]",
        )}
      ></div>
    </>
  );
}
