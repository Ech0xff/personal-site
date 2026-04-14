import Stack from "@/components/ui/Stack";

export default function Loading() {
  return (
    <Stack y className="fixed inset-0 z-1000">
      <div className="m-auto animate-pulse">
        <div className="font-bold text-gray-800 text-lg tracking-[0.5em] dark:text-white">
          LOADING
        </div>
      </div>
    </Stack>
  );
}
