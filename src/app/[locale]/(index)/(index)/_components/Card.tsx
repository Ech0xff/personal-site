import Stack from "@/components/ui/Stack";

export default function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Stack y className="z-1 w-full">
      <h3 className="mb-4 flex items-center gap-2 font-bold text-xl">
        <Stack className="h-5 w-1 rounded-full bg-gray-600" />
        {title}
      </h3>
      {children}
    </Stack>
  );
}
