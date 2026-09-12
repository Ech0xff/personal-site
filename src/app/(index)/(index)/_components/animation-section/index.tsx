import Stack from "#components/ui/stack.component";
import { useDictionary } from "#dictionary";
import { cn } from "#lib/shared/utils";

import Typewriter from "./typewriter.component";

import "./index.scss";

function AnimatedGridBackground({
  smallGridSize = 30,
}: {
  smallGridSize?: number;
}) {
  const largeGridSize = smallGridSize * 8;
  const gridStyles: Record<string, string> = {
    "--small-size": `${smallGridSize}px`,
    "--large-size": `${largeGridSize}px`,
    "--grid-offset": `${largeGridSize}px`,
  };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="grid-background absolute inset-0" style={gridStyles} />
    </div>
  );
}

export default function AnimationSection() {
  const dictionary = useDictionary();
  return (
    <>
      <Stack
        y
        className={cn(
          "absolute inset-0 h-dvh w-full max-w-full snap-start items-center justify-center overflow-hidden transition-[height]",
          "duration-300 in-data-[scrolled=true]:h-[60svh]",
        )}
      >
        <AnimatedGridBackground />
        <Stack
          y
          className="relative flex-1 items-center justify-center text-[clamp(0.6rem,2vw,1.2rem)]"
        >
          <Stack y className="items-center">
            <h1 className="px-4 text-center font-serif text-[clamp(2.5rem,8vw,6rem)]">
              {dictionary.home.hero}
            </h1>
            <div className="my-2 h-px w-full bg-linear-to-r from-transparent via-surface-hover-strong to-transparent" />
            <Typewriter
              key={JSON.stringify(dictionary.home.typing)}
              texts={dictionary.home.typing}
            />
            <div className="mt-8 px-4 text-center font-handwriting text-[clamp(2rem,7vw,7rem)] leading-tight font-black">
              {dictionary.home.bio}
            </div>
          </Stack>
        </Stack>
      </Stack>
      <div
        className={cn(
          "h-dvh transition-[height] duration-300",
          "in-data-[scrolled=true]:h-[60svh]",
        )}
      ></div>
    </>
  );
}
