"use client";

import { Layers, Plus, X } from "lucide-react";

import Button from "@/components/ui/Button";
import { useModal } from "@/components/ui/ModalProvider";
import Stack from "@/components/ui/Stack";

function ModalTestPanel({ depth }: { depth: number }) {
  const { close, closeAll, open } = useModal();
  const nextDepth = depth + 1;

  return (
    <Stack
      y
      className="min-h-72 w-[min(560px,calc(100vw-32px))] gap-5 rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
    >
      <Stack x className="items-center justify-between gap-4">
        <Stack x className="items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
            <Layers className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold text-xl text-zinc-950 dark:text-zinc-50">
              Modal Layer {depth}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Top layer should be the only interactive layer.
            </p>
          </div>
        </Stack>
        <button
          type="button"
          onClick={() => close()}
          className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          aria-label="Close top modal"
        >
          <X className="h-5 w-5" />
        </button>
      </Stack>

      <div className="flex flex-1 items-center rounded-lg border border-zinc-300 border-dashed p-4 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
        This panel is layer {depth}. Open another layer, then use Escape,
        backdrop click, or the close buttons to verify only the top layer
        closes.
      </div>

      <Stack x className="flex-wrap justify-end gap-2">
        <Button type="button" onClick={() => close()}>
          Close Top
        </Button>
        <Button type="button" onClick={closeAll}>
          Close All
        </Button>
        <Button
          type="button"
          onClick={() => open(<ModalTestPanel depth={nextDepth} />)}
        >
          <Plus className="h-4 w-4" />
          Open Layer {nextDepth}
        </Button>
      </Stack>
    </Stack>
  );
}

export default function ModalTestPage() {
  const { closeAll, isOpen, open } = useModal();

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col justify-center gap-6 px-4 py-16">
      <Stack y className="gap-3">
        <p className="font-medium text-blue-600 text-sm dark:text-blue-400">
          Modal stack test
        </p>
        <h1 className="font-bold text-4xl text-zinc-950 tracking-normal dark:text-zinc-50">
          Layered Modal Sandbox
        </h1>
        <p className="max-w-2xl text-base text-zinc-600 dark:text-zinc-300">
          Open several modal layers and verify the top backdrop covers the lower
          layers while close actions remove only the top layer.
        </p>
      </Stack>

      <Stack x className="flex-wrap gap-3">
        <Button
          type="button"
          onClick={() => open(<ModalTestPanel depth={1} />)}
        >
          <Plus className="h-4 w-4" />
          Open First Layer
        </Button>
        <Button type="button" onClick={closeAll} disabled={!isOpen}>
          Close All
        </Button>
      </Stack>
    </main>
  );
}
