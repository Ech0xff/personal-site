import Stack from "#components/ui/stack.component";

export default function Loading() {
  return (
    <Stack y className="fixed inset-0 z-(--layer-loading)">
      <div className="m-auto animate-pulse">
        <div className="text-lg font-bold tracking-[0.5em] text-text-primary">
          LOADING
        </div>
      </div>
    </Stack>
  );
}
