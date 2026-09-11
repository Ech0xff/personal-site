"use client";

import { Layers, Plus, X } from "lucide-react";

import Button from "#components/ui/button.component";
import { useModal } from "#components/ui/modal-provider.component";
import Stack from "#components/ui/stack.component";

function ModalTestPanel({ depth }: { depth: number }) {
  const { close, closeAll, open } = useModal();
  const nextDepth = depth + 1;

  return (
    <Stack
      y
      className="min-h-72 w-[min(560px,calc(100vw-32px))] gap-5 rounded-xl border border-border-default bg-surface-panel p-6 shadow-2xl"
    >
      <Stack x className="items-center justify-between gap-4">
        <Stack x className="items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-info-bg text-info-text">
            <Layers className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              Modal Layer {depth}
            </h2>
            <p className="text-sm text-text-muted">
              Top layer should be the only interactive layer.
            </p>
          </div>
        </Stack>
        <button
          type="button"
          onClick={() => close()}
          className="rounded-md p-2 text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary"
          aria-label="Close top modal"
        >
          <X className="h-5 w-5" />
        </button>
      </Stack>
      <div className="flex flex-1 items-center rounded-lg border border-dashed border-border-strong p-4 text-sm text-text-secondary">
        This panel is layer {depth}. Open another layer, then use Escape,
        backdrop click, or the close buttons to verify only the top layer
        closes.
      </div>
      <Stack x className="flex-wrap justify-end gap-2">
        <Button onClick={() => close()}>Close Top</Button>
        <Button onClick={closeAll}>Close All</Button>
        <Button onClick={() => open(<ModalTestPanel depth={nextDepth} />)}>
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
        <p className="text-sm font-medium text-info-text">Modal stack test</p>
        <h1 className="text-4xl font-bold tracking-normal text-text-primary">
          Layered Modal Sandbox
        </h1>
        <p className="max-w-2xl text-base text-text-secondary">
          Open several modal layers and verify the top backdrop covers the lower
          layers while close actions remove only the top layer.
        </p>
      </Stack>
      <Stack x className="flex-wrap gap-3">
        <Button onClick={() => open(<ModalTestPanel depth={1} />)}>
          <Plus className="h-4 w-4" />
          Open First Layer
        </Button>
        <Button onClick={closeAll} disabled={!isOpen}>
          Close All
        </Button>
      </Stack>
    </main>
  );
}
