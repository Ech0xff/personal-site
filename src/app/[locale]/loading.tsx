export default function Loading() {
  return (
    <div className="bg-brand-gradient fixed inset-0 z-1000 flex flex-col items-center justify-center">
      <div className="animate-pulse">
        <div className="text-lg font-bold tracking-[0.5em] text-gray-800 dark:text-white">
          LOADING
        </div>
      </div>
    </div>
  );
}
