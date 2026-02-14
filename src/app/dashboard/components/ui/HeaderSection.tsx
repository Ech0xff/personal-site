import StackX from "@/components/ui/StackX";

export default function HeaderSection({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <StackX className="items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
      </div>
      {children && <div>{children}</div>}
    </StackX>
  );
}
