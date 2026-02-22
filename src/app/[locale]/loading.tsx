import Stack from "@/components/ui/Stack";

export default function Loading() {
  return (
    <Stack y className="fixed inset-0 z-1000">
      <div className="m-auto animate-pulse">
        <div className="text-lg font-bold tracking-[0.5em] text-gray-800 dark:text-white">
          LOADING
        </div>
      </div>
    </Stack>
  );
}
